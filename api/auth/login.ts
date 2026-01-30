import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔐 Login attempt received:', req.body);
    let { email, password } = req.body;

    // Trim inputs to prevent whitespace issues
    email = email?.trim();
    password = password?.trim();
    console.log('📧 Email after trim:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });
    console.log('👤 User found:', user ? `${user.email} (${user.role})` : 'NOT FOUND');

    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    console.log('🔑 Comparing password...');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('✅ Password valid:', isValidPassword);

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'luna-maria-kids-secret-key-2026',
      { expiresIn: '7d' }
    );
    console.log('🎫 Token generated successfully');

    // Retornar usuário sem senha
    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_subscriber: user.is_subscriber
      },
      token
    });

  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);
    return res.status(500).json({ message: 'Erro ao fazer login', error: String(error) });
  } finally {
    await prisma.$disconnect();
  }
}
