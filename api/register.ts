import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prisma = new PrismaClient();

  try {
    const { name, email, password, phone, numChildren, childrenDetails } = req.body;

    // Validar campos obrigatórios
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        num_children: numChildren || 0,
        children_details: childrenDetails || [],
        role: email === 'Lunamariakids_adm@lmkids.com' ? 'SUPER_ADMIN' : 'USER'
      }
    });

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'luna-maria-kids-secret-key-2026',
      { expiresIn: '7d' }
    );

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      user: userWithoutPassword,
      token
    });

  } catch (error: any) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ 
      error: 'Erro ao criar usuário',
      details: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
