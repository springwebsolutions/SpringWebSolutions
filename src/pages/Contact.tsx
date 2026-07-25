import React, { useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/validation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  CheckCircle, Loader2, AlertCircle 
} from 'lucide-react'

export const Contact: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      type: 'contact',
      budget: '$5k-$15k',
      timeline: '1-2 Months'
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true)
    setErrorMsg(null)

    if (!isSupabaseConfigured) {
      setErrorMsg('Platform database configuration is currently offline. Submissions are disabled.')
      setLoading(false)
      return
    }

    try {
      // Map form categories to lead type
      let type: any = 'contact'
      if (data.type) type = data.type

      const { error } = await supabase.from('leads').insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        type,
        status: 'new',
        budget: data.budget || null,
        timeline: data.timeline || null,
        description: data.description
      })

      if (error) throw error

      setSuccess(true)
      reset()
    } catch (err: any) {
      console.error('Lead record submission failed:', err)
      setErrorMsg(err.message || 'An unexpected error occurred. Please verify your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col dark:bg-[#070a13] light:bg-[#f8fafc]">
      <Navbar />

      <main className="flex-grow py-16 lg:py-24 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="glow-node glow-emerald -top-20 -left-20" />
        <div className="glow-node glow-indigo bottom-40 -right-20" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-extrabold text-white tracking-tight light:text-slate-900">
              Start Your Digital Growth Journey
            </h1>
            <p className="text-lg text-slate-400 light:text-slate-600">
              Tell us about your project, software scope, or SEO goals. Our engineering team will review details and schedule a direct technical roadmap analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column Info details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="glass-panel p-8 rounded-3xl space-y-8">
                <h2 className="font-display text-2xl font-bold text-white light:text-slate-900">
                  Connect Directly
                </h2>
                
                <div className="space-y-6 text-sm text-slate-400 light:text-slate-600">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-emerald shrink-0">
                      <Mail size={18} />
                    </div>
                    <div className="space-y-1">
                      <div className="font-display font-semibold text-white text-xs uppercase tracking-wider light:text-slate-700">General Inquiries</div>
                      <a href="mailto:hello@springwebsolutions.in" className="hover:text-white transition-colors text-sm block font-mono text-brand-emerald">hello@springwebsolutions.in</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-emerald shrink-0">
                      <Mail size={18} />
                    </div>
                    <div className="space-y-1">
                      <div className="font-display font-semibold text-white text-xs uppercase tracking-wider light:text-slate-700">Sales & Pricing</div>
                      <a href="mailto:sales@springwebsolutions.in" className="hover:text-white transition-colors text-sm block font-mono text-brand-emerald">sales@springwebsolutions.in</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-emerald shrink-0">
                      <Mail size={18} />
                    </div>
                    <div className="space-y-1">
                      <div className="font-display font-semibold text-white text-xs uppercase tracking-wider light:text-slate-700">Technical Support</div>
                      <a href="mailto:support@springwebsolutions.in" className="hover:text-white transition-colors text-sm block font-mono text-brand-emerald">support@springwebsolutions.in</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-emerald shrink-0">
                      <Mail size={18} />
                    </div>
                    <div className="space-y-1">
                      <div className="font-display font-semibold text-white text-xs uppercase tracking-wider light:text-slate-700">Developer & Integration</div>
                      <a href="mailto:developer@springwebsolutions.in" className="hover:text-white transition-colors text-sm block font-mono text-brand-emerald">developer@springwebsolutions.in</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-emerald shrink-0">
                      <Mail size={18} />
                    </div>
                    <div className="space-y-1">
                      <div className="font-display font-semibold text-white text-xs uppercase tracking-wider light:text-slate-700">Careers & Hiring</div>
                      <a href="mailto:careers@springwebsolutions.in" className="hover:text-white transition-colors text-sm block font-mono text-brand-emerald">careers@springwebsolutions.in</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-emerald shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <div className="font-display font-semibold text-white text-xs uppercase tracking-wider light:text-slate-700">Phone Hotline</div>
                      <a href="tel:+918012622119" className="hover:text-white transition-colors text-sm mt-1 block font-mono text-slate-200">+91 80126 22119</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-emerald shrink-0">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <div className="font-display font-semibold text-white text-xs uppercase tracking-wider light:text-slate-700">WhatsApp Chat</div>
                      <a href="https://wa.me/918012622119" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-sm mt-1 block text-brand-emerald font-semibold">+91 80126 22119 (Start Chat)</a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-brand-emerald shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className="font-display font-semibold text-white text-xs uppercase tracking-wider light:text-slate-700">HQ Address</div>
                      <span className="text-sm mt-1 block leading-relaxed text-slate-200">Udumalpet, Tamil Nadu</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Styled Maps Placeholder */}
              <div className="glass-panel h-64 rounded-3xl relative overflow-hidden border border-white/5 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#0c1424] opacity-80 pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
                <div className="relative text-center p-6 space-y-2 z-10">
                  <MapPin size={32} className="mx-auto text-brand-indigo animate-bounce" />
                  <div className="font-display font-bold text-white text-sm">Spring Web Solutions</div>
                  <div className="text-xs text-slate-500">Udumalpet, Tamil Nadu, India</div>
                </div>
              </div>
            </div>

            {/* Right Column Form */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/5">
                {success ? (
                  <div className="text-center py-16 space-y-6">
                    <div className="h-16 w-16 mx-auto rounded-full bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald">
                      <CheckCircle size={36} />
                    </div>
                    <h2 className="text-2xl font-bold text-white light:text-slate-900">Inquiry Logged Successfully!</h2>
                    <p className="text-sm text-slate-400 light:text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Spring Web Solutions. A staff solution engineer has been alerted and will contact you within 1 business day.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="btn-secondary text-sm font-semibold"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    {errorMsg && (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2">
                        <AlertCircle className="shrink-0 mt-0.5" size={16} />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Form Step */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Name</label>
                        <input
                          type="text"
                          {...register('name')}
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-950/5 light:border-slate-200 light:text-slate-800"
                          placeholder="John Doe"
                        />
                        {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          {...register('email')}
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-950/5 light:border-slate-200 light:text-slate-800"
                          placeholder="john@company.com"
                        />
                        {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone (Optional)</label>
                        <input
                          type="text"
                          {...register('phone')}
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-950/5 light:border-slate-200 light:text-slate-800"
                          placeholder="+1 (555) 0199"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Name</label>
                        <input
                          type="text"
                          {...register('company')}
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-950/5 light:border-slate-200 light:text-slate-800"
                          placeholder="Enterprise Inc."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inquiry Type</label>
                        <select
                          {...register('type')}
                          className="w-full px-4 py-2.5 rounded-lg bg-[#141b2b] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-50 light:border-slate-200 light:text-slate-800"
                        >
                          <option value="contact">General Inquiry</option>
                          <option value="consultation">Free Consultation</option>
                          <option value="seo_audit">SEO Audit Request</option>
                          <option value="website_audit">Website Audit Request</option>
                          <option value="automation_assessment">Automation Assessment</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Budget</label>
                        <select
                          {...register('budget')}
                          className="w-full px-4 py-2.5 rounded-lg bg-[#141b2b] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-50 light:border-slate-200 light:text-slate-800"
                        >
                          <option value="<$5k">&lt; $5,000</option>
                          <option value="$5k-$15k">$5,000 - $15,000</option>
                          <option value="$15k-$30k">$15,000 - $30,000</option>
                          <option value="$30k+">$30,000 +</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Timeline</label>
                        <select
                          {...register('timeline')}
                          className="w-full px-4 py-2.5 rounded-lg bg-[#141b2b] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-50 light:border-slate-200 light:text-slate-800"
                        >
                          <option value="ASAP">ASAP</option>
                          <option value="1-2 Months">1 - 2 Months</option>
                          <option value="3-6 Months">3 - 6 Months</option>
                          <option value="General Inquiry">Flexible</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Scope / Requirements</label>
                      <textarea
                        rows={5}
                        {...register('description')}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-950/5 light:border-slate-200 light:text-slate-800"
                        placeholder="Please describe what you want to build or optimize. Outline any web integration requirements, design preferences, or current business bottlenecks."
                      />
                      {errors.description && <p className="text-xs text-rose-400">{errors.description.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary py-3 px-6 font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-emerald/20"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          <span>Filing Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Submit Solutions Request</span>
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
