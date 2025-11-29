import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { FileText, MapPin, Users, Clock, AlertCircle, CheckCircle, ArrowLeft, Send, Image, X, CreditCard } from 'lucide-react'

const categories = [
  { value: 'INFRASTRUCTURE', label: 'Инфраструктура', desc: 'Дороги, мосты, сети' },
  { value: 'BEAUTIFICATION', label: 'Благоустройство', desc: 'Парки, скверы, озеленение' },
  { value: 'SOCIAL', label: 'Социальные', desc: 'Помощь населению' },
  { value: 'COMMERCIAL', label: 'Коммерция', desc: 'ТЦ, рынки, бизнес' },
  { value: 'ENVIRONMENTAL', label: 'Экология', desc: 'Чистота, переработка' },
  { value: 'CULTURAL', label: 'Культура', desc: 'Музеи, театры, события' },
  { value: 'SPORTS', label: 'Спорт', desc: 'Площадки, клубы' },
  { value: 'EDUCATION', label: 'Образование', desc: 'Школы, курсы' },
  { value: 'HEALTHCARE', label: 'Здравоохранение', desc: 'Больницы, клиники' },
  { value: 'OTHER', label: 'Другое', desc: 'Прочие инициативы' }
]

export default function NewProject() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [needsSubscription, setNeedsSubscription] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    timeline: '',
    benefits: '',
    targetAudience: '',
    imageUrl: ''
  })

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 2.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box' as const
  }

  const textareaStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
    resize: 'vertical' as const
  }

  const isCompany = (session?.user as any)?.role === 'COMPANY'

  useEffect(() => {
    if (isCompany) {
      checkSubscription()
    }
  }, [isCompany])

  const checkSubscription = async () => {
    try {
      const res = await fetch('/api/subscription/status')
      const data = await res.json()
      if (!data.subscription?.isActive) {
        setNeedsSubscription(true)
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
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
          Войдите или зарегистрируйтесь, чтобы подать проект
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

  if (needsSubscription) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <CreditCard style={{ width: '64px', height: '64px', color: '#f59e0b', margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>
          Требуется подписка
        </h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
          Для подачи проектов от компании необходима активная подписка. Оформите подписку, чтобы продолжить.
        </p>
        <Link 
          href="/subscription" 
          style={{
            display: 'inline-block',
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: '600',
            textDecoration: 'none'
          }}
        >
          Оформить подписку
        </Link>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Размер изображения не должен превышать 5MB')
      return
    }

    setUploadingImage(true)
    setError('')

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result as string
        setImagePreview(base64)

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Ошибка загрузки')
        }

        setFormData({ ...formData, imageUrl: data.url })
        setUploadingImage(false)
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      setError(err.message)
      setUploadingImage(false)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setFormData({ ...formData, imageUrl: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.title.length < 5) {
      setError('Название должно быть минимум 5 символов')
      return
    }

    if (formData.description.length < 10) {
      setError('Описание должно быть минимум 10 символов')
      return
    }

    if (!formData.category) {
      setError('Выберите категорию проекта')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.needsSubscription) {
          setNeedsSubscription(true)
          return
        }
        throw new Error(data.error || 'Ошибка при создании проекта')
      }

      router.push('/dashboard?submitted=true')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Новый проект - Мой Петропавловск</title>
      </Head>

      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <Link 
          href="/projects" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: '#2563eb',
            textDecoration: 'none',
            marginBottom: '1.5rem'
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} />
          Назад к проектам
        </Link>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          padding: '2.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
              {isCompany ? 'Подача коммерческого проекта' : 'Подача гражданской инициативы'}
            </h1>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
              Заполните форму. AI автоматически оценит бюджет и проанализирует проект.
            </p>
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
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Название проекта *
              </label>
              <div style={{ position: 'relative' }}>
                <FileText style={{ position: 'absolute', left: '12px', top: '14px', color: '#9ca3af', width: '20px', height: '20px' }} />
                <input
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Например: Благоустройство парка на ул. Ленина"
                  required
                />
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Минимум 5 символов</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Категория *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: formData.category === cat.value ? '2px solid #2563eb' : '2px solid #e2e8f0',
                      backgroundColor: formData.category === cat.value ? '#eff6ff' : 'white',
                      color: formData.category === cat.value ? '#1e40af' : '#475569',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontWeight: '500', display: 'block' }}>{cat.label}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{cat.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Описание проекта *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                style={textareaStyle}
                placeholder="Опишите суть проекта, его цели, ожидаемые результаты..."
                required
              />
              <p style={{ fontSize: '0.875rem', color: formData.description.length >= 10 ? '#059669' : '#64748b', marginTop: '0.25rem' }}>
                {formData.description.length}/10 символов (минимум 10)
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Изображение проекта
              </label>
              {imagePreview ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '300px', 
                      maxHeight: '200px', 
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0'
                    }} 
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '0.5rem',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#f9fafb'
                  }}
                >
                  <Image style={{ width: '48px', height: '48px', color: '#9ca3af', margin: '0 auto 0.5rem' }} />
                  <p style={{ color: '#64748b' }}>
                    {uploadingImage ? 'Загрузка...' : 'Нажмите для загрузки изображения'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                    PNG, JPG до 5MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Местоположение
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin style={{ position: 'absolute', left: '12px', top: '14px', color: '#9ca3af', width: '20px', height: '20px' }} />
                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="ул. Ленина, 15"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Сроки реализации
                </label>
                <div style={{ position: 'relative' }}>
                  <Clock style={{ position: 'absolute', left: '12px', top: '14px', color: '#9ca3af', width: '20px', height: '20px' }} />
                  <input
                    name="timeline"
                    type="text"
                    value={formData.timeline}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="3-6 месяцев"
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Целевая аудитория
              </label>
              <div style={{ position: 'relative' }}>
                <Users style={{ position: 'absolute', left: '12px', top: '14px', color: '#9ca3af', width: '20px', height: '20px' }} />
                <input
                  name="targetAudience"
                  type="text"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Жители микрорайона"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Преимущества проекта
              </label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows={3}
                style={textareaStyle}
                placeholder="Какую пользу принесет проект городу и жителям?"
              />
            </div>

            <div style={{
              backgroundColor: '#eff6ff',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <CheckCircle style={{ width: '20px', height: '20px', color: '#2563eb', marginRight: '0.75rem', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e40af' }}>После подачи:</p>
                  <ul style={{ fontSize: '0.875rem', color: '#1e40af', marginTop: '0.25rem', paddingLeft: '1rem' }}>
                    <li>AI автоматически оценит примерный бюджет проекта</li>
                    <li>AI проанализирует плюсы, минусы и риски</li>
                    <li>Проект проверяется модераторами</li>
                    <li>После одобрения открывается голосование</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploadingImage}
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
              {loading ? (
                'Отправка...'
              ) : (
                <>
                  <Send style={{ width: '20px', height: '20px' }} />
                  Отправить на модерацию
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
