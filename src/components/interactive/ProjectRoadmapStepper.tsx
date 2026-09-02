import React, { useState } from 'react'
import { 
  Search, PenTool, Code2, ShieldCheck, Rocket, HeartHandshake, 
  CheckCircle2, ArrowRight, Clock, Award, Sparkles, FileCode2
} from 'lucide-react'

interface Milestone {
  number: string
  title: string
  shortTitle: string
  dayRange: string
  icon: any
  color: string
  badge: string
  desc: string
  deliverables: string[]
  clientInvolvement: string
}

const ROADMAP_STEPS: Milestone[] = [
  {
    number: '01',
    title: 'Architectural Blueprint & Scoping',
    shortTitle: 'Discovery',
    dayRange: 'Day 1 – 2',
    icon: Search,
    color: 'text-emerald-400',
    badge: '24h Turnaround',
    desc: 'Deep technical consultation to audit your business goals, tech requirements, and data flows. We define fixed scope, deliverables, and architecture blueprints with zero guesswork.',
    deliverables: [
      'Technical Architecture Specification document',
      'Database schema & entity relationship draft',
      'Fixed-price milestone agreement & SLA guarantee'
    ],
    clientInvolvement: '1-hour discovery call or WhatsApp requirement review'
  },
  {
    number: '02',
    title: 'High-Fidelity UI/UX & Wireframing',
    shortTitle: 'Design',
    dayRange: 'Day 3 – 5',
    icon: PenTool,
    color: 'text-indigo-400',
    badge: 'Interactive Mockups',
    desc: 'Our lead designers craft pixel-perfect Figma screens with modern glassmorphism, mobile touch ergonomical layouts, and design tokens approved by you before writing code.',
    deliverables: [
      'Interactive clickable Figma prototype',
      'Mobile-first responsive screen layouts',
      'Brand design tokens (typography, colors, components)'
    ],
    clientInvolvement: 'Review and approve visual screen mockups'
  },
  {
    number: '03',
    title: 'High-Velocity Agile Development',
    shortTitle: 'Engineering',
    dayRange: 'Day 6 – 10',
    icon: Code2,
    color: 'text-teal-400',
    badge: 'Live Staging',
    desc: 'Engineered using React 19, Next.js 15, or Kotlin native with daily Git commits. You get a private live staging URL to test real working features as they are built.',
    deliverables: [
      'Private live staging server preview URL',
      'High-speed core component implementation',
      'Secure backend API & database connection'
    ],
    clientInvolvement: 'Try out features on live staging at your own convenience'
  },
  {
    number: '04',
    title: 'Sub-Second Speed & Security QA',
    shortTitle: 'Testing',
    dayRange: 'Day 11 – 12',
    icon: ShieldCheck,
    color: 'text-amber-400',
    badge: '100/100 PageSpeed',
    desc: 'Rigorous automated and manual stress tests across iPhone, Android, and desktop browsers. We audit security vulnerabilities, SSL encryption, and optimize assets to achieve sub-second load times.',
    deliverables: [
      'Google PageSpeed 95+ Core Web Vitals certificate',
      'Cross-browser & mobile device validation audit',
      'OWASP security & credential exposure scan'
    ],
    clientInvolvement: 'Final user acceptance approval'
  },
  {
    number: '05',
    title: 'Production Deploy & Code Handover',
    shortTitle: 'Launch',
    dayRange: 'Day 13 – 14',
    icon: Rocket,
    color: 'text-rose-400',
    badge: '100% Ownership',
    desc: 'Zero-downtime production deployment to your custom domain with global CDN caching and SSL certificates. Full source code repositories transferred directly to your organization.',
    deliverables: [
      'Production deployment on high-speed cloud servers',
      'Complete Git repository source code ownership transfer',
      'Admin portal credentials & documentation walkthrough'
    ],
    clientInvolvement: 'Receive final production deployment and keys'
  },
  {
    number: '06',
    title: 'Continuous Monitoring & 24/7 SLA',
    shortTitle: 'Growth SLA',
    dayRange: 'Ongoing',
    icon: HeartHandshake,
    color: 'text-purple-400',
    badge: '99.9% Uptime',
    desc: 'Proactive 24/7 server monitoring, daily automated database snapshots, feature iterations, and guaranteed SLA response windows for enterprise peace of mind.',
    deliverables: [
      '24/7 automated uptime & error tracking',
      'Daily offsite database backups & disaster recovery',
      'Dedicated WhatsApp & Support Desk access'
    ],
    clientInvolvement: 'Relax while we manage your tech infrastructure'
  }
]

