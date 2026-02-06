import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any, // เปลี่ยนเป็น any ชั่วคราวเพื่อให้ดึง property statusCode ได้
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // 1. กำหนดค่า Default ถ้าไม่มีการระบุ Status มา ให้เป็น 500
  const statusCode = err.statusCode || 500;

  // 2. ปรับข้อความ Error (ถ้าเป็น 500 อาจจะไม่ควรบอกรายละเอียดลึกเกินไปใน Production)
  const message = statusCode === 500 ? "Internal Server Error" : err.message;

  console.error(`[${new Date().toISOString()}] ${err.stack}`);

  res.status(statusCode).json({
    status: "error",
    message: message,
    // 3. เพิ่ม Stack Trace เฉพาะตอน Development เพื่อช่วยให้เราหาบรรทัดที่พังง่ายขึ้น
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
