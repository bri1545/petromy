import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Не авторизован' })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user || !['MODERATOR', 'ADMIN'].includes(user.role)) {
    return res.status(403).json({ error: 'Нет доступа' })
  }

  if (req.method === 'GET') {
    const { status, needsAdmin } = req.query

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (needsAdmin === 'true') {
      where.needsAdmin = true
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: [
        { needsAdmin: 'desc' },
        { updatedAt: 'desc' }
      ]
    })

    return res.status(200).json(tickets)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
