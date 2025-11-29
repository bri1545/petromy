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

  if (!session) {
    return res.status(401).json({ error: 'Необходима авторизация' })
  }

  const userRole = (session.user as any).role
  const isAdmin = ['MODERATOR', 'ADMIN'].includes(userRole)

  if (req.method === 'DELETE') {
    if (!isAdmin) {
      return res.status(403).json({ error: 'Только администратор может удалять комментарии' })
    }

    const comment = await prisma.comment.findUnique({
      where: { id: id as string }
    })

    if (!comment) {
      return res.status(404).json({ error: 'Комментарий не найден' })
    }

    await prisma.comment.delete({
      where: { id: id as string }
    })

    return res.status(200).json({ message: 'Комментарий удален' })
  }

  if (req.method === 'PATCH') {
    if (!isAdmin) {
      return res.status(403).json({ error: 'Только администратор может редактировать комментарии' })
    }

    const { isApproved } = req.body

    const comment = await prisma.comment.update({
      where: { id: id as string },
      data: { isApproved }
    })

    return res.status(200).json(comment)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
