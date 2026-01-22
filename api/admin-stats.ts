import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prisma = new PrismaClient();

  try {
    // Verificar token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'luna-maria-kids-secret-key-2026');
    
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Buscar estatísticas
    const [
      totalUsers,
      totalSubscribers,
      totalOrders,
      recentUsers,
      recentOrders
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { is_subscriber: true } }),
      prisma.order.count(),
      prisma.user.findMany({
        take: 10,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          is_subscriber: true,
          created_at: true
        }
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
    ]);

    return res.status(200).json({
      stats: {
        totalUsers,
        totalSubscribers,
        totalOrders,
        conversionRate: totalUsers > 0 ? ((totalSubscribers / totalUsers) * 100).toFixed(2) : 0
      },
      recentUsers,
      recentOrders
    });

  } catch (error: any) {
    console.error('Erro ao buscar stats:', error);
    return res.status(500).json({ 
      error: 'Erro ao buscar estatísticas',
      details: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
