import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === 'GET') {
            // Get all materials  
            const items = await prisma.contentMaterial.findMany({ orderBy: { created_at: 'desc' } });
            return res.json(items);
        }

        if (req.method === 'POST') {
            // Create material
            const { title, description, type, url, thumbnail_url, thumbnail, section, order } = req.body;
            const item = await prisma.contentMaterial.create({
                data: {
                    title: title || 'Sem Título',
                    description: description || '',
                    type: type || 'IMAGE',
                    url: url || '',
                    thumbnail_url: thumbnail_url || thumbnail || '',
                    section: section || 'KIDS',
                    order: parseInt(String(order || 0))
                }
            });
            return res.status(201).json(item);
        }

        if (req.method === 'PATCH') {
            // Update material
            const { id, ...inputData } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'ID is required' });
            }

            const updateData: any = {};
            if (inputData.title !== undefined) updateData.title = inputData.title;
            if (inputData.description !== undefined) updateData.description = inputData.description;
            if (inputData.type !== undefined) updateData.type = inputData.type;
            if (inputData.url !== undefined) updateData.url = inputData.url;
            if (inputData.thumbnail_url !== undefined) updateData.thumbnail_url = inputData.thumbnail_url;
            if (inputData.thumbnail !== undefined) updateData.thumbnail_url = inputData.thumbnail;
            if (inputData.section !== undefined) updateData.section = inputData.section;
            if (inputData.order !== undefined) updateData.order = parseInt(String(inputData.order));

            const item = await prisma.contentMaterial.update({ where: { id }, data: updateData });
            return res.json(item);
        }

        if (req.method === 'DELETE') {
            // Delete material
            const { id } = req.body;
            await prisma.contentMaterial.delete({ where: { id } });
            return res.status(204).send('');
        }

        return res.status(405).json({ message: 'Method not allowed' });

    } catch (error: any) {
        console.error('❌ Content Error:', error);
        return res.status(500).json({
            message: 'Error processing content request',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
}
