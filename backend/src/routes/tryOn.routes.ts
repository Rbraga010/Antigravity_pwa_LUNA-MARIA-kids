import { Router } from "express";
import { generate, getUsage } from "../controllers/tryOn.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/generate", authMiddleware, generate);
router.get("/usage", authMiddleware, getUsage);

export default router;
