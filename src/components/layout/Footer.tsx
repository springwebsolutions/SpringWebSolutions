import React from 'react'
import { Link } from 'react-router-dom'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { Mail, Phone, MapPin, Headphones } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export const Footer: React.FC = () => {
  const { siteConfig, navigation } = usePageBuilderStore()

  const rawFooter = navigation?.footer_links || [
    {
      heading: 'Solutions',
      links: [
        { label: 'Website Design', href: '/#services' },
        { label: 'SaaS Engineering', href: '/#services' },
        { label: 'Workflow Automation', href: '/#services' },
        { label: 'Technical SEO', href: '/#services' }
      ]
    },
    {
      heading: 'Ecosystem',
      links: [
        { label: 'Digital Products', href: '/marketplace' },
        { label: 'Blog & Articles', href: '/blog' },
        { label: 'Knowledge Base', href: '/kb' },
        { label: 'Client Support Portal', href: '/support' }
      ]
    },
    {
      heading: 'Company',
      links: [
        { label: 'Our Agency', href: '/#about' },
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
          <div className="flex items-center gap-3 flex-wrap self-start md:self-auto">
            <Link to="/contact" className="btn-primary shadow-lg shadow-blue-500/20 hover:scale-105 transition-all duration-300">
              Get in Touch
            </Link>
            <Link to="/support" className="btn-secondary flex items-center gap-2 hover:scale-105 transition-all duration-300">
              <Headphones size={15} />
              <span>Client Support</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Logo & Intro Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center">
              <Logo size="md" />
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
                    <Link to={link.href} className="hover:text-emerald-500 hover:translate-x-1 inline-flex items-center transition-all duration-200">
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
            <a href="/support" className="hover:text-emerald-500">Support Desk</a>
            <a href="/sitemap.xml" className="hover:text-emerald-500">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
