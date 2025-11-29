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

  const { id } = req.query

  const project = await prisma.project.findUnique({
    where: { id: id as string },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      estimatedBudget: true,
      location: true,
      benefits: true,
      isCompanyProject: true,
      status: true,
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

  const parseJsonSafe = (jsonString: string | null): string[] => {
    if (!jsonString) return []
    try {
      return JSON.parse(jsonString)
    } catch {
      return []
    }
  }

  if (project.aiAnalysis) {
    return res.status(200).json({
      analysis: {
        summary: project.aiAnalysis,
        pros: parseJsonSafe(project.aiPros),
        cons: parseJsonSafe(project.aiCons),
        risks: parseJsonSafe(project.aiRisks),
        investmentAdvantages: parseJsonSafe(project.aiInvestmentAdvantages)
      }
    })
  }

  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(200).json({
      analysis: {
        summary: 'Войдите в систему, чтобы получить AI-анализ этого проекта.',
        pros: ['Авторизуйтесь для получения анализа'],
        cons: [],
        risks: [],
        investmentAdvantages: []
      }
    })
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({
      analysis: {
        summary: 'AI-анализ временно недоступен. Пожалуйста, попробуйте позже.',
        pros: ['Информация будет доступна после настройки AI-сервиса'],
        cons: [],
        risks: [],
        investmentAdvantages: []
      }
    })
  }

  try {
    const analysis = await analyzeProject({
      title: project.title,
      description: project.description,
      category: project.category,
      location: project.location,
      benefits: project.benefits,
      isCompanyProject: project.isCompanyProject
    })

    if (analysis) {
      await prisma.project.update({
        where: { id: id as string },
        data: {
          aiAnalysis: analysis.summary || null,
          aiPros: analysis.pros ? JSON.stringify(analysis.pros) : null,
          aiCons: analysis.cons ? JSON.stringify(analysis.cons) : null,
          aiRisks: analysis.risks ? JSON.stringify(analysis.risks) : null,
          aiInvestmentAdvantages: analysis.investmentAdvantages ? JSON.stringify(analysis.investmentAdvantages) : null,
          aiEstimatedBudget: analysis.estimatedBudget ? Number(analysis.estimatedBudget) : null
        }
      })

      return res.status(200).json({ analysis })
    }

    return res.status(500).json({ error: 'AI анализ не удался' })
  } catch (error) {
    console.error('AI analysis error:', error)
    return res.status(500).json({ error: 'Ошибка AI анализа' })
  }
}
