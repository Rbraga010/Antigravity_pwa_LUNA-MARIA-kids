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
    // GET - Listar todos os produtos
    if (req.method === 'GET') {
      const products = await prisma.product.findMany({
        orderBy: { display_order: 'asc' }
      });
      return res.status(200).json(products);
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

    // POST - Criar novo produto
    if (req.method === 'POST') {
      const { name, description, price, old_price, image_url, stock, category, display_order } = req.body;

      const product = await prisma.product.create({
        data: {
          name,
          description: description || '',
          price,
          old_price: old_price || null,
          image_url,
          stock: stock || 0,
          category,
          display_order: display_order || 0
        }
      });

      return res.status(201).json(product);
    }

    // PUT - Atualizar produto
    if (req.method === 'PUT') {
      const { id, name, description, price, old_price, image_url, stock, category, display_order } = req.body;

      const product = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price,
          old_price: old_price || null,
          image_url,
          stock,
          category,
          display_order
        }
      });

      return res.status(200).json(product);
    }

    // DELETE - Deletar produto
    if (req.method === 'DELETE') {
      const { id } = req.body;

      await prisma.product.delete({
        where: { id }
      });

      return res.status(200).json({ message: 'Produto deletado' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error: any) {
    console.error('Erro na API de produtos:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar requisição',
      details: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
