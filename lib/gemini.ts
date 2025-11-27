import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function analyzeProject(project: {
  title: string
  description: string
  category: string
  estimatedBudget?: number | null
  location?: string | null
  benefits?: string | null
  isCompanyProject: boolean
}) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `Проанализируй следующий городской проект для города Петропавловск и предоставь структурированный анализ на русском языке:

Название: ${project.title}
Описание: ${project.description}
Категория: ${project.category}
${project.estimatedBudget ? `Примерный бюджет: ${project.estimatedBudget} тенге` : ''}
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
  "feasibilityScore": 7,
  "recommendation": "Рекомендация для модераторов"
}

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

export async function moderateComment(comment: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

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
