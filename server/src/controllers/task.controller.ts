import { Request, Response, NextFunction } from "express";
import { pool } from "../db/pool";
import * as taskModel from "../models/task.model";
// GET /tasks
export const getTasks = async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const page = Number(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    taskModel.getTasksByUserPaginated(userId, limit, offset),
    taskModel.countTasksByUser(userId),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    tasks,
    page,
    totalPages,
  });
};

// POST /tasks
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title } = req.body;
    if (!title) {
      const err: any = new Error("Title required");
      err.statusCode = 400;
      return next(err);
    }

    const { rows } = await pool.query(
      `INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *`,
      [title, req.user.userId],
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// PUT /tasks/:id
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, completed } = req.body;

    const { rowCount, rows } = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           completed = COALESCE($2, completed)
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, completed, req.params.id, req.user.userId],
    );

    if (rowCount === 0) {
      const error: any = new Error("Task not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// DELETE /tasks/:id
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.userId],
    );

    if (rowCount === 0) {
      const error: any = new Error("Task not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};
