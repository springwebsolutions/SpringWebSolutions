import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { CareersNavbar } from '@/components/careers/CareersNavbar'
import { CareersFooter } from '@/components/careers/CareersFooter'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import { ArrowLeft, BookOpen, Calendar, HelpCircle, Loader2, AlertCircle } from 'lucide-react'
import SEOHead from '@/components/seo/SEOHead'

interface KBArticleDetail {
  id: string
  title: string
  slug: string
  content: string
  category_id: string
  created_at: string
  seo_title: string | null
  seo_description: string | null
}

export const KBArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<KBArticleDetail | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<any[]>([])
  const [categoryName, setCategoryName] = useState('Documentation')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticleDetail = async () => {
      if (!slug || !isSupabaseConfigured) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const { data: artData, error: artErr } = await supabase
          .from('knowledge_base_articles')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single()

        if (artErr || !artData) {
          throw new Error('Article not found')
        }

        setArticle(artData)

        // Load Category Name and Related Articles
        const [catRes, relRes] = await Promise.all([
          supabase
            .from('knowledge_base_categories')
            .select('name')
            .eq('id', artData.category_id)
            .single(),
          supabase
            .from('knowledge_base_articles')
            .select('id, title, slug')
            .eq('category_id', artData.category_id)
            .eq('is_published', true)
            .neq('id', artData.id)
            .limit(5)
        ])

        if (catRes.data) {
          setCategoryName(catRes.data.name)
        }
        setRelatedArticles(relRes.data || [])

      } catch (err) {
        console.error('Error fetching article detail:', err)
        setArticle(null)
      } finally {
        setLoading(false)
      }
    }

    fetchArticleDetail()
  }, [slug])

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col dark:bg-[#070a13] light:bg-[#f8fafc]">
      <CareersNavbar />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Back button */}
          <Link to="/kb" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors light:text-slate-500 light:hover:text-slate-800">
            <ArrowLeft size={14} />
            <span>Back to Knowledge Base</span>
          </Link>

          {loading ? (
            <div className="h-96 flex items-center justify-center text-brand-emerald">
              <Loader2 className="animate-spin" size={36} />
            </div>
          ) : !article ? (
            <div className="text-center py-20 glass-panel rounded-3xl space-y-4 max-w-md mx-auto">
              <AlertCircle size={48} className="mx-auto text-rose-400" />
              <h2 className="text-lg font-bold text-white light:text-slate-800">Article Not Found</h2>
              <p className="text-sm text-slate-400 light:text-slate-600">
                The article you requested could not be found or has been draft archived.
              </p>
              <div className="pt-2">
                <Link to="/kb" className="btn-secondary text-xs font-semibold">Browse Help Desk</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <SEOHead
                title={article.seo_title || `${article.title} | Spring Web Help Center`}
                description={article.seo_description || article.content.substring(0, 160).replace(/[#*`]/g, '')}
              />
              
              {/* Left Column - Article Content */}
              <div className="lg:col-span-8 space-y-6">
                <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/5 space-y-6">
                  
                  {/* Article Metadata header */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-brand-emerald/15 text-brand-emerald px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      {categoryName}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar size={13} />
                      {new Date(article.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight light:text-slate-900">
                    {article.title}
                  </h1>

                  {/* Body text rendered */}
                  <div className="border-t border-white/5 pt-8 dark:border-white/5 light:border-slate-200">
                    <MarkdownRenderer content={article.content} />
                  </div>

                </div>
              </div>

              {/* Right Column - Related & Support CTA */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Related Articles Panel */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h3 className="font-display font-bold text-white text-sm tracking-wide uppercase light:text-slate-800 border-b border-white/5 pb-2">
                    Related Articles
                  </h3>
                  {relatedArticles.length === 0 ? (
                    <p className="text-xs text-slate-500">No other articles in this category.</p>
                  ) : (
                    <div className="space-y-3">
                      {relatedArticles.map((rel) => (
                        <Link
                          key={rel.id}
                          to={`/kb/${rel.slug}`}
                          className="block text-xs font-semibold text-slate-400 hover:text-white transition-colors light:text-slate-600 light:hover:text-slate-900"
                        >
                          {rel.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Support Ticket Desk CTA */}
                <div className="glass-panel p-6 rounded-2xl text-center space-y-4">
                  <HelpCircle className="mx-auto text-brand-indigo" size={36} />
                  <h4 className="font-display font-bold text-white text-sm light:text-slate-800">Still Stuck?</h4>
                  <p className="text-xs text-slate-400 light:text-slate-500 leading-relaxed">
                    If this guide did not solve your issue, our help support desk is open. Submit a ticket and a specialist will assist you.
                  </p>
                  <Link to="/support" className="btn-primary w-full py-2.5 inline-block font-semibold shadow-lg shadow-brand-indigo/10">
                    Open a Support Ticket
                  </Link>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      <CareersFooter />
    </div>
  )
}
export default KBArticle
