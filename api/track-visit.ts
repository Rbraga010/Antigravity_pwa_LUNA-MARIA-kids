import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type } = req.body; // 'SHOP', 'CLUB', 'HOME'
    if (!type) {
        return res.status(400).json({ error: 'Type is required' });
    }

    const prisma = new PrismaClient();
    try {
        await (prisma as any).siteVisit.create({
            data: { type }
        });
        return res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error tracking visit:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
