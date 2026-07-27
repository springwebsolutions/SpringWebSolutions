import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCareersStore } from '@/stores/careersStore'
import { CareersNavbar } from '@/components/careers/CareersNavbar'
import { CareersFooter } from '@/components/careers/CareersFooter'
import { AdBanner } from '@/components/careers/AdBanner'
import { BookOpen, ArrowLeft, Calendar, User, Tag } from 'lucide-react'

export const CareerGuideDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { guides, fetchGuides } = useCareersStore()

  useEffect(() => {
    fetchGuides()
  }, [slug])

  const guide = guides.find(g => g.slug === slug || g.id === slug)

  useEffect(() => {
    if (guide) {
      document.title = `${guide.title} | Educational Career Guide`
    }
  }, [guide])

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#040509] text-white flex flex-col font-sans">
        <CareersNavbar />
        <div className="flex-grow flex items-center justify-center py-20 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display">Guide Not Found</h2>
            <Link to="/career-guides" className="btn-primary text-xs inline-flex items-center gap-2">
              <ArrowLeft size={14} />
              <span>Back to Educational Guides</span>
            </Link>
          </div>
        </div>
        <CareersFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#040509] text-white flex flex-col font-sans">
      <CareersNavbar />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          
          <Link to="/career-guides" className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={14} />
            <span>Back to All Guides</span>
          </Link>

          <article className="p-8 sm:p-12 rounded-3xl bg-[#080b14] border border-white/10 space-y-8">
            <div className="space-y-4 border-b border-white/5 pb-8">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-display">
                {guide.category}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white font-display leading-tight">
                {guide.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1"><User size={13} /> {guide.author}</span>
                <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(guide.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line font-light">
              {guide.content}
            </div>

            {guide.tags && guide.tags.length > 0 && (
              <div className="pt-6 border-t border-white/5 flex items-center gap-2 flex-wrap">
                <Tag size={13} className="text-emerald-400" />
                {guide.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          <AdBanner zoneId="article_bottom" />

        </div>
      </main>

      <CareersFooter />
    </div>
  )
}
