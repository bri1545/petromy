import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ticket ID' })
  }

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
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!ticket) {
      return res.status(404).json({ error: 'Тикет не найден' })
    }

    return res.status(200).json(ticket)
  }

  if (req.method === 'POST') {
    const { message, action } = req.body

    if (action === 'reply' && message) {
      await prisma.supportMessage.create({
        data: {
          ticketId: id,
          content: message,
          sender: 'admin',
          isAI: false
        }
      })

      await prisma.supportTicket.update({
        where: { id },
        data: {
          needsAdmin: false,
          updatedAt: new Date()
        }
      })
    }

    if (action === 'close') {
      await prisma.supportTicket.update({
        where: { id },
        data: {
          status: 'CLOSED',
          needsAdmin: false
        }
      })
    }

    if (action === 'reopen') {
      await prisma.supportTicket.update({
        where: { id },
        data: {
          status: 'OPEN'
        }
      })
    }

    const updatedTicket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    return res.status(200).json(updatedTicket)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
