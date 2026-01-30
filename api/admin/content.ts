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
            const data = req.body;
            const item = await prisma.contentMaterial.create({ data });
            return res.status(201).json(item);
        }

        if (req.method === 'PATCH') {
            // Update material
            const { id, ...data } = req.body;
            const item = await prisma.contentMaterial.update({ where: { id }, data });
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
