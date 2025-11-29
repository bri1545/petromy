import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'
import { moderateComment } from '../../../../lib/gemini'
import { z } from 'zod'

const commentSchema = z.object({
  content: z.string().min(3, 'Комментарий должен быть минимум 3 символа').max(1000, 'Комментарий не должен превышать 1000 символов')
})

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

  try {
    const { content } = commentSchema.parse(req.body)
    const userId = (session.user as any).id

    const project = await prisma.project.findUnique({
      where: { id: id as string }
    })

    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' })
    }

    let isApproved = true
    let aiModerationResult = null

    if (process.env.GEMINI_API_KEY) {
      const moderation = await moderateComment(content)
      aiModerationResult = JSON.stringify(moderation)
      isApproved = moderation.isAppropriate && moderation.toxicityScore < 5
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        projectId: id as string,
        isApproved,
        aiModerated: !!process.env.GEMINI_API_KEY,
        aiModerationResult
      },
      include: {
        user: {
          select: { id: true, name: true }
        }
      }
    })

    return res.status(201).json({
      comment,
      message: isApproved 
        ? 'Комментарий опубликован' 
        : 'Комментарий отправлен на модерацию'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('Comment error:', error)
    return res.status(500).json({ error: 'Ошибка при добавлении комментария' })
  }
}
