import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

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

interface CareersState {
  jobs: JobPosting[]
  guides: CareerGuide[]
  adConfigs: AdConfig[]
  loading: boolean
  
  // Actions
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

const SEED_GUIDES: CareerGuide[] = [
  {
    id: 'guide-1',
    title: 'How to Land Remote Software Engineering Jobs from India in 2026',
    slug: 'land-remote-software-jobs-india-2026',
    excerpt: 'A comprehensive roadmap for developers in Tier-2 and Tier-3 cities in India to secure high-paying remote global positions.',
    content: `## The Rise of Remote Engineering

With international companies looking for top software talent worldwide, developers in cities like Udumalpet, Coimbatore, and Tiruppur can now secure high-paying US/EU remote contracts without relocating.

### 1. Build Proof of Work
Having a generic resume is no longer enough. Build 2-3 production-ready applications with clean GitHub code repositories, live Vercel/Supabase demos, and modern UI design.

### 2. Master Asynchronous Communication
Remote engineering relies heavily on written clarity in Slack, GitHub pull requests, and documentation.

### 3. Key Platforms for Global Remote Hiring
- GitHub Jobs & Open Source Contributions
- LinkedIn Advanced Filters (Filter by 'Remote Worldwide')
- SpringWeb Career Portal & Job Vault`,
    category: 'Career Guidance',
    author: 'SpringWeb Career Team',
    tags: ['Remote Work', 'Software Jobs', 'Career Roadmap', 'Global Opportunities'],
    cover_image: '/software-engineering.png',
    status: 'published',
    created_at: new Date().toISOString()
  },
  {
    id: 'guide-2',
    title: 'Native Android (Kotlin) vs Cross-Platform (Flutter) in 2026: Career Outlook',
    slug: 'kotlin-vs-flutter-career-outlook-2026',
    excerpt: 'Which framework offers better job security, salary packages, and growth in mobile application development?',
    content: `## The Mobile Development Landscape

Mobile app development remains one of the highest demand sectors in IT. Here is a breakdown of Native Android vs Flutter in 2026.

### Native Android (Kotlin)
- **Best for**: Enterprise apps, IoT, low-level hardware integration, and high-performance banking apps.
- **Average India Package**: ₹6 LPA - ₹22 LPA depending on experience.

### Flutter (Dart)
- **Best for**: Startups, MVP launches, cross-platform iOS/Android code sharing.
- **Average India Package**: ₹5 LPA - ₹18 LPA.`,
    category: 'Job Market Trends',
    author: 'Tech Careers Desk',
    tags: ['Android', 'Kotlin', 'Flutter', 'Mobile Dev', 'Salaries'],
    cover_image: '/app-dev.png',
    status: 'published',
    created_at: new Date().toISOString()
  }
]

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
    if (!isSupabaseConfigured) return
    try {
      set({ loading: true })
      const { data, error } = await supabase
        .from('career_guides')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) {
        set({ guides: data })
        localStorage.setItem('springweb_guides_cache', JSON.stringify(data))
      }
    } catch (e) {
      console.warn('Guides fetch fallback to seed:', e)
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
  }
}))
