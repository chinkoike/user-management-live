import { NextFunction, Request, Response } from "express";
import { pool } from "../db/pool";
import { AppError } from "../utils/appError";
import bcrypt from "bcrypt";

export const dashboardController = async (req: Request, res: Response) => {
  try {
    // 🔐 role check
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 📊 stats
    const usersCountResult = await pool.query("SELECT COUNT(*) FROM users");
    const tasksCountResult = await pool.query("SELECT COUNT(*) FROM tasks");
    const pendingTasksResult = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE completed = false",
    );

    // 👥 users list
    const usersResult = await pool.query(
      `
      SELECT id, email, role, created_at AS "createdAt"
      FROM users
      ORDER BY created_at DESC
      LIMIT 10
      `,
    );

    res.json({
      stats: {
        users: Number(usersCountResult.rows[0].count),
        tasks: Number(tasksCountResult.rows[0].count),
        pendingTasks: Number(pendingTasksResult.rows[0].count),
      },
      admin: {
        id: req.user.userId,
        role: req.user.role,
      },
      users: usersResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
// Change user role
export const changeUserRole = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const { role } = req.body;
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  if (req.user.userId === userId) {
    return res.status(400).json({ message: "Cannot change your own role" });
  }

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET role = $1
      WHERE id = $2
      RETURNING id, email, role, created_at AS "createdAt"
      `,
      [role, userId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to change role" });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};
// Change user status
export const changeUserStatus = async (req: Request, res: Response) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  const userId = Number(req.params.id);
  const { status } = req.body;

  if (!["active", "banned"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  if (req.user.userId === userId) {
    return res.status(400).json({ message: "Cannot ban yourself" });
  }

  const result = await pool.query(
    `
    UPDATE users
    SET status = $1
    WHERE id = $2
    RETURNING id, email, role, status
    `,
    [status, userId],
  );

  res.json(result.rows[0]);
};
// create user
export async function adminCreateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      throw new AppError("ข้อมูลไม่ครบ", 400);
    }

    // ✅ validate role
    if (!["user", "admin"].includes(role)) {
      throw new AppError("Invalid role", 400);
    }

    // ✅ เช็ค email ซ้ำ
    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (exists.rowCount) {
      throw new AppError("อีเมลนี้ถูกใช้งานไปแล้ว", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, hashedPassword, role],
    );

    res.status(201).json({
      message: "สร้างผู้ใช้สำเร็จ",
      user: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}
