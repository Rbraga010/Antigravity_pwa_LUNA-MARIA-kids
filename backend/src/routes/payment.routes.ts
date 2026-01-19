import { Router } from "express";
import { createSubscription, webhook } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/subscribe", authMiddleware, createSubscription);
router.post("/webhook", webhook);

export default router;
