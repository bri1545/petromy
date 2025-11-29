import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  const session = await getServerSession(req, res, authOptions)
  const userRole = (session?.user as any)?.role
  const isAdmin = ['MODERATOR', 'ADMIN'].includes(userRole)

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
          where: isAdmin ? {} : { isApproved: true },
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

    return res.status(200).json({ ...project, isAdmin })
  }

  if (req.method === 'PATCH') {
    if (!session) {
      return res.status(401).json({ error: 'Необходима авторизация' })
    }

    const project = await prisma.project.findUnique({
      where: { id: id as string }
    })

    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' })
    }

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

  if (req.method === 'DELETE') {
    if (!session) {
      return res.status(401).json({ error: 'Необходима авторизация' })
    }

    if (!isAdmin) {
      return res.status(403).json({ error: 'Только администратор может удалять проекты' })
    }

    await prisma.vote.deleteMany({ where: { projectId: id as string } })
    await prisma.comment.deleteMany({ where: { projectId: id as string } })
    await prisma.contribution.deleteMany({ where: { projectId: id as string } })
    
    await prisma.project.delete({
      where: { id: id as string }
    })

    return res.status(200).json({ message: 'Проект удален' })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
