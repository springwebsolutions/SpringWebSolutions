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
  if (t.includes('web') || t.includes('site')) return <Globe className="text-emerald-500" size={24} />
  if (t.includes('software') || t.includes('system') || t.includes('custom')) return <Cpu className="text-indigo-500" size={24} />
  if (t.includes('automation') || t.includes('flow')) return <Smartphone className="text-emerald-500" size={24} />
  return <Activity className="text-indigo-500" size={24} />
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ content }) => {
  const { title, subtitle, items } = content
  const services = items || []

  return (
    <section className="py-20 relative bg-[#060810] dark:bg-[#060810] light:bg-slate-50 border-b border-white/5 light:border-slate-200 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title Block */}
        <div className="space-y-4 max-w-3xl animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 font-display tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-slate-400 dark:text-slate-400 light:text-slate-600 font-sans font-light leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Grid panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#080b14] dark:bg-[#080b14] light:bg-white border border-white/10 light:border-slate-200 light:shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${(idx + 1) * 150}ms` }}
            >
              <div className="space-y-6">
                <div className="h-12 w-12 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 flex items-center justify-center">
                  {getServiceIcon(service.title)}
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-display text-2xl font-bold text-white dark:text-white light:text-slate-900">
                    {service.title}
                  </h3>
                  
                  <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 font-sans font-light leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  to={service.href || '/services'}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
