import React from 'react'
import { ShieldCheck, Cpu, Award, Terminal, Smartphone, Monitor } from 'lucide-react'

export const TeamSection: React.FC<{ content?: any; styling?: any }> = ({ content }) => {
  const title = content?.title || "Our Engineering Capabilities & Architecture"
  const subtitle = content?.subtitle || "Spring Web Solutions is powered by solution architects and software engineers building high-speed web applications, native Android apps, and Windows desktop software."

  const pillars = [
    {
      title: "Full-Stack Web Engineering",
      role: "Architecture & Frontend Performance",
      desc: "Specializing in high-speed React, Vite, Next.js, and TypeScript architectures that deliver sub-second response times and 100/100 Core Web Vitals scores.",
      icon: Terminal,
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
    },
    {
      title: "Android & Mobile App Development",
      role: "Native & Cross-Platform Mobile",
      desc: "High-performance native Android apps (Kotlin) & cross-platform iOS applications engineered for speed, offline synchronization, push notifications, and Google Play Store deployment.",
      icon: Smartphone,
      skills: ["Kotlin", "Android SDK", "Flutter", "React Native"]
    },
    {
      title: "Windows Desktop Application Engineering",
      role: "Native Windows Software",
      desc: "Robust Windows desktop applications built with C# .NET, WPF, WinUI 3, and Electron. Integrated with local hardware, database sync, offline execution, and single-click MSI installers.",
      icon: Monitor,
      skills: ["C# .NET", "WinUI 3", "WPF", "Electron", "MSI"]
    },
    {
      title: "Custom CRM & Database Systems",
      role: "Backend & Data Pipeline Security",
      desc: "Building proprietary business databases, Supabase/PostgreSQL integrations, real-time inventory systems, and automated API webhook pipelines.",
      icon: Cpu,
      skills: ["Node.js", "Python", "Supabase", "PostgreSQL"]
    },
    {
      title: "Enterprise Software Architecture",
      role: "Multi-Platform Cloud Integration",
      desc: "Unified software ecosystems connecting web portals, mobile apps, and Windows desktop clients to a single cloud database with microservices and automated API pipelines.",
      icon: Award,
      skills: ["REST APIs", "Microservices", "Cloud Backups", "IP Rights"]
    },
    {
      title: "Technical SEO & Search Dominance",
      role: "Organic Indexing & Growth",
      desc: "Structuring JSON-LD schema markups, canonical architecture, Google Search Console indexing, and local search visibility for Indian and global brands.",
      icon: ShieldCheck,
      skills: ["Structured Data", "Schema.org", "Core Web Vitals", "Local SEO"]
    }
  ]

  return (
    <section className="py-20 bg-[#040509] dark:bg-[#040509] light:bg-white text-slate-900 dark:text-white border-b border-white/5 light:border-slate-200 transition-colors duration-300 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest font-display">
            <Award size={13} /> Engineering Capabilities &amp; Standards
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-display text-white dark:text-white light:text-slate-900 uppercase">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 light:text-slate-600 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Unified 6-Pillars Grid (3 Column Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#080b14] dark:bg-[#080b14] light:bg-slate-50 border border-white/10 light:border-slate-200 light:shadow-sm hover:border-emerald-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 space-y-6 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 font-display">{pillar.title}</h3>
                    <div className="text-xs font-semibold text-emerald-400 mt-1">{pillar.role}</div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed font-sans font-light">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 light:border-slate-200 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Core Competencies:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {pillar.skills.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 light:border-slate-200 text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-700 hover:border-emerald-500/40 hover:text-emerald-400 hover:-translate-y-0.5 hover:scale-105 transition-all duration-200 cursor-default">
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
export default TeamSection
