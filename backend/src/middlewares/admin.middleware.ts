import type { Response, NextFunction } from "express";
import prisma from "../prisma.js";

export const superAdminMiddleware = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { role: true }
        });

        if (!user || user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ message: "Acesso negado. Apenas Super Admin pode realizar esta ação." });
        }

        return next();
    } catch (error) {
        return res.status(500).json({ message: "Erro ao verificar permissão", error });
    }
};
