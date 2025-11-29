import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'
import { analyzeProject } from '../../../lib/gemini'

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
      const project = await prisma.project.findUnique({
        where: { id }
      })

      if (!project) {
        return res.status(404).json({ error: 'Проект не найден' })
      }

      let aiAnalysis = null
      let aiPros = null
      let aiCons = null
      let aiRisks = null
      let aiInvestmentAdvantages = null

      try {
        const analysis = await analyzeProject({
          title: project.title,
          description: project.description,
          category: project.category,
          estimatedBudget: project.estimatedBudget,
          location: project.location,
          benefits: project.benefits,
          isCompanyProject: project.isCompanyProject
        })

        if (analysis) {
          aiAnalysis = analysis.summary || null
          aiPros = analysis.pros ? JSON.stringify(analysis.pros) : null
          aiCons = analysis.cons ? JSON.stringify(analysis.cons) : null
          aiRisks = analysis.risks ? JSON.stringify(analysis.risks) : null
          aiInvestmentAdvantages = analysis.investmentAdvantages ? JSON.stringify(analysis.investmentAdvantages) : null
        }
      } catch (error) {
        console.error('AI analysis failed:', error)
      }

      await prisma.project.update({
        where: { id },
        data: {
          status: 'APPROVED',
          moderationNotes: notes,
          moderatedAt: new Date(),
          moderatedBy: (session.user as any).id,
          aiAnalysis,
          aiPros,
          aiCons,
          aiRisks,
          aiInvestmentAdvantages
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
    } else if (action === 'close') {
      await prisma.project.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          moderationNotes: notes || 'Проект закрыт модератором',
          moderatedAt: new Date(),
          moderatedBy: (session.user as any).id
        }
      })
    } else if (action === 'analyze') {
      const project = await prisma.project.findUnique({
        where: { id }
      })

      if (!project) {
        return res.status(404).json({ error: 'Проект не найден' })
      }

      try {
        const analysis = await analyzeProject({
          title: project.title,
          description: project.description,
          category: project.category,
          estimatedBudget: project.estimatedBudget,
          location: project.location,
          benefits: project.benefits,
          isCompanyProject: project.isCompanyProject
        })

        if (analysis) {
          await prisma.project.update({
            where: { id },
            data: {
              aiAnalysis: analysis.summary || null,
              aiPros: analysis.pros ? JSON.stringify(analysis.pros) : null,
              aiCons: analysis.cons ? JSON.stringify(analysis.cons) : null,
              aiRisks: analysis.risks ? JSON.stringify(analysis.risks) : null,
              aiInvestmentAdvantages: analysis.investmentAdvantages ? JSON.stringify(analysis.investmentAdvantages) : null
            }
          })

          return res.status(200).json({ success: true, analysis })
        }

        return res.status(500).json({ error: 'AI анализ не удался' })
      } catch (error) {
        console.error('AI analysis error:', error)
        return res.status(500).json({ error: 'Ошибка AI анализа' })
      }
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
