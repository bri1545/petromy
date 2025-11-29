import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Filter, Search, Plus, Loader2, Map, List } from 'lucide-react'
import ProjectCard from '../../components/ProjectCard'

const ProjectMap = dynamic(() => import('../../components/ProjectMap'), { ssr: false })

const categories = [
  { value: '', label: 'Все категории' },
  { value: 'INFRASTRUCTURE', label: 'Инфраструктура' },
  { value: 'BEAUTIFICATION', label: 'Благоустройство' },
  { value: 'SOCIAL', label: 'Социальные' },
  { value: 'COMMERCIAL', label: 'Коммерция' },
  { value: 'ENVIRONMENTAL', label: 'Экология' },
  { value: 'CULTURAL', label: 'Культура' },
  { value: 'SPORTS', label: 'Спорт' },
  { value: 'EDUCATION', label: 'Образование' },
  { value: 'HEALTHCARE', label: 'Здравоохранение' },
  { value: 'OTHER', label: 'Другое' }
]

const statuses = [
  { value: '', label: 'Все статусы' },
  { value: 'VOTING', label: 'Голосование' },
  { value: 'APPROVED', label: 'Одобрены' },
  { value: 'FUNDRAISING', label: 'Сбор средств' },
  { value: 'IN_PROGRESS', label: 'В работе' },
  { value: 'COMPLETED', label: 'Завершены' }
]

export default function Projects() {
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  useEffect(() => {
    fetchProjects()
  }, [category, status, page])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (status) params.append('status', status)
      params.append('page', page.toString())
      params.append('limit', '9')

      const res = await fetch(`/api/projects?${params}`)
      const data = await res.json()
      setProjects(data.projects || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter((p: any) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Head>
        <title>Проекты - Мой Петропавловск</title>
      </Head>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Проекты</h1>
            <p className="text-gray-600 mt-1">Изучайте и голосуйте за городские инициативы</p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Подать проект
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск проектов..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2.5 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2.5 ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-4">
            <Filter className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Проекты не найдены</h3>
          <p className="text-gray-600">Попробуйте изменить фильтры или создайте свой проект</p>
        </div>
      ) : viewMode === 'map' ? (
        <div className="mb-6">
          <ProjectMap 
            projects={filteredProjects} 
            onProjectClick={(id) => router.push(`/projects/${id}`)}
          />
          <p className="text-sm text-gray-500 mt-2 text-center">
            Нажмите на маркер, чтобы увидеть подробности проекта
          </p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Назад
              </button>
              <span className="px-4 py-2 text-gray-600">
                Страница {page} из {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
