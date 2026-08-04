import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { liveChatService, type LiveChatSession, type LiveChatMessage } from '@/lib/liveChatService'
import { 
  Ticket, CheckCircle2, XCircle, Search, MessageSquare, Send,
  Loader2, AlertCircle, RefreshCw, UserCheck, ShieldAlert, Bot, User, Phone
} from 'lucide-react'

export const SupportManager: React.FC = () => {
  const { user } = useAuthStore()
  const location = useLocation()
  const isSuiteDomain = typeof window !== 'undefined' && window.location.hostname.startsWith('suite.')
  const prefix = isSuiteDomain ? '' : '/admin'

  // Tab State: 'tickets' | 'livechat'
  const isLiveChatRoute = location.search.includes('tab=livechat')
  const [activeTab, setActiveTab] = useState<'tickets' | 'livechat'>(isLiveChatRoute ? 'livechat' : 'tickets')

  // Support Tickets State
  const [tickets, setTickets] = useState<any[]>([])
  const [staffList, setStaffList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  // Live Chat Console State
  const [chatSessions, setChatSessions] = useState<LiveChatSession[]>([])
  const [selectedChatSession, setSelectedChatSession] = useState<LiveChatSession | null>(null)
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([])
  const [adminReplyText, setAdminReplyText] = useState('')
  const [chatSending, setChatSending] = useState(false)

  const fetchTickets = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          products(name),
          profiles:user_id(full_name, company),
          assignee:assigned_to(full_name)
        `)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setTickets(data || [])

      if (selectedTicket) {
        const updatedSel = (data || []).find((t: any) => t.id === selectedTicket.id)
        if (updatedSel) {
          setSelectedTicket(updatedSel)
        }
      }
    } catch (err) {
      console.error('Error fetching admin tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchLiveChatSessions = async () => {
    try {
      const sessions = await liveChatService.fetchActiveSessions()
      setChatSessions(sessions)
      if (sessions.length > 0 && !selectedChatSession) {
        setSelectedChatSession(sessions[0])
      }
    } catch (err) {
      console.error('Live chat sessions fetch error:', err)
    }
  }

  const fetchStaff = async () => {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
      if (error) throw error
      setStaffList(data || [])
    } catch (err) {
      console.error('Error loading staff list:', err)
    }
  }

  useEffect(() => {
    fetchTickets()
    fetchStaff()
    fetchLiveChatSessions()
  }, [])

  // Live chat message listener for selected chat session
  useEffect(() => {
    if (!selectedChatSession) return

    liveChatService.fetchSessionMessages(selectedChatSession.session_id).then(msgs => {
      setChatMessages(msgs)
    })

    const unsubscribe = liveChatService.subscribeToSession(selectedChatSession.session_id, (newMsg: LiveChatMessage) => {
      setChatMessages(prev => {
        if (prev.some(m => m.id === newMsg.id)) return prev
        return [...prev, newMsg]
      })
      fetchLiveChatSessions()
    })

    return () => unsubscribe()
  }, [selectedChatSession])

  const loadTicketMessages = async (ticketId: string) => {
    if (!isSupabaseConfigured) return
    setLoadingMessages(true)
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*, profiles(full_name, avatar_url)')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      console.error('Error loading ticket thread:', err)
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSelectTicket = async (ticket: any) => {
    setSelectedTicket(ticket)
    setReplyText('')
    await loadTicketMessages(ticket.id)
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedTicket || !user || !isSupabaseConfigured) return

    setSending(true)
    try {
      const { error: msgErr } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: selectedTicket.id,
          sender_id: user.id,
          message: replyText.trim()
        })

      if (msgErr) throw msgErr

      const newStatus = selectedTicket.status === 'open' ? 'in_progress' : selectedTicket.status
      await supabase
        .from('tickets')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', selectedTicket.id)

      setReplyText('')
      await fetchTickets()
      await loadTicketMessages(selectedTicket.id)
    } catch (err) {
      console.error('Reply failed:', err)
    } finally {
      setSending(false)
    }
  }

  const handleSendLiveChatAdminReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminReplyText.trim() || !selectedChatSession) return

    setChatSending(true)
    try {
      await liveChatService.sendMessage(
        selectedChatSession.session_id,
        'agent',
        adminReplyText.trim(),
        'SpringWeb Admin Engineer'
      )
      setAdminReplyText('')
      const updatedMsgs = await liveChatService.fetchSessionMessages(selectedChatSession.session_id)
      setChatMessages(updatedMsgs)
    } catch (err) {
      console.error('Admin live chat send error:', err)
    } finally {
      setChatSending(false)
    }
  }

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      (t.profiles?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.profiles?.company || '').toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'tickets' 
              ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300' 
              : 'bg-white/[0.03] border border-white/[0.07] text-slate-400 hover:text-white'
          }`}
        >
          Support Tickets ({tickets.length})
        </button>

        <button
          onClick={() => setActiveTab('livechat')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'livechat' 
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' 
              : 'bg-white/[0.03] border border-white/[0.07] text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare size={13} className="text-emerald-400" />
          <span>Live Chat Console ({chatSessions.length})</span>
          {chatSessions.some(s => s.status === 'waiting_admin') && (
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        <Link
          to={`${prefix}/contacts`}
          className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] text-slate-400 hover:text-white text-xs font-medium transition-all"
        >
          Contact Submissions
        </Link>
      </div>

      {/* ── TAB 1: SUPPORT TICKETS ── */}
      {activeTab === 'tickets' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="admin-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-white/[0.06] flex items-center justify-center">
                  <Ticket size={18} className="text-amber-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight">Support Desk &amp; Tickets</h1>
                  <p className="text-[12px] text-slate-500 mt-0.5">Manage tickets, assign staff, and reply to client inquiries.</p>
                </div>
              </div>
              <button 
                onClick={fetchTickets}
                className="btn-admin-secondary text-xs"
              >
                <RefreshCw size={13} />
                <span>Refresh Inbox</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="animate-spin text-emerald-500" size={28} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className={`${selectedTicket ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4 transition-all duration-300`}>
                <div className="admin-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Client</th>
                          <th>Subject</th>
                          <th>Status</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTickets.map((t) => (
                          <tr key={t.id} onClick={() => handleSelectTicket(t)} className="cursor-pointer">
                            <td className="font-semibold text-white">{t.profiles?.full_name || 'Client'}</td>
                            <td className="text-slate-300 text-xs truncate max-w-xs">{t.subject}</td>
                            <td><span className="badge badge-green capitalize">{t.status}</span></td>
                            <td className="text-right text-xs text-emerald-400 font-bold">Open Thread</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {selectedTicket && (
                <div className="lg:col-span-6 admin-card p-5 space-y-4">
                  <div className="border-b border-white/[0.06] pb-3">
                    <h3 className="font-bold text-white text-base">{selectedTicket.subject}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedTicket.profiles?.full_name}</p>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {messages.map(m => (
                      <div key={m.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-slate-300">
                        <p>{m.message}</p>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendReply} className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type ticket reply..."
                      className="admin-input text-xs"
                    />
                    <button type="submit" disabled={sending} className="btn-admin-primary px-4 text-xs font-bold">
                      Send
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: LIVE CHAT OPERATOR CONSOLE ── */}
      {activeTab === 'livechat' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="admin-card p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <MessageSquare size={18} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Live Visitor Chat Console</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    Realtime Active
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Chat directly in real-time with website visitors and AI assistant prospects.</p>
              </div>
            </div>

            <button
              onClick={fetchLiveChatSessions}
              className="btn-admin-secondary text-xs flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Refresh Sessions</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Chat Sessions List */}
            <div className="lg:col-span-5 admin-card p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Active Visitor Sessions ({chatSessions.length})
              </h3>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {chatSessions.map(session => {
                  const isSelected = selectedChatSession?.session_id === session.session_id
                  return (
                    <div
                      key={session.session_id}
                      onClick={() => setSelectedChatSession(session)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                        isSelected 
                          ? 'bg-emerald-500/10 border-emerald-500/40 shadow-md' 
                          : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <User size={13} className="text-emerald-400" />
                          <span>{session.user_name}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(session.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-1">{session.last_message}</p>

                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-slate-500 truncate max-w-[180px]">{session.session_id}</span>
                        {session.status === 'waiting_admin' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                            Waiting Admin
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}

                {chatSessions.length === 0 && (
                  <div className="text-center py-12 text-slate-600 text-xs font-mono">
                    No active chat sessions found.
                  </div>
                )}
              </div>
            </div>

            {/* Right: Live Chat Conversation Thread Inspector */}
            {selectedChatSession ? (
              <div className="lg:col-span-7 admin-card p-6 space-y-4">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <span>{selectedChatSession.user_name}</span>
                      <span className="text-xs font-normal text-slate-400 font-mono">({selectedChatSession.session_id})</span>
                    </h3>
                    <p className="text-xs text-emerald-400 mt-0.5">Live Realtime Channel • SpringWeb Operations Suite</p>
                  </div>
                </div>

                {/* Messages Container */}
                <div className="space-y-3 min-h-[320px] max-h-[380px] overflow-y-auto p-3 bg-white/[0.01] rounded-2xl border border-white/[0.05]">
                  {chatMessages.map(m => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.sender === 'agent' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1 font-mono">
                        <span>{m.sender_name || m.sender}</span>
                        <span>&bull;</span>
                        <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl max-w-sm text-xs leading-relaxed ${
                          m.sender === 'agent'
                            ? 'bg-emerald-500 text-slate-950 font-semibold rounded-tr-none'
                            : m.sender === 'user'
                            ? 'bg-white/10 text-white rounded-tl-none border border-white/10'
                            : 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Response Form */}
                <form onSubmit={handleSendLiveChatAdminReply} className="flex gap-2 pt-2 border-t border-white/[0.06]">
                  <input
                    type="text"
                    required
                    value={adminReplyText}
                    onChange={e => setAdminReplyText(e.target.value)}
                    placeholder="Type live admin reply to visitor..."
                    className="admin-input text-xs flex-1"
                  />
                  <button
                    type="submit"
                    disabled={chatSending}
                    className="btn-admin-primary px-4 text-xs font-bold cursor-pointer"
                  >
                    {chatSending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                    <span>Reply</span>
                  </button>
                </form>

              </div>
            ) : (
              <div className="lg:col-span-7 admin-card p-12 text-center text-slate-500 text-xs">
                Select a chat session from the left column to reply live.
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  )
}

export default SupportManager
