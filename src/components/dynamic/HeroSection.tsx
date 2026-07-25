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
    <section className="relative overflow-hidden py-20 lg:py-32 flex items-center bg-brand-obsidian dark:bg-brand-obsidian light:bg-slate-50 border-b border-white/5 light:border-slate-200 transition-colors duration-300">
      {/* Decorative Glow Nodes */}
      <div className="glow-node glow-emerald -top-20 -left-20" />
      <div className="glow-node glow-indigo top-40 -right-20" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Headline */}
          <div className="lg:col-span-7 space-y-6">

            <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl font-extrabold leading-none tracking-tight text-slate-900 dark:text-white font-display">
              {headline}
            </h1>
          </div>

          {/* Right Column: Description & CTAs */}
          <div className="lg:col-span-5 space-y-8 lg:pt-6 lg:pl-6 lg:border-l lg:border-white/5 light:lg:border-slate-200">
            <p className="animate-fade-in-up animation-delay-200 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-light">
              {subheadline}
            </p>

            <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to={cta_primary_href || '/contact'}
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group shadow-lg shadow-brand-emerald/10"
              >
                <span>{cta_primary_text || 'Get Free Consultation'}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to={cta_secondary_href || '/services'}
                className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <span>{cta_secondary_text || 'Explore Services'}</span>
                <ArrowUpRight size={16} className="opacity-70 group-hover:opacity-100 transition-all" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
export default HeroSection
