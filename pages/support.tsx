import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { 
  MessageCircle, Send, Loader2, User, Bot, AlertCircle, 
  CheckCircle, XCircle, Clock, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: string
  isAI: boolean
  createdAt: string
}

interface Ticket {
  id: string
  status: string
  category: string
  needsAdmin: boolean
  userId: string | null
  userEmail: string | null
  userName: string | null
  createdAt: string
  updatedAt: string
  messages: Message[]
}

const categoryLabels: Record<string, string> = {
  GENERAL: 'Общий вопрос',
  PROJECTS: 'Проекты',
  VOTING: 'Голосование',
  ACCOUNT: 'Аккаунт',
  SUBSCRIPTION: 'Подписка',
  COMPLAINT: 'Жалоба',
  SUGGESTION: 'Предложение',
  TECHNICAL: 'Техническая проблема'
}

const categoryColors: Record<string, string> = {
  GENERAL: 'bg-gray-100 text-gray-700',
  PROJECTS: 'bg-blue-100 text-blue-700',
  VOTING: 'bg-purple-100 text-purple-700',
  ACCOUNT: 'bg-green-100 text-green-700',
  SUBSCRIPTION: 'bg-indigo-100 text-indigo-700',
  COMPLAINT: 'bg-red-100 text-red-700',
  SUGGESTION: 'bg-amber-100 text-amber-700',
  TECHNICAL: 'bg-orange-100 text-orange-700'
}

export default function SupportAdmin() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'needsAdmin' | 'open' | 'closed'>('needsAdmin')
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (authStatus === 'authenticated') {
      const role = (session?.user as any)?.role
      if (!['MODERATOR', 'ADMIN'].includes(role)) {
        router.push('/')
        return
      }
      fetchTickets()
    }
  }, [authStatus, filter])

  const fetchTickets = async () => {
    setLoading(true)
    try {
      let url = '/api/support/tickets?'
      if (filter === 'needsAdmin') url += 'needsAdmin=true'
      else if (filter === 'open') url += 'status=OPEN'
      else if (filter === 'closed') url += 'status=CLOSED'

      const res = await fetch(url)
      
      if (res.status === 401 || res.status === 403) {
        router.push('/')
        return
      }
      
      if (!res.ok) {
        console.error('Error response:', res.status)
        setTickets([])
        return
      }
      
      const data = await res.json()
      setTickets(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (ticketId: string) => {
    if (!replyText.trim()) return
    setSending(true)

    try {
      await fetch(`/api/support/${ticketId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply', message: replyText.trim() })
      })
      setReplyText('')
      fetchTickets()
    } catch (error) {
      console.error('Error sending reply:', error)
    } finally {
      setSending(false)
    }
  }

  const handleAction = async (ticketId: string, action: 'close' | 'reopen') => {
    try {
      await fetch(`/api/support/${ticketId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      fetchTickets()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (authStatus === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  const needsAdminCount = tickets.filter(t => t.needsAdmin && t.status === 'OPEN').length

  return (
    <>
      <Head>
        <title>Поддержка - Мой Петропавловск</title>
      </Head>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Обращения в поддержку</h1>
          {needsAdminCount > 0 && (
            <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
              {needsAdminCount}
            </span>
          )}
        </div>
        <p className="text-gray-600">Просматривайте и отвечайте на обращения пользователей</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-wrap gap-2 p-4 border-b border-gray-100">
          <button
            onClick={() => setFilter('needsAdmin')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              filter === 'needsAdmin'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Требуют внимания
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              filter === 'open'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Открытые
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              filter === 'closed'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Закрытые
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === 'all'
                ? 'bg-gray-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Все
          </button>
          <button
            onClick={fetchTickets}
            className="ml-auto px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="p-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Нет обращений</h3>
            <p className="text-gray-500">
              {filter === 'needsAdmin' 
                ? 'Нет обращений, требующих вашего внимания'
                : 'Обращения отсутствуют'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-4">
                <div 
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[ticket.category] || categoryColors.GENERAL}`}>
                        {categoryLabels[ticket.category] || ticket.category}
                      </span>
                      {ticket.needsAdmin && ticket.status === 'OPEN' && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Требует ответа
                        </span>
                      )}
                      {ticket.status === 'CLOSED' && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Закрыт
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{ticket.userName || ticket.userEmail || 'Гость'}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-400">
                        {new Date(ticket.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-400">{ticket.messages.length} сообщ.</span>
                    </div>
                    
                    {ticket.messages.length > 0 && (
                      <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                        {ticket.messages[0].content}
                      </p>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    {expandedTicket === ticket.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedTicket === ticket.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto space-y-3 mb-4">
                      {ticket.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl px-3 py-2 ${
                              msg.sender === 'user'
                                ? 'bg-blue-600 text-white'
                                : msg.sender === 'admin'
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-white text-gray-800 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-1 mb-1 text-xs opacity-75">
                              {msg.sender === 'user' ? (
                                <User className="w-3 h-3" />
                              ) : msg.sender === 'admin' ? (
                                <User className="w-3 h-3" />
                              ) : (
                                <Bot className="w-3 h-3" />
                              )}
                              <span>
                                {msg.sender === 'user' 
                                  ? 'Пользователь' 
                                  : msg.sender === 'admin' 
                                  ? 'Админ' 
                                  : 'AI'}
                              </span>
                              <span>·</span>
                              <span>
                                {new Date(msg.createdAt).toLocaleTimeString('ru-RU', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {ticket.status === 'OPEN' && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Написать ответ..."
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleReply(ticket.id)
                            }
                          }}
                        />
                        <button
                          onClick={() => handleReply(ticket.id)}
                          disabled={!replyText.trim() || sending}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg flex items-center gap-2 text-sm font-medium"
                        >
                          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          Ответить
                        </button>
                        <button
                          onClick={() => handleAction(ticket.id, 'close')}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          Закрыть
                        </button>
                      </div>
                    )}

                    {ticket.status === 'CLOSED' && (
                      <button
                        onClick={() => handleAction(ticket.id, 'reopen')}
                        className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg flex items-center gap-2 text-sm font-medium"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Открыть заново
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
