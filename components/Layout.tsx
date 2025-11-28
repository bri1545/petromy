import { ReactNode } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Home, FileText, Vote, Users, Settings, LogOut, Menu, X, Coins, LogIn, UserPlus, Building2 } from 'lucide-react'
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <nav style={{ backgroundColor: '#1e3a8a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', height: '64px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                <div style={{ 
                  backgroundColor: '#3b82f6', 
                  padding: '0.5rem', 
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Building2 style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem' }}>Мой Петропавловск</span>
              </Link>
              
              <div style={{ display: 'flex', marginLeft: '2.5rem', gap: '0.5rem' }} className="hidden md:flex">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{ 
                      color: '#bfdbfe', 
                      padding: '0.5rem 0.75rem', 
                      borderRadius: '0.375rem', 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      textDecoration: 'none'
                    }}
                  >
                    <item.icon style={{ width: '16px', height: '16px' }} />
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {session && authNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{ 
                      color: '#bfdbfe', 
                      padding: '0.5rem 0.75rem', 
                      borderRadius: '0.375rem', 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      textDecoration: 'none'
                    }}
                  >
                    <item.icon style={{ width: '16px', height: '16px' }} />
                    <span>{item.name}</span>
                  </Link>
                ))}

                {session && ['MODERATOR', 'ADMIN'].includes(userRole) && moderatorNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{ 
                      color: '#93c5fd', 
                      padding: '0.5rem 0.75rem', 
                      borderRadius: '0.375rem', 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      textDecoration: 'none'
                    }}
                  >
                    <item.icon style={{ width: '16px', height: '16px' }} />
                    <span>{item.name}</span>
                  </Link>
                ))}

                {session && userRole === 'ADMIN' && adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{ 
                      color: '#93c5fd', 
                      padding: '0.5rem 0.75rem', 
                      borderRadius: '0.375rem', 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      textDecoration: 'none'
                    }}
                  >
                    <item.icon style={{ width: '16px', height: '16px' }} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="hidden md:flex">
              {session ? (
                <>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    backgroundColor: '#1e40af', 
                    padding: '0.375rem 0.75rem', 
                    borderRadius: '9999px' 
                  }}>
                    <Coins style={{ width: '16px', height: '16px', color: '#93c5fd' }} />
                    <span style={{ color: '#93c5fd', fontWeight: '600' }}>{userTokens}</span>
                  </div>
                  <Link 
                    href="/profile" 
                    style={{ color: '#bfdbfe', fontSize: '0.875rem', textDecoration: 'none' }}
                  >
                    {session.user?.name}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    style={{ 
                      backgroundColor: '#64748b', 
                      color: 'white', 
                      padding: '0.375rem 0.75rem', 
                      borderRadius: '0.375rem', 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <LogOut style={{ width: '16px', height: '16px' }} />
                    <span>Выйти</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    style={{ 
                      color: 'white', 
                      backgroundColor: 'transparent',
                      padding: '0.625rem 1.25rem', 
                      borderRadius: '0.5rem', 
                      fontSize: '0.875rem', 
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      border: '2px solid #60a5fa'
                    }}
                  >
                    <LogIn style={{ width: '18px', height: '18px' }} />
                    <span>Войти</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    style={{ 
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      padding: '0.625rem 1.25rem', 
                      borderRadius: '0.5rem', 
                      fontSize: '0.875rem', 
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none'
                    }}
                  >
                    <UserPlus style={{ width: '18px', height: '18px' }} />
                    <span>Регистрация</span>
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden" style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ color: 'white', padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {mobileMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden" style={{ backgroundColor: '#1e40af' }}>
            <div style={{ padding: '0.5rem' }}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{ 
                    color: '#bfdbfe', 
                    display: 'block',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {session && authNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{ 
                    color: '#bfdbfe', 
                    display: 'block',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {session ? (
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  style={{ 
                    color: '#94a3b8', 
                    display: 'block',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Выйти
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    style={{ 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      fontSize: '1rem',
                      fontWeight: '500',
                      textDecoration: 'none',
                      marginBottom: '0.5rem',
                      border: '1px solid #60a5fa'
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn style={{ width: '20px', height: '20px' }} />
                    <span>Войти</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    style={{ 
                      color: 'white',
                      backgroundColor: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      fontSize: '1rem',
                      fontWeight: '500',
                      textDecoration: 'none'
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserPlus style={{ width: '20px', height: '20px' }} />
                    <span>Регистрация</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {children}
      </main>

      <footer style={{ backgroundColor: '#334155', color: '#cbd5e1', padding: '2rem 0', marginTop: '3rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem' }}>Мой Петропавловск</p>
          <p style={{ fontSize: '0.875rem' }}>Платформа гражданских инициатив для развития города</p>
          <p style={{ fontSize: '0.75rem', marginTop: '1rem', color: '#94a3b8' }}>2024 Все права защищены</p>
        </div>
      </footer>
    </div>
  )
}
