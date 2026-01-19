import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import type { Request, Response } from 'express';
import prisma from '../prisma.js';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-TOKEN-MOCK'
});

export const createSubscription = async (req: any, res: Response) => {
    try {
        const { plan } = req.body;
        const userId = req.userId;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        // Definir preços baseados no plano (exemplo)
        const planPrices: Record<string, number> = {
            'basico': 29.90,
            'medio': 59.90,
            'avancado': 89.90
        };

        const amount = planPrices[plan as string] || 29.90;

        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: `sub-${plan}-${userId}`,
                        title: `Assinatura Clube Luna Maria - ${plan}`,
                        unit_price: amount,
                        quantity: 1,
                        currency_id: 'BRL'
                    }
                ],
                back_urls: {
                    success: 'https://lunamaria.kids/success',
                    failure: 'https://lunamaria.kids/failure',
                    pending: 'https://lunamaria.kids/pending',
                },
                notification_url: `${process.env.BACKEND_URL}/payments/webhook`,
                external_reference: userId,
                metadata: {
                    type: 'subscription',
                    plan,
                    userId
                }
            }
        });

        return res.json({ init_point: result.init_point });
    } catch (error) {
        console.error("MP Error:", error);
        return res.status(500).json({ message: "Erro ao criar preferência de pagamento", error });
    }
};

export const webhook = async (req: Request, res: Response) => {
    try {
        const { action, data } = req.body;

        if (action === 'payment.created' || action === 'payment.updated') {
            const payment = new Payment(client);
            const paymentData = await payment.get({ id: data.id });

            if (paymentData.status === 'approved') {
                const { type, plan, userId } = paymentData.metadata;

                if (type === 'subscription') {
                    // Criar ou atualizar assinatura
                    await prisma.subscription.upsert({
                        where: { id: `sub-${userId}` }, // Simplificação para o exemplo
                        update: {
                            status: 'ativa',
                            renewal_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                        },
                        create: {
                            id: `sub-${userId}`,
                            user_id: userId,
                            plan: plan,
                            status: 'ativa',
                            renewal_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                        }
                    });
                }
            }
        }

        return res.status(200).send();
    } catch (error) {
        console.error("Webhook Error:", error);
        return res.status(500).json({ message: "Erro no processamento do webhook" });
    }
};
