import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'
import { supportChat, ChatMessage } from '../../../lib/gemini'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { ticketId } = req.query
    
    if (typeof ticketId !== 'string') {
      return res.status(400).json({ error: 'Ticket ID required' })
    }

    try {
      const ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      })

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' })
      }

      return res.status(200).json({ ticket })
    } catch (error) {
      console.error('Error fetching ticket:', error)
      return res.status(500).json({ error: 'Server error' })
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    const { message, ticketId, history } = req.body

    if (!message || message.trim().length < 2) {
      return res.status(400).json({ error: 'Сообщение слишком короткое' })
    }

    let ticket
    
    if (ticketId) {
      ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      })
      
      if (!ticket) {
        return res.status(404).json({ error: 'Тикет не найден' })
      }
    } else {
      ticket = await prisma.supportTicket.create({
        data: {
          userId: session?.user?.email ? (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id : null,
          userEmail: session?.user?.email || null,
          userName: session?.user?.name || null,
          status: 'OPEN',
          category: 'GENERAL'
        },
        include: { messages: true }
      })
    }

    await prisma.supportMessage.create({
      data: {
        ticketId: ticket.id,
        content: message,
        sender: 'user',
        isAI: false
      }
    })

    const chatHistory: ChatMessage[] = (history || []).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))

    const aiResponse = await supportChat(
      message,
      chatHistory,
      session?.user?.name || undefined
    )

    await prisma.supportMessage.create({
      data: {
        ticketId: ticket.id,
        content: aiResponse.answer,
        sender: 'ai',
        isAI: true
      }
    })

    if (aiResponse.needsAdmin) {
      await prisma.supportTicket.update({
        where: { id: ticket.id },
        data: {
          needsAdmin: true,
          category: aiResponse.category
        }
      })
    } else {
      await prisma.supportTicket.update({
        where: { id: ticket.id },
        data: {
          category: aiResponse.category
        }
      })
    }

    const updatedTicket = await prisma.supportTicket.findUnique({
      where: { id: ticket.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    return res.status(200).json({
      ticket: updatedTicket,
      aiResponse: aiResponse.answer,
      needsAdmin: aiResponse.needsAdmin,
      category: aiResponse.category
    })

  } catch (error) {
    console.error('Support chat error:', error)
    return res.status(500).json({ error: 'Ошибка сервера' })
  }
}
