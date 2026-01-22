import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const prisma = new PrismaClient();

  try {
    // GET - Listar todos os banners
    if (req.method === 'GET') {
      const carousels = await prisma.carouselItem.findMany({
        orderBy: { order: 'asc' }
      });
      return res.status(200).json(carousels);
    }

    // Verificar autenticação para operações de escrita
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'luna-maria-kids-secret-key-2026');
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // POST - Criar novo banner
    if (req.method === 'POST') {
      const { image_url, title, subtitle, type, order } = req.body;

      const carousel = await prisma.carouselItem.create({
        data: {
          image_url,
          title: title || null,
          subtitle: subtitle || null,
          type,
          order: order || 0
        }
      });

      return res.status(201).json(carousel);
    }

    // PUT - Atualizar banner
    if (req.method === 'PUT') {
      const { id, image_url, title, subtitle, type, order } = req.body;

      const carousel = await prisma.carouselItem.update({
        where: { id },
        data: {
          image_url,
          title,
          subtitle,
          type,
          order
        }
      });

      return res.status(200).json(carousel);
    }

    // DELETE - Deletar banner
    if (req.method === 'DELETE') {
      const { id } = req.body;

      await prisma.carouselItem.delete({
        where: { id }
      });

      return res.status(200).json({ message: 'Banner deletado' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error: any) {
    console.error('Erro na API de carousels:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar requisição',
      details: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
