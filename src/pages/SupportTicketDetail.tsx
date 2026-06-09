import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { 
  ArrowLeft, Send, CheckCircle2, MessageSquare, 
  Loader2, AlertCircle, RefreshCw, XCircle 
} from 'lucide-react'

export const SupportTicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user, profile, loading: authLoading } = useAuthStore()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const chatEndRef = useRef<HTMLDivElement>(null)

  const fetchTicketDetails = async () => {
    if (!id || !user || !isSupabaseConfigured) return
    try {
      // 1. Fetch Ticket
      const { data: ticketData, error: ticketErr } = await supabase
        .from('tickets')
        .select('*, products(name)')
        .eq('id', id)
        .single()

      if (ticketErr || !ticketData) {
        throw new Error('Ticket not found or access denied')
      }

      setTicket(ticketData)

      // 2. Fetch Messages and author profile info
      const { data: messagesData, error: messagesErr } = await supabase
        .from('ticket_messages')
        .select('*, profiles(full_name, avatar_url)')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true })

      if (messagesErr) throw messagesErr
      setMessages(messagesData || [])

    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Error occurred while loading ticket information.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
      return
    }
    fetchTicketDetails()
  }, [id, user, authLoading])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !id || !user || !isSupabaseConfigured || ticket.status === 'closed') return

    setSending(true)
    setErrorMsg(null)

    try {
      const { error: sendErr } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: id,
          sender_id: user.id,
          message: replyText.trim()
        })

      if (sendErr) throw sendErr

      // Update ticket updated_at column
      await supabase
        .from('tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id)

      setReplyText('')
      await fetchTicketDetails()
    } catch (err: any) {
      console.error('Send message failed:', err)
      setErrorMsg(err.message || 'Failed to submit response.')
    } finally {
      setSending(false)
    }
  }

  const handleResolveTicket = async () => {
    if (!id || !user || !isSupabaseConfigured) return
    setUpdatingStatus(true)
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'resolved', updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      await fetchTicketDetails()
    } catch (err: any) {
      console.error('Resolve ticket failed:', err)
      alert(err.message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleCloseTicket = async () => {
    if (!id || !user || !isSupabaseConfigured) return
    setUpdatingStatus(true)
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'closed', updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      await fetchTicketDetails()
    } catch (err: any) {
      console.error('Close ticket failed:', err)
      alert(err.message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (authLoading || (loading && !ticket)) {
    return (
      <div className="min-h-screen bg-[#070a13] flex items-center justify-center text-brand-emerald">
        <Loader2 className="animate-spin" size={36} />
      </div>
    )
  }

  if (errorMsg && !ticket) {
    return (
      <div className="min-h-screen bg-[#070a13] flex flex-col items-center justify-center text-slate-200">
        <div className="p-8 rounded-2xl glass-panel text-center space-y-4 max-w-md">
          <AlertCircle className="mx-auto text-rose-400" size={48} />
          <h2 className="text-lg font-bold">Access Denied</h2>
          <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
          <Link to="/support" className="btn-secondary text-xs inline-block">Back to Tickets</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col dark:bg-[#070a13] light:bg-[#f8fafc]">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6 dark:border-white/5 light:border-slate-200">
            <div className="space-y-1">
              <Link to="/support" className="inline-flex items-center gap-1.5 text-xs text-slate-450 hover:text-white transition-colors light:text-slate-500 light:hover:text-slate-800">
                <ArrowLeft size={13} />
                <span>Back to Support Desk</span>
              </Link>
              <div className="flex items-center gap-3 mt-1">
                <h1 className="text-2xl font-bold text-white tracking-tight light:text-slate-900">
                  {ticket.subject}
                </h1>
                <span className="text-xs font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400">
                  #{ticket.id.slice(0, 8)}
                </span>
              </div>
              <p className="text-xs text-slate-450 mt-1">
                Product: <span className="text-slate-300 light:text-slate-700 font-semibold">{ticket.products?.name || 'General Solutions'}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={fetchTicketDetails}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Refresh Thread"
              >
                <RefreshCw size={15} />
              </button>
              {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                <button
                  onClick={handleResolveTicket}
                  disabled={updatingStatus}
                  className="btn-secondary text-xs flex items-center gap-1 bg-teal-500/10 border-teal-500/20 text-teal-400 hover:bg-teal-500/20"
                >
                  <CheckCircle2 size={14} />
                  <span>Mark Resolved</span>
                </button>
              )}
              {ticket.status !== 'closed' && (
                <button
                  onClick={handleCloseTicket}
                  disabled={updatingStatus}
                  className="btn-secondary text-xs flex items-center gap-1 bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                >
                  <XCircle size={14} />
                  <span>Close Ticket</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Messages Thread Column */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Chat panel */}
              <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[500px]">
                
                {/* Thread Header details */}
                <div className="bg-white/2 px-6 py-3 border-b border-white/5 text-[10px] text-slate-450 uppercase font-semibold tracking-wider flex items-center justify-between light:border-slate-200">
                  <span>Message History</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] border font-bold ${
                    ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    ticket.status === 'in_progress' ? 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20' :
                    ticket.status === 'resolved' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                    'bg-slate-700/10 text-slate-400 border-slate-700/20'
                  }`}>
                    Status: {ticket.status}
                  </span>
                </div>

                {/* Messages scrollable div */}
                <div className="flex-grow p-6 overflow-y-auto space-y-4">
                  {messages.map((msg) => {
                    const isSelf = msg.sender_id === user?.id
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] ${isSelf ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        {/* Sender info */}
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1">
                          <span className="font-semibold text-slate-400">
                            {isSelf ? 'You' : (msg.profiles?.full_name || 'Support Engineer')}
                          </span>
                          <span>•</span>
                          <span>{new Date(msg.created_at).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </div>
                        {/* Bubble */}
                        <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                          isSelf 
                            ? 'bg-brand-indigo text-white rounded-tr-none' 
                            : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none light:bg-slate-100 light:border-slate-200 light:text-slate-800'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    )
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Form Reply controls */}
                <div className="p-4 bg-white/2 border-t border-white/5 light:border-slate-200">
                  {ticket.status === 'closed' ? (
                    <div className="text-center py-2 text-slate-500 text-xs font-semibold">
                      This ticket is closed. If you need further help, please open a new support ticket.
                    </div>
                  ) : (
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-grow px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-white light:border-slate-200 light:text-slate-800"
                        placeholder="Write your response message..."
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={sending || !replyText.trim()}
                        className="btn-primary py-2.5 px-5 font-semibold text-xs sm:text-sm flex items-center gap-1.5 shrink-0 shadow-lg shadow-brand-emerald/10"
                      >
                        {sending ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </div>

            {/* Sidebar Ticket stats */}
            <div className="lg:col-span-3 space-y-4">
              <div className="glass-panel p-6 rounded-2xl space-y-4 text-xs">
                <h3 className="font-display font-bold text-white text-xs tracking-wide uppercase border-b border-white/5 pb-2">
                  Ticket Details
                </h3>
                
                <div className="space-y-3 text-slate-400">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Status</span>
                    <span className="font-semibold text-white light:text-slate-800 uppercase">{ticket.status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Priority</span>
                    <span className="font-semibold text-white light:text-slate-800 uppercase">{ticket.priority}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Created Date</span>
                    <span className="font-semibold text-slate-350">{new Date(ticket.created_at).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Last Activity</span>
                    <span className="font-semibold text-slate-350">{new Date(ticket.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
export default SupportTicketDetail
