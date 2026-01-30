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
        console.log('📤 Upload request received');
        const { image, filename } = req.body;

        if (!image) {
            console.log('❌ No image in request body');
            return res.status(400).json({ message: 'No image provided' });
        }

        console.log('📷 Image received, converting to buffer...');

        // Remove base64 prefix if present
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        console.log(`📏 Buffer size: ${buffer.length} bytes`);

        // Generate unique filename
        const timestamp = Date.now();
        const finalFilename = `luna-kids/${filename || `image-${timestamp}.png`}`;

        console.log(`📝 Uploading to: ${finalFilename}`);

        // Upload to Vercel Blob (simplified like docs example)
        const blob = await put(finalFilename, buffer, {
            access: 'public',
        });

        console.log(`✅ Upload successful: ${blob.url}`);

        return res.status(200).json({
            message: 'Image uploaded successfully',
            url: blob.url
        });

    } catch (error: any) {
        console.error('❌ UPLOAD ERROR:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        return res.status(500).json({
            message: 'Error uploading image',
            error: error.message || String(error),
            errorName: error.name,
            errorDetails: error.toString()
        });
    }
}
