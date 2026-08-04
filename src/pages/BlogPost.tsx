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

const OFFER_POST_INR: PostDetail = {
  id: 'post-promo-inr',
  title: 'Limited Time Launch Offer: Complete Business Website for Just ₹15,000',
  slug: 'limited-time-business-website-offer-india',
  excerpt: 'Exclusive launch offer for startups and growing businesses in Udumalpet, Tiruppur, Coimbatore, Tamil Nadu, and across India. Get a high-speed React website with 100% full source code ownership for ₹15,000.',
  featured_image: '/offer-banner-inr.jpg',
  published_at: '2026-08-04T12:00:00Z',
  reading_time_minutes: 4,
  seo_title: 'Limited Time Business Website Offer: ₹15,000 | Spring Web Solutions India',
  seo_description: 'Get a complete high-performance React/Next.js business website with sub-1.0s load speed & 100% source code ownership for just ₹15,000 in Udumalpet, Tamil Nadu, and India. Book now!',
  profiles: { full_name: 'Spring Web Engineering Team' },
  categories: [
    { id: 'cat-1', name: 'Promotions & Offers', slug: 'promotions' },
    { id: 'cat-2', name: 'Web Development', slug: 'web-development' }
  ],
  content: `
# Exclusive Launch Offer: Complete High-Performance Business Website for Just ₹15,000

In today's fast-moving digital economy, a slow or outdated website is the single biggest leak in a business's sales pipeline. Traditional web agencies often trap business owners in endless monthly subscriptions, recurring maintenance fees, and proprietary locks that prevent you from owning your own digital asset.

At **Spring Web Solutions**, we believe every business — from local startups in **Udumalpet, Tiruppur, and Coimbatore** to enterprises across **Tamil Nadu and India** — deserves high-speed modern software architecture with **100% full source code ownership**.

For a limited time, we are opening **15 exclusive spots** for our complete business web application package at a flat, one-time investment of **₹15,000 INR**.

---

## Why Traditional Subscriptions Cost You Thousands

Most website platforms (like Wix or Shopify) charge recurring monthly fees that accumulate to thousands of rupees every year, without giving you access to the underlying code. If you decide to cancel, your website disappears.

With the **Spring Web Solutions Autonomous Business Package**, you receive:
- **Zero Recurring Platform Lock-ins**: You own the code 100%.
- **Ultra-Fast Performance**: Guaranteed sub-1.0 second page load time.
- **AI Answer Engine Readiness (AEO)**: Optimized for Google, ChatGPT, Perplexity, and Gemini searches.

---

## What Is Included in This Exclusive Package?

Our engineering team builds every project using industrial React & Next.js technology, ensuring zero bloatware and top-tier security.

- **Modern, High-Speed Website**: Responsive web architecture tailored to your brand identity.
- **Mobile & Desktop Touch Optimization**: Flawless user experience on iPhones, Android devices, tablets, and desktop displays.
- **Sub-1.0 Second Load Speed**: Lightning-fast performance to boost conversion rates and lower bounce rates.
- **Technical SEO Setup**: Complete Google Search Console configuration, canonical tags, and XML sitemaps.
- **Essential JSON-LD Schema (AEO)**: Structured data graph enabling AI search engines (like ChatGPT & Gemini) to display your business in direct answer panels.
- **100% Full Source Code & Database Ownership**: Full handover of code repositories and server keys.
- **1 Year Basic Domain & Hosting**: Complimentary domain registration and high-speed hosting included.

---

## Why Businesses Trust Spring Web Solutions

### 1. Direct Senior Engineer Support
Work directly with experienced software architects based in **Udumalpet, Tamil Nadu**. No middle managers or outsourced delays.

### 2. Pure Performance & Zero Bloatware
We do not use heavy, slow drag-and-drop builders. Every component is compiled for maximum speed, security, and scalability.

### 3. Complete Asset Control
All database backups, SSL certificates, domain names, and source repositories belong 100% to your company from Day 1.

---

## Frequently Asked Questions (FAQ)

### What is included in the ₹15,000 website package by Spring Web Solutions?
The ₹15,000 package includes a custom React/Next.js high-speed website, responsive touch design, technical SEO, sub-1.0 second page load performance, 100% full source code and database ownership, and 1 year domain and hosting.

### Does Spring Web Solutions charge monthly subscription fees?
No. Spring Web Solutions delivers 100% full source code and database ownership with zero recurring platform locks or monthly subscription fees.

### Where is Spring Web Solutions located?
Our primary engineering architects are based in **Udumalpet, Tamil Nadu**, serving clients across Udumalpet, Tiruppur, Coimbatore, Tamil Nadu, and India.

---

## First 15 Customers Only — Lock In Your Spot Today!

Due to the intensive engineer allocation required for each client project, this promotional rate is strictly capped at **the first 15 bookings**.

- **WhatsApp Direct**: [+91 80126 22119](https://wa.me/918012622119?text=Hi%20SpringWeb,%20I%20want%20to%20claim%20the%20%E2%82%B915,000%20Limited%20Time%20Business%20Website%20Offer!)
- **Email Support**: [info@springwebsolutions.in](mailto:info@springwebsolutions.in)

> **Important Domain & Feature Note**: *Final price may exceed ₹15,000 if the custom domain name requested by the client exceeds standard registrar cost expectations, or if custom enterprise integrations increase development time and resource requirements.*
  `
}

