import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { checkRole } from "../middlewares/checkRole.middleware";
import {
  adminCreateUser,
  adminOnly,
  changeUserRole,
  changeUserStatus,
  dashboardController,
} from "../controllers/dashboard.controller";
import { register } from "../controllers/auth.controller";
const router = Router();

router.get("/", auth, checkRole("admin"), dashboardController);
// routes/admin.routes.ts
router.patch("/:id/role", auth, checkRole("admin"), changeUserRole);
router.patch("/:id/status", auth, checkRole("admin"), changeUserStatus);
router.post("/user", auth, checkRole("admin"), adminCreateUser);

export default router;
