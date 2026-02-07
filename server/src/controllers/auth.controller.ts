import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";
import { JwtPayload } from "../types/auth";
import { AppError } from "../utils/appError"; // Import AppError ที่คุณสร้างไว้

/* ---------------- REGISTER ---------------- */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password, role } = req.body;

    // 1. Validation (ตรวจสอบความครบถ้วน)
    if (!email || !password) {
      return next(new AppError("กรุณากรอกข้อมูลให้ครบถ้วน", 400));
    }

    // 2. ตรวจสอบว่าอีเมลซ้ำไหม
    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (exists.rowCount) {
      return next(new AppError("อีเมลนี้ถูกใช้งานไปแล้ว", 400));
    }

    // 3. Hash รหัสผ่าน (ห้ามเก็บ Password ตัวตรงลง DB!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. บันทึกลง PostgreSQL
    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, hashedPassword, role || "user"],
    );

    // 5. ส่งคำตอบกลับ (ถ้าจะให้ Login เลย ก็ออก Token ส่งไปด้วยได้ครับ)
    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      user: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

//* ---------------- LOGIN (Updated) ---------------- */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("กรุณากรอกอีเมลและรหัสผ่าน", 400));
    }

    // 1. ค้นหา User
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    // 2. ตรวจสอบ User และ Password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError("อีเมลหรือรหัสผ่านไม่ถูกต้อง", 401));
    }

    // 3. สร้าง Payload และ Tokens
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );

    // 4. บันทึก Refresh Token ลง Database (Case-sensitive column)
    await pool.query('UPDATE users SET "refreshToken" = $1 WHERE id = $2', [
      refreshToken,
      user.id,
    ]);

    // 5. ส่ง Refresh Token ผ่าน HttpOnly Cookie (ปลอดภัยที่สุด)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Frontend อ่านค่านี้ไม่ได้ ป้องกัน XSS
      secure: true, // ใช้ HTTPS เฉพาะบน Production
      sameSite: "none", // ป้องกัน CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // อายุ 7 วัน (ตรงกับ JWT)
    });

    // 6. ส่ง Response กลับไปให้ React (Zustand รอรับ accessToken และ user)
    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

/* ---------------- REFRESH TOKEN (Updated) ---------------- */
export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // ✅ เปลี่ยนจาก req.body เป็น req.cookies
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new AppError("No refresh token provided", 401));
    }

    // 1. ตรวจสอบความถูกต้องของ Token (เบื้องต้น)
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as { userId: number };

    // 2. ตรวจสอบใน Database ว่า Token นี้ยังตรงกับที่เก็บไว้ไหม
    // (ใช้ "refreshToken" ฟันหนูคู่ตามชื่อ Column ใน DB ของคุณ)
    const result = await pool.query(
      'SELECT id, email, role FROM users WHERE id = $1 AND "refreshToken" = $2',
      [decoded.userId, refreshToken],
    );

    const user = result.rows[0];

    // ถ้าไม่เจอ user หรือ token ใน DB ไม่ตรงกัน (อาจจะโดน Logout ไปแล้ว)
    if (!user) {
      return next(new AppError("Invalid or expired refresh token", 403));
    }

    // 3. สร้าง Access Token ใบใหม่
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }, // อายุสั้นๆ เหมือนเดิม
    );

    // 4. ส่ง Access Token ใหม่กลับไป (ส่วน Refresh Token ยังอยู่ใน Cookie เดิม)
    res.json({
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    // ถ้า verify พลาด หรือหมดอายุ จะตกมาที่นี่
    next(new AppError("Refresh token is invalid or expired", 403));
  }
}
/* ---------------- LOGOUT (Updated) ---------------- */
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // 1. ลบ Refresh Token ใน Database ทิ้ง
      await pool.query(
        'UPDATE users SET "refreshToken" = NULL WHERE "refreshToken" = $1',
        [refreshToken],
      );
    }

    // 2. สั่ง Browser ให้ลบ Cookie (ชื่อต้องตรงกับตอนตั้งค่าใน Login)
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
}
