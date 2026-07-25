import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { SectionRenderer } from '@/components/dynamic/SectionRenderer'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ShieldAlert, Database, Terminal, ArrowRight, Loader2 } from 'lucide-react'

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
    const checkAdmin = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data } = await supabase.rpc('has_super_admin')
          setHasSuperAdmin(!!data)
        } catch (e) {
          // fallback check
          setHasSuperAdmin(false)
        }
      }
    }
    checkAdmin()
  }, [])



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
              Spring Web Solutions has been scaffolded successfully! To boot up the dynamic CMS, blog, marketplace, CRM, and admin panel, you must link it to a PostgreSQL database via a Supabase instance.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-normal text-slate-900 dark:text-white flex items-center gap-2 font-display lowercase">
              <Terminal size={16} className="text-brand-emerald" />
              <span>Step-by-Step Local Setup Instructions</span>
            </h2>
            
            <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-400 list-decimal list-inside bg-brand-sand/50 dark:bg-brand-dark/50 p-6 rounded-none border border-grid font-sans font-light">
              <li className="leading-relaxed">
                Create a project in your <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-brand-emerald underline font-semibold">Supabase Dashboard</a>.
              </li>
              <li className="leading-relaxed">
                Copy <code className="bg-brand-sand dark:bg-brand-dark px-1.5 py-0.5 border border-grid rounded text-xs text-brand-emerald">.env.example</code> to <code className="bg-brand-sand dark:bg-brand-dark px-1.5 py-0.5 border border-grid rounded text-xs text-brand-emerald">.env.local</code> in this directory:
                <pre className="bg-brand-sand dark:bg-brand-dark p-3 rounded border border-grid text-xs font-mono text-slate-700 dark:text-slate-300 mt-2 overflow-x-auto select-all">
                  Copy-Item .env.example .env.local
                </pre>
              </li>
              <li className="leading-relaxed">
                Configure your API credentials in <code className="bg-brand-sand dark:bg-brand-dark px-1.5 py-0.5 border border-grid rounded text-xs text-brand-emerald">.env.local</code>.
              </li>
              <li className="leading-relaxed">
                Deploy the schema: Open the Supabase SQL Editor and run the migration script:
                <pre className="bg-brand-sand dark:bg-brand-dark p-3 rounded border border-grid text-xs font-mono text-slate-700 dark:text-slate-300 mt-2 overflow-x-auto select-all">
                  supabase/migrations/20260609000000_core_platform_schema.sql
                </pre>
              </li>
              <li className="leading-relaxed">
                Seed core database assets (pages and metadata): Run the SQL contents inside:
                <pre className="bg-brand-sand dark:bg-brand-dark p-3 rounded border border-grid text-xs font-mono text-slate-700 dark:text-slate-300 mt-2 overflow-x-auto select-all">
                  supabase/seed.sql
                </pre>
              </li>
              <li className="leading-relaxed">
                Restart the local server to verify connection:
                <pre className="bg-brand-sand dark:bg-brand-dark p-3 rounded border border-grid text-xs font-mono text-slate-700 dark:text-slate-300 mt-2 overflow-x-auto select-all">
                  npm run dev
                </pre>
              </li>
            </ol>
          </div>
        </main>

        <footer className="h-16 border-t border-grid flex items-center justify-center text-xs text-slate-500 font-sans font-light lowercase">
          <p>© {new Date().getFullYear()} spring web solutions. all rights reserved.</p>
        </footer>
      </div>
    )
  }

  // Render Database Seeding Guide if pages are empty but admin exists
  if (isSupabaseConfigured && !loading && pages.length === 0 && hasSuperAdmin === true) {
    return (
      <div className="min-h-screen bg-brand-light dark:bg-brand-obsidian text-slate-800 dark:text-slate-200 flex flex-col justify-between transition-colors duration-300">
        <header className="h-16 border-b border-grid flex items-center justify-between px-8 bg-[#FDFBF7]/80 dark:bg-[#121110]/80 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="h-7 w-7 rounded-full border border-brand-emerald flex items-center justify-center font-display font-medium text-brand-emerald text-sm">s</span>
            <span className="font-display text-xl font-normal text-slate-900 dark:text-white lowercase">Spring Web Solutions</span>
          </div>
        </header>

        <main className="flex-grow max-w-3xl mx-auto px-6 py-16 flex flex-col justify-center space-y-8">
          <div className="p-8 rounded-none border border-grid bg-brand-sand dark:bg-brand-dark space-y-6 text-center">
            <div className="h-12 w-12 mx-auto rounded-full border border-brand-emerald flex items-center justify-center text-brand-emerald">
              <Database size={20} />
            </div>
            
            <h1 className="text-3xl font-normal text-slate-900 dark:text-white font-display lowercase leading-tight">
              platform initialized but <span className="italic-accent">seeding</span> is required
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xl mx-auto font-sans font-light">
              Spring Web Solutions has been successfully bootstrapped with a Super Admin! To display the landing page and website sections, you must seed the default content.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-normal text-slate-900 dark:text-white flex items-center gap-2 font-display lowercase">
              <Terminal size={16} className="text-brand-emerald" />
              <span>how to seed the database</span>
            </h2>
            
            <ol className="space-y-4 text-sm text-slate-600 dark:text-slate-400 list-decimal list-inside bg-brand-sand/50 dark:bg-brand-dark/50 p-6 rounded-none border border-grid font-sans font-light">
              <li className="leading-relaxed">
                open your <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-brand-emerald underline font-semibold">Supabase Dashboard</a>.
              </li>
              <li className="leading-relaxed">
                go to the <strong>SQL Editor</strong> tab on the left sidebar.
              </li>
              <li className="leading-relaxed">
                click <strong>New query</strong> to open a blank SQL query pane.
              </li>
              <li className="leading-relaxed">
                copy the entire contents of the seed file in your local workspace:
                <code className="block bg-brand-sand dark:bg-brand-dark p-2 border border-grid text-xs text-brand-emerald font-mono mt-2 select-all">
                  supabase/seed.sql
                </code>
              </li>
              <li className="leading-relaxed">
                paste the SQL commands into the editor and click <strong>Run</strong>.
              </li>
              <li className="leading-relaxed">
                refresh this page to load the seeded home page!
              </li>
            </ol>
          </div>

          <div className="flex justify-center">
            <Link to="/login" className="btn-secondary text-xs uppercase tracking-wider font-semibold">
              go to admin login
            </Link>
          </div>
        </main>

        <footer className="h-16 border-t border-grid flex items-center justify-center text-xs text-slate-500 font-sans font-light lowercase">
          <p>© {new Date().getFullYear()} spring web solutions. all rights reserved.</p>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-obsidian flex flex-col transition-colors duration-300">
      <Navbar />
      
      {/* Dynamic compiler compiling the dynamic layout grid sections */}
      <main className="flex-grow flex flex-col">
        {loading || (currentPage && currentPage.slug !== pageSlug) ? (
          <div className="flex-grow flex items-center justify-center text-brand-emerald min-h-[300px] py-20">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : !currentPage ? (
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
          <SectionRenderer sections={currentSections} />
        )}
      </main>

      <Footer />
    </div>
  )
}
export default DynamicPage
