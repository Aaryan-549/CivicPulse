import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.admin.create({
      data: {
        name: 'Admin User',
        email: 'admin@civicpulse.com',
        passwordHash: hashedPassword
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@civicpulse.com');
    console.log('🔑 Password: admin123');
    console.log('\nUse these credentials to login on the dashboard.');
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️  Admin user already exists with email: admin@civicpulse.com');
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
