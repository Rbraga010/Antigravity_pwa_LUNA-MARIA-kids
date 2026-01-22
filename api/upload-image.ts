import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Imagem não fornecida' });
    }

    // Remover prefixo data:image/...;base64,
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    // Upload para ImgBB (API pública gratuita)
    const formData = new URLSearchParams();
    formData.append('image', base64Data);

    const response = await fetch('https://api.imgbb.com/1/upload?key=d0bf9a3b8f8c8c8c8c8c8c8c8c8c8c8c', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Falha no upload');
    }

    const data = await response.json();
    
    return res.status(200).json({
      url: data.data.url,
      display_url: data.data.display_url,
      delete_url: data.data.delete_url
    });

  } catch (error: any) {
    console.error('Erro no upload:', error);
    return res.status(500).json({ error: 'Erro ao fazer upload da imagem', details: error.message });
  }
}
