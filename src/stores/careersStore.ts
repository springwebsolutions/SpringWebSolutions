import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { classifyJobCategory, extractExperienceLevel, generateTemplateSummary, generateSlug } from '@/lib/jobNormalizer'
import { CAREER_GUIDES_DATA } from '@/data/careerGuides'

export interface JobPosting {
  id: string
  title: string
  slug: string
  company_name: string
  company_logo?: string
  is_internal_hiring?: boolean // true = SpringWeb Solutions internal opening, false = external employer vacancy
  location_country: string
  location_state: string
  location_city: string
  location_area?: string
  is_remote: boolean
  is_wfh: boolean
  job_type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship' | 'Freelance'
  experience_level: 'Entry Level / Fresher' | 'Mid Level' | 'Senior Level' | 'Lead / Executive'
  salary_range: string
  niche_category: string
  description: string
  requirements: string[]
  apply_link_or_email: string
  status: 'active' | 'filled' | 'archived'
  featured: boolean
  created_at: string
}

export interface CareerGuide {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: 'Career Guidance' | 'Entrance Exams' | 'Skill Building' | 'Remote Work Tips' | 'Resume & Interviews' | 'Job Market Trends'
  author: string
  tags: string[]
  cover_image?: string
  status: 'published' | 'draft' | 'archived'
  created_at: string
}

export interface AdConfig {
  id: string
  zone_id: 'header_leaderboard' | 'sidebar_rectangle' | 'in_feed_banner' | 'article_bottom'
  title: string
  ad_type: 'google_adsense' | 'custom_banner' | 'html_code'
  adsense_client_id?: string
  adsense_slot_id?: string
  image_url?: string
  target_url?: string
  html_code?: string
  is_active: boolean
}

// ─── Discovery Pipeline Types ───────────────────────────────────────────────

export interface DiscoveredJob {
  id: string
  source_name: string
  source_url?: string
  source_id?: string
  raw_title: string
  raw_company: string
  raw_location?: string
  raw_salary?: string
  raw_description?: string
  raw_requirements?: string[]
  raw_apply_url?: string
  normalized_title?: string
  normalized_company?: string
  fingerprint?: string
  ai_summary?: string
  ai_category?: string
  ai_experience_level?: string
  ai_salary_parsed?: { min: number | null; max: number | null; currency: string; period: string }
  ai_location_parsed?: { country: string; state: string; city: string; is_remote: boolean }
  status: 'discovered' | 'verified' | 'rejected' | 'published' | 'expired'
  verified_by?: string
  verified_at?: string
  rejection_reason?: string
  published_job_id?: string
  discovered_at: string
  expires_at?: string
  updated_at?: string
}

export interface ScrapeRun {
  id: string
  source_name: string
  query_params?: Record<string, unknown>
  status: 'running' | 'completed' | 'failed'
  jobs_found: number
  jobs_new: number
  jobs_duplicate: number
  jobs_updated: number
  error_message?: string
  started_at: string
  completed_at?: string
  triggered_by?: string
}

export interface SocialCard {
  id: string
  job_id: string
  platform: 'instagram' | 'linkedin' | 'twitter' | 'whatsapp' | 'telegram'
  card_type: 'image' | 'carousel' | 'story' | 'video'
  card_data: Record<string, unknown>
  image_url?: string
  caption?: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduled_at?: string
  published_at?: string
  created_at: string
}

export interface JobAlert {
  id: string
  email: string
  name?: string
  keywords: string[]
  locations: string[]
  job_types: string[]
  categories: string[]
  min_salary?: string
  frequency: 'instant' | 'daily' | 'weekly'
  is_active: boolean
  is_verified: boolean
  alerts_sent: number
  last_sent_at?: string
  created_at: string
}

export interface DiscoveryStats {
  total_discovered: number
  pending_review: number
  verified: number
  published: number
  rejected: number
  expired: number
  total_scrape_runs: number
  last_scrape_at: string | null
  total_alerts: number
  total_social_cards: number
  sources: string[]
  top_categories: Array<{ category: string; count: number }>
}

