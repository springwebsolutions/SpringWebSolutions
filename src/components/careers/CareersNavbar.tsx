import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Briefcase, BookOpen, Search, ArrowUpRight, Sparkles, Building2, HelpCircle } from 'lucide-react'

export const CareersNavbar: React.FC = () => {
  const location = useLocation()
  const path = location.pathname

  return (
    <header className="sticky top-0 z-50 bg-[#040509]/80 backdrop-blur-xl border-b border-white/10 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Subdomain Badge */}
        <Link to="/careers" className="flex items-center gap-3 group cursor-pointer">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-1.5 flex items-center justify-center group-hover:scale-105 transition-transform">
            <img src="/logo-emblem.png" alt="SpringWeb Careers" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                SpringWeb <span className="text-emerald-400 font-normal">Careers</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
                <Sparkles size={10} /> Vault
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-light hidden sm:block">
              Vacancies, Remote Jobs &amp; Educational Guides
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
          <Link
            to="/careers"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              path === '/careers' || path === '/jobs'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase size={14} />
            <span>Job Openings</span>
          </Link>

          <Link
            to="/career-guides"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              path.startsWith('/career-guides')
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen size={14} />
            <span>Educational Guides</span>
          </Link>

          <Link
            to="/kb"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              path.startsWith('/kb')
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle size={14} />
            <span>Knowledge Base</span>
          </Link>
        </nav>

        {/* Action Buttons & Main Site Switcher */}
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            <Building2 size={13} />
            <span>Employer Hire</span>
          </Link>

          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all flex items-center gap-1"
          >
            <span>Main Agency</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

      </div>
    </header>
  )
}
