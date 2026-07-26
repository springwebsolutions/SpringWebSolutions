import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, X, Send, Phone, CheckCircle2, Sparkles, MessageCircle, ArrowUpRight, Bot, User, Loader2, RefreshCw, UserCheck, Ticket, Lock } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { liveChatService, type LiveChatMessage } from '@/lib/liveChatService'

interface ChatMessage {
  id: string
  sender: 'user' | 'bot' | 'agent'
  sender_name?: string
  text: string
  time: string
  options?: Array<{ label: string; action: string }>
}

export const FloatingContactWidgets: React.FC = () => {
  const navigate = useNavigate()
  const { user, profile } = useAuthStore()

  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isHumanConnected, setIsHumanConnected] = useState(false)
  const [ticketFlowState, setTicketFlowState] = useState<'none' | 'awaiting_subject'>('none')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const whatsappNumber = '918012622119'
  const sessionId = liveChatService.getSessionId()

  const initialMessages: ChatMessage[] = [
    {
      id: '1',
      sender: 'bot',
      text: '👋 Welcome to SpringWeb AI Assistant! How can our engineering team help your business today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: [
        { label: '🌐 Website Development Quote', action: 'quote' },
        { label: '⚡ Custom CRM / ERP Software', action: 'crm' },
        { label: '🎫 Create Support Ticket', action: 'ticket' },
        { label: '🎧 Request Live Admin / Human Chat', action: 'human' },
        { label: '📞 Book Phone Callback', action: 'callback' }
      ]
    }
  ]

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)

  // Realtime subscription to live chat messages from admin agent
  useEffect(() => {
    const unsubscribe = liveChatService.subscribeToSession(sessionId, (newMsg: LiveChatMessage) => {
      if (newMsg.sender === 'agent') {
        setIsHumanConnected(true)
        const formatted: ChatMessage = {
          id: newMsg.id,
          sender: 'agent',
          sender_name: newMsg.sender_name || 'Admin Engineer',
          text: newMsg.text,
          time: new Date(newMsg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => {
          if (prev.some(m => m.id === formatted.id)) return prev
          return [...prev, formatted]
        })
      }
    })
    return () => unsubscribe()
  }, [sessionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleWhatsAppDirect = (customText?: string) => {
    const text = customText || 'Hi SpringWeb Solutions! I would like to discuss a web development or software project.'
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const saveLeadToCRM = async (text: string) => {
    if (!isSupabaseConfigured) return
    try {
      await supabase.from('leads').insert([
        {
          full_name: 'Live Chatbot Prospect',
          email: text.includes('@') ? text.split(' ').find(w => w.includes('@')) : 'chat_prospect@springwebsolutions.in',
          phone: text.match(/\+?\d{10,12}/)?.[0] || null,
          message: `[AI Chatbot Query]: ${text}`,
          source: 'SpringWeb AI Chatbot',
          status: 'new'
        }
      ])
    } catch (e) {
      // Quiet fail if table or network unavailable
    }
  }

  const createSupportTicket = async (subject: string, priority: string = 'medium') => {
    if (!user) return null
    let ticketId = 'TICK-' + Math.floor(1000 + Math.random() * 9000)

    if (isSupabaseConfigured) {
      try {
        const { data: ticketRes, error: tErr } = await supabase
          .from('tickets')
          .insert({
            user_id: user.id,
            subject: subject,
            priority: priority,
            status: 'open'
          })
          .select()
          .single()

        if (ticketRes && !tErr) {
          ticketId = ticketRes.id
          await supabase.from('ticket_messages').insert({
            ticket_id: ticketRes.id,
            sender_id: user.id,
            message: `[Created via SpringWeb Chatbot]: ${subject}`
          })
        }
      } catch (e) {
        console.error('Chatbot ticket creation error:', e)
      }
    }
    return ticketId
  }

  const handleBotResponse = (userText: string, actionType?: string) => {
    setIsTyping(true)

    setTimeout(async () => {
      setIsTyping(false)
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      let botText = ''
      let options: Array<{ label: string; action: string }> | undefined = undefined

      if (actionType === 'ticket') {
        if (!user) {
          botText = '🔒 Support Ticket creation is available exclusively to registered client accounts. Please sign in to your account or register to submit support tickets.'
          options = [
            { label: '🔑 Sign In / Create Account', action: 'go_login' },
            { label: '🎧 Request Live Admin Chat', action: 'human' }
          ]
        } else {
          const userName = (profile as any)?.full_name || user.email?.split('@')[0] || 'Client'
          botText = `🎫 Welcome ${userName}! You can raise a support ticket directly from this chat. Select priority below or type your issue details:`
          setTicketFlowState('awaiting_subject')
          options = [
            { label: '🔴 High Priority Ticket', action: 'ticket_priority_high' },
            { label: '🟡 Medium Priority Ticket', action: 'ticket_priority_medium' },
            { label: '🟢 General Support Ticket', action: 'ticket_priority_low' }
          ]
        }
      } else if (actionType?.startsWith('ticket_priority_') || (ticketFlowState === 'awaiting_subject' && userText)) {
        if (!user) {
          botText = '🔒 Support Ticket creation requires an active client account.'
          options = [{ label: '🔑 Sign In Now', action: 'go_login' }]
        } else {
          const priority = actionType === 'ticket_priority_high' ? 'high' : actionType === 'ticket_priority_low' ? 'low' : 'medium'
          const subject = userText || 'Support Request via AI Chatbot'
          const ticketId = await createSupportTicket(subject, priority)
          botText = `✅ Support Ticket #${(ticketId || '').toString().slice(0, 8)} created successfully! Our engineering team has been notified and will review your ticket.`
          options = [
            { label: '📋 View Ticket in Support Portal', action: 'go_support' },
            { label: '🔄 Main Menu', action: 'reset' }
          ]
          setTicketFlowState('none')
        }
      } else if (actionType === 'human' || userText.toLowerCase().includes('admin') || userText.toLowerCase().includes('human') || userText.toLowerCase().includes('agent')) {
        botText = '🟢 You are now flagged for Live Admin / Engineer Chat! An administrator in our Operations Suite has been notified and can chat with you here directly in real-time.'
        setIsHumanConnected(true)
        options = [
          { label: '💬 Also Chat on WhatsApp Directly', action: 'whatsapp' }
        ]
      } else if (actionType === 'quote' || userText.toLowerCase().includes('website') || userText.toLowerCase().includes('quote')) {
        botText = 'Great! We engineer high-speed corporate sites, e-commerce stores, and web apps with sub-second page speed (<1s) and 100% full source code ownership. Standard turnaround is 1 to 2 weeks.'
        options = [
          { label: '🎧 Request Live Admin / Human Chat', action: 'human' },
          { label: '💬 Chat on WhatsApp Directly', action: 'whatsapp' }
        ]
      } else if (actionType === 'crm' || userText.toLowerCase().includes('crm') || userText.toLowerCase().includes('erp') || userText.toLowerCase().includes('software')) {
        botText = 'We build custom business portals, inventory ERP systems, client dashboards, and automated lead management CRM software tailored to your specific workflow.'
        options = [
          { label: '🎧 Request Live Admin / Human Chat', action: 'human' },
          { label: '💬 Chat on WhatsApp Directly', action: 'whatsapp' }
        ]
      } else if (actionType === 'callback' || userText.toLowerCase().includes('call') || userText.toLowerCase().includes('phone')) {
        botText = 'Our direct phone line is +91 80126 22119. You can also type your phone number below and our lead engineer will call you back within 1 hour!'
      } else if (userText.includes('@') || userText.match(/\d{10}/)) {
        botText = 'Thank you! I have recorded your contact details into our Lead CRM. Our senior solution architect will reach out to you shortly.'
        saveLeadToCRM(userText)
      } else {
        botText = `Thank you for reaching out! I've logged "${userText}" for our team. Would you like to talk to a live admin or create a support ticket?`
        options = [
          { label: '🎫 Create Support Ticket', action: 'ticket' },
          { label: '🎧 Connect to Live Admin', action: 'human' },
          { label: '💬 Open WhatsApp Chat', action: 'whatsapp' }
        ]
        saveLeadToCRM(userText)
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: botText,
          time: now,
          options
        }
      ])
    }, 600)
  }

  const handleUserSendMessage = (customText?: string, actionType?: string) => {
    const text = customText || inputMessage.trim()
    if (!text && !actionType) return

    if (actionType === 'go_login') {
      setIsLiveChatOpen(false)
      navigate('/login')
      return
    }

    if (actionType === 'go_support') {
      setIsLiveChatOpen(false)
      navigate('/support')
      return
    }

    if (actionType === 'whatsapp') {
      handleWhatsAppDirect(text)
      return
    }

    if (actionType === 'reset') {
      setMessages(initialMessages)
      setInputMessage('')
      setIsHumanConnected(false)
      setTicketFlowState('none')
      return
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text || actionType || 'Inquiry',
      time: now
    }

    setMessages(prev => [...prev, userMsg])
    setInputMessage('')

    // Broadcast user message to realtime service for Admin Panel
    liveChatService.sendMessage(sessionId, 'user', text || actionType || 'Inquiry')

    handleBotResponse(text || actionType || '', actionType)
  }

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end space-y-3 pointer-events-auto">
      
      {/* Live AI Chatbot Drawer */}
      {isLiveChatOpen && (
        <div className="mb-2 w-80 sm:w-96 rounded-2xl bg-[#080b14] border border-white/10 shadow-2xl shadow-emerald-900/30 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 via-teal-600 to-emerald-500 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white backdrop-blur-md">
                  <Bot size={22} className="text-white" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight">SpringWeb AI Assistant</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  {isHumanConnected ? (
                    <span className="flex items-center gap-1 font-bold text-amber-300">
                      <UserCheck size={11} /> Admin Engineer Connected
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 size={11} className="text-emerald-300" /> Automated • Instant Responses
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setMessages(initialMessages); setIsHumanConnected(false) }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Reset Chat"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => setIsLiveChatOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="p-4 space-y-3 bg-[#040509] max-h-96 overflow-y-auto custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col space-y-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  {msg.sender === 'agent' ? (
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <UserCheck size={10} /> {msg.sender_name || 'Admin Engineer'}
                    </span>
                  ) : msg.sender === 'bot' ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <Sparkles size={10} /> SpringWeb Bot
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                      <User size={10} /> You
                    </span>
                  )}
                  <span>• {msg.time}</span>
                </div>

                <div
                  className={`p-3 rounded-2xl text-xs font-sans leading-relaxed max-w-[88%] ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold rounded-br-none shadow-md'
                      : msg.sender === 'agent'
                      ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/30 text-white font-medium rounded-bl-none shadow-md'
                      : 'bg-white/[0.05] border border-white/10 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Interactive Bot Options */}
                {msg.options && (
                  <div className="pt-2 grid grid-cols-1 gap-1.5 w-full">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleUserSendMessage(opt.label, opt.action)}
                        className="text-left text-xs p-2.5 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <span>{opt.label}</span>
                        <Send size={11} className="opacity-0 group-hover:opacity-100 text-emerald-400 shrink-0 ml-2 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 text-xs text-slate-400 pt-1">
                <Loader2 size={13} className="animate-spin text-emerald-400" />
                <span>SpringWeb AI is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Direct Actions Footer */}
          <div className="p-3 bg-[#080b14] border-t border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUserSendMessage()}
                placeholder="Type your question or phone number..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                onClick={() => handleUserSendMessage()}
                className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all cursor-pointer shrink-0"
              >
                <Send size={14} />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
              <span>Direct Phone:</span>
              <a
                href="tel:+918012622119"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                <Phone size={11} /> +91 80126 22119
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TWO SEPARATE FLOATING BUTTONS WITH LEVITATION ANIMATION */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 animate-float-gentle">
        
        {/* BUTTON 1: WhatsApp Button (Direct WhatsApp Link) */}
        <button
          onClick={() => handleWhatsAppDirect()}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/30 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          title="Direct WhatsApp Chat"
        >
          <MessageCircle size={17} className="fill-slate-950 text-[#25D366] animate-bounce" />
          <span>WhatsApp Us</span>
          <ArrowUpRight size={13} className="text-slate-950 opacity-80" />
        </button>

        {/* BUTTON 2: Live Support AI Chatbot Button (In-Chat Bot Responses) */}
        <button
          onClick={() => setIsLiveChatOpen(!isLiveChatOpen)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-white/20"
          title="Open SpringWeb AI Chatbot"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          {isLiveChatOpen ? (
            <span className="flex items-center gap-1">
              <X size={15} /> Close Chat
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Bot size={15} className="animate-pulse" /> AI Assistant
            </span>
          )}
        </button>

      </div>
    </div>
  )
}
export default FloatingContactWidgets
