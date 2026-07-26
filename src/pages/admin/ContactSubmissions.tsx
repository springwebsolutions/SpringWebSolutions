import React, { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useCRMStore } from '@/stores/crmStore'
import { liveChatService, type LiveChatMessage, type LiveChatSession } from '@/lib/liveChatService'
import { 
  MessageSquare, Mail, Phone, Building, Calendar, DollarSign, Clock, 
  Search, Filter, CheckCircle2, AlertCircle, Trash2, ArrowUpRight, 
  UserCheck, Send, RefreshCw, Eye, User, Sparkles, Bot, ShieldCheck, Plus
} from 'lucide-react'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  type: string
  status: 'new' | 'reviewed' | 'contacted' | 'converted' | 'archived'
  budget?: string
  timeline?: string
  description: string
  created_at: string
}

export const ContactSubmissions: React.FC = () => {
  const { user, profile } = useAuthStore()
  const { fetchLeads } = useCRMStore()

  const [activeTab, setActiveTab] = useState<'submissions' | 'livechat'>('submissions')
  
  // ─── Contact Submissions State ──────────────────────────────────────────
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // ─── Live Chat Console State ──────────────────────────────────────────────
  const [chatSessions, setChatSessions] = useState<LiveChatSession[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [sessionMessages, setSessionMessages] = useState<LiveChatMessage[]>([])
  const [replyInput, setReplyInput] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  // Fetch Submissions
  const loadSubmissions = async () => {
    setLoading(true)
    let fetched: ContactSubmission[] = []

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })
        if (!error && data) fetched = data
      } catch (e) {}
    }

    // Combine with local offline submissions
    try {
      const local = JSON.parse(localStorage.getItem('sw_contact_submissions') || '[]')
      const mergedMap = new Map<string, ContactSubmission>()
      fetched.forEach(item => mergedMap.set(item.id, item))
      local.forEach((item: ContactSubmission) => {
        if (!mergedMap.has(item.id)) mergedMap.set(item.id, item)
      })
      fetched = Array.from(mergedMap.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } catch (e) {}

    setSubmissions(fetched)
    setLoading(false)
  }

  // Fetch Live Chat Sessions
  const loadChatSessions = async () => {
    const sessions = await liveChatService.fetchActiveSessions()
    setChatSessions(sessions)
    if (sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].session_id)
    }
  }

  useEffect(() => {
    loadSubmissions()
    loadChatSessions()

    const timer = setInterval(() => {
      loadChatSessions()
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  // Subscribe to messages when session selected
  useEffect(() => {
    if (!selectedSessionId) return

    const loadHistory = async () => {
      const msgs = await liveChatService.fetchSessionMessages(selectedSessionId)
      setSessionMessages(msgs)
    }
    loadHistory()

    const unsubscribe = liveChatService.subscribeToSession(selectedSessionId, (newMsg) => {
      setSessionMessages(prev => {
        if (prev.some(m => m.id === newMsg.id)) return prev
        return [...prev, newMsg]
      })
    })

    return () => unsubscribe()
  }, [selectedSessionId])

  // Update submission status
  const updateStatus = async (id: string, newStatus: ContactSubmission['status']) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
    if (selectedSubmission?.id === id) {
      setSelectedSubmission(prev => prev ? { ...prev, status: newStatus } : null)
    }

    // Save to local storage
    try {
      const local = JSON.parse(localStorage.getItem('sw_contact_submissions') || '[]')
      const updated = local.map((item: any) => item.id === id ? { ...item, status: newStatus } : item)
      localStorage.setItem('sw_contact_submissions', JSON.stringify(updated))
    } catch (e) {}

    if (isSupabaseConfigured) {
      try {
        await supabase.from('contact_submissions').update({ status: newStatus }).eq('id', id)
      } catch (e) {}
    }

    setActionSuccess(`Status updated to ${newStatus.toUpperCase()}`)
    setTimeout(() => setActionSuccess(null), 3000)
  }

  // Convert submission to CRM lead
  const convertToCRMLead = async (sub: ContactSubmission) => {
    try {
      if (isSupabaseConfigured) {
        await supabase.from('leads').insert([{
          name: sub.name,
          email: sub.email,
          phone: sub.phone || null,
          company: sub.company || null,
          type: sub.type || 'contact',
          status: 'new',
          budget: sub.budget || null,
          timeline: sub.timeline || null,
          description: `[From Contact Form]: ${sub.description}`
        }])
      }
      await updateStatus(sub.id, 'converted')
      await fetchLeads()
      setActionSuccess(`Converted ${sub.name} into Lead CRM entry!`)
      setTimeout(() => setActionSuccess(null), 3000)
    } catch (e: any) {
      alert('Error converting to lead: ' + e.message)
    }
  }

  // Delete submission
  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return
    setSubmissions(prev => prev.filter(s => s.id !== id))
    if (selectedSubmission?.id === id) setSelectedSubmission(null)

    try {
      const local = JSON.parse(localStorage.getItem('sw_contact_submissions') || '[]')
      localStorage.setItem('sw_contact_submissions', JSON.stringify(local.filter((item: any) => item.id !== id)))
    } catch (e) {}

    if (isSupabaseConfigured) {
      try {
        await supabase.from('contact_submissions').delete().eq('id', id)
      } catch (e) {}
    }
  }

  // Send admin live reply to chat visitor
  const handleAdminSendReply = async () => {
    if (!replyInput.trim() || !selectedSessionId) return
    setSendingReply(true)

    const adminName = (profile as any)?.full_name || user?.email?.split('@')[0] || 'Admin Engineer'
    const newMsg = await liveChatService.sendMessage(selectedSessionId, 'agent', replyInput.trim(), adminName)

    setSessionMessages(prev => [...prev, newMsg])
    setReplyInput('')
    setSendingReply(false)
  }

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.company && s.company.toLowerCase().includes(search.toLowerCase())) ||
      s.description.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 pb-6">

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#06080f] border border-white/[0.07] p-6 rounded-2xl">
        <div>
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <MessageSquare size={13} /> Realtime Communications Hub
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contact Submissions & Live Chat</h1>
          <p className="text-xs text-slate-400 mt-1">Review contact form inquiries and directly chat with website visitors in real-time.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center p-1.5 rounded-xl bg-white/[0.04] border border-white/[0.07] shrink-0">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'submissions'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail size={14} />
            <span>Form Submissions ({submissions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('livechat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === 'livechat'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot size={14} />
            <span>Live Chat Console ({chatSessions.length})</span>
            {chatSessions.some(s => s.status === 'waiting_admin') && (
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in-up">
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* ─── TAB 1: Contact Submissions Table ───────────────────────────────── */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#06080f] border border-white/[0.07] p-4 rounded-2xl">
            
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['all', 'new', 'reviewed', 'contacted', 'converted', 'archived'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or topic..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Table Listing */}
          {loading ? (
            <div className="py-20 text-center text-emerald-400 text-xs">Loading contact submissions...</div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center bg-[#06080f] border border-white/[0.07] rounded-2xl space-y-2">
              <Mail size={32} className="mx-auto text-slate-700" />
              <div className="text-sm font-semibold text-slate-300">No Contact Submissions Found</div>
              <div className="text-xs text-slate-600">Submissions from your website /contact page will appear here instantly.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Submissions List (Col: 7) */}
              <div className="lg:col-span-7 space-y-3">
                {filteredSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative space-y-3 ${
                      selectedSubmission?.id === sub.id
                        ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                        : 'bg-[#06080f] border-white/[0.07] hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-white">{sub.name}</div>
                        <div className="text-xs text-slate-400">{sub.email} {sub.company && `• ${sub.company}`}</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                        sub.status === 'new' ? 'bg-sky-500/15 border-sky-500/30 text-sky-400' :
                        sub.status === 'converted' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' :
                        sub.status === 'contacted' ? 'bg-violet-500/15 border-violet-500/30 text-violet-400' :
                        'bg-slate-700/30 border-slate-600/30 text-slate-400'
                      }`}>
                        {sub.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      "{sub.description}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(sub.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                      {sub.budget && (
                        <span className="font-semibold text-emerald-400">Budget: {sub.budget}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submission Detail Card (Col: 5) */}
              <div className="lg:col-span-5">
                {selectedSubmission ? (
                  <div className="bg-[#06080f] border border-white/[0.07] rounded-2xl p-6 space-y-6 sticky top-24">
                    <div className="flex items-start justify-between border-b border-white/[0.06] pb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Submission Details</span>
                        <h3 className="text-lg font-bold text-white mt-1">{selectedSubmission.name}</h3>
                      </div>
                      <button
                        onClick={() => deleteSubmission(selectedSubmission.id)}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Delete Submission"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Metadata items */}
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Email:</span>
                        <a href={`mailto:${selectedSubmission.email}`} className="text-emerald-400 hover:underline font-medium">{selectedSubmission.email}</a>
                      </div>
                      {selectedSubmission.phone && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Phone:</span>
                          <a href={`tel:${selectedSubmission.phone}`} className="text-slate-200 hover:underline font-mono">{selectedSubmission.phone}</a>
                        </div>
                      )}
                      {selectedSubmission.company && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Company:</span>
                          <span className="text-slate-200 font-medium">{selectedSubmission.company}</span>
                        </div>
                      )}
                      {selectedSubmission.budget && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Budget Scope:</span>
                          <span className="text-emerald-400 font-bold">{selectedSubmission.budget}</span>
                        </div>
                      )}
                      {selectedSubmission.timeline && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Timeline:</span>
                          <span className="text-slate-300 font-medium">{selectedSubmission.timeline}</span>
                        </div>
                      )}
                    </div>

                    {/* Message Body */}
                    <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Inquiry Message</span>
                      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-200 leading-relaxed font-sans">
                        {selectedSubmission.description}
                      </div>
                    </div>

                    {/* Status Changer Buttons */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Change Status</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updateStatus(selectedSubmission.id, 'reviewed')}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 cursor-pointer"
                        >
                          Mark Reviewed
                        </button>
                        <button
                          onClick={() => updateStatus(selectedSubmission.id, 'contacted')}
                          className="px-3 py-2 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-xs font-semibold text-violet-400 cursor-pointer"
                        >
                          Mark Contacted
                        </button>
                      </div>
                      <button
                        onClick={() => convertToCRMLead(selectedSubmission)}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-[1.01] transition-transform"
                      >
                        <Plus size={14} />
                        <span>Convert to Lead CRM Record</span>
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="p-12 text-center bg-[#06080f] border border-white/[0.07] rounded-2xl text-slate-500 text-xs space-y-2">
                    <Eye size={24} className="mx-auto text-slate-700" />
                    <div>Select any submission from the left list to view full details and convert to CRM lead.</div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: Live Realtime Chat Console ────────────────────────────── */}
      {activeTab === 'livechat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Chat Sessions List (Col: 4) */}
          <div className="lg:col-span-4 bg-[#06080f] border border-white/[0.07] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot size={16} className="text-emerald-400" />
                <span>Active Chat Sessions</span>
              </h3>
              <button onClick={loadChatSessions} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white">
                <RefreshCw size={13} />
              </button>
            </div>

            {chatSessions.length === 0 ? (
              <div className="py-12 text-center text-slate-600 text-xs space-y-2">
                <User size={24} className="mx-auto text-slate-700" />
                <div>No active chat sessions currently. When visitors open the chatbot on your site, they appear here live.</div>
              </div>
            ) : (
              <div className="space-y-2">
                {chatSessions.map((session) => (
                  <button
                    key={session.session_id}
                    onClick={() => setSelectedSessionId(session.session_id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      selectedSessionId === session.session_id
                        ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{session.user_name}</span>
                        {session.status === 'waiting_admin' && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[9px] font-bold">Needs Agent</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{session.last_message || 'In conversation...'}</div>
                    </div>
                    <span className="text-[10px] text-slate-600 shrink-0 font-mono">
                      {new Date(session.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Realtime Conversation Thread (Col: 8) */}
          <div className="lg:col-span-8 bg-[#06080f] border border-white/[0.07] rounded-2xl flex flex-col h-[560px] overflow-hidden">
            {selectedSessionId ? (
              <>
                {/* Chat Session Header */}
                <div className="p-4 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                      S
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Live Session: {selectedSessionId.substring(0, 14)}</span>
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div className="text-[11px] text-slate-400">Direct Live Chat Channel with Website Visitor</div>
                    </div>
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-[#040509]">
                  {sessionMessages.length === 0 ? (
                    <div className="py-20 text-center text-slate-600 text-xs">
                      Waiting for messages in this session...
                    </div>
                  ) : (
                    sessionMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col space-y-1 ${msg.sender === 'agent' ? 'items-end' : 'items-start'}`}
                      >
                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                          <span className={`font-bold ${msg.sender === 'agent' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                            {msg.sender_name || (msg.sender === 'agent' ? 'You (Admin)' : 'Visitor')}
                          </span>
                          <span>• {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div
                          className={`p-3.5 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                            msg.sender === 'agent'
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold rounded-br-none shadow-md'
                              : 'bg-white/[0.05] border border-white/10 text-slate-200 rounded-bl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Admin Live Reply Input Box */}
                <div className="p-4 border-t border-white/[0.06] bg-[#06080f] flex items-center gap-3">
                  <input
                    type="text"
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminSendReply()}
                    placeholder="Type live response to visitor on website..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleAdminSendReply}
                    disabled={sendingReply || !replyInput.trim()}
                    className="px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 hover:scale-105 transition-all"
                  >
                    <Send size={14} />
                    <span>Reply Live</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 text-xs space-y-2">
                <Bot size={32} className="text-slate-700" />
                <div>Select a session from the list on the left to join live chat.</div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  )
}

export default ContactSubmissions
