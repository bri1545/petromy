import Link from 'next/link'
import { ThumbsUp, ThumbsDown, MessageCircle, MapPin, Calendar, Coins, Building2, User } from 'lucide-react'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    category: string
    status: string
    estimatedBudget?: number | null
    location?: string | null
    isCompanyProject: boolean
    votesFor: number
    votesAgainst: number
    fundraisingGoal?: number | null
    fundraisingRaised: number
    createdAt: string
    author: {
      name: string
      companyName?: string | null
    }
    _count: {
      votes: number
      comments: number
    }
  }
}

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

const statusLabels: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Черновик', color: 'bg-gray-100 text-gray-800' },
  PENDING_MODERATION: { label: 'На модерации', color: 'bg-yellow-100 text-yellow-800' },
  MODERATION_REJECTED: { label: 'Отклонен', color: 'bg-red-100 text-red-800' },
  APPROVED: { label: 'Одобрен', color: 'bg-green-100 text-green-800' },
  VOTING: { label: 'Голосование', color: 'bg-blue-100 text-blue-800' },
  FUNDRAISING: { label: 'Сбор средств', color: 'bg-purple-100 text-purple-800' },
  IN_PROGRESS: { label: 'В работе', color: 'bg-indigo-100 text-indigo-800' },
  COMPLETED: { label: 'Завершен', color: 'bg-green-200 text-green-900' },
  CANCELLED: { label: 'Отменен', color: 'bg-gray-200 text-gray-700' }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const status = statusLabels[project.status] || { label: project.status, color: 'bg-gray-100' }
  const category = categoryLabels[project.category] || project.category

  const totalVotes = project.votesFor + project.votesAgainst
  const approvalPercent = totalVotes > 0 ? Math.round((project.votesFor / totalVotes) * 100) : 0

  const fundraisingPercent = project.fundraisingGoal 
    ? Math.min(100, Math.round((project.fundraisingRaised / project.fundraisingGoal) * 100))
    : 0

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                {status.label}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                {category}
              </span>
            </div>
            {project.isCompanyProject && (
              <Building2 className="w-5 h-5 text-blue-600" />
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {project.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {project.description}
          </p>

          <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
            {project.location && (
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {project.location}
              </span>
            )}
            <span className="flex items-center">
              {project.isCompanyProject ? (
                <>
                  <Building2 className="w-4 h-4 mr-1" />
                  {project.author.companyName || project.author.name}
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-1" />
                  {project.author.name}
                </>
              )}
            </span>
          </div>

          {project.estimatedBudget && (
            <div className="flex items-center text-sm text-gray-700 mb-4">
              <Coins className="w-4 h-4 mr-1 text-yellow-600" />
              <span className="font-medium">
                {new Intl.NumberFormat('ru-RU').format(project.estimatedBudget)} тенге
              </span>
            </div>
          )}

          {project.status === 'VOTING' && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Голосование</span>
                <span className="font-medium text-gray-900">{approvalPercent}% за</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                  style={{ width: `${approvalPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <span className="flex items-center">
                  <ThumbsUp className="w-3 h-3 mr-1 text-green-600" />
                  {project.votesFor}
                </span>
                <span className="flex items-center">
                  <ThumbsDown className="w-3 h-3 mr-1 text-red-600" />
                  {project.votesAgainst}
                </span>
              </div>
            </div>
          )}

          {project.status === 'FUNDRAISING' && project.fundraisingGoal && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Сбор средств</span>
                <span className="font-medium text-gray-900">{fundraisingPercent}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                  style={{ width: `${fundraisingPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Intl.NumberFormat('ru-RU').format(project.fundraisingRaised)} / {new Intl.NumberFormat('ru-RU').format(project.fundraisingGoal)} тенге
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <ThumbsUp className="w-4 h-4 mr-1" />
                {project._count.votes}
              </span>
              <span className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                {project._count.comments}
              </span>
            </div>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(project.createdAt).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
