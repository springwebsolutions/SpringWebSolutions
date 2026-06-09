import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Globe, Cpu, Smartphone, Activity } from 'lucide-react'

interface ServiceItem {
  title: string
  desc: string
  href: string
}

interface ServicesGridProps {
  content: {
    title: string
    subtitle?: string
    items: ServiceItem[]
  }
  styling?: any
}

// Icon mapper helper
const getServiceIcon = (title: string) => {
  const t = title.toLowerCase()
  if (t.includes('web') || t.includes('site')) return <Globe className="text-brand-emerald" size={24} />
  if (t.includes('software') || t.includes('system') || t.includes('custom')) return <Cpu className="text-brand-indigo" size={24} />
  if (t.includes('automation') || t.includes('flow')) return <Smartphone className="text-emerald-400" size={24} />
  return <Activity className="text-indigo-400" size={24} />
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ content }) => {
  const { title, subtitle, items } = content
  const services = items || []

  return (
    <section className="py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white light:text-slate-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-slate-400 light:text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Grid panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 light:bg-slate-100 light:border-slate-200">
                  {getServiceIcon(service.title)}
                </div>
                
                <h3 className="font-display text-xl font-bold text-white light:text-slate-900">
                  {service.title}
                </h3>
                
                <p className="text-sm text-slate-400 light:text-slate-600 leading-relaxed">
                  {service.desc}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  to={service.href || '/services'}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-emerald hover:text-brand-emerald-hover transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default ServicesGrid
