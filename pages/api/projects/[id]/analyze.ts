import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'
import { analyzeProject } from '../../../../lib/gemini'

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

  const { id } = req.query

  const project = await prisma.project.findUnique({
    where: { id: id as string }
  })

  if (!project) {
    return res.status(404).json({ error: 'Проект не найден' })
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: 'API ключ Gemini не настроен' })
  }

  const analysis = await analyzeProject({
    title: project.title,
    description: project.description,
    category: project.category,
    location: project.location,
    benefits: project.benefits,
    isCompanyProject: project.isCompanyProject
  })

  if (!analysis) {
    return res.status(500).json({ error: 'Ошибка при анализе проекта' })
  }

  await prisma.project.update({
    where: { id: id as string },
    data: {
      aiAnalysis: analysis.summary,
      aiPros: JSON.stringify(analysis.pros),
      aiCons: JSON.stringify(analysis.cons),
      aiRisks: JSON.stringify(analysis.risks),
      aiInvestmentAdvantages: JSON.stringify(analysis.investmentAdvantages),
      aiEstimatedBudget: analysis.estimatedBudget ? Number(analysis.estimatedBudget) : null
    }
  })

  return res.status(200).json({ analysis })
}
