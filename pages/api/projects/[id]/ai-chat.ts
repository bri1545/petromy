import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'
import { chatAboutProject } from '../../../../lib/gemini'

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
  const { question, chatHistory } = req.body

  if (!question || typeof question !== 'string' || question.trim().length < 3) {
    return res.status(400).json({ error: 'Вопрос должен содержать минимум 3 символа' })
  }

  const validatedChatHistory = Array.isArray(chatHistory) ? chatHistory : []

  const project = await prisma.project.findUnique({
    where: { id: id as string },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      estimatedBudget: true,
      aiEstimatedBudget: true,
      location: true,
      benefits: true,
      targetAudience: true,
      isCompanyProject: true,
      timeline: true,
      aiAnalysis: true,
      aiPros: true,
      aiCons: true,
      aiRisks: true,
      aiInvestmentAdvantages: true
    }
  })

  if (!project) {
    return res.status(404).json({ error: 'Проект не найден' })
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'AI сервис временно недоступен' })
  }

  try {
    const answer = await chatAboutProject(project, question, validatedChatHistory)

    if (!answer) {
      return res.status(500).json({ error: 'Не удалось получить ответ от AI' })
    }

    return res.status(200).json({ answer })
  } catch (error) {
    console.error('AI chat error:', error)
    return res.status(500).json({ error: 'Ошибка AI чата' })
  }
}
