import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Award, Zap, Users, ArrowRight, CheckCircle2, Cpu, Globe } from 'lucide-react'

interface AboutSectionProps {
  content?: {
    title?: string
    subtitle?: string
    description?: string
  }
  styling?: any
}

export const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
  const title = content?.title || 'Engineering Modern Digital Infrastructure'
  const subtitle = content?.subtitle || 'Helping businesses scale through custom web applications, native mobile software, Windows desktop suites, and automated workflow engines.'

  const pillars = [
    {
      num: '01',
      title: 'Enterprise Code Architecture',
      desc: 'Built using React, Next.js, Kotlin, and C# .NET to deliver sub-second page loads, offline resiliency, and bank-grade security.',
      icon: Cpu
    },
    {
      num: '02',
      title: 'Automated Operations & Lead CRMs',
      desc: 'Instant WhatsApp notifications, automated client follow-ups, and custom API webhooks that eliminate manual data entry.',
      icon: Zap
    },
    {
      num: '03',
      title: 'Technical SEO & Search Dominance',
      desc: 'Structured JSON-LD schema, semantic markup, and Core Web Vitals optimization to rank #1 on Google Search snippets.',
      icon: Globe
    },
    {
      num: '04',
      title: '99.9% Uptime & 24/7 SLA Guarantee',
      desc: 'Dedicated cloud monitoring, rapid incident response, and continuous software maintenance for peace of mind.',
      icon: ShieldCheck
    }
  ]

  const metrics = [
    { label: 'Completed Projects', value: '100+' },
    { label: 'Uptime SLA Guarantee', value: '99.9%' },
    { label: 'Average PageSpeed Score', value: '98/100' },
    { label: 'Client Satisfaction Rating', value: '4.9 / 5' }
  ]

  return (
    <section id="about" className="py-24 relative bg-[#040509] dark:bg-[#040509] light:bg-slate-100 border-b border-white/5 light:border-slate-200 transition-colors duration-300">
      {/* Background Subtle Gradient Orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-emerald-500/10 filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-indigo-500/10 filter blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-display">
            <Award size={14} />
            <span>Official Web Engineering &amp; Automation Agency</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 font-display tracking-tight leading-tight">
            {title}
          </h2>
          
          <p className="text-base sm:text-lg text-slate-400 dark:text-slate-400 light:text-slate-600 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#080b14] dark:bg-[#080b14] light:bg-white border border-white/10 light:border-slate-200 hover:border-emerald-500/40 transition-all duration-300 space-y-4 group shadow-xl light:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 light:text-slate-400">
                    {pillar.num}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 font-display group-hover:text-emerald-400 transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Metrics Counter Bar */}
        <div className="p-8 rounded-3xl bg-[#080b14]/80 dark:bg-[#080b14]/80 light:bg-white border border-white/10 light:border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-xl">
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-4xl font-extrabold font-mono text-emerald-400">
                {m.value}
              </div>
              <div className="text-xs font-medium text-slate-400 light:text-slate-600 uppercase tracking-wider">
                {m.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default AboutSection
