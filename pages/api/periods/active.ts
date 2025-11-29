import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const now = new Date()

  const submissionPeriod = await prisma.period.findFirst({
    where: {
      type: 'SUBMISSION',
      isActive: true,
      endedEarly: false,
      startDate: { lte: now },
      endDate: { gte: now }
    },
    orderBy: { createdAt: 'desc' }
  })

  const votingPeriod = await prisma.period.findFirst({
    where: {
      type: 'VOTING',
      isActive: true,
      endedEarly: false,
      startDate: { lte: now },
      endDate: { gte: now }
    },
    orderBy: { createdAt: 'desc' }
  })

  const nextSubmission = !submissionPeriod ? await prisma.period.findFirst({
    where: {
      type: 'SUBMISSION',
      isActive: true,
      endedEarly: false,
      startDate: { gt: now }
    },
    orderBy: { startDate: 'asc' }
  }) : null

  const nextVoting = !votingPeriod ? await prisma.period.findFirst({
    where: {
      type: 'VOTING',
      isActive: true,
      endedEarly: false,
      startDate: { gt: now }
    },
    orderBy: { startDate: 'asc' }
  }) : null

  return res.status(200).json({
    submission: submissionPeriod,
    voting: votingPeriod,
    nextSubmission,
    nextVoting
  })
}
