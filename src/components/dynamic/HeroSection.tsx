import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

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
    <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32 flex items-center justify-center">
      {/* Decorative Glow Nodes */}
      <div className="glow-node glow-emerald -top-20 -left-20" />
      <div className="glow-node glow-indigo top-40 -right-20" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8 z-10">
        
        {/* Trust pill */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-brand-emerald/20 bg-brand-emerald/5 text-brand-emerald text-xs font-semibold uppercase tracking-wider animate-pulse">
          <span>Smart Solutions Under One Roof</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-white light:text-slate-900 max-w-4xl mx-auto">
          {headline}
        </h1>

        {/* Subheadline description */}
        <p className="text-lg sm:text-xl text-slate-400 light:text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {subheadline}
        </p>

        {/* Action Button CTA Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to={cta_primary_href || '/contact'}
            className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group text-base font-semibold py-3 px-6 shadow-lg shadow-brand-emerald/20"
          >
            <span>{cta_primary_text || 'Get Free Consultation'}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to={cta_secondary_href || '/services'}
            className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 text-base font-semibold py-3 px-6"
          >
            <span>{cta_secondary_text || 'Explore Services'}</span>
            <ArrowUpRight size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>
    </section>
  )
}
export default HeroSection
