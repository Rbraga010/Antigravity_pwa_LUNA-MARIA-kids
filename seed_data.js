const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
  {
    name: "Vestido Nuvem Mágica",
    description: "Vestido leve e confortável",
    price: 129.90,
    old_price: 189.90,
    image_url: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800",
    stock: 10,
    category: "menina-kids",
    display_order: 0
  },
  {
    name: "Conjunto Estrela Brilhante",
    description: "Conjunto completo para meninas",
    price: 159.90,
    old_price: null,
    image_url: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800",
    stock: 15,
    category: "menina-bebe",
    display_order: 1
  },
  {
    name: "Camisa Aventureiro",
    description: "Camisa confortável para meninos",
    price: 89.90,
    old_price: 119.90,
    image_url: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800",
    stock: 20,
    category: "menino-kids",
    display_order: 2
  }
];

const carousels = [
  {
    image_url: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=1920",
    title: "Bem-vinda ao Mundo da Luna",
    subtitle: "Moda infantil com amor e magia",
    type: "TOP",
    order: 0
  },
  {
    image_url: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1920",
    title: "Clube da Luna Maria Kids",
    subtitle: "Conteúdos exclusivos para sua família",
    type: "FEATURED",
    order: 0
  }
];

const materials = [
  {
    title: "História da Luna e as Estrelas",
    description: "Uma aventura mágica para crianças",
    type: "VIDEO",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail_url: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400",
    section: "KIDS",
    order: 0
  },
  {
    title: "Atividade para Colorir: Lua e Estrelas",
    description: "PDF para imprimir e colorir",
    type: "PDF",
    url: "https://example.com/colorir.pdf",
    thumbnail_url: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400",
    section: "KIDS",
    order: 1
  },
  {
    title: "Dicas de Educação Positiva",
    description: "Guia para pais e mães",
    type: "VIDEO",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail_url: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400",
    section: "FAMILY",
    order: 0
  }
];

async function main() {
  console.log('🌱 Populando banco de dados...');

  // Limpar dados existentes
  await prisma.contentMaterial.deleteMany();
  await prisma.carouselItem.deleteMany();
  await prisma.product.deleteMany();

  // Inserir produtos
  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`✅ ${products.length} produtos criados`);

  // Inserir banners
  for (const carousel of carousels) {
    await prisma.carouselItem.create({ data: carousel });
  }
  console.log(`✅ ${carousels.length} banners criados`);

  // Inserir materiais
  for (const material of materials) {
    await prisma.contentMaterial.create({ data: material });
  }
  console.log(`✅ ${materials.length} materiais criados`);

  console.log('🎉 Banco populado com sucesso!');
}

main()
  .catch(e => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
