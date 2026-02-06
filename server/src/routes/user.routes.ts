import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { checkRole } from "../middlewares/checkRole.middleware";

const router = Router();

router.get("/me", verifyToken, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

router.get("/admin", verifyToken, checkRole("admin"), (req, res) => {
  res.json({ message: "Admin only" });
});

export default router;
