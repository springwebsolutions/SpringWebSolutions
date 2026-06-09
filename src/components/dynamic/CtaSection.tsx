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
    <section className="py-20 relative">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-12 sm:p-16 rounded-3xl border border-white/5 text-center space-y-6 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-emerald/10 filter blur-[80px] pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white light:text-slate-900 max-w-3xl mx-auto">
            {title}
          </h2>

          <p className="text-base sm:text-lg text-slate-400 light:text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              to={cta_primary_href || '/contact'}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 text-base font-semibold py-3 px-6 shadow-md shadow-brand-emerald/20"
            >
              <span>{cta_primary_text || 'Get Started Now'}</span>
              <ArrowRight size={18} />
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
