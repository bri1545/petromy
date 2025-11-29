import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Settings, Users, FileText, Vote, Calendar, Coins, Loader2, Shield, Plus, Play, Pause, Trash2, Edit2, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Period {
  id: string
  type: string
  title: string
  description?: string
  startDate: string
  endDate: string
  isActive: boolean
  endedEarly: boolean
}

export default function Admin() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [periods, setPeriods] = useState<Period[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'SUBMISSION',
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalVotes: 0,
    pendingProjects: 0
  })

  useEffect(() => {
    if (authStatus === 'authenticated') {
      const role = (session?.user as any)?.role
      if (role !== 'ADMIN' && role !== 'MODERATOR') {
        router.push('/')
        return
      }
      fetchPeriods()
      setLoading(false)
    }
  }, [authStatus])

  const fetchPeriods = async () => {
    try {
      const res = await fetch('/api/periods')
      const data = await res.json()
      setPeriods(data)
    } catch (err) {
      console.error('Error fetching periods:', err)
    }
  }

  const handleCreatePeriod = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/periods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка при создании периода')
        return
      }

      setShowCreateForm(false)
      setFormData({
        type: 'SUBMISSION',
        title: '',
        description: '',
        startDate: '',
        endDate: ''
      })
      fetchPeriods()
    } catch (err) {
      setError('Ошибка при создании периода')
    } finally {
      setSaving(false)
    }
  }

  const handleEndEarly = async (id: string) => {
    if (!confirm('Вы уверены, что хотите досрочно завершить этот период?')) return

    try {
      await fetch(`/api/periods/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endEarly: true })
      })
      fetchPeriods()
    } catch (err) {
      console.error('Error ending period:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот период?')) return

    try {
      await fetch(`/api/periods/${id}`, { method: 'DELETE' })
      fetchPeriods()
    } catch (err) {
      console.error('Error deleting period:', err)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isActive = (period: Period) => {
    if (period.endedEarly) return false
    const now = new Date()
    const start = new Date(period.startDate)
    const end = new Date(period.endDate)
    return period.isActive && now >= start && now <= end
  }

  const isPast = (period: Period) => {
    if (period.endedEarly) return true
    return new Date() > new Date(period.endDate)
  }

  const isFuture = (period: Period) => {
    return new Date() < new Date(period.startDate) && !period.endedEarly
  }

  if (authStatus === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Администрирование - Мой Петропавловск</title>
      </Head>

      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Settings className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Администрирование</h1>
        </div>
        <p className="text-gray-600">Управление платформой и настройками</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Пользователи</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Проекты</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <Vote className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Голоса</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">На модерации</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingProjects}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Управление периодами
          </h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Создать период
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Новый период</h3>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleCreatePeriod} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип периода
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SUBMISSION">Приём проектов</option>
                  <option value="VOTING">Голосование</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Например: Весенний приём 2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата начала
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата окончания
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание (необязательно)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Дополнительная информация о периоде..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  Создать
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {periods.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Периоды пока не созданы</p>
            <p className="text-sm mt-2">Создайте период подачи проектов или голосования</p>
          </div>
        ) : (
          <div className="space-y-4">
            {periods.map((period) => (
              <div
                key={period.id}
                className={`border rounded-xl p-4 ${
                  isActive(period)
                    ? 'border-green-300 bg-green-50'
                    : isPast(period)
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      period.type === 'SUBMISSION' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {period.type === 'SUBMISSION' ? (
                        <FileText className={`w-5 h-5 ${period.type === 'SUBMISSION' ? 'text-green-600' : 'text-yellow-600'}`} />
                      ) : (
                        <Vote className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{period.title}</h3>
                        {isActive(period) && (
                          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Play className="w-3 h-3" /> Активен
                          </span>
                        )}
                        {isFuture(period) && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Ожидает
                          </span>
                        )}
                        {isPast(period) && (
                          <span className="bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Завершён
                          </span>
                        )}
                        {period.endedEarly && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                            Досрочно
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {period.type === 'SUBMISSION' ? 'Приём проектов' : 'Голосование'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(period.startDate)} — {formatDate(period.endDate)}
                      </p>
                      {period.description && (
                        <p className="text-sm text-gray-600 mt-2">{period.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isActive(period) && (
                      <button
                        onClick={() => handleEndEarly(period.id)}
                        className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg"
                        title="Завершить досрочно"
                      >
                        <Pause className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(period.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      title="Удалить"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Coins className="w-5 h-5 mr-2 text-yellow-600" />
            Настройки токенов
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Токены при регистрации</span>
                <span className="font-semibold text-gray-900">5</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Токены за одобренный комментарий</span>
                <span className="font-semibold text-gray-900">1</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Токены за одобренный проект</span>
                <span className="font-semibold text-gray-900">3</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Стоимость голоса</span>
                <span className="font-semibold text-gray-900">1 токен</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Подсказка</h3>
          <p className="text-gray-600 mb-4">
            Используйте периоды для контроля подачи проектов и голосования:
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-green-600 mt-0.5" />
              <span><strong>Приём проектов</strong> — в этот период пользователи могут подавать новые проекты</span>
            </li>
            <li className="flex items-start gap-2">
              <Vote className="w-4 h-4 text-yellow-600 mt-0.5" />
              <span><strong>Голосование</strong> — в этот период пользователи могут голосовать за проекты</span>
            </li>
            <li className="flex items-start gap-2">
              <Pause className="w-4 h-4 text-orange-600 mt-0.5" />
              <span><strong>Досрочное завершение</strong> — вы можете завершить любой период раньше срока</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
