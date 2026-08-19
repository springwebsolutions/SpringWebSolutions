import React, { useEffect, useState } from 'react'
import { 
  useLeadGenStore, 
  normalizePhone, 
  determineLanguage, 
  type BusinessLead, 
  type WebsiteAuditData 
} from '@/stores/leadGenStore'
import { 
  Search, Plus, Filter, Download, Database, ShieldAlert, Cpu, Sparkles, 
  MessageSquare, Mail, Phone, Globe, CheckCircle2, AlertCircle, RefreshCw, 
  Layers, MapPin, DollarSign, Upload, FileText, ArrowRight, Check, X, Lock, Play, BarChart2,
  LayoutDashboard, Server, ExternalLink, Zap, Settings, Send, Star
} from 'lucide-react'

export const LeadGenSystem: React.FC = () => {
  const { 
    businesses, 
    jobs, 
    aiUsageLogs, 
    outreachLogs, 
    monthlyBudgetCapINR, 
    currentMonthAiSpendINR, 
    loading, 
    fetchData, 
    addBusiness, 
    importCsvBusinesses, 
    toggleDncFlag, 
    updateBusinessStatus, 
    createDiscoveryJob, 
    runWebsiteAudit, 
    logOutreach, 
    recordAiUsage, 
    exportDatabaseBackup 
  } = useLeadGenStore()

  // Clean, 4-Tab Navigation
  const [activeTab, setActiveTab] = useState<'finder' | 'database' | 'outreach' | 'settings'>('finder')

  // Search & Filter state for Database tab
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState<string>('All')
  const [selectedPriority, setSelectedPriority] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [onlyNoWebsite, setOnlyNoWebsite] = useState<boolean>(false)
  const [onlyPhone, setOnlyPhone] = useState<boolean>(false)

  // Live Lead Finder Form State
  const [jobKeyword, setJobKeyword] = useState('Clinics')
  const [jobCategory, setJobCategory] = useState('Healthcare & Clinics')
  const [jobLocation, setJobLocation] = useState('Udumalpet')
  const [jobState, setJobState] = useState('Tamil Nadu')
  const [jobScrapeOption, setJobScrapeOption] = useState<'all' | 'no_website' | 'only_phone' | 'both'>('all')
  const [jobSource, setJobSource] = useState<'openstreetmap' | 'google' | 'geoapify' | 'mapbox' | 'locationiq'>('openstreetmap')
  const [jobSubmitting, setJobSubmitting] = useState(false)
  const [jobFeedback, setJobFeedback] = useState<{ type: 'success' | 'error'; message: string; count?: number } | null>(null)
  
  // Custom API keys settings states
  const [googleMapsKey, setGoogleMapsKey] = useState(() => localStorage.getItem('google_maps_api_key') || '')
  const [geoapifyKey, setGeoapifyKey] = useState(() => localStorage.getItem('geoapify_api_key') || '')
  const [mapboxKey, setMapboxKey] = useState(() => localStorage.getItem('mapbox_api_key') || '')
  const [locationiqKey, setLocationiqKey] = useState(() => localStorage.getItem('locationiq_api_key') || '')

  // Selected Lead for Inspector Drawer / Audit / Outreach
  const [selectedLead, setSelectedLead] = useState<BusinessLead | null>(null)

  // Audit state
  const [auditing, setAuditing] = useState(false)
  const [currentAudit, setCurrentAudit] = useState<WebsiteAuditData | null>(null)

  // Outreach Studio State
  const [outreachChannel, setOutreachChannel] = useState<'WhatsApp' | 'Email'>('WhatsApp')
  const [outreachText, setOutreachText] = useState('')
  const [aiModel, setAiModel] = useState<'gpt-4o-mini' | 'claude-3-haiku' | 'gpt-4o'>('gpt-4o-mini')
  const [showAiModal, setShowAiModal] = useState(false)

  // Add Manual Lead Modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [newBizName, setNewBizName] = useState('')
  const [newBizPhone, setNewBizPhone] = useState('')
  const [newBizEmail, setNewBizEmail] = useState('')
  const [newBizWebsite, setNewBizWebsite] = useState('')
  const [newBizCity, setNewBizCity] = useState('Udumalpet')
  const [newBizState, setNewBizState] = useState('Tamil Nadu')
  const [newBizCategory, setNewBizCategory] = useState('Healthcare & Clinics')

  useEffect(() => {
    fetchData()
  }, [])

  // Auto set initial lead selection
  useEffect(() => {
    if (businesses.length > 0 && !selectedLead) {
      setSelectedLead(businesses[0])
    }
  }, [businesses])

  // Auto populate outreach template based on language
  useEffect(() => {
    if (!selectedLead) return
    const lang = determineLanguage(selectedLead.state)
    const services = (selectedLead.recommended_services || ['Website Development', 'Speed Optimization']).join(', ')

    if (lang === 'Tamil') {
      setOutreachText(
        `வணக்கம் ${selectedLead.name} குழுமத்திற்கு,\n\nநான் SpringWeb Solutions-லிருந்து தொடர்புகொள்கிறேன். உங்கள் வணிகத்திற்கு ${services} மூலம் வாடிக்கையாளர் வருகையை 3X அதிகரிக்க முடியும்.\n\nஇலவச ஆலோசனைக்கு அழைக்கவும்: +91 80126 22119\nhttps://springwebsolutions.in`
      )
    } else {
      setOutreachText(
        `Hello ${selectedLead.name} Team,\n\nGreetings from SpringWeb Solutions! We noticed an opportunity to enhance your digital presence with ${services}.\n\nLet's schedule a 10-minute free discovery call.\nWhatsApp: +91 80126 22119 | https://springwebsolutions.in`
      )
    }
  }, [selectedLead, outreachChannel])

  // Safe Date/Time Formatters
  const safeDateFormat = (dateStr?: string | null): string => {
    if (!dateStr) return 'Today'
    try {
      const d = new Date(dateStr)
      return isNaN(d.getTime()) ? 'Today' : d.toLocaleDateString()
    } catch {
      return 'Today'
    }
  }

  // Filtered Businesses
  const filteredBusinesses = (businesses || []).filter(b => {
    if (!b) return false
    const tokens = searchTerm.toLowerCase().split(/\s+/).filter(Boolean)
    const matchesSearch = tokens.length === 0 || tokens.every(token => 
      (b.name && typeof b.name === 'string' && b.name.toLowerCase().includes(token)) ||
      (b.phone && typeof b.phone === 'string' && b.phone.includes(token)) ||
      (b.city && typeof b.city === 'string' && b.city.toLowerCase().includes(token)) ||
      (b.category && typeof b.category === 'string' && b.category.toLowerCase().includes(token))
    )
    const matchesState = selectedState === 'All' || b.state === selectedState
    const matchesPriority = selectedPriority === 'All' || b.priority === selectedPriority
    const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus
    const matchesNoWebsite = !onlyNoWebsite || (!b.website || typeof b.website !== 'string' || b.website.trim() === '')
    const matchesOnlyPhone = !onlyPhone || (!!b.phone && typeof b.phone === 'string' && b.phone.trim().length > 6)
    return matchesSearch && matchesState && matchesPriority && matchesStatus && matchesNoWebsite && matchesOnlyPhone
  })

  // Start Discovery Job
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobKeyword || !jobLocation) return

    if (jobSource === 'google' && !googleMapsKey) {
      alert('Google Maps API Key is required. Please paste your API key in Settings & API Keys tab.')
      setActiveTab('settings')
      return
    }
    if (jobSource === 'geoapify' && !geoapifyKey) {
      alert('Geoapify API Key is required. Please paste your API key in Settings & API Keys tab.')
      setActiveTab('settings')
      return
    }

    setJobSubmitting(true)
    setJobFeedback(null)

    const result = await createDiscoveryJob(jobKeyword, jobCategory, jobLocation, jobState, jobScrapeOption, jobSource)
    setJobSubmitting(false)

    if (result.success) {
      setJobFeedback({
        type: 'success',
        message: `Discovered and saved ${result.found} verified business leads in ${jobLocation}!`,
        count: result.found
      })
    } else {
      setJobFeedback({
        type: 'error',
        message: result.message || 'Discovery search encountered an issue. Please try again.'
      })
    }
  }

  // Handle Run Audit
  const handleRunAudit = async () => {
    if (!selectedLead) return
    setAuditing(true)
    const auditRes = await runWebsiteAudit(selectedLead.id, selectedLead.website || '')
    setCurrentAudit(auditRes)
    setAuditing(false)
  }

  // Add Manual Business
  const handleAddManualLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBizName) return
    await addBusiness({
      name: newBizName,
      phone: newBizPhone || null,
      email: newBizEmail || null,
      website: newBizWebsite || null,
      city: newBizCity,
      state: newBizState,
      category: newBizCategory,
      source: 'Manual Entry'
    })
    setShowAddModal(false)
    setNewBizName('')
    setNewBizPhone('')
    setNewBizEmail('')
    setNewBizWebsite('')
  }

  // Send WhatsApp Direct Action
  const handleOpenWhatsApp = (lead: BusinessLead) => {
    const rawPhone = lead.phone || lead.whatsapp || ''
    const cleanNumber = normalizePhone(rawPhone)
    if (!cleanNumber) {
      alert('No valid telephone or WhatsApp number found for this lead.')
      return
    }
    const fullIntl = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber
    const textEncoded = encodeURIComponent(outreachText || `Hello from SpringWeb Solutions!`)
    window.open(`https://wa.me/${fullIntl}?text=${textEncoded}`, '_blank')
    logOutreach({
      business_id: lead.id,
      channel: 'WhatsApp',
      mode: 'Template',
      language: determineLanguage(lead.state),
      message: outreachText,
      status: 'sent',
      tokens_used: 0,
      estimated_cost_inr: 0
    })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* ── Top Header & Executive Stats Bar ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white font-display tracking-tight">Lead Engine &amp; Prospect CRM</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              v2.3 Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time business discovery, verified contact resolution, automated website auditing, and multi-channel outreach.
          </p>
        </div>

        {/* Executive Metrics Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-xs flex items-center gap-2">
            <span className="text-slate-400">Total Prospects:</span>
            <strong className="text-white font-mono">{businesses.length}</strong>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs flex items-center gap-2">
            <span className="text-emerald-400">High Priority:</span>
            <strong className="text-emerald-300 font-mono">{businesses.filter(b => b.priority === 'High').length}</strong>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-violet-950/40 border border-violet-500/20 text-xs flex items-center gap-2">
            <span className="text-violet-400">With Phone:</span>
            <strong className="text-violet-300 font-mono">{businesses.filter(b => !!b.phone).length}</strong>
          </div>
        </div>
      </div>

      {/* ── Streamlined 4-Tab Navigation Strip ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'finder', label: '🎯 Live Lead Finder', icon: Search },
            { id: 'database', label: `🏢 Prospect Database (${businesses.length})`, icon: Database },
            { id: 'outreach', label: '💬 AI Outreach Studio', icon: MessageSquare },
            { id: 'settings', label: '⚙️ Settings & API Keys', icon: Settings },
          ].map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/5'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus size={14} className="text-emerald-400" />
            <span>Add Single Lead</span>
          </button>

          <button
            onClick={() => exportDatabaseBackup('csv')}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════════
          TAB 1: LIVE LEAD FINDER & INSTANT SCRAPER
      ══════════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'finder' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Main Search Panel */}
          <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-2xl space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-base font-bold text-white font-display">Target Business Discovery</h2>
                <p className="text-xs text-slate-400">Search any industry or category in any city to discover verified local prospects.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <Zap size={14} />
                <span>Zero-Cost Live OSM + Direct Contact Enrichment</span>
              </div>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* Search Keyword */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Business Keyword</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clinics, Hospitals, Textiles"
                    value={jobKeyword}
                    onChange={e => setJobKeyword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target City / Town</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Udumalpet, Pollachi, Madurai"
                    value={jobLocation}
                    onChange={e => setJobLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={jobState}
                    onChange={e => setJobState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>

                {/* Source API */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Discovery Source</label>
                  <select
                    value={jobSource}
                    onChange={e => setJobSource(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:border-emerald-500 outline-none"
                  >
                    <option value="openstreetmap">OpenStreetMap (Zero Cost · Free)</option>
                    <option value="google">Google Maps Places API (Requires Key)</option>
                    <option value="geoapify">Geoapify Places (Requires Key)</option>
                    <option value="mapbox">Mapbox Search API (Requires Key)</option>
                    <option value="locationiq">LocationIQ API (Requires Key)</option>
                  </select>
                </div>
              </div>

              {/* Submit & Filter Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-xs text-slate-400">Scrape Filter:</span>
                  <select
                    value={jobScrapeOption}
                    onChange={e => setJobScrapeOption(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
                  >
                    <option value="all">All Discovered Leads</option>
                    <option value="only_phone">Only Leads with Phone Numbers</option>
                    <option value="no_website">Only Leads with No Website</option>
                    <option value="both">Phone Numbers &amp; No Website</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={jobSubmitting}
                  className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-60"
                >
                  {jobSubmitting ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} />
                      <span>Scanning Local Establishments...</span>
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Find Real Prospects</span>
                    </>
                  )}
                </button>
              </div>

              {/* Feedback Banner */}
              {jobFeedback && (
                <div className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 animate-fade-in ${
                  jobFeedback.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {jobFeedback.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> : <AlertCircle size={18} className="text-red-400 shrink-0" />}
                    <span>{jobFeedback.message}</span>
                  </div>
                  {jobFeedback.type === 'success' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('database')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 shrink-0 cursor-pointer"
                    >
                      View in Database &rarr;
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Quick Discovered Prospects Stream */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-display">Recent Discovered Prospects ({businesses.length})</h3>
              <button 
                onClick={() => setActiveTab('database')} 
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <span>Full Database</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businesses.slice(0, 6).map(lead => {
                const cleanPhone = normalizePhone(lead.phone)
                return (
                  <div 
                    key={lead.id} 
                    className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 hover:border-emerald-500/30 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white text-sm line-clamp-1">{lead.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          lead.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {lead.lead_score} pts
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-500 shrink-0" />
                        <span className="truncate">{lead.address || `${lead.city}, ${lead.state}`}</span>
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                        <Phone size={12} className="text-slate-500 shrink-0" />
                        <span className="font-mono text-slate-300">{lead.phone || 'No direct phone'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500">{lead.category || 'Business'}</span>
                      
                      <div className="flex items-center gap-1.5">
                        {cleanPhone && (
                          <button
                            onClick={() => handleOpenWhatsApp(lead)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <span>WhatsApp</span>
                          </button>
                        )}
                        <button
                          onClick={() => { setSelectedLead(lead); setActiveTab('database'); }}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-semibold transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Chrome Extension Scraper Helper Banner */}
          <div className="p-4 rounded-2xl border border-white/10 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                <Cpu size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Google Maps Live Scraper Chrome Extension</div>
                <div className="text-[11px] text-slate-400">Scrape live Google Maps search results directly from your browser with full ratings, phone numbers, and review counts.</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-bold shrink-0 transition-colors"
            >
              Extension Setup &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════════
          TAB 2: PROSPECT DATABASE & LEAD INSPECTOR
      ══════════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'database' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Main Prospects Table (Left / Middle 8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Filter Pills Bar */}
            <div className="p-4 rounded-2xl border border-white/10 bg-slate-900/40 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, city, category..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <select
                  value={selectedPriority}
                  onChange={e => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High Priority (50+ pts)</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Replied">Replied</option>
                  <option value="Won">Won</option>
                </select>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyPhone}
                    onChange={e => setOnlyPhone(e.target.checked)}
                    className="rounded border-white/20 text-emerald-500 focus:ring-0"
                  />
                  <span>Has Phone Number</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyNoWebsite}
                    onChange={e => setOnlyNoWebsite(e.target.checked)}
                    className="rounded border-white/20 text-emerald-500 focus:ring-0"
                  />
                  <span>No Website (Web Dev Target)</span>
                </label>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 text-slate-400 uppercase text-[10px] bg-white/5">
                    <tr>
                      <th className="p-3.5">Business Name &amp; Category</th>
                      <th className="p-3.5">Contact Phone</th>
                      <th className="p-3.5">Score</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBusinesses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">No matching business records found.</td>
                      </tr>
                    ) : (
                      filteredBusinesses.map(b => {
                        const isSelected = selectedLead?.id === b.id
                        const cleanPhone = normalizePhone(b.phone)
                        return (
                          <tr
                            key={b.id}
                            onClick={() => setSelectedLead(b)}
                            className={`hover:bg-white/5 transition-all cursor-pointer ${
                              isSelected ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : ''
                            }`}
                          >
                            <td className="p-3.5 font-semibold text-white">
                              <div className="truncate max-w-[220px]">{b.name}</div>
                              <div className="text-[11px] text-slate-400 font-normal truncate max-w-[220px]">
                                📍 {b.city}, {b.state} &bull; {b.category || 'General'}
                              </div>
                            </td>

                            <td className="p-3.5 font-mono text-slate-300">
                              <div>{b.phone || 'N/A'}</div>
                              {b.website ? (
                                <a 
                                  href={b.website.startsWith('http') ? b.website : `https://${b.website}`} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                  <span>Website</span>
                                  <ExternalLink size={10} />
                                </a>
                              ) : (
                                <span className="text-[10px] text-red-400">No Website</span>
                              )}
                            </td>

                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                b.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {b.lead_score} pts
                              </span>
                            </td>

                            <td className="p-3.5">
                              <select
                                value={b.status}
                                onChange={e => { e.stopPropagation(); updateBusinessStatus(b.id, e.target.value as any); }}
                                className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white text-[11px] outline-none"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Replied">Replied</option>
                                <option value="Won">Won</option>
                              </select>
                            </td>

                            <td className="p-3.5 text-right">
                              {cleanPhone && (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleOpenWhatsApp(b); }}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-[11px] transition-colors"
                                >
                                  WhatsApp
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Lead Detail & Inspector Panel (Right 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {selectedLead ? (
              <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md space-y-4 sticky top-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-bold text-white text-sm font-display truncate">{selectedLead.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {selectedLead.priority} Priority
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Phone:</span>
                    <strong className="text-white font-mono">{selectedLead.phone || 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-300">{selectedLead.address || `${selectedLead.city}, ${selectedLead.state}`}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Est. Project Band:</span>
                    <strong className="text-emerald-400">{selectedLead.estimated_value_band || '₹50K - ₹100K'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Source:</span>
                    <span className="text-slate-400">{selectedLead.source || 'OpenStreetMap API'}</span>
                  </div>
                </div>

                {/* Recommended Services */}
                <div>
                  <div className="text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Recommended Pitches</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedLead.recommended_services || ['Website Redesign', 'Speed Optimization']).map((srv, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 border border-white/10 text-slate-300">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => handleOpenWhatsApp(selectedLead)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    <span>Chat on WhatsApp</span>
                  </button>

                  <button
                    onClick={handleRunAudit}
                    disabled={auditing}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {auditing ? <RefreshCw className="animate-spin" size={13} /> : <Globe size={13} />}
                    <span>{auditing ? 'Auditing Website...' : 'Run Live Tech Audit'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-white/10 bg-slate-900/30 text-center text-slate-500 text-xs">
                Select a business from the table to inspect details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════════
          TAB 3: AI OUTREACH STUDIO
      ══════════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'outreach' && (
        <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md space-y-5 animate-fade-in max-w-4xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-white font-display">Personalized Outreach Generator</h2>
              <p className="text-xs text-slate-400">Generate high-converting Tamil or English WhatsApp / Email proposals tailored to each prospect.</p>
            </div>
            {selectedLead && (
              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                Target: {selectedLead.name}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOutreachChannel('WhatsApp')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  outreachChannel === 'WhatsApp' ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-400'
                }`}
              >
                WhatsApp Message
              </button>
              <button
                type="button"
                onClick={() => setOutreachChannel('Email')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  outreachChannel === 'Email' ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-slate-400'
                }`}
              >
                Email Pitch
              </button>
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-semibold mb-1">Message Body</label>
              <textarea
                rows={7}
                value={outreachText}
                onChange={e => setOutreachText(e.target.value)}
                className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono leading-relaxed outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">Direct 1-Click Dispatch ready for WhatsApp Web / Mobile.</span>

              {selectedLead && (
                <button
                  onClick={() => handleOpenWhatsApp(selectedLead)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Send size={14} />
                  <span>Send via WhatsApp</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════════
          TAB 4: SETTINGS & API KEYS
      ══════════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-4xl animate-fade-in">
          
          {/* API Keys Configuration */}
          <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md space-y-4">
            <div>
              <h2 className="text-base font-bold text-white font-display">External Provider API Keys</h2>
              <p className="text-xs text-slate-400">Optional: Connect paid map providers (Google Maps, Geoapify, Mapbox, LocationIQ). OpenStreetMap is completely free and requires zero keys.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Google Maps Places API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={googleMapsKey}
                  onChange={e => { setGoogleMapsKey(e.target.value); localStorage.setItem('google_maps_api_key', e.target.value); }}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Geoapify API Key (Free Tier Available)</label>
                <input
                  type="password"
                  placeholder="geo_..."
                  value={geoapifyKey}
                  onChange={e => { setGeoapifyKey(e.target.value); localStorage.setItem('geoapify_api_key', e.target.value); }}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Mapbox Public Access Token</label>
                <input
                  type="password"
                  placeholder="pk.ey..."
                  value={mapboxKey}
                  onChange={e => { setMapboxKey(e.target.value); localStorage.setItem('mapbox_api_key', e.target.value); }}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">LocationIQ Access Token</label>
                <input
                  type="password"
                  placeholder="pk.loc..."
                  value={locationiqKey}
                  onChange={e => { setLocationiqKey(e.target.value); localStorage.setItem('locationiq_api_key', e.target.value); }}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Database Backup & Export */}
          <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md space-y-4">
            <div>
              <h2 className="text-base font-bold text-white font-display">Database Backup &amp; Data Portability</h2>
              <p className="text-xs text-slate-400">Download full offline backups of all leads, outreach logs, and audit scores.</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => exportDatabaseBackup('csv')}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Export CSV Spreadsheet</span>
              </button>

              <button
                onClick={() => exportDatabaseBackup('json')}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Database size={14} />
                <span>Export Complete JSON Backup</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Single Lead Modal ─────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl border border-white/10 bg-slate-900 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-sm font-display">Add Single Prospect</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddManualLead} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={newBizName}
                  onChange={e => setNewBizName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newBizPhone}
                    onChange={e => setNewBizPhone(e.target.value)}
                    placeholder="+91 98422..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={newBizCity}
                    onChange={e => setNewBizCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Website URL</label>
                <input
                  type="text"
                  value={newBizWebsite}
                  onChange={e => setNewBizWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer pt-2"
              >
                Save Prospect
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
