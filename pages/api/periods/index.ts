import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { type, active } = req.query
    
    const where: any = {}
    if (type) where.type = type
    if (active === 'true') {
      where.isActive = true
      where.endedEarly = false
      where.endDate = { gte: new Date() }
      where.startDate = { lte: new Date() }
    }

    const periods = await prisma.period.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return res.status(200).json(periods)
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Необходима авторизация' })
    }

    const role = (session.user as any)?.role
    if (role !== 'ADMIN' && role !== 'MODERATOR') {
      return res.status(403).json({ error: 'Недостаточно прав' })
    }

    const { type, title, description, startDate, endDate } = req.body

    if (!type || !title || !startDate || !endDate) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' })
    }

    if (!['SUBMISSION', 'VOTING'].includes(type)) {
      return res.status(400).json({ error: 'Неверный тип периода' })
    }

    const existingActive = await prisma.period.findFirst({
      where: {
        type,
        isActive: true,
        endedEarly: false,
        endDate: { gte: new Date() },
        startDate: { lte: new Date() }
      }
    })

    if (existingActive) {
      return res.status(400).json({ 
        error: `Уже есть активный период ${type === 'SUBMISSION' ? 'подачи' : 'голосования'}` 
      })
    }

    const period = await prisma.period.create({
      data: {
        type,
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    })

    return res.status(201).json(period)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
