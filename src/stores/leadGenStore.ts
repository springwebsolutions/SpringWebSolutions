import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface BusinessLead {
  id: string
  name: string
  owner_name?: string | null
  category?: string | null
  phone?: string | null
  normalized_phone?: string | null
  email?: string | null
  whatsapp?: string | null
  website?: string | null
  address?: string | null
  city?: string | null
  district?: string | null
  state?: string | null
  country?: string | null
  rating?: number
  reviews_count?: number
  lead_score: number
  priority: 'High' | 'Medium' | 'Low'
  source: string
  last_scan_date?: string | null
  dnc_flag: boolean
  duplicate_flag: boolean
  potential_duplicate_of?: string | null
  recommended_services: string[]
  estimated_value_band: string
  status: 'New' | 'Contacted' | 'Replied' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'
  created_at: string
  updated_at: string
}

export interface WebsiteAuditData {
  id: string
  business_id: string
  website_exists: boolean
  ssl_active: boolean
  mobile_friendly: boolean
  speed_score: number
  has_contact_form: boolean
  has_whatsapp_button: boolean
  has_meta_tags: boolean
  has_schema_markup: boolean
  broken_links_count: number
  ui_quality_score: number
  raw_audit_data?: any
  created_at: string
}

export interface DiscoveryJob {
  id: string
  keyword: string
  category?: string
  location?: string
  country?: string
  state?: string
  source: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  records_found: number
  error_message?: string
  created_at: string
}

export interface OutreachLog {
  id: string
  business_id: string
  channel: 'WhatsApp' | 'Email' | 'LinkedIn' | 'Phone'
  mode: 'Template' | 'AI Generated'
  language: 'Tamil' | 'English'
  template_name?: string
  message: string
  status: 'draft' | 'sent' | 'delivered' | 'failed' | 'replied' | 'opted_out'
  tokens_used: number
  estimated_cost_inr: number
  model_used?: string
  followup_date?: string
  created_at: string
}

export interface AIUsageLog {
  id: string
  feature: string
  model: string
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  estimated_cost_inr: number
  user_confirmed: boolean
  created_at: string
}

// Utility: Normalize Phone Number (strips spaces, dashes, country code +91)
export const normalizePhone = (phone?: string | null): string => {
  if (!phone) return ''
  let cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.startsWith('91') && cleaned.length > 10) {
    cleaned = cleaned.substring(2)
  }
  if (cleaned.startsWith('0') && cleaned.length > 10) {
    cleaned = cleaned.substring(1)
  }
  return cleaned
}

// Utility: Calculate Lead Score & Priority
export const calculateLeadScore = (audit?: Partial<WebsiteAuditData>, hasWebsite?: boolean) => {
  let score = 0
  const recommended: string[] = []

  if (hasWebsite === false || audit?.website_exists === false) {
    score += 40
    recommended.push('Website Development', 'High-Speed Responsive Site')
  } else {
    if (audit?.speed_score && audit.speed_score < 60) {
      score += 15
      recommended.push('Speed Optimization', 'Core Web Vitals Tuning')
    }
    if (audit?.mobile_friendly === false) {
      score += 20
      recommended.push('Website Redesign', 'Mobile-First Touch UI')
    }
    if (audit?.has_contact_form === false) {
      score += 10
      recommended.push('Lead Capture Automation', 'CRM Integration')
    }
    if (audit?.has_meta_tags === false || audit?.has_schema_markup === false) {
      score += 10
      recommended.push('SEO Dominance & AEO Schema', 'Technical SEO')
    }
  }

  if (audit?.has_whatsapp_button === false) {
    score += 15
    recommended.push('WhatsApp API Automation', 'Instant Bot Response')
  }

  const priority: 'High' | 'Medium' | 'Low' = score >= 50 ? 'High' : score >= 25 ? 'Medium' : 'Low'

  let valueBand = '₹20K - ₹50K'
  if (score >= 60) valueBand = '₹100K - ₹250K+'
  else if (score >= 35) valueBand = '₹50K - ₹100K'

  return { score, priority, recommended, valueBand }
}

// Utility: Determine Communication Language
export const determineLanguage = (state?: string | null): 'Tamil' | 'English' => {
  if (!state) return 'English'
  const normState = state.trim().toLowerCase()
  return normState.includes('tamil') || normState.includes('tn') ? 'Tamil' : 'English'
}

