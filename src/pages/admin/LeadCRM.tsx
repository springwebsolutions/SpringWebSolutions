import React, { useEffect, useState } from 'react'
import { useCRMStore, type Lead, type LeadNote, type LeadTask, type LeadActivity } from '@/stores/crmStore'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { sendResendEmail } from '@/lib/emailService'
import { 
  Inbox, Phone, Mail, Building, Plus, Trash2, Send, CheckCircle, AlertCircle,
  MessageSquare, Calendar, CheckSquare, ListTodo, Activity, Loader2, ArrowRight 
} from 'lucide-react'

export const LeadCRM: React.FC = () => {
  const { 
    leads, 
    loading, 
    fetchLeads, 
    selectedLead, 
    selectLead, 
    notes, 
    activities, 
    tasks, 
    updateLeadStatus, 
    addLeadNote, 
    addLeadTask, 
    toggleTaskCompleted 
  } = useCRMStore()

  const [activeTab, setActiveTab] = useState<'notes' | 'tasks' | 'timeline' | 'email'>('notes')
  
  // Note Form
  const [noteContent, setNoteContent] = useState('')
  const [noteSubmitting, setNoteSubmitting] = useState(false)

  // Task Form
  const [taskTitle, setTaskTitle] = useState('')
  const [taskSubmitting, setTaskSubmitting] = useState(false)

  // Resend Direct Email Form
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
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

  // Quick Standalone Email Modal State
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
      setEmailSubject(`Following up regarding your request — Spring Web Solutions`)
      setEmailBody(`Hi ${selectedLead.name},\n\nThank you for reaching out to Spring Web Solutions regarding your project requirement.\n\nWe have reviewed your inquiry and would love to schedule a brief 15-minute consultation to discuss your technical architecture and timeline.\n\nBest regards,\nSpring Web Solutions Team\nhttps://springwebsolutions.in`)
      setEmailStatus(null)
    }
  }, [selectedLead])

  const handleSendResendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead || !emailSubject.trim() || !emailBody.trim()) return
    setEmailSending(true)
    setEmailStatus(null)

    try {
      const formattedHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #070a13; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 24px; text-align: center;">
            <h2 style="color: #10b981; margin: 0; font-size: 22px;">Spring Web Solutions</h2>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Client Relationship Response</p>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">${emailBody}</div>
          <div style="margin-top: 24px; text-align: center; font-size: 12px; color: #64748b;">
            <p>Spring Web Solutions • Udumalpet, Tamil Nadu</p>
          </div>
        </div>
      `

      const result = await sendResendEmail({
        from: 'Spring Web Solutions <hello@springwebsolutions.in>',
        to: selectedLead.email,
        subject: emailSubject.trim(),
        html: formattedHtml
      })

      if (result.success) {
        setEmailStatus({ success: true, msg: `Email successfully sent to ${selectedLead.email} via Resend!` })
        // Log note automatically
        await addLeadNote(selectedLead.id, `📨 Dispatched Resend Email: "${emailSubject.trim()}"`)
        // Update status to contacted if new
        if (selectedLead.status === 'new') {
          await updateLeadStatus(selectedLead.id, 'contacted')
        }
      } else {
        setEmailStatus({ success: false, msg: result.error || 'Failed to send email.' })
      }
    } catch (err: any) {
      console.error(err)
      setEmailStatus({ success: false, msg: err.message || 'Error dispatching email.' })
    } finally {
      setEmailSending(false)
    }
  }

  const { createLead } = useCRMStore()

  const handleCreateLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLeadName.trim() || !newLeadEmail.trim()) return
    setCreateLoading(true)
    try {
      await createLead({
        name: newLeadName.trim(),
        email: newLeadEmail.trim(),
        phone: newLeadPhone.trim() || null,
        company: newLeadCompany.trim() || null,
        type: newLeadType,
        status: newLeadStatus,
        budget: newLeadBudget.trim() || null,
        timeline: null,
        description: newLeadDesc.trim() || null,
        assigned_to: null
      })
      setShowAddLeadModal(false)
      // Reset form
      setNewLeadName('')
      setNewLeadEmail('')
      setNewLeadPhone('')
      setNewLeadCompany('')
      setNewLeadBudget('')
      setNewLeadDesc('')
    } catch (err) {
      console.error(err)
    } finally {
      setCreateLoading(false)
    }
  }

  const handleQuickEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickTo.trim() || !quickSubject.trim() || !quickBody.trim()) return
    setQuickSending(true)
    setQuickStatus(null)

    try {
      const formattedHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #070a13; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
          <div style="margin-bottom: 24px; text-align: center;">
            <h2 style="color: #10b981; margin: 0; font-size: 22px;">Spring Web Solutions</h2>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Direct Communication</p>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">${quickBody}</div>
          <div style="margin-top: 24px; text-align: center; font-size: 12px; color: #64748b;">
            <p>Spring Web Solutions • Udumalpet, Tamil Nadu</p>
          </div>
        </div>
      `

      const res = await sendResendEmail({
        from: 'Spring Web Solutions <hello@springwebsolutions.in>',
        to: quickTo.trim(),
        subject: quickSubject.trim(),
        html: formattedHtml
      })

      if (res.success) {
        setQuickStatus({ success: true, msg: `Email sent to ${quickTo.trim()} via Resend!` })
        setTimeout(() => {
          setShowQuickEmailModal(false)
          setQuickTo('')
          setQuickSubject('')
          setQuickBody('')
          setQuickStatus(null)
        }, 1800)
      } else {
        setQuickStatus({ success: false, msg: res.error || 'Failed to dispatch email.' })
      }
    } catch (err: any) {
      console.error(err)
      setQuickStatus({ success: false, msg: err.message || 'Error dispatching email.' })
    } finally {
      setQuickSending(false)
    }
  }

  const handleStatusChange = async (leadId: string, status: Lead['status']) => {
    await updateLeadStatus(leadId, status)
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead || !noteContent.trim()) return
    setNoteSubmitting(true)
    try {
      await addLeadNote(selectedLead.id, noteContent)
      setNoteContent('')
    } catch (err) {
      console.error(err)
    } finally {
      setNoteSubmitting(false)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead || !taskTitle.trim()) return
    setTaskSubmitting(true)
    try {
      await addLeadTask(selectedLead.id, { title: taskTitle })
      setTaskTitle('')
    } catch (err) {
      console.error(err)
    } finally {
      setTaskSubmitting(false)
    }
  }

  // Pipeline columns definition
  const columns: Array<{ id: Lead['status']; label: string; color: string }> = [
    { id: 'new', label: 'New Inbox', color: 'border-brand-emerald bg-brand-emerald/5 text-brand-emerald' },
    { id: 'contacted', label: 'Contacted', color: 'border-blue-400 bg-blue-500/5 text-blue-400' },
    { id: 'qualified', label: 'Qualified', color: 'border-indigo-400 bg-indigo-500/5 text-indigo-400' },
    { id: 'proposal_sent', label: 'Proposal Sent', color: 'border-purple-400 bg-purple-500/5 text-purple-400' },
    { id: 'negotiation', label: 'Negotiation', color: 'border-orange-400 bg-orange-500/5 text-orange-400' },
    { id: 'won', label: 'Won', color: 'border-emerald-500 bg-emerald-600/5 text-emerald-500 font-bold' },
    { id: 'lost', label: 'Lost', color: 'border-rose-500 bg-rose-600/5 text-rose-500' }
  ]

  if (loading && leads.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-brand-emerald">
        <Loader2 className="animate-spin" size={36} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Lead CRM Header Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Inbox size={18} className="text-brand-emerald" />
            <span>Lead CRM & Pipeline Management</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage deals, track sales pipelines, and dispatch client emails via Resend.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowQuickEmailModal(true)}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center justify-center gap-1.5 font-semibold cursor-pointer w-1/2 sm:w-auto"
          >
            <Send size={14} className="text-brand-emerald" />
            <span>Compose Resend Email</span>
          </button>

          <button
            onClick={() => setShowAddLeadModal(true)}
            className="btn-primary text-xs py-2 px-3.5 flex items-center justify-center gap-1.5 font-semibold cursor-pointer shadow shadow-brand-emerald/20 w-1/2 sm:w-auto"
          >
            <Plus size={16} />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Visual Kanban Board Columns Grid */}
      <div className="flex space-x-4 overflow-x-auto pb-6 select-none min-h-[450px]">
        {columns.map(col => {
          const colLeads = leads.filter(l => l.status === col.id)
          return (
            <div key={col.id} className="w-72 shrink-0 flex flex-col space-y-4">
              {/* Column header */}
              <div className={`p-3 rounded-xl border border-white/5 flex items-center justify-between ${col.color}`}>
                <span className="text-xs font-bold uppercase tracking-wider">{col.label}</span>
                <span className="px-2 py-0.5 rounded bg-black/20 text-[10px] font-bold">{colLeads.length}</span>
              </div>

              {/* Column Cards Container */}
              <div className="flex-1 bg-white/1 rounded-2xl p-3 border border-white/5 space-y-3 min-h-[350px] overflow-y-auto">
                {colLeads.map(lead => (
                  <div
                    key={lead.id}
                    onClick={() => selectLead(lead)}
                    className={`p-4 rounded-xl border border-white/5 bg-[#070a13] hover:border-brand-emerald/30 hover:shadow-lg transition-all cursor-pointer space-y-3 ${
                      selectedLead?.id === lead.id ? 'border-brand-emerald ring-1 ring-brand-emerald' : ''
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white text-sm line-clamp-1">{lead.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building size={10} />
                        <span className="truncate">{lead.company || 'Private user'}</span>
                      </div>
                    </div>

                    <div className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 w-max capitalize">
                      {lead.type.replace('_', ' ')}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5 pt-2">
                      <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                      {lead.budget && <span className="font-bold text-brand-emerald">{lead.budget}</span>}
                    </div>
                  </div>
                ))}
                {colLeads.length === 0 && (
                  <div className="text-center py-12 text-slate-600 text-xs font-medium">Empty Column</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Slide-out details drawer overlay */}
      {selectedLead && (
        <div className="glass-panel p-8 rounded-3xl border border-brand-emerald/20 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          <button
            onClick={() => selectLead(null)}
            className="absolute top-4 right-4 text-xs text-slate-500 hover:text-white"
          >
            Close Profile
          </button>

          {/* Profile details (Col: 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="px-2 py-0.5 rounded bg-brand-emerald/10 text-brand-emerald text-[10px] font-bold uppercase tracking-wider">
                {selectedLead.type.replace('_', ' ')}
              </span>
              <h2 className="font-display text-2xl font-bold text-white mt-2 light:text-slate-900">{selectedLead.name}</h2>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <Building size={12} />
                <span>{selectedLead.company || 'Private Client'}</span>
              </div>
            </div>

            {/* Status change select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Pipeline Status</label>
              <select
                value={selectedLead.status}
                onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-[#141b2b] border border-white/10 text-xs text-white focus:outline-none"
              >
                <option value="new">New Inbox</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won (Deal Closed)</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            {/* Quick Contact parameters */}
            <div className="space-y-3 text-xs text-slate-400 border-y border-white/5 py-4 light:border-slate-200">
              <div className="flex items-center space-x-2">
                <Mail size={14} className="text-brand-emerald" />
                <a href={`mailto:${selectedLead.email}`} className="hover:text-white transition-colors">{selectedLead.email}</a>
              </div>
              {selectedLead.phone && (
                <div className="flex items-center space-x-2">
                  <Phone size={14} className="text-brand-emerald" />
                  <a href={`tel:${selectedLead.phone}`} className="hover:text-white transition-colors">{selectedLead.phone}</a>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar size={14} className="text-brand-emerald" />
                <span>Created: {new Date(selectedLead.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Budget Timeline */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">Budget Range</div>
                <div className="font-bold text-brand-emerald">{selectedLead.budget || 'Not set'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">Timeline Target</div>
                <div className="font-bold text-slate-300">{selectedLead.timeline || 'Not set'}</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase">Requirement description</div>
              <p className="text-xs text-slate-300 leading-relaxed bg-white/2 p-3 rounded-lg border border-white/5 overflow-y-auto max-h-40">
                {selectedLead.description}
              </p>
            </div>
          </div>

          {/* CRM notes / tasks / history tabs (Col: 7) */}
          <div className="lg:col-span-7 flex flex-col space-y-4 border-l border-white/5 pl-0 lg:pl-6 light:border-slate-200">
            {/* Nav tabs header */}
            <div className="flex border-b border-white/5 dark:border-white/5 light:border-slate-200 text-xs overflow-x-auto">
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-2 px-3 font-semibold border-b-2 cursor-pointer shrink-0 ${
                  activeTab === 'notes' ? 'border-brand-emerald text-white' : 'border-transparent text-slate-500'
                }`}
              >
                CRM Notes ({notes.length})
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`pb-2 px-3 font-semibold border-b-2 cursor-pointer shrink-0 ${
                  activeTab === 'tasks' ? 'border-brand-emerald text-white' : 'border-transparent text-slate-500'
                }`}
              >
                Subtasks ({tasks.length})
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`pb-2 px-3 font-semibold border-b-2 cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  activeTab === 'email' ? 'border-brand-emerald text-brand-emerald font-bold' : 'border-transparent text-slate-500'
                }`}
              >
                <Mail size={12} />
                <span>Send Resend Email</span>
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`pb-2 px-3 font-semibold border-b-2 cursor-pointer shrink-0 ${
                  activeTab === 'timeline' ? 'border-brand-emerald text-white' : 'border-transparent text-slate-500'
                }`}
              >
                Timeline ({activities.length})
              </button>
            </div>

            {/* Dynamic tab views */}
            <div className="flex-1 min-h-[300px] overflow-y-auto max-h-[380px] space-y-4">
              
              {/* CRM NOTES TAB */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  {/* Note Form */}
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs focus:outline-none"
                      placeholder="Add follow-up note details..."
                    />
                    <button
                      type="submit"
                      disabled={noteSubmitting}
                      className="btn-primary py-1 px-3 text-xs"
                    >
                      {noteSubmitting ? <Loader2 className="animate-spin" size={12} /> : <span>Add Note</span>}
                    </button>
                  </form>

                  {/* Notes List */}
                  <div className="space-y-3">
                    {notes.map(note => (
                      <div key={note.id} className="p-3 rounded-lg bg-white/2 border border-white/5 text-xs space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-slate-500">
                          <span className="font-semibold text-slate-400">{note.profiles?.full_name || 'Staff'}</span>
                          <span>{new Date(note.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{note.content}</p>
                      </div>
                    ))}
                    {notes.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-6">No follow-up notes logged.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TASKS CHECKLIST TAB */}
              {activeTab === 'tasks' && (
                <div className="space-y-4">
                  {/* Task Form */}
                  <form onSubmit={handleAddTask} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs focus:outline-none"
                      placeholder="Define new task/checklist item..."
                    />
                    <button
                      type="submit"
                      disabled={taskSubmitting}
                      className="btn-primary py-1 px-3 text-xs"
                    >
                      {taskSubmitting ? <Loader2 className="animate-spin" size={12} /> : <span>Add Task</span>}
                    </button>
                  </form>

                  {/* Tasks list checkmarks */}
                  <div className="space-y-2">
                    {tasks.map(task => (
                      <label
                        key={task.id}
                        className="flex items-center space-x-3 p-2.5 rounded-lg bg-white/2 border border-white/5 text-xs text-slate-300 select-none cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={task.is_completed}
                          onChange={(e) => toggleTaskCompleted(task.id, e.target.checked)}
                          className="rounded border-white/10 text-brand-emerald focus:ring-brand-emerald"
                        />
                        <span className={task.is_completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                          {task.title}
                        </span>
                      </label>
                    ))}
                    {tasks.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-6">No tasks allocated for this client deal.</p>
                    )}
                  </div>
                </div>
              )}

              {/* DIRECT RESEND EMAIL TAB */}
              {activeTab === 'email' && (
                <form onSubmit={handleSendResendEmail} className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 bg-white/5 p-2 rounded-lg border border-white/10">
                    <span>Recipient: <strong className="text-brand-emerald">{selectedLead.email}</strong></span>
                    <span>Sender: <strong className="text-slate-200">hello@springwebsolutions.in</strong></span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Email Subject Line</label>
                    <input
                      type="text"
                      required
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Email subject..."
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Email Message (HTML/Formatted Text)</label>
                    <textarea
                      rows={6}
                      required
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Write message to client..."
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                    />
                  </div>

                  {emailStatus && (
                    <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                      emailStatus.success ? 'bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {emailStatus.success ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      <span>{emailStatus.msg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={emailSending}
                    className="w-full btn-primary py-2 flex items-center justify-center gap-1.5 font-semibold text-xs cursor-pointer shadow shadow-brand-emerald/20"
                  >
                    {emailSending ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                    <span>Send Email via Resend</span>
                  </button>
                </form>
              )}
              {activeTab === 'timeline' && (
                <div className="relative border-l border-white/10 ml-2 pl-4 py-2 space-y-4 text-xs text-slate-400">
                  {activities.map((act, idx) => (
                    <div key={act.id} className="relative space-y-0.5">
                      {/* Timeline dot */}
                      <span className="absolute -left-[21px] top-1.5 bg-brand-emerald h-2.5 w-2.5 rounded-full ring-4 ring-[#070a13]" />
                      <div className="flex justify-between items-center text-[10px] text-slate-500">
                        <span className="font-semibold uppercase tracking-wider text-[9px] text-brand-emerald">{act.activity_type}</span>
                        <span>{new Date(act.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{act.description}</p>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-6">No CRM timeline recorded.</p>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* ADD NEW LEAD MODAL */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateLeadSubmit} className="glass-panel p-8 rounded-3xl border border-brand-emerald/20 max-w-lg w-full space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h4 className="font-display font-bold text-white text-base flex items-center gap-2">
                <Plus size={18} className="text-brand-emerald" />
                <span>Add New CRM Lead / Client Contact</span>
              </h4>
              <button type="button" onClick={() => setShowAddLeadModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="Client Name"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                  placeholder="client@company.com"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Company Name</label>
                <input
                  type="text"
                  value={newLeadCompany}
                  onChange={(e) => setNewLeadCompany(e.target.value)}
                  placeholder="Acme Corp"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Inquiry Type</label>
                <select
                  value={newLeadType}
                  onChange={(e) => setNewLeadType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none"
                >
                  <option value="contact">General Inquiry</option>
                  <option value="consultation">Consultation Call</option>
                  <option value="seo_audit">SEO Audit Request</option>
                  <option value="website_audit">Website Audit</option>
                  <option value="automation_assessment">Automation Assessment</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Initial Pipeline Stage</label>
                <select
                  value={newLeadStatus}
                  onChange={(e) => setNewLeadStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none"
                >
                  <option value="new">New Inbox</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal_sent">Proposal Sent</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="won">Won (Closed)</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Budget Estimate</label>
                <input
                  type="text"
                  value={newLeadBudget}
                  onChange={(e) => setNewLeadBudget(e.target.value)}
                  placeholder="e.g. ₹50,000 - ₹1,50,000"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Lead Requirement Notes</label>
                <textarea
                  rows={3}
                  value={newLeadDesc}
                  onChange={(e) => setNewLeadDesc(e.target.value)}
                  placeholder="Details regarding project scope or request..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowAddLeadModal(false)} className="btn-secondary py-1.5 px-4 text-xs">Cancel</button>
              <button type="submit" disabled={createLoading} className="btn-primary py-1.5 px-4 text-xs flex items-center gap-1.5">
                {createLoading ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                <span>Save Lead to CRM</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QUICK STANDALONE RESEND EMAIL MODAL */}
      {showQuickEmailModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleQuickEmailSubmit} className="glass-panel p-8 rounded-3xl border border-brand-emerald/20 max-w-lg w-full space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h4 className="font-display font-bold text-white text-base flex items-center gap-2">
                <Send size={18} className="text-brand-emerald" />
                <span>Compose Resend Email</span>
              </h4>
              <button type="button" onClick={() => setShowQuickEmailModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Recipient Email Address (To) *</label>
              <input
                type="email"
                required
                value={quickTo}
                onChange={(e) => setQuickTo(e.target.value)}
                placeholder="client@example.com"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Email Subject *</label>
              <input
                type="text"
                required
                value={quickSubject}
                onChange={(e) => setQuickSubject(e.target.value)}
                placeholder="Proposal Quote & Discussion — Spring Web Solutions"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Email Body (HTML/Formatted Text) *</label>
              <textarea
                rows={6}
                required
                value={quickBody}
                onChange={(e) => setQuickBody(e.target.value)}
                placeholder="Write your email content here..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>

            {quickStatus && (
              <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                quickStatus.success ? 'bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {quickStatus.success ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                <span>{quickStatus.msg}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowQuickEmailModal(false)} className="btn-secondary py-1.5 px-4 text-xs">Cancel</button>
              <button type="submit" disabled={quickSending} className="btn-primary py-1.5 px-4 text-xs flex items-center gap-1.5 shadow shadow-brand-emerald/20">
                {quickSending ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                <span>Send Email via Resend</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}
export default LeadCRM
