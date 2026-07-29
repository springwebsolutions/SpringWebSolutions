import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { usePageBuilderStore, type SectionData } from '@/stores/pageBuilderStore'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { SectionRenderer } from '@/components/dynamic/SectionRenderer'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ShieldAlert, Database, Terminal, ArrowRight, Loader2 } from 'lucide-react'

// Helper to guarantee section order and layout consistency
const ensureFullSections = (_slug: string, fetchedSections: SectionData[]): SectionData[] => {
  return (fetchedSections || []).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
}

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()
  const pageSlug = slug || window.location.pathname.substring(1) || 'home'
  
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

  useEffect(() => {
    if (pageSlug === 'home') {
      document.title = 'Spring Web Solutions | Web, Android, iOS & Windows Software Development Agency in Udumalpet, Tamil Nadu, India'
    } else if (pageSlug === 'about') {
      document.title = 'About Us | Spring Web Solutions Engineering Team & Standards'
    } else if (pageSlug === 'services') {
      document.title = 'Our Services | Web Development, Android Apps, Windows Software & SEO'
    } else if (currentPage?.title) {
      document.title = `${currentPage.title} | Spring Web Solutions`
    }
  }, [pageSlug, currentPage])

  useEffect(() => {
    if (!loading) {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        setTimeout(() => {
          const targetEl = document.getElementById(hash)
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
      <Navbar />
      
      {/* Dynamic compiler compiling the dynamic layout grid sections */}
      <main className="flex-grow flex flex-col">
        {loading || (currentPage && currentPage.slug !== pageSlug) ? (
          <div className="flex-grow flex items-center justify-center text-brand-emerald min-h-[300px] py-20">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : !currentPage && pageSlug !== 'home' && pageSlug !== 'about' && pageSlug !== 'services' ? (
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
