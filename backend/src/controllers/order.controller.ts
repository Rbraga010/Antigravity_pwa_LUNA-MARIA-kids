import type { Request, Response } from "express";
import prisma from "../prisma.js";

export const createOrder = async (req: any, res: Response) => {
    try {
        const { items, total_amount, shipping_address } = req.body;
        const userId = req.userId;

        const order = await prisma.order.create({
            data: {
                user_id: userId,
                items,
                total_amount,
                shipping_address,
                status: "processando",
            },
        });

        return res.status(201).json(order);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao criar pedido", error });
    }
};

export const getUserOrders = async (req: any, res: Response) => {
    try {
        const userId = req.userId;

        const orders = await prisma.order.findMany({
            where: { user_id: userId },
            orderBy: { created_at: "desc" },
        });

        return res.json(orders);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar pedidos", error });
    }
};
