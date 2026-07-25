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
    <section className="py-20 relative bg-brand-obsidian dark:bg-brand-obsidian light:bg-slate-50 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-12 sm:p-16 rounded-3xl border border-white/5 text-center space-y-6 relative overflow-hidden animate-fade-in-up">
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-emerald/10 filter blur-[80px] pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto font-display">
            {title}
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans font-light">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              to={cta_primary_href || '/contact'}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group shadow-lg shadow-brand-emerald/10"
            >
              <span>{cta_primary_text || 'Get Started Now'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {cta_secondary_text && cta_secondary_href && (
              <Link
                to={cta_secondary_href}
                className="btn-secondary w-full sm:w-auto text-base font-semibold py-3 px-6"
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
