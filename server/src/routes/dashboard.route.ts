import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/checkRole.middleware";
import {
  adminOnly,
  changeUserRole,
  changeUserStatus,
  dashboardController,
} from "../controllers/dashboard.controller";
const router = Router();

router.get("/", auth, checkRole("admin"), dashboardController);
// routes/admin.routes.ts
router.patch("/:id/role", auth, adminOnly, changeUserRole);
router.patch("/:id/status", auth, adminOnly, changeUserStatus);

export default router;
