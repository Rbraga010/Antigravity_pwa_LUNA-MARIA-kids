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
    // GET - Listar todos os materiais
    if (req.method === 'GET') {
      const materials = await prisma.contentMaterial.findMany({
        orderBy: { order: 'asc' }
      });

      // Já retorna no formato correto (thumbnail_url, url, etc)
      return res.status(200).json(materials);
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

    // POST - Criar novo material
    if (req.method === 'POST') {
      const { title, description, type, url, image, image_url, thumbnail_url, section, order } = req.body;

      const material = await prisma.contentMaterial.create({
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

      return res.status(201).json(material);
    }

    // PUT - Atualizar material
    if (req.method === 'PUT') {
      const { id, title, description, type, url, image, image_url, thumbnail_url, section, order } = req.body;

      const material = await prisma.contentMaterial.update({
        where: { id },
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

      return res.status(200).json(material);
    }

    // DELETE - Deletar material
    if (req.method === 'DELETE') {
      const { id } = req.body;

      await prisma.contentMaterial.delete({
        where: { id }
      });

      return res.status(200).json({ message: 'Material deletado' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error: any) {
    console.error('Erro na API de materials:', error);
    return res.status(500).json({
      error: 'Erro ao processar requisição',
      details: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