interface LeadGenState {
  businesses: BusinessLead[]
  audits: Record<string, WebsiteAuditData>
  jobs: DiscoveryJob[]
  outreachLogs: OutreachLog[]
  aiUsageLogs: AIUsageLog[]
  monthlyBudgetCapINR: number
  currentMonthAiSpendINR: number
  googleMapsQuotaUsed: number
  googleMapsQuotaLimit: number
  loading: boolean

  // Actions
  fetchData: () => Promise<void>
  addBusiness: (b: Partial<BusinessLead>) => Promise<BusinessLead | null>
  importCsvBusinesses: (records: Partial<BusinessLead>[]) => Promise<number>
  toggleDncFlag: (businessId: string, dncState: boolean) => Promise<void>
  updateBusinessStatus: (businessId: string, status: BusinessLead['status']) => Promise<void>
  createDiscoveryJob: (keyword: string, category: string, location: string, state: string) => Promise<void>
  runWebsiteAudit: (businessId: string, websiteUrl: string) => Promise<WebsiteAuditData | null>
  logOutreach: (log: Omit<OutreachLog, 'id' | 'created_at'>) => Promise<void>
  recordAiUsage: (usage: Omit<AIUsageLog, 'id' | 'created_at'>) => Promise<boolean>
  exportDatabaseBackup: (format: 'csv' | 'json') => void
}

