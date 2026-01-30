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
            const { image_url, image, title, subtitle, type, order } = req.body;
            const item = await prisma.carouselItem.create({
                data: {
                    image_url: image_url || image || '',
                    title: title || '',
                    subtitle: subtitle || '',
                    type: type || 'TOP',
                    order: parseInt(String(order || 0))
                }
            });
            return res.status(201).json(item);
        }

        if (req.method === 'PATCH') {
            // Update carousel item
            const { id, ...inputData } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'ID is required' });
            }

            const updateData: any = {};
            if (inputData.image_url !== undefined) updateData.image_url = inputData.image_url;
            if (inputData.image !== undefined) updateData.image_url = inputData.image;
            if (inputData.title !== undefined) updateData.title = inputData.title;
            if (inputData.subtitle !== undefined) updateData.subtitle = inputData.subtitle;
            if (inputData.type !== undefined) updateData.type = inputData.type;
            if (inputData.order !== undefined) updateData.order = parseInt(String(inputData.order));

            const item = await prisma.carouselItem.update({ where: { id }, data: updateData });
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
