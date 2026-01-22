
const { PrismaClient } = require('c:/Users/rbrag/OneDrive/Área de Trabalho/Antigravity_pwa_LUNA-MARIA-kids/backend/node_modules/@prisma/client');

// Manually setting the URL to bypass dotenv for the test
process.env.DATABASE_URL = "postgresql://postgres:l00LUInxEUfQGuaq@db.ndtruowssuqgwicnumlu.supabase.co:5432/postgres?sslmode=require";

const prisma = new PrismaClient();

async function testSave() {
    console.log("🚀 Iniciando teste de salvamento de produto sem dependências externas...");

    try {
        const testProduct = {
            name: "Teste Direto " + new Date().toISOString(),
            description: "Diagnóstico profundo",
            price: 10.00,
            old_price: 20.00,
            image_url: "https://via.placeholder.com/100",
            stock: 1,
            category: "acessorios",
            display_order: 0,
            sizes: ["G"]
        };

        console.log("📦 Tentando criar produto...");
        const created = await prisma.product.create({
            data: testProduct
        });
        console.log("✅ Criado! ID:", created.id);

        console.log("🔄 Tentando atualizar...");
        await prisma.product.update({
            where: { id: created.id },
            data: { name: "Teste Direto Atualizado" }
        });
        console.log("✅ Atualizado!");

    } catch (error) {
        console.error("❌ ERRO:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

testSave();
