import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany();
    console.log(`--- PRODUCTS (${products.length}) ---`);
    products.forEach(p => {
        if (!p.image_url) console.log(`[EMPTY URL] ID: ${p.id}, Name: ${p.name}`);
        else console.log(`${p.id}: ${p.name} -> ${p.image_url}`);
    });

    const carousels = await prisma.carouselItem.findMany();
    console.log(`\n--- CAROUSELS (${carousels.length}) ---`);
    carousels.forEach(c => {
        if (!c.image_url) console.log(`[EMPTY URL] ID: ${c.id}, Title: ${c.title}`);
        else console.log(`${c.id}: ${c.title} -> ${c.image_url}`);
    });

    const materials = await prisma.contentMaterial.findMany();
    console.log('\n--- MATERIALS ---');
    materials.forEach(m => console.log(`${m.id}: ${m.title} -> ${m.url}`));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
