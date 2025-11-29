import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ error: 'Необходима авторизация' })
  }

  const userId = (session.user as any).id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      subscriptionType: true,
      subscriptionStart: true,
      subscriptionEnd: true
    }
  })

  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' })
  }

  const now = new Date()
  const isActive = user.subscriptionEnd && new Date(user.subscriptionEnd) > now

  return res.status(200).json({
    role: user.role,
    subscription: {
      type: user.subscriptionType,
      startDate: user.subscriptionStart,
      endDate: user.subscriptionEnd,
      isActive: isActive
    }
  })
}
