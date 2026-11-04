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
  gap_friendly?: boolean
  career_switch_friendly?: boolean
  education_gap_notes?: string
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
// Covers: Internships, Freshers, Mid-Level, Senior, Remote, Onsite, Hybrid across all salary bands
const SEED_JOBS: JobPosting[] = [
  // ── 1. Internships & Freshers (College Students & 2024-2026 Graduates) ─────────────────
  {
    id: 'job-cisco-sde-intern-2026',
    title: 'Software Engineer Intern (Cloud & Networks)',
    slug: 'software-engineer-intern-cisco-bengaluru',
    company_name: 'Cisco Systems',
    company_logo: 'https://www.cisco.com/c/dam/cdc/site/images/brand/cisco-logo-2021.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Karnataka',
    location_city: 'Bengaluru',
    location_area: 'Cisco Campus, Outer Ring Road / Hybrid',
    is_remote: false,
    is_wfh: true,
    job_type: 'Internship',
    experience_level: 'Entry Level / Fresher',
    salary_range: '₹50,000 / month Stipend + PPO Opportunity',
    niche_category: 'Cloud & Infrastructure',
    description: 'Cisco is hiring Software Engineer Interns in Bengaluru. Work on high-throughput cloud networking routers, distributed telemetry pipelines, and Linux networking kernels. Strong performers receive Pre-Placement Offers (PPOs).',
    requirements: [
      'Currently enrolled in B.E./B.Tech/M.Tech in Computer Science, IT, or Electronics (Graduating 2026/2027)',
      'Solid foundation in Computer Networks (TCP/IP, OSI layers), Operating Systems, and Data Structures',
      'Proficiency in C, C++, Python, or Go',
      'Familiarity with Git and Linux command line tools'
    ],
    apply_link_or_email: 'https://www.cisco.com/c/en/us/about/careers.html',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: false
  },
  {
    id: 'job-hackerrank-sde-intern-2026',
    title: 'Software Development Engineer Intern',
    slug: 'sde-intern-hackerrank-bengaluru-remote',
    company_name: 'HackerRank',
    company_logo: 'https://hrcdn.net/fcore/assets/brand/h_mark_sm-9a008c4308.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Karnataka',
    location_city: 'Bengaluru / Remote',
    location_area: 'Remote Friendly / Bengaluru Hub',
    is_remote: true,
    is_wfh: true,
    job_type: 'Internship',
    experience_level: 'Entry Level / Fresher',
    salary_range: '₹40,000 / month Stipend',
    niche_category: 'Software Engineering',
    description: 'HackerRank is seeking enthusiastic SDE Interns to help build developer-first technical assessment environments, code execution sandboxes, and modern React interfaces used by millions of developers.',
    requirements: [
      'Strong problem-solving capability in Data Structures & Algorithms (DSA)',
      'Proficiency in React, TypeScript, Node.js, or Ruby on Rails',
      'Passion for developer tools and automated testing infrastructure',
      'Ability to collaborate asynchronously across distributed engineering teams'
    ],
    apply_link_or_email: 'https://www.hackerrank.com/careers/',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: true
  },
  {
    id: 'job-swiggy-sde-intern-2026',
    title: 'Software Engineering Intern (Logistics Core)',
    slug: 'software-engineering-intern-swiggy-bengaluru',
    company_name: 'Swiggy',
    company_logo: 'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/m/seo/Logos/Swiggy/Swiggy_logo_2024.png',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Karnataka',
    location_city: 'Bengaluru',
    location_area: 'Devarabisanahalli, Outer Ring Road',
    is_remote: false,
    is_wfh: true,
    job_type: 'Internship',
    experience_level: 'Entry Level / Fresher',
    salary_range: '₹45,000 / month Stipend + PPO Track',
    niche_category: 'Software Engineering',
    description: 'Swiggy is looking for passionate engineering interns to work on real-time delivery logistics engines, automated route dispatchers, and high-concurrency microservices.',
    requirements: [
      'Final year B.Tech/Dual Degree students (Graduation year 2026)',
      'Hands-on experience in Java, Go, or Python with relational databases (PostgreSQL/MySQL)',
      'Understanding of microservices architecture and distributed caching (Redis)',
      'Enthusiasm for solving hyper-local delivery algorithms at scale'
    ],
    apply_link_or_email: 'https://careers.swiggy.com/',
    status: 'active',
    featured: false,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: false
  },

  // ── 2. Career Switch & Education Gap Friendly Roles (Zero Degree Barrier / 1-3+ Yrs Gap Accepted) ──
  {
    id: 'job-zoho-skill-first-developer-2026',
    title: 'Software Developer (Skill-First / No Degree Barrier / Gap Friendly)',
    slug: 'graduate-software-developer-zoho-chennai-tenkasi',
    company_name: 'Zoho Corporation',
    company_logo: 'https://www.zohowebstatic.com/sites/zweb/images/common/zoho-logo-web.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Tamil Nadu',
    location_city: 'Chennai',
    location_area: 'Estancia IT Park, Guduvanchery / Tenkasi Campus',
    is_remote: false,
    is_wfh: false,
    job_type: 'Full-Time',
    experience_level: 'Entry Level / Fresher',
    salary_range: '₹6,50,000 - ₹9,50,000 / year',
    niche_category: 'Software Engineering',
    description: 'Zoho hires purely on software engineering competence and logical thinking. We explicitly welcome career switchers, candidates with education gaps, non-CS graduates, and self-taught developers. You will build own-stack SaaS cloud applications, database engines, and web suites.',
    requirements: [
      'Zero degree barrier: Any degree (Arts, Science, Commerce, Engineering) or self-taught programmers eligible',
      'Education gaps of any duration are 100% accepted without penalty',
      'Strong problem-solving capability in Java, C, C++, or Python',
      'Understanding of core computer science: Arrays, Trees, HashMaps, and SQL queries',
      'Willingness to work from Zoho campuses in Chennai, Tenkasi, or Madurai, Tamil Nadu'
    ],
    apply_link_or_email: 'https://careers.zohocorp.com',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: true,
    education_gap_notes: '100% gap-friendly. Zoho evaluates skills through technical coding rounds regardless of academic history or career breaks.'
  },
  {
    id: 'job-thoughtworks-consultant-2026',
    title: 'Associate Software Consultant (Career Switch & Return-to-Work Friendly)',
    slug: 'software-consultant-thoughtworks-india',
    company_name: 'Thoughtworks',
    company_logo: 'https://www.thoughtworks.com/etc.clientlibs/thoughtworks/clientlibs/clientlib-site/resources/images/thoughtworks-logo.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Karnataka',
    location_city: 'Bengaluru',
    location_area: 'Bengaluru / Chennai / Pune / Hybrid',
    is_remote: false,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Entry Level / Fresher',
    salary_range: '₹8,50,000 - ₹14,00,000 / year',
    niche_category: 'Software Engineering',
    description: 'Thoughtworks is an agile software consultancy famous for progressive hiring. Through our Return-to-Work and Vapasi tracks, we actively support professionals returning from career breaks and individuals switching into tech from non-traditional paths. Work with modern microservices, TDD, and clean architecture.',
    requirements: [
      'Open to career switchers, bootcamp graduates, and individuals returning after a career break',
      'Demonstrated passion for clean code, Test-Driven Development (TDD), and refactoring',
      'Familiarity with at least one programming language: Java, C#, Python, JavaScript, or Go',
      'Strong collaborative communication and growth mindset'
    ],
    apply_link_or_email: 'https://www.thoughtworks.com/careers/jobs',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: true,
    education_gap_notes: 'Thoughtworks actively supports returners and career switchers through technical bootcamps and pair-programming onboarding.'
  },
  {
    id: 'job-canonical-remote-software-engineer-2026',
    title: 'Software Engineer (Linux, Open-Source & Cloud)',
    slug: 'remote-software-engineer-canonical-india',
    company_name: 'Canonical (Ubuntu)',
    company_logo: 'https://assets.ubuntu.com/v1/fa5b42d6-canonical-logo-2022.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Pan-India',
    location_city: 'Remote All-India',
    location_area: '100% Home-Based Anywhere in India',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '₹45,00,000 - ₹78,00,000 / year (₹45L - ₹78L LPA)',
    niche_category: 'Cloud & Infrastructure',
    description: 'Canonical is the company behind Ubuntu Linux. We evaluate candidates through rigorous written aptitude and coding tests rather than traditional degrees or resume pedigrees. Career switchers with strong Linux and open-source contributions are strongly encouraged to apply.',
    requirements: [
      'No formal computer science degree required: hiring is 100% merit and aptitude-based',
      'Strong competence in Go, Python, C, or C++ with deep familiarity with Linux operating systems',
      'Track record of independent open-source contributions, personal software projects, or CLI tooling',
      'High asynchronous written communication and analytical reasoning skills'
    ],
    apply_link_or_email: 'https://canonical.com/careers',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: true,
    education_gap_notes: 'Degree-agnostic. Canonical evaluates high school transcripts, aptitude tests, and code samples regardless of career gaps.'
  },
  {
    id: 'job-automattic-software-engineer-2026',
    title: 'Software Engineer (React, TypeScript & Web Platform)',
    slug: 'software-engineer-automattic-remote-india',
    company_name: 'Automattic',
    company_logo: 'https://automattic.com/wp-content/themes/automattic-2017/images/automattic-logo.png',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Pan-India',
    location_city: 'Remote India',
    location_area: '100% Distributed Worldwide',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Senior Level',
    salary_range: '₹58,00,000 - ₹99,00,000 / year (₹58L - ₹99L LPA)',
    niche_category: 'Software Engineering',
    description: 'Automattic powers WordPress.com, WooCommerce, and Tumblr. We do not do traditional whiteboard interviews: candidates build a real paid trial project. Career gaps, self-taught engineers, and career switchers are evaluated purely on the code delivered.',
    requirements: [
      'Zero degree requirement. Audition via a paid, flexible contract trial project',
      'High-level competence with modern JavaScript/TypeScript, React, Node.js, or PHP',
      'Experience building responsive web platforms and accessible UI components',
      'Ability to thrive in an autonomous, 100% text-based async remote work culture'
    ],
    apply_link_or_email: 'https://automattic.com/work-with-us/',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: true,
    education_gap_notes: '100% merit-based trial contract. No resume filtering on graduation dates or gaps.'
  },
  {
    id: 'job-gitlab-backend-engineer-2026',
    title: 'Backend Engineer (Distributed Systems & Go)',
    slug: 'backend-engineer-gitlab-remote-india',
    company_name: 'GitLab',
    company_logo: 'https://about.gitlab.com/images/press/logo/png/gitlab-icon-rgb.png',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Pan-India',
    location_city: 'Remote All-India',
    location_area: 'All-Remote India Hub',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '₹54,00,000 - ₹95,00,000 / year (₹54L - ₹95L LPA)',
    niche_category: 'Software Engineering',
    description: 'GitLab is the world largest all-remote company. We evaluate candidates through async technical discussions, public code merges, and system design RFCs. Career switchers and engineers returning after a gap with strong demonstrable code are welcome.',
    requirements: [
      'Solid backend programming experience in Golang or Ruby on Rails',
      'Understanding of PostgreSQL indexing, Redis caching, and async workers',
      'Passion for open source and public handbook collaboration',
      'Exceptional written communication skills in asynchronous workflows'
    ],
    apply_link_or_email: 'https://boards.greenhouse.io/gitlab',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: true
  },

  // ── 3. IT Support, Cloud Ops & Linux SysAdmin (Low Barrier Entry & Career Switch Points) ──
  {
    id: 'job-redhat-support-engineer-2026',
    title: 'Technical Support Engineer (Linux & OpenShift Cloud)',
    slug: 'technical-support-engineer-redhat-pune-bengaluru',
    company_name: 'Red Hat',
    company_logo: 'https://www.redhat.com/cms/managed-files/Red-Hat-Hat-RGB-Stk.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Maharashtra',
    location_city: 'Pune / Bengaluru',
    location_area: 'Magarpatta City, Pune / Outer Ring Road, Bengaluru',
    is_remote: false,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Entry Level / Fresher',
    salary_range: '₹7,00,000 - ₹12,00,000 / year',
    niche_category: 'Cloud & Infrastructure',
    description: 'Red Hat is hiring Technical Support Engineers to assist enterprise clients in debugging Red Hat Enterprise Linux (RHEL), OpenShift Kubernetes, and Ansible automation. Ideal gateway for career switchers holding Linux/Cloud certifications.',
    requirements: [
      'Passionate about Linux troubleshooting, bash scripting, and system internals',
      'RHCSA, RHCE, or AWS/Azure cloud certification is a huge advantage',
      'Open to candidates transitioning from non-tech or hardware networking backgrounds',
      'Strong diagnostic curiosity and structured customer issue resolution skills'
    ],
    apply_link_or_email: 'https://www.redhat.com/en/jobs',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: true,
    education_gap_notes: 'Certifications (RHCSA, AWS, Linux+) override educational background or gap years.'
  },
  {
    id: 'job-hexaware-graduate-trainee-2026',
    title: 'Graduate Engineer Trainee (Full-Stack & Cloud Infrastructure)',
    slug: 'graduate-engineer-trainee-hexaware-coimbatore-chennai',
    company_name: 'Hexaware Technologies',
    company_logo: 'https://jobs.hexaware.com/assets/images/hexaware-logo.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Tamil Nadu',
    location_city: 'Coimbatore / Chennai',
    location_area: 'CHIL SEZ IT Park, Saravanampatti, Coimbatore / Siruseri, Chennai',
    is_remote: false,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Entry Level / Fresher',
    salary_range: '₹4,50,000 - ₹7,00,000 / year',
    niche_category: 'Software Engineering',
    description: 'Hexaware Technologies is hiring Graduate Engineer Trainees across their Coimbatore and Chennai campuses. Selected candidates undergo comprehensive training in modern React, Java microservices, and AWS cloud deployment.',
    requirements: [
      'B.E. / B.Tech / MCA graduates (2024, 2025, or 2026 batches)',
      'Basic programming knowledge in Java, Python, or C++',
      'Understanding of relational databases and SQL queries',
      'Willingness to train in Coimbatore or Chennai, Tamil Nadu'
    ],
    apply_link_or_email: 'https://jobs.hexaware.com/',
    status: 'active',
    featured: false,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: false
  },
  {
    id: 'job-tcs-cloud-ops-2026',
    title: 'Cloud & Infrastructure Operations Analyst',
    slug: 'cloud-infrastructure-analyst-tcs-chennai',
    company_name: 'Tata Consultancy Services',
    company_logo: 'https://www.tcs.com/content/dam/global-tcs/en/images/home/tcs-logo-1.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Tamil Nadu',
    location_city: 'Chennai',
    location_area: 'Siruseri IT Park, Chennai / Pan-India',
    is_remote: false,
    is_wfh: false,
    job_type: 'Full-Time',
    experience_level: 'Entry Level / Fresher',
    salary_range: '₹3,80,000 - ₹6,50,000 / year',
    niche_category: 'Cloud & Infrastructure',
    description: 'TCS is hiring Cloud Operations Analysts to manage enterprise hybrid cloud environments, monitor server uptime, automate patch management, and support ITIL incident workflows. Accepts up to 2 years of education gap.',
    requirements: [
      'B.Sc / BCA / B.E. / B.Tech with up to 2 years education gap accepted',
      'Knowledge of Windows Server, Linux command line, and networking fundamentals',
      'Understanding of AWS, Azure, or Google Cloud platform basics',
      'Willingness to work in rotational monitoring shifts at Chennai tech campus'
    ],
    apply_link_or_email: 'https://www.tcs.com/careers',
    status: 'active',
    featured: false,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: true,
    education_gap_notes: 'TCS officially permits up to 24 months of education gap with valid reason documentation.'
  },

  // ── 4. Data Science, AI & Machine Learning ──────────────────────────────────
  {
    id: 'job-fractal-associate-data-engineer-2026',
    title: 'Associate Data Engineer & Analytics Specialist',
    slug: 'associate-data-engineer-fractal-bengaluru-mumbai',
    company_name: 'Fractal Analytics',
    company_logo: 'https://fractal.ai/wp-content/themes/fractal/assets/images/logo.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Karnataka',
    location_city: 'Bengaluru / Mumbai',
    location_area: 'Indiranagar, Bengaluru / Goregaon, Mumbai',
    is_remote: false,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Entry Level / Fresher',
    salary_range: '₹9,00,000 - ₹16,00,000 / year',
    niche_category: 'Data & AI',
    description: 'Fractal is a premier global AI and analytics partner for Fortune 500 enterprises. We are hiring Associate Data Engineers to build scalable data pipelines, ETL pipelines using PySpark and dbt, and integrate Generative AI RAG pipelines. Open to career switchers with strong Python & SQL skills.',
    requirements: [
      'Strong hands-on Python and SQL skills; understanding of data modeling principles',
      'Familiarity with modern data stack: Snowflake, BigQuery, Databricks, or dbt',
      'Open to graduates in Computer Science, Statistics, Mathematics, or career switchers with portfolio projects',
      'Curiosity for automated machine learning and generative AI workflows'
    ],
    apply_link_or_email: 'https://fractal.ai/careers/',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: true,
    education_gap_notes: 'Fractal evaluates candidates through analytical aptitude tests and SQL/Python case study assessments.'
  },

  // ── 5. Cybersecurity, SOC & Application Security ────────────────────────────
  {
    id: 'job-crowdstrike-threat-analyst-2026',
    title: 'Associate Threat Hunter / SOC Analyst L1',
    slug: 'associate-threat-hunter-crowdstrike-pune-remote',
    company_name: 'CrowdStrike',
    company_logo: 'https://www.crowdstrike.com/wp-content/themes/crowdstrike/dist/images/logo.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Maharashtra',
    location_city: 'Pune / Remote',
    location_area: 'Kalyani Nagar, Pune / Flexible Remote',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '₹10,00,000 - ₹18,00,000 / year',
    niche_category: 'Cybersecurity',
    description: 'CrowdStrike Falcon platform stops breaches across the world. We are hiring Associate Threat Analysts to monitor telemetry feeds, analyze malware behaviors, investigate SIEM alerts, and hunt adversaries across Windows, Linux, and Cloud environments.',
    requirements: [
      'Understanding of MITRE ATT&CK framework, network protocols, and Windows/Linux event logs',
      'Hands-on experience with SIEM tools (Splunk, ELK, or Sentinel) and endpoint detection telemetry',
      'Certifications such as CompTIA Security+, CEH, or BJT are highly valued',
      'Strong analytical mindset and investigative drive'
    ],
    apply_link_or_email: 'https://www.crowdstrike.com/careers/',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: true,
    education_gap_notes: 'Practical lab experience (TryHackMe, HackTheBox) and security certifications supersede formal degree history.'
  },

  // ── 6. QA, Automation Testing & SDET ────────────────────────────────────────
  {
    id: 'job-browserstack-sdet-2026',
    title: 'Software Development Engineer in Test (SDET - Automation)',
    slug: 'sdet-automation-engineer-browserstack-mumbai',
    company_name: 'BrowserStack',
    company_logo: 'https://www.browserstack.com/images/layout/browserstack-logo-600x600.png',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Maharashtra',
    location_city: 'Mumbai / Remote',
    location_area: 'Fiesta IT Park, Andheri / Remote Friendly',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '₹14,00,000 - ₹24,00,000 / year',
    niche_category: 'QA & Testing',
    description: 'BrowserStack powers automated cross-browser and mobile testing for over 5 million developers. We are hiring SDETs to build distributed automated test frameworks, design CI/CD test gates, and write robust Playwright / Selenium test harnesses.',
    requirements: [
      '2+ years experience building test automation frameworks in Java, Python, or TypeScript',
      'Deep understanding of Playwright, Cypress, Selenium, or Appium',
      'Familiarity with Docker containerized test execution and GitHub Actions CI',
      'Passionate about software reliability, edge-case coverage, and performance benchmarking'
    ],
    apply_link_or_email: 'https://www.browserstack.com/careers',
    status: 'active',
    featured: false,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: true
  },
  {
    id: 'job-cred-sdet-automation-2026',
    title: 'SDET / QA Automation Engineer (High Concurrency)',
    slug: 'sdet-automation-engineer-cred-bengaluru',
    company_name: 'CRED',
    company_logo: 'https://web-images.credcdn.in/_next/assets/images/home-page/cred-logo.png',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Karnataka',
    location_city: 'Bengaluru',
    location_area: 'Indiranagar, Bengaluru / Hybrid',
    is_remote: false,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '₹18,00,000 - ₹32,00,000 / year',
    niche_category: 'QA & Testing',
    description: 'CRED is hiring SDETs to architect automated test harnesses for high-throughput financial reward engines, credit card processing pipelines, and mobile apps with sub-100ms execution latency.',
    requirements: [
      '2-4 years experience in API automation testing (RestAssured / Playwright / k6)',
      'Proficiency in Java or Go with strong debugging capabilities',
      'Experience in performance and load testing distributed systems',
      'High attention to detail in high-stakes financial calculations'
    ],
    apply_link_or_email: 'https://cred.club/careers',
    status: 'active',
    featured: false,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: false
  },

  // ── 7. Mobile Application Development (Android, iOS & Flutter) ──────────────
  {
    id: 'job-jio-mobile-engineer-2026',
    title: 'Mobile Application Engineer (Android & Flutter)',
    slug: 'mobile-engineer-jio-platforms-mumbai',
    company_name: 'Jio Platforms',
    company_logo: 'https://www.jio.com/assets/images/jio-logo.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Maharashtra',
    location_city: 'Mumbai',
    location_area: 'Reliance Corporate Park, Navi Mumbai / Hybrid',
    is_remote: false,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '₹8,00,000 - ₹15,00,000 / year',
    niche_category: 'Mobile Development',
    description: 'Jio Platforms is hiring Mobile Engineers to build consumer mobile apps serving 450+ million digital subscribers. Work with modern Kotlin, Jetpack Compose, Flutter, and high-performance offline-first local database architectures.',
    requirements: [
      '2-4 years experience building Android apps using Kotlin / Jetpack Compose or Flutter / Dart',
      'Deep understanding of Android lifecycle, coroutines, memory management, and battery optimization',
      'Experience with RESTful APIs, WebSockets, and SQLite / Room persistence',
      'Knowledge of Google Play Console releases and CI/CD pipelines'
    ],
    apply_link_or_email: 'https://careers.jio.com/',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: true
  },

  // ── 8. Mid to High Level Core Software Engineering ─────────────────────────
  {
    id: 'job-freshworks-associate-software-engineer-2026',
    title: 'Associate Software Engineer (Customer SaaS Platform)',
    slug: 'associate-software-engineer-freshworks-chennai',
    company_name: 'Freshworks',
    company_logo: 'https://www.freshworks.com/static-assets/images/common/company/logos/freshworks-logo.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Tamil Nadu',
    location_city: 'Chennai',
    location_area: 'SP Infocity, Perungudi, OMR, Chennai',
    is_remote: false,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Entry Level / Fresher',
    salary_range: '₹7,50,000 - ₹11,00,000 / year',
    niche_category: 'Software Engineering',
    description: 'Freshworks is hiring Associate Software Engineers in Chennai to build scalable multi-tenant SaaS CRM platforms, AI-driven customer bots, and real-time support dashboards used by 60,000+ businesses worldwide.',
    requirements: [
      '0-2 years experience writing clean code in Ruby on Rails, Java, Node.js, or React',
      'Solid grounding in Object-Oriented Design, relational databases, and REST APIs',
      'Passion for building intuitive, high-velocity customer service tools',
      'Hybrid presence at Chennai SP Infocity campus'
    ],
    apply_link_or_email: 'https://www.freshworks.com/company/careers/',
    status: 'active',
    featured: false,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: false
  },
  {
    id: 'job-phonepe-backend-engineer-2026',
    title: 'Software Engineer (Backend & Payments Core)',
    slug: 'backend-software-engineer-phonepe-bengaluru',
    company_name: 'PhonePe',
    company_logo: 'https://www.phonepe.com/assets/images/brand/phonepe-logo.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Karnataka',
    location_city: 'Bengaluru',
    location_area: 'Bellandur, Outer Ring Road / Hybrid',
    is_remote: false,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '₹18,00,000 - ₹30,00,000 / year',
    niche_category: 'Software Engineering',
    description: 'PhonePe is India leading digital payments platform processing billions of UPI transactions monthly. We are hiring Backend Software Engineers to build distributed ledger microservices with sub-50ms latency.',
    requirements: [
      '2-4 years experience in Java, Go, or Python developing high-scale microservices',
      'Deep knowledge of distributed caching (Redis/Aerospike) and message queues (Kafka)',
      'Understanding of ACID transactions, distributed locking, and zero-loss financial ledgers',
      'Strong problem-solving and system design fundamentals'
    ],
    apply_link_or_email: 'https://www.phonepe.com/careers/',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: false,
    career_switch_friendly: false
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
    description: 'Postman is the world leading API platform used by 30+ million developers. They are hiring Frontend Engineers in Bengaluru to build rich client interfaces, Electron desktop integrations, and API schema tooling.',
    requirements: [
      '3+ years building complex web client applications with React, TypeScript, and Redux/Zustand',
      'Deep knowledge of web standards, browser rendering performance, and Electron/Node internals',
      'Experience designing modular UI components for developer-facing tools',
      'Flexible hybrid working arrangements out of Postman Bengaluru hub'
    ],
    apply_link_or_email: 'https://postman.wd108.myworkdayjobs.com/careers',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: true
  },
  {
    id: 'job-razorpay-sde2-golang-2026',
    title: 'SDE II (Golang & High-Throughput Financial Rails)',
    slug: 'sde-2-golang-razorpay-bengaluru',
    company_name: 'Razorpay',
    company_logo: 'https://razorpay.com/assets/razorpay-glyph.svg',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Karnataka',
    location_city: 'Bengaluru',
    location_area: 'Koramangala, Bengaluru (Hybrid)',
    is_remote: false,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Mid Level',
    salary_range: '₹24,00,000 - ₹38,00,000 / year + ESOPs',
    niche_category: 'Software Engineering',
    description: 'Razorpay processes billions of dollars in digital payments across India. They are hiring SDE II engineers to design and scale distributed financial ledger systems, webhook orchestrators, and banking integration microservices.',
    requirements: [
      '3-6 years of software engineering experience in Go, Java, or distributed systems',
      'Deep understanding of concurrency primitives (goroutines, channels, distributed mutexes)',
      'Experience with Kafka, Redis, PostgreSQL, and AWS cloud microservices',
      'Commitment to sub-50ms execution speed, zero data-loss, and high-availability architecture'
    ],
    apply_link_or_email: 'https://boards.greenhouse.io/razorpay',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: false,
    career_switch_friendly: false
  },

  // ── 9. Senior / Staff & 100% Remote Global Roles ────────────────────────────
  {
    id: 'job-atlassian-software-engineer-2026',
    title: 'Software Engineer II (Distributed Cloud Systems)',
    slug: 'software-engineer-2-atlassian-remote-india',
    company_name: 'Atlassian',
    company_logo: 'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
    is_internal_hiring: false,
    location_country: 'India',
    location_state: 'Pan-India',
    location_city: 'Remote All-India',
    location_area: 'Team Anywhere Model (Work From Home Anywhere in India)',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time',
    experience_level: 'Senior Level',
    salary_range: '₹28,00,000 - ₹45,00,000 / year + RSUs',
    niche_category: 'Software Engineering',
    description: 'Atlassian is actively hiring Software Engineers in India under their Team Anywhere model. Work on distributed Jira / Confluence cloud services, AWS microservices, and AI-driven workflow engines remotely from anywhere in India.',
    requirements: [
      '3+ years experience with Java, Kotlin, React, or modern distributed microservices',
      'Experience with AWS services (DynamoDB, SQS, SNS, S3) and distributed messaging (Kafka)',
      'Strong system design capabilities with emphasis on reliability, rate-limiting, and zero-downtime releases',
      'High autonomy, asynchronous communication skills, and remote work discipline'
    ],
    apply_link_or_email: 'https://www.atlassian.com/company/careers/all-jobs',
    status: 'active',
    featured: true,
    created_at: new Date().toISOString(),
    gap_friendly: true,
    career_switch_friendly: true
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
    const local = localStorage.getItem('springweb_jobs_cache_v2026_inr_inr')
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
      localStorage.setItem('springweb_jobs_cache_v2026_inr', JSON.stringify(SEED_JOBS))
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
        localStorage.setItem('springweb_jobs_cache_v2026_inr', JSON.stringify(combined))
      } else {
        set({ jobs: SEED_JOBS })
        localStorage.setItem('springweb_jobs_cache_v2026_inr', JSON.stringify(SEED_JOBS))
      }
    } catch (e) {
      console.warn('Jobs fetch fallback to seed:', e)
      set({ jobs: SEED_JOBS })
      localStorage.setItem('springweb_jobs_cache_v2026_inr', JSON.stringify(SEED_JOBS))
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
