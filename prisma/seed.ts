import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@email.com'
  const adminPassword = 'admin123'
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Администратор',
        role: 'MODERATOR',
        tokens: 999
      }
    })
    
    console.log('Admin user created: admin@email.com / admin123')
  } else {
    console.log('Admin user already exists')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
