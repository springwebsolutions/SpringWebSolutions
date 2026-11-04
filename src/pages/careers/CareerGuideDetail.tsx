import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCareersStore } from '@/stores/careersStore'
import { CareersNavbar } from '@/components/careers/CareersNavbar'
import { CareersFooter } from '@/components/careers/CareersFooter'
import { AdBanner } from '@/components/careers/AdBanner'
import { CareersSeo } from '@/components/seo/CareersSeo'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import {
  RemoteCompensationCalculator,
  ArchitectureReadinessChecklist,
  SeniorArchitectScenarioQuiz
} from '@/components/careers/InteractiveCareerToolkit'
import { BookOpen, ArrowLeft, Calendar, User, Tag, ArrowRight, Share2, Sparkles, Trophy } from 'lucide-react'

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

  const relatedGuides = guides
    .filter(g => g.id !== guide.id && g.status === 'published')
    .slice(0, 3)

  const articleSchema = guide ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': guide.title,
    'description': guide.excerpt || guide.content.substring(0, 160),
    'image': guide.cover_image ? `https://careers.springwebsolutions.in${guide.cover_image}` : undefined,
    'author': {
      '@type': 'Person',
      'name': guide.author || 'SpringWeb Career Experts'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'SpringWeb Solutions',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.springwebsolutions.in/logo-emblem.png'
      }
    },
    'datePublished': guide.created_at
  } : undefined

  return (
    <div className="min-h-screen bg-[#040509] text-white flex flex-col font-sans">
      <CareersSeo 
        title={`${guide.title} | Educational Guide | SpringWeb Careers`}
        description={guide.excerpt || guide.content.substring(0, 160)}
        canonicalUrl={`https://careers.springwebsolutions.in/career-guides/${guide.slug}`}
        schemaJson={articleSchema}
      />
      <CareersNavbar />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          
          <Link to="/career-guides" className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={14} />
            <span>Back to All Guides</span>
          </Link>

          <article className="p-8 sm:p-12 rounded-3xl bg-[#080b14] border border-white/10 space-y-8 shadow-2xl">
            {/* Header info */}
            <div className="space-y-4 border-b border-white/5 pb-8">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-display">
                  {guide.category}
                </span>
                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                  <Sparkles size={11} className="text-emerald-400" />
                  Engineering Blueprint
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white font-display leading-tight tracking-tight">
                {guide.title}
              </h1>

              {guide.excerpt && (
                <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                  {guide.excerpt}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <User size={13} className="text-emerald-400" />
                  {guide.author}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar size={13} />
                  {new Date(guide.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            {guide.cover_image && (
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#04060c] shadow-2xl aspect-[16/9]">
                <img
                  src={guide.cover_image}
                  alt={guide.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            )}

            {/* Markdown rendered body with tables, headings, code blocks */}
            <div className="py-2">
              <MarkdownRenderer content={guide.content} />
            </div>

            {/* Interactive Section 1: Remote Calculator (Contextually injected for remote/fullstack roadmaps) */}
            {(guide.slug.includes('remote') || guide.slug.includes('full-stack')) && (
              <RemoteCompensationCalculator />
            )}

            {/* Interactive Section 2: Technical Readiness Checklist */}
            <ArchitectureReadinessChecklist guideSlug={guide.slug} />

            {/* Interactive Section 3: Scenario-based Interview Quiz */}
            <SeniorArchitectScenarioQuiz guideSlug={guide.slug} />

            {/* Senior Architect Mentorship Callout */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#070b14] to-indigo-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  Engineering Mentorship & Code Reviews
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-white font-display">
                  Stuck in Tutorial Hell or Preparing for Tier-1 Product Rounds?
                </h4>
                <p className="text-xs text-slate-400 font-light max-w-xl leading-relaxed">
                  Connect directly with the software architects at SpringWeb Solutions in Udumalpet. We review your GitHub repos, critique your system design blueprints, and guide your journey from junior debugger to high-earning production engineer.
                </p>
              </div>
              <a
                href="https://wa.me/918012622119?text=Hi%20SpringWeb,%20I%20read%20your%20educational%20career%20guide%20and%20want%20to%20discuss%20mentorship%20and%20open%20engineering%20roles."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs shrink-0 py-3.5 px-6 font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <span>WhatsApp Engineering Lead</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Tags */}
            {guide.tags && guide.tags.length > 0 && (
              <div className="pt-6 border-t border-white/5 flex items-center gap-2 flex-wrap">
                <Tag size={13} className="text-emerald-400" />
                {guide.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          <AdBanner zoneId="article_bottom" />

          {/* Related Guides Recommendation Panel */}
          {relatedGuides.length > 0 && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Recommended Educational Guides
                </h3>
                <Link to="/career-guides" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
                  <span>View All Roadmaps</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedGuides.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/career-guides/${rel.slug}`}
                    className="p-5 rounded-2xl bg-[#080b14] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      {rel.cover_image && (
                        <div className="rounded-xl overflow-hidden aspect-[16/9] border border-white/5 mb-2 bg-[#04060c]">
                          <img src={rel.cover_image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-display">
                        {rel.category}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 font-light">
                        {rel.excerpt}
                      </p>
                    </div>
                    <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{rel.author}</span>
                      <ArrowRight size={12} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <CareersFooter />
    </div>
  )
}