export const DEFAULT_LEADS_SEED: BusinessLead[] = [
  {
    id: 'seed-lead-1',
    name: 'Kirthi Senthil Mahal',
    owner_name: 'Senthil Kumar',
    category: 'Event Venue & Convention Hall',
    phone: '+91 98948 05812',
    normalized_phone: '9894805812',
    email: 'kirthisenthilmahal@gmail.com',
    whatsapp: '9894805812',
    website: 'https://kirthisenthilmahal.com',
    address: '11A, Kasturi Street, near Kuttal Thidal',
    city: 'Udumalpet',
    district: 'Tiruppur',
    state: 'Tamil Nadu',
    country: 'India',
    rating: 4.8,
    reviews_count: 36,
    lead_score: 85,
    priority: 'High',
    source: 'Google Maps API Discovery',
    dnc_flag: false,
    duplicate_flag: false,
    recommended_services: ['High-Speed Web Platform', 'WhatsApp Booking Automations', 'Local SEO'],
    estimated_value_band: '₹100K - ₹250K+',
    status: 'New',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'seed-lead-2',
    name: 'Everest Group Enterprise',
    owner_name: 'Rajesh Sharma',
    category: 'Industrial Manufacturing & Exports',
    phone: '+91 94432 11092',
    normalized_phone: '9443211092',
    email: 'contact@everestgroup.in',
    whatsapp: '9443211092',
    website: null,
    address: 'Industrial Estate, Palani Road',
    city: 'Udumalpet',
    district: 'Tiruppur',
    state: 'Tamil Nadu',
    country: 'India',
    rating: 4.6,
    reviews_count: 18,
    lead_score: 75,
    priority: 'High',
    source: 'Business Directory Scan',
    dnc_flag: false,
    duplicate_flag: false,
    recommended_services: ['Custom ERP & CRM Suite', 'Website Development', 'API Automation'],
    estimated_value_band: '₹100K - ₹250K+',
    status: 'New',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'seed-lead-3',
    name: 'Kongu Textiles & Spun Mills',
    owner_name: 'P. Arumugam',
    category: 'Textile Manufacturing',
    phone: '+91 98421 88219',
    normalized_phone: '9842188219',
    email: 'info@kongutextiles.in',
    whatsapp: '9842188219',
    website: 'http://kongutextiles.demo',
    address: 'Pollachi Road, SV Puram',
    city: 'Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    country: 'India',
    rating: 4.4,
    reviews_count: 24,
    lead_score: 65,
    priority: 'High',
    source: 'Google Maps API',
    dnc_flag: false,
    duplicate_flag: false,
    recommended_services: ['Inventory Management Software', 'Speed Optimization', 'SEO'],
    estimated_value_band: '₹50K - ₹100K',
    status: 'New',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const useLeadGenStore = create<LeadGenState>((set, get) => ({
  businesses: DEFAULT_LEADS_SEED,
  audits: {},
  jobs: [],
  outreachLogs: [],
  aiUsageLogs: [],
  monthlyBudgetCapINR: 0, // ₹0 Free Tier Zero Cost Goal
  currentMonthAiSpendINR: 0,
  googleMapsQuotaUsed: 0,
  googleMapsQuotaLimit: 10000,
  loading: false,

  fetchData: async () => {
    if (!isSupabaseConfigured) {
      set({ businesses: DEFAULT_LEADS_SEED })
      return
    }
    set({ loading: true })
    try {
      const [bizRes, jobsRes, aiRes, outreachRes] = await Promise.all([
        supabase.from('businesses').select('*').order('created_at', { ascending: false }),
        supabase.from('discovery_jobs').select('*').order('created_at', { ascending: false }),
        supabase.from('ai_usage').select('*').order('created_at', { ascending: false }),
        supabase.from('outreach').select('*').order('created_at', { ascending: false })
      ])

      const fetchedBiz = (bizRes.data || []) as BusinessLead[]
      const businesses = fetchedBiz.length > 0 ? fetchedBiz : DEFAULT_LEADS_SEED
      const jobs = (jobsRes.data || []) as DiscoveryJob[]
      const aiUsageLogs = (aiRes.data || []) as AIUsageLog[]
      const outreachLogs = (outreachRes.data || []) as OutreachLog[]

      // Calculate current month AI spend
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const monthlySpend = aiUsageLogs
        .filter(log => log.created_at >= firstDay)
        .reduce((sum, log) => sum + (log.estimated_cost_inr || 0), 0)

      set({
        businesses,
        jobs,
        aiUsageLogs,
        outreachLogs,
        currentMonthAiSpendINR: Math.round(monthlySpend * 100) / 100
      })
    } catch (err) {
      console.error('[LeadGenStore Fetch Error]:', err)
    } finally {
      set({ loading: false })
    }
  },

  addBusiness: async (b) => {
    if (!isSupabaseConfigured) return null
    const normPhone = normalizePhone(b.phone)
    
    // Check local deduplication
    const existing = get().businesses.find(item => item.normalized_phone && item.normalized_phone === normPhone)
    const isDup = !!existing

    const { score, priority, recommended, valueBand } = calculateLeadScore(undefined, !!b.website)

    const payload = {
      name: b.name || 'Unnamed Business',
      owner_name: b.owner_name || null,
      category: b.category || 'General',
      phone: b.phone || null,
      normalized_phone: normPhone || null,
      email: b.email || null,
      whatsapp: b.whatsapp || b.phone || null,
      website: b.website || null,
      address: b.address || null,
      city: b.city || 'Udumalpet',
      district: b.district || 'Tiruppur',
      state: b.state || 'Tamil Nadu',
      country: b.country || 'India',
      rating: b.rating || 4.5,
      reviews_count: b.reviews_count || 12,
      lead_score: b.lead_score ?? score,
      priority: b.priority || priority,
      source: b.source || 'Manual Entry',
      dnc_flag: b.dnc_flag ?? false,
      duplicate_flag: isDup,
      potential_duplicate_of: existing ? existing.id : null,
      recommended_services: b.recommended_services || recommended,
      estimated_value_band: b.estimated_value_band || valueBand,
      status: b.status || 'New'
    }

    try {
      const { data, error } = await supabase.from('businesses').insert(payload).select('*').single()
      if (error) throw error
      await get().fetchData()
      return data as BusinessLead
    } catch (err) {
      console.error('[Add Business Error]:', err)
      return null
    }
  },

  importCsvBusinesses: async (records) => {
    if (!isSupabaseConfigured || records.length === 0) return 0
    let imported = 0
    for (const r of records) {
      const res = await get().addBusiness(r)
      if (res) imported++
    }
    return imported
  },

  toggleDncFlag: async (businessId, dncState) => {
    if (!isSupabaseConfigured) return
    try {
      await supabase.from('businesses').update({ dnc_flag: dncState }).eq('id', businessId)
      await get().fetchData()
    } catch (err) {
      console.error('[Toggle DNC Error]:', err)
    }
  },

  updateBusinessStatus: async (businessId, status) => {
    if (!isSupabaseConfigured) return
    try {
      await supabase.from('businesses').update({ status, updated_at: new Date().toISOString() }).eq('id', businessId)
      await get().fetchData()
    } catch (err) {
      console.error('[Update Status Error]:', err)
    }
  },

  createDiscoveryJob: async (keyword, category, location, state) => {
    if (!isSupabaseConfigured) return
    try {
      const payload = {
        keyword,
        category,
        location,
        state,
        source: 'Google Maps & Web Discovery API',
        status: 'processing',
        progress: 25,
        records_found: Math.floor(Math.random() * 8) + 4
      }
      const { data: job, error } = await supabase.from('discovery_jobs').insert(payload).select('*').single()
      if (error) throw error

      // Simulate worker picking up job and inserting discovered leads
      setTimeout(async () => {
        const sampleDiscovered = [
          { name: `${keyword} Hub ${location}`, phone: '+91 98421 88219', city: location, state, website: 'http://example.com' },
          { name: `Grand ${category} ${location}`, phone: '+91 94432 11092', city: location, state, website: null },
          { name: `${location} Digital Solutions`, phone: '+91 80126 22119', city: location, state, website: 'https://springwebsolutions.in' }
        ]
        for (const disc of sampleDiscovered) {
          await get().addBusiness({ ...disc, source: 'Google Maps API' })
        }
        await supabase.from('discovery_jobs').update({ status: 'completed', progress: 100, records_found: sampleDiscovered.length }).eq('id', job.id)
        await get().fetchData()
      }, 1500)

    } catch (err) {
      console.error('[Create Discovery Job Error]:', err)
    }
  },

  runWebsiteAudit: async (businessId, websiteUrl) => {
    if (!isSupabaseConfigured) return null
    try {
      const hasWebsite = !!websiteUrl && websiteUrl.length > 5
      const mockSpeed = hasWebsite ? Math.floor(Math.random() * 35) + 55 : 0
      const mockMobile = Math.random() > 0.3
      const mockForm = Math.random() > 0.4
      const mockWhatsapp = Math.random() > 0.6

      const auditPayload = {
        business_id: businessId,
        website_exists: hasWebsite,
        ssl_active: hasWebsite ? websiteUrl.startsWith('https') : false,
        mobile_friendly: mockMobile,
        speed_score: mockSpeed,
        has_contact_form: mockForm,
        has_whatsapp_button: mockWhatsapp,
        has_meta_tags: Math.random() > 0.3,
        has_schema_markup: Math.random() > 0.7,
        broken_links_count: hasWebsite ? Math.floor(Math.random() * 3) : 0,
        ui_quality_score: hasWebsite ? Math.floor(Math.random() * 30) + 60 : 0
      }

      const { data: audit, error } = await supabase.from('website_audit').insert(auditPayload).select('*').single()
      if (error) throw error

      const { score, priority, recommended, valueBand } = calculateLeadScore(audit, hasWebsite)
      await supabase.from('businesses').update({
        lead_score: score,
        priority,
        recommended_services: recommended,
        estimated_value_band: valueBand,
        last_scan_date: new Date().toISOString()
      }).eq('id', businessId)

      await get().fetchData()
      return audit as WebsiteAuditData
    } catch (err) {
      console.error('[Audit Error]:', err)
      return null
    }
  },

  logOutreach: async (log) => {
    if (!isSupabaseConfigured) return
    try {
      await supabase.from('outreach').insert(log)
      await get().fetchData()
    } catch (err) {
      console.error('[Log Outreach Error]:', err)
    }
  },

  recordAiUsage: async (usage) => {
    const currentSpend = get().currentMonthAiSpendINR
    const budgetCap = get().monthlyBudgetCapINR

    if (budgetCap > 0 && currentSpend + usage.estimated_cost_inr > budgetCap) {
      alert(`⚠️ Monthly AI Hard Budget Cap Exceeded (Limit: ₹${budgetCap}). Further AI calls are blocked until next month.`)
      return false
    }

    if (!isSupabaseConfigured) return true
    try {
      await supabase.from('ai_usage').insert(usage)
      await get().fetchData()
      return true
    } catch (err) {
      console.error('[Record AI Usage Error]:', err)
      return false
    }
  },

  exportDatabaseBackup: (format) => {
    const { businesses, outreachLogs, aiUsageLogs } = get()
    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        exported_at: new Date().toISOString(),
        businesses,
        outreachLogs,
        aiUsageLogs
      }, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute("href", dataStr)
      downloadAnchor.setAttribute("download", `springweb_lead_database_backup_${Date.now()}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
    } else {
      // CSV Format
      let csvContent = "data:text/csv;charset=utf-8," + "Name,Phone,Email,Website,City,State,Lead Score,Priority,Status,DNC Flag\n"
      businesses.forEach(b => {
        csvContent += `"${b.name}","${b.phone || ''}","${b.email || ''}","${b.website || ''}","${b.city || ''}","${b.state || ''}",${b.lead_score},"${b.priority}","${b.status}",${b.dnc_flag}\n`
      })
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `springweb_leads_export_${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  }
}))
