const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'superadm@lunakids.com' }
  });
  
  if (user) {
    console.log('✅ Usuário encontrado:');
    console.log(JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at
    }, null, 2));
  } else {
    console.log('❌ Usuário NÃO encontrado no banco');
  }
}

main().finally(() => prisma.$disconnect());