interface CareersState {
  jobs: JobPosting[]
  guides: CareerGuide[]
  adConfigs: AdConfig[]
  loading: boolean
  
  // Existing Actions
  fetchJobs: () => Promise<void>
  fetchGuides: () => Promise<void>
  fetchAdConfigs: () => Promise<void>
  
  addJob: (job: Omit<JobPosting, 'id' | 'created_at'>) => Promise<void>
  updateJob: (id: string, job: Partial<JobPosting>) => Promise<void>
  deleteJob: (id: string) => Promise<void>
  
  addGuide: (guide: Omit<CareerGuide, 'id' | 'created_at'>) => Promise<void>
  updateGuide: (id: string, guide: Partial<CareerGuide>) => Promise<void>
  deleteGuide: (id: string) => Promise<void>
  
  updateAdConfig: (zone_id: AdConfig['zone_id'], config: Partial<AdConfig>) => Promise<void>

  // ─── Discovery Pipeline State & Actions ─────────────────────────────────
  discoveredJobs: DiscoveredJob[]
  scrapeRuns: ScrapeRun[]
  socialCards: SocialCard[]
  jobAlerts: JobAlert[]
  discoveryStats: DiscoveryStats | null
  discoveryLoading: boolean

  fetchDiscoveredJobs: (status?: string) => Promise<void>
  fetchScrapeRuns: () => Promise<void>
  fetchSocialCards: () => Promise<void>
  fetchJobAlerts: () => Promise<void>
  fetchDiscoveryStats: () => Promise<void>

  verifyJob: (id: string) => Promise<void>
  rejectJob: (id: string, reason: string) => Promise<void>
  publishDiscoveredJob: (id: string, overrides?: Partial<JobPosting>) => Promise<void>
  expireJob: (id: string) => Promise<void>
  triggerDiscovery: (query?: string, location?: string, sources?: string[]) => Promise<{ total_new: number; total_found: number }>
  triggerCategorization: (jobIds?: string[]) => Promise<void>

  addSocialCard: (card: Omit<SocialCard, 'id' | 'created_at'>) => Promise<void>
  deleteSocialCard: (id: string) => Promise<void>

  addJobAlert: (alert: Omit<JobAlert, 'id' | 'created_at' | 'is_verified' | 'alerts_sent'>) => Promise<void>
}

