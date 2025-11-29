import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { 
  ArrowLeft, ThumbsUp, ThumbsDown, MessageCircle, MapPin, Calendar, 
  Coins, Building2, User, Send, AlertCircle, CheckCircle, Loader2,
  TrendingUp, AlertTriangle, Lightbulb, Target, Brain
} from 'lucide-react'
import AIAnalysisModal from '../../components/AIAnalysisModal'

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

export default function ProjectDetail() {
  const { data: session } = useSession()
  const router = useRouter()
  const { id } = router.query
  
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [comment, setComment] = useState('')
  const [commenting, setCommenting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [userVote, setUserVote] = useState<boolean | null>(null)
  const [showAIModal, setShowAIModal] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`)
      const data = await res.json()
      setProject(data)
      
      if (session && data.votes) {
        const vote = data.votes.find((v: any) => v.user.id === (session.user as any)?.id)
        if (vote) {
          setUserVote(vote.isFor)
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (isFor: boolean) => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    setVoting(true)
    setError('')

    try {
      const res = await fetch(`/api/projects/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFor })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setSuccess('Ваш голос учтен!')
      setUserVote(isFor)
      fetchProject()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setVoting(false)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      router.push('/auth/login')
      return
    }

    setCommenting(true)
    setError('')

    try {
      const res = await fetch(`/api/projects/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setSuccess(data.message)
      setComment('')
      fetchProject()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCommenting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Проект не найден</h2>
        <Link href="/projects" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Вернуться к проектам
        </Link>
      </div>
    )
  }

  const status = statusLabels[project.status] || { label: project.status, color: 'bg-gray-100' }
  const category = categoryLabels[project.category] || project.category
  const totalVotes = project.votesFor + project.votesAgainst
  const approvalPercent = totalVotes > 0 ? Math.round((project.votesFor / totalVotes) * 100) : 0

  const parseJsonSafe = (jsonString: string | null): string[] => {
    if (!jsonString) return []
    try {
      return JSON.parse(jsonString)
    } catch {
      return []
    }
  }
  
  const aiPros = parseJsonSafe(project.aiPros)
  const aiCons = parseJsonSafe(project.aiCons)
  const aiRisks = parseJsonSafe(project.aiRisks)
  const aiAdvantages = parseJsonSafe(project.aiInvestmentAdvantages)

  return (
    <>
      <Head>
        <title>{project.title} - Мой Петропавловск</title>
      </Head>

      <Link href="/projects" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад к проектам
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                {category}
              </span>
              {project.isCompanyProject && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 flex items-center">
                  <Building2 className="w-4 h-4 mr-1" />
                  Коммерческий
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <span className="flex items-center">
                {project.isCompanyProject ? (
                  <>
                    <Building2 className="w-4 h-4 mr-1" />
                    {project.author.companyName || project.author.name}
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-1" />
                    {project.author.name}
                  </>
                )}
              </span>
              {project.location && (
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {project.location}
                </span>
              )}
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(project.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
            </div>

            {project.benefits && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Преимущества проекта</h3>
                <p className="text-green-800">{project.benefits}</p>
              </div>
            )}

            {project.imageUrl && (
              <div className="mt-6">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full max-h-96 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {(project.aiEstimatedBudget || project.estimatedBudget) && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Coins className="w-4 h-4 mr-2" />
                    {project.aiEstimatedBudget ? 'AI оценка бюджета' : 'Бюджет'}
                  </div>
                  <p className="font-semibold text-gray-900">
                    {new Intl.NumberFormat('ru-RU').format(project.aiEstimatedBudget || project.estimatedBudget)} тенге
                  </p>
                </div>
              )}
              {project.timeline && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Сроки
                  </div>
                  <p className="font-semibold text-gray-900">{project.timeline}</p>
                </div>
              )}
              {project.targetAudience && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <User className="w-4 h-4 mr-2" />
                    Аудитория
                  </div>
                  <p className="font-semibold text-gray-900">{project.targetAudience}</p>
                </div>
              )}
            </div>
          </div>

          {project.aiAnalysis && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2 text-yellow-500" />
                AI-анализ проекта
              </h2>

              <p className="text-gray-700 mb-6">{project.aiAnalysis}</p>

              <div className="grid md:grid-cols-2 gap-6">
                {aiPros.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Преимущества
                    </h3>
                    <ul className="space-y-2">
                      {aiPros.map((pro: string, i: number) => (
                        <li key={i} className="text-green-800 text-sm flex items-start">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiCons.length > 0 && (
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-semibold text-orange-900 mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Недостатки
                    </h3>
                    <ul className="space-y-2">
                      {aiCons.map((con: string, i: number) => (
                        <li key={i} className="text-orange-800 text-sm flex items-start">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiRisks.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Риски
                    </h3>
                    <ul className="space-y-2">
                      {aiRisks.map((risk: string, i: number) => (
                        <li key={i} className="text-red-800 text-sm flex items-start">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiAdvantages.length > 0 && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Для инвесторов
                    </h3>
                    <ul className="space-y-2">
                      {aiAdvantages.map((adv: string, i: number) => (
                        <li key={i} className="text-purple-800 text-sm flex items-start">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                          {adv}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageCircle className="w-6 h-6 mr-2" />
              Комментарии ({project.comments?.length || 0})
            </h2>

            {session && (
              <form onSubmit={handleComment} className="mb-6">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Напишите комментарий..."
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">{comment.length}/3 символов (минимум)</span>
                  <button
                    type="submit"
                    disabled={commenting || comment.length < 3}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {commenting ? 'Отправка...' : 'Отправить'}
                  </button>
                </div>
              </form>
            )}

            {project.comments?.length > 0 ? (
              <div className="space-y-4">
                {project.comments.map((c: any) => (
                  <div key={c.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{c.user.name}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-gray-700">{c.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Пока нет комментариев</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {success}
            </div>
          )}

          {project.status === 'VOTING' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Голосование</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Результаты</span>
                  <span className="font-medium">{approvalPercent}% за</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600"
                    style={{ width: `${approvalPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-green-600 flex items-center">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {project.votesFor}
                  </span>
                  <span className="text-red-600 flex items-center">
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    {project.votesAgainst}
                  </span>
                </div>
              </div>

              {userVote !== null ? (
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-blue-900 font-medium">
                    Вы проголосовали {userVote ? 'ЗА' : 'ПРОТИВ'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleVote(true)}
                    disabled={voting || !session}
                    className="bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <ThumbsUp className="w-5 h-5 mr-2" />
                    За
                  </button>
                  <button
                    onClick={() => handleVote(false)}
                    disabled={voting || !session}
                    className="bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <ThumbsDown className="w-5 h-5 mr-2" />
                    Против
                  </button>
                </div>
              )}

              {!session && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  <Link href="/auth/login" className="text-blue-600 hover:text-blue-700">
                    Войдите
                  </Link>, чтобы голосовать
                </p>
              )}
            </div>
          )}

          {project.status === 'FUNDRAISING' && project.fundraisingGoal && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Сбор средств</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Собрано</span>
                  <span className="font-medium">
                    {Math.round((project.fundraisingRaised / project.fundraisingGoal) * 100)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                    style={{ width: `${Math.min(100, (project.fundraisingRaised / project.fundraisingGoal) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-center mb-4">
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('ru-RU').format(project.fundraisingRaised)} тенге
                </p>
                <p className="text-gray-600">
                  из {new Intl.NumberFormat('ru-RU').format(project.fundraisingGoal)} тенге
                </p>
              </div>

              <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700">
                Поддержать проект
              </button>
            </div>
          )}

          {project.curator && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Куратор проекта</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{project.curator.name}</p>
                  <p className="text-sm text-gray-600">Ответственный за реализацию</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-indigo-500" />
              AI-анализ
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Получите детальный анализ проекта от искусственного интеллекта: преимущества, риски и рекомендации для инвесторов
            </p>
            <button
              onClick={() => setShowAIModal(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center"
            >
              <Brain className="w-5 h-5 mr-2" />
              Открыть AI-анализ
            </button>
          </div>
        </div>
      </div>

      <AIAnalysisModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        projectId={project.id}
        projectTitle={project.title}
        existingAnalysis={project.aiAnalysis ? {
          summary: project.aiAnalysis,
          pros: aiPros,
          cons: aiCons,
          risks: aiRisks,
          investmentAdvantages: aiAdvantages
        } : null}
      />
    </>
  )
}
