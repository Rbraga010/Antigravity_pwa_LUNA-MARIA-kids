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

  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  } finally {
    await prisma.$disconnect();
  }
}
