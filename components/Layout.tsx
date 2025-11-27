import { ReactNode } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Home, FileText, Vote, Users, Settings, LogOut, Menu, X, Coins } from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Главная', href: '/', icon: Home },
    { name: 'Проекты', href: '/projects', icon: FileText },
  ]

  const authNavigation = [
    { name: 'Мои проекты', href: '/dashboard', icon: FileText },
    { name: 'Подать проект', href: '/projects/new', icon: Vote },
  ]

  const moderatorNavigation = [
    { name: 'Модерация', href: '/moderation', icon: Users },
  ]

  const adminNavigation = [
    { name: 'Управление', href: '/admin', icon: Settings },
  ]

  const userRole = (session?.user as any)?.role
  const userTokens = (session?.user as any)?.tokens || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-xl">МП</span>
                </div>
                <span className="text-white font-bold text-lg hidden sm:block">Мой Петропавловск</span>
              </Link>
              
              <div className="hidden md:flex ml-10 space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {session && authNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-blue-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}

                {session && ['MODERATOR', 'ADMIN'].includes(userRole) && moderatorNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-yellow-300 hover:text-yellow-100 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}

                {session && userRole === 'ADMIN' && adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-yellow-300 hover:text-yellow-100 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                <>
                  <div className="flex items-center space-x-2 bg-blue-800 px-3 py-1.5 rounded-full">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">{userTokens}</span>
                  </div>
                  <Link 
                    href="/profile" 
                    className="text-blue-100 hover:text-white text-sm"
                  >
                    {session.user?.name}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Выйти</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-blue-100 hover:text-white px-3 py-2 text-sm font-medium"
                  >
                    Войти
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-blue-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {session && authNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-blue-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {session ? (
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="text-red-300 hover:text-red-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Выйти
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-blue-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Войти
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-blue-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-semibold text-white mb-2">Мой Петропавловск</p>
            <p className="text-sm">Платформа гражданских инициатив для развития города</p>
            <p className="text-xs mt-4 text-gray-500">2024 Все права защищены</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
