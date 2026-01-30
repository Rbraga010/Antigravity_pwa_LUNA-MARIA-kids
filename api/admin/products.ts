import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === 'POST') {
            // Create product
            const { name, description, price, old_price, image_url, stock, category, display_order, sizes } = req.body;
            const product = await prisma.product.create({
                data: {
                    name,
                    description,
                    price,
                    old_price,
                    image_url,
                    stock: stock !== undefined ? stock : 0,
                    category,
                    display_order: display_order || 0,
                    sizes: sizes || []
                }
            });
            return res.status(201).json(product);
        }

        if (req.method === 'PATCH') {
            // Update product
            const { id, ...data } = req.body;
            const product = await prisma.product.update({
                where: { id },
                data
            });
            return res.json(product);
        }

        if (req.method === 'DELETE') {
            // Delete product
            const { id } = req.body;
            await prisma.product.delete({ where: { id } });
            return res.status(204).send('');
        }

        return res.status(405).json({ message: 'Method not allowed' });

    } catch (error: any) {
        console.error('❌ Product Error:', error);
        return res.status(500).json({
            message: 'Error processing product request',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
}
