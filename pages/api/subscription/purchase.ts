import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ error: 'Необходима авторизация' })
  }

  const userId = (session.user as any).id
  const userRole = (session.user as any).role

  if (userRole !== 'COMPANY') {
    return res.status(403).json({ error: 'Подписка доступна только для компаний' })
  }

  const { duration } = req.body

  if (!['1_month', '3_months', '6_months', '1_year'].includes(duration)) {
    return res.status(400).json({ error: 'Неверный тип подписки' })
  }

  const now = new Date()
  let endDate = new Date()

  switch (duration) {
    case '1_month':
      endDate.setMonth(endDate.getMonth() + 1)
      break
    case '3_months':
      endDate.setMonth(endDate.getMonth() + 3)
      break
    case '6_months':
      endDate.setMonth(endDate.getMonth() + 6)
      break
    case '1_year':
      endDate.setFullYear(endDate.getFullYear() + 1)
      break
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionType: duration,
      subscriptionStart: now,
      subscriptionEnd: endDate
    }
  })

  return res.status(200).json({
    message: 'Подписка успешно активирована',
    subscription: {
      type: duration,
      startDate: now,
      endDate: endDate
    }
  })
}
