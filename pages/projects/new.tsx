import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { FileText, MapPin, Coins, Users, Clock, AlertCircle, CheckCircle, ArrowLeft, Send } from 'lucide-react'

const categories = [
  { value: 'INFRASTRUCTURE', label: 'Инфраструктура', desc: 'Дороги, мосты, сети' },
  { value: 'BEAUTIFICATION', label: 'Благоустройство', desc: 'Парки, скверы, озеленение' },
  { value: 'SOCIAL', label: 'Социальные', desc: 'Помощь населению' },
  { value: 'COMMERCIAL', label: 'Коммерция', desc: 'ТЦ, рынки, бизнес' },
  { value: 'ENVIRONMENTAL', label: 'Экология', desc: 'Чистота, переработка' },
  { value: 'CULTURAL', label: 'Культура', desc: 'Музеи, театры, события' },
  { value: 'SPORTS', label: 'Спорт', desc: 'Площадки, клубы' },
  { value: 'EDUCATION', label: 'Образование', desc: 'Школы, курсы' },
  { value: 'HEALTHCARE', label: 'Здравоохранение', desc: 'Больницы, клиники' },
  { value: 'OTHER', label: 'Другое', desc: 'Прочие инициативы' }
]

export default function NewProject() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    estimatedBudget: '',
    location: '',
    timeline: '',
    benefits: '',
    targetAudience: ''
  })

  if (status === 'loading') {
    return <div className="text-center py-20">Загрузка...</div>
  }

  if (!session) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Необходима авторизация</h2>
        <p className="text-gray-600 mb-6">Войдите или зарегистрируйтесь, чтобы подать проект</p>
        <Link href="/auth/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
          Войти
        </Link>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.title.length < 10) {
      setError('Название должно быть минимум 10 символов')
      return
    }

    if (formData.description.length < 100) {
      setError('Описание должно быть минимум 100 символов')
      return
    }

    if (!formData.category) {
      setError('Выберите категорию проекта')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка при создании проекта')
      }

      router.push('/dashboard?submitted=true')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isCompany = (session.user as any)?.role === 'COMPANY'

  return (
    <>
      <Head>
        <title>Новый проект - Мой Петропавловск</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <Link href="/projects" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к проектам
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {isCompany ? 'Подача коммерческого проекта' : 'Подача гражданской инициативы'}
            </h1>
            <p className="text-gray-600 mt-2">
              Заполните форму максимально подробно. Проект будет проверен модераторами.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Название проекта *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Например: Благоустройство парка на ул. Ленина"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Минимум 10 символов</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      formData.category === cat.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium block">{cat.label}</span>
                    <span className="text-xs text-gray-500">{cat.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Описание проекта *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Опишите подробно суть проекта, его цели, ожидаемые результаты..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/100 символов (минимум 100)
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Местоположение
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ул. Ленина, 15"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="estimatedBudget" className="block text-sm font-medium text-gray-700 mb-2">
                  Примерный бюджет (тенге)
                </label>
                <div className="relative">
                  <Coins className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    id="estimatedBudget"
                    name="estimatedBudget"
                    type="number"
                    value={formData.estimatedBudget}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1000000"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                  Сроки реализации
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    id="timeline"
                    name="timeline"
                    type="text"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="3-6 месяцев"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                  Целевая аудитория
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    id="targetAudience"
                    name="targetAudience"
                    type="text"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Жители микрорайона"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                Преимущества проекта
              </label>
              <textarea
                id="benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Какую пользу принесет проект городу и жителям?"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">После подачи:</p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>Проект проверяется модераторами</li>
                    <li>AI анализирует плюсы, минусы и риски</li>
                    <li>После одобрения открывается голосование</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                'Отправка...'
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Отправить на модерацию
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
