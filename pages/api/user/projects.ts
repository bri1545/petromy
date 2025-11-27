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

  const projects = await prisma.project.findMany({
    where: { authorId: userId },
    include: {
      _count: {
        select: { votes: true, comments: true, contributions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return res.status(200).json(projects)
}
