import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface CtaProps {
  content: {
    title: string
    subtitle: string
    cta_primary_text?: string
    cta_primary_href?: string
    cta_secondary_text?: string
    cta_secondary_href?: string
  }
  styling?: any
}

export const CtaSection: React.FC<CtaProps> = ({ content }) => {
  const {
    title,
    subtitle,
    cta_primary_text,
    cta_primary_href,
    cta_secondary_text,
    cta_secondary_href
  } = content

  return (
    <section className="py-20 relative bg-[#040509] dark:bg-[#040509] light:bg-slate-50 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="p-12 sm:p-16 rounded-3xl bg-[#080b14] dark:bg-[#080b14] light:bg-white border border-white/10 light:border-slate-200 light:shadow-md text-center space-y-6 relative overflow-hidden animate-fade-in-up hover:border-emerald-500/30 transition-all duration-300">
          {/* Animated Background Glow Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/15 filter blur-[100px] pointer-events-none animate-pulse-slow" />
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-indigo-500/15 filter blur-[60px] pointer-events-none animate-orb-1" />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white dark:text-white light:text-slate-900 max-w-3xl mx-auto font-display relative z-10">
            {title}
          </h2>

          <p className="text-base sm:text-lg text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-2xl mx-auto leading-relaxed font-sans font-light relative z-10">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 relative z-10">
            <Link
              to={cta_primary_href || '/contact'}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all duration-300"
            >
              <span>{cta_primary_text || 'Get Started Now'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>

            {cta_secondary_text && cta_secondary_href && (
              <Link
                to={cta_secondary_href}
                className="btn-secondary w-full sm:w-auto text-base font-semibold py-3 px-6 hover:scale-105 transition-all duration-300"
              >
                {cta_secondary_text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
export default CtaSection
