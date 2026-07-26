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
    <footer className="w-full bg-[#040509] dark:bg-[#040509] light:bg-slate-100 border-t border-white/10 light:border-slate-200 pt-16 pb-12 mt-auto transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Large Typographic CTA Section */}
        <div className="border-b border-white/5 light:border-slate-200 pb-12 mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white dark:text-white light:text-slate-900">
            Let's craft something <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-600">meaningful</span>.
          </h2>
          <Link to="/contact" className="btn-primary self-start md:self-auto shadow-lg shadow-emerald-500/10">
            Get in Touch
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Logo & Intro Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">S</span>
              <span className="font-display text-xl font-bold tracking-tight text-white dark:text-white light:text-slate-900">
                {companyName}
              </span>
            </Link>
            <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-sm font-sans font-light leading-relaxed">
              {tagLine}
            </p>
            
            {/* Contact Details */}
            <div className="space-y-3 text-sm text-slate-400 dark:text-slate-400 light:text-slate-700 font-sans font-light">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-emerald-500" />
                <a href={`mailto:${email}`} className="hover:text-emerald-500 transition-colors">{email}</a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-emerald-500" />
                <a href={`tel:${phone}`} className="hover:text-emerald-500 transition-colors">{phone}</a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <span className="leading-snug">{address}</span>
              </div>
            </div>

            {/* Social Media Links Managed via Admin Panel */}
            {siteConfig?.social_links && Object.keys(siteConfig.social_links).length > 0 && (
              <div className="flex items-center space-x-2 pt-2">
                {siteConfig.social_links.github && (
                  <a href={siteConfig.social_links.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 light:border-slate-200 hover:text-white dark:hover:text-white light:hover:text-emerald-600 text-slate-400 transition-all flex items-center justify-center" title="GitHub">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Dynamic footer link structures */}
          {footerLinks.map((group: any, idx: number) => (
            <div key={idx} className="space-y-4">
              <h3 className="font-display text-sm font-semibold tracking-wider text-slate-200 dark:text-slate-200 light:text-slate-900 uppercase">
                {group.heading}
              </h3>
              <ul className="space-y-2 text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                {group.links.map((link: any, lIdx: number) => (
                  <li key={lIdx}>
                    <Link to={link.href} className="hover:text-emerald-500 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-16 pt-8 border-t border-white/5 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 light:text-slate-600 gap-4">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <div className="text-[11px] text-slate-500 dark:text-slate-500 light:text-slate-600 font-sans text-center sm:text-right">
            <span>Engineering Web &amp; Software Solutions in </span>
            <strong className="text-slate-400 dark:text-slate-400 light:text-slate-800 font-semibold">Udumalpet, Tamil Nadu, India</strong>
            <span> &amp; Worldwide.</span>
          </div>
          <div className="flex space-x-6">
            <a href="/privacy" className="hover:text-emerald-500">Privacy Policy</a>
            <a href="/terms" className="hover:text-emerald-500">Terms of Service</a>
            <a href="/sitemap.xml" className="hover:text-emerald-500">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