const OFFER_POST_USD: PostDetail = {
  id: 'post-promo-usd',
  title: 'Global Launch Offer: High-Performance Business Website Architecture for $249',
  slug: 'limited-time-business-website-offer-global',
  excerpt: 'Exclusive global launch offer for international startups, agencies, and enterprises. Get a high-speed React/Next.js web application with 100% full source code & database ownership for just $249 USD.',
  featured_image: '/offer-banner-usd.jpg',
  published_at: '2026-08-04T11:00:00Z',
  reading_time_minutes: 4,
  seo_title: 'Global Business Website Offer: $249 | Spring Web Solutions',
  seo_description: 'Get a custom high-performance React/Next.js business web application with sub-1.0s load speed & 100% source code ownership for just $249 USD. Capped at 15 bookings worldwide.',
  profiles: { full_name: 'Spring Web Global Architecture' },
  categories: [
    { id: 'cat-1', name: 'Promotions & Offers', slug: 'promotions' },
    { id: 'cat-2', name: 'Web Development', slug: 'web-development' }
  ],
  content: `
# Global Launch Offer: High-Performance Business Website Architecture for $249

In today's fast-moving global market, page speed and technical architecture determine digital conversion rates. Web development agencies frequently trap growing businesses in recurring SaaS subscriptions and proprietary locks that prevent you from owning your application.

At **Spring Web Solutions**, we build custom enterprise web architecture using industrial React and Next.js technology, delivering **100% full source code and database ownership** for every client worldwide.

For a limited time, we are allocating **15 exclusive client spots** for our complete business web package at a flat rate of **$249 USD**.

---

## Why Traditional SaaS & Agency Subscriptions Cost You Thousands

Proprietary platforms charge monthly fees that accumulate significantly year after year without granting access to the raw source repository. If you migrate or cancel, your entire application infrastructure is lost.

With the **Spring Web Solutions Autonomous Business Architecture**, you receive:
- **Zero Monthly Platform Fees**: You own 100% of your source code and database assets.
- **Sub-1.0 Second Load Guarantee**: High-speed edge deployment engineered for top Core Web Vitals scores.
- **AI Answer Engine Readiness (AEO)**: Complete JSON-LD schema integration optimized for ChatGPT, Perplexity, Gemini, and Google SERPs.

---

## What Is Included in the $249 Global Package?

Every project is developed by senior software engineers with zero bloatware and enterprise-grade security.

- **Modern, High-Speed Web Application**: Tailored frontend architecture built for conversion and scale.
- **Cross-Platform Responsive UX**: Flawless performance across desktop, tablet, and mobile devices.
- **Sub-1.0 Second Load Performance**: Accelerated asset loading for maximum SEO ranking and user retention.
- **Technical SEO Infrastructure**: Google Search Console integration, canonical indexing, and XML sitemaps.
- **Essential JSON-LD Schema (AEO)**: Structured entity markup for modern AI search engine discovery.
- **100% Source Code & Database Ownership**: Direct handover of GitHub repositories and database keys.
- **1 Year Domain & High-Speed Hosting**: Basic domain registration and cloud edge hosting included.

---

## Engineering Standards & Enterprise Guarantees

### 1. Direct Software Architect Communication
Work directly with senior lead engineers. We maintain transparent milestone updates and direct technical support.

### 2. Zero Bloatware & Pure Edge Performance
No slow drag-and-drop builders. Every module is compiled with modern web frameworks for maximum security and execution speed.

### 3. Complete Ownership & Zero Vendor Lock-In
All database backups, SSL certificates, custom domains, and source repositories belong 100% to your enterprise.

---

## Frequently Asked Questions (FAQ)

### What is included in the $249 Global Website Package?
The $249 Global package includes enterprise React/Next.js web application architecture, guaranteed sub-1.0 second load speed, technical SEO setup, JSON-LD Schema AEO optimization, 100% Git repository and database ownership, and 1 year domain and cloud hosting.

### Are there any recurring platform fees for the $249 website package?
No. You receive full GitHub source code repository access and complete database ownership without monthly software locks.

### How does Spring Web Solutions guarantee sub-1.0 second load speeds?
We engineer custom single-page and serverless web architecture on React & Next.js compiled at the edge with zero bloatware or heavy CMS plugins.

---

## Restricted to 15 Bookings Worldwide

Due to dedicated engineering allocation per project, this promotional rate is strictly limited to **the first 15 confirmed bookings**.

- **WhatsApp Direct**: [+91 80126 22119](https://wa.me/918012622119?text=Hi%20SpringWeb,%20I%20want%20to%20claim%20the%20$249%20Global%20Business%20Website%20Offer!)
- **Email Support**: [info@springwebsolutions.in](mailto:info@springwebsolutions.in)

> **Important Domain & Feature Note**: *Final price may exceed $249 if the custom domain name requested by the client exceeds standard registrar cost expectations, or if custom enterprise integrations increase development complexity.*
  `
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
      // Direct resolution for dedicated SEO posts
      if (slug === 'limited-time-business-website-offer-india' || slug === 'exclusive-limited-time-business-package-inr') {
        setPost(OFFER_POST_INR)
        document.title = OFFER_POST_INR.seo_title || OFFER_POST_INR.title
        setLoading(false)
        return
      }

      if (slug === 'limited-time-business-website-offer-global' || slug === 'exclusive-limited-time-business-package-usd') {
        setPost(OFFER_POST_USD)
        document.title = OFFER_POST_USD.seo_title || OFFER_POST_USD.title
        setLoading(false)
        return
      }

      // Legacy fallback mapping based on location
      if (slug === 'exclusive-limited-time-business-package') {
        const isIndia = detectInitialCurrencyMode() === 'INR'
        const targetPost = isIndia ? OFFER_POST_INR : OFFER_POST_USD
        setPost(targetPost)
        document.title = targetPost.seo_title || targetPost.title
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
        if (slug?.includes('india') || slug?.includes('inr')) {
          setPost(OFFER_POST_INR)
        } else if (slug?.includes('global') || slug?.includes('usd')) {
          setPost(OFFER_POST_USD)
        } else {
          setPost(OFFER_POST_INR)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPostDetail()
  }, [slug])

  const shareUrl = encodeURIComponent(window.location.href)
  const shareTitle = encodeURIComponent(post?.title || '')
  const isIndiaOffer = post?.slug === 'limited-time-business-website-offer-india' || slug === 'limited-time-business-website-offer-india' || slug === 'exclusive-limited-time-business-package-inr'
  const isGlobalOffer = post?.slug === 'limited-time-business-website-offer-global' || slug === 'limited-time-business-website-offer-global' || slug === 'exclusive-limited-time-business-package-usd'
  const isOfferPost = isIndiaOffer || isGlobalOffer

  // Image display based on post region
  const displayImage = isOfferPost
    ? (isIndiaOffer ? '/offer-banner-inr.jpg' : '/offer-banner-usd.jpg')
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

const generateJsonLd = (post: PostDetail) => {
  const isIndia = post.slug.includes('india') || post.slug.includes('inr')
  const isOffer = isIndia || post.slug.includes('global') || post.slug.includes('usd')

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://www.springwebsolutions.in/blog/${post.slug}`
    },
    'headline': post.title,
    'description': post.seo_description || post.excerpt,
    'image': post.featured_image ? `https://www.springwebsolutions.in${post.featured_image}` : 'https://www.springwebsolutions.in/logo-emblem.png',
    'author': {
      '@type': 'Organization',
      'name': post.profiles?.full_name || 'Spring Web Engineering Team',
      'url': 'https://www.springwebsolutions.in/'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Spring Web Solutions',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.springwebsolutions.in/logo-emblem.png'
      }
    },
    'datePublished': post.published_at,
    'dateModified': post.published_at
  }

  if (!isOffer) return articleSchema

  const offerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': post.title,
    'description': post.excerpt,
    'image': `https://www.springwebsolutions.in${post.featured_image}`,
    'brand': {
      '@type': 'Brand',
      'name': 'Spring Web Solutions'
    },
    'offers': {
      '@type': 'Offer',
      'url': `https://www.springwebsolutions.in/blog/${post.slug}`,
      'priceCurrency': isIndia ? 'INR' : 'USD',
      'price': isIndia ? '15000' : '249',
      'priceValidUntil': '2026-12-31',
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': 'https://schema.org/InStock',
      'seller': {
        '@type': 'Organization',
        'name': 'Spring Web Solutions'
      }
    }
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': isIndia ? [
      {
        '@type': 'Question',
        'name': 'What is included in the ₹15,000 website package by Spring Web Solutions?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The ₹15,000 package includes a custom React/Next.js high-speed website, responsive touch design, technical SEO, sub-1.0 second page load performance, 100% full source code and database ownership, and 1 year domain and hosting.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Does Spring Web Solutions charge monthly subscription fees?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'No. Spring Web Solutions delivers 100% full source code and database ownership with zero recurring platform locks or monthly subscription fees.'
        }
      }
    ] : [
      {
        '@type': 'Question',
        'name': 'What is included in the $249 Global Website Package?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'The $249 Global package includes enterprise React/Next.js web application architecture, guaranteed sub-1.0 second load speed, technical SEO setup, JSON-LD Schema AEO optimization, 100% Git repository and database ownership, and 1 year domain and cloud hosting.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Are there any recurring platform fees for the $249 website package?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'No. You receive full GitHub source code repository access and complete database ownership without monthly software locks.'
        }
      }
    ]
  }

  return [articleSchema, offerSchema, faqSchema]
}

  return (
    <div className="min-h-screen page-bg flex flex-col relative">
      <SEOHead
        title={post.seo_title || `${post.title} | Spring Web Blog`}
        description={post.seo_description || post.excerpt}
        keywords={isIndiaOffer 
          ? 'website development Udumalpet, web design Tiruppur, custom software company Coimbatore, website package ₹15000 India, React NextJS web agency Tamil Nadu, Spring Web Solutions'
          : 'custom business website development $249, full source code website agency, high speed React web application, AI search engine optimization AEO, Spring Web Solutions'
        }
        canonicalUrl={`https://www.springwebsolutions.in/blog/${post.slug}`}
        ogImage={displayImage}
        type="article"
        jsonLd={generateJsonLd(post)}
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

          {/* Cross-linking Region Switcher Callout for Dedicated SEO Posts */}
          {isOfferPost && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl dark:bg-white/5 light:bg-slate-100 border dark:border-white/10 light:border-slate-200">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="text-xs font-bold dark:text-white light:text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                  <span>Regional Package Options</span>
                </div>
                <div className="text-[11px] dark:text-slate-400 light:text-slate-600">
                  {isIndiaOffer 
                    ? 'Currently viewing Indian Rupee (₹15,000) offer for Udumalpet, Tamil Nadu & India.' 
                    : 'Currently viewing Global International ($249 USD) package for worldwide businesses.'
                  }
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isIndiaOffer ? (
                  <Link
                    to="/blog/limited-time-business-website-offer-global"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/10 light:bg-white light:border-slate-300 light:text-slate-700 hover:border-emerald-500"
                  >
                    <span>View Global $249 Offer &rarr;</span>
                  </Link>
                ) : (
                  <Link
                    to="/blog/limited-time-business-website-offer-india"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border dark:bg-white/5 dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/10 light:bg-white light:border-slate-300 light:text-slate-700 hover:border-emerald-500"
                  >
                    <span>View India ₹15,000 Offer &rarr;</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Featured Image / Offer Banner */}
          {post.featured_image && (
            <div className="rounded-3xl overflow-hidden dark:bg-white/2 light:bg-white border dark:border-white/10 light:border-slate-200 shadow-2xl">
              <img
                src={post.featured_image}
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
                  {isIndiaOffer ? 'Lock In Your Website for Just ₹15,000 !' : 'Lock In Your Website for Just $249 !'}
                </h3>
                <p className="text-xs dark:text-slate-400 light:text-slate-600 max-w-xl">
                  Flat one-time payment. Includes 100% source code & database ownership, guaranteed &lt; 1.0s load speed, technical SEO, and direct senior engineer support.
                </p>
              </div>
              <a
                href={isIndiaOffer
                  ? 'https://wa.me/918012622119?text=Hi%20SpringWeb,%20I%20want%20to%20claim%20the%20%E2%82%B915,000%20Limited%20Time%20Business%20Website%20Offer!'
                  : 'https://wa.me/918012622119?text=Hi%20SpringWeb,%20I%20want%20to%20claim%20the%20$249%20Global%20Business%20Website%20Offer!'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs font-bold py-3.5 px-6 shrink-0 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare size={16} />
                <span>{isIndiaOffer ? 'Message on WhatsApp (₹15,000 Offer)' : 'Message on WhatsApp ($249 Offer)'}</span>
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
