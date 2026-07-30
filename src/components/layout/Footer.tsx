import React from 'react'
import { Link } from 'react-router-dom'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { Mail, Phone, MapPin, Headphones, ArrowRight, ShieldCheck, Sparkles, Code2, Globe } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import AnimatedBackground from '../ui/AnimatedBackground'

export const Footer: React.FC = () => {
  const { siteConfig, navigation } = usePageBuilderStore()

  const rawFooter = navigation?.footer_links || [
    {
      heading: 'Engineered Solutions',
      links: [
        { label: 'Website & Web App Development', href: '/#services' },
        { label: 'Android & Mobile App Dev', href: '/#services' },
        { label: 'Windows Desktop Applications', href: '/#services' },
        { label: 'Custom CRM & SaaS Engineering', href: '/#services' },
        { label: 'Technical SEO & Search Growth', href: '/#services' }
      ]
    },
    {
      heading: 'Ecosystem & Marketplace',
      links: [
        { label: 'Digital Marketplace & Software', href: '/marketplace' },
        { label: 'Knowledge Base & Guides', href: 'https://careers.springwebsolutions.in/kb' },
        { label: 'Careers & Vacancies', href: '/careers' },
        { label: 'Client Support Portal', href: '/support' }
      ]
    },
    {
      heading: 'Company & Support',
      links: [
        { label: 'About SpringWeb Solutions', href: '/#about' },
        { label: 'Portfolio & Showcase', href: '/portfolio' },
        { label: 'Why Choose Us', href: '/#comparison' },
        { label: 'Case Studies', href: '/#case-studies' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Support Desk', href: '/support' }
      ]
    }
  ]

  const footerLinks = rawFooter.map((section: any) => ({
    ...section,
    links: (section.links || []).filter((l: any) => {
      const href = (l.href || '').toLowerCase()
      const label = (l.label || '').toLowerCase()
      return href !== '/downloads' && href !== '/pricing' && label !== 'download center' && label !== 'pricing'
    })
  }))

  const companyName = siteConfig?.company_name || 'Spring Web Solutions'
  const tagLine = siteConfig?.tagline || 'Building High-Speed Websites, Mobile Apps, Windows Software & Cloud Automation Ecosystems.'
  const email = siteConfig?.contact_email || 'hello@springwebsolutions.in'
  const phone = siteConfig?.contact_phone || '+91 80126 22119'
  const address = siteConfig?.address || 'Udumalpet, Tamil Nadu, India'

  return (
    <footer className="relative overflow-hidden w-full bg-[#040509] dark:bg-[#040509] light:bg-slate-50 border-t border-white/10 light:border-slate-200 pt-20 pb-12 mt-auto transition-colors duration-300">
      
      {/* ── Background Animation System ── */}
      <AnimatedBackground accent="indigo" particleCount={16} beams geoShapes />

      {/* ── Radial Glow Spotlights ── */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-400/10 filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[25rem] h-[25rem] rounded-full bg-indigo-600/10 dark:bg-indigo-600/10 light:bg-indigo-400/10 filter blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Large Glassmorphic CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#080b14]/90 dark:bg-[#080b14]/90 light:bg-white border border-white/10 light:border-slate-200 shadow-2xl light:shadow-xl backdrop-blur-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative overflow-hidden group">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 light:text-emerald-600 text-xs font-bold uppercase tracking-wider font-display">
              <Sparkles size={13} /> Ready to Upgrade Your Digital Infrastructure?
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white dark:text-white light:text-slate-900 leading-tight">
              Let's craft something <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 light:from-emerald-600 light:to-indigo-600">extraordinary</span>.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 light:text-slate-600 font-light leading-relaxed">
              Get a custom proposal, technical architecture audit, or free consultation for your web app, mobile software, or CRM project.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap shrink-0">
            <Link
              to="/contact"
              className="btn-primary flex items-center gap-2 px-7 py-3.5 shadow-xl shadow-blue-500/30 hover:scale-105 transition-all duration-300 text-xs font-bold uppercase tracking-wider"
            >
              <span>Get in Touch</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/support"
              className="px-6 py-3.5 rounded-xl bg-white/10 dark:bg-white/10 light:bg-slate-100 border border-white/15 light:border-slate-300 text-white dark:text-white light:text-slate-800 hover:bg-white/20 light:hover:bg-slate-200 flex items-center gap-2 hover:scale-105 transition-all duration-300 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <Headphones size={15} />
              <span>Support Desk</span>
            </Link>
          </div>
        </div>

        {/* Multi-Column Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Contact Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-sm font-sans font-light leading-relaxed">
              {tagLine}
            </p>
            
            {/* Contact Details */}
            <div className="space-y-3 text-sm text-slate-300 dark:text-slate-300 light:text-slate-700 font-sans font-light">
              <div className="flex items-center space-x-2.5">
                <Mail size={16} className="text-emerald-400 light:text-emerald-600 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-emerald-400 light:hover:text-emerald-600 transition-colors font-mono text-xs">{email}</a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone size={16} className="text-emerald-400 light:text-emerald-600 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-emerald-400 light:hover:text-emerald-600 transition-colors font-mono text-xs">{phone}</a>
              </div>
              <div className="flex items-start space-x-2.5">
                <MapPin size={16} className="text-emerald-400 light:text-emerald-600 mt-0.5 shrink-0" />
                <span className="leading-snug text-xs">{address}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 light:text-emerald-700 text-[11px] font-semibold flex items-center gap-1.5 font-mono">
                <ShieldCheck size={13} /> 100% Code Ownership
              </span>
              <span className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 light:text-indigo-700 text-[11px] font-semibold flex items-center gap-1.5 font-mono">
                <Code2 size={13} /> Zero Bloatware
              </span>
            </div>
          </div>

          {/* Dynamic Link Groups */}
          {footerLinks.map((group: any, idx: number) => (
            <div key={idx} className="space-y-4">
              <h3 className="font-display text-xs font-bold tracking-widest text-slate-200 dark:text-slate-200 light:text-slate-900 uppercase">
                {group.heading}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                {group.links.map((link: any, lIdx: number) => (
                  <li key={lIdx}>
                    <Link to={link.href} className="hover:text-emerald-400 dark:hover:text-emerald-400 light:hover:text-emerald-600 hover:translate-x-1 inline-flex items-center transition-all duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Legal & Location Row */}
        <div className="pt-8 border-t border-white/10 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 gap-4">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          
          <div className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-sans text-center sm:text-right flex items-center justify-center gap-1.5 flex-wrap">
            <Globe size={13} className="text-emerald-400 light:text-emerald-600 shrink-0" />
            <span>Engineering Web &amp; Software Solutions in </span>
            <strong className="text-slate-200 dark:text-slate-200 light:text-slate-800 font-semibold">Udumalpet, Tamil Nadu, India</strong>
            <span> &amp; Worldwide.</span>
          </div>

          <div className="flex items-center space-x-6 text-xs">
            <Link to="/careers" className="hover:text-emerald-400 light:hover:text-emerald-600 transition-colors">Careers</Link>
            <Link to="/support" className="hover:text-emerald-400 light:hover:text-emerald-600 transition-colors">Support Desk</Link>
            <a href="/sitemap.xml" className="hover:text-emerald-400 light:hover:text-emerald-600 transition-colors">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer

