import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { User, Mail, Phone, Building2, Coins, FileText, Vote, MessageCircle, Loader2, Save, CheckCircle, Trash2, Eye, Clock, AlertCircle, ThumbsUp } from 'lucide-react'

interface Project {
  id: string
  title: string
  status: string
  votesFor: number
  votesAgainst: number
  createdAt: string
  _count: {
    votes: number
    comments: number
  }
}

export default function Profile() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  })

  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchProfile()
      fetchProjects()
    }
  }, [authStatus])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      const data = await res.json()
      setProfile(data)
      setFormData({
        name: data.name || '',
        phone: data.phone || ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/user/projects')
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.')) return

    setDeleting(projectId)
    try {
      const res = await fetch('/api/user/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Ошибка при удалении проекта')
        return
      }

      fetchProjects()
      fetchProfile()
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Ошибка при удалении проекта')
    } finally {
      setDeleting(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string, color: string, icon: any }> = {
      'DRAFT': { label: 'Черновик', color: 'bg-gray-100 text-gray-700', icon: FileText },
      'PENDING_MODERATION': { label: 'На модерации', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      'REJECTED': { label: 'Отклонён', color: 'bg-red-100 text-red-700', icon: AlertCircle },
      'APPROVED': { label: 'Одобрен', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      'VOTING': { label: 'Голосование', color: 'bg-blue-100 text-blue-700', icon: Vote },
      'FUNDRAISING': { label: 'Сбор средств', color: 'bg-purple-100 text-purple-700', icon: Coins },
      'IN_PROGRESS': { label: 'В работе', color: 'bg-indigo-100 text-indigo-700', icon: Clock },
      'COMPLETED': { label: 'Завершён', color: 'bg-green-100 text-green-700', icon: CheckCircle }
    }
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700', icon: FileText }
  }

  const canDelete = (status: string) => {
    const allowedStatuses = ['DRAFT', 'PENDING_MODERATION', 'REJECTED', 'COMPLETED']
    return allowedStatuses.includes(status)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
        fetchProfile()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (authStatus === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  const isCompany = profile?.role === 'COMPANY'

  return (
    <>
      <Head>
        <title>Профиль - Мой Петропавловск</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Мой профиль</h1>
          <p className="text-gray-600 mt-1">Управляйте данными вашего аккаунта</p>
        </div>

        <div className="grid gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mr-6">
                {isCompany ? (
                  <Building2 className="w-10 h-10 text-blue-600" />
                ) : (
                  <User className="w-10 h-10 text-blue-600" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                <p className="text-gray-600">{profile?.email}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isCompany ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {isCompany ? 'Компания' : 'Гражданин'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Coins className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{profile?.tokens || 0}</p>
                <p className="text-sm text-gray-600">Токены</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{profile?._count?.projects || 0}</p>
                <p className="text-sm text-gray-600">Проекты</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Vote className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{profile?._count?.votes || 0}</p>
                <p className="text-sm text-gray-600">Голоса</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{profile?._count?.comments || 0}</p>
                <p className="text-sm text-gray-600">Комментарии</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Редактировать профиль</h3>

            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Профиль успешно обновлен
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Email нельзя изменить</p>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Имя
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {isCompany && profile?.companyName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название компании
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={profile.companyName}
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+7 777 123 4567"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Сохранить изменения
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Мои проекты</h3>
              <Link
                href="/projects/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 text-sm"
              >
                Подать проект
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>У вас пока нет проектов</p>
                <p className="text-sm mt-2">Подайте свой первый проект для развития города</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => {
                  const status = getStatusBadge(project.status)
                  const StatusIcon = status.icon
                  return (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Link
                              href={`/projects/${project.id}`}
                              className="font-semibold text-gray-900 hover:text-blue-600"
                            >
                              {project.title}
                            </Link>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              {project.votesFor} за / {project.votesAgainst} против
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {project._count.comments} комментариев
                            </span>
                            <span>
                              {new Date(project.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Link
                            href={`/projects/${project.id}`}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Просмотр"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          {canDelete(project.status) && (
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              disabled={deleting === project.id}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                              title="Удалить проект"
                            >
                              {deleting === project.id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {projects.length > 0 && (
              <p className="text-xs text-gray-500 mt-4">
                * Удалить можно только черновики, проекты на модерации, отклонённые или завершённые проекты
              </p>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-6 text-center text-sm text-gray-600">
            <p>Дата регистрации: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('ru-RU') : 'Н/Д'}</p>
          </div>
        </div>
      </div>
    </>
  )
}
