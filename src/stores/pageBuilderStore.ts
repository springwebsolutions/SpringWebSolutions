import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface PageData {
  id: string
  title: string
  slug: string
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  is_published: boolean
}

export interface SectionData {
  id: string
  page_id: string
  type: string
  content: any
  styling: any
  display_order: number
  is_active: boolean
}

interface PageBuilderState {
  currentPage: PageData | null
  currentSections: SectionData[]
  pages: PageData[]
  siteConfig: any
  navigation: any
  theme: 'dark' | 'light'
  loading: boolean
  pageCache: Record<string, { page: PageData; sections: SectionData[] }>
  fetchPageData: (slug: string) => Promise<void>
  prefetchAllPages: () => Promise<void>
  fetchPages: () => Promise<void>
  fetchSettings: () => Promise<void>
  toggleTheme: (forcedTheme?: 'dark' | 'light') => void
  initTheme: () => void
  saveSectionContent: (sectionId: string, content: any, styling?: any) => Promise<void>
  toggleSectionActive: (sectionId: string, isActive: boolean) => Promise<void>
  updateSectionsOrder: (reorderedSections: SectionData[]) => Promise<void>
  addSection: (pageId: string, type: string, content: any, styling?: any) => Promise<void>
  deleteSection: (sectionId: string) => Promise<void>
  updatePageSEO: (pageId: string, seoTitle: string, seoDescription: string, seoKeywords: string) => Promise<void>
  saveNavigation: (navigationData: any) => Promise<void>
}

