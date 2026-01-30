require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
    try {
        console.log('🔍 Verificando usuários no banco de dados...\n');

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                created_at: true
            },
            orderBy: {
                created_at: 'desc'
            },
            take: 10
        });

        console.log(`✅ Total de usuários: ${users.length}\n`);

        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Criado em: ${user.created_at}`);
            console.log('');
        });

        await prisma.$disconnect();
    } catch (error) {
        console.error('❌ Erro:', error);
        await prisma.$disconnect();
    }
}

checkUsers();
