import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/validation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  CheckCircle, Loader2, AlertCircle, Clock, Sparkles, Headphones 
} from 'lucide-react'

import SEOHead from '@/components/seo/SEOHead'

export const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      type: 'contact',
      budget: '$5k-$15k',
      timeline: '1-2 Months'
    }
  })

  const selectedType = watch('type') || 'contact'

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true)
    setErrorMsg(null)

    // Save fallback entry locally so Admin Panel can view it even in offline mode
    try {
      const localEntries = JSON.parse(localStorage.getItem('sw_contact_submissions') || '[]')
      localEntries.unshift({
        id: 'cs_' + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        company: data.company || '',
        type: data.type || 'contact',
        status: 'new',
        budget: data.budget || '',
        timeline: data.timeline || '',
        description: data.description,
        created_at: new Date().toISOString()
      })
      localStorage.setItem('sw_contact_submissions', JSON.stringify(localEntries))
    } catch (e) {}

    if (!isSupabaseConfigured) {
      // Graceful fallback when database is in offline or client demo mode
      console.info('[Lead & Contact Submission Captured]:', data)
      setSuccess(true)
      reset()
      setLoading(false)
      return
    }

    try {
      // Insert into leads table
      await supabase.from('leads').insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        type: data.type || 'contact',
        status: 'new',
        budget: data.budget || null,
        timeline: data.timeline || null,
        description: data.description
      })

      // Insert into contact_submissions table
      await supabase.from('contact_submissions').insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        type: data.type || 'contact',
        status: 'new',
        budget: data.budget || null,
        timeline: data.timeline || null,
        description: data.description,
        created_at: new Date().toISOString()
      })

      setSuccess(true)
      reset()
    } catch (err: any) {
      console.error('Lead & Contact record submission failed:', err)
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inquiryOptions = [
    { value: 'contact', label: 'General Inquiry' },
    { value: 'consultation', label: 'Web / App Development' },
    { value: 'automation_assessment', label: 'Workflow Automation' },
    { value: 'seo_audit', label: 'Technical SEO' }
  ]

  return (
    <div className="min-h-screen page-bg flex flex-col">
      <SEOHead
        title="Contact Us & Project Consultation | Spring Web Solutions (Udumalpet & Global)"
        description="Need web development, ERP/CRM software, or app engineering? Contact Spring Web Solutions in Udumalpet today to request your free consultation!"
      />
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="glow-node glow-emerald -top-20 -left-20" />
        <div className="glow-node glow-indigo bottom-20 -right-20" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Let's Build Something Great</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight light:text-slate-900">
              Get in Touch
            </h1>
            <p className="text-slate-400 light:text-slate-600 text-base leading-relaxed">
              Have a project in mind, need custom software, or want to automate your business processes? Reach out to our engineering team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            
            {/* Left Column: Essential Contact Information */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Contact Cards */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
                <h2 className="font-display text-xl font-bold text-white light:text-slate-900">
                  Contact Information
                </h2>

                <div className="space-y-5 text-sm">
                  
                  {/* Email */}
                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider light:text-slate-500">Email Us</div>
                      <a href="mailto:hello@springwebsolutions.in" className="text-white hover:text-brand-emerald transition-colors font-medium text-sm block mt-0.5 light:text-slate-900">
                        hello@springwebsolutions.in
                      </a>
                    </div>
                  </div>

                  {/* Phone & WhatsApp */}
                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider light:text-slate-500">Call / WhatsApp</div>
                      <a href="https://wa.me/918012622119" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-emerald transition-colors font-medium text-sm block mt-0.5 light:text-slate-900">
                        +91 80126 22119
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider light:text-slate-500">Office Location</div>
                      <span className="text-white font-medium text-sm block mt-0.5 light:text-slate-900">
                        Udumalpet, Tamil Nadu, India
                      </span>
                    </div>
                  </div>

                </div>

                {/* Response SLA Badge */}
                <div className="pt-4 border-t border-white/5 light:border-slate-200">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 light:bg-slate-100 light:text-slate-700">
                    <Clock size={15} className="text-brand-emerald shrink-0" />
                    <span>We typically respond within <strong>1 business day</strong>.</span>
                  </div>
                </div>

              </div>

              {/* Direct WhatsApp CTA Card */}
              <a 
                href="https://wa.me/918012622119" 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-panel p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Instant WhatsApp Chat</div>
                    <div className="text-[11px] text-slate-400">Chat directly with a developer</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">→</span>
              </a>

              {/* Existing Client Support Portal Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-500/20 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm font-display">
                  <Headphones size={18} />
                  <span>Existing Client Support Desk</span>
                </div>
                <p className="text-xs text-slate-300 light:text-slate-600 leading-relaxed font-light font-sans">
                  Need technical assistance, submit a ticket, or check ongoing project status? Visit our dedicated client support desk.
                </p>
                <Link
                  to="/support"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all w-full justify-center"
                >
                  <Headphones size={15} />
                  <span>Access Client Support Desk</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Clean Inquiry Form */}
            <div className="lg:col-span-8">
              <div className="glass-panel p-6 sm:p-10 rounded-3xl">
                {success ? (
                  <div className="text-center py-12 space-y-5">
                    <div className="h-14 w-14 mx-auto rounded-full bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald">
                      <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white light:text-slate-900">Message Received!</h2>
                    <p className="text-sm text-slate-400 light:text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Spring Web Solutions. An engineer will review your message and get back to you shortly.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="btn-secondary text-xs font-semibold"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {errorMsg && (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2">
                        <AlertCircle className="shrink-0 mt-0.5" size={16} />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Inquiry Type Chips */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider light:text-slate-500">
                        What can we help you with?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {inquiryOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setValue('type', opt.value as any)}
                            className={`p-2.5 rounded-xl text-xs font-medium text-center transition-all cursor-pointer border ${
                              selectedType === opt.value
                                ? 'bg-brand-emerald/15 border-brand-emerald text-brand-emerald font-bold'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white light:bg-slate-100 light:border-slate-200 light:text-slate-600'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider light:text-slate-500">Your Name *</label>
                        <input
                          type="text"
                          {...register('name')}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 light:bg-white light:border-slate-300 light:text-slate-800 light:placeholder:text-slate-400 transition-all duration-200"
                          placeholder="John Doe"
                        />
                        {errors.name && <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">⚠ {errors.name.message}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider light:text-slate-500">Email Address *</label>
                        <input
                          type="email"
                          {...register('email')}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 light:bg-white light:border-slate-300 light:text-slate-800 light:placeholder:text-slate-400 transition-all duration-200"
                          placeholder="john@company.com"
                        />
                        {errors.email && <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">⚠ {errors.email.message}</p>}
                      </div>
                    </div>

                    {/* Company & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider light:text-slate-500">Company / Organization</label>
                        <input
                          type="text"
                          {...register('company')}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-white light:border-slate-300 light:text-slate-800"
                          placeholder="Company Ltd."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider light:text-slate-500">Phone Number (Optional)</label>
                        <input
                          type="text"
                          {...register('phone')}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-white light:border-slate-300 light:text-slate-800"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    {/* Project Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider light:text-slate-500">How can we help? *</label>
                      <textarea
                        rows={4}
                        {...register('description')}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-white light:border-slate-300 light:text-slate-800"
                        placeholder="Tell us about your project requirements, goals, or current bottlenecks..."
                      />
                      {errors.description && <p className="text-xs text-rose-400">{errors.description.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary py-3.5 px-6 font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none hover:scale-[1.01] transition-all duration-300"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
export default Contact
