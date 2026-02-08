import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth";
import { AppError } from "../utils/appError"; // ใช้ AppError ที่คุณมี

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // 1. ตรวจสอบเบื้องต้นว่ามี Header และขึ้นต้นด้วย Bearer หรือไม่
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new AppError("Authorization header missing or invalid format", 401),
    );
  }
  if (req.user.status === "banned") {
    return res.status(403).json({ message: "Account suspended" });
  }
  const token = authHeader.split(" ")[1];

  try {
    // 2. ตรวจสอบความถูกต้องของ Access Token
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // 3. เก็บข้อมูลลง req.user
    // (อย่าลืมทำไฟล์ src/types/express.d.ts เพื่อขยายความสามารถของ Request)
    req.user = payload;

    next();
  } catch (err: any) {
    // 4. แยกแยะ Error เพื่อให้ Axios Interceptor ฝั่ง React รู้ว่าต้อง Refresh Token
    if (err.name === "TokenExpiredError") {
      // สำคัญมาก! ต้องส่ง 401 เพื่อให้ Interceptor ทำงาน
      return next(new AppError("Token expired", 401));
    }

    return next(new AppError("Invalid token", 401));
  }
}
