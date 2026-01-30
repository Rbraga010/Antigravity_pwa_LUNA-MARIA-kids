import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'luna-maria-kids-secret-key-2026');
        const admin = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!admin || admin.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // GET - Listar usuários
        if (req.method === 'GET') {
            const users = await prisma.user.findMany({
                orderBy: { created_at: 'desc' },
                include: {
                    _count: { select: { orders: true } }
                }
            });
            return res.status(200).json(users.map(u => ({
                ...u,
                orderCount: (u as any)._count?.orders || 0
            })));
        }

        // DELETE - Remover usuário
        if (req.method === 'DELETE') {
            const { id } = req.body || req.query;
            if (!id) return res.status(400).json({ error: 'ID required' });

            await prisma.user.delete({ where: { id: id as string } });
            return res.status(200).json({ message: 'User deleted' });
        }

        // PATCH - Atualizar usuário
        if (req.method === 'PATCH') {
            const { id, is_subscriber, role } = req.body;
            if (!id) return res.status(400).json({ error: 'ID required' });

            const updated = await prisma.user.update({
                where: { id },
                data: { is_subscriber, role }
            });
            return res.status(200).json(updated);
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('❌ ADMIN USERS ERROR:', error);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
}
