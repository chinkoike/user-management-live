import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { pool } from "./db/pool";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import tasksRouters from "./routes/tasks.routes";
import dashboardRoute from "./routes/dashboard.route";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// 1. CORS Setup - ระบุที่อยู่ของ React และเปิด credentials
app.use(
  cors({
    origin: process.env.VITE_API_URL, // URL ฝั่ง Frontend
    credentials: true, // อนุญาตให้รับ-ส่ง Cookie และ Header
  }),
);

// 2. Middlewares - วางไว้ก่อน Routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ทำหน้าที่แกะ Cookie ออกจาก Request

// 3. Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", tasksRouters);
app.use("/dashboard", dashboardRoute);

// 4. Test & Health Check
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "DB Connection failed" });
  }
});

// 5. Error Handler - ต้องวางไว้ล่างสุดเสมอ
app.use(errorHandler);

// 6. Server Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    await pool.query("SELECT 1");
    console.log(`✅ DB connected & Server running on port ${PORT}`);
  } catch (e) {
    console.error("❌ DB error", e);
  }
});
