import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Mail, Lock, User, Building2, Phone, UserPlus, AlertCircle, CheckCircle } from 'lucide-react'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'CITIZEN',
    companyName: '',
    companyInn: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (formData.password.length < 6) {
      setError('Пароль должен быть минимум 6 символов')
      return
    }

    if (formData.role === 'COMPANY' && (!formData.companyName || !formData.companyInn)) {
      setError('Для компании необходимо указать название и ИИН/БИН')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role,
          companyName: formData.companyName || undefined,
          companyInn: formData.companyInn || undefined,
          phone: formData.phone || undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка регистрации')
      }

      router.push('/auth/login?registered=true')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { 
    width: '100%', 
    paddingLeft: '2.75rem', 
    paddingRight: '1rem', 
    paddingTop: '0.875rem', 
    paddingBottom: '0.875rem', 
    border: '1px solid #d1d5db', 
    borderRadius: '0.5rem', 
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box' as const
  }

  const inputStyleNoIcon = { 
    width: '100%', 
    paddingLeft: '1rem', 
    paddingRight: '1rem', 
    paddingTop: '0.875rem', 
    paddingBottom: '0.875rem', 
    border: '1px solid #d1d5db', 
    borderRadius: '0.5rem', 
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box' as const
  }

  return (
    <>
      <Head>
        <title>Регистрация - Мой Петропавловск</title>
      </Head>

      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '1rem', 
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', 
          padding: '2.5rem', 
          width: '100%', 
          maxWidth: '32rem',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              backgroundColor: '#dbeafe', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1rem' 
            }}>
              <UserPlus style={{ width: '32px', height: '32px', color: '#2563eb' }} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>Регистрация</h1>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Создайте аккаунт для участия</p>
          </div>

          {error && (
            <div style={{ 
              backgroundColor: '#fef2f2', 
              color: '#dc2626', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1.5rem', 
              display: 'flex', 
              alignItems: 'center' 
            }}>
              <AlertCircle style={{ width: '20px', height: '20px', marginRight: '0.5rem', flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Тип аккаунта
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'CITIZEN' })}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: formData.role === 'CITIZEN' ? '2px solid #2563eb' : '2px solid #e2e8f0',
                    backgroundColor: formData.role === 'CITIZEN' ? '#eff6ff' : 'white',
                    color: formData.role === 'CITIZEN' ? '#1e40af' : '#475569',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <User style={{ width: '24px', height: '24px', margin: '0 auto 0.5rem' }} />
                  <span style={{ fontWeight: '500', display: 'block' }}>Гражданин</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'COMPANY' })}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: formData.role === 'COMPANY' ? '2px solid #475569' : '2px solid #e2e8f0',
                    backgroundColor: formData.role === 'COMPANY' ? '#f1f5f9' : 'white',
                    color: formData.role === 'COMPANY' ? '#1e293b' : '#475569',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Building2 style={{ width: '24px', height: '24px', margin: '0 auto 0.5rem' }} />
                  <span style={{ fontWeight: '500', display: 'block' }}>Компания</span>
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                {formData.role === 'COMPANY' ? 'Ваше имя (контактное лицо)' : 'Ваше имя'}
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '20px', height: '20px' }} />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Иван Иванов"
                  required
                />
              </div>
            </div>

            {formData.role === 'COMPANY' && (
              <>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="companyName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Название компании
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building2 style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '20px', height: '20px' }} />
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={handleChange}
                      style={inputStyle}
                      placeholder="ТОО Компания"
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="companyInn" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    ИИН/БИН
                  </label>
                  <input
                    id="companyInn"
                    name="companyInn"
                    type="text"
                    value={formData.companyInn}
                    onChange={handleChange}
                    style={inputStyleNoIcon}
                    placeholder="123456789012"
                    required
                  />
                </div>
              </>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '20px', height: '20px' }} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="phone" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Телефон (необязательно)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '20px', height: '20px' }} />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="+7 777 123 4567"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Пароль
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '20px', height: '20px' }} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Минимум 6 символов"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Подтвердите пароль
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '20px', height: '20px' }} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Повторите пароль"
                  required
                />
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#eff6ff', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1.5rem',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', color: '#1e40af' }}>
                <CheckCircle style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>При регистрации вы получите 5 бесплатных токенов для голосования</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', 
                backgroundColor: loading ? '#93c5fd' : '#2563eb', 
                color: 'white', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                fontWeight: '600',
                fontSize: '1rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <UserPlus style={{ width: '20px', height: '20px' }} />
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#64748b' }}>
              Уже есть аккаунт?{' '}
              <Link href="/auth/login" style={{ color: '#2563eb', fontWeight: '500', textDecoration: 'none' }}>
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
