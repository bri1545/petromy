import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (req.method === 'GET') {
    const project = await prisma.project.findUnique({
      where: { id: id as string },
      include: {
        author: {
          select: { id: true, name: true, companyName: true, role: true }
        },
        curator: {
          select: { id: true, name: true }
        },
        votes: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          }
        },
        comments: {
          where: { isApproved: true },
          include: {
            user: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        contributions: {
          where: { isAnonymous: false },
          include: {
            user: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' })
    }

    return res.status(200).json(project)
  }

  if (req.method === 'PATCH') {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session) {
      return res.status(401).json({ error: 'Необходима авторизация' })
    }

    const project = await prisma.project.findUnique({
      where: { id: id as string }
    })

    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' })
    }

    const userRole = (session.user as any).role
    const userId = (session.user as any).id

    if (project.authorId !== userId && !['MODERATOR', 'ADMIN', 'CURATOR'].includes(userRole)) {
      return res.status(403).json({ error: 'Нет прав для редактирования' })
    }

    const updatedProject = await prisma.project.update({
      where: { id: id as string },
      data: req.body
    })

    return res.status(200).json(updatedProject)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
