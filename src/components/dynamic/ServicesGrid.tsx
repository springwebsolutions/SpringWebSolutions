import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Globe, Cpu, Smartphone, Monitor, Activity, Layers } from 'lucide-react'

interface ServiceItem {
  title: string
  desc: string
  href: string
}

interface ServicesGridProps {
  content: {
    title?: string
    subtitle?: string
    items?: ServiceItem[]
  }
  styling?: any
}

// Icon mapper helper
const getServiceIcon = (title: string) => {
  const t = title.toLowerCase()
  if (t.includes('android') || t.includes('mobile') || t.includes('ios')) return <Smartphone className="text-emerald-400" size={24} />
  if (t.includes('windows') || t.includes('desktop')) return <Monitor className="text-indigo-400" size={24} />
  if (t.includes('web') || t.includes('site')) return <Globe className="text-emerald-500" size={24} />
  if (t.includes('software') || t.includes('system') || t.includes('custom')) return <Cpu className="text-indigo-500" size={24} />
  if (t.includes('automation') || t.includes('flow')) return <Layers className="text-teal-400" size={24} />
  return <Activity className="text-indigo-400" size={24} />
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ content }) => {
  const title = content?.title || 'Engineered Services'
  const subtitle = content?.subtitle || 'Full-spectrum software engineering across web, mobile apps, Windows desktop, and automated cloud systems.'

  const defaultServices: ServiceItem[] = [
    {
      title: 'Website Development',
      desc: 'High-speed corporate sites, portfolio layouts, landing channels, and WooCommerce/Shopify architectures.',
      href: '/services'
    },
    {
      title: 'Custom Software Development',
      desc: 'Proprietary CRM, ERP, client dashboards, inventory managers, and custom SaaS infrastructures.',
      href: '/services'
    },
    {
      title: 'Android & Mobile App Development',
      desc: 'Native Android (Kotlin) & cross-platform iOS mobile apps with offline sync, push notifications & Play Store deployment.',
      href: '/services'
    },
    {
      title: 'Windows Desktop App Development',
      desc: 'High-performance C# .NET, WinUI 3 & WPF desktop software applications for POS, billing & offline system management.',
      href: '/services'
    },
    {
      title: 'Business Automation',
      desc: 'Custom workflow automations, WhatsApp notifications integrations, reporting logs, and API syncs.',
      href: '/services'
    },
    {
      title: 'Technical SEO',
      desc: 'Semantic markup mapping, Core Web Vitals optimizations, keyword targets, and ranking audits.',
      href: '/services'
    }
  ]

  const services = (content?.items && content.items.length >= 4) ? content.items : defaultServices

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

        {/* Grid panel: 3-Column layout on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden p-8 rounded-3xl bg-[#080b14] dark:bg-[#080b14] light:bg-white border border-white/10 light:border-slate-200 light:shadow-sm flex flex-col justify-between hover:-translate-y-2 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/15 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              {/* Top Accent Glowing Beam Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="space-y-6">
                <div className="h-12 w-12 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-300 shadow-md">
                  {getServiceIcon(service.title)}
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-display text-2xl font-bold text-white dark:text-white light:text-slate-900 group-hover:text-emerald-400 light:group-hover:text-emerald-600 transition-colors">
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
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
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
