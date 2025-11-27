import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { 
  Shield, FileText, MessageCircle, CheckCircle, XCircle, 
  Loader2, Eye, Brain, AlertCircle, User, Building2 
} from 'lucide-react'

const categoryLabels: Record<string, string> = {
  INFRASTRUCTURE: 'Инфраструктура',
  BEAUTIFICATION: 'Благоустройство',
  SOCIAL: 'Социальные',
  COMMERCIAL: 'Коммерция',
  ENVIRONMENTAL: 'Экология',
  CULTURAL: 'Культура',
  SPORTS: 'Спорт',
  EDUCATION: 'Образование',
  HEALTHCARE: 'Здравоохранение',
  OTHER: 'Другое'
}

export default function Moderation() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'projects' | 'comments'>('projects')
  const [projects, setProjects] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState<string | null>(null)

  useEffect(() => {
    if (authStatus === 'authenticated') {
      const role = (session?.user as any)?.role
      if (!['MODERATOR', 'ADMIN'].includes(role)) {
        router.push('/')
        return
      }
      fetchData()
    }
  }, [authStatus, activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/moderation?type=${activeTab}`)
      const data = await res.json()
      
      if (activeTab === 'projects') {
        setProjects(data)
      } else {
        setComments(data)
      }
    } catch (error) {
      console.error('Error fetching moderation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (type: string, id: string, action: string, notes?: string) => {
    setProcessing(id)
    try {
      await fetch('/api/moderation/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, action, notes })
      })
      fetchData()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setProcessing(null)
    }
  }

  const handleAnalyze = async (projectId: string) => {
    setAnalyzing(projectId)
    try {
      await fetch(`/api/projects/${projectId}/analyze`, {
        method: 'POST'
      })
      fetchData()
    } catch (error) {
      console.error('Error analyzing:', error)
    } finally {
      setAnalyzing(null)
    }
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
        <title>Модерация - Мой Петропавловск</title>
      </Head>

      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Shield className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Панель модерации</h1>
        </div>
        <p className="text-gray-600">Проверяйте и одобряйте проекты и комментарии</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center px-6 py-4 font-medium ${
              activeTab === 'projects'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-5 h-5 mr-2" />
            Проекты ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex items-center px-6 py-4 font-medium ${
              activeTab === 'comments'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Комментарии ({comments.length})
          </button>
        </div>
      </div>

      {activeTab === 'projects' && (
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Все проекты проверены</h3>
              <p className="text-gray-600">Нет проектов, ожидающих модерации</p>
            </div>
          ) : (
            projects.map((project: any) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {categoryLabels[project.category] || project.category}
                      </span>
                      {project.isCompanyProject && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          Компания
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4 mr-1" />
                      {project.author.companyName || project.author.name} ({project.author.email})
                    </div>
                  </div>
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Просмотр
                  </Link>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>

                {project.aiAnalysis && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      AI-анализ
                    </h4>
                    <p className="text-blue-800 text-sm">{project.aiAnalysis}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {!project.aiAnalysis && (
                    <button
                      onClick={() => handleAnalyze(project.id)}
                      disabled={analyzing === project.id}
                      className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-purple-200 disabled:opacity-50 flex items-center"
                    >
                      {analyzing === project.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Brain className="w-4 h-4 mr-2" />
                      )}
                      AI-анализ
                    </button>
                  )}

                  <button
                    onClick={() => handleAction('project', project.id, 'approve')}
                    disabled={processing === project.id}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Одобрить
                  </button>

                  <button
                    onClick={() => handleAction('project', project.id, 'start_voting')}
                    disabled={processing === project.id}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center"
                  >
                    Запустить голосование
                  </button>

                  <button
                    onClick={() => {
                      const notes = prompt('Причина отклонения:')
                      if (notes) handleAction('project', project.id, 'reject', notes)
                    }}
                    disabled={processing === project.id}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 flex items-center"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Отклонить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Все комментарии проверены</h3>
              <p className="text-gray-600">Нет комментариев, ожидающих модерации</p>
            </div>
          ) : (
            comments.map((comment: any) => (
              <div key={comment.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Link
                      href={`/projects/${comment.project.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {comment.project.title}
                    </Link>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4 mr-1" />
                      {comment.user.name} ({comment.user.email})
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{comment.content}</p>

                {comment.aiModerationResult && (
                  <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-yellow-800">
                      AI-модерация: {comment.aiModerationResult}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction('comment', comment.id, 'approve')}
                    disabled={processing === comment.id}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Одобрить
                  </button>

                  <button
                    onClick={() => handleAction('comment', comment.id, 'reject')}
                    disabled={processing === comment.id}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 flex items-center"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  )
}
