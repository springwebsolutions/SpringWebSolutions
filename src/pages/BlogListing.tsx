import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Search, Calendar, Clock, ArrowRight, BookOpen, Loader2, AlertCircle } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string | null
  published_at: string
  created_at?: string
  reading_time_minutes: number
  is_featured: boolean
  profiles: any
  categories: Array<{ name: string; slug: string }>
}

import SEOHead from '@/components/seo/SEOHead'

const DEFAULT_POSTS: Post[] = [
  {
    id: 'post-promo-inr',
    title: 'Limited Time Launch Offer: Complete Business Website for Just ₹15,000',
    slug: 'limited-time-business-website-offer-india',
    excerpt: 'Exclusive launch offer for startups and growing businesses in Udumalpet, Tiruppur, Coimbatore, Tamil Nadu, and across India. Get a high-speed React website with 100% full source code ownership for ₹15,000.',
    featured_image: '/offer-banner-inr.jpg',
    published_at: '2026-08-04T12:00:00Z',
    reading_time_minutes: 4,
    is_featured: true,
    profiles: { full_name: 'Spring Web Engineering Team' },
    categories: [
      { name: 'Promotions & Offers', slug: 'promotions' },
      { name: 'Web Development', slug: 'web-development' }
    ]
  },
  {
    id: 'post-promo-usd',
    title: 'Global Launch Offer: High-Performance Business Website Architecture for $249',
    slug: 'limited-time-business-website-offer-global',
    excerpt: 'Exclusive global launch offer for international startups, agencies, and enterprises. Get a high-speed React/Next.js web application with 100% full source code & database ownership for just $249 USD.',
    featured_image: '/offer-banner-usd.jpg',
    published_at: '2026-08-04T11:00:00Z',
    reading_time_minutes: 4,
    is_featured: false,
    profiles: { full_name: 'Spring Web Global Architecture' },
    categories: [
      { name: 'Promotions & Offers', slug: 'promotions' },
      { name: 'Web Development', slug: 'web-development' }
    ]
  },
  {
    id: 'post-02',
    title: 'Building Scalable Enterprise ERP & CRM Platforms with Modern React Architecture',
    slug: 'building-scalable-erp-systems-in-react-node',
    excerpt: 'Discover how modern single-page applications and serverless databases eliminate bloat and speed up business billing and lead management.',
    featured_image: '/cloud_storage_vector.png',
    published_at: '2026-08-02T10:00:00Z',
    reading_time_minutes: 5,
    is_featured: false,
    profiles: { full_name: 'Solutions Architect' },
    categories: [{ name: 'Software Engineering', slug: 'engineering' }]
  },
  {
    id: 'post-03',
    title: 'Why 1.0-Second Load Times and Technical SEO Dominate Google Search in 2026',
    slug: 'why-speed-seo-matter-in-2026',
    excerpt: 'Core Web Vitals, JSON-LD Schema, and AI Answer Engine Optimization (AEO) are non-negotiable for local and global business growth.',
    featured_image: '/seo_analytics_vector.png',
    published_at: '2026-07-28T09:00:00Z',
    reading_time_minutes: 4,
    is_featured: false,
    profiles: { full_name: 'SEO Strategist' },
    categories: [{ name: 'SEO & Growth', slug: 'seo' }]
  }
]