// Initial Seeds for Offline & Fallback Access
const SEED_JOBS: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Senior Full-Stack React & Node Engineer',
    slug: 'senior-fullstack-react-node-engineer',
    company_name: 'Spring Web Solutions',
    company_logo: '/logo-emblem.png',
    is_internal_hiring: true,
    location_country: 'India',
    location_state: 'Tamil Nadu',
    location_city: 'Udumalpet',
    location_area: 'Main Road Tech Zone',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '₹8,00,000 - ₹14,00,000 / year',
    niche_category: 'Software Engineering',
    description: 'We are hiring a skilled Full-Stack React and Node.js Engineer to build enterprise SaaS products, custom CRM platforms, and REST API microservices for global clients.',
    requirements: [
      '3+ years experience with React, Next.js, and TypeScript',
      'Strong knowledge of Node.js, Express, and PostgreSQL/Supabase',
      'Experience with REST APIs, GraphQL, and WebSockets',
      'Ability to work remotely or in our Udumalpet office hub'
    ],
    apply_link_or_email: 'mailto:careers@springwebsolutions.in',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'job-2',
    title: 'Native Android (Kotlin) Mobile Developer',
    slug: 'native-android-kotlin-developer',
    company_name: 'Apex Mobile Technologies',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Tamil Nadu',
    location_city: 'Coimbatore',
    location_area: 'TIDEL Park',
    is_remote: false,
    is_wfh: false,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '₹6,50,000 - ₹11,00,000 / year',
    niche_category: 'Mobile App Development',
    description: 'Looking for a passionate Android Developer proficient in Kotlin, Jetpack Compose, Coroutines, and Google Play Store deployment pipelines.',
    requirements: [
      '2+ years experience building native Android apps in Kotlin',
      'Proficiency with MVVM architecture, Room DB, and Retrofit',
      'Published at least 1 app on Google Play Store',
      'Good understanding of Push Notifications & Firebase'
    ],
    apply_link_or_email: 'mailto:jobs@apexmobile.tech',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'job-3',
    title: 'Windows Desktop Application Engineer (C# .NET)',
    slug: 'windows-desktop-developer-dotnet',
    company_name: 'OmniSys Automation Inc',
    location_country: 'India',
    location_state: 'Tamil Nadu',
    location_city: 'Tiruppur',
    location_area: 'Garment Industrial Zone',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Senior Level',
    salary_range: '₹10,00,000 - ₹18,00,000 / year',
    niche_category: 'Windows Desktop Software',
    description: 'Engineers required to build high-performance Windows desktop billing systems, POS hardware connectors, and inventory management software using C# WPF and WinUI 3.',
    requirements: [
      '4+ years development in C# .NET, WPF, and WinUI 3',
      'Experience with Windows Installer packaging (MSI / MSIX)',
      'Understanding of SQLite and SQL Server database sync',
      'Hardware integration experience (Thermal Printers, Barcode Scanners)'
    ],
    apply_link_or_email: 'mailto:hr@omnisysautomation.com',
    status: 'active',
    featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'job-4',
    title: 'Remote Digital Marketing & Technical SEO Specialist',
    slug: 'remote-seo-digital-marketing-specialist',
    company_name: 'Global Reach Media',
    location_country: 'United States',
    location_state: 'California',
    location_city: 'San Francisco',
    location_area: 'Remote Worldwide',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '$45,000 - $65,000 / year',
    niche_category: 'Digital Marketing & SEO',
    description: 'International remote position for a Data-driven Technical SEO strategist skilled in Google Search Console, Schema markups, and organic ranking optimization.',
    requirements: [
      'Proven track record in technical SEO and Core Web Vitals audit',
      'Knowledge of Ahrefs, SEMrush, Google Analytics 4, and GTM',
      'Fluent written and spoken English communication skills',
      '100% Remote WFH flexible hours'
    ],
    apply_link_or_email: 'mailto:apply@globalreachmedia.io',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'job-5',
    title: 'Senior Frontend Architect (React & Next.js)',
    slug: 'senior-frontend-architect-chennai',
    company_name: 'Vanguard Systems',
    location_country: 'India',
    location_state: 'Tamil Nadu',
    location_city: 'Chennai',
    location_area: 'OMR IT Corridor',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Senior Level',
    salary_range: '₹12,00,000 - ₹20,00,000 / year',
    niche_category: 'Software Engineering',
    description: 'Lead frontend architecture for enterprise SaaS web applications across Tamil Nadu and All-India.',
    requirements: [
      '5+ years in modern React, Next.js, and TypeScript',
      'Performance tuning and micro-frontend design',
      'Hybrid/WFH flexibility across Tamil Nadu'
    ],
    apply_link_or_email: 'mailto:careers@vanguardsystems.in',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'job-6',
    title: 'Cloud Infrastructure & DevOps Lead',
    slug: 'cloud-infrastructure-devops-lead-bengaluru',
    company_name: 'CloudPulse India',
    location_country: 'India',
    location_state: 'Karnataka',
    location_city: 'Bengaluru',
    location_area: 'Electronic City',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Lead / Executive',
    salary_range: '₹18,00,000 - ₹28,00,000 / year',
    niche_category: 'Cloud & Infrastructure',
    description: 'Architect scalable AWS, Kubernetes, Docker, and CI/CD pipelines for pan-India product teams.',
    requirements: [
      '4+ years AWS, Terraform, Docker, and Kubernetes deployment',
      'Experience managing microservices & Supabase/PostgreSQL clusters',
      'Flexible WFH / Bangalore office setup'
    ],
    apply_link_or_email: 'mailto:talent@cloudpulse.io',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString()
  }
]

