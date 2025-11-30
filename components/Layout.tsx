import { ReactNode, useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { 
  Home, FileText, Vote, Users, Settings, LogOut, Menu, X, Coins, 
  LogIn, UserPlus, Building2, Clock, Calendar, User, ChevronRight
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

interface ActivePeriods {
  submission: { endDate: string; title: string } | null
  voting: { endDate: string; title: string } | null
  nextSubmission: { startDate: string } | null
  nextVoting: { startDate: string } | null
}

const KazakhstanFlag = ({ size = 'normal' }: { size?: 'normal' | 'small' }) => (
  <div className={`${size === 'small' ? 'w-5 h-3.5' : 'w-7 h-5'} flex-shrink-0 rounded-sm overflow-hidden shadow-sm`}>
    <svg viewBox="0 0 30 20" className="w-full h-full">
      <rect width="30" height="20" fill="#00AFCA"/>
      <circle cx="15" cy="10" r="4.5" fill="#FFD700"/>
      {[...Array(32)].map((_, i) => (
        <line 
          key={i}
          x1="15" 
          y1="10" 
          x2={15 + 7 * Math.cos(i * Math.PI / 16)} 
          y2={10 + 7 * Math.sin(i * Math.PI / 16)}
          stroke="#FFD700"
          strokeWidth="0.4"
        />
      ))}
    </svg>
  </div>
)

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [periods, setPeriods] = useState<ActivePeriods | null>(null)
  const [periodsLoading, setPeriodsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/periods/active')
      .then(res => res.json())
      .then(data => {
        setPeriods(data)
        setPeriodsLoading(false)
      })
      .catch(() => setPeriodsLoading(false))
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [router.pathname])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const userRole = (session?.user as any)?.role
  const userTokens = (session?.user as any)?.tokens || 0
  const isAdmin = ['MODERATOR', 'ADMIN'].includes(userRole)

  const navItems = [
    { name: 'Главная', href: '/', icon: Home, show: true },
    { name: 'Проекты', href: '/projects', icon: FileText, show: true },
    { name: 'Мои проекты', href: '/dashboard', icon: FileText, show: !!session },
    { name: 'Подать проект', href: '/projects/new', icon: Vote, show: !!session },
  ]

  const adminItems = [
    { name: 'Модерация', href: '/moderation', icon: Users },
    { name: 'Управление', href: '/admin', icon: Settings },
  ]

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    }).replace('.', '')
  }

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getPeriodInfo = () => {
    if (periodsLoading) {
      return { text: 'Загрузка...', subtext: '', type: 'loading' as const }
    }
    if (!periods) {
      return { text: 'Ожидание периода', subtext: '', type: 'waiting' as const }
    }
    if (periods.submission) {
      const days = getDaysLeft(periods.submission.endDate)
      return { 
        text: 'Приём проектов', 
        subtext: `до ${formatDate(periods.submission.endDate)} · ${days} дн.`,
        type: 'submission' as const 
      }
    }
    if (periods.voting) {
      const days = getDaysLeft(periods.voting.endDate)
      return { 
        text: 'Голосование', 
        subtext: `до ${formatDate(periods.voting.endDate)} · ${days} дн.`,
        type: 'voting' as const 
      }
    }
    if (periods.nextSubmission) {
      return { 
        text: 'Следующий приём', 
        subtext: `с ${formatDate(periods.nextSubmission.startDate)}`,
        type: 'upcoming' as const 
      }
    }
    return { text: 'Ожидание периода', subtext: '', type: 'waiting' as const }
  }

  const periodInfo = getPeriodInfo()

  const periodStyles = {
    loading: 'bg-slate-600',
    waiting: 'bg-slate-600',
    submission: 'bg-emerald-600',
    voting: 'bg-amber-500',
    upcoming: 'bg-blue-500'
  }

  const periodIcons = {
    loading: Clock,
    waiting: Clock,
    submission: FileText,
    voting: Vote,
    upcoming: Calendar
  }

  const PeriodIcon = periodIcons[periodInfo.type]

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-blue-900 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm sm:text-base">Мой Петропавловск</span>
                <KazakhstanFlag size="small" />
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg ${periodStyles[periodInfo.type]} text-white text-xs sm:text-sm`}>
                <PeriodIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">{periodInfo.text}</span>
                {periodInfo.subtext && (
                  <span className="hidden sm:inline text-white/80 text-xs">{periodInfo.subtext}</span>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-lg transition-all
                  ${menuOpen 
                    ? 'bg-white text-blue-900' 
                    : 'bg-blue-800 text-white hover:bg-blue-700'
                  }
                `}
                aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMenuOpen(false)}
          style={{ top: '56px' }}
        />
      )}

      <div 
        className={`
          fixed left-0 right-0 bg-white shadow-2xl z-50 
          transform transition-all duration-200 ease-out
          ${menuOpen 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-4 opacity-0 pointer-events-none invisible'
          }
        `}
        style={{ top: '56px', maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}
        aria-hidden={!menuOpen}
      >
        <div className="max-w-7xl mx-auto">
          <div className="p-4">
            
            {session && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {session.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{session.user?.name}</div>
                  <div className="text-gray-500 text-sm truncate">{session.user?.email}</div>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full flex-shrink-0">
                  <Coins className="w-4 h-4" />
                  <span className="font-bold">{userTokens}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {navItems.filter(item => item.show).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-xl transition-all
                    ${router.pathname === item.href 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
                    }
                  `}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-sm font-medium text-center">{item.name}</span>
                </Link>
              ))}
            </div>

            {isAdmin && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Админ</span>
                  <div className="h-px flex-1 bg-slate-200"></div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {adminItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`
                        flex flex-col items-center gap-2 p-4 rounded-xl transition-all
                        ${router.pathname === item.href 
                          ? 'bg-amber-500 text-white shadow-lg' 
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }
                      `}
                    >
                      <item.icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}

            <div className="h-px bg-slate-200 my-4"></div>

            {session ? (
              <div className="flex gap-2">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all"
                >
                  <User className="w-5 h-5" />
                  <span>Профиль</span>
                </Link>
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl font-medium transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Выйти</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-gray-700 px-4 py-3 rounded-xl font-semibold transition-all"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Войти</span>
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-lg"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Регистрация</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="bg-slate-800 text-slate-400 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">Мой Петропавловск</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <KazakhstanFlag size="small" />
              <span>Петропавл, Қазақстан</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">© 2024</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
