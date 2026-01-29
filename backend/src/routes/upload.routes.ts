import { Router } from "express";
import { upload, uploadImage } from "../controllers/upload.controller.js";

const router = Router();

// Upload endpoint: POST /api/upload
router.post("/", upload.single('image'), uploadImage);

export default router;
