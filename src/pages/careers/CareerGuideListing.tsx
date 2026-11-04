import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCareersStore } from '@/stores/careersStore'
import { CareersNavbar } from '@/components/careers/CareersNavbar'
import { CareersFooter } from '@/components/careers/CareersFooter'
import { AdBanner } from '@/components/careers/AdBanner'
import { CareersSeo } from '@/components/seo/CareersSeo'
import { 
  BookOpen, Sparkles, ArrowRight, User, Search, 
  Layers, Code2, Server, Database, ShieldCheck, Globe, DollarSign 
} from 'lucide-react'

type CategoryFilter = 'all' | 'web' | 'backend' | 'data-ai' | 'devops-sec' | 'remote'

interface CategoryTab {
  id: CategoryFilter
  label: string
  icon: any
  countMatcher: (slug: string) => boolean
}

const CATEGORY_TABS: CategoryTab[] = [
  {
    id: 'all',
    label: 'All IT Roles',
    icon: Layers,
    countMatcher: () => true
  },
  {
    id: 'web',
    label: 'Web & Full-Stack',
    icon: Code2,
    countMatcher: (s) => s.includes('full-stack') || s.includes('frontend') || s.includes('mobile')
  },
  {
    id: 'backend',
    label: 'Backend & Cloud',
    icon: Server,
    countMatcher: (s) => s.includes('backend') || s.includes('system-design') || s.includes('cloud-architect')
  },
  {
    id: 'data-ai',
    label: 'Data & Applied AI',
    icon: Database,
    countMatcher: (s) => s.includes('data-engineer') || s.includes('machine-learning') || s.includes('ai-engineering')
  },
  {
    id: 'devops-sec',
    label: 'DevOps, Security & QA',
    icon: ShieldCheck,
    countMatcher: (s) => s.includes('devops') || s.includes('cybersecurity') || s.includes('sdet-qa')
  },
  {
    id: 'remote',
    label: 'Remote Contracts',
    icon: Globe,
    countMatcher: (s) => s.includes('remote')
  }
]

const getRoleQuickBadge = (slug: string) => {
  if (slug.includes('frontend')) return { level: 'Mid to Staff UI', comp: '₹16L–₹35L+' }
  if (slug.includes('backend')) return { level: 'Mid to Staff API', comp: '₹20L–₹45L+' }
  if (slug.includes('cloud-architect')) return { level: 'Cloud Solutions', comp: '₹24L–₹55L+' }
  if (slug.includes('data-engineer')) return { level: 'Data Architect', comp: '₹22L–₹48L+' }
  if (slug.includes('machine-learning')) return { level: 'Staff ML Engineer', comp: '₹24L–₹50L+' }
  if (slug.includes('ai-engineering')) return { level: 'Applied AI / RAG', comp: '₹20L–₹48L+' }
  if (slug.includes('cybersecurity')) return { level: 'Senior AppSec', comp: '₹20L–₹45L+' }
  if (slug.includes('sdet-qa')) return { level: 'SDET / Quality SRE', comp: '₹16L–₹35L+' }
  if (slug.includes('mobile')) return { level: 'Mobile Architect', comp: '₹18L–₹40L+' }
  if (slug.includes('devops')) return { level: 'DevOps / SRE Lead', comp: '₹22L–₹50L+' }
  if (slug.includes('system-design')) return { level: 'Staff Architect', comp: '₹28L–₹65L+' }
  if (slug.includes('remote')) return { level: 'Global Contractor', comp: '$5k–$14k/mo' }
  return { level: 'Full-Stack Web', comp: '₹14L–₹35L+' }
}

