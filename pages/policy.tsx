import Head from 'next/head'
import Link from 'next/link'
import { 
  Shield, CheckCircle, XCircle, Users, Brain, Scale, 
  FileText, AlertTriangle, Eye, Heart, Building2, 
  Clock, ThumbsUp, MessageCircle, ArrowLeft
} from 'lucide-react'

export default function ModerationPolicy() {
  const approvalCriteria = [
    {
      icon: FileText,
      title: 'Полнота описания',
      description: 'Проект должен содержать подробное описание идеи, целей и ожидаемых результатов'
    },
    {
      icon: Scale,
      title: 'Реалистичность',
      description: 'Проект должен быть осуществим с технической, финансовой и правовой точки зрения'
    },
    {
      icon: Heart,
      title: 'Польза для города',
      description: 'Проект должен приносить пользу жителям Петропавловска и улучшать качество жизни'
    },
    {
      icon: Users,
      title: 'Социальная значимость',
      description: 'Проект должен отвечать реальным потребностям горожан и общества'
    },
    {
      icon: AlertTriangle,
      title: 'Безопасность',
      description: 'Проект не должен представлять угрозу для здоровья, безопасности или окружающей среды'
    },
    {
      icon: CheckCircle,
      title: 'Соответствие законам',
      description: 'Проект должен соответствовать законодательству Республики Казахстан'
    }
  ]

  const rejectionReasons = [
    'Неполное или неясное описание проекта',
    'Нереалистичные цели или сроки реализации',
    'Отсутствие пользы для городского сообщества',
    'Нарушение законодательства или норм этики',
    'Коммерческая реклама без социальной составляющей',
    'Дублирование уже существующих проектов',
    'Проект выходит за пределы компетенции платформы',
    'Оскорбительное или дискриминационное содержание'
  ]

  const moderatorRoles = [
    {
      title: 'Городские эксперты',
      description: 'Специалисты по городскому планированию и развитию, которые оценивают техническую реализуемость проектов',
      color: '#3b82f6'
    },
    {
      title: 'Представители акимата',
      description: 'Сотрудники местных органов власти, обеспечивающие соответствие проектов городским программам',
      color: '#10b981'
    },
    {
      title: 'Общественные активисты',
      description: 'Представители гражданского общества, оценивающие социальную значимость и востребованность проектов',
      color: '#f59e0b'
    },
    {
      title: 'AI-ассистент',
      description: 'Искусственный интеллект анализирует проекты, выявляет потенциальные риски и оценивает бюджет',
      color: '#8b5cf6'
    }
  ]

  const processSteps = [
    {
      step: 1,
      title: 'Подача проекта',
      description: 'Автор заполняет форму с описанием проекта, указывает категорию и локацию',
      icon: FileText,
      duration: '5-10 минут'
    },
    {
      step: 2,
      title: 'AI-анализ',
      description: 'Искусственный интеллект проводит первичную оценку проекта и определяет примерный бюджет',
      icon: Brain,
      duration: 'Мгновенно'
    },
    {
      step: 3,
      title: 'Модерация',
      description: 'Команда модераторов проверяет проект на соответствие критериям платформы',
      icon: Eye,
      duration: '1-3 дня'
    },
    {
      step: 4,
      title: 'Решение',
      description: 'Проект одобряется для голосования или отклоняется с указанием причины',
      icon: CheckCircle,
      duration: 'По результатам'
    }
  ]

  return (
    <>
      <Head>
        <title>Политика модерации - Мой Петропавловск</title>
        <meta name="description" content="Узнайте о критериях модерации проектов и команде модераторов платформы Мой Петропавловск" />
      </Head>

      <div style={{ marginTop: '-1.5rem', marginLeft: '-1rem', marginRight: '-1rem' }}>
        <section style={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
          padding: '4rem 1rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)',
            pointerEvents: 'none'
          }} />
          
          <div style={{ maxWidth: '64rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                marginBottom: '1.5rem',
                fontSize: '0.875rem'
              }}
            >
              <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} />
              На главную
            </Link>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1.5rem',
                backdropFilter: 'blur(8px)'
              }}>
                <Shield style={{ width: '40px', height: '40px', color: 'white' }} />
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold', 
                  color: 'white',
                  marginBottom: '0.5rem'
                }}>
                  Политика модерации
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem' }}>
                  Прозрачные правила для справедливых решений
                </p>
              </div>
            </div>
            
            <p style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '1.125rem', 
              lineHeight: '1.8',
              maxWidth: '48rem'
            }}>
              Мы стремимся создать справедливую и открытую платформу для всех жителей Петропавловска. 
              Каждый проект проходит тщательную проверку, чтобы обеспечить качество и безопасность 
              предлагаемых инициатив.
            </p>
          </div>
        </section>

        <section style={{ padding: '4rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: '#dbeafe',
                borderRadius: '9999px',
                marginBottom: '1rem'
              }}>
                <Clock style={{ width: '16px', height: '16px', color: '#2563eb', marginRight: '0.5rem' }} />
                <span style={{ color: '#1e40af', fontWeight: '500', fontSize: '0.875rem' }}>Процесс модерации</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                Как проходит проверка
              </h2>
              <p style={{ color: '#64748b', maxWidth: '36rem', margin: '0 auto' }}>
                От подачи до голосования — прозрачный путь вашего проекта
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: '1.5rem',
              position: 'relative'
            }}>
              {processSteps.map((step, index) => (
                <div key={step.step} style={{ position: 'relative' }}>
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '1rem',
                    padding: '2rem',
                    height: '100%',
                    border: '1px solid #e2e8f0',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '24px',
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                    }}>
                      {step.step}
                    </div>
                    
                    <div style={{
                      width: '56px',
                      height: '56px',
                      backgroundColor: '#e0f2fe',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                      marginTop: '0.5rem'
                    }}>
                      <step.icon style={{ width: '28px', height: '28px', color: '#0284c7' }} />
                    </div>
                    
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                      {step.title}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                      {step.description}
                    </p>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.375rem 0.75rem',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>
                      <Clock style={{ width: '12px', height: '12px', marginRight: '0.375rem' }} />
                      {step.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '4rem 1rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: '#dcfce7',
                borderRadius: '9999px',
                marginBottom: '1rem'
              }}>
                <ThumbsUp style={{ width: '16px', height: '16px', color: '#16a34a', marginRight: '0.5rem' }} />
                <span style={{ color: '#166534', fontWeight: '500', fontSize: '0.875rem' }}>Критерии одобрения</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
                Что мы оцениваем
              </h2>
              <p style={{ color: '#64748b', maxWidth: '36rem', margin: '0 auto' }}>
                Каждый проект проверяется по шести ключевым критериям
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem'
            }}>
              {approvalCriteria.map((criteria, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <criteria.icon style={{ width: '24px', height: '24px', color: '#16a34a' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.375rem' }}>
                      {criteria.title}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: '1.5' }}>
                      {criteria.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '4rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '3rem',
              alignItems: 'start'
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#fee2e2',
                  borderRadius: '9999px',
                  marginBottom: '1rem'
                }}>
                  <XCircle style={{ width: '16px', height: '16px', color: '#dc2626', marginRight: '0.5rem' }} />
                  <span style={{ color: '#991b1b', fontWeight: '500', fontSize: '0.875rem' }}>Причины отклонения</span>
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>
                  Когда проект может быть отклонён
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {rejectionReasons.map((reason, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.875rem 1rem',
                      backgroundColor: '#fef2f2',
                      borderRadius: '0.75rem',
                      border: '1px solid #fecaca'
                    }}>
                      <XCircle style={{ width: '18px', height: '18px', color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />
                      <span style={{ color: '#7f1d1d', fontSize: '0.875rem' }}>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '9999px',
                  marginBottom: '1rem'
                }}>
                  <MessageCircle style={{ width: '16px', height: '16px', color: '#16a34a', marginRight: '0.5rem' }} />
                  <span style={{ color: '#166534', fontWeight: '500', fontSize: '0.875rem' }}>Обратная связь</span>
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>
                  Если проект отклонён
                </h2>
                
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '1rem',
                  padding: '2rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <p style={{ color: '#475569', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                    Мы всегда указываем причину отклонения и даём рекомендации по улучшению проекта. 
                    Вы можете:
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#dbeafe',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '0.875rem' }}>1</span>
                      </div>
                      <span style={{ color: '#334155' }}>Исправить замечания и подать проект повторно</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#dbeafe',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '0.875rem' }}>2</span>
                      </div>
                      <span style={{ color: '#334155' }}>Связаться с командой для уточнения деталей</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#dbeafe',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '0.875rem' }}>3</span>
                      </div>
                      <span style={{ color: '#334155' }}>Обжаловать решение через форму обратной связи</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '4rem 1rem', backgroundColor: '#1e293b' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '9999px',
                marginBottom: '1rem'
              }}>
                <Users style={{ width: '16px', height: '16px', color: '#fbbf24', marginRight: '0.5rem' }} />
                <span style={{ color: '#fef3c7', fontWeight: '500', fontSize: '0.875rem' }}>Команда модераторов</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
                Кто проверяет проекты
              </h2>
              <p style={{ color: '#94a3b8', maxWidth: '36rem', margin: '0 auto' }}>
                Команда экспертов, работающих на благо города
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '1.5rem'
            }}>
              {moderatorRoles.map((role, index) => (
                <div key={index} style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '1rem',
                  padding: '2rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    backgroundColor: role.color
                  }} />
                  
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: role.color,
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    {index === 0 && <Building2 style={{ width: '24px', height: '24px', color: 'white' }} />}
                    {index === 1 && <Shield style={{ width: '24px', height: '24px', color: 'white' }} />}
                    {index === 2 && <Users style={{ width: '24px', height: '24px', color: 'white' }} />}
                    {index === 3 && <Brain style={{ width: '24px', height: '24px', color: 'white' }} />}
                  </div>
                  
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>
                    {role.title}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.6' }}>
                    {role.description}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '3rem',
              padding: '2rem',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '1rem',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              textAlign: 'center'
            }}>
              <Brain style={{ width: '48px', height: '48px', color: '#60a5fa', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.75rem' }}>
                AI-модерация комментариев
              </h3>
              <p style={{ color: '#94a3b8', maxWidth: '32rem', margin: '0 auto', lineHeight: '1.6' }}>
                Искусственный интеллект автоматически проверяет комментарии на соответствие 
                правилам платформы, выявляя оскорбительный контент и спам
              </p>
            </div>
          </div>
        </section>

        <section style={{ padding: '4rem 1rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
              Есть вопросы о модерации?
            </h2>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              Мы всегда открыты к диалогу и готовы помочь с вашими проектами
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/projects/new"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  boxShadow: '0 4px 6px rgba(59, 130, 246, 0.25)'
                }}
              >
                <FileText style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
                Подать проект
              </Link>
              <Link
                href="/projects"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  padding: '1rem 2rem',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                }}
              >
                <Eye style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
                Смотреть проекты
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
