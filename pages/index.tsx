import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Vote, Users, Building2, TrendingUp, Shield, Lightbulb, MapPin, Heart } from 'lucide-react'
import ProjectCard from '../components/ProjectCard'

const Home: NextPage = () => {
  const [featuredProjects, setFeaturedProjects] = useState([])

  useEffect(() => {
    fetch('/api/projects?limit=3&status=VOTING')
      .then(res => res.json())
      .then(data => setFeaturedProjects(data.projects || []))
      .catch(console.error)
  }, [])

  return (
    <>
      <Head>
        <title>Мой Петропавловск - Платформа гражданских инициатив</title>
        <meta name="description" content="Платформа для подачи и голосования за городские проекты в Петропавловске" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ marginTop: '-1.5rem', marginLeft: '-1rem', marginRight: '-1rem' }}>
        <section style={{ 
          position: 'relative', 
          minHeight: '550px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/city-background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(30, 41, 59, 0.85)'
          }} />
          
          <div style={{ 
            position: 'relative', 
            zIndex: 10, 
            maxWidth: '64rem', 
            margin: '0 auto', 
            textAlign: 'center',
            padding: '5rem 1rem'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              marginBottom: '1.5rem'
            }}>
              <MapPin style={{ width: '16px', height: '16px' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Петропавловск, Казахстан</span>
            </div>
            
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem', 
              color: 'white' 
            }}>
              Мой Петропавловск
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#cbd5e1', 
              marginBottom: '2.5rem', 
              maxWidth: '48rem', 
              margin: '0 auto 2.5rem' 
            }}>
              Платформа гражданских инициатив для развития нашего города. 
              Предлагайте идеи, голосуйте за лучшие проекты, меняйте город вместе!
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <Link
                href="/projects"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  color: '#1e293b',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                Смотреть проекты
                <ArrowRight style={{ marginLeft: '0.5rem', width: '20px', height: '20px' }} />
              </Link>
              <Link
                href="/projects/new"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                Подать свой проект
                <Lightbulb style={{ marginLeft: '0.5rem', width: '20px', height: '20px' }} />
              </Link>
            </div>
          </div>
        </section>

        <section style={{ padding: '4rem 1rem', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', color: '#1e293b', marginBottom: '1rem' }}>
              Как это работает
            </h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '3rem', maxWidth: '32rem', margin: '0 auto 3rem' }}>
              Простой путь от идеи до реализации проекта
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: '#e0f2fe', 
                  borderRadius: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1rem' 
                }}>
                  <Lightbulb style={{ width: '40px', height: '40px', color: '#0284c7' }} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>1. Подайте идею</h3>
                <p style={{ color: '#64748b' }}>Опишите ваш проект для улучшения города</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: '#f1f5f9', 
                  borderRadius: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1rem' 
                }}>
                  <Shield style={{ width: '40px', height: '40px', color: '#475569' }} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>2. Модерация</h3>
                <p style={{ color: '#64748b' }}>Проект проверяется модераторами и AI</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: '#dbeafe', 
                  borderRadius: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1rem' 
                }}>
                  <Vote style={{ width: '40px', height: '40px', color: '#2563eb' }} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>3. Голосование</h3>
                <p style={{ color: '#64748b' }}>Жители голосуют за лучшие проекты</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: '#e2e8f0', 
                  borderRadius: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 1rem' 
                }}>
                  <TrendingUp style={{ width: '40px', height: '40px', color: '#334155' }} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>4. Реализация</h3>
                <p style={{ color: '#64748b' }}>Сбор средств и воплощение проекта</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '4rem 1rem', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '1rem', 
                padding: '2rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    backgroundColor: '#3b82f6', 
                    borderRadius: '0.75rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginRight: '1rem' 
                  }}>
                    <Users style={{ width: '28px', height: '28px', color: 'white' }} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>Для граждан</h3>
                </div>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                  Предлагайте идеи по благоустройству дворов, парков, улиц. 
                  Голосуйте за проекты соседей и участвуйте в развитии города.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', color: '#475569' }}>
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#3b82f6', borderRadius: '50%', marginRight: '0.75rem' }}></span>
                    Благоустройство территорий
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', color: '#475569' }}>
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#3b82f6', borderRadius: '50%', marginRight: '0.75rem' }}></span>
                    Социальные проекты
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', color: '#475569' }}>
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#3b82f6', borderRadius: '50%', marginRight: '0.75rem' }}></span>
                    Экологические инициативы
                  </li>
                </ul>
              </div>

              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '1rem', 
                padding: '2rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    backgroundColor: '#64748b', 
                    borderRadius: '0.75rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginRight: '1rem' 
                  }}>
                    <Building2 style={{ width: '28px', height: '28px', color: 'white' }} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>Для компаний</h3>
                </div>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                  Предлагайте крупные проекты: торговые центры, спортивные комплексы, 
                  инфраструктурные объекты с полным анализом от AI.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', color: '#475569' }}>
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#64748b', borderRadius: '50%', marginRight: '0.75rem' }}></span>
                    Коммерческие объекты
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', color: '#475569' }}>
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#64748b', borderRadius: '50%', marginRight: '0.75rem' }}></span>
                    AI-анализ для инвесторов
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', color: '#475569' }}>
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#64748b', borderRadius: '50%', marginRight: '0.75rem' }}></span>
                    Привлечение финансирования
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {featuredProjects.length > 0 && (
          <section style={{ padding: '4rem 1rem', backgroundColor: 'white' }}>
            <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' }}>Активное голосование</h2>
                <Link
                  href="/projects?status=VOTING"
                  style={{ color: '#3b82f6', fontWeight: '500', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                >
                  Все проекты
                  <ArrowRight style={{ marginLeft: '0.25rem', width: '16px', height: '16px' }} />
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {featuredProjects.map((project: any) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section style={{ padding: '5rem 1rem', backgroundColor: '#1e293b', color: 'white' }}>
          <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '64px', 
              height: '64px', 
              backgroundColor: '#3b82f6', 
              borderRadius: '1rem', 
              marginBottom: '1.5rem' 
            }}>
              <Heart style={{ width: '32px', height: '32px', color: 'white' }} />
            </div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>Готовы изменить город?</h2>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '2rem' }}>
              Присоединяйтесь к платформе и начните влиять на развитие Петропавловска уже сегодня
            </p>
            <Link
              href="/auth/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1.125rem',
                textDecoration: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              Зарегистрироваться бесплатно
              <ArrowRight style={{ marginLeft: '0.5rem', width: '20px', height: '20px' }} />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
