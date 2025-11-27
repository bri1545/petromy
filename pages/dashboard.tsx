import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { FileText, Vote, MessageCircle, Coins, Plus, User, Building2, Loader2, CheckCircle } from 'lucide-react'
import ProjectCard from '../components/ProjectCard'

const statusLabels: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Черновик', color: 'bg-gray-100 text-gray-800' },
  PENDING_MODERATION: { label: 'На модерации', color: 'bg-yellow-100 text-yellow-800' },
  MODERATION_REJECTED: { label: 'Отклонен', color: 'bg-red-100 text-red-800' },
  APPROVED: { label: 'Одобрен', color: 'bg-green-100 text-green-800' },
  VOTING: { label: 'Голосование', color: 'bg-blue-100 text-blue-800' },
  FUNDRAISING: { label: 'Сбор средств', color: 'bg-purple-100 text-purple-800' },
  IN_PROGRESS: { label: 'В работе', color: 'bg-indigo-100 text-indigo-800' },
  COMPLETED: { label: 'Завершен', color: 'bg-green-200 text-green-900' },
  CANCELLED: { label: 'Отменен', color: 'bg-gray-200 text-gray-700' }
}

export default function Dashboard() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (router.query.submitted) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    }
  }, [router.query])

  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetchData()
    }
  }, [authStatus])

  const fetchData = async () => {
    try {
      const [profileRes, projectsRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/user/projects')
      ])

      const profileData = await profileRes.json()
      const projectsData = await projectsRes.json()

      setProfile(profileData)
      setProjects(projectsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
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

  const isCompany = (session.user as any)?.role === 'COMPANY'

  return (
    <>
      <Head>
        <title>Личный кабинет - Мой Петропавловск</title>
      </Head>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Проект успешно отправлен на модерацию!
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
        <p className="text-gray-600 mt-1">Управляйте своими проектами и следите за прогрессом</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              {isCompany ? (
                <Building2 className="w-6 h-6 text-blue-600" />
              ) : (
                <User className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">Аккаунт</p>
              <p className="font-semibold text-gray-900">{session.user?.name}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <Coins className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Токены</p>
              <p className="text-2xl font-bold text-gray-900">{profile?.tokens || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{profile?._count?.projects || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{profile?._count?.votes || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Мои проекты</h2>
          <Link
            href="/projects/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Новый проект
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Нет проектов</h3>
            <p className="text-gray-600 mb-4">Подайте свой первый проект для улучшения города</p>
            <Link
              href="/projects/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Подать проект
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Проект</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Статус</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Голоса</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Комментарии</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Дата</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project: any) => {
                  const status = statusLabels[project.status] || { label: project.status, color: 'bg-gray-100' }
                  return (
                    <tr key={project.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link href={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                          {project.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-600">{project.votesFor}</span>
                        {' / '}
                        <span className="text-red-600">{project.votesAgainst}</span>
                      </td>
                      <td className="py-3 px-4">{project._count?.comments || 0}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(project.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Как получить больше токенов?</h3>
        <p className="text-gray-600 mb-4">
          Токены нужны для голосования за проекты. Каждый голос стоит 1 токен.
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            При регистрации вы получаете 5 токенов
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Одобренный комментарий: +1 токен
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Ваш проект одобрен: +3 токена
          </li>
        </ul>
      </div>
    </>
  )
}
