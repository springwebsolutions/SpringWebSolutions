import React from 'react'
import { Search, PenTool, Code2, TestTube2, Rocket, HeartHandshake, ArrowRight, CheckCircle2 } from 'lucide-react'
import AnimatedBackground from '../ui/AnimatedBackground'
import ProjectRoadmapStepper from '../interactive/ProjectRoadmapStepper'

const DEFAULT_STEPS = [
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

const ICON_MAP: Record<string, any> = {
  Search,
  PenTool,
  Code2,
  TestTube2,
  Rocket,
  HeartHandshake
}

interface ProcessSectionProps {
  content?: any
  styling?: any
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ content }) => {
  const title = content?.title || 'Our Transparent Engineering Process'
  const subtitle = content?.subtitle || 'Six clear steps from first conversation to launched product — and everything in between.'

  // Allow custom steps from CMS or fallback to defaults
  const stepsList = (content?.steps && Array.isArray(content.steps) && content.steps.length > 0)
    ? content.steps.map((s: any, i: number) => ({
        number: s.number || `0${i + 1}`,
        icon: (typeof s.icon === 'string' && ICON_MAP[s.icon]) ? ICON_MAP[s.icon] : DEFAULT_STEPS[i % DEFAULT_STEPS.length].icon,
        title: s.title || DEFAULT_STEPS[i % DEFAULT_STEPS.length].title,
        color: s.color || DEFAULT_STEPS[i % DEFAULT_STEPS.length].color,
        bg: s.bg || DEFAULT_STEPS[i % DEFAULT_STEPS.length].bg,
        desc: s.desc || DEFAULT_STEPS[i % DEFAULT_STEPS.length].desc,
        bullets: s.bullets || DEFAULT_STEPS[i % DEFAULT_STEPS.length].bullets
      }))
    : DEFAULT_STEPS

  return (
    <section className="py-20 bg-[#040509] dark:bg-[#040509] light:bg-slate-50 border-b border-white/10 light:border-slate-200 transition-colors duration-300 relative overflow-hidden">
      {/* Animated micro-particles background */}
      <AnimatedBackground accent="emerald" particleCount={18} />

      <div className="mx-auto max-w-7xl 2xl:max-w-[1536px] px-4 sm:px-8 lg:px-12 relative z-10 space-y-16">

        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 dark:text-emerald-400 light:text-emerald-600 text-xs font-bold uppercase tracking-widest font-display">
            <CheckCircle2 size={13} /> How We Work
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white dark:text-white light:text-slate-900 uppercase tracking-tight font-display leading-tight">
            {title.split(' ').slice(0, -2).join(' ')}{' '}
            <span className="text-emerald-400 dark:text-emerald-400 light:text-emerald-700 bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 light:from-emerald-700 light:via-teal-700 light:to-indigo-700">
              {title.split(' ').slice(-2).join(' ')}
            </span>
          </h2>
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm sm:text-base font-sans font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* ── Interactive 6-Phase Project Roadmap Stepper (NavaNala-inspired) ── */}
        <div className="pt-2">
          <ProjectRoadmapStepper />
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 light:bg-emerald-50 light:border-emerald-200 text-sm font-semibold hover:bg-emerald-500/20 light:hover:bg-emerald-100 hover:scale-105 transition-all font-display shadow-lg shadow-emerald-500/10"
          >
            Start Your Project Discovery <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default ProcessSection
