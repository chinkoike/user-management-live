import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth";
import { AppError } from "../utils/appError";

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // 1. ตรวจ header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new AppError("Authorization header missing or invalid format", 401),
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // 3. set req.user ก่อน
    req.user = payload;

    // 4. ค่อยเช็คสถานะ user
    if (req.user.status === "banned") {
      return next(new AppError("Account suspended", 403));
    }

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Token expired", 401));
    }

    return next(new AppError("Invalid token", 401));
  }
}
