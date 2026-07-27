import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Briefcase, MapPin, Sparkles, BookOpen, ShieldCheck, Mail, 
  ExternalLink, Heart, Globe, ArrowRight, Laptop, Building2, Zap
} from 'lucide-react'

export const CareersFooter: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#030407] border-t border-white/10 text-slate-400 text-xs font-sans relative z-10 transition-colors duration-300">
      
      {/* Upper Employer Callout Banner */}
      <div className="border-b border-white/5 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-indigo-500/10 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
              <Sparkles size={13} /> Hiring Talent for Your Company?
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              Post Your Company Vacancies Across Tamil Nadu &amp; All-India
            </h3>
            <p className="text-xs text-slate-400 font-light max-w-xl">
              Reach thousands of active software engineers, mobile developers, SEO specialists, and remote professionals.
            </p>
          </div>

          <a
            href="mailto:careers@springwebsolutions.in?subject=Employer%20Job%20Posting%20Inquiry"
            className="py-3 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Post a Vacancy</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Main Footer Links Matrix */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Portal Mission */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">
                W
              </div>
              <div>
                <div className="font-black text-lg text-white font-display uppercase tracking-tight flex items-center gap-2">
                  SpringWeb <span className="text-emerald-400 font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">CAREERS</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Vacancies, WFH &amp; Career Guides Portal</div>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed font-light">
              SpringWeb Careers Vault connects talent with verified job opportunities across Udumalpet, Coimbatore, Chennai, Tamil Nadu statewide, Pan-India metros, and high-paying International Remote/WFH contracts.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-emerald-400 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} /> 100% Verified Vacancies
              </div>
              <div className="flex items-center gap-1.5">
                <Globe size={14} /> Global &amp; Local Reach
              </div>
            </div>
          </div>

          {/* Column 2: Openings by Location */}
          <div className="space-y-4">
            <h4 className="font-bold text-white font-display text-sm uppercase tracking-wider text-[11px] border-b border-white/5 pb-2">
              Jobs by Region
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/jobs?loc=Tamil%20Nadu" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <MapPin size={12} className="text-emerald-400" /> Tamil Nadu Statewide
                </Link>
              </li>
              <li>
                <Link to="/jobs?loc=Chennai" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <MapPin size={12} className="text-emerald-400" /> Chennai Metro Openings
                </Link>
              </li>
              <li>
                <Link to="/jobs?loc=Coimbatore" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <MapPin size={12} className="text-emerald-400" /> Coimbatore &amp; Tiruppur
                </Link>
              </li>
              <li>
                <Link to="/jobs?loc=Udumalpet" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <MapPin size={12} className="text-emerald-400" /> Udumalpet &amp; Local Area
                </Link>
              </li>
              <li>
                <Link to="/jobs?loc=India" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <MapPin size={12} className="text-emerald-400" /> All-India Metros
                </Link>
              </li>
              <li>
                <Link to="/jobs?wfh=true" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Laptop size={12} className="text-emerald-400" /> 100% Work From Home (WFH)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Employment Niches */}
          <div className="space-y-4">
            <h4 className="font-bold text-white font-display text-sm uppercase tracking-wider text-[11px] border-b border-white/5 pb-2">
              Employment Niches
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/jobs?q=Software" className="hover:text-emerald-400 transition-colors">
                  Software &amp; Web Engineering
                </Link>
              </li>
              <li>
                <Link to="/jobs?q=Android" className="hover:text-emerald-400 transition-colors">
                  Android &amp; iOS Mobile Apps
                </Link>
              </li>
              <li>
                <Link to="/jobs?q=Desktop" className="hover:text-emerald-400 transition-colors">
                  Windows Desktop (.NET / C#)
                </Link>
              </li>
              <li>
                <Link to="/jobs?q=SEO" className="hover:text-emerald-400 transition-colors">
                  Technical SEO &amp; Growth
                </Link>
              </li>
              <li>
                <Link to="/jobs?q=Automation" className="hover:text-emerald-400 transition-colors">
                  Business Automation &amp; Data
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Educational Guides & Main Agency */}
          <div className="space-y-4">
            <h4 className="font-bold text-white font-display text-sm uppercase tracking-wider text-[11px] border-b border-white/5 pb-2">
              Career Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/career-guides" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <BookOpen size={12} className="text-emerald-400" /> Educational Career Guides
                </Link>
              </li>
              <li>
                <Link to="/career-guides/technical-interview-prep-roadmap" className="hover:text-emerald-400 transition-colors">
                  Interview Roadmaps
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.springwebsolutions.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-emerald-400 font-bold"
                >
                  <span>Main Agency Website</span>
                  <ExternalLink size={11} />
                </a>
              </li>
              <li>
                <a 
                  href="https://suite.springwebsolutions.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>Operations Suite Admin</span>
                  <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © {currentYear} SpringWeb Solutions (careers.springwebsolutions.in). All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link to="/jobs" className="hover:text-slate-300 transition-colors">All Vacancies</Link>
            <Link to="/career-guides" className="hover:text-slate-300 transition-colors">Career Guides</Link>
            <a href="mailto:careers@springwebsolutions.in" className="hover:text-slate-300 transition-colors">Support &amp; Feedback</a>
          </div>
        </div>

      </div>

    </footer>
  )
}
