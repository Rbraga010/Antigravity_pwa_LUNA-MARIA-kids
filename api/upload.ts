import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { image, filename } = req.body;

        if (!image) {
            return res.status(400).json({ message: 'No image provided' });
        }

        // Remove base64 prefix if present
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Generate unique filename
        const timestamp = Date.now();
        const finalFilename = filename || `image-${timestamp}.png`;

        // Upload to Vercel Blob
        const blob = await put(finalFilename, buffer, {
            access: 'public',
            contentType: 'image/png',
        });

        return res.status(200).json({
            message: 'Image uploaded successfully',
            url: blob.url
        });

    } catch (error) {
        console.error('❌ UPLOAD ERROR:', error);
        return res.status(500).json({
            message: 'Error uploading image',
            error: String(error)
        });
    }
}
