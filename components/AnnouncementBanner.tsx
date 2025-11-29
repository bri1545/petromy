import { useState, useEffect } from 'react'
import { Calendar, FileText, Vote, Clock, X } from 'lucide-react'

interface Period {
  id: string
  type: string
  title: string
  description?: string
  startDate: string
  endDate: string
}

interface ActivePeriods {
  submission: Period | null
  voting: Period | null
  nextSubmission: Period | null
  nextVoting: Period | null
}

export default function AnnouncementBanner() {
  const [periods, setPeriods] = useState<ActivePeriods | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetch('/api/periods/active')
      .then(res => res.json())
      .then(data => setPeriods(data))
      .catch(console.error)
  }, [])

  if (dismissed || !periods) return null

  const hasActivePeriod = periods.submission || periods.voting
  const hasUpcoming = periods.nextSubmission || periods.nextVoting

  if (!hasActivePeriod && !hasUpcoming) return null

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    })
  }

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-6 flex-wrap">
            {periods.submission && (
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <FileText className="w-5 h-5 text-green-300" />
                <div>
                  <div className="text-xs text-blue-200 uppercase tracking-wide">Приём проектов</div>
                  <div className="font-semibold flex items-center gap-2">
                    <span>до {formatDateShort(periods.submission.endDate)}</span>
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {getDaysLeft(periods.submission.endDate)} дн.
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {periods.voting && (
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <Vote className="w-5 h-5 text-yellow-300" />
                <div>
                  <div className="text-xs text-blue-200 uppercase tracking-wide">Голосование</div>
                  <div className="font-semibold flex items-center gap-2">
                    <span>до {formatDateShort(periods.voting.endDate)}</span>
                    <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full">
                      {getDaysLeft(periods.voting.endDate)} дн.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!periods.submission && periods.nextSubmission && (
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 opacity-80">
                <Clock className="w-5 h-5 text-gray-300" />
                <div>
                  <div className="text-xs text-blue-200 uppercase tracking-wide">Следующий приём</div>
                  <div className="font-semibold">
                    с {formatDateShort(periods.nextSubmission.startDate)}
                  </div>
                </div>
              </div>
            )}

            {!periods.voting && periods.nextVoting && (
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 opacity-80">
                <Clock className="w-5 h-5 text-gray-300" />
                <div>
                  <div className="text-xs text-blue-200 uppercase tracking-wide">Следующее голосование</div>
                  <div className="font-semibold">
                    с {formatDateShort(periods.nextVoting.startDate)}
                  </div>
                </div>
              </div>
            )}

            {!hasActivePeriod && !hasUpcoming && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Сейчас нет активных периодов</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
