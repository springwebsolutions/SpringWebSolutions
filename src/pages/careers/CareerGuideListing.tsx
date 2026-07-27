import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCareersStore } from '@/stores/careersStore'
import { CareersNavbar } from '@/components/careers/CareersNavbar'
import { CareersFooter } from '@/components/careers/CareersFooter'
import { AdBanner } from '@/components/careers/AdBanner'
import { BookOpen, Sparkles, ArrowRight, User } from 'lucide-react'

export const CareerGuideListing: React.FC = () => {
  const { guides, fetchGuides } = useCareersStore()

  useEffect(() => {
    fetchGuides()
    document.title = 'Educational Career Guides & Exam Roadmaps | SpringWeb Solutions'
  }, [])

  const publishedGuides = guides.filter(g => g.status === 'published')

  return (
    <div className="min-h-screen bg-[#040509] text-white flex flex-col font-sans">
      <CareersNavbar />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-display">
              <BookOpen size={14} />
              <span>Educational Knowledge Center</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-display uppercase">
              Educational Career Guides &amp; Roadmaps
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
              In-depth articles covering entrance exams, technical interview prep, remote work strategies, and skill roadmaps.
            </p>
          </div>

          <AdBanner zoneId="header_leaderboard" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedGuides.map((guide) => (
              <Link
                key={guide.id}
                to={`/career-guides/${guide.slug}`}
                className="rounded-3xl bg-[#080b14] border border-white/10 hover:border-emerald-500/40 hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-6 space-y-4">
                  <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider w-max">
                    {guide.category}
                  </div>
                  <h2 className="text-xl font-bold text-white font-display group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {guide.title}
                  </h2>
                  <p className="text-xs text-slate-400 font-light leading-relaxed line-clamp-3">
                    {guide.excerpt}
                  </p>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between text-xs text-slate-500 border-t border-white/5 mt-4">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    <span>{guide.author}</span>
                  </span>
                  <span className="text-emerald-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      <CareersFooter />
    </div>
  )
}
