import type { Request, Response } from "express";
import prisma from "../prisma.js";

// --- PRODUTOS ---

export const createProduct = async (req: Request, res: Response) => {
    try {
        const {
            name, description, price, oldPrice, old_price,
            image, image_url, stock, category,
            displayOrder, display_order, sizes, is_featured
        } = req.body;

        const product = await prisma.product.create({
            data: {
                name,
                description: description || '',
                price: parseFloat(String(price || 0)),
                old_price: oldPrice !== undefined ? parseFloat(String(oldPrice)) : (old_price !== undefined ? parseFloat(String(old_price)) : null),
                image_url: image || image_url || '',
                stock: stock !== undefined ? parseInt(String(stock)) : 0,
                category: category || 'geral',
                display_order: displayOrder !== undefined ? parseInt(String(displayOrder)) : (display_order !== undefined ? parseInt(String(display_order)) : 0),
                sizes: sizes || [],
                is_featured: is_featured || false
            }
        });
        return res.status(201).json(product);
    } catch (error) {
        console.error("Erro ao criar produto:", error);
        return res.status(500).json({ message: "Erro ao criar produto", error });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            name, description, price, oldPrice, old_price,
            image, image_url, stock, category,
            displayOrder, display_order, sizes, is_featured
        } = req.body;

        const product = await prisma.product.update({
            where: { id: id as string },
            data: {
                name,
                description,
                price: price !== undefined ? parseFloat(String(price)) : undefined,
                old_price: oldPrice !== undefined ? parseFloat(String(oldPrice)) : (old_price !== undefined ? parseFloat(String(old_price)) : undefined),
                image_url: (image !== undefined || image_url !== undefined) ? (image || image_url) : undefined,
                stock: stock !== undefined ? parseInt(String(stock)) : undefined,
                category,
                display_order: displayOrder !== undefined ? parseInt(String(displayOrder)) : (display_order !== undefined ? parseInt(String(display_order)) : undefined),
                sizes,
                is_featured: is_featured !== undefined ? is_featured : undefined
            }
        });
        return res.json(product);
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        return res.status(500).json({ message: "Erro ao atualizar produto", error });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({ where: { id: id as string } });
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
        const { image, image_url, title, subtitle, type, order } = req.body;
        const item = await prisma.carouselItem.create({
            data: {
                image_url: image || image_url || '',
                title: title || null,
                subtitle: subtitle || null,
                type,
                order: order || 0
            }
        });
        return res.status(201).json(item);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar item de carrossel", error });
    }
};

export const updateCarouselItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { image, image_url, title, subtitle, type, order } = req.body;
        const item = await prisma.carouselItem.update({
            where: { id: id as string },
            data: {
                image_url: image || image_url,
                title,
                subtitle,
                type,
                order
            }
        });
        return res.json(item);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar item de carrossel", error });
    }
};

export const deleteCarouselItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.carouselItem.delete({ where: { id: id as string } });
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
        const { title, description, type, url, thumbnail_url, image, image_url, section, order } = req.body;
        const item = await prisma.contentMaterial.create({
            data: {
                title,
                description: description || null,
                type,
                url,
                thumbnail_url: thumbnail_url || image || image_url || null,
                section,
                order: order || 0
            }
        });
        return res.status(201).json(item);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar material", error });
    }
};

export const updateMaterial = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, type, url, thumbnail_url, image, image_url, section, order } = req.body;
        const item = await prisma.contentMaterial.update({
            where: { id: id as string },
            data: {
                title,
                description,
                type,
                url,
                thumbnail_url: thumbnail_url !== undefined ? thumbnail_url : (image || image_url),
                section,
                order
            }
        });
        return res.json(item);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar material", error });
    }
};

export const deleteMaterial = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.contentMaterial.delete({ where: { id: id as string } });
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: "Erro ao excluir material", error });
    }
};

// --- USUÁRIOS ---

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                is_subscriber: true,
                created_at: true,
                _count: {
                    select: {
                        children: true,
                        orders: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        const usersWithLeadType = users.map((u: any) => {
            let leadType = 'Lead Cadastrado';
            if (u.is_subscriber) {
                leadType = 'Lead Assinante';
            } else if (u._count.orders > 0) {
                leadType = 'Lead Cliente';
            }
            return {
                ...u,
                leadType
            };
        });

        return res.json(usersWithLeadType);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar usuários", error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role, is_subscriber } = req.body;
        const user = await prisma.user.update({
            where: { id: id as string },
            data: { role, is_subscriber }
        });
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar usuário", error });
    }
};
