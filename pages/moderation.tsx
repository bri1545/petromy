import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { 
  Shield, FileText, MessageCircle, CheckCircle, XCircle, 
  Loader2, Eye, Brain, User, Building2, Play, Ban
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

const parseJsonSafe = (jsonString: string | null | undefined): string[] => {
  if (!jsonString) return []
  try {
    return JSON.parse(jsonString)
  } catch {
    return []
  }
}

export default function Moderation() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'projects' | 'all_projects' | 'comments'>('projects')
  const [projects, setProjects] = useState([])
  const [allProjects, setAllProjects] = useState([])
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
      } else if (activeTab === 'all_projects') {
        setAllProjects(data)
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
      const res = await fetch('/api/moderation/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'project', id: projectId, action: 'analyze' })
      })
      const data = await res.json()
      if (data.success) {
        fetchData()
      }
    } catch (error) {
      console.error('Error analyzing:', error)
    } finally {
      setAnalyzing(null)
    }
  }

  if (authStatus === 'loading' || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#2563eb', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  const buttonStyle = (color: string, hoverColor: string) => ({
    backgroundColor: color,
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem'
  })

  return (
    <>
      <Head>
        <title>Модерация - Мой Петропавловск</title>
      </Head>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
          <Shield style={{ width: '32px', height: '32px', color: '#2563eb', marginRight: '0.75rem' }} />
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>Панель модерации</h1>
        </div>
        <p style={{ color: '#64748b' }}>Проверяйте и одобряйте проекты и комментарии</p>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              fontWeight: '500',
              color: activeTab === 'projects' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'projects' ? '2px solid #2563eb' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <FileText style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
            На модерации ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('all_projects')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              fontWeight: '500',
              color: activeTab === 'all_projects' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'all_projects' ? '2px solid #2563eb' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Shield style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
            Активные проекты ({allProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              fontWeight: '500',
              color: activeTab === 'comments' ? '#2563eb' : '#64748b',
              borderBottom: activeTab === 'comments' ? '2px solid #2563eb' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <MessageCircle style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
            Комментарии ({comments.length})
          </button>
        </div>
      </div>

      {activeTab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {projects.length === 0 ? (
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '3rem', textAlign: 'center' }}>
              <CheckCircle style={{ width: '64px', height: '64px', color: '#86efac', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>Все проекты проверены</h3>
              <p style={{ color: '#64748b' }}>Нет проектов, ожидающих модерации</p>
            </div>
          ) : (
            projects.map((project: any) => (
              <div key={project.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#eff6ff', color: '#1e40af' }}>
                        {categoryLabels[project.category] || project.category}
                      </span>
                      {project.isCompanyProject && (
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center' }}>
                          <Building2 style={{ width: '12px', height: '12px', marginRight: '0.25rem' }} />
                          Компания
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{project.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                      <User style={{ width: '16px', height: '16px', marginRight: '0.25rem' }} />
                      {project.author?.companyName || project.author?.name}
                    </div>
                  </div>
                  <Link
                    href={`/projects/${project.id}`}
                    style={{ color: '#2563eb', display: 'flex', alignItems: 'center', textDecoration: 'none', fontSize: '0.875rem' }}
                  >
                    <Eye style={{ width: '16px', height: '16px', marginRight: '0.25rem' }} />
                    Просмотр
                  </Link>
                </div>

                <p style={{ color: '#475569', marginBottom: '1rem', lineHeight: '1.6' }}>{project.description?.substring(0, 300)}...</p>

                {project.aiAnalysis && (
                  <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #bfdbfe' }}>
                    <h4 style={{ fontWeight: '500', color: '#1e40af', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                      <Brain style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} />
                      AI-анализ
                    </h4>
                    <p style={{ color: '#1e40af', fontSize: '0.875rem' }}>{project.aiAnalysis}</p>
                    
                    {project.aiPros && parseJsonSafe(project.aiPros).length > 0 && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <strong style={{ color: '#059669', fontSize: '0.875rem' }}>Плюсы:</strong>
                        <ul style={{ margin: '0.25rem 0 0 1rem', color: '#475569', fontSize: '0.875rem' }}>
                          {parseJsonSafe(project.aiPros).map((pro: string, i: number) => (
                            <li key={i}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {project.aiCons && parseJsonSafe(project.aiCons).length > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <strong style={{ color: '#dc2626', fontSize: '0.875rem' }}>Минусы:</strong>
                        <ul style={{ margin: '0.25rem 0 0 1rem', color: '#475569', fontSize: '0.875rem' }}>
                          {parseJsonSafe(project.aiCons).map((con: string, i: number) => (
                            <li key={i}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {project.aiRisks && parseJsonSafe(project.aiRisks).length > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <strong style={{ color: '#d97706', fontSize: '0.875rem' }}>Риски:</strong>
                        <ul style={{ margin: '0.25rem 0 0 1rem', color: '#475569', fontSize: '0.875rem' }}>
                          {parseJsonSafe(project.aiRisks).map((risk: string, i: number) => (
                            <li key={i}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {!project.aiAnalysis && (
                    <button
                      onClick={() => handleAnalyze(project.id)}
                      disabled={analyzing === project.id}
                      style={{ ...buttonStyle('#6366f1', '#4f46e5'), opacity: analyzing === project.id ? 0.5 : 1 }}
                    >
                      {analyzing === project.id ? (
                        <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <Brain style={{ width: '16px', height: '16px' }} />
                      )}
                      AI-анализ
                    </button>
                  )}

                  <button
                    onClick={() => handleAction('project', project.id, 'approve')}
                    disabled={processing === project.id}
                    style={{ ...buttonStyle('#22c55e', '#16a34a'), opacity: processing === project.id ? 0.5 : 1 }}
                  >
                    <CheckCircle style={{ width: '16px', height: '16px' }} />
                    Одобрить
                  </button>

                  <button
                    onClick={() => handleAction('project', project.id, 'start_voting')}
                    disabled={processing === project.id}
                    style={{ ...buttonStyle('#2563eb', '#1d4ed8'), opacity: processing === project.id ? 0.5 : 1 }}
                  >
                    <Play style={{ width: '16px', height: '16px' }} />
                    Запустить голосование
                  </button>

                  <button
                    onClick={() => {
                      const notes = prompt('Причина отклонения:')
                      if (notes) handleAction('project', project.id, 'reject', notes)
                    }}
                    disabled={processing === project.id}
                    style={{ ...buttonStyle('#ef4444', '#dc2626'), opacity: processing === project.id ? 0.5 : 1 }}
                  >
                    <XCircle style={{ width: '16px', height: '16px' }} />
                    Отклонить
                  </button>

                  <button
                    onClick={() => {
                      const notes = prompt('Причина закрытия проекта:')
                      if (notes) handleAction('project', project.id, 'close', notes)
                    }}
                    disabled={processing === project.id}
                    style={{ ...buttonStyle('#71717a', '#52525b'), opacity: processing === project.id ? 0.5 : 1 }}
                  >
                    <Ban style={{ width: '16px', height: '16px' }} />
                    Закрыть проект
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'all_projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {allProjects.length === 0 ? (
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '3rem', textAlign: 'center' }}>
              <Shield style={{ width: '64px', height: '64px', color: '#c7d2fe', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>Нет активных проектов</h3>
              <p style={{ color: '#64748b' }}>Активные проекты отсутствуют</p>
            </div>
          ) : (
            allProjects.map((project: any) => (
              <div key={project.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '500', 
                        backgroundColor: project.status === 'VOTING' ? '#dbeafe' : project.status === 'FUNDRAISING' ? '#f3e8ff' : '#dcfce7',
                        color: project.status === 'VOTING' ? '#1e40af' : project.status === 'FUNDRAISING' ? '#6b21a8' : '#166534'
                      }}>
                        {project.status === 'VOTING' ? 'Голосование' : project.status === 'FUNDRAISING' ? 'Сбор средств' : project.status === 'IN_PROGRESS' ? 'В работе' : 'Одобрен'}
                      </span>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#eff6ff', color: '#1e40af' }}>
                        {categoryLabels[project.category] || project.category}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{project.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                      <User style={{ width: '16px', height: '16px', marginRight: '0.25rem' }} />
                      {project.author?.companyName || project.author?.name}
                    </div>
                  </div>
                  <Link
                    href={`/projects/${project.id}`}
                    style={{ color: '#2563eb', display: 'flex', alignItems: 'center', textDecoration: 'none', fontSize: '0.875rem' }}
                  >
                    <Eye style={{ width: '16px', height: '16px', marginRight: '0.25rem' }} />
                    Просмотр
                  </Link>
                </div>

                <p style={{ color: '#475569', marginBottom: '1rem', lineHeight: '1.6' }}>{project.description?.substring(0, 200)}...</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      const notes = prompt('Причина закрытия проекта:')
                      if (notes) handleAction('project', project.id, 'close', notes)
                    }}
                    disabled={processing === project.id}
                    style={{ ...buttonStyle('#ef4444', '#dc2626'), opacity: processing === project.id ? 0.5 : 1 }}
                  >
                    <Ban style={{ width: '16px', height: '16px' }} />
                    Закрыть проект
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {comments.length === 0 ? (
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '3rem', textAlign: 'center' }}>
              <CheckCircle style={{ width: '64px', height: '64px', color: '#86efac', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>Все комментарии проверены</h3>
              <p style={{ color: '#64748b' }}>Нет комментариев, ожидающих модерации</p>
            </div>
          ) : (
            comments.map((comment: any) => (
              <div key={comment.id} style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <Link
                      href={`/projects/${comment.project?.id}`}
                      style={{ color: '#2563eb', fontWeight: '500', textDecoration: 'none' }}
                    >
                      {comment.project?.title}
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                      <User style={{ width: '16px', height: '16px', marginRight: '0.25rem' }} />
                      {comment.user?.name}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                    {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>

                <p style={{ color: '#475569', marginBottom: '1rem' }}>{comment.content}</p>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleAction('comment', comment.id, 'approve')}
                    disabled={processing === comment.id}
                    style={{ ...buttonStyle('#22c55e', '#16a34a'), opacity: processing === comment.id ? 0.5 : 1 }}
                  >
                    <CheckCircle style={{ width: '16px', height: '16px' }} />
                    Одобрить
                  </button>

                  <button
                    onClick={() => handleAction('comment', comment.id, 'reject')}
                    disabled={processing === comment.id}
                    style={{ ...buttonStyle('#ef4444', '#dc2626'), opacity: processing === comment.id ? 0.5 : 1 }}
                  >
                    <XCircle style={{ width: '16px', height: '16px' }} />
                    Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
