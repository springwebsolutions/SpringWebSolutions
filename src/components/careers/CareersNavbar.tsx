import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Briefcase, BookOpen, ArrowUpRight, Sparkles, Building2, HelpCircle, Menu, X } from 'lucide-react'

export const CareersNavbar: React.FC = () => {
  const location = useLocation()
  const path = location.pathname
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [path])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  return (
    <header className="sticky top-0 z-50 bg-[#040509]/90 backdrop-blur-xl border-b border-white/10 transition-colors duration-300">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        
        {/* Brand Logo & Subdomain Badge */}
        <Link to="/careers" className="flex items-center gap-3 group cursor-pointer shrink-0">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-1 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm shadow-emerald-500/10">
            <img
              src="/logo-emblem.png"
              alt="SpringWeb Careers"
              width={40}
              height={40}
              className="h-full w-full object-contain filter drop-shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors leading-none">
                SpringWeb <span className="text-emerald-400 font-semibold">Careers</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider hidden sm:inline-flex items-center gap-1 font-mono">
                <Sparkles size={10} /> Vault
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-light hidden xs:block mt-0.5 leading-none">
              Vacancies, Remote Jobs &amp; Educational Guides
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] border border-white/10 p-1 rounded-2xl">
          <Link
            to="/careers"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              path === '/careers' || path === '/jobs'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase size={14} />
            <span>Job Openings</span>
          </Link>

          <Link
            to="/career-guides"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              path.startsWith('/career-guides')
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen size={14} />
            <span>Educational Guides</span>
          </Link>

          <Link
            to="/kb"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              path.startsWith('/kb')
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle size={14} />
            <span>Knowledge Base</span>
          </Link>

          <Link
            to="/alerts"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              path.startsWith('/alerts')
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles size={14} className={path.startsWith('/alerts') ? 'text-slate-950' : 'text-amber-400'} />
            <span>Job Alerts</span>
          </Link>
        </nav>

        {/* Action Buttons & Main Site Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/contact"
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Building2 size={13} />
            <span>Employer Hire</span>
          </Link>

          <Link
            to="/"
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Main Agency</span>
            <ArrowUpRight size={13} />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#060810]/95 backdrop-blur-2xl px-4 py-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <Link
              to="/careers"
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition-colors ${
                path === '/careers' || path === '/jobs'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Briefcase size={16} />
              <span>Job Openings</span>
            </Link>

            <Link
              to="/career-guides"
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition-colors ${
                path.startsWith('/career-guides')
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <BookOpen size={16} />
              <span>Educational Career Guides</span>
            </Link>

            <Link
              to="/kb"
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition-colors ${
                path.startsWith('/kb')
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <HelpCircle size={16} />
              <span>Knowledge Base &amp; FAQ</span>
            </Link>

            <Link
              to="/alerts"
              className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition-colors ${
                path.startsWith('/alerts')
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sparkles size={16} className="text-amber-400" />
              <span>Job Alerts</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
            <Link
              to="/contact"
              className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-center text-slate-200 hover:bg-white/10 flex items-center justify-center gap-1.5"
            >
              <Building2 size={13} />
              <span>Employer Hire</span>
            </Link>

            <Link
              to="/"
              className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-center text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center gap-1"
            >
              <span>Main Agency</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