export const BlogListing: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(DEFAULT_POSTS)
  const [categories, setCategories] = useState<any[]>([
    { id: 'cat-1', name: 'Promotions & Offers', slug: 'promotions' },
    { id: 'cat-2', name: 'Web Development', slug: 'web-development' },
    { id: 'cat-3', name: 'Software Engineering', slug: 'engineering' },
    { id: 'cat-4', name: 'SEO & Growth', slug: 'seo' }
  ])
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Search & Filter state
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetadataAndPosts = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      try {
        // Fetch categories & tags
        const [catRes, tagRes] = await Promise.all([
          supabase.from('blog_categories').select('*'),
          supabase.from('blog_tags').select('*')
        ])

        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data)
        }
        setTags(tagRes.data || [])

        // Fetch posts
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            id, title, slug, excerpt, featured_image, published_at, reading_time_minutes, is_featured,
            profiles(full_name),
            blog_post_categories(blog_categories(name, slug))
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false })

        if (error) throw error

        if (data && data.length > 0) {
          const mappedPosts = data.map((post: any) => ({
            ...post,
            categories: post.blog_post_categories?.map((c: any) => c.blog_categories).filter(Boolean) || []
          }))
          setPosts(mappedPosts)
        }
      } catch (err) {
        console.error('Error fetching blog catalog:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetadataAndPosts()
  }, [])

  // Filter posts on the client side for high speed HMR performance
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(search.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(search.toLowerCase())
    
    const matchesCategory = 
      !selectedCategory || 
      post.categories.some(cat => cat.slug === selectedCategory)

    return matchesSearch && matchesCategory
  })

  const featuredPost = filteredPosts.find(p => p.is_featured) || filteredPosts[0]
  const listPosts = featuredPost 
    ? filteredPosts.filter(p => p.id !== featuredPost.id)
    : filteredPosts

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col dark:bg-[#070a13] light:bg-[#f8fafc]">
      <SEOHead
        title="Tech Blog & Software Engineering Insights | Spring Web Solutions"
        description="Read expert articles on web development, custom ERP/CRM architecture, mobile apps, and tech automation by Spring Web Solutions. Learn more today!"
      />
      <Navbar />

      <main className="flex-grow py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h1 className="text-4xl font-extrabold text-white tracking-tight light:text-slate-900">
              The Digital Growth Hub
            </h1>
            <p className="text-slate-400 light:text-slate-600">
              Roadmaps, optimization insights, and technology guides written by our solution engineers.
            </p>
          </div>

          {/* Search and Category Filters bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-y border-white/5 py-6 dark:border-white/5 light:border-slate-200">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  !selectedCategory 
                    ? 'bg-brand-emerald text-white shadow-md' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white light:bg-slate-100 light:text-slate-600'
                }`}
              >
                All Articles
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-brand-emerald text-white shadow-md'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white light:bg-slate-100 light:text-slate-600'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-950/5 light:border-slate-200 light:text-slate-800"
                placeholder="Search articles..."
              />
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="h-64 flex items-center justify-center text-brand-emerald">
              <Loader2 className="animate-spin" size={36} />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl space-y-4 max-w-md mx-auto">
              <BookOpen size={48} className="mx-auto text-slate-500" />
              <h2 className="text-lg font-bold text-white light:text-slate-800">No Articles Found</h2>
              <p className="text-sm text-slate-400 light:text-slate-600">
                There are no published blog posts matching this filter. Log in to the Admin Panel to write one.
              </p>
              <div className="pt-2">
                <a href="https://suite.springwebsolutions.in/blog" className="btn-secondary text-xs">Write First Post</a>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Featured Post Card */}
              {featuredPost && !search && !selectedCategory && (
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="group block rounded-3xl overflow-hidden glass-panel border border-white/5 hover:border-brand-emerald/20 transition-all shadow-xl"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Featured Image */}
                    <div className="lg:col-span-7 h-72 lg:h-96 relative bg-gradient-to-tr from-[#141c2c] to-[#070a13]">
                      {featuredPost.featured_image ? (
                        <img
                          src={featuredPost.featured_image}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <BookOpen size={64} />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-brand-emerald text-white text-xs font-bold uppercase tracking-wider">
                        Featured
                      </div>
                    </div>
                    {/* Featured Details */}
                    <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} />
                            {new Date(featuredPost.published_at || featuredPost.created_at || '').toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} />
                            {featuredPost.reading_time_minutes} min read
                          </span>
                        </div>
                        
                        <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-white group-hover:text-brand-emerald transition-colors light:text-slate-900">
                          {featuredPost.title}
                        </h2>
                        
                        <p className="text-sm text-slate-400 light:text-slate-600 leading-relaxed">
                          {featuredPost.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5 light:border-slate-200">
                        <span className="text-xs font-semibold text-slate-300 light:text-slate-600">
                          By {featuredPost.profiles?.full_name || 'Staff Writer'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-emerald">
                          <span>Read Article</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Standard Posts Grid */}
              {listPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {listPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group flex flex-col h-full rounded-2xl overflow-hidden glass-panel border border-white/5 hover:-translate-y-2 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300"
                    >
                      <div>
                        {/* Image banner */}
                        <div className="h-48 relative bg-gradient-to-tr from-[#141c2c] to-[#070a13] border-b border-white/5 light:border-slate-200">
                          {post.featured_image ? (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <BookOpen size={48} />
                            </div>
                          )}
                          {post.categories?.[0] && (
                            <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-brand-indigo text-white text-[10px] font-bold uppercase tracking-wider">
                              {post.categories[0].name}
                            </div>
                          )}
                        </div>

                        {/* Description details */}
                        <div className="p-6 space-y-3">
                          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              {new Date(post.published_at || post.created_at || '').toLocaleDateString(undefined, { dateStyle: 'medium' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={11} />
                              {post.reading_time_minutes} min read
                            </span>
                          </div>
                          
                          <h3 className="font-display text-lg font-bold text-white group-hover:text-brand-emerald transition-colors line-clamp-2 light:text-slate-900">
                            {post.title}
                          </h3>
                          
                          <p className="text-xs text-slate-400 light:text-slate-600 line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs light:border-slate-200">
                        <span className="font-medium text-slate-400">
                          By {post.profiles?.full_name || 'Staff Writer'}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-brand-emerald font-bold">
                          <span>Read</span>
                          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
export default BlogListing
