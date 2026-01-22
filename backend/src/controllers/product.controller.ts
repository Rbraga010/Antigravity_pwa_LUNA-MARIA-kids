import type { Request, Response } from "express";
import prisma from "../prisma.js";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const category = req.query.category as string | undefined;

        const products = await prisma.product.findMany({
            where: category ? { category } : {},
        });

        return res.json(products);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar produtos", error });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id: String(id) },
        });

        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }

        return res.json(product);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar produto", error });
    }
};
