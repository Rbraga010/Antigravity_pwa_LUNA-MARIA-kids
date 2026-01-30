import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === 'POST') {
            // Create product
            const {
                name, description, price, oldPrice, old_price,
                image, image_url, stock, category,
                displayOrder, display_order, sizes, is_featured
            } = req.body;

            // Map and sanitize data
            const productData = {
                name,
                description,
                price: parseFloat(String(price || 0)),
                old_price: oldPrice !== undefined ? parseFloat(String(oldPrice)) : (old_price !== undefined ? parseFloat(String(old_price)) : null),
                image_url: image || image_url || '',
                stock: parseInt(String(stock || 0)),
                category: category || 'geral',
                display_order: displayOrder !== undefined ? parseInt(String(displayOrder)) : (display_order !== undefined ? parseInt(String(display_order)) : 0),
                sizes: sizes || [],
                is_featured: !!is_featured
            };

            const product = await prisma.product.create({
                data: productData
            });
            return res.status(201).json(product);
        }

        if (req.method === 'PATCH') {
            // Update product
            const { id, ...inputData } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'ID is required for update' });
            }

            // Map and sanitize update data
            const updateData: any = {};
            if (inputData.name !== undefined) updateData.name = inputData.name;
            if (inputData.description !== undefined) updateData.description = inputData.description;
            if (inputData.price !== undefined) updateData.price = parseFloat(String(inputData.price));
            if (inputData.oldPrice !== undefined) updateData.old_price = parseFloat(String(inputData.oldPrice));
            if (inputData.old_price !== undefined) updateData.old_price = parseFloat(String(inputData.old_price));
            if (inputData.image !== undefined) updateData.image_url = inputData.image;
            if (inputData.image_url !== undefined) updateData.image_url = inputData.image_url;
            if (inputData.stock !== undefined) updateData.stock = parseInt(String(inputData.stock));
            if (inputData.category !== undefined) updateData.category = inputData.category;
            if (inputData.displayOrder !== undefined) updateData.display_order = parseInt(String(inputData.displayOrder));
            if (inputData.display_order !== undefined) updateData.display_order = parseInt(String(inputData.display_order));
            if (inputData.sizes !== undefined) updateData.sizes = inputData.sizes;
            if (inputData.is_featured !== undefined) updateData.is_featured = !!inputData.is_featured;

            const product = await prisma.product.update({
                where: { id },
                data: updateData
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
