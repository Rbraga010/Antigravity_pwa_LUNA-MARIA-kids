import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'luna-maria-kids-secret-key-2026');
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                is_subscriber: true,
                created_at: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error('❌ AUTH ME ERROR:', error);
        return res.status(401).json({ message: 'Sessão inválida ou expirada' });
    } finally {
        await prisma.$disconnect();
    }
}
