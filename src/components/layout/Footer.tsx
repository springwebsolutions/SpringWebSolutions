import React from 'react'
import { Link } from 'react-router-dom'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { Mail, Phone, MapPin } from 'lucide-react'

export const Footer: React.FC = () => {
  const { siteConfig, navigation } = usePageBuilderStore()

  const rawFooter = navigation?.footer_links || [
    {
      heading: 'Solutions',
      links: [
        { label: 'Website Design', href: '/services' },
        { label: 'SaaS Engineering', href: '/services' },
        { label: 'Workflow Automation', href: '/services' },
        { label: 'SEO Services', href: '/services' }
      ]
    },
    {
      heading: 'Ecosystem',
      links: [
        { label: 'Digital Products', href: '/marketplace' },
        { label: 'Free Downloads', href: '/marketplace?filter=free' },
        { label: 'Blog & Articles', href: '/blog' },
        { label: 'Knowledge Base', href: '/kb' }
      ]
    },
    {
      heading: 'Company',
      links: [
        { label: 'Our Agency', href: '/about' },
        { label: 'Engineering Process', href: '/process' },
        { label: 'Contact Us', href: '/contact' }
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
  const tagLine = siteConfig?.tagline || 'Building Websites, Software & Automation That Help Businesses Grow'
  const email = siteConfig?.contact_email || 'hello@springwebsolutions.in'
  const phone = siteConfig?.contact_phone || '+91 80126 22119'
  const address = siteConfig?.address || 'Udumalpet, Tamil Nadu'

  return (
    <footer className="w-full bg-brand-obsidian border-t border-white/10 dark:bg-brand-obsidian light:bg-slate-50 light:border-slate-200 pt-16 pb-12 mt-auto transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Large Typographic CTA Section */}
        <div className="border-b border-white/5 light:border-slate-200 pb-12 mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 opacity-0 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white dark:text-white light:text-slate-900">
            Let's craft something <span className="text-gradient">meaningful</span>.
          </h2>
          <Link to="/contact" className="btn-primary self-start md:self-auto shadow-lg shadow-brand-emerald/10">
            Get in Touch
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Logo & Intro Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-emerald to-brand-indigo flex items-center justify-center font-bold text-white shadow-md">S</span>
              <span className="font-display text-xl font-bold tracking-tight text-white dark:text-white light:text-slate-900">
                {companyName}
              </span>
            </Link>
            <p className="text-sm text-slate-400 dark:text-slate-400 max-w-sm font-sans font-light leading-relaxed">
              {tagLine}
            </p>
            
            {/* Contact Details */}
            <div className="space-y-3 text-sm text-slate-400 light:text-slate-600 font-sans font-light">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-brand-emerald" />
                <a href={`mailto:${email}`} className="hover:text-brand-emerald transition-colors">{email}</a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-brand-emerald" />
                <a href={`tel:${phone}`} className="hover:text-brand-emerald transition-colors">{phone}</a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-brand-emerald mt-0.5 shrink-0" />
                <span className="leading-snug">{address}</span>
              </div>
            </div>

            {/* Social Media Links Managed via Admin Panel */}
            {siteConfig?.social_links && Object.keys(siteConfig.social_links).length > 0 && (
              <div className="flex items-center space-x-2 pt-2">
                {siteConfig.social_links.github && (
                  <a href={siteConfig.social_links.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:text-white hover:border-brand-emerald/40 text-slate-400 transition-all flex items-center justify-center" title="GitHub">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </a>
                )}
                {siteConfig.social_links.linkedin && (
                  <a href={siteConfig.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:text-white hover:border-brand-emerald/40 text-slate-400 transition-all flex items-center justify-center" title="LinkedIn">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
                {siteConfig.social_links.twitter && (
                  <a href={siteConfig.social_links.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:text-white hover:border-brand-emerald/40 text-slate-400 transition-all flex items-center justify-center" title="Twitter / X">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {siteConfig.social_links.instagram && (
                  <a href={siteConfig.social_links.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:text-white hover:border-brand-emerald/40 text-slate-400 transition-all flex items-center justify-center" title="Instagram">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {siteConfig.social_links.facebook && (
                  <a href={siteConfig.social_links.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:text-white hover:border-brand-emerald/40 text-slate-400 transition-all flex items-center justify-center" title="Facebook">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {siteConfig.social_links.youtube && (
                  <a href={siteConfig.social_links.youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:text-white hover:border-brand-emerald/40 text-slate-400 transition-all flex items-center justify-center" title="YouTube">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Dynamic footer link structures */}
          {footerLinks.map((group: any, idx: number) => (
            <div key={idx} className="space-y-4">
              <h3 className="font-display text-sm font-semibold tracking-wider text-slate-200 uppercase light:text-slate-800">
                {group.heading}
              </h3>
              <ul className="space-y-2 text-sm text-slate-400 light:text-slate-600">
                {group.links.map((link: any, lIdx: number) => (
                  <li key={lIdx}>
                    <Link to={link.href} className="hover:text-brand-emerald transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 light:border-slate-200 gap-4">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <div className="text-[11px] text-slate-600 dark:text-slate-500 font-sans text-center sm:text-right">
            <span>Engineering Web &amp; Software Solutions in </span>
            <strong className="text-slate-400 dark:text-slate-400 font-semibold">Udumalpet, Tamil Nadu, India</strong>
            <span> &amp; Worldwide.</span>
          </div>
          <div className="flex space-x-6">
            <a href="/privacy" className="hover:text-brand-emerald">Privacy Policy</a>
            <a href="/terms" className="hover:text-brand-emerald">Terms of Service</a>
            <a href="/sitemap.xml" className="hover:text-brand-emerald">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
