import { pool } from "../db/pool";

export const getTasksByUserPaginated = async (
  userId: number,
  limit: number,
  offset: number,
) => {
  const result = await pool.query(
    `
    SELECT *
    FROM tasks
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [userId, limit, offset],
  );

  return result.rows;
};
export const countTasksByUser = async (userId: number) => {
  const result = await pool.query(
    `
    SELECT COUNT(*) 
    FROM tasks 
    WHERE user_id = $1
    `,
    [userId],
  );

  return Number(result.rows[0].count);
};
