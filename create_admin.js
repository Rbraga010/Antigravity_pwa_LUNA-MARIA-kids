const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Luna@2026!Admin', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'superadm@lunakids.com' },
    update: { 
      role: 'SUPER_ADMIN',
      password_hash: hashedPassword 
    },
    create: {
      email: 'superadm@lunakids.com',
      name: 'Super Admin Luna Kids',
      password_hash: hashedPassword,
      role: 'SUPER_ADMIN',
      phone: '11999999999',
      num_children: 0
    }
  });
  
  console.log('✅ Super Admin criado:', admin);
}

main().finally(() => prisma.$disconnect());
