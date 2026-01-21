import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, numChildren, childrenDetails } = req.body;

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
                    create: childrenDetails?.map((child: any) => ({
                        name: child.name,
                        birth_date: new Date(child.birthDate),
                        gender: child.gender
                    }))
                }
            },
            include: { children: true }
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

        return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao registrar usuário", error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

        return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao fazer login", error });
    }
};

export const me = async (req: any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true, role: true, created_at: true },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar perfil", error });
    }
};
