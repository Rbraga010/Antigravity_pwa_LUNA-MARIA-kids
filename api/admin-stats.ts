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
      shopVisits,
      clubVisits,
      allOrders,
      allUsersData,
      recentUsers,
      recentOrders
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { is_subscriber: true } }),
      prisma.order.count(),
      (prisma as any).siteVisit.count({ where: { type: 'SHOP' } }),
      (prisma as any).siteVisit.count({ where: { type: 'CLUB' } }),
      prisma.order.findMany(),
      prisma.user.findMany({
        include: {
          orders: { select: { id: true } }
        }
      }),
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

    // Total Faturamento: Total de pedidos finalizados
    let totalRevenue = 0;
    allOrders.forEach((o: any) => {
      totalRevenue += Number(o.total_amount);
    });

    // Categorizar usuários
    const usersWithCategory = allUsersData.map((u: any) => {
      const hasOrders = u.orders.length > 0;
      const isSub = u.is_subscriber;
      let category = 'Curte';
      if (hasOrders && isSub) category = 'Ama';
      else if (hasOrders || isSub) category = 'Adora';

      return {
        ...u,
        orderCount: u.orders.length,
        categoryDisplay: category
      };
    });

    return res.status(200).json({
      stats: {
        totalUsers,
        totalSubscribers,
        totalOrders,
        shopVisits,
        clubVisits,
        totalRevenue,
        shopConversion: shopVisits > 0 ? ((totalOrders / shopVisits) * 100).toFixed(2) : 0,
        clubConversion: clubVisits > 0 ? ((totalSubscribers / clubVisits) * 100).toFixed(2) : 0,
        conversionRate: totalUsers > 0 ? ((totalSubscribers / totalUsers) * 100).toFixed(2) : 0
      },
      usersCategorized: usersWithCategory,
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
