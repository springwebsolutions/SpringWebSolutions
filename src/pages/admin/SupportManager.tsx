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
      
      {/* Search and Filters Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white tracking-tight">Support Inbox</h3>
            <p className="text-xs text-slate-500 mt-1">Review ticket submissions, allocate assignees, and respond to clients.</p>
          </div>
          <button 
            onClick={fetchTickets}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-450 hover:text-white transition-all cursor-pointer"
            title="Refresh Inbox"
          >
            <RefreshCw size={15} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Live Search */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
              placeholder="Search by subject, client or company..."
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#141b2b] border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
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
        <div className="h-64 flex items-center justify-center text-brand-emerald">
          <Loader2 className="animate-spin" size={36} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel - Tickets list */}
          <div className={`${selectedTicket ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4 transition-all duration-300`}>
            {filteredTickets.length === 0 ? (
              <div className="text-center py-20 glass-panel rounded-3xl max-w-md mx-auto space-y-4">
                <Ticket size={48} className="mx-auto text-slate-700" />
                <h4 className="text-sm font-bold text-white">No Tickets Found</h4>
                <p className="text-xs text-slate-500">There are no client tickets that match the selected search criteria.</p>
              </div>
            ) : (
              <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/2 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Subject</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Assignee</th>
                        <th className="px-4 py-3 text-right">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-350">
                      {filteredTickets.map((t) => {
                        const isSelected = selectedTicket?.id === t.id
                        return (
                          <tr
                            key={t.id}
                            onClick={() => handleSelectTicket(t)}
                            className={`hover:bg-white/1 cursor-pointer transition-colors ${
                              isSelected ? 'bg-brand-emerald/5 border-l-2 border-brand-emerald' : ''
                            }`}
                          >
                            <td className="px-4 py-3.5">
                              <div className="font-semibold text-white">{t.profiles?.full_name || 'Anonymous'}</div>
                              <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{t.profiles?.company || 'No Company'}</div>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="font-semibold text-white max-w-[180px] truncate">{t.subject}</div>
                              <div className="text-[10px] text-slate-500">{t.products?.name || 'General Solutions'}</div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${getPriorityColor(t.priority)}`}>
                                {t.priority}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${getStatusColor(t.status)}`}>
                                {t.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-medium text-slate-400">
                              {t.assignee?.full_name || 'Unassigned'}
                            </td>
                            <td className="px-4 py-3.5 text-right text-slate-500">
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

          {/* Right Panel - Ticket Messenger Thread Drawer */}
          {selectedTicket && (
            <div className="lg:col-span-6 glass-panel rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[550px]">
              
              {/* Drawer Header details */}
              <div className="p-4 bg-white/2 border-b border-white/5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-emerald">#{selectedTicket.id.slice(0, 8)}</span>
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px]">{selectedTicket.subject}</h4>
                  </div>
                  <p className="text-[10px] text-slate-550 mt-0.5">
                    Client: <span className="text-slate-400 font-semibold">{selectedTicket.profiles?.full_name}</span> ({selectedTicket.profiles?.company || 'No Company'})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-slate-500 hover:text-white text-xs font-semibold"
                >
                  Close Panel
                </button>
              </div>

              {/* Operations Control Row */}
              <div className="p-3 bg-white/1 border-b border-white/5 grid grid-cols-2 gap-3">
                
                {/* Status selection */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500">Update Status</label>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                    className="w-full px-2 py-1 rounded bg-[#101524] border border-white/10 text-xs text-white focus:outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* Staff Allocator */}
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-500">Allocate Staff</label>
                  <select
                    value={selectedTicket.assigned_to || ''}
                    onChange={(e) => handleAssignTo(selectedTicket.id, e.target.value)}
                    className="w-full px-2 py-1 rounded bg-[#101524] border border-white/10 text-xs text-white focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {staffList.map((st) => (
                      <option key={st.id} value={st.id}>{st.full_name}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Chat timeline thread */}
              <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-[#05080e]/40">
                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center text-brand-emerald">
                    <Loader2 className="animate-spin" size={24} />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-slate-600 py-10">No messages in thread.</div>
                ) : (
                  messages.map((msg) => {
                    const isStaff = msg.sender_id === user?.id || msg.sender_id !== selectedTicket.user_id
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[85%] ${isStaff ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-500 mb-0.5">
                          <span className="font-semibold text-slate-400">
                            {isStaff ? 'You (Staff)' : (selectedTicket.profiles?.full_name || 'Client')}
                          </span>
                          <span>•</span>
                          <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className={`p-3 rounded-xl text-xs whitespace-pre-wrap ${
                          isStaff 
                            ? 'bg-brand-indigo text-white rounded-tr-none' 
                            : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Reply form textbox */}
              <div className="p-3 bg-white/2 border-t border-white/5">
                <form onSubmit={handleSendReply} className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-grow px-3 py-2 rounded bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                    placeholder="Type client reply message..."
                    disabled={sending || selectedTicket.status === 'closed'}
                  />
                  <button
                    type="submit"
                    disabled={sending || !replyText.trim() || selectedTicket.status === 'closed'}
                    className="btn-primary py-2 px-4 font-semibold text-xs flex items-center gap-1 shrink-0"
                  >
                    {sending ? <Loader2 className="animate-spin" size={13} /> : <MessageSquare size={13} />}
                    <span>Reply</span>
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
