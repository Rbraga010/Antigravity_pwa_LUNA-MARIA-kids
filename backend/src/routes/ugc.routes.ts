import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { superAdminMiddleware } from "../middlewares/admin.middleware.js";

const router = Router();

// Public routes
router.get("/", adminController.getUGCItems);

// Protected admin routes
router.post("/", authMiddleware, superAdminMiddleware, adminController.createUGCItem);
router.put("/:id", authMiddleware, superAdminMiddleware, adminController.updateUGCItem);
router.delete("/:id", authMiddleware, superAdminMiddleware, adminController.deleteUGCItem);

export default router;
