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

      // Transformar para formato do frontend
      const transformed = products.map(p => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price.toString()),
        oldPrice: p.old_price ? parseFloat(p.old_price.toString()) : undefined,
        image: p.image_url,
        category: p.category,
        description: p.description,
        displayOrder: p.display_order,
        sizes: p.sizes || []
      }));

      return res.status(200).json(transformed);
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
      const { name, description, price, old_price, image_url, stock, category, display_order, sizes, is_featured } = req.body;

      const product = await prisma.product.create({
        data: {
          name,
          description: description || '',
          price,
          old_price: old_price || null,
          image_url,
          stock: stock || 0,
          category,
          display_order: display_order || 0,
          sizes: sizes || [],
          is_featured: is_featured || false
        }
      });

      // Transformar para formato do frontend
      const transformed = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price.toString()),
        oldPrice: product.old_price ? parseFloat(product.old_price.toString()) : undefined,
        image: product.image_url,
        category: product.category,
        description: product.description,
        displayOrder: product.display_order,
        sizes: product.sizes || []
      };

      return res.status(201).json(transformed);
    }

    // PUT ou PATCH - Atualizar produto
    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { id, name, description, price, old_price, image_url, stock, category, display_order, sizes, is_featured } = req.body;
      const productId = id || req.query.id;

      if (!productId) {
        return res.status(400).json({ error: 'ID do produto não fornecido' });
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = price;
      if (old_price !== undefined) updateData.old_price = old_price;
      if (image_url !== undefined) updateData.image_url = image_url;
      if (stock !== undefined) updateData.stock = stock;
      if (category !== undefined) updateData.category = category;
      if (display_order !== undefined) updateData.display_order = display_order;
      if (sizes !== undefined) updateData.sizes = sizes;
      if (is_featured !== undefined) updateData.is_featured = is_featured;

      const product = await prisma.product.update({
        where: { id: productId as string },
        data: updateData
      });

      // Transformar resposta
      const transformed = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price.toString()),
        oldPrice: product.old_price ? parseFloat(product.old_price.toString()) : undefined,
        image: product.image_url,
        category: product.category,
        description: product.description,
        displayOrder: product.display_order,
        sizes: product.sizes || []
      };

      return res.status(200).json(transformed);
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