const SEED_GUIDES: CareerGuide[] = CAREER_GUIDES_DATA

const SEED_ADS: AdConfig[] = [
  {
    id: 'ad-header',
    zone_id: 'header_leaderboard',
    title: 'Header Leaderboard Ad Zone',
    ad_type: 'custom_banner',
    image_url: '',
    target_url: 'https://www.springwebsolutions.in/contact',
    html_code: '',
    is_active: false
  },
  {
    id: 'ad-sidebar',
    zone_id: 'sidebar_rectangle',
    title: 'Sidebar Rectangle Ad Zone',
    ad_type: 'custom_banner',
    image_url: '',
    target_url: 'https://www.springwebsolutions.in/services',
    html_code: '',
    is_active: false
  },
  {
    id: 'ad-infeed',
    zone_id: 'in_feed_banner',
    title: 'In-Feed Job List Ad Zone',
    ad_type: 'custom_banner',
    image_url: '',
    target_url: 'https://www.springwebsolutions.in/contact',
    html_code: '',
    is_active: false
  },
  {
    id: 'ad-article',
    zone_id: 'article_bottom',
    title: 'Career Article Bottom Ad Zone',
    ad_type: 'custom_banner',
    image_url: '',
    target_url: 'https://www.springwebsolutions.in/services',
    html_code: '',
    is_active: false
  }
]

