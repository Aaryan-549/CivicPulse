import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updatePassword() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);

    const user = await prisma.user.update({
      where: { email: 'aaryan.beniwal09@gmail.com' },
      data: { passwordHash: hashedPassword }
    });

    console.log('✅ Password updated for:', user.email);
    console.log('New password: 123456');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword();
