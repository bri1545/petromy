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

  const userRole = (session.user as any).role
  if (!['MODERATOR', 'ADMIN'].includes(userRole)) {
    return res.status(403).json({ error: 'Недостаточно прав' })
  }

  if (req.method === 'GET') {
    const { type = 'projects' } = req.query

    if (type === 'projects') {
      const projects = await prisma.project.findMany({
        where: { status: 'PENDING_MODERATION' },
        include: {
          author: {
            select: { id: true, name: true, email: true, companyName: true, role: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      })

      return res.status(200).json(projects)
    }

    if (type === 'all_projects') {
      const projects = await prisma.project.findMany({
        where: { 
          status: { 
            in: ['APPROVED', 'VOTING', 'FUNDRAISING', 'IN_PROGRESS'] 
          } 
        },
        include: {
          author: {
            select: { id: true, name: true, email: true, companyName: true, role: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return res.status(200).json(projects)
    }

    if (type === 'comments') {
      const comments = await prisma.comment.findMany({
        where: { isApproved: false },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          project: {
            select: { id: true, title: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      })

      return res.status(200).json(comments)
    }

    return res.status(400).json({ error: 'Invalid type' })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
