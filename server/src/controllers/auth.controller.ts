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
    const result = await pool.query(
      "SELECT id, email, password, role, status FROM users WHERE email = $1",
      [email],
    );
    const user = result.rows[0];

    // 2. ตรวจสอบ User และ Password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError("อีเมลหรือรหัสผ่านไม่ถูกต้อง", 401));
    }

    // 3. สร้าง Access Token เท่านั้น
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    // 4. ส่ง Response กลับไป
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
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new AppError("No refresh token provided", 401));
    }

    // ✅ ตรวจ refresh token ด้วย signature + exp เท่านั้น
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as { userId: number; email: string; role: string };

    // ✅ ออก access token ใหม่
    const newAccessToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    );

    res.json({
      accessToken: newAccessToken,
    });
  } catch (err) {
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
