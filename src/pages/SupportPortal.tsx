import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ticketSchema, type TicketFormData } from '@/lib/validation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { 
  Ticket, Plus, AlertCircle, Loader2, CheckCircle, 
  Clock, ArrowRight, ShieldAlert, FileText, ChevronRight 
} from 'lucide-react'

export const SupportPortal: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuthStore()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      priority: 'medium'
    }
  })

  useEffect(() => {
    // Redirect if not logged in after auth resolves
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  const fetchTicketsAndProducts = async () => {
    if (!user || !isSupabaseConfigured) return
    setLoading(true)
    try {
      const [ticketsRes, productsRes] = await Promise.all([
        supabase
          .from('tickets')
          .select('*, products(name)')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false }),
        supabase
          .from('products')
          .select('id, name')
          .eq('status', 'active')
      ])

      setTickets(ticketsRes.data || [])
      setProducts(productsRes.data || [])
    } catch (err) {
      console.error('Error fetching support portal data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTicketsAndProducts()
  }, [user])

  const onSubmit = async (data: TicketFormData) => {
    if (!user || !isSupabaseConfigured) return
    setSubmitting(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      // 1. Insert Ticket
      const { data: ticketData, error: ticketErr } = await supabase
        .from('tickets')
        .insert({
          user_id: user.id,
          subject: data.subject,
          priority: data.priority,
          product_id: data.product_id || null,
          status: 'open'
        })
        .select()
        .single()

      if (ticketErr) throw ticketErr

      // 2. Insert First Message
      const { error: msgErr } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticketData.id,
          sender_id: user.id,
          message: data.message
        })

      if (msgErr) throw msgErr

      setSuccessMsg('Your support ticket has been created. A solutions engineer has been assigned.')
      reset()
      setShowCreateForm(false)
      fetchTicketsAndProducts()
    } catch (err: any) {
      console.error('Ticket submission failed:', err)
      setErrorMsg(err.message || 'Could not file ticket. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || (loading && tickets.length === 0)) {
    return (
      <div className="min-h-screen bg-[#070a13] flex items-center justify-center text-brand-emerald">
        <Loader2 className="animate-spin" size={36} />
      </div>
    )
  }

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
    <div className="min-h-screen bg-[#070a13] flex flex-col dark:bg-[#070a13] light:bg-[#f8fafc]">
      <Navbar />

      <main className="flex-grow py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-8 dark:border-white/5 light:border-slate-200">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight light:text-slate-900 flex items-center gap-2">
                <Ticket className="text-brand-emerald" />
                <span>Support Tickets</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1 light:text-slate-600">
                Logged in as <span className="text-white font-semibold light:text-slate-800">{profile?.full_name || user?.email}</span>. View and manage your technical queries.
              </p>
            </div>
            
            <button
              onClick={() => {
                setShowCreateForm(!showCreateForm)
                setSuccessMsg(null)
                setErrorMsg(null)
              }}
              className="btn-primary flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow shadow-brand-emerald/15"
            >
              <Plus size={16} />
              <span>{showCreateForm ? 'View Tickets' : 'New Ticket'}</span>
            </button>
          </div>

          {successMsg && (
            <div className="p-4 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs flex items-start gap-2 max-w-2xl">
              <CheckCircle className="shrink-0 mt-0.5" size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2 max-w-2xl">
              <AlertCircle className="shrink-0 mt-0.5" size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {showCreateForm ? (
            /* CREATE TICKET PANEL */
            <div className="max-w-2xl mx-auto glass-panel p-8 sm:p-10 rounded-3xl border border-white/5">
              <h2 className="font-display text-xl font-bold text-white mb-6 light:text-slate-900">
                Submit Support Case
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Subject Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject Summary</label>
                  <input
                    type="text"
                    {...register('subject')}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-900/5 light:border-slate-200 light:text-slate-800"
                    placeholder="e.g., Installation issue on PriceIQ macOS Build"
                  />
                  {errors.subject && <p className="text-xs text-rose-400">{errors.subject.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Related Product Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Related Product</label>
                    <select
                      {...register('product_id')}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#141b2b] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-50 light:border-slate-200 light:text-slate-800"
                    >
                      <option value="">General Solutions Inquiry</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Priority Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority Level</label>
                    <select
                      {...register('priority')}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#141b2b] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-50 light:border-slate-200 light:text-slate-800"
                    >
                      <option value="low">Low - General Question</option>
                      <option value="medium">Medium - Functional Issue</option>
                      <option value="high">High - System Blocked</option>
                      <option value="critical">Critical - Business Downtime</option>
                    </select>
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detailed Description</label>
                  <textarea
                    rows={6}
                    {...register('message')}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-900/5 light:border-slate-200 light:text-slate-800"
                    placeholder="Outline your issue step-by-step. Provide any logs, error codes, software versions, or reproduction paths."
                  />
                  {errors.message && <p className="text-xs text-rose-400">{errors.message.message}</p>}
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-1 py-3 font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-emerald/20"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Filing Ticket...</span>
                      </>
                    ) : (
                      <span>File Ticket</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn-secondary px-6 font-semibold"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          ) : (
            /* TICKETS LIST BOARD */
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-3xl max-w-md mx-auto space-y-4">
                  <Ticket size={48} className="mx-auto text-slate-650" />
                  <h3 className="text-lg font-bold text-white light:text-slate-800">No Support Tickets</h3>
                  <p className="text-xs text-slate-400 light:text-slate-600">
                    You currently have no active or archived support requests. Need technical help? File a new ticket above.
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn-primary text-xs font-semibold"
                  >
                    Open First Ticket
                  </button>
                </div>
              ) : (
                <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/2 text-slate-400 font-semibold uppercase tracking-wider text-[10px] light:border-slate-200 light:bg-slate-100 light:text-slate-600">
                          <th className="px-6 py-4">Ticket</th>
                          <th className="px-6 py-4">Product</th>
                          <th className="px-6 py-4">Subject</th>
                          <th className="px-6 py-4">Priority</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Last Updated</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300 light:divide-slate-200 light:text-slate-700">
                        {tickets.map((t) => (
                          <tr key={t.id} className="hover:bg-white/1 cursor-pointer" onClick={() => navigate(`/support/${t.id}`)}>
                            <td className="px-6 py-4 font-mono font-bold text-brand-emerald">
                              #{t.id.slice(0, 8)}
                            </td>
                            <td className="px-6 py-4">
                              {t.products?.name || 'General Solutions'}
                            </td>
                            <td className="px-6 py-4 font-semibold text-white max-w-xs truncate light:text-slate-800">
                              {t.subject}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getPriorityColor(t.priority)}`}>
                                {t.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getStatusColor(t.status)}`}>
                                {t.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-450">
                              {new Date(t.updated_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            </td>
                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <Link
                                to={`/support/${t.id}`}
                                className="inline-flex items-center gap-1 text-brand-emerald font-bold hover:underline"
                              >
                                <span>Open thread</span>
                                <ChevronRight size={14} />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
export default SupportPortal
