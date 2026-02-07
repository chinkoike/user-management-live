import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

// ใช้ URL จาก .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // สำหรับเชื่อมต่อจาก localhost ไม่จำเป็นต้องใช้ SSL ก็ได้ครับ
  ssl: false,
});

export { pool };
