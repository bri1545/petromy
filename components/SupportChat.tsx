import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { 
  MessageCircle, X, Send, Loader2, Bot, User, 
  AlertCircle, CheckCircle, ChevronDown
} from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai' | 'admin'
  isAI: boolean
  createdAt: string
}

interface Ticket {
  id: string
  status: string
  needsAdmin: boolean
  category: string
  messages: Message[]
}

export default function SupportChat() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [showWelcome, setShowWelcome] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!ticket?.id || !isOpen || ticket.status === 'CLOSED') return

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/support/chat?ticketId=${ticket.id}`)
        if (res.ok) {
          const data = await res.json()
          if (data.ticket) {
            setTicket(data.ticket)
            if (data.ticket.messages.length > messages.length) {
              setMessages(data.ticket.messages)
            }
          }
        }
      } catch (error) {
        console.error('Error polling ticket:', error)
      }
    }, 5000)

    return () => clearInterval(pollInterval)
  }, [ticket?.id, isOpen, ticket?.status, messages.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || loading) return

    const userMessage = message.trim()
    setMessage('')
    setShowWelcome(false)
    setLoading(true)

    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      content: userMessage,
      sender: 'user',
      isAI: false,
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMsg])

    try {
      const res = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          ticketId: ticket?.id,
          history: messages.slice(-6)
        })
      })

      const data = await res.json()

      if (data.ticket) {
        setTicket(data.ticket)
        setMessages(data.ticket.messages)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        content: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
        sender: 'ai',
        isAI: true,
        createdAt: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const quickQuestions = [
    'Как подать проект?',
    'Как работает голосование?',
    'Кто может участвовать?',
    'У меня жалоба'
  ]

  const handleQuickQuestion = (question: string) => {
    setMessage(question)
    setTimeout(() => {
      const form = document.getElementById('support-form') as HTMLFormElement
      if (form) form.requestSubmit()
    }, 100)
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105"
        style={{ display: isOpen ? 'none' : 'flex' }}
        aria-label="Открыть чат поддержки"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      </button>

      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ height: 'min(600px, calc(100vh - 6rem))' }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Поддержка</h3>
                  <p className="text-xs text-blue-100">Мой Петропавловск</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Закрыть чат"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {ticket && (
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="bg-white/20 px-2 py-0.5 rounded-full">
                  {categoryLabels[ticket.category] || ticket.category}
                </span>
                {ticket.needsAdmin && (
                  <span className="bg-amber-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Ожидает админа
                  </span>
                )}
                {ticket.status === 'CLOSED' && (
                  <span className="bg-green-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Закрыт
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {showWelcome && messages.length === 0 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Привет{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}!
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Я AI-помощник платформы. Задайте вопрос о сайте или напишите жалобу/предложение.
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickQuestion(q)}
                      className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-50 hover:border-blue-300 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : msg.sender === 'admin'
                      ? 'bg-amber-100 text-amber-900 rounded-bl-md border border-amber-200'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                  }`}
                >
                  {msg.sender !== 'user' && (
                    <div className="flex items-center gap-1.5 mb-1">
                      {msg.sender === 'admin' ? (
                        <>
                          <User className="w-3 h-3" />
                          <span className="text-xs font-medium">Администратор</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-blue-600" />
                          <span className="text-xs font-medium text-blue-600">AI-помощник</span>
                        </>
                      )}
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-500">AI думает...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {ticket?.needsAdmin && (
            <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 text-center">
              <p className="text-xs text-amber-700">
                Ваше обращение передано администратору. Ответ придёт в этот чат.
              </p>
            </div>
          )}

          <form
            id="support-form"
            onSubmit={handleSubmit}
            className="p-4 bg-white border-t border-gray-100"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-2.5 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                disabled={loading || ticket?.status === 'CLOSED'}
              />
              <button
                type="submit"
                disabled={!message.trim() || loading || ticket?.status === 'CLOSED'}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
