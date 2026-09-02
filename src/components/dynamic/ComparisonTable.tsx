import React from 'react'
import { Check, X, Zap, Sparkles } from 'lucide-react'
import AnimatedBackground from '../ui/AnimatedBackground'

export const ComparisonTable: React.FC<{ content?: any; styling?: any }> = ({ content }) => {
  const title = content?.title || "Why Choose Spring Web Solutions?"
  const subtitle = content?.subtitle || "See how our high-performance engineering standards compare against traditional freelance work and generic template agencies."

  const criteria = [
    {
      feature: "Multi-Platform Application Development",
      others: "Single web pages only or high costs for mobile & desktop software",
      us: "Unified Web + Android + iOS + Windows Desktop App Architecture",
      highlight: true
    },
    {
      feature: "Source Code Ownership",
      others: "Locked in proprietary systems or monthly maintenance fees",
      us: "100% Full Source Code & Database Ownership",
      highlight: true
    },
    {
      feature: "Page Load Speed & Core Web Vitals",
      others: "Slow (3.5s - 6.0s+) with heavy plugin bloat",
      us: "Ultra-Fast (< 1.0s) Peak Speed Guarantee",
      highlight: true
    },
    {
      feature: "Custom Operations Suite / Admin",
      others: "Generic WordPress backend or complex third-party tools",
      us: "Dedicated SpringWeb Operations Suite Admin",
      highlight: true
    },
    {
      feature: "Technical SEO & Schema Markup",
      others: "Basic meta tags without JSON-LD Schema or indexing strategy",
      us: "Full Structured Data, Automated Sitemap & Instant Indexing",
      highlight: false
    },
    {
      feature: "Security & Database SLA",
      others: "Shared hosting vulnerabilities and unpatched plugins",
      us: "Enterprise Cloud Architecture with 99.9% Uptime SLA",
      highlight: false
    },
    {
      feature: "Local & Direct Engineer Support",
      others: "Outsourced call centers or delayed ticket responses",
      us: "Direct Developer Contact & WhatsApp Assistance",
      highlight: true
    }
  ]

  return (
    <section className="py-20 bg-[#060810] dark:bg-[#060810] light:bg-slate-50 text-slate-900 dark:text-white border-b border-white/5 light:border-slate-200 transition-colors duration-300 relative overflow-hidden">
      <AnimatedBackground accent="blue" particleCount={12} />
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl px-4 sm:px-8 lg:px-12 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={13} /> Clear Engineering Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white dark:text-white light:text-slate-900">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 light:text-slate-600 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Matrix Table */}
        <div className="rounded-3xl bg-[#080b14] dark:bg-[#080b14] light:bg-white border border-white/10 light:border-slate-200 overflow-hidden shadow-2xl light:shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 light:border-slate-200 bg-white/[0.03] light:bg-slate-100">
                  <th className="p-5 text-xs font-bold text-slate-400 dark:text-slate-400 light:text-slate-700 uppercase tracking-wider w-1/3">Feature / Standard</th>
                  <th className="p-5 text-xs font-bold text-slate-400 dark:text-slate-400 light:text-slate-700 uppercase tracking-wider w-1/3 bg-rose-500/[0.02] light:bg-rose-500/[0.04]">Traditional Agencies / Freelancers</th>
                  <th className="p-5 text-xs font-bold text-emerald-500 uppercase tracking-wider w-1/3 bg-emerald-500/[0.08] light:bg-emerald-500/[0.1]">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-emerald-500 shrink-0" />
                      <span>Spring Web Solutions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 light:divide-slate-200 text-xs sm:text-sm">
                {criteria.map((item, idx) => (
                  <tr key={idx} className={`hover:bg-white/[0.02] light:hover:bg-slate-50 transition-colors ${item.highlight ? 'bg-white/[0.01] light:bg-slate-50/50' : ''}`}>
                    <td className="p-5 font-bold text-white dark:text-white light:text-slate-900 font-display">
                      {item.feature}
                    </td>
                    <td className="p-5 text-slate-400 dark:text-slate-400 light:text-slate-600 bg-rose-500/[0.01] light:bg-rose-500/[0.03]">
                      <div className="flex items-start gap-2">
                        <X size={16} className="text-rose-500 shrink-0 mt-0.5" />
                        <span>{item.others}</span>
                      </div>
                    </td>
                    <td className="p-5 text-emerald-300 dark:text-emerald-300 light:text-emerald-800 font-semibold bg-emerald-500/[0.04] light:bg-emerald-500/[0.08]">
                      <div className="flex items-start gap-2">
                        <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item.us}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  )
}
export default ComparisonTable
