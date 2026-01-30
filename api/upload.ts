import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const body = req.body as HandleUploadBody;

        const jsonResponse = await handleUpload({
            body,
            request: req,
            onBeforeGenerateToken: async (pathname) => {
                // You can add auth/validation here
                console.log('📤 Generating token for:', pathname);
                return {
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                    maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                console.log('✅ Upload completed:', blob.url);
            },
        });

        return res.status(200).json(jsonResponse);
    } catch (error: any) {
        console.error('❌ UPLOAD ERROR:', error);
        return res.status(500).json({
            message: 'Error uploading image',
            error: error.message || String(error),
        });
    }
}
