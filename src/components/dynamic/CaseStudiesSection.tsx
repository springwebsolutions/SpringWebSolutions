import React, { useState } from 'react'
import { ArrowRight, CheckCircle, TrendingUp, Zap, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedBackground from '../ui/AnimatedBackground'

interface CaseStudy {
  id: string
  title: string
  clientCategory: string
  industry: string
  before: {
    title: string
    metrics: string[]
  }
  after: {
    title: string
    metrics: string[]
    highlightMetric: string
    highlightLabel: string
  }
  techUsed: string[]
}

const caseStudiesData: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Manufacturing ERP & Inventory Automation',
    clientCategory: 'Industrial & Manufacturing',
    industry: 'Automated Operations',
    before: {
      title: 'Legacy Manual Operations',
      metrics: [
        'Manual paper logbooks for raw material tracking',
        '12+ hours wasted per week on manual data re-entry',
        'Frequent inventory errors and delayed order dispatches'
      ]
    },
    after: {
      title: 'SpringWeb Custom Cloud ERP',
      metrics: [
        'Real-time barcode scanning & cloud database sync',
        'Zero manual data entry errors across all departments',
        'Instant WhatsApp dispatch notifications to client managers'
      ],
      highlightMetric: '12 Hrs/Wk',
      highlightLabel: 'Time Saved Per Floor Manager'
    },
    techUsed: ['React', 'Node.js', 'Supabase SQL', 'WhatsApp API']
  },
  {
    id: 'case-2',
    title: 'E-Commerce Storefront Speed & Core Web Vitals',
    clientCategory: 'Retail & E-Commerce',
    industry: 'Performance Optimization',
    before: {
      title: 'Heavy Monolithic Setup',
      metrics: [
        '4.8 seconds average page load speed',
        'Low mobile conversion rate due to slow checkout',
        'Poor Google Core Web Vitals scores'
      ]
    },
    after: {
      title: 'High-Speed Headless Frontend',
      metrics: [
        '0.5 second peak page load speed worldwide',
        '100/100 Google Lighthouse Core Web Vitals score',
        '+140% boost in organic search lead conversions'
      ],
      highlightMetric: '0.5s',
      highlightLabel: 'Global Page Load Speed'
    },
    techUsed: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vite']
  },
  {
    id: 'case-3',
    title: 'Local Service Agency Lead Capture & CRM Routing',
    clientCategory: 'Professional Services',
    industry: 'Sales CRM Automation',
    before: {
      title: 'Unorganized Lead Channels',
      metrics: [
        'Inquiries lost in cluttered email inboxes',
        'Delayed response times (24-48 hours average)',
        'No tracking of lead conversion statuses'
      ]
    },
    after: {
      title: 'Unified SpringWeb Lead CRM',
      metrics: [
        'Instant lead capture & instant SMS/email alerts (< 5s)',
        'Automated CRM funnel tracking & sales pipeline views',
        '+65% increase in booked client consultations'
      ],
      highlightMetric: '< 5 Sec',
      highlightLabel: 'Instant Lead Notification SLA'
    },
    techUsed: ['React', 'SpringWeb CRM', 'Resend API', 'PostgreSQL']
  }
]

export const CaseStudiesSection: React.FC<{ content?: any; styling?: any }> = ({ content }) => {
  const title = content?.title || "Engineering Transformation Case Studies"
  const subtitle = content?.subtitle || "Explore real-world technical transformations where custom software and high-speed web engineering delivered measurable business results."

  const [activeCase, setActiveCase] = useState<number>(0)
  const current = caseStudiesData[activeCase]

  return (
    <section className="py-20 bg-[#040509] dark:bg-[#040509] light:bg-white text-slate-900 dark:text-white border-b border-white/5 light:border-slate-200 transition-colors duration-300 relative overflow-hidden">
      <AnimatedBackground accent="emerald" particleCount={14} />
      <div className="mx-auto max-w-7xl 2xl:max-w-[1536px] px-4 sm:px-8 lg:px-12 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold uppercase tracking-widest">
            <TrendingUp size={13} /> Proven Results
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white dark:text-white light:text-slate-900">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 light:text-slate-600 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Navigation Selector */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {caseStudiesData.map((cs, idx) => (
            <button
              key={cs.id}
              onClick={() => setActiveCase(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCase === idx
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                  : 'bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 text-slate-400 dark:text-slate-400 light:text-slate-700 hover:text-white hover:bg-white/10'
              }`}
            >
              {cs.clientCategory}
            </button>
          ))}
        </div>

        {/* Case Study Card */}
        <div className="rounded-3xl bg-[#080b14] dark:bg-[#080b14] light:bg-slate-50 border border-white/10 light:border-slate-200 p-6 sm:p-10 space-y-8 shadow-2xl light:shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 light:border-slate-200 pb-6">
            <div>
              <span className="text-xs font-semibold text-emerald-500 uppercase tracking-widest">{current.industry}</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white dark:text-white light:text-slate-900 tracking-tight mt-1">{current.title}</h3>
            </div>

            {/* Metric Badge */}
            <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-indigo-500/20 border border-emerald-500/30 text-center shrink-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-display">{current.after.highlightMetric}</div>
              <div className="text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-700 font-medium">{current.after.highlightLabel}</div>
            </div>
          </div>

          {/* Before vs After Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="p-6 rounded-2xl bg-rose-500/[0.03] light:bg-rose-500/[0.06] border border-rose-500/20 space-y-4">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-sm font-display">
                <Clock size={16} /> BEFORE: {current.before.title}
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-700">
                {current.before.metrics.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="p-6 rounded-2xl bg-emerald-500/[0.05] light:bg-emerald-500/[0.08] border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm font-display">
                <Zap size={16} /> AFTER: {current.after.title}
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 dark:text-slate-200 light:text-slate-800">
                {current.after.metrics.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-emerald-400 dark:text-emerald-300 light:text-emerald-700 font-medium">
                    <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tech Stack Used & CTA */}
          <div className="pt-4 border-t border-white/10 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mr-2">Engineered With:</span>
              {current.techUsed.map((tech, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 light:border-slate-200 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700 font-mono">
                  {tech}
                </span>
              ))}
            </div>

            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              Request Similar Solution <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
export default CaseStudiesSection
