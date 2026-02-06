import { NextFunction, Request, Response } from "express";
import { pool } from "../db/pool";

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

export const changeUserRole = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const { role } = req.body;

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
