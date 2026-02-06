import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import * as taskController from "../controllers/task.controller";

const router = Router();

// GET /tasks
router.get("/", auth, taskController.getTasks);

// POST /tasks
router.post("/", auth, taskController.createTask);

// PUT /tasks/:id
router.put("/:id", auth, taskController.updateTask);

// DELETE /tasks/:id
router.delete("/:id", auth, taskController.deleteTask);

export default router;
