import React from 'react'
import { Search, PenTool, Code2, TestTube2, Rocket, HeartHandshake, ArrowRight, CheckCircle2 } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Discovery & Scope',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    desc: 'We start with a deep-dive consultation to understand your business goals, pain points, and technical requirements. We define scope, deliverables, and timelines upfront — no surprises.',
    bullets: ['Requirements gathering', 'Technical feasibility review', 'Project scope & timeline']
  },
  {
    number: '02',
    icon: PenTool,
    title: 'Design & Architecture',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/30',
    desc: 'Our architects design the system structure and our designers build high-fidelity wireframes and UI mockups. You review and approve before a single line of code is written.',
    bullets: ['System architecture plan', 'UI/UX wireframes', 'Database schema design']
  },
  {
    number: '03',
    icon: Code2,
    title: 'Agile Development',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/30',
    desc: 'We build in short agile sprints with weekly progress updates. You have full visibility into what is being built, with access to a live staging environment throughout.',
    bullets: ['Weekly sprint demos', 'Live staging access', 'Transparent commit logs']
  },
  {
    number: '04',
    icon: TestTube2,
    title: 'QA & Testing',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
    desc: 'Every feature goes through rigorous manual and automated QA — cross-browser, mobile responsiveness, API stress testing, and security audits before launch.',
    bullets: ['Cross-device testing', 'API & performance tests', 'Security vulnerability audit']
  },
  {
    number: '05',
    icon: Rocket,
    title: 'Launch & Deploy',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/30',
    desc: 'We handle the full deployment pipeline — CI/CD setup, domain configuration, SSL, CDN, and production hardening. Zero-downtime launches guaranteed.',
    bullets: ['CI/CD pipeline setup', 'SSL & CDN configuration', 'Zero-downtime deployment']
  },
  {
    number: '06',
    icon: HeartHandshake,
    title: 'Support & Iteration',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
    desc: 'Post-launch we monitor uptime, fix bugs, and iterate on features. You get a dedicated support SLA with guaranteed response windows and monthly performance reviews.',
    bullets: ['99.9% uptime monitoring', 'Dedicated SLA support', 'Monthly performance reviews']
  }
]

interface ProcessSectionProps {
  content?: any
  styling?: any
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ content, styling }) => {
  const title = content?.title || 'Our Transparent Engineering Process'
  const subtitle = content?.subtitle || 'Six clear steps from first conversation to launched product — and everything in between.'

  return (
    <section className="py-20 bg-[#040509] border-b border-white/10 relative overflow-hidden">
      {/* Background ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest font-display">
            <CheckCircle2 size={13} /> How We Work
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-display leading-tight">
            {title.split(' ').slice(0, -2).join(' ')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
              {title.split(' ').slice(-2).join(' ')}
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-sans font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="group relative rounded-3xl bg-[#06080f] border border-white/8 p-7 space-y-5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Step number watermark */}
                <div className="absolute top-5 right-6 text-5xl font-black text-white/4 font-display select-none">
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`h-11 w-11 rounded-2xl ${step.bg} border flex items-center justify-center ${step.color} shrink-0`}>
                  <Icon size={20} />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h3 className={`text-base font-bold text-white font-display group-hover:${step.color} transition-colors`}>
                    <span className={`${step.color} font-mono text-xs mr-2 opacity-70`}>{step.number}</span>
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Bullets */}
                <ul className="space-y-1.5">
                  {step.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-slate-300 font-sans">
                      <CheckCircle2 size={12} className={step.color} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-all font-display"
          >
            Start Your Project Discovery <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default ProcessSection