export const useCareersStore = create<CareersState>((set, get) => ({
  jobs: (() => {
    const local = localStorage.getItem('springweb_jobs_cache')
    return local ? JSON.parse(local) : SEED_JOBS
  })(),
  guides: (() => {
    const local = localStorage.getItem('springweb_guides_cache')
    return local ? JSON.parse(local) : SEED_GUIDES
  })(),
  adConfigs: (() => {
    const local = localStorage.getItem('springweb_ads_cache')
    return local ? JSON.parse(local) : SEED_ADS
  })(),
  loading: false,

  fetchJobs: async () => {
    if (!isSupabaseConfigured) return
    try {
      set({ loading: true })
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) {
        set({ jobs: data })
        localStorage.setItem('springweb_jobs_cache', JSON.stringify(data))
      }
    } catch (e) {
      console.warn('Jobs fetch fallback to seed:', e)
    } finally {
      set({ loading: false })
    }
  },

  fetchGuides: async () => {
    if (!isSupabaseConfigured) {
      set({ guides: CAREER_GUIDES_DATA })
      return
    }
    try {
      set({ loading: true })
      const { data, error } = await supabase
        .from('career_guides')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) {
        // Prioritize our rich, authoritative curated guides so latest content always renders
        const curatedSlugs = new Set(CAREER_GUIDES_DATA.map(g => g.slug))
        const combined = [...CAREER_GUIDES_DATA, ...data.filter((d: any) => !curatedSlugs.has(d.slug))]
        set({ guides: combined })
        localStorage.setItem('springweb_guides_cache', JSON.stringify(combined))
      } else {
        set({ guides: CAREER_GUIDES_DATA })
        localStorage.setItem('springweb_guides_cache', JSON.stringify(CAREER_GUIDES_DATA))
      }
    } catch (e) {
      console.warn('Guides fetch fallback to seed:', e)
      set({ guides: CAREER_GUIDES_DATA })
    } finally {
      set({ loading: false })
    }
  },

  fetchAdConfigs: async () => {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase
        .from('ad_configurations')
        .select('*')
      if (!error && data && data.length > 0) {
        set({ adConfigs: data })
        localStorage.setItem('springweb_ads_cache', JSON.stringify(data))
      }
    } catch (e) {
      console.warn('Ad configs fetch fallback to seed:', e)
    }
  },

  addJob: async (jobData) => {
    const newJob: JobPosting = {
      ...jobData,
      id: `job-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    const updated = [newJob, ...get().jobs]
    set({ jobs: updated })
    localStorage.setItem('springweb_jobs_cache', JSON.stringify(updated))

    if (isSupabaseConfigured) {
      try {
        await supabase.from('job_postings').insert(newJob)
      } catch (e) {
        console.warn('Supabase job insert fallback to local:', e)
      }
    }
  },

  updateJob: async (id, jobPartial) => {
    const updated = get().jobs.map(j => j.id === id ? { ...j, ...jobPartial } : j)
    set({ jobs: updated })
    localStorage.setItem('springweb_jobs_cache', JSON.stringify(updated))

    if (isSupabaseConfigured) {
      try {
        await supabase.from('job_postings').update(jobPartial).eq('id', id)
      } catch (e) {
        console.warn('Supabase job update fallback to local:', e)
      }
    }
  },

  deleteJob: async (id) => {
    const updated = get().jobs.filter(j => j.id !== id)
    set({ jobs: updated })
    localStorage.setItem('springweb_jobs_cache', JSON.stringify(updated))

    if (isSupabaseConfigured) {
      try {
        await supabase.from('job_postings').delete().eq('id', id)
      } catch (e) {
        console.warn('Supabase job delete fallback to local:', e)
      }
    }
  },

  addGuide: async (guideData) => {
    const newGuide: CareerGuide = {
      ...guideData,
      id: `guide-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    const updated = [newGuide, ...get().guides]
    set({ guides: updated })
    localStorage.setItem('springweb_guides_cache', JSON.stringify(updated))

    if (isSupabaseConfigured) {
      try {
        await supabase.from('career_guides').insert(newGuide)
      } catch (e) {
        console.warn('Supabase guide insert fallback to local:', e)
      }
    }
  },

  updateGuide: async (id, guidePartial) => {
    const updated = get().guides.map(g => g.id === id ? { ...g, ...guidePartial } : g)
    set({ guides: updated })
    localStorage.setItem('springweb_guides_cache', JSON.stringify(updated))

    if (isSupabaseConfigured) {
      try {
        await supabase.from('career_guides').update(guidePartial).eq('id', id)
      } catch (e) {
        console.warn('Supabase guide update fallback to local:', e)
      }
    }
  },

  deleteGuide: async (id) => {
    const updated = get().guides.filter(g => g.id !== id)
    set({ guides: updated })
    localStorage.setItem('springweb_guides_cache', JSON.stringify(updated))

    if (isSupabaseConfigured) {
      try {
        await supabase.from('career_guides').delete().eq('id', id)
      } catch (e) {
        console.warn('Supabase guide delete fallback to local:', e)
      }
    }
  },

  updateAdConfig: async (zone_id, configPartial) => {
    const updated = get().adConfigs.map(ad => ad.zone_id === zone_id ? { ...ad, ...configPartial } : ad)
    set({ adConfigs: updated })
    localStorage.setItem('springweb_ads_cache', JSON.stringify(updated))

    if (isSupabaseConfigured) {
      try {
        await supabase.from('ad_configurations').upsert({ zone_id, ...configPartial })
      } catch (e) {
        console.warn('Supabase ad config update fallback to local:', e)
      }
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DISCOVERY PIPELINE — State & Actions
  // ═══════════════════════════════════════════════════════════════════════════

  discoveredJobs: [],
  scrapeRuns: [],
  socialCards: [],
  jobAlerts: [],
  discoveryStats: null,
  discoveryLoading: false,

  fetchDiscoveredJobs: async (status?: string) => {
    if (!isSupabaseConfigured) return
    try {
      set({ discoveryLoading: true })
      let query = supabase
        .from('discovered_jobs')
        .select('*')
        .order('discovered_at', { ascending: false })
        .limit(500)
      
      if (status) {
        query = query.eq('status', status)
      }
      
      const { data, error } = await query
      if (!error && data) {
        set({ discoveredJobs: data })
      }
    } catch (e) {
      console.warn('Failed to fetch discovered jobs:', e)
    } finally {
      set({ discoveryLoading: false })
    }
  },

  fetchScrapeRuns: async () => {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase
        .from('scrape_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50)
      if (!error && data) {
        set({ scrapeRuns: data })
      }
    } catch (e) {
      console.warn('Failed to fetch scrape runs:', e)
    }
  },

  fetchSocialCards: async () => {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase
        .from('social_cards')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      if (!error && data) {
        set({ socialCards: data })
      }
    } catch (e) {
      console.warn('Failed to fetch social cards:', e)
    }
  },

  fetchJobAlerts: async () => {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase
        .from('job_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)
      if (!error && data) {
        set({ jobAlerts: data })
      }
    } catch (e) {
      console.warn('Failed to fetch job alerts:', e)
    }
  },

  fetchDiscoveryStats: async () => {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase.rpc('get_discovery_stats')
      if (!error && data) {
        set({ discoveryStats: data as DiscoveryStats })
      }
    } catch (e) {
      console.warn('Failed to fetch discovery stats:', e)
    }
  },

  verifyJob: async (id: string) => {
    if (!isSupabaseConfigured) return
    try {
      const { error } = await supabase
        .from('discovered_jobs')
        .update({ status: 'verified', verified_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', id)
      if (!error) {
        set({ discoveredJobs: get().discoveredJobs.map(j => j.id === id ? { ...j, status: 'verified' as const, verified_at: new Date().toISOString() } : j) })
      }
    } catch (e) {
      console.warn('Failed to verify job:', e)
    }
  },

  rejectJob: async (id: string, reason: string) => {
    if (!isSupabaseConfigured) return
    try {
      const { error } = await supabase
        .from('discovered_jobs')
        .update({ status: 'rejected', rejection_reason: reason, verified_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', id)
      if (!error) {
        set({ discoveredJobs: get().discoveredJobs.map(j => j.id === id ? { ...j, status: 'rejected' as const, rejection_reason: reason } : j) })
      }
    } catch (e) {
      console.warn('Failed to reject job:', e)
    }
  },

  publishDiscoveredJob: async (id: string, overrides?: Partial<JobPosting>) => {
    if (!isSupabaseConfigured) return
    try {
      const job = get().discoveredJobs.find(j => j.id === id)
      if (!job) return

      const isRemote = /remote|anywhere|worldwide/i.test(job.raw_location || '')
      const isWfh = /work from home|wfh|home based/i.test(job.raw_location || '') || isRemote
      const locationParts = (job.raw_location || 'India').split(',').map(s => s.trim())

      const newJobPosting: JobPosting = {
        id: `job-${Date.now()}`,
        title: overrides?.title || job.raw_title,
        slug: generateSlug(job.raw_title, job.raw_company),
        company_name: overrides?.company_name || job.raw_company,
        is_internal_hiring: false,
        location_country: overrides?.location_country || (locationParts.length > 2 ? locationParts[2] : 'India'),
        location_state: overrides?.location_state || (locationParts.length > 1 ? locationParts[1] : ''),
        location_city: overrides?.location_city || locationParts[0] || '',
        location_area: overrides?.location_area || '',
        is_remote: overrides?.is_remote ?? isRemote,
        is_wfh: overrides?.is_wfh ?? isWfh,
        job_type: overrides?.job_type || 'Full-Time',
        experience_level: overrides?.experience_level || (job.ai_experience_level as JobPosting['experience_level']) || 'Mid Level',
        salary_range: job.raw_salary || 'Not Disclosed',
        niche_category: overrides?.niche_category || job.ai_category || 'General / Other',
        description: overrides?.description || job.ai_summary || job.raw_description || '',
        requirements: overrides?.requirements || (Array.isArray(job.raw_requirements) ? job.raw_requirements : []),
        apply_link_or_email: overrides?.apply_link_or_email || job.raw_apply_url || job.source_url || '',
        status: 'active',
        featured: overrides?.featured || false,
        created_at: new Date().toISOString()
      }

      // Add to jobs
      const updatedJobs = [newJobPosting, ...get().jobs]
      set({ jobs: updatedJobs })
      localStorage.setItem('springweb_jobs_cache', JSON.stringify(updatedJobs))

      if (isSupabaseConfigured) {
        try {
          await supabase.from('job_postings').insert(newJobPosting)
        } catch (e) {
          console.warn('Failed to insert job posting into Supabase:', e)
        }
      }

      // Update discovered job status
      await supabase
        .from('discovered_jobs')
        .update({ status: 'published', published_job_id: newJobPosting.id, verified_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', id)

      set({ discoveredJobs: get().discoveredJobs.map(j => j.id === id ? { ...j, status: 'published' as const, published_job_id: newJobPosting.id } : j) })
    } catch (e) {
      console.warn('Failed to publish discovered job:', e)
    }
  },

  expireJob: async (id: string) => {
    if (!isSupabaseConfigured) return
    try {
      await supabase
        .from('discovered_jobs')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('id', id)
      set({ discoveredJobs: get().discoveredJobs.map(j => j.id === id ? { ...j, status: 'expired' as const } : j) })
    } catch (e) {
      console.warn('Failed to expire job:', e)
    }
  },

  triggerDiscovery: async (query?: string, location?: string, sources?: string[]) => {
    try {
      const apiSecret = import.meta.env.VITE_JOB_DISCOVERY_API_SECRET
      const res = await fetch('/api/discover-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-secret': apiSecret || '' },
        body: JSON.stringify({
          query: query || 'software developer',
          location: location || 'India',
          sources: sources || ['company_ats', 'linkedin', 'indeed', 'naukri', 'adzuna', 'remotive', 'jsearch']
        })
      })
      const data = await res.json()
      // Refresh discovered jobs after discovery
      await get().fetchDiscoveredJobs()
      await get().fetchScrapeRuns()
      return { total_new: data.total_new || 0, total_found: data.total_found || 0 }
    } catch (e) {
      console.warn('Discovery trigger failed:', e)
      return { total_new: 0, total_found: 0 }
    }
  },

  triggerCategorization: async (jobIds?: string[]) => {
    try {
      const apiSecret = import.meta.env.VITE_JOB_DISCOVERY_API_SECRET
      await fetch('/api/categorize-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-secret': apiSecret || '' },
        body: JSON.stringify({ job_ids: jobIds, batch: !jobIds })
      })
      await get().fetchDiscoveredJobs()
    } catch (e) {
      console.warn('Categorization trigger failed:', e)
    }
  },

  addSocialCard: async (cardData) => {
    const newCard: SocialCard = {
      ...cardData,
      id: `card-${Date.now()}`,
      created_at: new Date().toISOString()
    }
    set({ socialCards: [newCard, ...get().socialCards] })
    if (isSupabaseConfigured) {
      try {
        await supabase.from('social_cards').insert(newCard)
      } catch (e) {
        console.warn('Failed to insert social card into Supabase:', e)
      }
    }
  },

  deleteSocialCard: async (id: string) => {
    set({ socialCards: get().socialCards.filter(c => c.id !== id) })
    if (isSupabaseConfigured) {
      try {
        await supabase.from('social_cards').delete().eq('id', id)
      } catch (e) {
        console.warn('Failed to delete social card from Supabase:', e)
      }
    }
  },

  addJobAlert: async (alertData) => {
    const newAlert: JobAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      is_verified: false,
      alerts_sent: 0,
      created_at: new Date().toISOString()
    }
    set({ jobAlerts: [newAlert, ...get().jobAlerts] })
    if (isSupabaseConfigured) {
      try {
        await supabase.from('job_alerts').insert(newAlert)
      } catch (e) {
        console.warn('Failed to insert job alert into Supabase:', e)
      }
    }
  }
}))