// Fallback seed data for immediate 0ms initial render without network delay
const DEFAULT_PAGES_CACHE: Record<string, { page: PageData; sections: SectionData[] }> = {
  home: {
    page: {
      id: 'default-home-id',
      title: 'Home',
      slug: 'home',
      seo_title: 'Spring Web Solutions | Websites, Software & Automation',
      seo_description: 'We build premium websites, custom business software, SEO growth strategies, and workflow automations.',
      seo_keywords: 'websites, custom software, business automation, SEO services',
      is_published: true
    },
    sections: [
      {
        id: 'home-hero',
        page_id: 'default-home-id',
        type: 'hero',
        content: {
          headline: "Helping Businesses Grow Through Websites, Software & Automation",
          subheadline: "We engineer high-performance business websites, custom software solutions, SEO strategies, and custom integrations that save hundreds of hours, boost organic lead generation, and accelerate revenue growth.",
          cta_primary_text: "Get Free Consultation",
          cta_primary_href: "/contact",
          cta_secondary_text: "Explore Services",
          cta_secondary_href: "/services"
        },
        styling: { padding_top: "py-24", padding_bottom: "py-20", background_type: "obsidian-glow" },
        display_order: 0,
        is_active: true
      },
      {
        id: 'home-stats',
        page_id: 'default-home-id',
        type: 'stats',
        content: {
          items: [
            { value: "3", label: "Completed Projects" },
            { value: "100%", label: "Sprint Delivery Rate" },
            { value: "< 1s", label: "Average Page Load Speed" },
            { value: "99.9%", label: "Uptime SLA Guarantee" }
          ]
        },
        styling: { padding_top: "py-10", padding_bottom: "py-10" },
        display_order: 1,
        is_active: true
      },
      {
        id: 'home-services',
        page_id: 'default-home-id',
        type: 'services_summary',
        content: {
          title: "Digital Solutions Built for Long-Term Scalability",
          subtitle: "We integrate frontend interfaces, backend logic, e-commerce transactions, and CRM analytics into unified platforms.",
          items: [
            { title: "Website Development", desc: "High-speed corporate sites, portfolio layouts, landing channels, and WooCommerce/Shopify architectures.", href: "/services" },
            { title: "Custom Software Development", desc: "Proprietary CRM, ERP, client dashboards, inventory managers, and custom SaaS infrastructures.", href: "/services" },
            { title: "Business Automation", desc: "Custom workflow automations, WhatsApp notifications integrations, reporting logs, and API syncs.", href: "/services" },
            { title: "Technical SEO", desc: "Semantic markup mapping, Core Web Vitals optimizations, keyword targets, and ranking audits.", href: "/services" }
          ]
        },
        styling: { padding_top: "py-16", padding_bottom: "py-16" },
        display_order: 2,
        is_active: true
      },
      {
        id: 'home-testimonials',
        page_id: 'default-home-id',
        type: 'testimonials_summary',
        content: {
          title: "Delivering Measurable Outcomes for Growing Teams",
          subtitle: "Read real feedback from clients who scaled their operations with our code.",
          items: []
        },
        styling: { padding_top: "py-16", padding_bottom: "py-16" },
        display_order: 3,
        is_active: false
      },
      {
        id: 'home-tech',
        page_id: 'default-home-id',
        type: 'tech_stack',
        content: {
          title: "Our Engineering Ecosystem",
          subtitle: "We use modern, reliable, and secure tools to build platforms that do not go offline or suffer from bloat.",
          categories: [
            { name: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "Vite", "Next.js"] },
            { name: "Backend & Database", items: ["Node.js", "PostgreSQL", "Supabase", "REST & GraphQL APIs"] },
            { name: "Integrations & SaaS", items: ["Stripe", "Razorpay", "Twilio (WhatsApp)", "Zapier API", "OpenAI API"] }
          ]
        },
        styling: { padding_top: "py-16", padding_bottom: "py-16" },
        display_order: 4,
        is_active: true
      },
      {
        id: 'home-case-studies',
        page_id: 'default-home-id',
        type: 'case_studies',
        content: {
          title: "Engineering Transformation Case Studies",
          subtitle: "Explore real-world technical transformations where custom software and high-speed web engineering delivered measurable business results."
        },
        styling: { padding_top: "py-16", padding_bottom: "py-16" },
        display_order: 5,
        is_active: false
      },
      {
        id: 'home-comparison',
        page_id: 'default-home-id',
        type: 'comparison',
        content: {
          title: "Why Choose Spring Web Solutions?",
          subtitle: "See how our high-performance engineering standards compare against traditional freelance work and generic template agencies."
        },
        styling: { padding_top: "py-16", padding_bottom: "py-16" },
        display_order: 6,
        is_active: true
      },
      {
        id: 'home-faq',
        page_id: 'default-home-id',
        type: 'faq',
        content: {
          title: "Frequently Asked Questions",
          subtitle: "Everything you need to know about our web engineering process, code ownership, timelines, and technical standards."
        },
        styling: { padding_top: "py-16", padding_bottom: "py-16" },
        display_order: 7,
        is_active: true
      },
      {
        id: 'home-cta',
        page_id: 'default-home-id',
        type: 'cta',
        content: {
          title: "Accelerate Your Digital Transformation Today",
          subtitle: "Book a technical analysis with our solution engineers. We will review your processes, current website, or software idea and provide a concrete action checklist.",
          cta_primary_text: "Request Consultation",
          cta_primary_href: "/contact",
          cta_secondary_text: "Explore Services",
          cta_secondary_href: "/services"
        },
        styling: { padding_top: "py-20", padding_bottom: "py-20" },
        display_order: 8,
        is_active: true
      }
    ]
  },
  about: {
    page: {
      id: 'default-about-id',
      title: 'About Us',
      slug: 'about',
      seo_title: 'About Us | Spring Web Solutions',
      seo_description: 'Learn about our mission, vision, values, and work process.',
      seo_keywords: 'software developers, digital agency',
      is_published: true
    },
    sections: [
      {
        id: 'about-hero',
        page_id: 'default-about-id',
        type: 'hero',
        content: {
          headline: "The Engineering Team Behind Spring Web Solutions",
          subheadline: "We are solution engineers, architects, and designers who believe that software should be robust, design should be clean, and operations should be automated. We help companies eliminate manual labor and scale customer acquisition.",
          cta_primary_text: "Meet the Team",
          cta_primary_href: "/contact",
          cta_secondary_text: "See Our Technology",
          cta_secondary_href: "#milestones"
        },
        styling: { padding_top: "py-24", padding_bottom: "py-20" },
        display_order: 0,
        is_active: true
      },
      {
        id: 'about-stats',
        page_id: 'default-about-id',
        type: 'stats',
        content: {
          items: [
            { value: "3", label: "Projects Completed" },
            { value: "100%", label: "Clean Code & Quality" },
            { value: "< 1s", label: "PageSpeed Performance" },
            { value: "100%", label: "On-Time Delivery Rate" }
          ]
        },
        styling: { id: "milestones", padding_top: "py-16", padding_bottom: "py-16" },
        display_order: 1,
        is_active: true
      },
      {
        id: 'about-team',
        page_id: 'default-about-id',
        type: 'team',
        content: {
          title: "Our Engineering Principles & Leadership",
          subtitle: "Spring Web Solutions is powered by solution architects and software engineers dedicated to high-speed code, zero tech bloat, and total transparency."
        },
        styling: { padding_top: "py-16", padding_bottom: "py-16" },
        display_order: 2,
        is_active: true
      },
      {
        id: 'about-faq',
        page_id: 'default-about-id',
        type: 'faq',
        content: {
          title: "Frequently Asked Questions",
          subtitle: "Learn more about our development methodology, code security, and post-launch maintenance."
        },
        styling: { padding_top: "py-16", padding_bottom: "py-16" },
        display_order: 3,
        is_active: true
      }
    ]
  },
  services: {
    page: {
      id: 'default-services-id',
      title: 'Services',
      slug: 'services',
      seo_title: 'Professional Digital Services | Spring Web Solutions',
      seo_description: 'Explore our comprehensive digital solutions.',
      seo_keywords: 'website development, CRM development, custom ERP',
      is_published: true
    },
    sections: [
      {
        id: 'services-hero',
        page_id: 'default-services-id',
        type: 'hero',
        content: {
          headline: "End-to-End Digital Services & Pricing Plans",
          subheadline: "We design, build, deploy, and maintain custom applications and websites. We specialize in complex API integrations, database mapping, conversion-optimized checkout funnels, and transparent pricing packages.",
          cta_primary_text: "Request a Quote",
          cta_primary_href: "/contact",
          cta_secondary_text: "Contact Architect",
          cta_secondary_href: "/contact"
        },
        styling: { padding_top: "py-24", padding_bottom: "py-20" },
        display_order: 0,
        is_active: true
      },
      {
        id: 'services-summary',
        page_id: 'default-services-id',
        type: 'services_summary',
        content: {
          title: "Our Services Spectrum",
          subtitle: "High-performance modules designed to elevate your company operations and client conversion rates.",
          items: [
            { title: "Website Development", desc: "High-performance enterprise sites, lightweight landing pages, and interactive product configurators designed to load in milliseconds.", href: "/contact" },
            { title: "Custom CRM/ERP Software", desc: "Centralized client hubs, internal scheduling dashboards, secure client portals, and legacy system API bridges built using secure auth structures.", href: "/contact" },
            { title: "API & Webhook Automations", desc: "Zero-latency data flows connecting Stripe payments, Twilio SMS alerts, Zapier logic paths, and custom SQL reporting logs.", href: "/contact" },
            { title: "Search Optimization (SEO)", desc: "Semantic HTML validation, keyword search intent mapping, schema markups, and PageSpeed audits that drive organic search leads.", href: "/contact" }
          ]
        },
        styling: { padding_top: "py-16", padding_bottom: "py-16" },
        display_order: 1,
        is_active: true
      },
      {
        id: 'services-pricing',
        page_id: 'default-services-id',
        type: 'pricing_summary',
        content: {
          title: "Transparent & Scalable Pricing Plans",
          subtitle: "Select a package designed for your current growth stage, or contact our engineers for bespoke enterprise software requirements."
        },
        styling: { padding_top: "py-16", padding_bottom: "py-16" },
        display_order: 2,
        is_active: true
      },
      {
        id: 'services-cta',
        page_id: 'default-services-id',
        type: 'cta',
        content: {
          title: "Ready to Automate Your Workflows?",
          subtitle: "Get a free 30-minute system analysis with our engineers. We will review your processes, find database bottlenecks, and outline a concrete action checklist.",
          cta_primary_text: "Analyze My Process",
          cta_primary_href: "/contact",
          cta_secondary_text: "Read Case Studies",
          cta_secondary_href: "/blog"
        },
        styling: { padding_top: "py-20", padding_bottom: "py-20" },
        display_order: 3,
        is_active: true
      }
    ]
  },
  pricing: {
    page: {
      id: 'default-pricing-id',
      title: 'Pricing',
      slug: 'pricing',
      seo_title: 'Digital Platform Pricing Plans | Spring Web Solutions',
      seo_description: 'Flexible Starter, Professional, and Enterprise packages.',
      seo_keywords: 'software pricing, website costs',
      is_published: true
    },
    sections: [
      {
        id: 'pricing-hero',
        page_id: 'default-pricing-id',
        type: 'hero',
        content: {
          headline: "Flexible Solutions for Any Stage of Growth",
          subheadline: "Choose from our starter setups, dedicated custom software project packages, or ongoing maintenance support contracts designed to keep your servers secure.",
          cta_primary_text: "Contact Solutions Engineer",
          cta_primary_href: "/contact",
          cta_secondary_text: "Read FAQs",
          cta_secondary_href: "/kb"
        },
        styling: { padding_top: "py-24", padding_bottom: "py-20" },
        display_order: 0,
        is_active: true
      },
      {
        id: 'pricing-stats',
        page_id: 'default-pricing-id',
        type: 'stats',
        content: {
          items: [
            { value: "100%", label: "No Lock-ins" },
            { value: "Scope", label: "Clear Deadlines" },
            { value: "99.9%", label: "Uptime Guarantee" },
            { value: "SLA", label: "Dedicated Support" }
          ]
        },
        styling: { padding_top: "py-16", padding_bottom: "py-16" },
        display_order: 1,
        is_active: true
      },
      {
        id: 'pricing-cta',
        page_id: 'default-pricing-id',
        type: 'cta',
        content: {
          title: "Need a Custom Integration Quote?",
          subtitle: "If your project requires bespoke data structures, custom user levels, or integrations with third-party software, contact our Solutions Architect directly.",
          cta_primary_text: "Connect with Architect",
          cta_primary_href: "/contact",
          cta_secondary_text: "Explore Services",
          cta_secondary_href: "/services"
        },
        styling: { padding_top: "py-20", padding_bottom: "py-20" },
        display_order: 2,
        is_active: true
      }
    ]
  },
  process: {
    page: {
      id: 'default-process-id',
      title: 'Process',
      slug: 'process',
      seo_title: 'Our 8-Step Engineering Process | Spring Web Solutions',
      seo_description: 'Our transparent 8-step execution methodology.',
      seo_keywords: 'agile development, software testing',
      is_published: true
    },
    sections: [
      {
        id: 'process-hero',
        page_id: 'default-process-id',
        type: 'hero',
        content: {
          headline: "Our Collaborative Engineering Lifecycle",
          subheadline: "We adhere to a transparent 8-step execution methodology to guarantee that code quality, deadlines, and project requirements are met with precision.",
          cta_primary_text: "Start Project Discovery",
          cta_primary_href: "/contact",
          cta_secondary_text: "Read Blog Insights",
          cta_secondary_href: "/blog"
        },
        styling: { padding_top: "py-24", padding_bottom: "py-20" },
        display_order: 0,
        is_active: true
      },
      {
        id: 'process-stats',
        page_id: 'default-process-id',
        type: 'stats',
        content: {
          items: [
            { value: "Step 1", label: "Discovery & Scope" },
            { value: "Step 2", label: "System Architecture" },
            { value: "Step 3", label: "UI/UX Design Wireframes" },
            { value: "Step 4", label: "Agile Sprint Development" }
          ]
        },
        styling: { padding_top: "py-16", padding_bottom: "py-16" },
        display_order: 1,
        is_active: true
      }
    ]
  }
}

