import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CareersNavbar } from '@/components/careers/CareersNavbar'
import { CareersFooter } from '@/components/careers/CareersFooter'
import { CareersSeo } from '@/components/seo/CareersSeo'
import {
  Bell, CheckCircle2, ShieldCheck, Mail, Sparkles, MapPin,
  Briefcase, ArrowRight, Zap, RefreshCw, AlertCircle, Laptop
} from 'lucide-react'

const POPULAR_KEYWORDS = [
  'React', 'Node.js', 'Python', 'TypeScript', 'Full Stack',
  'Frontend', 'Backend', 'DevOps', 'Mobile', 'UI/UX', 'SEO'
]

const POPULAR_LOCATIONS = [
  'Remote / WFH', 'Bengaluru', 'Chennai', 'Coimbatore', 'Hyderabad',
  'Mumbai', 'Pune', 'Delhi NCR', 'Udumalpet', 'Tamil Nadu'
]

const POPULAR_CATEGORIES = [
  'Software Engineering', 'Mobile App Development', 'Cloud & Infrastructure',
  'Data Science & AI', 'Digital Marketing & SEO', 'Design & Creative'
]

export const JobAlertSubscribe: React.FC = () => {
  const [email, setEmail] = useState('')
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(['React', 'Remote / WFH'])
  const [customKeyword, setCustomKeyword] = useState('')
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['Remote / WFH', 'Tamil Nadu'])
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Full-Time', 'Contract'])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleKeyword = (kw: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]
    )
  }

  const addCustomKeyword = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = customKeyword.trim()
    if (trimmed && !selectedKeywords.includes(trimmed)) {
      setSelectedKeywords((prev) => [...prev, trimmed])
      setCustomKeyword('')
    }
  }

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    )
  }

  const toggleType = (t: string) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/subscribe-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          keywords: selectedKeywords,
          locations: selectedLocations,
          job_types: selectedTypes,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Subscription failed. Please try again.')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#040509] text-white flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <CareersSeo
        title="Subscribe to Verified Job Alerts — SpringWeb Careers"
        description="Get instant email alerts when new verified tech, remote, and Indian job vacancies matching your skills are discovered."
        canonicalUrl="https://careers.springwebsolutions.in/alerts"
      />

      <CareersNavbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Header Hero */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Bell size={13} className="animate-bounce" />
            <span>AI Career Dispatch Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight">
            Never Miss a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">Verified Job Match</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Our AI discovery crawler scans hundreds of job boards daily. Subscribe to receive verified Indian tech and remote job vacancies directly in your inbox with 0% spam.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#0b101b] border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">You're on the Priority List!</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                We've registered your job alert preferences for <strong className="text-white">{email}</strong>. You'll receive real-time email digests whenever matching vacancies are verified.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-4">
              <Link
                to="/jobs"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <span>Browse Current Vacancies</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#0b101b] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Your Email Address <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com or candidate@gmail.com"
                  className="w-full bg-[#050811] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Keywords / Roles */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Target Roles &amp; Technologies
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_KEYWORDS.map((kw) => {
                  const isSelected = selectedKeywords.includes(kw)
                  return (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => toggleKeyword(kw)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {kw} {isSelected ? '✓' : '+'}
                    </button>
                  )
                })}
              </div>

              {/* Custom keyword input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  placeholder="Add custom keyword (e.g. Golang, Flutter)"
                  className="bg-[#050811] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomKeyword(e)
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addCustomKeyword}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Preferred Locations
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_LOCATIONS.map((loc) => {
                  const isSelected = selectedLocations.includes(loc)
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => toggleLocation(loc)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <MapPin size={11} className="inline mr-1" />
                      {loc} {isSelected ? '✓' : '+'}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Employment Type */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Employment Types
              </label>
              <div className="flex flex-wrap gap-2">
                {['Full-Time', 'Part-Time', 'Contract', 'Internship'].map((type) => {
                  const isSelected = selectedTypes.includes(type)
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleType(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Briefcase size={11} className="inline mr-1" />
                      {type} {isSelected ? '✓' : '+'}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Activating Job Alerts…</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    <span>Subscribe to Verified Job Alerts (Free)</span>
                  </>
                )}
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-center text-[11px] text-slate-500">
              <div className="flex items-center justify-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>100% Verified Job Sources</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                <span>Zero Fake Salaries (Source Fact)</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Laptop size={14} className="text-sky-400" />
                <span>Unsubscribe anytime in 1 click</span>
              </div>
            </div>
          </form>
        )}
      </main>

      <CareersFooter />
    </div>
  )
}