export const CareerGuideListing: React.FC = () => {
  const { guides, fetchGuides } = useCareersStore()
  const [activeTab, setActiveTab] = useState<CategoryFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchGuides()
  }, [])

  const publishedGuides = useMemo(() => {
    return guides.filter(g => g.status === 'published')
  }, [guides])

  const filteredGuides = useMemo(() => {
    return publishedGuides.filter(g => {
      // 1. Category tab filter
      if (activeTab !== 'all') {
        const tabDef = CATEGORY_TABS.find(t => t.id === activeTab)
        if (tabDef && !tabDef.countMatcher(g.slug)) {
          return false
        }
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = g.title.toLowerCase().includes(q)
        const matchExcerpt = (g.excerpt || '').toLowerCase().includes(q)
        const matchTags = (g.tags || []).some(t => t.toLowerCase().includes(q))
        return matchTitle || matchExcerpt || matchTags
      }

      return true
    })
  }, [publishedGuides, activeTab, searchQuery])

  return (
    <div className="min-h-screen bg-[#040509] text-white flex flex-col font-sans">
      <CareersSeo 
        title="13 Production IT Career Roadmaps (2026 Edition) | SpringWeb Careers"
        description="Comprehensive 6-phase engineering roadmaps for Frontend, Backend, Full-Stack, System Architecture, DevOps/SRE, Cloud, Data, ML, Applied AI, Cybersecurity, SDET, and Remote Software Contracts."
        canonicalUrl="https://careers.springwebsolutions.in/career-guides"
      />
      <CareersNavbar />

      <main className="flex-grow py-10 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-display">
              <BookOpen size={14} />
              <span>Production Engineering Roadmaps • 2026 Edition</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-display uppercase">
              Educational Career Guides &amp; Roadmaps
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
              Exhaustive month-by-month roadmaps, real-world compensation benchmarks, production war stories, runnable code snippets, and system design decision matrices for all 13 core software engineering disciplines.
            </p>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="space-y-4">
            {/* Search Input Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roadmaps by role, tech stack (e.g. React 19, Kafka, PyTorch, Kubernetes)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#080b14] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500/50 transition-colors shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
              {CATEGORY_TABS.map((tab) => {
                const TabIcon = tab.icon
                const isActive = activeTab === tab.id
                const count = tab.id === 'all' 
                  ? publishedGuides.length 
                  : publishedGuides.filter(g => tab.countMatcher(g.slug)).length

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                        : 'bg-[#080b14] text-slate-400 border-white/10 hover:border-emerald-500/30 hover:text-slate-200'
                    }`}
                  >
                    <TabIcon size={14} />
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-white/5 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <AdBanner zoneId="header_leaderboard" />

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-white/5 pb-2">
            <span>Showing <strong className="text-white">{filteredGuides.length}</strong> of {publishedGuides.length} Comprehensive Roadmaps</span>
            {searchQuery && (
              <span className="text-emerald-400">Filtered by query: "{searchQuery}"</span>
            )}
          </div>

          {/* Guides Grid */}
          {filteredGuides.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#080b14] border border-white/10 space-y-3">
              <p className="text-sm text-slate-400">No career roadmaps match your search criteria.</p>
              <button
                onClick={() => { setActiveTab('all'); setSearchQuery('') }}
                className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredGuides.map((guide) => {
                const badge = getRoleQuickBadge(guide.slug)
                return (
                  <Link
                    key={guide.id}
                    to={`/career-guides/${guide.slug}`}
                    className="rounded-3xl bg-[#080b14] border border-white/10 hover:border-emerald-500/40 hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between group shadow-xl"
                  >
                    <div>
                      {guide.cover_image && (
                        <div className="aspect-[16/9] w-full overflow-hidden bg-[#04060c] border-b border-white/10 relative">
                          <img
                            src={guide.cover_image}
                            alt={guide.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                            <DollarSign size={11} />
                            <span>{badge.comp}</span>
                          </div>
                        </div>
                      )}

                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-display">
                            {guide.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {badge.level}
                          </span>
                        </div>

                        <h2 className="text-lg sm:text-xl font-bold text-white font-display group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight">
                          {guide.title}
                        </h2>

                        <p className="text-xs text-slate-400 font-light leading-relaxed line-clamp-3">
                          {guide.excerpt}
                        </p>

                        {/* Tag pills */}
                        {guide.tags && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            {guide.tags.slice(0, 3).map((tag, tIdx) => (
                              <span key={tIdx} className="text-[10px] font-mono text-slate-500 bg-white/[0.02] border border-white/5 px-2 py-0.5 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex items-center justify-between text-xs text-slate-500 border-t border-white/5 mt-4">
                      <span className="flex items-center gap-1 text-[11px]">
                        <User size={12} className="text-slate-400" />
                        <span>{guide.author}</span>
                      </span>
                      <span className="text-emerald-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 text-xs">
                        <span>Explore Roadmap</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

        </div>
      </main>

      <CareersFooter />
    </div>
  )
}
