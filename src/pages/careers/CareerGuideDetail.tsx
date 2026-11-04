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
  SystemDesignNapkinCalculator,
  InteractiveTokenBucketSimulator,
  ArchitectCodeDiffViewer,
  InteractiveFlashcardsDeck,
  ArchitectureReadinessChecklist,
  SeniorArchitectScenarioQuiz
} from '@/components/careers/InteractiveCareerToolkit'
import { 
  BookOpen, ArrowLeft, Calendar, User, Tag, ArrowRight, 
  Share2, Sparkles, Trophy, CheckCircle2, DollarSign, 
  MessageSquare, Layers, ShieldCheck, Flame
} from 'lucide-react'

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

  // Blueprint specs lookup
  const getBlueprintSpecs = (guideSlug: string) => {
    if (guideSlug.includes('frontend')) {
      return {
        level: 'Mid to Staff UI Architect',
        compensation: '₹16L – ₹35L+ LPA',
        readTime: '~9 min read',
        stack: 'React 19, Next.js 15, Web Vitals, Tailwind v4, Zustand',
        domain: 'Frontend & UI Performance'
      }
    }
    if (guideSlug.includes('backend')) {
      return {
        level: 'Mid to Staff API Architect',
        compensation: '₹20L – ₹45L+ LPA',
        readTime: '~10 min read',
        stack: 'Node.js, Go, PostgreSQL, Redis, Apache Kafka, gRPC',
        domain: 'High-Concurrency Backends'
      }
    }
    if (guideSlug.includes('cloud-architect')) {
      return {
        level: 'Senior to Enterprise Cloud Architect',
        compensation: '₹24L – ₹55L+ LPA',
        readTime: '~9 min read',
        stack: 'AWS, Terraform, Multi-Region VPC, FinOps, Transit Gateway',
        domain: 'Cloud Solutions Architecture'
      }
    }
    if (guideSlug.includes('data-engineer')) {
      return {
        level: 'Senior to Staff Data Architect',
        compensation: '₹22L – ₹48L+ LPA',
        readTime: '~10 min read',
        stack: 'Apache Spark, Snowflake, dbt, Apache Kafka, Parquet',
        domain: 'Data Lakehouse & Streaming'
      }
    }
    if (guideSlug.includes('machine-learning')) {
      return {
        level: 'Senior to Staff ML Engineer',
        compensation: '₹24L – ₹50L+ LPA',
        readTime: '~9 min read',
        stack: 'PyTorch, vLLM, MLOps, Triton, Feast, AWQ/GGUF',
        domain: 'Machine Learning & MLOps'
      }
    }
    if (guideSlug.includes('cybersecurity')) {
      return {
        level: 'Senior AppSec & Penetration Tester',
        compensation: '₹20L – ₹45L+ LPA',
        readTime: '~8 min read',
        stack: 'OWASP Top 10, DevSecOps, STRIDE, Burp Suite, TLS 1.3',
        domain: 'Application Security & PenTesting'
      }
    }
    if (guideSlug.includes('sdet-qa')) {
      return {
        level: 'Senior SDET & Quality Architect',
        compensation: '₹16L – ₹35L+ LPA',
        readTime: '~8 min read',
        stack: 'Playwright, k6 Load Tests, Pact Contract Testing, CI/CD',
        domain: 'Test Automation & Quality SRE'
      }
    }
    if (guideSlug.includes('mobile')) {
      return {
        level: 'Senior to Staff Mobile Architect',
        compensation: '₹18L – ₹40L+ LPA',
        readTime: '~9 min read',
        stack: 'React Native, TurboModules, Swift, Kotlin, SQLite Sync',
        domain: 'Mobile Application Engineering'
      }
    }
    if (guideSlug.includes('devops')) {
      return {
        level: 'Mid to Principal SRE',
        compensation: '₹22L – ₹50L+ LPA',
        readTime: '~9 min read',
        stack: 'Docker, K8s, Terraform, ArgoCD, Prometheus',
        domain: 'Infrastructure & Cloud'
      }
    }
    if (guideSlug.includes('system-design')) {
      return {
        level: 'Senior to Staff Architect',
        compensation: '₹28L – ₹65L+ LPA',
        readTime: '~11 min read',
        stack: 'Redis, Kafka, PostgreSQL, CDN, Consistent Hashing',
        domain: 'High-Concurrency Backends'
      }
    }
    if (guideSlug.includes('remote')) {
      return {
        level: 'Mid to Lead Independent Contractor',
        compensation: '₹35L – ₹1.2 Cr+ LPA',
        readTime: '~8 min read',
        stack: 'Wise FIRC, Sec 44ADA, Async RFCs, Loom, US Tax W-8BEN',
        domain: 'Global Remote Contracts'
      }
    }
    if (guideSlug.includes('ai-engineering')) {
      return {
        level: 'Full-Stack to Applied AI Engineer',
        compensation: '₹20L – ₹48L+ LPA',
        readTime: '~8 min read',
        stack: 'pgvector, OpenAI API, LangGraph, Python, TypeScript',
        domain: 'Applied GenAI & RAG'
      }
    }
    return {
      level: 'Junior to Senior Full-Stack Engineer',
      compensation: '₹14L – ₹35L+ LPA',
      readTime: '~10 min read',
      stack: 'React, Next.js, Node.js, PostgreSQL, Tailwind, TypeScript',
      domain: 'Production Web Systems'
    }
  }

  const specs = getBlueprintSpecs(guide.slug)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://careers.springwebsolutions.in/career-guides/${guide.slug}`
  const shareTitle = encodeURIComponent(`Must-read Engineering Blueprint: ${guide.title}`)

  return (
    <div className="min-h-screen bg-[#040509] text-white flex flex-col font-sans">
      <CareersSeo 
        title={`${guide.title} | Educational Guide | SpringWeb Careers`}
        description={guide.excerpt || guide.content.substring(0, 160)}
        canonicalUrl={`https://careers.springwebsolutions.in/career-guides/${guide.slug}`}
        schemaJson={articleSchema}
      />
      <CareersNavbar />

      <main className="flex-grow py-8 sm:py-12">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Navigation & Status Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-white/5">
            <Link to="/career-guides" className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
              <ArrowLeft size={14} />
              <span>Back to All Educational Blueprints</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck size={12} />
                <span>Udumalpet Engineering Council Reviewed</span>
              </span>
              <a
                href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                title="Share via WhatsApp"
              >
                <Share2 size={13} />
                <span className="hidden xs:inline">Share</span>
              </a>
            </div>
          </div>

          {/* ── 12-Column Expansive Editorial Layout (Eliminates Side Margins) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── Main Blueprint Article Body (8 Cols) ── */}
            <article className="lg:col-span-8 p-6 sm:p-10 lg:p-12 rounded-3xl bg-[#080b14] border border-white/10 space-y-8 shadow-2xl">
              
              {/* Header info */}
              <div className="space-y-4 border-b border-white/5 pb-8">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-display">
                    {guide.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Sparkles size={12} className="text-emerald-400" />
                    Engineering Blueprint 2026
                  </span>
                  <span className="text-[11px] text-amber-400/90 font-mono flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    <Flame size={11} />
                    Production War Stories
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display leading-[1.15] tracking-tight">
                  {guide.title}
                </h1>

                {guide.excerpt && (
                  <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
                    {guide.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-3 border-t border-white/5 flex-wrap">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300">
                    <User size={13} className="text-emerald-400" />
                    {guide.author}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={13} />
                    {new Date(guide.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px]">
                    {specs.readTime}
                  </span>
                </div>
              </div>

              {/* Topic-Matched High-Resolution Featured Banner */}
              {guide.cover_image && (
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#04060c] shadow-2xl aspect-[16/9]">
                  <img
                    src={`${guide.cover_image}?v=2026.2`}
                    alt={guide.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              )}

              {/* Rendered Markdown Body (Tables, Code Blocks, Architecture Decisions) */}
              <div className="py-2">
                <MarkdownRenderer content={guide.content} />
              </div>

              {/* Interactive Section 1: Remote Compensation & Tax Shield Calculator */}
              {(guide.slug.includes('remote') || guide.slug.includes('full-stack')) && (
                <div id="interactive-calculator" className="pt-2">
                  <RemoteCompensationCalculator />
                </div>
              )}

              {/* Interactive Section 2: ByteByteGo System Design Napkin Math Calculator */}
              <div id="napkin-calculator" className="pt-2">
                <SystemDesignNapkinCalculator />
              </div>

              {/* Interactive Section 3: Token Bucket Rate Limiter Simulator */}
              <div id="token-bucket-simulator" className="pt-2">
                <InteractiveTokenBucketSimulator />
              </div>

              {/* Interactive Section 4: Junior vs Staff Architect Code Diff Viewer */}
              <div id="code-diff-viewer" className="pt-2">
                <ArchitectCodeDiffViewer />
              </div>

              {/* Interactive Section 5: Technical Interview Flashcards Deck */}
              <div id="flashcards-deck" className="pt-2">
                <InteractiveFlashcardsDeck />
              </div>

              {/* Interactive Section 6: Technical Readiness Diagnostic Checklist */}
              <div id="readiness-diagnostic" className="pt-2">
                <ArchitectureReadinessChecklist guideSlug={guide.slug} />
              </div>

              {/* Interactive Section 7: Scenario-based Interview Quiz */}
              <div id="scenario-challenge" className="pt-2">
                <SeniorArchitectScenarioQuiz guideSlug={guide.slug} />
              </div>

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
                  <MessageSquare size={14} />
                  <span>WhatsApp Lead Architect</span>
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

            {/* ── Sticky Right Sidebar: Blueprint Navigation & Specs (4 Cols) ── */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              
              {/* Card 1: Blueprint Fast Facts */}
              <div className="p-6 rounded-3xl bg-[#080b14] border border-white/10 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                    <Layers size={13} />
                    <span>Blueprint Specs</span>
                  </span>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400 font-mono">
                    2026 Edition
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Domain & Focus</div>
                    <div className="text-white font-semibold mt-0.5">{specs.domain}</div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Target Engineer Level</div>
                    <div className="text-slate-200 font-medium mt-0.5">{specs.level}</div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Industry Market Comp</div>
                    <div className="text-emerald-400 font-mono font-bold mt-0.5 flex items-center gap-1">
                      <DollarSign size={13} />
                      <span>{specs.compensation}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500 font-medium">Core Production Tech Stack</div>
                    <div className="text-slate-300 font-mono text-[11px] mt-1 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 leading-relaxed">
                      {specs.stack}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Interactive Tools Quick Anchors */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0a0f1d] to-[#080b14] border border-white/10 shadow-xl space-y-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>Interactive Toolkit</span>
                </div>

                <div className="space-y-2">
                  <a
                    href="#napkin-calculator"
                    className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between text-xs text-slate-300 hover:text-cyan-400 group"
                  >
                    <span className="flex items-center gap-2">
                      <span>🧮</span>
                      <span className="font-medium">ByteByteGo Capacity Planner</span>
                    </span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href="#token-bucket-simulator"
                    className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 transition-all flex items-center justify-between text-xs text-slate-300 hover:text-amber-400 group"
                  >
                    <span className="flex items-center gap-2">
                      <span>⏱️</span>
                      <span className="font-medium">Rate Limiter Simulator</span>
                    </span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href="#code-diff-viewer"
                    className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between text-xs text-slate-300 hover:text-indigo-400 group"
                  >
                    <span className="flex items-center gap-2">
                      <span>⚡</span>
                      <span className="font-medium">Junior vs Staff Code Diff</span>
                    </span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href="#flashcards-deck"
                    className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 transition-all flex items-center justify-between text-xs text-slate-300 hover:text-purple-400 group"
                  >
                    <span className="flex items-center gap-2">
                      <span>🃏</span>
                      <span className="font-medium">System Design Flashcards</span>
                    </span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </a>

                  {(guide.slug.includes('remote') || guide.slug.includes('full-stack')) && (
                    <a
                      href="#interactive-calculator"
                      className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-between text-xs text-slate-300 hover:text-emerald-400 group"
                    >
                      <span className="flex items-center gap-2">
                        <span>💵</span>
                        <span className="font-medium">Section 44ADA Tax Tool</span>
                      </span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}

                  <a
                    href="#readiness-diagnostic"
                    className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-between text-xs text-slate-300 hover:text-emerald-400 group"
                  >
                    <span className="flex items-center gap-2">
                      <span>📋</span>
                      <span className="font-medium">Readiness Diagnostic</span>
                    </span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href="#scenario-challenge"
                    className="w-full p-3 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-between text-xs text-slate-300 hover:text-emerald-400 group"
                  >
                    <span className="flex items-center gap-2">
                      <span>🧠</span>
                      <span className="font-medium">Architect Scenario Quiz</span>
                    </span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Card 3: Switch Between All 5 Educational Blueprints */}
              <div className="p-6 rounded-3xl bg-[#080b14] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                    <BookOpen size={13} className="text-emerald-400" />
                    <span>All 5 Career Blueprints</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Free</span>
                </div>

                <div className="space-y-2">
                  {guides.map((g) => {
                    const isCurrent = g.id === guide.id || g.slug === guide.slug
                    return (
                      <Link
                        key={g.id}
                        to={`/career-guides/${g.slug}`}
                        className={`p-3 rounded-xl block transition-all text-xs border ${
                          isCurrent
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                            : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="line-clamp-1">{g.title.split(':')[0]}</span>
                          {isCurrent && (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Card 4: Udumalpet Mentorship Direct WhatsApp */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/30 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider">
                  <ShieldCheck size={14} />
                  <span>Direct Mentorship</span>
                </div>
                <h4 className="text-sm font-bold text-white">Need Code Review or Resume Critique?</h4>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Chat directly with senior engineers from SpringWeb in Udumalpet, Tamil Nadu. Zero spam, pure engineering advice.
                </p>
                <a
                  href="https://wa.me/918012622119?text=Hi%20SpringWeb,%20I%20am%20reading%20the%20career%20blueprint%20and%20would%20love%20a%20mentorship%20chat."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <MessageSquare size={14} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

            </aside>
          </div>

          <AdBanner zoneId="article_bottom" />

          {/* Related Guides Recommendation Panel */}
          {relatedGuides.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-white/5">
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
