import { useState, useRef, useEffect } from 'react'
import { 
  X, Brain, CheckCircle, AlertTriangle, AlertCircle, Target, Loader2, Send, MessageCircle, User
} from 'lucide-react'

interface AIAnalysis {
  summary: string
  pros: string[]
  cons: string[]
  risks: string[]
  investmentAdvantages: string[]
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AIAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectTitle: string
  existingAnalysis?: AIAnalysis | null
}

export default function AIAnalysisModal({ 
  isOpen, 
  onClose, 
  projectId, 
  projectTitle,
  existingAnalysis 
}: AIAnalysisModalProps) {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(existingAnalysis || null)
  const [error, setError] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [question, setQuestion] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'analysis' | 'chat'>('analysis')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages])

  const fetchAnalysis = async () => {
    if (analysis) return
    
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch(`/api/projects/${projectId}/ai-analysis`, {
        method: 'POST'
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка получения анализа')
      }
      
      setAnalysis(data.analysis)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sendQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!question.trim() || question.trim().length < 3) return
    
    const userMessage: ChatMessage = { role: 'user', content: question.trim() }
    setChatMessages(prev => [...prev, userMessage])
    setQuestion('')
    setChatLoading(true)
    
    try {
      const res = await fetch(`/api/projects/${projectId}/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: userMessage.content,
          chatHistory: chatMessages
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Ошибка получения ответа')
      }
      
      const assistantMessage: ChatMessage = { role: 'assistant', content: data.answer }
      setChatMessages(prev => [...prev, assistantMessage])
    } catch (err: any) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Ошибка: ${err.message}` 
      }])
    } finally {
      setChatLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          maxWidth: '56rem',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Brain style={{ width: '24px', height: '24px', color: '#6366f1', marginRight: '0.75rem' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
              AI-анализ проекта
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              color: '#64748b'
            }}
          >
            <X style={{ width: '24px', height: '24px' }} />
          </button>
        </div>

        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #e2e8f0',
          padding: '0 1.5rem'
        }}>
          <button
            onClick={() => setActiveTab('analysis')}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              color: activeTab === 'analysis' ? '#6366f1' : '#64748b',
              borderBottom: activeTab === 'analysis' ? '2px solid #6366f1' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Brain style={{ width: '18px', height: '18px' }} />
            Анализ
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              color: activeTab === 'chat' ? '#6366f1' : '#64748b',
              borderBottom: activeTab === 'chat' ? '2px solid #6366f1' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <MessageCircle style={{ width: '18px', height: '18px' }} />
            Задать вопрос
          </button>
        </div>

        <div style={{ padding: '1.5rem', overflow: 'auto', flex: 1 }}>
          <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {projectTitle}
          </p>

          {activeTab === 'analysis' && (
            <>
              {!analysis && !loading && !error && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Brain style={{ width: '64px', height: '64px', color: '#c7d2fe', margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1e293b', marginBottom: '0.5rem' }}>
                    Получить AI-анализ
                  </h3>
                  <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                    Нажмите кнопку, чтобы получить детальный анализ проекта от искусственного интеллекта
                  </p>
                  <button
                    onClick={fetchAnalysis}
                    style={{
                      backgroundColor: '#6366f1',
                      color: 'white',
                      padding: '0.75rem 2rem',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Brain style={{ width: '20px', height: '20px' }} />
                    Запустить анализ
                  </button>
                </div>
              )}

              {loading && (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <Loader2 style={{ 
                    width: '48px', 
                    height: '48px', 
                    color: '#6366f1', 
                    margin: '0 auto 1rem',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <p style={{ color: '#64748b' }}>Анализируем проект...</p>
                </div>
              )}

              {error && (
                <div style={{ 
                  backgroundColor: '#fef2f2', 
                  color: '#dc2626', 
                  padding: '1rem', 
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <AlertCircle style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
                  {error}
                </div>
              )}

              {analysis && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ 
                    backgroundColor: '#f8fafc', 
                    padding: '1rem', 
                    borderRadius: '0.5rem',
                    borderLeft: '4px solid #6366f1'
                  }}>
                    <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                      Общий анализ
                    </h3>
                    <p style={{ color: '#475569', lineHeight: '1.6' }}>{analysis.summary}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {analysis.pros && analysis.pros.length > 0 && (
                      <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '0.5rem' }}>
                        <h4 style={{ 
                          fontWeight: '600', 
                          color: '#166534', 
                          marginBottom: '0.75rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <CheckCircle style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
                          Преимущества
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                          {analysis.pros.map((pro: string, i: number) => (
                            <li key={i} style={{ color: '#166534', marginBottom: '0.5rem', lineHeight: '1.5' }}>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.cons && analysis.cons.length > 0 && (
                      <div style={{ backgroundColor: '#fff7ed', padding: '1rem', borderRadius: '0.5rem' }}>
                        <h4 style={{ 
                          fontWeight: '600', 
                          color: '#c2410c', 
                          marginBottom: '0.75rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <AlertTriangle style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
                          Недостатки
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                          {analysis.cons.map((con: string, i: number) => (
                            <li key={i} style={{ color: '#c2410c', marginBottom: '0.5rem', lineHeight: '1.5' }}>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.risks && analysis.risks.length > 0 && (
                      <div style={{ backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '0.5rem' }}>
                        <h4 style={{ 
                          fontWeight: '600', 
                          color: '#dc2626', 
                          marginBottom: '0.75rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <AlertCircle style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
                          Риски
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                          {analysis.risks.map((risk: string, i: number) => (
                            <li key={i} style={{ color: '#dc2626', marginBottom: '0.5rem', lineHeight: '1.5' }}>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.investmentAdvantages && analysis.investmentAdvantages.length > 0 && (
                      <div style={{ backgroundColor: '#f5f3ff', padding: '1rem', borderRadius: '0.5rem' }}>
                        <h4 style={{ 
                          fontWeight: '600', 
                          color: '#6d28d9', 
                          marginBottom: '0.75rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <Target style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
                          Для инвесторов
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                          {analysis.investmentAdvantages.map((adv: string, i: number) => (
                            <li key={i} style={{ color: '#6d28d9', marginBottom: '0.5rem', lineHeight: '1.5' }}>
                              {adv}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div style={{ 
                    backgroundColor: '#eef2ff', 
                    padding: '1rem', 
                    borderRadius: '0.5rem',
                    textAlign: 'center'
                  }}>
                    <p style={{ color: '#4338ca', marginBottom: '0.5rem' }}>
                      Есть вопросы по проекту?
                    </p>
                    <button
                      onClick={() => setActiveTab('chat')}
                      style={{
                        backgroundColor: '#6366f1',
                        color: 'white',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <MessageCircle style={{ width: '18px', height: '18px' }} />
                      Задать вопрос AI
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px' }}>
              <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                marginBottom: '1rem',
                padding: '0.5rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem'
              }}>
                {chatMessages.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    <MessageCircle style={{ width: '48px', height: '48px', margin: '0 auto 1rem', color: '#c7d2fe' }} />
                    <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>Задайте вопрос о проекте</p>
                    <p style={{ fontSize: '0.875rem' }}>
                      AI ответит на любые вопросы о этом проекте: бюджет, риски, преимущества, реализация и т.д.
                    </p>
                    <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                      {['Какие главные риски?', 'Сколько времени займет?', 'Кому это выгодно?'].map((q, i) => (
                        <button
                          key={i}
                          onClick={() => setQuestion(q)}
                          style={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            padding: '0.5rem 1rem',
                            borderRadius: '1rem',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            color: '#475569'
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '1rem'
                    }}
                  >
                    <div style={{
                      maxWidth: '80%',
                      padding: '0.75rem 1rem',
                      borderRadius: '1rem',
                      backgroundColor: msg.role === 'user' ? '#6366f1' : 'white',
                      color: msg.role === 'user' ? 'white' : '#1e293b',
                      boxShadow: msg.role === 'assistant' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '0.25rem',
                        fontSize: '0.75rem',
                        opacity: 0.8
                      }}>
                        {msg.role === 'user' ? (
                          <>
                            <User style={{ width: '14px', height: '14px', marginRight: '0.25rem' }} />
                            Вы
                          </>
                        ) : (
                          <>
                            <Brain style={{ width: '14px', height: '14px', marginRight: '0.25rem' }} />
                            AI
                          </>
                        )}
                      </div>
                      <p style={{ margin: 0, lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '1rem',
                      backgroundColor: 'white',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite', color: '#6366f1' }} />
                      <span style={{ color: '#64748b' }}>AI думает...</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              <form onSubmit={sendQuestion} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Задайте вопрос о проекте..."
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  disabled={chatLoading || question.trim().length < 3}
                  style={{
                    backgroundColor: '#6366f1',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: chatLoading || question.trim().length < 3 ? 'not-allowed' : 'pointer',
                    opacity: chatLoading || question.trim().length < 3 ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Send style={{ width: '18px', height: '18px' }} />
                </button>
              </form>
            </div>
          )}
        </div>

        <style jsx global>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}
