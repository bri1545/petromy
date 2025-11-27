import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен быть минимум 6 символов'),
  name: z.string().min(2, 'Имя должно быть минимум 2 символа'),
  role: z.enum(['CITIZEN', 'COMPANY']).default('CITIZEN'),
  companyName: z.string().optional(),
  companyInn: z.string().optional(),
  phone: z.string().optional()
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const data = registerSchema.parse(req.body)

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' })
    }

    if (data.role === 'COMPANY' && (!data.companyName || !data.companyInn)) {
      return res.status(400).json({ error: 'Для компании необходимо указать название и ИИН/БИН' })
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role,
        companyName: data.companyName,
        companyInn: data.companyInn,
        phone: data.phone,
        tokens: 5
      }
    })

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError
      return res.status(400).json({ error: zodError.issues[0].message })
    }
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Ошибка при регистрации' })
  }
}
