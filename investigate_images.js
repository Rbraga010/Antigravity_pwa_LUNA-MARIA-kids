
const { PrismaClient } = require('c:/Users/rbrag/OneDrive/Área de Trabalho/Antigravity_pwa_LUNA-MARIA-kids/backend/node_modules/@prisma/client');

// Manually setting the URL to bypass dotenv
process.env.DATABASE_URL = "postgresql://postgres:l00LUInxEUfQGuaq@db.ndtruowssuqgwicnumlu.supabase.co:5432/postgres?sslmode=require";

const prisma = new PrismaClient();

async function investigateImages() {
    console.log("🔍 INVESTIGAÇÃO: Problema de Imagens\n");
    console.log("=" + "=".repeat(60));

    try {
        // 1. Verificar produtos no banco
        console.log("\n1️⃣ Consultando produtos no banco de dados...\n");
        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                image_url: true,
                is_featured: true
            },
            take: 5
        });

        console.log(`✅ Encontrados ${products.length} produtos:`);
        products.forEach((p, i) => {
            console.log(`\n   Produto ${i + 1}:`);
            console.log(`   - Nome: ${p.name}`);
            console.log(`   - ID: ${p.id}`);
            console.log(`   - image_url: ${p.image_url}`);
            console.log(`   - is_featured: ${p.is_featured}`);
        });

        // 2. Verificar se há produtos SEM image_url
        console.log("\n" + "=".repeat(60));
        console.log("\n2️⃣ Verificando produtos SEM image_url...\n");
        const productsWithoutImage = await prisma.product.findMany({
            where: {
                OR: [
                    { image_url: null },
                    { image_url: '' }
                ]
            },
            select: {
                id: true,
                name: true,
                image_url: true
            }
        });

        if (productsWithoutImage.length > 0) {
            console.log(`⚠️  Encontrados ${productsWithoutImage.length} produtos SEM imagem:`);
            productsWithoutImage.forEach(p => {
                console.log(`   - ${p.name} (ID: ${p.id})`);
            });
        } else {
            console.log("✅ Todos os produtos têm image_url preenchido!");
        }

        // 3. Verificar produtos marcados como "Oferta do Dia"
        console.log("\n" + "=".repeat(60));
        console.log("\n3️⃣ Verificando produtos marcados como 'Oferta do Dia'...\n");
        const featuredProducts = await prisma.product.findMany({
            where: { is_featured: true },
            select: {
                id: true,
                name: true,
                is_featured: true
            }
        });

        if (featuredProducts.length > 0) {
            console.log(`⭐ Encontrados ${featuredProducts.length} produtos como Oferta do Dia:`);
            featuredProducts.forEach(p => {
                console.log(`   - ${p.name} (ID: ${p.id})`);
            });
        } else {
            console.log("⚠️  NENHUM produto marcado como 'Oferta do Dia' no banco!");
        }

        console.log("\n" + "=".repeat(60));
        console.log("\n✅ Investigação concluída!\n");

    } catch (error) {
        console.error("\n❌ ERRO na investigação:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

investigateImages();
