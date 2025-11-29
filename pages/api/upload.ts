import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

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

  try {
    const { image } = req.body

    if (!image) {
      return res.status(400).json({ error: 'Изображение не предоставлено' })
    }

    const matches = image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/)
    
    if (!matches) {
      return res.status(400).json({ error: 'Неверный формат изображения' })
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
    const data = matches[2]
    const buffer = Buffer.from(data, 'base64')

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
    const filepath = path.join(uploadsDir, filename)
    
    fs.writeFileSync(filepath, buffer)

    return res.status(200).json({ 
      url: `/uploads/${filename}`,
      message: 'Изображение загружено успешно'
    })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ error: 'Ошибка при загрузке изображения' })
  }
}
