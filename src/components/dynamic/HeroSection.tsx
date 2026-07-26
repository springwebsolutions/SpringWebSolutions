import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'

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
      {/* Decorative Glow Nodes */}
      <div className="glow-node glow-emerald -top-20 -left-20" />
      <div className="glow-node glow-indigo top-40 -right-20" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 text-center">
        
        {/* BIG CENTERED BRAND TITLE BLOCK */}
        <div className="space-y-4 max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-extrabold uppercase tracking-widest font-display">
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

      </div>
    </section>
  )
}
export default HeroSection
