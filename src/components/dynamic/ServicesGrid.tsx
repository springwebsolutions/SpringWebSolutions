import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Globe, Cpu, Smartphone, Monitor, Activity, Layers, Bot, Send, Zap } from 'lucide-react'
import AnimatedBackground from '../ui/AnimatedBackground'
import TiltSpotlightCard from '../ui/TiltSpotlightCard'
import ArchitectureVisualizer from '../interactive/ArchitectureVisualizer'

interface ServiceItem {
  title: string
  desc: string
  href: string
  imageAlt?: string
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
  if (t.includes('trading') || t.includes('quotex') || t.includes('bot')) return <Bot className="text-emerald-400" size={24} />
  if (t.includes('telegram') || t.includes('signal')) return <Send className="text-indigo-400" size={24} />
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
      subtitle: 'High-speed corporate websites, React & Next.js web applications, e-commerce storefronts, and conversion portals for businesses in Udumalpet, Tamil Nadu, India, and worldwide.',
      image: '/web_dev_vector.png',
      imageAlt: 'Custom Website and Web App Development by Spring Web Solutions, Udumalpet — High-Speed React & Next.js Engineering',
      imageLeft: false,
      features: [
        'Custom Web Applications & Portals',
        'E-Commerce & Storefront Solutions',
        'UI / UX & Responsive Mobile Design',
        'High-Speed Core Web Vitals Performance',
        'REST API & Backend Database Sync',
        'Statewide & Global Scaling Architecture'
      ],
      href: '/contact'
    },
    {
      title: 'Custom ERP & CRM Systems',
      subtitle: 'Tailor-made Enterprise Resource Planning (ERP) and Customer Relationship Management (CRM) software for inventory tracking, automated billing, client lead pipelines, and real-time WhatsApp analytics.',
      image: '/cloud_storage_vector.png',
      imageAlt: 'Custom ERP and CRM Dashboard Software Built by Spring Web Solutions Udumalpet — Inventory, Billing & Lead Automation',
      imageLeft: true,
      features: [
        'Custom CRM & Client Portal Software',
        'ERP Operations & Automated Billing',
        'Inventory & Stock Management Tools',
        'WhatsApp Automated Notification Bots',
        'Business Intelligence & Analytics Dashboards',
        'Global Multi-Currency & Cloud Infrastructure'
      ],
      href: '/contact'
    },
    {
      title: 'Android, iOS & Windows App Development',
      subtitle: 'Native Android mobile apps (Kotlin/Flutter), iOS applications, and high-speed C# .NET Windows desktop software built for offline reliability, billing, and retail operations.',
      image: '/digital_marketing_vector.png',
      imageAlt: 'Android iOS and Windows Desktop App Development by Spring Web Solutions Udumalpet — Kotlin, Flutter & C# .NET Engineering',
      imageLeft: false,
      features: [
        'Native Android (Kotlin) App Development',
        'iOS & Cross-Platform Flutter Mobile Apps',
        'C# .NET & WinUI 3 Windows Desktop Apps',
        'Offline Synchronization & Local Database',
        'Google Play Store & App Store Publishing',
        'Push Notifications & Payment Gateway Sync'
      ],
      href: '/contact'
    },
    {
      title: 'Technical SEO & Search Dominance',
      subtitle: 'Semantic JSON-LD schema markup, AEO answer engine optimization, Core Web Vitals speed tuning, and search index management for long-term organic rankings.',
      image: '/seo_analytics_vector.png',
      imageAlt: 'Technical SEO and AEO Search Optimization Analytics by Spring Web Solutions Udumalpet — Local, National & International Rankings',
      imageLeft: true,
      features: [
        'Local SEO (Udumalpet, Tiruppur, Coimbatore)',
        'Statewide SEO Ranking (Tamil Nadu)',
        'Pan-India & National SEO Campaigns',
        'International & Global AEO Optimization',
        'Semantic JSON-LD Rich Snippets',
        'AI Search Engine (ChatGPT/Perplexity/Gemini) Indexing'
      ],
      href: '/contact'
    },
    {
      title: 'Algorithmic Trading & Quotex Signal Bots',
      subtitle: 'Institutional-grade automated trading bots for Quotex, Pocket Option, Binance, MT4/MT5, and TradingView PineScript webhooks with sub-80ms execution.',
      image: '/cloud_storage_vector.png',
      imageAlt: 'Algorithmic Trading Bot and Quotex Signal Automation by Spring Web Solutions — TradingView Webhooks, Binary Execution & Risk Management',
      imageLeft: false,
      features: [
        'Quotex & Pocket Option Automated Execution',
        'TradingView PineScript Alert Webhooks',
        'Sub-80ms Ultra-Low Latency Order Routing',
        'Smart Martingale & Capital Protection Safeguards',
        'Telegram Signal Scrapers & Trade Copiers',
        'MetaTrader MQL4/MQL5 Expert Advisors (EAs)'
      ],
      href: '/trading-bot-development'
    },
    {
      title: 'Custom Telegram Bots & Workflow Automation',
      subtitle: 'Monetize trading communities with automated VIP paywalls (Razorpay & Crypto USDT), signal auto-forwarders, Telegram Mini Apps, and WhatsApp Cloud API bots.',
      image: '/web_dev_vector.png',
      imageAlt: 'Custom Telegram Bot Development and Business Workflow Automation by Spring Web Solutions — VIP Paywalls, Signal Copiers & Telegram Mini Apps',
      imageLeft: true,
      features: [
        'Automated VIP Paywall (Razorpay, UPI & USDT Crypto)',
        'Telegram Signal Auto-Forwarder & Formatting',
        'Telegram Mini Apps (React / Next.js inside Telegram)',
        'WhatsApp Cloud Business API Customer Bots',
        'Automated Invoicing & GST Receipt Dispatch',
        '24/7 Lead Capture & CRM Instant Alerts'
      ],
      href: '/telegram-bot-development'
    }
  ]

  return (
    <section className="py-20 relative bg-[#060810] dark:bg-[#060810] light:bg-slate-50 border-b border-white/5 light:border-slate-200 transition-colors duration-300 overflow-hidden">
      <AnimatedBackground accent="indigo" particleCount={20} />
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 space-y-24 relative z-10">
        
        {/* Title Block */}
        <div className="text-center space-y-4 max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 text-xs font-bold uppercase tracking-widest font-display shadow-lg shadow-emerald-500/10">
            <Zap size={14} className="text-emerald-400" />
            <span>Full-Stack Solutions Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 font-display tracking-tight uppercase">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-slate-400 dark:text-slate-400 light:text-slate-600 font-sans font-light leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* ── 6-Flagship Services Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Quotex & Algorithmic Trading Bots',
              desc: 'Sub-80ms automated trade execution, TradingView PineScript alert webhooks, martingale risk safeguards, and MT4/MT5 expert advisors.',
              icon: Bot,
              color: 'text-emerald-400',
              borderColor: 'hover:border-emerald-500/50',
              badge: 'Fast Reaction (<80ms)',
              href: '/trading-bot-development'
            },
            {
              title: 'Telegram Bots & VIP Paywalls',
              desc: 'Automated signal forwarders, Razorpay & Crypto (USDT TRC20) subscription paywalls, automated invite links, and Telegram Mini Apps.',
              icon: Send,
              color: 'text-indigo-400',
              borderColor: 'hover:border-indigo-500/50',
              badge: '0% Middleman Fees',
              href: '/telegram-bot-development'
            },
            {
              title: 'Business Workflow Automation',
              desc: 'Official WhatsApp Cloud API customer bots, automated GST invoice dispatch, multi-system database sync, and B2B web scrapers.',
              icon: Layers,
              color: 'text-teal-400',
              borderColor: 'hover:border-teal-500/50',
              badge: 'Zero Manual Work',
              href: '/workflow-automation-bots'
            },
            {
              title: 'High-Speed Web Applications',
              desc: 'React 19 & Next.js 15 corporate websites, high-converting e-commerce storefronts, and client portals with 100/100 Core Web Vitals.',
              icon: Globe,
              color: 'text-emerald-500',
              borderColor: 'hover:border-emerald-500/50',
              badge: '< 1s Page Load',
              href: '/contact'
            },
            {
              title: 'Android, iOS & Windows Apps',
              desc: 'Native Android Kotlin apps, cross-platform Flutter mobile apps, and high-performance C# .NET Windows desktop billing software.',
              icon: Smartphone,
              color: 'text-purple-400',
              borderColor: 'hover:border-purple-500/50',
              badge: 'Offline Synchronized',
              href: '/contact'
            },
            {
              title: 'Custom ERP & Operations CRM',
              desc: 'Tailor-made multi-branch inventory tracking, automated billing, client lead management, and live WhatsApp sales sync.',
              icon: Cpu,
              color: 'text-amber-400',
              borderColor: 'hover:border-amber-500/50',
              badge: 'Enterprise Security',
              href: '/contact'
            }
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <Link
                key={idx}
                to={item.href}
                className={`group p-7 rounded-3xl bg-[#080b14]/90 dark:bg-[#080b14]/90 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 transition-all duration-300 ${item.borderColor} hover:-translate-y-1.5 hover:shadow-2xl shadow-lg relative overflow-hidden flex flex-col justify-between space-y-6`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 text-slate-400 dark:text-slate-400 light:text-slate-600">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 font-display group-hover:text-emerald-400 dark:group-hover:text-emerald-400 light:group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 dark:text-emerald-400 light:text-emerald-700 font-display uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>Explore Architecture</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            )
          })}
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
                    aria-label={`Explore ${service.title} Solution & Request Quote`}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-blue-600/30 hover:scale-105"
                  >
                    <span>Explore {service.title} Solution</span>
                  </Link>
                </div>
              </div>

              {/* Vector Illustration Side */}
              <div className="flex-1 w-full flex items-center justify-center">
                <div className="relative w-full max-w-lg group">

                  {/* Ambient glow layer behind the frame */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-40 blur-3xl scale-90 transition-all duration-700 group-hover:opacity-60 group-hover:scale-95"
                    style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.35) 0%, rgba(16,185,129,0.15) 60%, transparent 100%)' }}
                  />

                  {/* Main browser-frame card with 3D cursor-aware tilt & spotlight beam */}
                  <TiltSpotlightCard className="rounded-2xl">
                    <div className="relative rounded-2xl overflow-hidden border border-white/15 dark:border-white/15 light:border-slate-300 shadow-2xl shadow-black/50 dark:shadow-black/50 light:shadow-slate-300/50 group-hover:border-emerald-500/40 transition-all duration-500 group-hover:shadow-emerald-500/20 group-hover:shadow-2xl">

                      {/* ── Browser title bar ── */}
                      <div className="flex items-center gap-2 px-4 h-9 bg-[#0d1117] dark:bg-[#0d1117] light:bg-slate-100 border-b border-white/10 dark:border-white/10 light:border-slate-200">
                        {/* Traffic-light dots */}
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                        {/* Fake URL bar */}
                        <div className="flex-1 mx-3 h-4 rounded-full bg-white/8 dark:bg-white/8 light:bg-slate-200 flex items-center px-2">
                          <span className="text-[9px] text-slate-500 dark:text-slate-500 light:text-slate-400 truncate">springwebsolutions.in</span>
                        </div>
                      </div>

                      {/* ── Illustration canvas (intentional white) ── */}
                      <div className="relative bg-white aspect-[4/3] flex items-center justify-center overflow-hidden p-6">
                        {/* Subtle top gradient overlay so white doesn't hard-cut against dark bar */}
                        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-slate-50/60 to-transparent pointer-events-none" />
                        <img
                          src={service.image}
                          alt={service.imageAlt || `Custom ${service.title} Service by Spring Web Solutions, Udumalpet, Tamil Nadu, India`}
                          width={600}
                          height={450}
                          loading="lazy"
                          decoding="async"
                          className="relative z-10 w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        {/* Bottom vignette so img blends down softly */}
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
                      </div>

                      {/* ── Bottom status bar ── */}
                      <div className="h-6 bg-[#0d1117] dark:bg-[#0d1117] light:bg-slate-100 border-t border-white/10 dark:border-white/10 light:border-slate-200 flex items-center px-4 gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest">springwebsolutions.in</span>
                      </div>
                    </div>
                  </TiltSpotlightCard>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* ── Interactive Architecture Pipeline Visualizer ── */}
        <div className="pt-8">
          <ArchitectureVisualizer />
        </div>

      </div>
    </section>
  )
}

export default ServicesGrid
