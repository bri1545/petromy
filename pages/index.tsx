import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Vote, Users, Building2, TrendingUp, Shield, Lightbulb } from 'lucide-react'
import ProjectCard from '../components/ProjectCard'

const Home: NextPage = () => {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [stats, setStats] = useState({ projects: 0, votes: 0, users: 0 })

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

      <div className="-mt-6 -mx-4 sm:-mx-6 lg:-mx-8">
        <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Мой Петропавловск
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Платформа гражданских инициатив для развития нашего города. 
              Предлагайте идеи, голосуйте за лучшие проекты, меняйте город вместе!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
              >
                Смотреть проекты
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/projects/new"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-500 transition-colors border-2 border-blue-400"
              >
                Подать свой проект
                <Lightbulb className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Как это работает
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">1. Подайте идею</h3>
                <p className="text-gray-600">Опишите ваш проект для улучшения города</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">2. Модерация</h3>
                <p className="text-gray-600">Проект проверяется модераторами и AI</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Vote className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">3. Голосование</h3>
                <p className="text-gray-600">Жители голосуют за лучшие проекты</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">4. Реализация</h3>
                <p className="text-gray-600">Сбор средств и воплощение проекта</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <Users className="w-10 h-10 text-blue-600 mr-4" />
                  <h3 className="text-2xl font-bold text-gray-900">Для граждан</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Предлагайте идеи по благоустройству дворов, парков, улиц. 
                  Голосуйте за проекты соседей и участвуйте в развитии города.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Благоустройство территорий
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Социальные проекты
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Экологические инициативы
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <Building2 className="w-10 h-10 text-purple-600 mr-4" />
                  <h3 className="text-2xl font-bold text-gray-900">Для компаний</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Предлагайте крупные проекты: торговые центры, спортивные комплексы, 
                  инфраструктурные объекты с полным анализом от AI.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Коммерческие объекты
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    AI-анализ для инвесторов
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Привлечение финансирования
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {featuredProjects.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Активное голосование</h2>
                <Link
                  href="/projects?status=VOTING"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  Все проекты
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredProjects.map((project: any) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Готовы изменить город?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Присоединяйтесь к платформе и начните влиять на развитие Петропавловска уже сегодня
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              Зарегистрироваться
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
