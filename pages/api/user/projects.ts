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

  if (req.method === 'DELETE') {
    const { projectId } = req.body

    if (!projectId) {
      return res.status(400).json({ error: 'ID проекта обязателен' })
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' })
    }

    if (project.authorId !== userId) {
      return res.status(403).json({ error: 'Вы не можете удалить чужой проект' })
    }

    const allowedStatuses = ['DRAFT', 'PENDING_MODERATION', 'REJECTED', 'COMPLETED']
    if (!allowedStatuses.includes(project.status)) {
      return res.status(400).json({ 
        error: 'Нельзя удалить активный проект. Можно удалить только черновики, проекты на модерации, отклонённые или завершённые.' 
      })
    }

    await prisma.$transaction([
      prisma.vote.deleteMany({ where: { projectId } }),
      prisma.comment.deleteMany({ where: { projectId } }),
      prisma.contribution.deleteMany({ where: { projectId } }),
      prisma.project.delete({ where: { id: projectId } })
    ])

    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
