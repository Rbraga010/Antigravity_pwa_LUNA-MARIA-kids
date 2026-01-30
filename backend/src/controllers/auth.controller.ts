import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export const register = async (req: Request, res: Response) => {
    try {
        let { name, email, password, phone, numChildren, childrenDetails } = req.body;
        name = name?.trim();
        email = email?.trim();
        password = password?.trim();
        console.log("RECEIVED REGISTER DATA:", { name, email, phone, numChildren, childrenDetails }); // DEBUG LOG

        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "E-mail já cadastrado" });
        }

        const password_hash = await bcrypt.hash(password, 10);

        // REGRA ESPECIAL: Email específico vira SUPER_ADMIN automaticamente
        const role = email === "Lunamariakids_adm@lmkids.com" ? "SUPER_ADMIN" : "USER";

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password_hash,
                phone,
                num_children: numChildren,
                role,
                children: {
                    create: childrenDetails?.map((child: any) => {
                        const birthDate = child.birthDate ? new Date(child.birthDate) : null;
                        // Validate date to avoid DB errors
                        if (!birthDate || isNaN(birthDate.getTime())) {
                            return undefined; // Skip invalid dates
                        }
                        return {
                            name: child.name,
                            birth_date: birthDate,
                            gender: child.gender
                        };
                    }).filter(Boolean) // Filter out undefined entries
                }
            },
            include: { children: true }
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

        return res.status(201).json({
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
        console.error("REGISTRATION ERROR:", error); // DEBUG LOG
        return res.status(500).json({ message: "Erro ao registrar usuário", error: String(error) });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        console.log('🔐 Login attempt received:', req.body);
        let { email, password } = req.body;
        email = email?.trim();
        password = password?.trim();
        console.log('📧 Email after trim:', email);

        const user = await prisma.user.findUnique({ where: { email } });
        console.log('👤 User found:', user ? `${user.email} (${user.role})` : 'NOT FOUND');

        if (!user) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }

        console.log('🔑 Comparing password...');
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        console.log('✅ Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
        console.log('🎫 Token generated successfully');

        return res.json({
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
        return res.status(500).json({ message: "Erro ao fazer login", error: String(error) });
    }
};

export const me = async (req: any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true, role: true, is_subscriber: true, created_at: true },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar perfil", error });
    }
};
