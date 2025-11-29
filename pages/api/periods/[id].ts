import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ error: 'Необходима авторизация' })
  }

  const role = (session.user as any)?.role
  if (role !== 'ADMIN' && role !== 'MODERATOR') {
    return res.status(403).json({ error: 'Недостаточно прав' })
  }

  const { id } = req.query

  if (req.method === 'PATCH') {
    const { title, description, startDate, endDate, endEarly } = req.body

    const period = await prisma.period.findUnique({
      where: { id: id as string }
    })

    if (!period) {
      return res.status(404).json({ error: 'Период не найден' })
    }

    const updateData: any = {}
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (startDate) updateData.startDate = new Date(startDate)
    if (endDate) updateData.endDate = new Date(endDate)
    if (endEarly === true) {
      updateData.endedEarly = true
      updateData.endDate = new Date()
    }

    const updated = await prisma.period.update({
      where: { id: id as string },
      data: updateData
    })

    return res.status(200).json(updated)
  }

  if (req.method === 'DELETE') {
    await prisma.period.delete({
      where: { id: id as string }
    })

    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
