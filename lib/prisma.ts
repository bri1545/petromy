import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  seeded: boolean | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

async function seedAdmin() {
  if (globalForPrisma.seeded) return
  
  try {
    const adminEmail = 'admin@email.com'
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Администратор',
          role: 'MODERATOR',
          tokens: 999
        }
      })
      console.log('Admin user seeded: admin@email.com')
    }
    globalForPrisma.seeded = true
  } catch (error) {
    console.error('Error seeding admin:', error)
  }
}

seedAdmin()