// Initial cache hydration helper
const getInitialCache = (): Record<string, { page: PageData; sections: SectionData[] }> => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('page_builder_cache_v3')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          return { ...DEFAULT_PAGES_CACHE, ...parsed }
        }
      }
    }
  } catch (e) {
    // Fallback if localStorage read fails
  }
  return DEFAULT_PAGES_CACHE
}

const getInitialSlug = (): string => {
  if (typeof window === 'undefined') return 'home'
  const path = window.location.pathname.substring(1).trim()
  return path || 'home'
}

const initialCache = getInitialCache()
const initialSlug = getInitialSlug()
const initialPageData = initialCache[initialSlug] || initialCache['home']

const DEFAULT_SITE_CONFIG = {
  company_name: "Spring Web Solutions",
  tagline: "Building Websites, Software & Automation That Help Businesses Grow",
  contact_email: "hello@springwebsolutions.in",
  contact_phone: "+91 80126 22119",
  whatsapp_number: "8012622119",
  address: "Udumalpet, Tamil Nadu",
  social_links: {
    github: "https://github.com/springwebsolutions"
  }
}

export const usePageBuilderStore = create<PageBuilderState>((set, get) => ({
  currentPage: initialPageData ? initialPageData.page : null,
  currentSections: initialPageData ? initialPageData.sections : [],
  pages: Object.values(initialCache).map(item => item.page),
  siteConfig: (() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('site_config_cache')
        if (saved) return JSON.parse(saved)
      }
    } catch (e) {}
    return DEFAULT_SITE_CONFIG
  })(),
  navigation: (() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('site_nav_cache')
        if (saved) return JSON.parse(saved)
      }
    } catch (e) {}
    return null
  })(),
  theme: (() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') as 'dark' | 'light' | null : null
    if (saved) return saved
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  })(),
  loading: false,
  pageCache: initialCache,

  fetchPageData: async (slug: string) => {
    if (!isSupabaseConfigured) return

    const cache = get().pageCache
    const targetSlug = slug || 'home'

    // If cached data is present, immediately serve it without setting loading: true
    if (cache[targetSlug]) {
      set({
        currentPage: cache[targetSlug].page,
        currentSections: cache[targetSlug].sections,
        loading: false
      })

      // Silently revalidate from Supabase in the background
      try {
        const { data: page } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', targetSlug)
          .single()

        if (page) {
          const { data: sections } = await supabase
            .from('sections')
            .select('*')
            .eq('page_id', page.id)
            .order('display_order', { ascending: true })

          const updatedCache = {
            ...get().pageCache,
            [targetSlug]: { page, sections: sections || [] }
          }
          
          try {
            localStorage.setItem('page_builder_cache_v3', JSON.stringify(updatedCache))
          } catch (e) {}

          set({
            pageCache: updatedCache,
            ...(get().currentPage?.slug === targetSlug ? {
              currentPage: page,
              currentSections: sections || []
            } : {})
          })
        }
      } catch (e) {
        // Quietly fail background refresh
      }
      return
    }

    // Only set loading if uncached
    set({ loading: true })
    try {
      const { data: page, error: pageErr } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', targetSlug)
        .single()

      if (pageErr) throw pageErr

      if (page) {
        const { data: sections, error: secErr } = await supabase
          .from('sections')
          .select('*')
          .eq('page_id', page.id)
          .order('display_order', { ascending: true })

        if (secErr) throw secErr

        const updatedCache = {
          ...get().pageCache,
          [targetSlug]: { page, sections: sections || [] }
        }

        try {
          localStorage.setItem('page_builder_cache_v3', JSON.stringify(updatedCache))
        } catch (e) {}

        set({
          currentPage: page,
          currentSections: sections || [],
          pageCache: updatedCache
        })
      }
    } catch (err) {
      console.error(`Error loading page data for slug "${targetSlug}":`, err)
    } finally {
      set({ loading: false })
    }
  },

  prefetchAllPages: async () => {
    if (!isSupabaseConfigured) return
    try {
      const { data: pages, error: pageErr } = await supabase.from('pages').select('*')
      if (pageErr) throw pageErr

      const { data: sections, error: secErr } = await supabase
        .from('sections')
        .select('*')
        .order('display_order', { ascending: true })

      if (secErr) throw secErr

      if (pages) {
        const updatedCache = { ...get().pageCache }
        pages.forEach(p => {
          const pageSections = sections ? sections.filter(s => s.page_id === p.id) : []
          updatedCache[p.slug] = { page: p, sections: pageSections }
        })

        try {
          localStorage.setItem('page_builder_cache', JSON.stringify(updatedCache))
        } catch (e) {}

        set({ pageCache: updatedCache, pages })
      }
    } catch (err) {
      console.error('Error prefetching all pages:', err)
    }
  },

  fetchPages: async () => {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase.from('pages').select('*')
      if (error) throw error
      set({ pages: data || [] })
    } catch (err) {
      console.error('Error fetching pages:', err)
    }
  },

  fetchSettings: async () => {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase.from('settings').select('*')
      if (error) throw error

      const config = data?.find(s => s.key === 'site_config')?.value || null
      const nav = data?.find(s => s.key === 'navigation')?.value || null

      if (config) {
        try { localStorage.setItem('site_config_cache', JSON.stringify(config)) } catch (e) {}
      }
      if (nav) {
        try { localStorage.setItem('site_nav_cache', JSON.stringify(nav)) } catch (e) {}
      }

      set({
        siteConfig: config,
        navigation: nav
      })
    } catch (err) {
      console.error('Error loading settings:', err)
    }
  },

  toggleTheme: (forcedTheme) => {
    const currentTheme = get().theme
    const nextTheme = forcedTheme || (currentTheme === 'dark' ? 'light' : 'dark')

    const root = window.document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(nextTheme)

    try { localStorage.setItem('theme', nextTheme) } catch (e) {}
    set({ theme: nextTheme })
  },

  initTheme: () => {
    const root = window.document.documentElement
    const savedTheme = get().theme
    root.classList.remove('dark', 'light')
    root.classList.add(savedTheme)
  },

  saveSectionContent: async (sectionId, content, styling) => {
    if (!isSupabaseConfigured) return
    try {
      const updatePayload: any = { content, updated_at: new Date().toISOString() }
      if (styling) updatePayload.styling = styling

      const { error } = await supabase
        .from('sections')
        .update(updatePayload)
        .eq('id', sectionId)

      if (error) throw error

      const sections = get().currentSections.map(s =>
        s.id === sectionId ? { ...s, content, styling: styling || s.styling } : s
      )

      const curPage = get().currentPage
      if (curPage) {
        const updatedCache = {
          ...get().pageCache,
          [curPage.slug]: { page: curPage, sections }
        }
        try { localStorage.setItem('page_builder_cache', JSON.stringify(updatedCache)) } catch (e) {}
        set({ currentSections: sections, pageCache: updatedCache })
      } else {
        set({ currentSections: sections })
      }
    } catch (err) {
      console.error('Error saving section content:', err)
      throw err
    }
  },

  toggleSectionActive: async (sectionId, isActive) => {
    const sections = get().currentSections.map(s =>
      s.id === sectionId ? { ...s, is_active: isActive } : s
    )

    const curPage = get().currentPage
    if (curPage) {
      const updatedCache = {
        ...get().pageCache,
        [curPage.slug]: { page: curPage, sections }
      }
      try {
        localStorage.setItem('page_builder_cache_v3', JSON.stringify(updatedCache))
      } catch (e) {}
      set({ currentSections: sections, pageCache: updatedCache })
    } else {
      set({ currentSections: sections })
    }

    if (!isSupabaseConfigured) return

    try {
      const { error } = await supabase
        .from('sections')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', sectionId)

      if (error) console.error('Supabase toggle error:', error)
    } catch (err) {
      console.error('Error toggling section in Supabase:', err)
    }
  },

  updateSectionsOrder: async (reorderedSections) => {
    if (!isSupabaseConfigured) return
    try {
      const promises = reorderedSections.map((sec, idx) =>
        supabase
          .from('sections')
          .update({ display_order: idx, updated_at: new Date().toISOString() })
          .eq('id', sec.id)
      )

      await Promise.all(promises)

      const curPage = get().currentPage
      if (curPage) {
        const updatedCache = {
          ...get().pageCache,
          [curPage.slug]: { page: curPage, sections: reorderedSections }
        }
        try { localStorage.setItem('page_builder_cache', JSON.stringify(updatedCache)) } catch (e) {}
        set({ currentSections: reorderedSections, pageCache: updatedCache })
      } else {
        set({ currentSections: reorderedSections })
      }
    } catch (err) {
      console.error('Error updating sections order:', err)
      throw err
    }
  },

  addSection: async (pageId: string, type: string, content: any, styling: any = {}) => {
    if (!isSupabaseConfigured) return
    try {
      const currentSecs = get().currentSections
      const nextOrder = currentSecs.length > 0 ? Math.max(...currentSecs.map(s => s.display_order)) + 1 : 0

      const { data, error } = await supabase
        .from('sections')
        .insert({
          page_id: pageId,
          type,
          content,
          styling: { padding_top: 'py-16', padding_bottom: 'py-16', ...styling },
          display_order: nextOrder,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error

      const newSections = [...currentSecs, data]
      const curPage = get().currentPage
      if (curPage) {
        const updatedCache = {
          ...get().pageCache,
          [curPage.slug]: { page: curPage, sections: newSections }
        }
        try { localStorage.setItem('page_builder_cache', JSON.stringify(updatedCache)) } catch (e) {}
        set({ currentSections: newSections, pageCache: updatedCache })
      } else {
        set({ currentSections: newSections })
      }
    } catch (err) {
      console.error('Error adding section:', err)
      throw err
    }
  },

  deleteSection: async (sectionId: string) => {
    if (!isSupabaseConfigured) return
    try {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', sectionId)

      if (error) throw error

      const newSections = get().currentSections.filter(s => s.id !== sectionId)
      const curPage = get().currentPage
      if (curPage) {
        const updatedCache = {
          ...get().pageCache,
          [curPage.slug]: { page: curPage, sections: newSections }
        }
        try { localStorage.setItem('page_builder_cache', JSON.stringify(updatedCache)) } catch (e) {}
        set({ currentSections: newSections, pageCache: updatedCache })
      } else {
        set({ currentSections: newSections })
      }
    } catch (err) {
      console.error('Error deleting section:', err)
      throw err
    }
  },

  updatePageSEO: async (pageId: string, seoTitle: string, seoDescription: string, seoKeywords: string) => {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase
        .from('pages')
        .update({
          seo_title: seoTitle,
          seo_description: seoDescription,
          seo_keywords: seoKeywords,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageId)
        .select()
        .single()

      if (error) throw error

      if (data) {
        set({ currentPage: data })
        get().fetchPages()
      }
    } catch (err) {
      console.error('Error updating page SEO:', err)
      throw err
    }
  },

  saveNavigation: async (navigationData: any) => {
    if (!isSupabaseConfigured) return
    try {
      const { error } = await supabase
        .from('settings')
        .update({ value: navigationData })
        .eq('key', 'navigation')

      if (error) throw error

      set({ navigation: navigationData })
      try { localStorage.setItem('site_nav_cache', JSON.stringify(navigationData)) } catch (e) {}
    } catch (err) {
      console.error('Error saving navigation:', err)
      throw err
    }
  }
}))
