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

  const detailedServices = [
    {
      title: 'Website & Web App Development',
      subtitle: 'High-speed corporate sites, custom React & Next.js applications, e-commerce storefronts, and conversion-focused landing channels built for maximum performance.',
      image: '/web_dev_vector.png',
      imageLeft: false,
      features: [
        'Custom React & Next.js Apps',
        'E-Commerce & Storefronts',
        'UI / UX & Responsive Design',
        'High-Speed Corporate Sites',
        'Conversion Landing Channels',
        'REST API & Backend Integration'
      ],
      href: '/services'
    },
    {
      title: 'Custom Software & SaaS Platforms',
      subtitle: 'Proprietary ERPs, CRMs, client portals, inventory management systems, and scalable cloud SaaS software tailored precisely to your operational workflow.',
      image: '/cloud_storage_vector.png',
      imageLeft: true,
      features: [
        'Proprietary SaaS Systems',
        'ERP & Operations Software',
        'Custom CRM & Client Portals',
        'Inventory & Billing Software',
        'Database & Analytics Dashboards',
        'Cloud Microservices'
      ],
      href: '/services'
    },
    {
      title: 'Android & Native Mobile App Development',
      subtitle: 'Native Android (Kotlin) and mobile applications with offline sync, push notifications, secure local storage, and full Play Store deployment.',
      image: '/digital_marketing_vector.png',
      imageLeft: false,
      features: [
        'Native Android (Kotlin) Apps',
        'iOS & Cross-Platform Mobile',
        'Offline Synchronization',
        'Play Store Deployment',
        'Push Notifications & FCM',
        'Payment Gateway Integrations'
      ],
      href: '/services'
    },
    {
      title: 'Technical SEO & Search Growth',
      subtitle: 'Semantic JSON-LD schema markup, Core Web Vitals speed optimization, site audits, and search engine index management for long-term organic ranking.',
      image: '/seo_analytics_vector.png',
      imageLeft: true,
      features: [
        'Semantic Schema & Rich Snippets',
        'Core Web Vitals Optimization',
        'Technical SEO Code Audits',
        'Google Indexing Setup',
        'Keyword Architecture',
        'Conversion Rate Tuning'
      ],
      href: '/services'
    }
  ]

  return (
    <section className="py-20 relative bg-[#060810] dark:bg-[#060810] light:bg-slate-50 border-b border-white/5 light:border-slate-200 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Title Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto animate-fade-in-up">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 font-display tracking-tight uppercase">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-slate-400 dark:text-slate-400 light:text-slate-600 font-sans font-light leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Detailed Service Rows (Inspired by Futureva Technologies) */}
        <div className="space-y-24">
          {detailedServices.map((service, idx) => (
            <div
              key={idx}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${
                service.imageLeft ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Text & Features Side */}
              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 font-display">
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 light:text-slate-600 font-light leading-relaxed">
                    {service.subtitle}
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#080b14] dark:bg-[#080b14] light:bg-white border border-white/10 light:border-slate-200 shadow-sm"
                    >
                      <div className="h-6 w-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    to={service.href}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-blue-600/30 hover:scale-105"
                  >
                    <span>Read More</span>
                  </Link>
                </div>
              </div>

              {/* Vector Illustration Side */}
              <div className="flex-1 w-full flex items-center justify-center">
                <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-6 flex items-center justify-center group hover:border-blue-500/40 transition-all duration-500 shadow-2xl">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default ServicesGrid
