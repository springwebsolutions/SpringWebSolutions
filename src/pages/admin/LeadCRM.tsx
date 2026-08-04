import React, { useEffect, useState } from 'react'
import { useCRMStore, type Lead } from '@/stores/crmStore'
import { supabase } from '@/lib/supabase'
import { sendResendEmail } from '@/lib/emailService'
import { LeadGenSystem } from '@/pages/admin/LeadGenSystem'
import { LeadAnalytics } from '@/pages/admin/LeadAnalytics'
import { 
  Inbox, Phone, Mail, Building, Plus, Send, Loader2, MapPin,
  Search, BarChart2, Target, ChevronRight
} from 'lucide-react'

export interface SentEmailLog {
  id: string
  to: string
  from: string
  subject: string
  body: string
  document_name?: string
  document_url?: string
  sent_at: string
  status: 'sent' | 'failed'
}

export const LeadCRM: React.FC = () => {
  const { 
    leads, 
    fetchLeads, 
    selectedLead, 
    selectLead, 
    notes, 
    tasks, 
    updateLeadStatus, 
    addLeadNote, 
    addLeadTask, 
    toggleTaskCompleted 
  } = useCRMStore()

  // Initial view mode based on URL or query
  const isScraperRoute = typeof window !== 'undefined' && window.location.pathname.includes('lead-gen')
  const isAnalyticsRoute = typeof window !== 'undefined' && window.location.pathname.includes('analytics')

  // Unified Control View Switcher: 'kanban' | 'scraper' | 'analytics' | 'sent_outbox'
  const [viewMode, setViewMode] = useState<'kanban' | 'scraper' | 'analytics' | 'sent_outbox'>(
    isScraperRoute ? 'scraper' : isAnalyticsRoute ? 'analytics' : 'kanban'
  )

  // Search & Filter Query inside Deals Kanban
  const [kanbanSearch, setKanbanSearch] = useState('')

  // Sent Emails Log History
  const [sentLogs, setSentLogs] = useState<SentEmailLog[]>(() => {
    try {
      const saved = localStorage.getItem('sws_sent_emails_log')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Inspector Drawer Active Tab
  const [activeDrawerTab, setActiveDrawerTab] = useState<'notes' | 'tasks' | 'email'>('notes')

  // Note & Task Form States
  const [noteContent, setNoteContent] = useState('')
  const [noteSubmitting, setNoteSubmitting] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskSubmitting, setTaskSubmitting] = useState(false)

  // Direct Email Sender Form State
  const [emailFrom, setEmailFrom] = useState('hello@springwebsolutions.in')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; dataUrl: string } | null>(null)
  const [emailSending, setEmailSending] = useState(false)
  const [emailStatus, setEmailStatus] = useState<{ success: boolean; msg: string } | null>(null)

  // Add Lead Modal State
  const [showAddLeadModal, setShowAddLeadModal] = useState(false)
  const [newLeadName, setNewLeadName] = useState('')
  const [newLeadEmail, setNewLeadEmail] = useState('')
  const [newLeadPhone, setNewLeadPhone] = useState('')
  const [newLeadCompany, setNewLeadCompany] = useState('')
  const [newLeadType, setNewLeadType] = useState<Lead['type']>('contact')
  const [newLeadStatus, setNewLeadStatus] = useState<Lead['status']>('new')
  const [newLeadBudget, setNewLeadBudget] = useState('')
  const [newLeadDesc, setNewLeadDesc] = useState('')
  const [createLoading, setCreateLoading] = useState(false)

  // Quick Standalone Resend Email Modal State
  const [showQuickEmailModal, setShowQuickEmailModal] = useState(false)
  const [quickTo, setQuickTo] = useState('')
  const [quickSubject, setQuickSubject] = useState('')
  const [quickBody, setQuickBody] = useState('')
  const [quickSending, setQuickSending] = useState(false)
  const [quickStatus, setQuickStatus] = useState<{ success: boolean; msg: string } | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    if (selectedLead) {
      setEmailSubject(`Project Consultation & Next Steps — Spring Web Solutions`)
      setEmailBody(`Hi ${selectedLead.name},\n\nThank you for connecting with Spring Web Solutions regarding your software requirements.\n\nWe have reviewed your inquiry and would like to schedule a 15-minute technical discovery call to align on scope, architecture, and timeline.\n\nBest regards,\nSpring Web Solutions Team\nhttps://springwebsolutions.in`)
      setEmailStatus(null)
    }
  }, [selectedLead])

  // Save email log to localStorage
  const saveSentLog = (log: SentEmailLog) => {
    setSentLogs(prev => {
      const updated = [log, ...prev]
      try {
        localStorage.setItem('sws_sent_emails_log', JSON.stringify(updated))
      } catch (err) {
        console.error(err)
      }
      return updated
    })
  }

  // Send Resend Email to selected lead
  const handleSendResendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead || !emailSubject.trim() || !emailBody.trim()) return
    setEmailSending(true)
    setEmailStatus(null)

    try {
      const activeSender = emailFrom.trim() || 'hello@springwebsolutions.in'
      const formattedHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #070a13; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 24px; text-align: center;">
            <h2 style="color: #10b981; margin: 0; font-size: 22px;">Spring Web Solutions</h2>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Executive Client Communications</p>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">${emailBody}</div>
          <div style="margin-top: 24px; text-align: center; font-size: 12px; color: #64748b;">
            <p>Spring Web Solutions • Udumalpet, Tamil Nadu</p>
          </div>
        </div>
      `

      let attachmentsPayload: any = undefined
      if (attachedFile) {
        attachmentsPayload = [{ filename: attachedFile.name, content: attachedFile.dataUrl }]
      }

      const result = await sendResendEmail({
        from: `Spring Web Solutions <${activeSender}>`,
        to: selectedLead.email,
        subject: emailSubject.trim(),
        html: formattedHtml,
        attachments: attachmentsPayload
      })

      if (result.success) {
        setEmailStatus({ success: true, msg: `Email sent to ${selectedLead.email} via Resend!` })
        saveSentLog({
          id: 'log-' + Date.now(),
          to: selectedLead.email,
          from: activeSender,
          subject: emailSubject.trim(),
          body: emailBody.trim(),
          document_name: attachedFile ? attachedFile.name : undefined,
          sent_at: new Date().toISOString(),
          status: 'sent'
        })
        await addLeadNote(selectedLead.id, `📨 Email Dispatched: "${emailSubject.trim()}"`)
        if (selectedLead.status === 'new') {
          await updateLeadStatus(selectedLead.id, 'contacted')
        }
      } else {
        setEmailStatus({ success: false, msg: result.error || 'Failed to dispatch email.' })
      }
    } catch (err: any) {
      setEmailStatus({ success: false, msg: err.message || 'Email dispatch error.' })
    } finally {
      setEmailSending(false)
    }
  }

  // Create manual lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLeadName.trim() || !newLeadEmail.trim()) return
    setCreateLoading(true)
    try {
      const { error } = await supabase.from('leads').insert({
        name: newLeadName,
        email: newLeadEmail,
        phone: newLeadPhone || null,
        company: newLeadCompany || null,
        type: newLeadType,
        status: newLeadStatus,
        budget: newLeadBudget || null,
        description: newLeadDesc || null
      }).select().single()

      if (error) throw error
      setShowAddLeadModal(false)
      setNewLeadName('')
      setNewLeadEmail('')
      setNewLeadPhone('')
      setNewLeadCompany('')
      await fetchLeads()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setCreateLoading(false)
    }
  }

  // Pipeline Kanban Stage Columns
  const columns: Array<{ id: Lead['status']; label: string; color: string }> = [
    { id: 'new', label: 'New Inbox', color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' },
    { id: 'contacted', label: 'Contacted', color: 'border-blue-500/30 bg-blue-500/5 text-blue-400' },
    { id: 'qualified', label: 'Qualified', color: 'border-indigo-500/30 bg-indigo-500/5 text-indigo-400' },
    { id: 'proposal_sent', label: 'Proposal Sent', color: 'border-purple-500/30 bg-purple-500/5 text-purple-400' },
    { id: 'negotiation', label: 'Negotiation', color: 'border-amber-500/30 bg-amber-500/5 text-amber-400' },
    { id: 'won', label: 'Won', color: 'border-teal-500/30 bg-teal-500/5 text-teal-400 font-bold' },
    { id: 'lost', label: 'Lost', color: 'border-rose-500/30 bg-rose-500/5 text-rose-400' }
  ]

  // Filtered Leads in Kanban
  const filteredLeads = leads.filter(l => {
    if (!kanbanSearch.trim()) return true
    const q = kanbanSearch.toLowerCase()
    return l.name.toLowerCase().includes(q) || 
           l.email.toLowerCase().includes(q) || 
           (l.company && l.company.toLowerCase().includes(q))
  })

  return (
    <div className="space-y-6">
      
      {/* ── Top Master Control Header Banner ── */}
      <div className="admin-card p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <Target size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight">Lead Engine &amp; CRM Command Center</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  v2.1 Unified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Manage deals pipeline, Google Maps business scraper, lead conversion velocity, and email outbox.</p>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="flex items-center gap-4 text-xs">
            <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Total Leads</div>
              <div className="text-sm font-bold font-mono">{leads.length}</div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Won Deals</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">{leads.filter(l => l.status === 'won').length}</div>
            </div>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                viewMode === 'kanban'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <Inbox size={14} />
              <span>Deals Pipeline ({leads.length})</span>
            </button>

            <button
              onClick={() => setViewMode('scraper')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                viewMode === 'scraper'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <MapPin size={14} />
              <span>Google Maps Scraper</span>
            </button>

            <button
              onClick={() => setViewMode('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                viewMode === 'analytics'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <BarChart2 size={14} />
              <span>Pipeline Analytics</span>
            </button>

            <button
              onClick={() => setViewMode('sent_outbox')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                viewMode === 'sent_outbox'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              <Send size={14} />
              <span>Sent Outbox Log ({sentLogs.length})</span>
            </button>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQuickEmailModal(true)}
              className="btn-admin-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <Send size={13} className="text-emerald-400" />
              <span>Compose Email</span>
            </button>

            <button
              onClick={() => setShowAddLeadModal(true)}
              className="btn-admin-primary text-xs py-2 px-3.5 flex items-center gap-1.5 font-bold cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Plus size={14} />
              <span>Add Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── VIEW 1: DEALS KANBAN PIPELINE ── */}
      {viewMode === 'kanban' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Search Bar inside Kanban */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                value={kanbanSearch}
                onChange={e => setKanbanSearch(e.target.value)}
                placeholder="Filter deals by lead name, email, or company..."
                className="admin-input pl-10 pr-4 py-2 text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            {selectedLead && (
              <button
                onClick={() => selectLead(null as any)}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Close Inspector Drawer ✕
              </button>
            )}
          </div>

          {/* Kanban Columns & Side Inspector Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Kanban Columns */}
            <div className={`${selectedLead ? 'lg:col-span-8' : 'lg:col-span-12'} transition-all duration-300`}>
              <div className="flex space-x-4 overflow-x-auto pb-6 select-none min-h-[480px]">
                {columns.map(col => {
                  const colLeads = filteredLeads.filter(l => l.status === col.id)
                  return (
                    <div key={col.id} className="w-72 shrink-0 flex flex-col space-y-3">
                      
                      {/* Column Header */}
                      <div className={`p-3 rounded-xl border flex items-center justify-between ${col.color}`}>
                        <span className="text-xs font-bold uppercase tracking-wider">{col.label}</span>
                        <span className="px-2 py-0.5 rounded bg-black/20 text-[10px] font-bold font-mono">{colLeads.length}</span>
                      </div>

                      {/* Column Cards Container */}
                      <div className="flex-1 bg-white/[0.01] rounded-2xl p-3 border border-white/[0.05] space-y-3 min-h-[380px] overflow-y-auto">
                        {colLeads.map(lead => (
                          <div
                            key={lead.id}
                            onClick={() => selectLead(lead)}
                            className={`p-4 rounded-xl border bg-[#070a13] light:bg-white hover:border-emerald-500/40 hover:shadow-lg transition-all cursor-pointer space-y-3 ${
                              selectedLead?.id === lead.id ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-white/[0.06] light:border-slate-200'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-sm line-clamp-1">{lead.name}</div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                                <Building size={10} />
                                <span className="truncate">{lead.company || 'Private Inquiry'}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[10px]">
                              <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] light:border-slate-200 capitalize">
                                {lead.type.replace('_', ' ')}
                              </span>
                              {lead.budget && (
                                <span className="font-bold text-emerald-400 font-mono">{lead.budget}</span>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/[0.05] light:border-slate-200 pt-2">
                              <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                              <span className="text-emerald-400/80 hover:text-emerald-300 font-bold flex items-center gap-0.5">
                                View Details <ChevronRight size={10} />
                              </span>
                            </div>
                          </div>
                        ))}
                        {colLeads.length === 0 && (
                          <div className="h-32 flex items-center justify-center text-slate-600 text-xs font-mono">
                            No deals in stage
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Selected Lead Inspector Side Drawer */}
            {selectedLead && (
              <div className="lg:col-span-4 admin-card p-6 space-y-5 sticky top-6 animate-in slide-in-from-right duration-300">
                <div className="flex items-start justify-between border-b border-white/[0.06] pb-4">
                  <div>
                    <h3 className="font-bold text-base">{selectedLead.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedLead.company || 'Direct Prospect'}</p>
                  </div>
                  <button onClick={() => selectLead(null as any)} className="text-slate-500 hover:text-white font-bold text-sm">✕</button>
                </div>

                {/* Status Switcher */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Stage Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={e => updateLeadStatus(selectedLead.id, e.target.value as any)}
                    className="admin-input text-xs font-bold capitalize text-emerald-400"
                  >
                    {columns.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-xs bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
                  <div className="flex items-center gap-2 truncate">
                    <Mail size={12} className="text-slate-500 shrink-0" />
                    <span className="font-mono text-emerald-400 truncate">{selectedLead.email}</span>
                  </div>
                  {selectedLead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-slate-500 shrink-0" />
                      <span className="font-mono">{selectedLead.phone}</span>
                    </div>
                  )}
                </div>

                {/* Sub-tabs header inside Inspector Drawer */}
                <div className="flex border-b border-white/[0.06] text-xs">
                  <button
                    onClick={() => setActiveDrawerTab('notes')}
                    className={`pb-2 px-3 font-bold border-b-2 cursor-pointer ${
                      activeDrawerTab === 'notes' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500'
                    }`}
                  >
                    Notes ({notes.length})
                  </button>
                  <button
                    onClick={() => setActiveDrawerTab('tasks')}
                    className={`pb-2 px-3 font-bold border-b-2 cursor-pointer ${
                      activeDrawerTab === 'tasks' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500'
                    }`}
                  >
                    Tasks ({tasks.length})
                  </button>
                  <button
                    onClick={() => setActiveDrawerTab('email')}
                    className={`pb-2 px-3 font-bold border-b-2 cursor-pointer ${
                      activeDrawerTab === 'email' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500'
                    }`}
                  >
                    Email
                  </button>
                </div>

                {/* Drawer Tab 1: Notes */}
                {activeDrawerTab === 'notes' && (
                  <div className="space-y-3">
                    <form onSubmit={async (e) => {
                      e.preventDefault()
                      if (!noteContent.trim()) return
                      setNoteSubmitting(true)
                      await addLeadNote(selectedLead.id, noteContent)
                      setNoteContent('')
                      setNoteSubmitting(false)
                    }} className="flex gap-2">
                      <input
                        type="text"
                        value={noteContent}
                        onChange={e => setNoteContent(e.target.value)}
                        placeholder="Add quick CRM note..."
                        className="admin-input text-xs"
                      />
                      <button type="submit" disabled={noteSubmitting} className="btn-admin-primary px-3 text-xs font-bold">
                        {noteSubmitting ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
                      </button>
                    </form>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {notes.map(n => (
                        <div key={n.id} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-xs space-y-1">
                          <p>{n.content}</p>
                          <div className="text-[10px] text-slate-500 font-mono">{new Date(n.created_at).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drawer Tab 2: Tasks */}
                {activeDrawerTab === 'tasks' && (
                  <div className="space-y-3">
                    <form onSubmit={async (e) => {
                      e.preventDefault()
                      if (!taskTitle.trim()) return
                      setTaskSubmitting(true)
                      await addLeadTask(selectedLead.id, { title: taskTitle })
                      setTaskTitle('')
                      setTaskSubmitting(false)
                    }} className="flex gap-2">
                      <input
                        type="text"
                        value={taskTitle}
                        onChange={e => setTaskTitle(e.target.value)}
                        placeholder="New follow-up task..."
                        className="admin-input text-xs"
                      />
                      <button type="submit" disabled={taskSubmitting} className="btn-admin-primary px-3 text-xs font-bold">
                        Add
                      </button>
                    </form>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {tasks.map(t => (
                        <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-xs">
                          <input
                            type="checkbox"
                            checked={t.is_completed}
                            onChange={() => toggleTaskCompleted(t.id, !t.is_completed)}
                            className="rounded border-slate-700 text-emerald-500"
                          />
                          <span className={t.is_completed ? 'line-through text-slate-500' : ''}>{t.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drawer Tab 3: Resend Email */}
                {activeDrawerTab === 'email' && (
                  <form onSubmit={handleSendResendEmail} className="space-y-3">
                    <input
                      type="text"
                      required
                      value={emailSubject}
                      onChange={e => setEmailSubject(e.target.value)}
                      placeholder="Subject line..."
                      className="admin-input text-xs"
                    />
                    <textarea
                      rows={4}
                      required
                      value={emailBody}
                      onChange={e => setEmailBody(e.target.value)}
                      placeholder="Email body text..."
                      className="admin-input text-xs leading-relaxed"
                    />
                    {emailStatus && (
                      <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                        emailStatus.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        <span>{emailStatus.msg}</span>
                      </div>
                    )}
                    <button type="submit" disabled={emailSending} className="w-full btn-admin-primary py-2 text-xs font-bold justify-center">
                      {emailSending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                      <span>Send Email via Resend</span>
                    </button>
                  </form>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* ── VIEW 2: GOOGLE MAPS LEAD SCRAPER ENGINE & SYSTEM ── */}
      {viewMode === 'scraper' && (
        <div className="animate-in fade-in duration-300">
          <LeadGenSystem />
        </div>
      )}

      {/* ── VIEW 3: PIPELINE ANALYTICS ── */}
      {viewMode === 'analytics' && (
        <div className="animate-in fade-in duration-300">
          <LeadAnalytics />
        </div>
      )}

      {/* ── VIEW 4: SENT OUTBOX HISTORY ── */}
      {viewMode === 'sent_outbox' && (
        <div className="admin-card p-6 space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <h3 className="font-bold text-base">Sent Email Audit Trail ({sentLogs.length})</h3>
              <p className="text-xs text-slate-400 mt-0.5">Log of all client communications dispatched via Resend email API.</p>
            </div>
            <button onClick={() => setShowQuickEmailModal(true)} className="btn-admin-primary text-xs py-2 px-3.5 font-bold cursor-pointer">
              Compose Email
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Subject</th>
                  <th>Attachment</th>
                  <th>Sent Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sentLogs.map(log => (
                  <tr key={log.id}>
                    <td className="font-mono text-emerald-400 text-xs">{log.to}</td>
                    <td className="font-semibold text-xs max-w-xs truncate">{log.subject}</td>
                    <td className="text-slate-400 text-xs">{log.document_name || '—'}</td>
                    <td className="text-slate-500 text-xs font-mono">{new Date(log.sent_at).toLocaleString()}</td>
                    <td>
                      <span className="badge badge-green">Sent</span>
                    </td>
                  </tr>
                ))}
                {sentLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-600">No sent email logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="admin-card p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="font-bold text-base">Add New Lead to CRM</h3>
              <button onClick={() => setShowAddLeadModal(false)} className="text-slate-500 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3">
              <input
                type="text"
                required
                value={newLeadName}
                onChange={e => setNewLeadName(e.target.value)}
                placeholder="Full Name *"
                className="admin-input text-xs"
              />
              <input
                type="email"
                required
                value={newLeadEmail}
                onChange={e => setNewLeadEmail(e.target.value)}
                placeholder="Email Address *"
                className="admin-input text-xs"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newLeadPhone}
                  onChange={e => setNewLeadPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="admin-input text-xs"
                />
                <input
                  type="text"
                  value={newLeadCompany}
                  onChange={e => setNewLeadCompany(e.target.value)}
                  placeholder="Company Name"
                  className="admin-input text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newLeadBudget}
                  onChange={e => setNewLeadBudget(e.target.value)}
                  placeholder="Budget Range (e.g. ₹2,00,000)"
                  className="admin-input text-xs"
                />
                <select
                  value={newLeadStatus}
                  onChange={e => setNewLeadStatus(e.target.value as any)}
                  className="admin-input text-xs capitalize"
                >
                  {columns.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <textarea
                rows={3}
                value={newLeadDesc}
                onChange={e => setNewLeadDesc(e.target.value)}
                placeholder="Requirement description..."
                className="admin-input text-xs"
              />

              <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] pt-3">
                <button type="button" onClick={() => setShowAddLeadModal(false)} className="btn-admin-secondary text-xs py-2 px-3">
                  Cancel
                </button>
                <button type="submit" disabled={createLoading} className="btn-admin-primary text-xs py-2 px-4 font-bold">
                  {createLoading ? <Loader2 size={12} className="animate-spin" /> : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Standalone Resend Email Modal */}
      {showQuickEmailModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="admin-card p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="font-bold text-base">Compose Resend Email</h3>
              <button onClick={() => setShowQuickEmailModal(false)} className="text-slate-500 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault()
              if (!quickTo.trim() || !quickSubject.trim() || !quickBody.trim()) return
              setQuickSending(true)
              setQuickStatus(null)

              try {
                const res = await sendResendEmail({
                  from: `Spring Web Solutions <hello@springwebsolutions.in>`,
                  to: quickTo.trim(),
                  subject: quickSubject.trim(),
                  html: `<div style="font-family: Arial, sans-serif; background-color: #070a13; color: #f8fafc; padding: 24px; border-radius: 12px;">${quickBody}</div>`
                })

                if (res.success) {
                  setQuickStatus({ success: true, msg: `Email sent to ${quickTo}!` })
                  saveSentLog({
                    id: 'log-' + Date.now(),
                    to: quickTo.trim(),
                    from: 'hello@springwebsolutions.in',
                    subject: quickSubject.trim(),
                    body: quickBody.trim(),
                    sent_at: new Date().toISOString(),
                    status: 'sent'
                  })
                  setTimeout(() => {
                    setShowQuickEmailModal(false)
                    setQuickStatus(null)
                  }, 1200)
                } else {
                  setQuickStatus({ success: false, msg: res.error || 'Failed to dispatch email.' })
                }
              } catch (err: any) {
                setQuickStatus({ success: false, msg: err.message })
              } finally {
                setQuickSending(false)
              }
            }} className="space-y-3">
              <input
                type="email"
                required
                value={quickTo}
                onChange={e => setQuickTo(e.target.value)}
                placeholder="Recipient Email (To) *"
                className="admin-input text-xs"
              />
              <input
                type="text"
                required
                value={quickSubject}
                onChange={e => setQuickSubject(e.target.value)}
                placeholder="Subject Line *"
                className="admin-input text-xs"
              />
              <textarea
                rows={5}
                required
                value={quickBody}
                onChange={e => setQuickBody(e.target.value)}
                placeholder="Message body..."
                className="admin-input text-xs leading-relaxed"
              />

              {quickStatus && (
                <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  quickStatus.success ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  <span>{quickStatus.msg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] pt-3">
                <button type="button" onClick={() => setShowQuickEmailModal(false)} className="btn-admin-secondary text-xs py-2 px-3">
                  Cancel
                </button>
                <button type="submit" disabled={quickSending} className="btn-admin-primary text-xs py-2 px-4 font-bold">
                  {quickSending ? <Loader2 size={12} className="animate-spin" /> : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default LeadCRM
