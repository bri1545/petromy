import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { CreditCard, Check, ArrowLeft, Building2, AlertCircle, CheckCircle } from 'lucide-react'

const plans = [
  {
    id: '1_month',
    name: '1 месяц',
    price: 5000,
    description: 'Подписка на 1 месяц',
    features: [
      'Подача неограниченного числа проектов',
      'Голосование за проекты',
      'AI-анализ проектов',
      'Участие в сборе средств'
    ]
  },
  {
    id: '3_months',
    name: '3 месяца',
    price: 12000,
    originalPrice: 15000,
    description: 'Экономия 20%',
    popular: true,
    features: [
      'Подача неограниченного числа проектов',
      'Голосование за проекты',
      'AI-анализ проектов',
      'Участие в сборе средств',
      'Приоритетная модерация'
    ]
  },
  {
    id: '6_months',
    name: '6 месяцев',
    price: 20000,
    originalPrice: 30000,
    description: 'Экономия 33%',
    features: [
      'Подача неограниченного числа проектов',
      'Голосование за проекты',
      'AI-анализ проектов',
      'Участие в сборе средств',
      'Приоритетная модерация',
      'Выделение в списке проектов'
    ]
  },
  {
    id: '1_year',
    name: '1 год',
    price: 35000,
    originalPrice: 60000,
    description: 'Экономия 42%',
    features: [
      'Подача неограниченного числа проектов',
      'Голосование за проекты',
      'AI-анализ проектов',
      'Участие в сборе средств',
      'Приоритетная модерация',
      'Выделение в списке проектов',
      'Персональный менеджер'
    ]
  }
]

export default function SubscriptionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    if (session) {
      fetchSubscriptionStatus()
    }
  }, [session])

  const fetchSubscriptionStatus = async () => {
    try {
      const res = await fetch('/api/subscription/status')
      const data = await res.json()
      setSubscription(data.subscription)
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  const handlePurchase = async (planId: string) => {
    setLoading(planId)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/subscription/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: planId })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка покупки подписки')
      }

      setSuccess('Подписка успешно активирована!')
      setSubscription(data.subscription)
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748b' }}>
        Загрузка...
      </div>
    )
  }

  if (!session) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
          Необходима авторизация
        </h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Войдите как компания, чтобы оформить подписку
        </p>
        <Link 
          href="/auth/login" 
          style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: '600',
            textDecoration: 'none'
          }}
        >
          Войти
        </Link>
      </div>
    )
  }

  const userRole = (session.user as any)?.role

  if (userRole !== 'COMPANY') {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <Building2 style={{ width: '64px', height: '64px', color: '#64748b', margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
          Подписка для компаний
        </h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          Подписка доступна только для аккаунтов компаний. Зарегистрируйтесь как компания, чтобы получить доступ.
        </p>
        <Link 
          href="/auth/register" 
          style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: '600',
            textDecoration: 'none'
          }}
        >
          Регистрация компании
        </Link>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Подписка для компаний - Мой Петропавловск</title>
      </Head>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link 
          href="/dashboard" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#2563eb',
            textDecoration: 'none',
            marginBottom: '1.5rem'
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} />
          Назад в личный кабинет
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <CreditCard style={{ width: '48px', height: '48px', color: '#f59e0b', margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
            Подписка для компаний
          </h1>
          <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Получите полный доступ к платформе: подавайте проекты, голосуйте и участвуйте в развитии города
          </p>
        </div>

        {subscription?.isActive && (
          <div style={{
            backgroundColor: '#dcfce7',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            textAlign: 'center',
            border: '1px solid #bbf7d0'
          }}>
            <CheckCircle style={{ width: '32px', height: '32px', color: '#22c55e', margin: '0 auto 0.5rem' }} />
            <h3 style={{ fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>
              У вас активная подписка
            </h3>
            <p style={{ color: '#166534' }}>
              Действует до: {new Date(subscription.endDate).toLocaleDateString('ru-RU')}
            </p>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertCircle style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
            {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#dcfce7',
            color: '#166534',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
            {success}
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {plans.map(plan => (
            <div 
              key={plan.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                border: plan.popular ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                boxShadow: plan.popular ? '0 10px 25px -5px rgba(245, 158, 11, 0.2)' : '0 4px 6px -1px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  padding: '0.25rem 1rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Популярный
                </div>
              )}

              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
                {plan.name}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                {plan.description}
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>
                  {new Intl.NumberFormat('ru-RU').format(plan.price)}
                </span>
                <span style={{ color: '#64748b' }}> тенге</span>
                {plan.originalPrice && (
                  <div style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.875rem' }}>
                    {new Intl.NumberFormat('ru-RU').format(plan.originalPrice)} тенге
                  </div>
                )}
              </div>

              <ul style={{ marginBottom: '1.5rem' }}>
                {plan.features.map((feature, i) => (
                  <li 
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#475569'
                    }}
                  >
                    <Check style={{ width: '16px', height: '16px', color: '#22c55e', marginRight: '0.5rem', flexShrink: 0, marginTop: '2px' }} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan.id)}
                disabled={loading === plan.id || subscription?.isActive}
                style={{
                  width: '100%',
                  backgroundColor: subscription?.isActive ? '#9ca3af' : (plan.popular ? '#f59e0b' : '#2563eb'),
                  color: 'white',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: subscription?.isActive ? 'not-allowed' : 'pointer',
                  opacity: loading === plan.id ? 0.7 : 1
                }}
              >
                {loading === plan.id ? 'Обработка...' : (subscription?.isActive ? 'Уже активна' : 'Купить')}
              </button>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: '#f8fafc',
          borderRadius: '1rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
            Нужна помощь?
          </h3>
          <p style={{ color: '#64748b' }}>
            Свяжитесь с нами для получения индивидуальных условий для крупных компаний
          </p>
        </div>
      </div>
    </>
  )
}
