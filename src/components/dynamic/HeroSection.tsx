import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Sparkles, Code2, CheckCircle2, Cpu } from 'lucide-react'

interface HeroProps {
  content: {
    headline: string
    subheadline: string
    cta_primary_text: string
    cta_primary_href: string
    cta_secondary_text: string
    cta_secondary_href: string
  }
  styling?: any
}

export const HeroSection: React.FC<HeroProps> = ({ content }) => {
  const {
    headline,
    subheadline,
    cta_primary_text,
    cta_primary_href,
    cta_secondary_text,
    cta_secondary_href
  } = content

  return (
    <section className="relative overflow-hidden py-20 lg:py-28 flex items-center bg-[#040509] dark:bg-[#040509] light:bg-slate-50 border-b border-white/5 light:border-slate-200 transition-colors duration-300">
      
      {/* ─── Dynamic Animated Background Orbs ─── */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/15 filter blur-[120px] pointer-events-none animate-orb-1" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-indigo-600/15 filter blur-[120px] pointer-events-none animate-orb-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/10 filter blur-[140px] pointer-events-none animate-pulse-slow" />

      {/* Grid Overlay Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 text-center">
        
        {/* BIG CENTERED BRAND TITLE BLOCK */}
        <div className="space-y-4 max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-extrabold uppercase tracking-widest font-display shadow-sm">
            <Sparkles size={14} className="text-emerald-500" /> Official Web Engineering & Automation Agency
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight font-display text-white dark:text-white light:text-slate-900 leading-none">
            Spring Web <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-600">Solutions</span>
          </h1>
        </div>

        {/* Sub-Headline & CTAs */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-300 dark:text-slate-300 light:text-slate-800 font-display leading-snug">
            {headline}
          </h2>

          <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 light:text-slate-600 font-sans font-light leading-relaxed max-w-2xl mx-auto">
            {subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={cta_primary_href || '/contact'}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group shadow-xl shadow-emerald-500/20 text-sm font-bold py-3.5 px-8"
            >
              <span>{cta_primary_text || 'Get Free Consultation'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to={cta_secondary_href || '/services'}
              className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold py-3.5 px-8"
            >
              <span>{cta_secondary_text || 'Explore Services'}</span>
              <ArrowUpRight size={16} className="opacity-70 group-hover:opacity-100 transition-all" />
            </Link>
          </div>
        </div>

        {/* ─── Animated Glassmorphic Interactive Code Architecture Terminal ─── */}
        <div className="max-w-4xl mx-auto pt-4 animate-fade-in-up">
          <div className="rounded-3xl bg-[#080b14]/90 dark:bg-[#080b14]/90 light:bg-slate-900 border border-white/10 p-4 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
            
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-slate-300 font-semibold">springweb-architecture-v3.ts</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>SYSTEM ACTIVE • READY TO BUILD</span>
              </div>
            </div>

            {/* Live Solution Pipeline Code Viewer */}
            <div className="bg-[#030407] rounded-2xl p-4 text-left font-mono text-xs sm:text-sm text-slate-300 space-y-2 overflow-x-auto shadow-inner border border-white/5 leading-relaxed">
              <div className="flex items-center justify-between text-slate-500 text-[11px] pb-1 border-b border-white/5">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Code2 size={13} /> // SpringWeb Solution Architecture
                </span>
                <span className="text-teal-400">Environment: Production</span>
              </div>
              <div className="space-y-1 pt-1">
                <p className="text-slate-400"><span className="text-indigo-400">const</span> clientPlatform = <span className="text-emerald-400">new SpringWebEngine</span>({'{'}</p>
                <p className="pl-4 text-slate-300">frontend: <span className="text-amber-300">'React 19 + Next.js + Vite'</span>,</p>
                <p className="pl-4 text-slate-300">database: <span className="text-amber-300">'Supabase PostgreSQL Enterprise'</span>,</p>
                <p className="pl-4 text-slate-300">automation: [<span className="text-teal-300">'Instant Lead CRM'</span>, <span className="text-teal-300">'WhatsApp API'</span>],</p>
                <p className="pl-4 text-slate-300">codeOwnership: <span className="text-emerald-400">'100% Full Client Ownership'</span></p>
                <p className="text-slate-400 font-bold">{'}'});</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
export default HeroSection
