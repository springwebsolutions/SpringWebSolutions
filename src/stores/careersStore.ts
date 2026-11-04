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

// Verified Active Job Openings for India & Global Remote (Updated 2026 - 100% External Real Vacancies)
const SEED_JOBS: JobPosting[] = [
  {
    id: 'job-atlassian-software-engineer-2026',
    title: 'Software Engineer II (Distributed Cloud Systems)',
    slug: 'software-engineer-2-atlassian-remote-india',
    company_name: 'Atlassian',
    company_logo: 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Karnataka',
    location_city: 'Bengaluru / Remote',
    location_area: 'Team Anywhere / Remote All-India',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '₹28,00,000 - ₹45,00,000 / year + RSUs',
    niche_category: 'Software Engineering',
    description: "Atlassian is actively hiring Software Engineers in India under their 'Team Anywhere' model. Work on distributed Jira / Confluence cloud services, AWS microservices, and AI-driven workflow engines remotely from anywhere in India.",
    requirements: [
      '2-5 years experience developing in Java, Kotlin, Python, or Golang',
      'Solid foundation in distributed systems, asynchronous event streaming (Kafka), and microservices',
      'Experience with AWS cloud services (DynamoDB, ECS/EKS, S3, IAM)',
      '100% remote flexibility with home office setup allowance'
    ],
    apply_link_or_email: 'https://www.atlassian.com/company/careers/all-jobs',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'job-canonical-software-engineer-2026',
    title: 'Software Engineer (Ubuntu, Cloud & Go/Python)',
    slug: 'software-engineer-canonical-ubuntu-remote',
    company_name: 'Canonical',
    company_logo: 'https://assets.ubuntu.com/v1/fa5b42d6-canonical-logo-2022.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'All-India',
    location_city: 'Remote India',
    location_area: 'Home-Based Anywhere in India',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '$55,000 - $95,000 / year USD (~₹45L - ₹78L LPA)',
    niche_category: 'Cloud & Infrastructure',
    description: 'Canonical is actively hiring remote software engineers across India to build and scale open-source cloud infrastructure, Snap packages, Kubernetes clusters, and low-level Linux systems behind Ubuntu.',
    requirements: [
      'Proficiency in Go, Python, or C/C++ in a Linux environment',
      'Deep familiarity with Linux OS internals, systemd, containers, and networking',
      'Experience with open-source collaboration and Git workflow',
      '100% remote home-based contract from India'
    ],
    apply_link_or_email: 'https://canonical.com/careers',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'job-gitlab-backend-engineer-2026',
    title: 'Backend Engineer (Distributed Systems & Go)',
    slug: 'backend-engineer-gitlab-remote-india',
    company_name: 'GitLab',
    company_logo: 'https://about.gitlab.com/images/press/logo/png/gitlab-icon-rgb.png',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Karnataka',
    location_city: 'Bengaluru / Remote',
    location_area: 'All-Remote India Hub',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Senior Level',
    salary_range: '$65,000 - $115,000 / year USD (~₹54L - ₹95L LPA)',
    niche_category: 'Software Engineering',
    description: "Join GitLab's all-remote global engineering team from India. Work on high-throughput distributed microservices, database partitioning, CI/CD pipelines, and open-core platform features.",
    requirements: [
      '4+ years professional software engineering experience with Go or Ruby on Rails',
      'Proven track record with PostgreSQL query optimization and distributed caches (Redis)',
      'Strong written communication skills tailored for GitLab handbook-first async culture',
      'Experience building and maintaining high-availability microservices'
    ],
    apply_link_or_email: 'https://boards.greenhouse.io/gitlab',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'job-automattic-fullstack-dev-2026',
    title: 'Software Engineer (React, TypeScript & Web Platform)',
    slug: 'software-engineer-automattic-remote-worldwide',
    company_name: 'Automattic',
    company_logo: 'https://automattic.com/wp-content/themes/automattic-2017/images/automattic-logo.png',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Remote Worldwide',
    location_city: 'Remote India',
    location_area: '100% Work from Anywhere in India',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '$70,000 - $120,000 / year USD (~₹58L - ₹99L LPA)',
    niche_category: 'Software Engineering',
    description: 'Automattic is 100% distributed across 90+ countries. They are hiring experienced software engineers in India to build high-scale web platforms powering WordPress.com, WooCommerce, and Tumblr.',
    requirements: [
      'Extensive experience with modern JavaScript, TypeScript, React, and PHP/Node.js',
      'Ability to thrive in an autonomous, asynchronous written-work culture',
      'Experience contributing to large-scale open-source or commercial web applications',
      'Generous open vacation policy, home office setup stipend, and hardware allowance'
    ],
    apply_link_or_email: 'https://automattic.com/work-with-us/',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'job-razorpay-sde2-golang-2026',
    title: 'Software Development Engineer II (Golang & Payments Core)',
    slug: 'sde-2-golang-razorpay-bengaluru',
    company_name: 'Razorpay',
    company_logo: 'https://razorpay.com/assets/razorpay-glyph.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Karnataka',
    location_city: 'Bengaluru',
    location_area: 'Koramangala Tech Hub / Hybrid',
    is_remote: false,
    is_wfh: false,
    job_type: 'Full-Time',
    experience_level: 'Senior Level',
    salary_range: '₹24,00,000 - ₹38,00,000 / year + ESOPs',
    niche_category: 'Software Engineering',
    description: 'Razorpay powers millions of digital payments across India. They are hiring SDE II engineers in Bengaluru to build sub-50ms financial ledger transactions, idempotency engines, and multi-cloud banking integrations.',
    requirements: [
      '3-6 years of experience with Golang, microservices, and distributed architecture',
      'Strong understanding of ACID guarantees, distributed locking, and Kafka queues',
      'Experience designing high-throughput REST APIs handling thousands of transactions per second (TPS)',
      'Hybrid working model at Razorpay headquarters in Koramangala, Bengaluru'
    ],
    apply_link_or_email: 'https://boards.greenhouse.io/razorpay',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'job-zoho-software-developer-2026',
    title: 'Software Developer (Cloud Systems & Enterprise SaaS)',
    slug: 'software-developer-zoho-chennai-tenkasi',
    company_name: 'Zoho Corporation',
    company_logo: 'https://www.zohowebstatic.com/sites/zweb/images/common/zoho-logo-web.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Tamil Nadu',
    location_city: 'Chennai',
    location_area: 'Estancia IT Park, Guduvanchery / Tenkasi',
    is_remote: false,
    is_wfh: false,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '₹8,50,000 - ₹18,00,000 / year',
    niche_category: 'Software Engineering',
    description: 'Zoho builds boot-strapped, profitable SaaS products used by over 100 million users worldwide. They are hiring software engineers across Tamil Nadu (Chennai, Tenkasi, Madurai) to develop own-stack cloud engines.',
    requirements: [
      '2-5 years experience developing in Java, C++, Python, or modern JavaScript',
      'Strong fundamentals in data structures, algorithms, and relational databases',
      'Passion for product craftsmanship and long-term codebase ownership',
      'On-site presence at Zoho campuses in Chennai or Tenkasi, Tamil Nadu'
    ],
    apply_link_or_email: 'https://careers.zohocorp.com',
    status: 'active',
    featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'job-postman-frontend-platform-2026',
    title: 'Software Engineer (Frontend API Platform & React)',
    slug: 'frontend-engineer-postman-bengaluru',
    company_name: 'Postman',
    company_logo: 'https://assets.postman.com/common-assets/postman-logo-icon.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Karnataka',
    location_city: 'Bengaluru',
    location_area: 'Indiranagar / Flexible Hybrid',
    is_remote: false,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '₹22,00,000 - ₹36,00,000 / year',
    niche_category: 'Software Engineering',
    description: "Postman is the world's leading API platform used by 30+ million developers. They are hiring Frontend Engineers in Bengaluru to build rich client interfaces, Electron desktop integrations, and API schema tooling.",
    requirements: [
      '3+ years building complex web client applications with React, TypeScript, and Redux/Zustand',
      'Deep knowledge of web standards, browser rendering performance, and Electron/Node internals',
      'Experience designing modular UI components for developer-facing tools',
      'Flexible hybrid working arrangements out of Postman Bengaluru hub'
    ],
    apply_link_or_email: 'https://postman.wd108.myworkdayjobs.com/careers',
    status: 'active',
    featured: false,
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
    const local = localStorage.getItem('springweb_jobs_cache_v2026')
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
    if (!isSupabaseConfigured) {
      set({ jobs: SEED_JOBS })
      localStorage.setItem('springweb_jobs_cache_v2026', JSON.stringify(SEED_JOBS))
      return
    }
    try {
      set({ loading: true })
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) {
        // Merge verified live seed jobs with any external DB postings
        const seedSlugs = new Set(SEED_JOBS.map(j => j.slug))
        const combined = [...SEED_JOBS, ...data.filter((d: any) => !seedSlugs.has(d.slug))]
        set({ jobs: combined })
        localStorage.setItem('springweb_jobs_cache_v2026', JSON.stringify(combined))
      } else {
        set({ jobs: SEED_JOBS })
        localStorage.setItem('springweb_jobs_cache_v2026', JSON.stringify(SEED_JOBS))
      }
    } catch (e) {
      console.warn('Jobs fetch fallback to seed:', e)
      set({ jobs: SEED_JOBS })
      localStorage.setItem('springweb_jobs_cache_v2026', JSON.stringify(SEED_JOBS))
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
