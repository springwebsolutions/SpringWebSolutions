import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import { 
  Calendar, Clock, User, ArrowLeft, Loader2, 
  Share2, MessageSquare, AlertCircle 
} from 'lucide-react'

interface PostDetail {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string | null
  published_at: string
  reading_time_minutes: number
  seo_title: string | null
  seo_description: string | null
  profiles: any
  categories: Array<{ id: string; name: string; slug: string }>
}

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostDetail | null>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Track scrolling progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!slug || !isSupabaseConfigured) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            id, title, slug, content, excerpt, featured_image, published_at, reading_time_minutes, seo_title, seo_description,
            profiles(full_name, avatar_url),
            blog_post_categories(blog_categories(id, name, slug))
          `)
          .eq('slug', slug)
          .eq('status', 'published')
          .single()

        if (error) throw error

        if (data) {
          const categories = data.blog_post_categories?.map((c: any) => c.blog_categories).filter(Boolean) || []
          const mappedPost = { ...data, categories }
          setPost(mappedPost)

          // Inject SEO Meta tags dynamically
          document.title = data.seo_title || `${data.title} | Spring Web Blog`
          const metaDesc = document.querySelector('meta[name="description"]')
          if (metaDesc) {
            metaDesc.setAttribute('content', data.seo_description || data.excerpt)
          }

          // Fetch related posts (same category, excluding this one)
          if (categories[0]) {
            const { data: relatedData } = await supabase
              .from('blog_posts')
              .select('id, title, slug, featured_image, published_at, reading_time_minutes')
              .eq('status', 'published')
              .neq('id', data.id)
              .order('published_at', { ascending: false })
              .limit(3)
            
            setRelated(relatedData || [])
          }
        }
      } catch (err) {
        console.error('Error loading blog detail:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPostDetail()
  }, [slug])

  const shareUrl = encodeURIComponent(window.location.href)
  const shareTitle = encodeURIComponent(post?.title || '')

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

  if (!post) {
    return (
      <div className="min-h-screen bg-[#070a13] flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow flex items-center justify-center text-slate-200">
          <div className="p-8 rounded-3xl glass-panel text-center max-w-sm space-y-4">
            <AlertCircle size={48} className="mx-auto text-brand-indigo" />
            <h1 className="text-xl font-bold">Article Not Found</h1>
            <p className="text-xs text-slate-400">The requested article does not exist or has been deleted.</p>
            <div className="pt-2">
              <Link to="/blog" className="btn-primary flex items-center gap-1 text-xs">
                <ArrowLeft size={14} />
                <span>Return to Blog</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col dark:bg-[#070a13] light:bg-[#f8fafc] relative">
      
      {/* Scroll indicator progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-brand-emerald to-brand-indigo z-55 transition-all" 
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      <main className="flex-grow py-12">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Breadcrumbs / Back button */}
          <Link to="/blog" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors light:text-slate-500 light:hover:text-slate-800">
            <ArrowLeft size={13} />
            <span>Back to digital growth hub</span>
          </Link>

          {/* Categories tag */}
          <div className="flex flex-wrap gap-2">
            {post.categories.map(cat => (
              <span key={cat.id} className="px-2.5 py-1 rounded bg-brand-emerald/10 text-brand-emerald text-xs font-semibold uppercase tracking-wider">
                {cat.name}
              </span>
            ))}
          </div>

          {/* Title Header */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight light:text-slate-900">
            {post.title}
          </h1>

          {/* Post Metadata row */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 border-y border-white/5 py-4 dark:border-white/5 light:border-slate-200">
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-brand-emerald" />
              <span>By {post.profiles?.full_name || 'Staff Writer'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-brand-emerald" />
              <span>{new Date(post.published_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-brand-emerald" />
              <span>{post.reading_time_minutes} min read</span>
            </span>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-white/2 border border-white/5 shadow-lg">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Main article content parsed via custom parser */}
          <div className="py-4">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Social share widget drawer */}
          <div className="border-t border-white/5 pt-8 light:border-slate-200 space-y-4">
            <h3 className="font-display font-semibold text-sm text-slate-300 light:text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 size={15} />
              <span>Share Article</span>
            </h3>
            <div className="flex space-x-2">
              <a
                href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all text-slate-300 light:bg-slate-100 light:border-slate-200 light:text-slate-600 flex items-center justify-center gap-2 text-xs font-medium"
                title="Share on WhatsApp"
              >
                <MessageSquare size={16} />
                <span>Share via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Related Articles block */}
          {related.length > 0 && (
            <div className="border-t border-white/5 pt-12 mt-12 light:border-slate-200 space-y-6">
              <h3 className="font-display text-xl font-bold text-white light:text-slate-900">
                Recommended Articles
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {related.map(rel => (
                  <Link
                    key={rel.id}
                    to={`/blog/${rel.slug}`}
                    className="group space-y-3 block"
                  >
                    <div className="aspect-[16/9] rounded-xl overflow-hidden bg-white/2 border border-white/5 light:border-slate-200">
                      {rel.featured_image ? (
                        <img src={rel.featured_image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-350" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-700 bg-[#090d16]">
                          <Clock size={24} />
                        </div>
                      )}
                    </div>
                    <h4 className="font-display font-semibold text-sm text-slate-200 group-hover:text-brand-emerald transition-colors line-clamp-2 leading-snug light:text-slate-800">
                      {rel.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </article>
      </main>

      <Footer />
    </div>
  )
}
export default BlogPost
