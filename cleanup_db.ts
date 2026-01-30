import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Cleaning up database URLs...');

    // Fix products with empty or broken URLs
    const products = await prisma.product.findMany();
    for (const p of products) {
        if (!p.image_url || p.image_url.length < 5 || p.image_url.includes('\n')) {
            const fallback = `https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800`;
            console.log(`Fixing product ${p.name} (${p.id}): ${p.image_url} -> ${fallback}`);
            await prisma.product.update({
                where: { id: p.id },
                data: { image_url: fallback }
            });
        }
    }

    // Fix carousels
    const carousels = await prisma.carouselItem.findMany();
    for (const c of carousels) {
        if (!c.image_url || c.image_url.length < 5 || c.image_url.includes('\n')) {
            const fallback = `https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=1920`;
            console.log(`Fixing carousel ${c.title} (${c.id}): ${c.image_url} -> ${fallback}`);
            await prisma.carouselItem.update({
                where: { id: c.id },
                data: { image_url: fallback }
            });
        }
    }

    console.log('✅ Database cleanup completed!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
