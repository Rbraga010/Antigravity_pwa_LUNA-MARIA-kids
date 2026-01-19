import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

interface TokenPayload {
    userId: string;
}

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
        return res.status(401).json({ message: "Erro no token" });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ message: "Token malformatado" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        req.userId = decoded.userId;
        return next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido" });
    }
};
