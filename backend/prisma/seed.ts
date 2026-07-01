import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash admin password
  const adminPassword = await bcrypt.hash('admin123', 10);

  // 1. Seed Org Administrator
  const admin = await prisma.user.upsert({
    where: { email: 'admin@afyaflow.com' },
    update: {},
    create: {
      email: 'admin@afyaflow.com',
      passwordHash: adminPassword,
      firstName: 'Adrian',
      lastName: 'Vance',
      role: 'ORG_ADMIN',
      isApproved: true,
      isEmailVerified: true,
    },
  });

  console.log('Database seeded with Admin account successfully.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
