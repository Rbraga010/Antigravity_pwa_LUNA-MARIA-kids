import type { Response } from "express";
import prisma from "../prisma.js";
import { generateTryOn } from "../services/gemini.service.js";

export const generate = async (req: any, res: Response) => {
    try {
        const { image, productId } = req.body;
        const userId = req.userId;

        // 1. Verificar Assinatura Ativa
        const subscription = await prisma.subscription.findFirst({
            where: { user_id: userId, status: "ativa" },
        });

        if (!subscription) {
            return res.status(403).json({ message: "Assinatura ativa necessária para usar o Provador Inteligente" });
        }

        // 2. Verificar Limite Mensal (máx 3 simulações)
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const usageCount = await prisma.tryOnLog.count({
            where: {
                user_id: userId,
                created_at: {
                    gte: firstDayOfMonth,
                },
            },
        });

        if (usageCount >= 3) {
            return res.status(429).json({ message: "Limite mensal de 3 simulações atingido" });
        }

        // 3. Buscar Produto
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }

        // 4. Chamar Gemini
        const generatedImageUrl = await generateTryOn(image, product.image_url);

        // 5. Registrar Uso
        await prisma.tryOnLog.create({
            data: {
                user_id: userId,
                product_id: productId,
            },
        });

        return res.json({ imageUrl: generatedImageUrl });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao processar provador", error });
    }
};

export const getUsage = async (req: any, res: Response) => {
    try {
        const userId = req.userId;
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const usageCount = await prisma.tryOnLog.count({
            where: {
                user_id: userId,
                created_at: {
                    gte: firstDayOfMonth,
                },
            },
        });

        return res.json({ usageCount, limit: 3 });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar uso", error });
    }
};
