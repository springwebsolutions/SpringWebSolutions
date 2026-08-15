import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { usePageBuilderStore, type SectionData } from '@/stores/pageBuilderStore'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { SectionRenderer } from '@/components/dynamic/SectionRenderer'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ShieldAlert, Database, Terminal, ArrowRight, Loader2 } from 'lucide-react'
import SEOHead from '@/components/seo/SEOHead'

// Helper to guarantee section order and layout consistency
const ensureFullSections = (slug: string, fetchedSections: SectionData[]): SectionData[] => {
  let list = fetchedSections || []
  if (slug === 'plans' || slug === 'pricing') {
    list = list.filter(s => s.type !== 'hero')
  }
  return list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
}

export const DynamicPage: React.FC = () => {
  const location = useLocation()
  const path = location.pathname.replace('/', '')
  const pageSlug = path === '' ? 'home' : path
  
  const { 
    currentPage, 
    currentSections, 
    loading, 
    fetchPageData, 
    fetchPages,
    pages 
  } = usePageBuilderStore()

  const [hasSuperAdmin, setHasSuperAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchPageData(pageSlug)
      fetchPages()
    }
  }, [pageSlug])

  // Get title and description per page
  const getSeoData = () => {
    if (pageSlug === 'home') {
      return {
        title: 'Spring Web Solutions | Web & App Engineering – Udumalpet',
        description: 'High-performance website development, custom ERP/CRM software, and mobile apps by Spring Web Solutions, Udumalpet. Contact us today for a free project quote!'
      }
    }
    if (pageSlug === 'about') {
      return {
        title: 'About Spring Web Solutions | Software Agency Udumalpet',
        description: "Discover Spring Web Solutions, Udumalpet's premier software engineering agency. Learn about our team, standards, and mission. Contact us to build today!"
      }
    }
    if (pageSlug === 'services') {
      return {
        title: 'Services | Spring Web Solutions Udumalpet',
        description: 'Explore custom web development, mobile apps, ERP/CRM software, and technical SEO services by Spring Web Solutions. Get in touch to transform your tech!'
      }
    }
    if (pageSlug === 'plans' || pageSlug === 'pricing') {
      return {
        title: 'Pricing Plans | Spring Web Solutions Udumalpet',
        description: 'View transparent pricing packages for web development, ERP/CRM software, and mobile apps by Spring Web Solutions. Request your custom quote today!'
      }
    }
    return {
      title: currentPage?.title ? `${currentPage.title} | Spring Web Solutions` : 'Spring Web Solutions | Digital Engineering Agency',
      description: 'Spring Web Solutions builds high-performance web applications, ERP/CRM software, and mobile apps. Contact us today to start your digital project!'
    }
  }

  const seoData = getSeoData()

  useEffect(() => {
    if (!loading) {
      const targetSectionId = window.location.hash.replace('#', '')
      if (targetSectionId) {
        setTimeout(() => {
          const targetEl = document.getElementById(targetSectionId)
          if (targetEl) {
            const navOffset = 70
            const elementPosition = targetEl.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - navOffset
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
          }
        }, 200)
      }
    }
  }, [loading, pageSlug])

  // Render Supabase Connection Guide if credentials are missing
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-brand-light dark:bg-brand-obsidian text-slate-800 dark:text-slate-200 flex flex-col justify-between transition-colors duration-300">
        <header className="h-16 border-b border-grid flex items-center justify-between px-8 bg-[#FDFBF7]/80 dark:bg-[#121110]/80 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="h-7 w-7 rounded-full border border-brand-emerald flex items-center justify-center font-display font-medium text-brand-emerald text-sm">s</span>
            <span className="font-display text-xl font-normal text-slate-900 dark:text-white lowercase">Spring Web Solutions</span>
          </div>
        </header>

        <main className="flex-grow max-w-3xl mx-auto px-6 py-12 flex flex-col justify-center space-y-8">
          <div className="p-8 rounded-none border border-grid bg-brand-sand dark:bg-brand-dark space-y-6 text-center">
            <div className="h-12 w-12 mx-auto rounded-full border border-brand-emerald flex items-center justify-center text-brand-emerald">
              <Database size={20} />
            </div>
            
            <h1 className="text-3xl font-normal text-slate-900 dark:text-white font-display lowercase leading-tight">
              database configuration <span className="italic-accent">required</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xl mx-auto font-sans font-light">
              Spring Web Solutions has been scaffolded successfully! To boot up the dynamic CMS, blog, marketplace, CRM, and admin panel, link it to your Supabase PostgreSQL instance.
            </p>
          </div>
        </main>

        <footer className="h-16 border-t border-grid flex items-center justify-center text-xs text-slate-500 font-sans font-light lowercase">
          <p>© {new Date().getFullYear()} spring web solutions. all rights reserved.</p>
        </footer>
      </div>
    )
  }

  const activeSections = ensureFullSections(pageSlug, currentSections)

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-obsidian flex flex-col transition-colors duration-300">
      <SEOHead title={seoData.title} description={seoData.description} />
      <Navbar />
      
      {/* Dynamic compiler compiling the dynamic layout grid sections */}
      <main id="main-content" className="flex-grow flex flex-col">
        {loading || (currentPage && currentPage.slug !== pageSlug) ? (
          <div className="flex-grow flex items-center justify-center text-brand-emerald min-h-[300px] py-20">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : currentPage?.is_published === false ? (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-800 dark:text-slate-200 px-4 py-16">
            <div className="p-8 sm:p-12 rounded-3xl border border-rose-500/20 glass-panel text-center max-w-lg space-y-6 bg-brand-sand dark:bg-brand-dark shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
                <ShieldAlert size={36} />
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest font-mono text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                  Page Disabled
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
                  Page Under Maintenance
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-sans font-light leading-relaxed">
                  The <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{pageSlug}</span> page is currently offline for scheduled updates or has been temporarily disabled by administrators.
                </p>
              </div>
              <div className="flex justify-center pt-2">
                <Link to="/" className="btn-primary flex items-center gap-2 text-sm font-semibold">
                  <span>Return to Homepage</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ) : !currentPage && !['home', 'about', 'services', 'plans', 'pricing'].includes(pageSlug) ? (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-800 dark:text-slate-200 px-4 py-16">
            <div className="p-8 rounded-none border border-grid glass-panel text-center max-w-md space-y-6 bg-brand-sand dark:bg-brand-dark">
              <ShieldAlert size={48} className="mx-auto text-brand-emerald" />
              <h1 className="text-3xl font-normal text-slate-900 dark:text-white font-display lowercase leading-tight">Page Not Found</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-sans font-light">
                The page slug you are looking for (slug: <code className="bg-brand-sand dark:bg-brand-dark px-1.5 py-0.5 border border-grid rounded text-xs text-brand-emerald font-mono">{pageSlug}</code>) has not been initialized or is set to draft.
              </p>
              <div className="flex justify-center pt-2">
                <Link to="/" className="btn-primary flex items-center gap-1.5 text-sm">
                  <span>Back to Home</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <SectionRenderer sections={activeSections} />
        )}
      </main>

      <Footer />
    </div>
  )
}
export default DynamicPage
