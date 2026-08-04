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

import SEOHead from '@/components/seo/SEOHead'

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
  liveUrl?: string
  metrics: string[]
  techStack: string[]
  features: string[]
  challenge: string
  solution: string
  results: string[]
}

const portfolioData: PortfolioItem[] = [
  {
    id: 'kirthi-senthil-mahal',
    title: 'Kirthi Senthil Mahal — Premium Wedding Hall & Event Venue',
    category: 'web',
    categoryLabel: 'Web App Engineering',
    client: 'Kirthi Senthil Mahal',
    location: 'Udumalpet, Tamil Nadu, India',
    summary: 'Luxury event venue web portal with interactive availability checking, photo gallery, 1000+ A/C hall capacity showcase, and instant WhatsApp booking.',
    description: 'Designed and engineered a high-converting luxury event venue portal for Kirthi Senthil Mahal in Udumalpet. Built with sub-second mobile performance, Google Reviews integration (⭐ 4.6/5), interactive date availability check, and instant WhatsApp booking webhooks.',
    image: '/kirthi_senthil_mahal.png',
    liveUrl: 'https://kirthi-senthil-mahal.vercel.app/',
    metrics: ['⭐ 4.6/5 Google Rating', '1000+ Guest A/C Hall', 'Sub-Second Load Time'],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'WhatsApp Webhooks'],
    features: [
      'Interactive event date availability checker',
      'High-resolution venue & dining gallery',
      'Direct WhatsApp booking & inquiry webhooks',
      'Tamil language localization toggle',
      'Schema markup for local Google Search indexing'
    ],
    challenge: 'The client needed a modern, elegant web presence to showcase their grand wedding hall, leaf service dining for 250+, and spacious 150+ car parking while converting visitors into direct hall bookings.',
    solution: 'Engineered a luxury glassmorphic web portal with fast mobile rendering, structured local SEO schema, instant venue availability check, and one-click WhatsApp reservation.',
    results: [
      'Achieved sub-second load times on mobile devices across Udumalpet and Tiruppur',
      'Increased direct venue booking inquiries via WhatsApp and online calendar',
      'Featured prominent 189+ Google Reviews social proof badge'
    ]
  },
  {
    id: 'everest-group-honey',
    title: 'Everest Group — Premium Natural Honey & Organic Products',
    category: 'web',
    categoryLabel: 'E-Commerce & Web Engineering',
    client: 'Everest Group of Companies',
    location: 'Pollachi, Tamil Nadu, India',
    summary: 'Organic product & premium natural honey web storefront with wholesale quote requests, product catalog, and natural harvesting showcase.',
    description: 'Engineered a natural organic brand website for Everest Group of Companies in Pollachi. Showcases pure harvested honey, wholesale bulk pricing requests, product catalog browsing, and sustainability practices.',
    image: '/everest_group.png',
    liveUrl: 'https://everest-group-of-companies.vercel.app/',
    metrics: ['100% Pure Natural Honey', 'Wholesale B2B Engine', 'Sub-Second Performance'],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'REST API'],
    features: [
      'Organic product catalog & spec showcase',
      'Instant wholesale B2B quote request system',
      'Multi-language support & dark mode toggle',
      'Pure harvesting & sustainability story',
      'Responsive mobile-first storefront'
    ],
    challenge: 'The brand required a premium, trustworthy digital presence to present naturally harvested Pollachi honey to both direct consumers and wholesale retail buyers.',
    solution: 'Designed an organic, warm-toned web storefront featuring high-converting product pages, automated wholesale quote forms, and lightweight responsive design.',
    results: [
      'Streamlined wholesale quote submission pipeline for bulk buyers',
      'Achieved top 95+ Core Web Vitals performance scores',
      'Delivered an authentic, high-converting digital presence for Pollachi natural honey'
    ]
  },
  {
    id: 'springweb-operations-suite',
    title: 'SpringWeb Operations Suite — Custom CMS & CRM Portal',
    category: 'saas',
    categoryLabel: 'Custom SaaS & CRM',
    client: 'Spring Web Solutions Internal',
    location: 'India',
    summary: 'Centralized administrative control suite featuring visual page layout management, CRM lead pipeline tracking, and live job application portals.',
    description: 'A bespoke multi-tenant administrative engine allowing instant page layout editing, section reordering, dynamic SEO updates, and lead management with role-based auth.',
    image: '/hero_bg_springweb.png',
    liveUrl: 'https://suite.springwebsolutions.in/',
    metrics: ['0ms Page Builder Latency', 'Multi-Tenant Auth', 'Integrated Lead Pipeline'],
    techStack: ['React', 'TypeScript', 'Supabase Auth & RLS', 'Zustand', 'Tailwind CSS'],
    features: [
      'Visual section drag-and-toggle page builder',
      'Real-time CRM lead status pipeline',
      'Job postings & candidate application reviewer',
      'Blog & Knowledge Base CMS publishing suite',
      'Role-based granular access control (RLS)'
    ],
    challenge: 'Managing client website content, job postings, and lead submissions across multiple tools created fragmented data and slow update cycles.',
    solution: 'Architected a unified custom Operations Suite providing single-pane-of-glass management for content, CRM, career portals, and analytics.',
    results: [
      'Enabled 0ms instant content updates across client sites',
      'Centralized all lead management into a single real-time CRM dashboard',
      'Streamlined candidate recruitment and application processing'
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
      <SEOHead
        title="Client Portfolio & Web Engineering Case Studies | Spring Web Solutions"
        description="Browse our portfolio of completed websites, enterprise ERP/CRM portals, e-commerce stores, and mobile applications developed for clients in Udumalpet, Tamil Nadu, India & worldwide."
      />
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
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white dark:text-white light:text-slate-900 uppercase">
              Real-World <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">Software Projects</span>
            </h1>

            <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-base sm:text-lg max-w-3xl mx-auto font-light leading-relaxed">
              Explore live platforms, event venues, e-commerce storefronts, and enterprise SaaS suites engineered by Spring Web Solutions.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'web', label: 'Web Applications' },
                { id: 'saas', label: 'SaaS & Custom CRM' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-105'
                      : 'bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 light:border-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-emerald-400 light:hover:text-emerald-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* ── Portfolio Grid Section ── */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative rounded-3xl bg-[#080b14] dark:bg-[#080b14] light:bg-white border border-white/10 light:border-slate-200 overflow-hidden flex flex-col hover:border-emerald-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500"
                >
                  {/* Card Image Banner */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080b14] via-transparent to-transparent opacity-80" />
                    
                    {/* Live URL Pill if available */}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-all cursor-pointer z-10"
                      >
                        <span>Live Site</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-7 space-y-6 flex-1 flex flex-col justify-between relative z-10">
                    
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

                    {/* Tech Stack Pills & Action Buttons */}
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>Visit Live</span>
                            <ExternalLink size={13} />
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedProject(project)}
                          className={`py-3 px-4 rounded-xl bg-white/5 dark:bg-white/5 light:bg-slate-100 hover:bg-emerald-500 hover:text-slate-950 dark:hover:bg-emerald-500 dark:hover:text-slate-950 light:hover:bg-emerald-500 light:hover:text-white border border-white/10 light:border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-200 dark:text-slate-200 light:text-slate-800 transition-all duration-300 flex items-center justify-center gap-1.5 group/btn cursor-pointer ${
                            !project.liveUrl ? 'col-span-2' : ''
                          }`}
                        >
                          <span>Case Study</span>
                          <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
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
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1 hover:bg-emerald-400 transition-colors ml-auto"
                    >
                      <span>Visit Live Website</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
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
