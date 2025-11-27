import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'
import { z } from 'zod'

const projectSchema = z.object({
  title: z.string().min(10, 'Название должно быть минимум 10 символов'),
  description: z.string().min(100, 'Описание должно быть минимум 100 символов'),
  category: z.enum([
    'INFRASTRUCTURE',
    'BEAUTIFICATION', 
    'SOCIAL',
    'COMMERCIAL',
    'ENVIRONMENTAL',
    'CULTURAL',
    'SPORTS',
    'EDUCATION',
    'HEALTHCARE',
    'OTHER'
  ]),
  estimatedBudget: z.number().optional(),
  location: z.string().optional(),
  timeline: z.string().optional(),
  benefits: z.string().optional(),
  targetAudience: z.string().optional()
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { status, category, page = '1', limit = '10' } = req.query
    
    const where: any = {}
    
    if (status) {
      where.status = status
    } else {
      where.status = { in: ['APPROVED', 'VOTING', 'FUNDRAISING', 'IN_PROGRESS', 'COMPLETED'] }
    }
    
    if (category) {
      where.category = category
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, companyName: true }
        },
        _count: {
          select: { votes: true, comments: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string)
    })

    const total = await prisma.project.count({ where })

    return res.status(200).json({
      projects,
      total,
      page: parseInt(page as string),
      totalPages: Math.ceil(total / parseInt(limit as string))
    })
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Необходима авторизация' })
    }

    try {
      const data = projectSchema.parse(req.body)

      const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id }
      })

      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' })
      }

      const project = await prisma.project.create({
        data: {
          ...data,
          authorId: user.id,
          isCompanyProject: user.role === 'COMPANY',
          status: 'PENDING_MODERATION'
        }
      })

      return res.status(201).json(project)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodError = error as z.ZodError
        return res.status(400).json({ error: zodError.issues[0].message })
      }
      console.error('Project creation error:', error)
      return res.status(500).json({ error: 'Ошибка при создании проекта' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
