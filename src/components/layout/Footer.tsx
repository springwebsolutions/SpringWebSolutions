import React from 'react'
import { Link } from 'react-router-dom'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export const Footer: React.FC = () => {
  const { siteConfig, navigation } = usePageBuilderStore()

  const footerLinks = navigation?.footer_links || [
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
        { label: 'Marketplace Store', href: '/marketplace' },
        { label: 'Download Software', href: '/downloads' },
        { label: 'Knowledge Base', href: '/kb' },
        { label: 'Support Desk', href: '/support' }
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

  const companyName = siteConfig?.company_name || 'Spring Web Solutions'
  const tagLine = siteConfig?.tagline || 'Building Websites, Software & Automation That Help Businesses Grow'
  const email = siteConfig?.contact_email || 'hello@springwebsolutions.com'
  const phone = siteConfig?.contact_phone || '+1 (800) 555-0199'
  const address = siteConfig?.address || '100 Innovation Way, Suite 400, Tech City, TC 94016'

  return (
    <footer className="w-full bg-brand-obsidian border-t border-white/10 dark:bg-brand-obsidian light:bg-slate-50 light:border-slate-200 pt-16 pb-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Logo & Intro Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-emerald to-brand-indigo flex items-center justify-center font-bold text-white shadow-md">S</span>
              <span className="font-display text-xl font-bold tracking-tight text-white dark:text-white light:text-brand-dark">
                {companyName}
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm light:text-slate-600">
              {tagLine}
            </p>
            {/* Contact Details */}
            <div className="space-y-3 text-sm text-slate-400 light:text-slate-600">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-brand-emerald" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-brand-emerald" />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-brand-emerald mt-0.5 shrink-0" />
                <span className="leading-snug">{address}</span>
              </div>
            </div>
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
                    <Link to={link.href} className="hover:text-white transition-colors light:hover:text-slate-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 light:border-slate-200">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="/privacy" className="hover:text-slate-300">Privacy Policy</a>
            <a href="/terms" className="hover:text-slate-300">Terms of Service</a>
            <a href="/sitemap.xml" className="hover:text-slate-300">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
