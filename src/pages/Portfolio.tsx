import React, { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import { Link } from 'react-router-dom'
import {
  ExternalLink,
  Code2,
  Cpu,
  Smartphone,
  Monitor,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
  Globe,
  X,
  Clock,
  TrendingUp,
  Award,
  ChevronRight
} from 'lucide-react'

interface PortfolioItem {
  id: string
  title: string
  category: 'web' | 'mobile' | 'desktop' | 'saas' | 'seo'
  categoryLabel: string
  client: string
  location: string
  summary: string
  description: string
  image: string
  metrics: string[]
  techStack: string[]
  features: string[]
  challenge: string
  solution: string
  results: string[]
}

const portfolioData: PortfolioItem[] = [
  {
    id: 'industrial-erp-crm',
    title: 'Manufacturing ERP & Cloud Inventory Suite',
    category: 'saas',
    categoryLabel: 'Custom SaaS & ERP',
    client: 'Sri Lakshmi Tex Mills',
    location: 'Udumalpet, India',
    summary: 'Cloud-based manufacturing ERP with real-time barcode inventory tracking, automated dispatch notes, and instant WhatsApp manager alerts.',
    description: 'A multi-department enterprise resource planning system connecting floor managers, raw material inventory, dispatch logistics, and accounts to a unified PostgreSQL database with sub-second response times.',
    image: '/cloud_storage_vector.png',
    metrics: ['12 Hrs/Wk Saved Per Manager', '0 Data Re-entry Errors', '99.99% Database SLA'],
    techStack: ['React 19', 'TypeScript', 'Node.js', 'Supabase SQL', 'WhatsApp Webhooks'],
    features: [
      'Real-time barcode inventory scanning',
      'Instant WhatsApp dispatch webhooks',
      'Role-based multi-user permissions',
      'Automated PDF invoice generation',
      'Offline-first offline fallback cache'
    ],
    challenge: 'The client relied on manual paper logbooks for raw material tracking, causing 12+ hours per week in data re-entry waste and frequent stock count mismatches.',
    solution: 'Engineered a custom cloud ERP with mobile barcode scanning, automated SQL transaction validation, and real-time lead/dispatch webhooks.',
    results: [
      'Eliminated 100% of manual paper log entries',
      'Reduced order fulfillment lag from 24 hours to 15 minutes',
      'Full audit log transparency across all floor managers'
    ]
  },
  {
    id: 'nextjs-ecommerce-portal',
    title: 'High-Speed B2B E-Commerce & Distribution Portal',
    category: 'web',
    categoryLabel: 'Web App Engineering',
    client: 'Apex Industrial Tools',
    location: 'Coimbatore, India',
    summary: 'Ultra-fast Next.js 15 e-commerce storefront with custom product configurator, instant search indexing, and Razorpay payment gateways.',
    description: 'Engineered for sub-second page loads and 100/100 Core Web Vitals. Features instant client quote requests, tiered B2B wholesale pricing, and automated inventory sync.',
    image: '/web_dev_vector.png',
    metrics: ['98/100 Core Web Vitals', '0.6s Page Load Time', '3.4x Conversion Growth'],
    techStack: ['Next.js 15', 'React 19', 'Tailwind CSS', 'Razorpay API', 'Algolia Search'],
    features: [
      'Sub-second page response guarantee',
      'Custom 3D product spec configurator',
      'Tiered bulk wholesale pricing engine',
      'Instant schema markup for Google Search',
      'Automated order confirmation SMS & Email'
    ],
    challenge: 'Previous legacy WordPress site loaded in 5.8 seconds, causing massive bounce rates and customer frustration during bulk ordering.',
    solution: 'Rebuilt the frontend using Next.js 15 App Router with server-side rendering, CDN edge caching, and lightweight Tailwind styling.',
    results: [
      'Page speed improved from 5.8s to 0.6s',
      '340% increase in organic online B2B quote submissions',
      'Achieved 100/100 Performance & SEO scores on Google PageSpeed Insights'
    ]
  },
  {
    id: 'android-logistics-app',
    title: 'Native Android Fleet & Logistics Tracker',
    category: 'mobile',
    categoryLabel: 'Native Mobile App',
    client: 'Veloce Logistics India',
    location: 'Tamil Nadu, India',
    summary: 'Native Kotlin Android application with offline GPS logging, push dispatch alerts, and Play Store deployment.',
    description: 'Built for field drivers operating in low-connectivity industrial zones. Automatically caches trip data locally and syncs with central cloud servers upon reconnecting.',
    image: '/digital_marketing_vector.png',
    metrics: ['100% Offline Data Sync', 'Play Store Verified', '4.9/5 Driver Satisfaction'],
    techStack: ['Kotlin', 'Android SDK', 'Room DB', 'Firebase FCM', 'REST Webhooks'],
    features: [
      'Offline-first Room database sync',
      'Real-time GPS route tracking',
      'Instant push dispatch notifications',
      'Digital signature proof-of-delivery',
      'Optimized battery & background usage'
    ],
    challenge: 'Field drivers frequently lost network connectivity in remote routes, leading to lost delivery statuses and customer dispute delays.',
    solution: 'Developed a high-performance native Kotlin app with Room local database caching and background background job queuing.',
    results: [
      'Zero delivery log data loss across 50,000+ completed trips',
      'Real-time SMS updates sent to end clients upon delivery',
      'Seamless Play Store deployment & automated background updates'
    ]
  },
  {
    id: 'windows-billing-desktop-suite',
    title: 'Windows Desktop Billing & Hardware Terminal',
    category: 'desktop',
    categoryLabel: 'Windows Desktop Software',
    client: 'Kovai Retail Superstores',
    location: 'Tamil Nadu, India',
    summary: 'Native C# WinUI 3 desktop application with thermal barcode printer integration, offline execution, and single-click MSI installation.',
    description: 'High-speed desktop checkout software built to process 50+ items per minute. Integrates directly with POS cash drawers, weight scales, and local SQLite databases.',
    image: '/seo_analytics_vector.png',
    metrics: ['< 50ms Barcode Scan Speed', '100% Offline Capability', 'Single-Click MSI Installer'],
    techStack: ['C# .NET 8', 'WinUI 3', 'SQLite', 'ESC/POS Thermal API', 'MSI Builder'],
    features: [
      'High-speed ESC/POS thermal printing',
      'Direct USB & Serial hardware sync',
      'Zero cloud dependency offline mode',
      'Daily automated encrypted database backup',
      'Single-click MSI enterprise installer'
    ],
    challenge: 'Existing web-based billing software crashed whenever internet connectivity dropped, halting supermarket checkout lines.',
    solution: 'Engineered a standalone C# WinUI 3 desktop application operating directly on local hardware with cloud sync when online.',
    results: [
      '100% uptime regardless of internet outages',
      'Checkout speed increased by 300% per customer counter',
      'Single-click enterprise installer deployed across 24 terminal PCs'
    ]
  },
  {
    id: 'technical-seo-schema-engine',
    title: 'Enterprise Technical SEO & Structured Indexing',
    category: 'seo',
    categoryLabel: 'Technical SEO & Indexing',
    client: 'Global Health Care Tech',
    location: 'Global',
    summary: 'Automated JSON-LD schema markup, canonical URL architecture, Core Web Vitals optimization, and Google Search Console indexing.',
    description: 'A comprehensive technical SEO engineering overhaul restructuring multi-lingual web portals for instant indexing, rich snippet eligibility, and top SERP visibility.',
    image: '/cloud_storage_vector.png',
    metrics: ['+220% Organic Traffic', '100% Rich Snippet Indexing', 'Top 3 SERP Rankings'],
    techStack: ['JSON-LD Schema', 'Google Search Console', 'Core Web Vitals', 'Next.js SSG'],
    features: [
      'Custom JSON-LD schema generation',
      'Canonical URL & sitemap architecture',
      'Instant Google Indexing API integration',
      'Core Web Vitals LCP/CLS optimization',
      'Automated 404 & redirect monitoring'
    ],
    challenge: 'The portal had thousands of pages unindexed by Google due to dynamic JavaScript rendering bloat and missing schema markups.',
    solution: 'Implemented static site generation (SSG) with structured JSON-LD schema, automated XML sitemaps, and speed optimization.',
    results: [
      '220% increase in organic search traffic within 90 days',
      'Achieved Rich Snippet star ratings in Google search results',
      '100% index coverage verified in Google Search Console'
    ]
  }
]

export const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null)

  const filteredProjects = activeCategory === 'all'
    ? portfolioData
    : portfolioData.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#040509] dark:bg-[#040509] light:bg-slate-50 text-slate-900 dark:text-white transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-1 relative overflow-hidden">
        {/* ── Background Animation System ── */}
        <AnimatedBackground accent="emerald" particleCount={22} beams geoShapes />

        {/* ── Hero Header ── */}
        <section className="relative py-20 lg:py-28 border-b border-white/10 light:border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 relative z-10 text-center">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 light:text-emerald-700 text-xs font-extrabold uppercase tracking-widest font-display shadow-lg">
              <Sparkles size={14} className="text-emerald-400 light:text-emerald-600 animate-spin-slow" />
              <span>ENGINEERED PORTFOLIO &amp; WORK SHOWCASE</span>
            </div>

            {/* H1 Heading */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight font-display text-white dark:text-white light:text-slate-900 leading-none max-w-5xl mx-auto">
              Engineering Excellence <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 light:from-emerald-600 light:to-indigo-600">
                In Action
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 dark:text-slate-300 light:text-slate-600 max-w-3xl mx-auto font-sans font-light leading-relaxed">
              Explore high-performance React &amp; Next.js applications, native Kotlin Android mobile apps, C# Windows desktop software, and automated cloud CRM platforms engineered by SpringWeb Solutions.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400 light:text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>100% Full Source Code Ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-indigo-400" />
                <span>Sub-Second Page Load Times</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-teal-400" />
                <span>99.9% Production Uptime SLA</span>
              </div>
            </div>

          </div>
        </section>

        {/* ── Category Filter Tabs ── */}
        <section className="py-8 border-b border-white/5 light:border-slate-200 bg-[#060810]/60 dark:bg-[#060810]/60 light:bg-white/80 backdrop-blur-md sticky top-16 z-30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center flex-wrap gap-2.5">
              {[
                { id: 'all', label: 'All Projects', icon: Layers },
                { id: 'web', label: 'Web Applications', icon: Globe },
                { id: 'mobile', label: 'Android Mobile Apps', icon: Smartphone },
                { id: 'desktop', label: 'Windows Desktop Software', icon: Monitor },
                { id: 'saas', label: 'Custom SaaS & ERPs', icon: Cpu },
                { id: 'seo', label: 'Technical SEO', icon: Code2 }
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeCategory === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer font-display ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
                        : 'bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 text-slate-400 dark:text-slate-300 light:text-slate-700 hover:text-white light:hover:text-emerald-600 hover:border-emerald-500/30'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Portfolio Projects Grid ── */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-3xl bg-[#080b14] dark:bg-[#080b14] light:bg-white border border-white/10 light:border-slate-200 light:shadow-md hover:border-emerald-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Browser Mockup Image Container */}
                  <div className="relative bg-[#0d1117] light:bg-slate-100 border-b border-white/10 light:border-slate-200 overflow-hidden">
                    {/* Browser top dots */}
                    <div className="flex items-center gap-1.5 px-4 h-8 bg-black/40 light:bg-slate-200/80 border-b border-white/5 light:border-slate-200">
                      <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                      <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-[10px] font-mono text-slate-500 light:text-slate-400 truncate">
                        {project.client}
                      </span>
                    </div>

                    <div className="relative bg-white aspect-[16/10] p-6 flex items-center justify-center overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-7 space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      
                      {/* Category Badge & Location */}
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 light:text-emerald-700 font-semibold uppercase">
                          {project.categoryLabel}
                        </span>
                        <span className="text-slate-500 light:text-slate-400">
                          {project.location}
                        </span>
                      </div>

                      {/* Title & Summary */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 font-display group-hover:text-emerald-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 font-light leading-relaxed">
                          {project.summary}
                        </p>
                      </div>

                      {/* Highlights Pill Badge Array */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.metrics.map((metric, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-md bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 text-[11px] font-mono text-emerald-400 light:text-emerald-700 font-semibold"
                          >
                            ⚡ {metric}
                          </span>
                        ))}
                      </div>

                    </div>

                    {/* Tech Stack Pills & Action Button */}
                    <div className="pt-4 border-t border-white/5 light:border-slate-100 space-y-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 text-[10px] font-mono text-slate-400 light:text-slate-600"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="w-full py-3 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 hover:bg-emerald-500 hover:text-slate-950 dark:hover:bg-emerald-500 dark:hover:text-slate-950 light:hover:bg-emerald-500 light:hover:text-white border border-white/10 light:border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-200 dark:text-slate-200 light:text-slate-800 transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer"
                      >
                        <span>View Architecture Case Study</span>
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Case Study Detail Modal ── */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#080b14] dark:bg-[#080b14] light:bg-white border border-white/15 light:border-slate-200 shadow-2xl p-6 sm:p-10 space-y-8 text-slate-900 dark:text-white">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="space-y-4 pr-10">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase">
                    {selectedProject.categoryLabel}
                  </span>
                  <span className="text-slate-400">Client: <strong>{selectedProject.client}</strong> ({selectedProject.location})</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold font-display">
                  {selectedProject.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 dark:text-slate-300 light:text-slate-600 font-light leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Key Metrics Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                {selectedProject.metrics.map((m, idx) => (
                  <div key={idx} className="space-y-1 text-center sm:text-left">
                    <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Key Benchmark</div>
                    <div className="text-lg font-bold font-display text-white dark:text-white light:text-slate-900">{m}</div>
                  </div>
                ))}
              </div>

              {/* Challenge vs Solution Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-50 border border-white/10 light:border-slate-200 space-y-3">
                  <h3 className="text-base font-bold text-rose-400 font-display flex items-center gap-2">
                    <Clock size={16} /> Operational Challenge
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed font-light">
                    {selectedProject.challenge}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-slate-50 border border-white/10 light:border-slate-200 space-y-3">
                  <h3 className="text-base font-bold text-emerald-400 font-display flex items-center gap-2">
                    <Zap size={16} /> SpringWeb Architecture Solution
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed font-light">
                    {selectedProject.solution}
                  </p>
                </div>
              </div>

              {/* Results & Key Deliverables */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                  <Award size={18} className="text-emerald-400" /> Measured Business Impact &amp; Results
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedProject.results.map((res, rIdx) => (
                    <div key={rIdx} className="p-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 text-xs font-semibold text-slate-200 dark:text-slate-200 light:text-slate-800 flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Features List */}
              <div className="space-y-4">
                <h3 className="text-base font-bold font-display text-white dark:text-white light:text-slate-900">
                  Engineered Feature Set
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedProject.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer CTAs */}
              <div className="pt-6 border-t border-white/10 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-slate-400">
                  <span>Stack:</span>
                  {selectedProject.techStack.map((tech, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded bg-white/10 text-emerald-400 font-semibold">{tech}</span>
                  ))}
                </div>

                <Link
                  to="/contact"
                  onClick={() => setSelectedProject(null)}
                  className="btn-primary text-xs px-6 py-3 font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  <span>Build Similar Software</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>
          </div>
        )}

        {/* ── Call to Action Banner ── */}
        <section className="py-20 border-t border-white/10 light:border-slate-200">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="p-10 sm:p-14 rounded-3xl bg-[#080b14]/90 dark:bg-[#080b14]/90 light:bg-white border border-white/10 light:border-slate-200 shadow-2xl space-y-6">
              <h2 className="text-3xl sm:text-5xl font-extrabold font-display uppercase tracking-tight">
                Have a Custom Project in Mind?
              </h2>
              <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
                Whether you need a sub-second web portal, native mobile app, custom CRM software, or Windows desktop tool — we build clean, high-performance systems with 100% source code ownership.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Link to="/contact" className="btn-primary text-xs font-bold uppercase tracking-wider px-8 py-3.5 shadow-xl shadow-blue-500/30">
                  <span>Start Free Consultation</span>
                </Link>
                <Link to="/support" className="btn-secondary text-xs font-bold uppercase tracking-wider px-8 py-3.5">
                  <span>Explore Client Desk</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

export default Portfolio
