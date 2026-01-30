import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { superAdminMiddleware } from "../middlewares/admin.middleware.js";
import {
    createProduct, updateProduct, deleteProduct,
    getCarousels, createCarouselItem, updateCarouselItem, deleteCarouselItem,
    getMaterials, createMaterial, updateMaterial, deleteMaterial,
    getUsers, updateUser, deleteUser
} from "../controllers/admin.controller.js";

const router = Router();

// Todas as rotas abaixo requerem login E ser SUPER_ADMIN
router.use(authMiddleware, superAdminMiddleware);

// Usuários
router.get("/users", getUsers);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Produtos
router.post("/products", createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Carroséis
router.get("/carousels", getCarousels);
router.post("/carousels", createCarouselItem);
router.patch("/carousels/:id", updateCarouselItem);
router.delete("/carousels/:id", deleteCarouselItem);

// Materiais (Kids/Família)
router.get("/materials", getMaterials);
router.post("/materials", createMaterial);
router.patch("/materials/:id", updateMaterial);
router.delete("/materials/:id", deleteMaterial);

export default router;
