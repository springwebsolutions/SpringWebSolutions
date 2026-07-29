import React from 'react'
import { ShieldCheck, Cpu, Award, Terminal, Smartphone, Monitor, MapPin, Code2, Check, Zap, Globe } from 'lucide-react'
import AnimatedBackground from '../ui/AnimatedBackground'

interface AboutSectionProps {
  content?: {
    title?: string
    subtitle?: string
  }
  styling?: any
}

export const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
  const title = content?.title || "ABOUT SPRINGWEB SOLUTIONS & OUR ENGINEERING ARCHITECTURE"
  const subtitle = content?.subtitle || "SpringWeb Solutions is a solution engineering agency based in Udumalpet, Tamil Nadu, India. We build high-speed web applications, native Android mobile apps, Windows desktop software, and automated lead CRM ecosystems for global businesses."

  const pillars = [
    {
      title: "Full-Stack Web Engineering",
      role: "Architecture & Frontend Performance",
      desc: "Specializing in high-speed React, Vite, Next.js, and TypeScript architectures that deliver sub-second response times and 100/100 Core Web Vitals scores.",
      icon: Terminal,
      skills: ["React 19", "Next.js 15", "TypeScript", "Tailwind CSS"]
    },
    {
      title: "Android & Mobile App Development",
      role: "Native & Cross-Platform Mobile",
      desc: "High-performance native Android apps (Kotlin) & cross-platform iOS applications engineered for speed, offline synchronization, push notifications, and Google Play Store deployment.",
      icon: Smartphone,
      skills: ["Kotlin", "Android SDK", "Flutter", "Play Store API"]
    },
    {
      title: "Windows Desktop Application Engineering",
      role: "Native Windows Software",
      desc: "Robust Windows desktop applications built with C# .NET, WPF, WinUI 3, and Electron. Integrated with local hardware, database sync, offline execution, and single-click MSI installers.",
      icon: Monitor,
      skills: ["C# .NET", "WinUI 3", "WPF", "MSI Installer"]
    },
    {
      title: "Custom CRM & Automated Workflows",
      role: "Backend & Lead Automation",
      desc: "Building proprietary business databases, Supabase/PostgreSQL integrations, real-time inventory systems, instant WhatsApp lead webhooks, and automated CRM pipelines.",
      icon: Zap,
      skills: ["WhatsApp API", "Supabase", "PostgreSQL", "Node.js"]
    },
    {
      title: "Enterprise Software Architecture",
      role: "Multi-Platform Cloud Integration",
      desc: "Unified software ecosystems connecting web portals, mobile apps, and Windows desktop clients to a single cloud database with microservices and automated API pipelines.",
      icon: Cpu,
      skills: ["REST APIs", "Microservices", "Cloud Backups", "Data Encryption"]
    },
    {
      title: "Technical SEO & Search Dominance",
      role: "Organic Indexing & Growth",
      desc: "Structuring JSON-LD schema markups, canonical architecture, Google Search Console indexing, and local search visibility for Indian and global brands.",
      icon: ShieldCheck,
      skills: ["Structured Schema", "Core Web Vitals", "Google Indexing", "Local SEO"]
    }
  ]

  return (
    <section id="about" className="py-24 bg-[#040509] dark:bg-[#040509] light:bg-slate-50 text-slate-900 dark:text-white border-b border-white/5 light:border-slate-200 transition-colors duration-300 relative overflow-hidden">
      <AnimatedBackground accent="emerald" scanLine grid particleCount={22} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest font-display">
            <Award size={14} /> ABOUT SPRINGWEB SOLUTIONS
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-display text-white dark:text-white light:text-slate-900 uppercase leading-tight">
            {title}
          </h2>
          
          <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 light:text-slate-600 font-light leading-relaxed max-w-3xl mx-auto">
            {subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400 light:text-slate-600">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-400" />
              <span>Udumalpet, Tamil Nadu, India</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <Code2 size={14} className="text-emerald-400" />
              <span>Clean Code &amp; Zero Bloatware Guarantee</span>
            </span>
          </div>
        </div>

        {/* 6-Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#080b14] dark:bg-[#080b14] light:bg-white border border-white/10 light:border-slate-200 light:shadow-sm hover:border-emerald-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 space-y-6 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 font-display group-hover:text-emerald-400 transition-colors">
                      {pillar.title}
                    </h3>
                    <div className="text-xs font-semibold text-emerald-400 mt-1">{pillar.role}</div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed font-sans font-light">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 light:border-slate-200 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Core Technologies:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {pillar.skills.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-700 hover:border-emerald-500/40 hover:text-emerald-400 transition-all duration-200 cursor-default font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
export default AboutSection
