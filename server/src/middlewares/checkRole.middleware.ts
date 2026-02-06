import { Request, Response, NextFunction } from "express";
import { Role } from "../types/auth.js";

export function checkRole(role: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
