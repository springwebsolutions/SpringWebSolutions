import React from 'react'
import { Link } from 'react-router-dom'
import { Smartphone, Monitor, Cpu, CheckCircle2, ArrowRight, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react'

export const AppDevelopmentSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#040509] border-b border-white/10 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest font-display">
            <Sparkles size={13} /> Native &amp; Cross-Platform Engineering
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight font-display">
            Android, iOS &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">Windows Software</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-sans font-light leading-relaxed">
            Beyond web engineering, we build high-speed native Android mobile apps, iOS applications, and powerful Windows desktop software tailored to your business operations.
          </p>
        </div>

        {/* Feature Cards Grid (3 Major Pillars) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Android & Mobile App Development */}
          <div className="group rounded-3xl bg-[#06080f] border border-white/10 p-6 sm:p-8 space-y-6 hover:border-emerald-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Android &amp; Mobile App Development</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans font-light">
                High-performance native Android apps (Kotlin) &amp; cross-platform iOS applications engineered for speed, offline synchronization, push notifications, and Google Play Store deployment.
              </p>
              
              <ul className="space-y-2 text-xs text-slate-300 font-sans pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Native Android (Kotlin / Jetpack Compose)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Cross-Platform Flutter &amp; React Native</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Google Play Store &amp; App Store Deployment</span>
                </li>
              </ul>
            </div>

            {/* Pure Software Image */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl group-hover:scale-[1.02] transition-transform duration-300">
              <img src="/app-dev.png" alt="Android & Mobile App Development UI" className="w-full h-48 object-cover" />
            </div>
          </div>

          {/* Card 2: Windows Desktop Software Engineering */}
          <div className="group rounded-3xl bg-[#06080f] border border-white/10 p-6 sm:p-8 space-y-6 hover:border-indigo-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Monitor size={24} />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Windows Desktop Application Engineering</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans font-light">
                Robust Windows desktop applications built with C# .NET, WPF, WinUI 3, and Electron. Integrated with local hardware, database sync, offline execution, and single-click MSI installers.
              </p>
              
              <ul className="space-y-2 text-xs text-slate-300 font-sans pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
                  <span>C# .NET / WinUI 3 / WPF Windows Apps</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
                  <span>Offline First &amp; High-Speed Database Sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
                  <span>Custom Desktop POS, ERP &amp; Billing Systems</span>
                </li>
              </ul>
            </div>

            {/* Pure Software Image */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl group-hover:scale-[1.02] transition-transform duration-300">
              <img src="/windows-dev.png" alt="Windows Desktop Software Application UI" className="w-full h-48 object-cover" />
            </div>
          </div>

          {/* Card 3: Custom Enterprise Software & API Pipelines */}
          <div className="group rounded-3xl bg-[#06080f] border border-white/10 p-6 sm:p-8 space-y-6 hover:border-teal-500/40 transition-all duration-300 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Enterprise Software Architecture</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans font-light">
                Unified software ecosystems connecting web portals, mobile apps, and Windows desktop clients to a single cloud database with microservices and automated API pipelines.
              </p>
              
              <ul className="space-y-2 text-xs text-slate-300 font-sans pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-teal-400 shrink-0" />
                  <span>Multi-Platform Sync (Web + Mobile + Desktop)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-teal-400 shrink-0" />
                  <span>Automated Cloud Backups &amp; Security Audits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-teal-400 shrink-0" />
                  <span>Full Source Code &amp; IP Rights Ownership</span>
                </li>
              </ul>
            </div>

            {/* Pure Software Image */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl group-hover:scale-[1.02] transition-transform duration-300">
              <img src="/software-suite.png" alt="Enterprise Software Architecture Suite" className="w-full h-48 object-cover" />
            </div>
          </div>

        </div>

        {/* CTA Footer Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#06080f] to-indigo-500/10 border border-white/15">
          <div>
            <h4 className="text-base font-bold text-white font-display">Need a Custom Mobile App or Windows Desktop Software?</h4>
            <p className="text-xs text-slate-400">Discuss your software specifications directly with our engineering team.</p>
          </div>
          <Link
            to="/contact"
            className="btn-primary text-xs py-3 px-6 flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-500/20 font-bold"
          >
            <span>Request App &amp; Software Quote</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default AppDevelopmentSection
