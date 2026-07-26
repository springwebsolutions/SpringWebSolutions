import React from 'react'
import { Check, X, Shield, Zap, Sparkles, Code, Cpu } from 'lucide-react'

export const ComparisonTable: React.FC<{ content?: any; styling?: any }> = ({ content }) => {
  const title = content?.title || "Why Choose Spring Web Solutions?"
  const subtitle = content?.subtitle || "See how our high-performance engineering standards compare against traditional freelance work and generic template agencies."

  const criteria = [
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
    <section className="py-20 bg-[#060810] text-white border-b border-white/5 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={13} /> Clear Engineering Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Matrix Table */}
        <div className="rounded-2xl bg-[#080b14] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/3">Feature / Standard</th>
                  <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/3 bg-rose-500/[0.02]">Traditional Agencies / Freelancers</th>
                  <th className="p-5 text-xs font-bold text-emerald-400 uppercase tracking-wider w-1/3 bg-emerald-500/[0.08] flex items-center gap-2">
                    <Zap size={14} className="text-emerald-400" /> Spring Web Solutions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                {criteria.map((item, idx) => (
                  <tr key={idx} className={`hover:bg-white/[0.02] transition-colors ${item.highlight ? 'bg-white/[0.01]' : ''}`}>
                    <td className="p-5 font-bold text-white font-display">
                      {item.feature}
                    </td>
                    <td className="p-5 text-slate-400 bg-rose-500/[0.01]">
                      <div className="flex items-start gap-2">
                        <X size={16} className="text-rose-400 shrink-0 mt-0.5" />
                        <span>{item.others}</span>
                      </div>
                    </td>
                    <td className="p-5 text-white font-semibold bg-emerald-500/[0.04]">
                      <div className="flex items-start gap-2 text-emerald-300">
                        <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
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
