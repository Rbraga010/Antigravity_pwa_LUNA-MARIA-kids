import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === 'GET') {
            // Get all carousels
            const items = await prisma.carouselItem.findMany({ orderBy: { order: 'asc' } });
            return res.json(items);
        }

        if (req.method === 'POST') {
            // Create carousel item
            const data = req.body;
            const item = await prisma.carouselItem.create({ data });
            return res.status(201).json(item);
        }

        if (req.method === 'PATCH') {
            // Update carousel item
            const { id, ...data } = req.body;
            const item = await prisma.carouselItem.update({ where: { id }, data });
            return res.json(item);
        }

        if (req.method === 'DELETE') {
            // Delete carousel item
            const { id } = req.body;
            await prisma.carouselItem.delete({ where: { id } });
            return res.status(204).send('');
        }

        return res.status(405).json({ message: 'Method not allowed' });

    } catch (error: any) {
        console.error('❌ Carousel Error:', error);
        return res.status(500).json({
            message: 'Error processing carousel request',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
}