export const ProjectRoadmapStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const current = ROADMAP_STEPS[activeStep]
  const Icon = current.icon

  return (
    <div className="space-y-10">
      
      {/* ── Interactive Horizontal Progress Stepper ── */}
      <div className="relative">
        
        {/* Background Progress Bar */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-white/10 rounded-full hidden md:block">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${(activeStep / (ROADMAP_STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Stepper Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 relative z-10">
          {ROADMAP_STEPS.map((step, idx) => {
            const isPassed = idx <= activeStep
            const isCurrent = idx === activeStep
            const StepIcon = step.icon

            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`p-3.5 rounded-2xl border transition-all duration-300 text-left flex flex-col items-center md:items-start space-y-2 cursor-pointer ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-950/40 dark:bg-emerald-950/40 light:bg-emerald-50/80 light:border-emerald-500 shadow-xl shadow-emerald-500/20 light:shadow-emerald-500/10 scale-[1.03]'
                    : isPassed
                      ? 'border-white/20 dark:border-white/20 light:border-slate-200 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white hover:border-white/30 light:hover:border-slate-300'
                      : 'border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/30 dark:bg-slate-900/30 light:bg-slate-50/60 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                      : isPassed
                        ? 'bg-emerald-500/20 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 light:bg-emerald-100'
                        : 'bg-white/5 dark:bg-white/5 light:bg-slate-200/70 text-slate-400 light:text-slate-500'
                  }`}>
                    <StepIcon size={16} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 light:text-slate-500">
                    {step.number}
                  </span>
                </div>

                <div className="w-full text-center md:text-left">
                  <div className="text-xs font-bold text-white dark:text-white light:text-slate-900 font-display truncate">
                    {step.shortTitle}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 dark:text-emerald-400 light:text-emerald-700 truncate">
                    {step.dayRange}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Active Milestone Detailed Showcase Card ── */}
      <div className="p-6 sm:p-10 rounded-3xl border border-white/15 dark:border-white/15 light:border-slate-200 bg-gradient-to-br from-[#080b14]/95 via-slate-900/90 to-emerald-950/20 dark:from-[#080b14]/95 dark:via-slate-900/90 dark:to-emerald-950/20 light:from-white light:via-slate-50/90 light:to-emerald-50/40 shadow-2xl dark:shadow-black/50 light:shadow-slate-200/70 backdrop-blur-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Description Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 light:bg-emerald-50 light:border-emerald-300 text-xs font-mono font-bold">
                PHASE {current.number} OF 06
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 dark:text-indigo-300 light:text-indigo-700 light:bg-indigo-50 light:border-indigo-300 text-xs font-bold">
                {current.badge}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono flex items-center gap-1.5 ml-auto">
                <Clock size={13} className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
                <span>Timeline: {current.dayRange}</span>
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 font-display flex items-center gap-3">
                <span className={current.color}><Icon size={28} /></span>
                <span>{current.title}</span>
              </h3>
              <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 font-light leading-relaxed">
                {current.desc}
              </p>
            </div>

            {/* Client Involvement Pill */}
            <div className="p-3.5 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 flex items-center gap-3 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
              <Award size={16} className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600 shrink-0" />
              <div>
                <strong className="text-white dark:text-white light:text-slate-900">Your Role: </strong>
                <span>{current.clientInvolvement}</span>
              </div>
            </div>
          </div>

          {/* Right Deliverables Column */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100/70 border border-white/10 dark:border-white/10 light:border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 dark:text-emerald-400 light:text-emerald-700 font-display">
              <FileCode2 size={16} /> Phase Deliverables &amp; Output
            </div>

            <div className="space-y-3">
              {current.deliverables.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200 dark:text-slate-200 light:text-slate-700">
                  <CheckCircle2 size={15} className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500">
              <span className="font-mono">100% Quality Checked</span>
              <a
                href="https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20would%20like%20to%20discuss%20the%20project%20roadmap%20timeline."
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 dark:text-emerald-400 light:text-emerald-700 hover:text-emerald-300 light:hover:text-emerald-800 font-bold inline-flex items-center gap-1 transition-colors"
              >
                <span>Ask about this phase</span>
                <ArrowRight size={12} />
              </a>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default ProjectRoadmapStepper
