import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'

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

  const { id } = req.query
  const { isFor } = req.body

  if (typeof isFor !== 'boolean') {
    return res.status(400).json({ error: 'Укажите тип голоса (за или против)' })
  }

  const userId = (session.user as any).id

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' })
  }

  if (user.role === 'COMPANY') {
    const now = new Date()
    if (!user.subscriptionEnd || new Date(user.subscriptionEnd) < now) {
      return res.status(403).json({ 
        error: 'Для голосования компаниям требуется активная подписка',
        needsSubscription: true 
      })
    }
  }

  if (user.tokens < 1) {
    return res.status(400).json({ error: 'Недостаточно токенов для голосования. У вас ' + user.tokens + ' токенов.' })
  }

  const project = await prisma.project.findUnique({
    where: { id: id as string }
  })

  if (!project) {
    return res.status(404).json({ error: 'Проект не найден' })
  }

  if (project.status !== 'VOTING') {
    return res.status(400).json({ error: 'Голосование за этот проект не открыто' })
  }

  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId: id as string
      }
    }
  })

  if (existingVote) {
    return res.status(400).json({ error: 'Вы уже голосовали за этот проект' })
  }

  await prisma.$transaction([
    prisma.vote.create({
      data: {
        userId,
        projectId: id as string,
        isFor
      }
    }),
    prisma.user.update({
      where: { id: userId },
      data: { tokens: { decrement: 1 } }
    }),
    prisma.project.update({
      where: { id: id as string },
      data: isFor 
        ? { votesFor: { increment: 1 } }
        : { votesAgainst: { increment: 1 } }
    })
  ])

  return res.status(200).json({ success: true, message: 'Голос учтен!' })
}
