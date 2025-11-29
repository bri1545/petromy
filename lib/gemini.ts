import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function analyzeProject(project: {
  title: string
  description: string
  category: string
  location?: string | null
  benefits?: string | null
  isCompanyProject: boolean
}) {
  if (!process.env.GEMINI_API_KEY) {
    console.log('GEMINI_API_KEY not configured')
    return null
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `Проанализируй следующий городской проект для города Петропавловск (Казахстан) и предоставь структурированный анализ на русском языке:

Название: ${project.title}
Описание: ${project.description}
Категория: ${project.category}
${project.location ? `Местоположение: ${project.location}` : ''}
${project.benefits ? `Преимущества по мнению автора: ${project.benefits}` : ''}
Тип проекта: ${project.isCompanyProject ? 'Коммерческий (от компании)' : 'Гражданская инициатива'}

Пожалуйста, предоставь анализ в следующем JSON формате:
{
  "summary": "Краткое резюме проекта (2-3 предложения)",
  "pros": ["плюс 1", "плюс 2", "плюс 3"],
  "cons": ["минус 1", "минус 2"],
  "risks": ["риск 1", "риск 2"],
  "investmentAdvantages": ["преимущество для инвесторов 1", "преимущество 2"],
  "estimatedBudget": 5000000,
  "feasibilityScore": 7,
  "recommendation": "Рекомендация для модераторов"
}

ВАЖНО: Поле "estimatedBudget" должно содержать примерную оценку бюджета проекта в тенге (число без валюты). Основывайся на типе проекта, масштабе работ и средних ценах в Казахстане.

Отвечай ТОЛЬКО валидным JSON без дополнительного текста.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return null
  } catch (error) {
    console.error('Error analyzing project with Gemini:', error)
    return null
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function chatAboutProject(
  project: {
    title: string
    description: string
    category: string
    location?: string | null
    benefits?: string | null
    targetAudience?: string | null
    isCompanyProject: boolean
    timeline?: string | null
    estimatedBudget?: number | null
    aiEstimatedBudget?: number | null
    aiAnalysis?: string | null
    aiPros?: string | null
    aiCons?: string | null
    aiRisks?: string | null
    aiInvestmentAdvantages?: string | null
  },
  question: string,
  chatHistory: ChatMessage[] = []
) {
  if (!process.env.GEMINI_API_KEY) {
    return null
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const parseJsonSafe = (jsonString: string | null): string[] => {
    if (!jsonString) return []
    try {
      return JSON.parse(jsonString)
    } catch {
      return []
    }
  }

  const projectContext = `
Ты - эксперт по городским проектам для города Петропавловск (Казахстан). 
Отвечай на вопросы пользователей о конкретном проекте.

ИНФОРМАЦИЯ О ПРОЕКТЕ:
Название: ${project.title}
Описание: ${project.description}
Категория: ${project.category}
${project.location ? `Местоположение: ${project.location}` : ''}
${project.benefits ? `Преимущества: ${project.benefits}` : ''}
${project.targetAudience ? `Целевая аудитория: ${project.targetAudience}` : ''}
${project.timeline ? `Сроки: ${project.timeline}` : ''}
Тип проекта: ${project.isCompanyProject ? 'Коммерческий (от компании)' : 'Гражданская инициатива'}
${project.aiEstimatedBudget || project.estimatedBudget ? `Бюджет: ${project.aiEstimatedBudget || project.estimatedBudget} тенге` : ''}

${project.aiAnalysis ? `AI АНАЛИЗ: ${project.aiAnalysis}` : ''}
${parseJsonSafe(project.aiPros).length > 0 ? `ПРЕИМУЩЕСТВА: ${parseJsonSafe(project.aiPros).join(', ')}` : ''}
${parseJsonSafe(project.aiCons).length > 0 ? `НЕДОСТАТКИ: ${parseJsonSafe(project.aiCons).join(', ')}` : ''}
${parseJsonSafe(project.aiRisks).length > 0 ? `РИСКИ: ${parseJsonSafe(project.aiRisks).join(', ')}` : ''}
${parseJsonSafe(project.aiInvestmentAdvantages).length > 0 ? `ДЛЯ ИНВЕСТОРОВ: ${parseJsonSafe(project.aiInvestmentAdvantages).join(', ')}` : ''}

ПРАВИЛА:
1. Отвечай только на русском языке
2. Отвечай конкретно по этому проекту
3. Если вопрос не связан с проектом, вежливо верни разговор к проекту
4. Будь полезным и информативным
5. Если не знаешь точного ответа, честно скажи об этом
`

  const historyText = chatHistory.map(msg => 
    `${msg.role === 'user' ? 'Пользователь' : 'Ассистент'}: ${msg.content}`
  ).join('\n')

  const prompt = `${projectContext}

${historyText ? `ИСТОРИЯ РАЗГОВОРА:\n${historyText}\n` : ''}
Пользователь: ${question}

Ответь на вопрос пользователя о проекте:`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error in AI chat:', error)
    return null
  }
}

export async function moderateComment(comment: string) {
  if (!process.env.GEMINI_API_KEY) {
    return { isAppropriate: true, reason: '', toxicityScore: 0 }
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `Проверь следующий комментарий на соответствие правилам сообщества. Комментарий должен быть конструктивным, без оскорблений и спама.

Комментарий: "${comment}"

Ответь в формате JSON:
{
  "isAppropriate": true или false,
  "reason": "причина если неуместен",
  "toxicityScore": число от 0 до 10
}

Отвечай ТОЛЬКО валидным JSON.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return { isAppropriate: true, reason: '', toxicityScore: 0 }
  } catch (error) {
    console.error('Error moderating comment with Gemini:', error)
    return { isAppropriate: true, reason: '', toxicityScore: 0 }
  }
}
