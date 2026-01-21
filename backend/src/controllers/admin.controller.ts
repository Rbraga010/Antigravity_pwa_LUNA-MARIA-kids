import type { Request, Response } from "express";
import prisma from "../prisma.js";

// --- PRODUTOS ---

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, old_price, image_url, stock, category, display_order } = req.body;
        const product = await prisma.product.create({
            data: { name, description, price, old_price, image_url, stock, category, display_order: display_order || 0 }
        });
        return res.status(201).json(product);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar produto", error });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const product = await prisma.product.update({
            where: { id },
            data
        });
        return res.json(product);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar produto", error });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({ where: { id } });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: "Erro ao excluir produto", error });
    }
};

// --- CARROSSEL ---

export const getCarousels = async (req: Request, res: Response) => {
    try {
        const items = await prisma.carouselItem.findMany({ orderBy: { order: 'asc' } });
        return res.json(items);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar carrosséis", error });
    }
};

export const createCarouselItem = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const item = await prisma.carouselItem.create({ data });
        return res.status(201).json(item);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar item de carrossel", error });
    }
};

export const updateCarouselItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const item = await prisma.carouselItem.update({ where: { id }, data });
        return res.json(item);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar item de carrossel", error });
    }
};

export const deleteCarouselItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.carouselItem.delete({ where: { id } });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: "Erro ao excluir item de carrossel", error });
    }
};

// --- CONTEÚDO (NETFLIX STYLE) ---

export const getMaterials = async (req: Request, res: Response) => {
    try {
        const { section } = req.query;
        const items = await prisma.contentMaterial.findMany({
            where: section ? { section: section as any } : {},
            orderBy: { order: 'asc' }
        });
        return res.json(items);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar materiais", error });
    }
};

export const createMaterial = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const item = await prisma.contentMaterial.create({ data });
        return res.status(201).json(item);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar material", error });
    }
};

export const updateMaterial = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const item = await prisma.contentMaterial.update({ where: { id }, data });
        return res.json(item);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar material", error });
    }
};

export const deleteMaterial = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.contentMaterial.delete({ where: { id } });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: "Erro ao excluir material", error });
    }
};
