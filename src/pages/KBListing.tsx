import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { CareersNavbar } from '@/components/careers/CareersNavbar'
import { CareersFooter } from '@/components/careers/CareersFooter'
import { Search, BookOpen, ChevronRight, HelpCircle, FileText, Loader2 } from 'lucide-react'

interface KBCategory {
  id: string
  name: string
  slug: string
  description: string | null
}

interface KBArticle {
  id: string
  title: string
  slug: string
  content: string
  category_id: string
  created_at: string
}

import SEOHead from '@/components/seo/SEOHead'

export const KBListing: React.FC = () => {
  const [categories, setCategories] = useState<KBCategory[]>([])
  const [articles, setArticles] = useState<KBArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      try {
        const [catRes, artRes] = await Promise.all([
          supabase
            .from('knowledge_base_categories')
            .select('*')
            .order('name', { ascending: true }),
          supabase
            .from('knowledge_base_articles')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
        ])

        setCategories(catRes.data || [])
        setArticles(artRes.data || [])
      } catch (err) {
        console.error('Error fetching Knowledge Base data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter articles based on search query and selected category
  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = !selectedCategory || art.category_id === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col dark:bg-[#070a13] light:bg-[#f8fafc]">
      <SEOHead
        title="Knowledge Base & Technical Help Guides | Spring Web Solutions"
        description="Explore technical documentation, setup guides, API tutorials, and troubleshooting articles by Spring Web Solutions. Search our help center today!"
      />
      <CareersNavbar />

      <main className="flex-grow py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h1 className="text-4xl font-extrabold text-white tracking-tight light:text-slate-900">
              Knowledge Base & Guides
            </h1>
            <p className="text-slate-400 light:text-slate-600">
              Find technical documentation, setup guides, and answers to frequently asked questions about our solutions.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto pt-4">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none mt-4">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-white light:border-slate-200 light:text-slate-800 shadow-lg"
                placeholder="Search tutorials, setups, documentation..."
              />
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-brand-emerald">
              <Loader2 className="animate-spin" size={36} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column Sidebar - Categories List */}
              <div className="lg:col-span-3 space-y-4">
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h3 className="font-display font-bold text-white text-sm tracking-wide uppercase light:text-slate-800">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                        !selectedCategory
                          ? 'bg-brand-emerald/10 text-brand-emerald'
                          : 'text-slate-400 hover:text-white hover:bg-white/5 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100'
                      }`}
                    >
                      <span>All Articles</span>
                      <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400">
                        {articles.length}
                      </span>
                    </button>
                    {categories.map((cat) => {
                      const count = articles.filter(a => a.category_id === cat.id).length
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                            selectedCategory === cat.id
                              ? 'bg-brand-emerald/10 text-brand-emerald'
                              : 'text-slate-400 hover:text-white hover:bg-white/5 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400">
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl text-center space-y-3">
                  <HelpCircle className="mx-auto text-brand-indigo" size={32} />
                  <h4 className="font-display font-bold text-white text-xs light:text-slate-800">Need direct support?</h4>
                  <p className="text-[11px] text-slate-400 light:text-slate-500">
                    Can't find what you are looking for? Open a support ticket to get assistance from our solutions engineers.
                  </p>
                  <Link to="/support" className="btn-secondary w-full text-[11px] py-1.5 inline-block font-semibold">
                    Go to Support Desk
                  </Link>
                </div>
              </div>

              {/* Right Column - Articles Grid/List */}
              <div className="lg:col-span-9 space-y-6">
                {searchQuery || selectedCategory ? (
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Showing {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''}
                      {selectedCategory && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                      {searchQuery && ` matching "${searchQuery}"`}
                    </span>
                    {(searchQuery || selectedCategory) && (
                      <button
                        onClick={() => {
                          setSearchQuery('')
                          setSelectedCategory(null)
                        }}
                        className="text-brand-emerald hover:underline font-semibold"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : null}

                {filteredArticles.length === 0 ? (
                  <div className="text-center py-16 glass-panel rounded-3xl space-y-4">
                    <BookOpen size={48} className="mx-auto text-slate-600" />
                    <h3 className="text-lg font-bold text-white light:text-slate-800">No Documentation Found</h3>
                    <p className="text-sm text-slate-400 light:text-slate-600 max-w-sm mx-auto">
                      There are no matching articles in this section at the moment. Try checking another category or refining your query.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredArticles.map((art) => {
                      const catName = categories.find(c => c.id === art.category_id)?.name || 'General'
                      return (
                        <Link
                          key={art.id}
                          to={`/kb/${art.slug}`}
                          className="group block p-6 rounded-2xl glass-panel border border-white/5 hover:border-brand-emerald/20 transition-all space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] bg-brand-emerald/15 text-brand-emerald px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                              {catName}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(art.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-display font-bold text-white group-hover:text-brand-emerald transition-colors text-base light:text-slate-900 line-clamp-1">
                            {art.title}
                          </h3>
                          <p className="text-xs text-slate-400 light:text-slate-600 line-clamp-2 leading-relaxed">
                            {art.content.replace(/[#*`_[\]()]/g, '')}
                          </p>
                          <div className="pt-2 flex items-center gap-1 text-xs font-bold text-brand-emerald">
                            <span>Read article</span>
                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </main>

      <CareersFooter />
    </div>
  )
}
export default KBListing
