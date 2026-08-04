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
import SEOHead from '@/components/seo/SEOHead'

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

const detectInitialCurrencyMode = (): 'INR' | 'USD' => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    const lang = (navigator.language || '').toLowerCase()
    if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz.includes('Colombo') || lang.includes('in')) {
      return 'INR'
    }
  } catch (e) {
    // fallback
  }
  return 'USD'
}

const OFFER_POST_DETAIL: PostDetail = {
  id: 'post-promo-01',
  title: 'Urgent: Limited Time Offer — Get Your Complete Business Website for Just ₹15,000 / $249',
  slug: 'exclusive-limited-time-business-package',
  excerpt: 'Exclusive limited-time package for startups and growing businesses in Udumalpet, Tiruppur, Coimbatore, Tamil Nadu, and globally. Book this month to lock in your complete business website with 100% source code ownership.',
  featured_image: '/offer-banner-inr.jpg',
  published_at: '2026-08-04T12:00:00Z',
  reading_time_minutes: 3,
  seo_title: 'Urgent Limited Time Offer: Complete Business Website for ₹15,000 / $249 | Spring Web Solutions',
  seo_description: 'Get a high-speed React/Next.js business website with 100% source code ownership for just ₹15,000 (India) or $249 (Global). Limited to first 15 customers!',
  profiles: { full_name: 'Spring Web Engineering Team' },
  categories: [
    { id: 'cat-1', name: 'Promotions & Offers', slug: 'promotions' },
    { id: 'cat-2', name: 'Web Development', slug: 'web-development' }
  ],
  content: `
# ⚡ URGENT: LIMITED TIME LAUNCH OFFER ⚡

Spring Web Solutions is offering an exclusive, limited-time launch package for startups and enterprises in **Udumalpet, Tiruppur, Coimbatore, Tamil Nadu**, and **across the world**.

Get your complete business website and software platform for just **₹15,000 (India)** or **$249 (Rest of the World)** — flat one-time payment with **100% full code & database ownership**.

---

### 📦 What You Get in This Package

- ✅ **Modern, High-Speed Website**: Built on React / Next.js architecture.
- ✅ **Mobile & Desktop Responsive Design**: Optimized touch & desktop layouts.
- ✅ **Ultra-Fast Performance**: Guaranteed < 1.0 second load speed.
- ✅ **Basic Technical SEO**: Google Search Console ready.
- ✅ **100% Source Code Ownership**: No monthly platform fees or vendor lock-in.
- ✅ **Essential JSON-LD Schema**: AI Search Engine Friendly (ChatGPT, Perplexity, Gemini ready).
- ✅ **1 Year Domain & Hosting**: Basic plan included.

---

### 💡 Why Choose Spring Web Solutions?

- 🟢 **Direct Senior Engineer Support**: Direct access to local architects in Udumalpet, Tamil Nadu.
- 🟢 **Zero Bloatware**: Pure performance & security architecture.
- 🟢 **Full Ownership**: 100% full repository and database ownership.

---

### 🔥 First 15 Customers Only

Book this month to lock in this exclusive rate before spots fill up!

- 📲 **WhatsApp Direct**: [+91 80126 22119](https://wa.me/918012622119?text=Hi%20SpringWeb,%20I%20want%20to%20claim%20the%20Limited%20Time%20Website%20Offer!)
- ✉️ **Email**: [info@springwebsolutions.in](mailto:info@springwebsolutions.in)
- 🌐 **Website**: [www.springwebsolutions.in](https://www.springwebsolutions.in)

> **Note**: Final price may exceed ₹15,000 / $249 if the domain name requested by the user exceeds standard cost expectations, or if specific custom website features and complexity required by the user increase development time and resource costs.
  `
}

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostDetail | null>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Currency Mode State: Auto-detect India (INR) vs Rest of World (USD)
  const [currencyMode, setCurrencyMode] = useState<'INR' | 'USD'>(detectInitialCurrencyMode())

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
      // Check fallback post first for instant loading
      if (slug === 'exclusive-limited-time-business-package') {
        setPost(OFFER_POST_DETAIL)
        document.title = OFFER_POST_DETAIL.seo_title || OFFER_POST_DETAIL.title
        setLoading(false)
        return
      }

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

          // Fetch related posts
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
        if (slug === 'exclusive-limited-time-business-package') {
          setPost(OFFER_POST_DETAIL)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPostDetail()
  }, [slug])

  const shareUrl = encodeURIComponent(window.location.href)
  const shareTitle = encodeURIComponent(post?.title || '')
  const isOfferPost = slug === 'exclusive-limited-time-business-package' || post?.slug === 'exclusive-limited-time-business-package'

  // Image display based on currencyMode
  const displayImage = isOfferPost
    ? (currencyMode === 'INR' ? '/offer-banner-inr.jpg' : '/offer-banner-usd.jpg')
    : (post?.featured_image || '/offer-banner-inr.jpg')

  if (loading) {
    return (
      <div className="min-h-screen page-bg flex flex-col">
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
      <div className="min-h-screen page-bg flex flex-col justify-between">
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
    <div className="min-h-screen page-bg flex flex-col relative">
      <SEOHead
        title={post.seo_title || `${post.title} | Spring Web Blog`}
        description={post.seo_description || post.excerpt}
        ogImage={displayImage}
        type="article"
      />
      
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
              <span>By {post.profiles?.full_name || 'Spring Web Engineering Team'}</span>
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

          {/* Region & Currency Selector Switcher Bar for Offer */}
          {isOfferPost && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl dark:bg-white/5 light:bg-slate-100 border dark:border-white/10 light:border-slate-200">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="text-xs font-bold dark:text-white light:text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                  <span>Region & Currency Banner View</span>
                </div>
                <div className="text-[11px] dark:text-slate-400 light:text-slate-600">
                  {currencyMode === 'INR' ? 'Showing Indian Rupee (₹15,000) flyer' : 'Showing International USD ($249) flyer'}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setCurrencyMode('INR')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    currencyMode === 'INR'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                      : 'dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/10 light:bg-white light:border-slate-300 light:text-slate-700'
                  }`}
                >
                  <span>🇮🇳 India (₹15,000)</span>
                </button>
                <button
                  onClick={() => setCurrencyMode('USD')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    currencyMode === 'USD'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                      : 'dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/10 light:bg-white light:border-slate-300 light:text-slate-700'
                  }`}
                >
                  <span>🌐 Rest of World ($249)</span>
                </button>
              </div>
            </div>
          )}

          {/* Featured Image / Offer Banner */}
          {displayImage && (
            <div className="rounded-3xl overflow-hidden dark:bg-white/2 light:bg-white border dark:border-white/10 light:border-slate-200 shadow-2xl">
              <img
                src={displayImage}
                alt={post.title}
                className="w-full h-auto object-contain max-h-[850px] mx-auto"
              />
            </div>
          )}

          {/* Direct WhatsApp Offer Claim Callout */}
          {isOfferPost && (
            <div className="p-6 rounded-3xl dark:bg-gradient-to-r dark:from-emerald-500/15 dark:via-[#0c1626] dark:to-[#070a13] light:bg-emerald-50 border-2 border-emerald-500 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1">
                <div className="text-xs font-extrabold uppercase tracking-widest text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5 justify-center sm:justify-start">
                  <span>First 15 Customers Only &bull; Exclusive Launch Rate</span>
                </div>
                <h3 className="text-xl font-extrabold dark:text-white light:text-slate-900">
                  {currencyMode === 'INR' ? 'Lock In Your Website for Just ₹15,000 !' : 'Lock In Your Website for Just $249 !'}
                </h3>
                <p className="text-xs dark:text-slate-400 light:text-slate-600 max-w-xl">
                  Flat one-time payment. Includes 100% source code & database ownership, guaranteed &lt; 1.0s load speed, technical SEO, and direct senior engineer support.
                </p>
              </div>
              <a
                href={currencyMode === 'INR'
                  ? 'https://wa.me/918012622119?text=Hi%20SpringWeb,%20I%20want%20to%20claim%20the%20%E2%82%B915,000%20Limited%20Time%20Business%20Website%20Offer!'
                  : 'https://wa.me/918012622119?text=Hi%20SpringWeb,%20I%20want%20to%20claim%20the%20$249%20Global%20Business%20Website%20Offer!'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs font-bold py-3.5 px-6 shrink-0 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare size={16} />
                <span>{currencyMode === 'INR' ? 'Message on WhatsApp (₹15,000 Offer)' : 'Message on WhatsApp ($249 Offer)'}</span>
              </a>
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
