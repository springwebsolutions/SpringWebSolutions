import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { isSupabaseConfigured } from '@/lib/supabase'
import { SectionRenderer } from '@/components/dynamic/SectionRenderer'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ShieldAlert, Database, Terminal, ArrowRight, Loader2 } from 'lucide-react'

export const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()
  const pageSlug = slug || 'home'
  
  const { 
    currentPage, 
    currentSections, 
    loading, 
    fetchPageData, 
    fetchPages,
    pages 
  } = usePageBuilderStore()

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchPageData(pageSlug)
      fetchPages()
    }
  }, [pageSlug])

  // Redirect to setup wizard if database is empty of pages
  useEffect(() => {
    if (isSupabaseConfigured && !loading && pages.length === 0) {
      // Check if setup is needed
      navigate('/setup')
    }
  }, [pages, loading])

  // Render Supabase Connection Guide if credentials are missing
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-[#070a13] text-slate-200 flex flex-col justify-between">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#070a13]/80 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-emerald to-brand-indigo flex items-center justify-center font-bold text-white shadow-md">S</span>
            <span className="font-display text-xl font-bold tracking-tight text-white">Spring Web Solutions</span>
          </div>
        </header>

        <main className="flex-1 max-w-3xl mx-auto px-6 py-12 flex flex-col justify-center space-y-8">
          <div className="p-8 rounded-3xl glass-panel border border-white/5 space-y-6 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-brand-emerald/10 flex items-center justify-center text-brand-emerald">
              <Database size={32} />
            </div>
            
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Database Configuration Required</h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
              Spring Web Solutions has been scaffolded successfully! To boot up the dynamic CMS, blog, marketplace, CRM, and admin panel, you must link it to a PostgreSQL database via a Supabase instance.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal size={18} className="text-brand-emerald" />
              <span>Step-by-Step Local Setup Instructions</span>
            </h2>
            
            <ol className="space-y-3 text-sm text-slate-400 list-decimal list-inside bg-white/5 p-6 rounded-2xl border border-white/5">
              <li className="leading-loose">
                Create a project in your <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-brand-emerald underline font-semibold">Supabase Dashboard</a>.
              </li>
              <li className="leading-loose">
                Copy <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs text-white">.env.example</code> to <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs text-white">.env.local</code> in this directory:
                <pre className="bg-[#090d16] p-3 rounded-lg text-xs font-mono text-emerald-400 border border-white/5 mt-2 overflow-x-auto">
                  Copy-Item .env.example .env.local
                </pre>
              </li>
              <li className="leading-loose">
                Configure your API credentials in <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs text-white">.env.local</code>.
              </li>
              <li className="leading-loose">
                Deploy the schema: Open the Supabase SQL Editor and run the migration script:
                <pre className="bg-[#090d16] p-3 rounded-lg text-xs font-mono text-emerald-400 border border-white/5 mt-2 overflow-x-auto">
                  supabase/migrations/20260609000000_core_platform_schema.sql
                </pre>
              </li>
              <li className="leading-loose">
                Seed core database assets (pages and metadata): Run the SQL contents inside:
                <pre className="bg-[#090d16] p-3 rounded-lg text-xs font-mono text-emerald-400 border border-white/5 mt-2 overflow-x-auto">
                  supabase/seed.sql
                </pre>
              </li>
              <li className="leading-loose">
                Restart the local server to verify connection:
                <pre className="bg-[#090d16] p-3 rounded-lg text-xs font-mono text-emerald-400 border border-white/5 mt-2 overflow-x-auto">
                  npm run dev
                </pre>
              </li>
            </ol>
          </div>
        </main>

        <footer className="h-16 border-t border-white/5 flex items-center justify-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Spring Web Solutions. All rights reserved.</p>
        </footer>
      </div>
    )
  }

  // Loading indicator
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a13] flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center text-brand-emerald">
          <Loader2 className="animate-spin" size={48} />
        </div>
        <Footer />
      </div>
    )
  }

  // Not Found fallback
  if (!currentPage) {
    return (
      <div className="min-h-screen bg-[#070a13] flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-slate-200 px-4">
          <div className="p-8 rounded-3xl glass-panel text-center max-w-md space-y-6">
            <ShieldAlert size={64} className="mx-auto text-brand-indigo" />
            <h1 className="text-3xl font-extrabold text-white">Page Not Found</h1>
            <p className="text-slate-400 text-sm">
              The page slug you are looking for (slug: <code className="bg-white/10 px-1 rounded text-white">{pageSlug}</code>) has not been initialized or is set to draft.
            </p>
            <div className="flex justify-center pt-2">
              <Link to="/" className="btn-primary flex items-center gap-1.5 text-sm">
                <span>Back to Home</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col transition-colors dark:bg-[#070a13] light:bg-[#f8fafc]">
      <Navbar />
      
      {/* Dynamic compiler compiling the dynamic layout grid sections */}
      <main className="flex-grow">
        <SectionRenderer sections={currentSections} />
      </main>

      <Footer />
    </div>
  )
}
export default DynamicPage
