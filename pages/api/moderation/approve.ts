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

  const userRole = (session.user as any).role
  if (!['MODERATOR', 'ADMIN'].includes(userRole)) {
    return res.status(403).json({ error: 'Недостаточно прав' })
  }

  const { type, id, action, notes } = req.body

  if (!type || !id || !action) {
    return res.status(400).json({ error: 'Укажите тип, id и действие' })
  }

  if (type === 'project') {
    if (action === 'approve') {
      await prisma.project.update({
        where: { id },
        data: {
          status: 'APPROVED',
          moderationNotes: notes,
          moderatedAt: new Date(),
          moderatedBy: (session.user as any).id
        }
      })
    } else if (action === 'reject') {
      await prisma.project.update({
        where: { id },
        data: {
          status: 'MODERATION_REJECTED',
          moderationNotes: notes,
          moderatedAt: new Date(),
          moderatedBy: (session.user as any).id
        }
      })
    } else if (action === 'start_voting') {
      await prisma.project.update({
        where: { id },
        data: { status: 'VOTING' }
      })
    }

    return res.status(200).json({ success: true })
  }

  if (type === 'comment') {
    if (action === 'approve') {
      await prisma.comment.update({
        where: { id },
        data: { isApproved: true }
      })
    } else if (action === 'reject') {
      await prisma.comment.delete({
        where: { id }
      })
    }

    return res.status(200).json({ success: true })
  }

  return res.status(400).json({ error: 'Invalid type' })
}
