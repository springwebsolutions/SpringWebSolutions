import React, { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { 
  Ticket, CheckCircle2, XCircle, Search, MessageSquare, 
  Loader2, AlertCircle, RefreshCw, UserCheck, ShieldAlert 
} from 'lucide-react'

export const SupportManager: React.FC = () => {
  const { user } = useAuthStore()
  const [tickets, setTickets] = useState<any[]>([])
  const [staffList, setStaffList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  
  // Selected ticket chat states
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

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

      // Update selected ticket details if active
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

  const fetchStaff = async () => {
    if (!isSupabaseConfigured) return
    try {
      // Fetch users belonging to staff roles
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
  }, [])

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

      // Update ticket status to in_progress if open
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

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    if (!isSupabaseConfigured) return
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', ticketId)

      if (error) throw error
      await fetchTickets()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleAssignTo = async (ticketId: string, staffId: string) => {
    if (!isSupabaseConfigured) return
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          assigned_to: staffId || null, 
          status: 'in_progress', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', ticketId)

      if (error) throw error
      await fetchTickets()
    } catch (err: any) {
      alert(err.message)
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-rose-500/15 text-rose-400 border-rose-500/20'
      case 'high': return 'bg-amber-500/15 text-amber-400 border-amber-500/20'
      case 'medium': return 'bg-blue-500/15 text-blue-400 border-blue-500/20'
      default: return 'bg-slate-500/15 text-slate-400 border-slate-500/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
      case 'in_progress': return 'bg-brand-indigo/15 text-brand-indigo border-brand-indigo/20'
      case 'resolved': return 'bg-teal-500/15 text-teal-400 border-teal-500/20'
      default: return 'bg-slate-700/15 text-slate-500 border-slate-700/20'
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Toolbar */}
      <div className="admin-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-white/[0.06] flex items-center justify-center">
              <Ticket size={18} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Support Desk</h1>
              <p className="text-[12px] text-slate-500 mt-0.5">Manage tickets, assign staff, and reply to clients.</p>
            </div>
          </div>
          <button 
            onClick={fetchTickets}
            className="btn-admin-secondary"
            title="Refresh Inbox"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Live Search */}
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input pl-8"
              placeholder="Search by subject, client or company…"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select sm:w-40"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#141b2b] border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-emerald-500" size={28} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Left Panel - Tickets list */}
          <div className={`${selectedTicket ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4 transition-all duration-300`}>
            {filteredTickets.length === 0 ? (
              <div className="text-center py-20 admin-card max-w-md mx-auto space-y-3">
                <Ticket size={36} className="mx-auto text-slate-700" />
                <div className="text-sm font-bold text-slate-400">No Tickets Found</div>
                <p className="text-xs text-slate-600">No tickets match your current filters.</p>
              </div>
            ) : (
              <div className="admin-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Subject</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Assignee</th>
                        <th className="text-right">Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.map((t) => {
                        const isSelected = selectedTicket?.id === t.id
                        return (
                          <tr
                            key={t.id}
                            onClick={() => handleSelectTicket(t)}
                            className={`cursor-pointer ${isSelected ? 'bg-emerald-500/5' : ''}`}
                          >
                            <td>
                              <div className="font-semibold text-slate-200">{t.profiles?.full_name || 'Anonymous'}</div>
                              <div className="text-[10px] text-slate-600 truncate max-w-[120px]">{t.profiles?.company || 'No Company'}</div>
                            </td>
                            <td>
                              <div className="font-semibold text-slate-200 max-w-[180px] truncate">{t.subject}</div>
                              <div className="text-[10px] text-slate-600">{t.products?.name || 'General'}</div>
                            </td>
                            <td>
                              <span className={`badge ${getPriorityColor(t.priority)}`}>{t.priority}</span>
                            </td>
                            <td>
                              <span className={`badge ${getStatusColor(t.status)}`}>{t.status}</span>
                            </td>
                            <td className="text-slate-500 font-medium">
                              {t.assignee?.full_name || <span className="text-slate-700">Unassigned</span>}
                            </td>
                            <td className="text-right text-slate-600">
                              {new Date(t.updated_at).toLocaleDateString()}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Ticket Chat Drawer */}
          {selectedTicket && (
            <div className="lg:col-span-6 admin-card overflow-hidden flex flex-col" style={{ height: '560px' }}>
              
              {/* Drawer Header */}
              <div className="p-4 border-b border-white/[0.06] flex items-center justify-between gap-4 bg-white/[0.02]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-emerald-400">#{selectedTicket.id.slice(0, 8)}</span>
                    <span className={`badge ${getStatusColor(selectedTicket.status)}`}>{selectedTicket.status}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1 truncate max-w-[240px]">{selectedTicket.subject}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {selectedTicket.profiles?.full_name} · {selectedTicket.profiles?.company || 'No Company'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                >
                  <XCircle size={16} />
                </button>
              </div>

              {/* Controls */}
              <div className="p-3 border-b border-white/[0.06] grid grid-cols-2 gap-2.5 bg-white/[0.01]">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-600">Status</label>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                    className="admin-select text-xs py-1.5"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-600">Assignee</label>
                  <select
                    value={selectedTicket.assigned_to || ''}
                    onChange={(e) => handleAssignTo(selectedTicket.id, e.target.value)}
                    className="admin-select text-xs py-1.5"
                  >
                    <option value="">Unassigned</option>
                    {staffList.map((st) => (
                      <option key={st.id} value={st.id}>{st.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#030507]">
                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="animate-spin text-emerald-500" size={20} />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-slate-700 py-10">
                    <MessageSquare size={24} className="mx-auto mb-2 opacity-30" />
                    No messages yet
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isStaff = msg.sender_id === user?.id || msg.sender_id !== selectedTicket.user_id
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[85%] ${isStaff ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 mb-1">
                          <span className="font-semibold">
                            {isStaff ? 'Staff' : (selectedTicket.profiles?.full_name || 'Client')}
                          </span>
                          <span>·</span>
                          <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className={`p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                          isStaff 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-white/[0.05] border border-white/[0.07] text-slate-200 rounded-tl-none'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Reply Box */}
              <div className="p-3 border-t border-white/[0.06] bg-white/[0.02]">
                <form onSubmit={handleSendReply} className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="admin-input flex-1"
                    placeholder="Write a reply…"
                    disabled={sending || selectedTicket.status === 'closed'}
                  />
                  <button
                    type="submit"
                    disabled={sending || !replyText.trim() || selectedTicket.status === 'closed'}
                    className="btn-admin-primary shrink-0"
                  >
                    {sending ? <Loader2 className="animate-spin" size={13} /> : <MessageSquare size={13} />}
                    Send
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  )
}
export default SupportManager
