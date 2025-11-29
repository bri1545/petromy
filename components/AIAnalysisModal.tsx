import { useState } from 'react'
import { 
  X, Brain, CheckCircle, AlertTriangle, AlertCircle, Target, Loader2 
} from 'lucide-react'

interface AIAnalysis {
  summary: string
  pros: string[]
  cons: string[]
  risks: string[]
  investmentAdvantages: string[]
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
          maxWidth: '48rem',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
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

        <div style={{ padding: '1.5rem' }}>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {projectTitle}
          </p>

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
