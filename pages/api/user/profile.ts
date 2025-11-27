import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ error: 'Необходима авторизация' })
  }

  const userId = (session.user as any).id

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        phone: true,
        tokens: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
            votes: true,
            comments: true,
            contributions: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' })
    }

    return res.status(200).json(user)
  }

  if (req.method === 'PATCH') {
    const { name, phone } = req.body

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        tokens: true
      }
    })

    return res.status(200).json(updatedUser)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
