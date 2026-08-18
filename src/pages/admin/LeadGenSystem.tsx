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
  LayoutDashboard, Server
} from 'lucide-react'

export const LeadGenSystem: React.FC = () => {
  const { 
    businesses, 
    jobs, 
    aiUsageLogs, 
    outreachLogs, 
    monthlyBudgetCapINR, 
    currentMonthAiSpendINR, 
    googleMapsQuotaUsed, 
    googleMapsQuotaLimit, 
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

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'extension' | 'finder' | 'database' | 'audit' | 'outreach' | 'backup'>('overview')

  // Search & Filter state for Database tab
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState<string>('All')
  const [selectedPriority, setSelectedPriority] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [onlyDuplicates, setOnlyDuplicates] = useState<boolean>(false)
  const [onlyNoWebsite, setOnlyNoWebsite] = useState<boolean>(false)
  const [onlyPhone, setOnlyPhone] = useState<boolean>(false)

  // New Discovery Job Form
  const [jobKeyword, setJobKeyword] = useState('')
  const [jobCategory, setJobCategory] = useState('Web Development & IT')
  const [jobLocation, setJobLocation] = useState('Udumalpet')
  const [jobState, setJobState] = useState('Tamil Nadu')
  const [jobScrapeOption, setJobScrapeOption] = useState<'all' | 'no_website' | 'only_phone' | 'both'>('all')
  const [jobSource, setJobSource] = useState<'simulated' | 'openstreetmap' | 'mapbox' | 'geoapify' | 'locationiq'>('simulated')
  const [jobSubmitting, setJobSubmitting] = useState(false)
  
  // Custom API keys settings drawer states
  const [mapboxKey, setMapboxKey] = useState(() => localStorage.getItem('mapbox_api_key') || '')
  const [geoapifyKey, setGeoapifyKey] = useState(() => localStorage.getItem('geoapify_api_key') || '')
  const [locationiqKey, setLocationiqKey] = useState(() => localStorage.getItem('locationiq_api_key') || '')
  const [showKeysDrawer, setShowKeysDrawer] = useState(false)

  // Selected Lead for Audit / Outreach
  const [selectedLead, setSelectedLead] = useState<BusinessLead | null>(null)

  // Audit state
  const [auditing, setAuditing] = useState(false)
  const [currentAudit, setCurrentAudit] = useState<WebsiteAuditData | null>(null)

  // Outreach Studio State
  const [outreachChannel, setOutreachChannel] = useState<'WhatsApp' | 'Email' | 'LinkedIn'>('WhatsApp')
  const [outreachMode, setOutreachMode] = useState<'Template' | 'AI Generated'>('Template')
  const [templateName, setTemplateName] = useState('Service Proposal (Tamil)')
  const [outreachText, setOutreachText] = useState('')
  const [aiModel, setAiModel] = useState<'gpt-4o-mini' | 'claude-3-haiku' | 'gpt-4o'>('gpt-4o-mini')

  // AI Confirmation Modal
  const [showAiModal, setShowAiModal] = useState(false)
  const [estimatedTokens, setEstimatedTokens] = useState({ prompt: 180, completion: 220, costINR: 0 })

  // Add Manual Lead Modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [newBizName, setNewBizName] = useState('')
  const [newBizPhone, setNewBizPhone] = useState('')
  const [newBizEmail, setNewBizEmail] = useState('')
  const [newBizWebsite, setNewBizWebsite] = useState('')
  const [newBizCity, setNewBizCity] = useState('Udumalpet')
  const [newBizState, setNewBizState] = useState('Tamil Nadu')
  const [newBizCategory, setNewBizCategory] = useState('Software Services')

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
    const services = (selectedLead.recommended_services || ['Website Development']).join(', ')

    if (lang === 'Tamil') {
      setOutreachText(
        `வணக்கம் ${selectedLead.name} குழுமத்திற்கு,\n\nநான் SpringWeb Solutions-லிருந்து தொடர்புகொள்கிறேன். உங்கள் வணிகத்திற்கு ${services} மூலம் வாடிக்கையாளர் வருகையை 3X அதிகரிக்க முடியும்.\n\nஇலவச ஆலோசனைக்கு அழைக்கவும்: +91 80126 22119\nspringwebsolutions.in`
      )
    } else {
      setOutreachText(
        `Hello ${selectedLead.name} Team,\n\nGreetings from SpringWeb Solutions! We noticed an opportunity to enhance your digital presence with ${services}.\n\nLet's schedule a 10-minute free discovery call.\nWhatsApp: +91 80126 22119 | springwebsolutions.in`
      )
    }
  }, [selectedLead, outreachChannel])

  // Filtered Businesses
  const filteredBusinesses = businesses.filter(b => {
    // Multi-token fuzzy search matching
    const tokens = searchTerm.toLowerCase().split(/\s+/).filter(Boolean)
    const matchesSearch = tokens.length === 0 || tokens.every(token => 
      b.name.toLowerCase().includes(token) ||
      (b.phone && b.phone.includes(token)) ||
      (b.city && b.city.toLowerCase().includes(token)) ||
      (b.category && b.category.toLowerCase().includes(token)) ||
      (b.state && b.state.toLowerCase().includes(token)) ||
      (b.status && b.status.toLowerCase().includes(token))
    )
    const matchesState = selectedState === 'All' || b.state === selectedState
    const matchesPriority = selectedPriority === 'All' || b.priority === selectedPriority
    const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus
    const matchesDup = !onlyDuplicates || b.duplicate_flag
    const matchesNoWebsite = !onlyNoWebsite || (!b.website || b.website.trim() === '')
    const matchesOnlyPhone = !onlyPhone || (!!b.phone && b.phone.trim().length > 6)
    return matchesSearch && matchesState && matchesPriority && matchesStatus && matchesDup && matchesNoWebsite && matchesOnlyPhone
  })

  // Start Discovery Job
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobKeyword || !jobLocation) return

    // API Keys Validation
    if (jobSource === 'mapbox' && !mapboxKey) {
      alert('Mapbox Access Token is required to query the Mapbox Search Box API. Please paste your token inside the API Keys drawer below.')
      return
    }
    if (jobSource === 'geoapify' && !geoapifyKey) {
      alert('Geoapify API Key is required to query the Geoapify Places API. Please paste your key inside the API Keys drawer below.')
      return
    }
    if (jobSource === 'locationiq' && !locationiqKey) {
      alert('LocationIQ Access Token is required to query the LocationIQ Search API. Please paste your token inside the API Keys drawer below.')
      return
    }

    setJobSubmitting(true)
    await createDiscoveryJob(jobKeyword, jobCategory, jobLocation, jobState, jobScrapeOption, jobSource)
    setJobSubmitting(false)
  }

  // Handle Run Audit
  const handleRunAudit = async () => {
    if (!selectedLead) return
    setAuditing(true)
    const auditRes = await runWebsiteAudit(selectedLead.id, selectedLead.website || '')
    setCurrentAudit(auditRes)
    setAuditing(false)
  }

  // Trigger AI Draft Generation Modal
  const handleRequestAiDraft = () => {
    if (!selectedLead) return
    if (selectedLead.dnc_flag) {
      alert('⛔ This lead has Do Not Contact (DNC) flag enabled. AI outreach generation is blocked.')
      return
    }
    setShowAiModal(true)
  }

  // Confirm AI Generation Call
  const handleConfirmAiGenerate = async () => {
    setShowAiModal(false)
    if (!selectedLead) return

    const success = await recordAiUsage({
      feature: 'Outreach Draft Generation',
      model: aiModel,
      prompt_tokens: estimatedTokens.prompt,
      completion_tokens: estimatedTokens.completion,
      total_tokens: estimatedTokens.prompt + estimatedTokens.completion,
      estimated_cost_inr: estimatedTokens.costINR,
      user_confirmed: true
    })

    if (success) {
      const lang = determineLanguage(selectedLead.state)
      if (lang === 'Tamil') {
        setOutreachText(
          `வணக்கம் ${selectedLead.name},\n\nஉங்கள் வணிகத் தேவைகளுக்காக SpringWeb AI பிரத்யேக தீர்வு தயாரித்துள்ளது: ${selectedLead.recommended_services?.join(' & ')}.\n\nமேலும் அறிய WhatsApp செய்யவும்: +91 80126 22119`
        )
      } else {
        setOutreachText(
          `Dear ${selectedLead.name} Leadership,\n\nOur engineering team analyzed your platform and crafted a high-converting solution around ${selectedLead.recommended_services?.join(', ')}. Estimated Project Band: ${selectedLead.estimated_value_band}.\n\nReply to view a live mockup demo.\nSpringWeb Solutions | +91 80126 22119`
        )
      }
      setOutreachMode('AI Generated')
    }
  }

  // Send Outreach
  const handleSendOutreach = async () => {
    if (!selectedLead) return
    if (selectedLead.dnc_flag) {
      alert('⛔ DNC Flag active for this lead. Cannot send outreach.')
      return
    }

    await logOutreach({
      business_id: selectedLead.id,
      channel: outreachChannel,
      mode: outreachMode,
      language: determineLanguage(selectedLead.state),
      template_name: templateName,
      message: outreachText,
      status: 'sent',
      tokens_used: outreachMode === 'AI Generated' ? 400 : 0,
      estimated_cost_inr: outreachMode === 'AI Generated' ? estimatedTokens.costINR : 0,
      model_used: outreachMode === 'AI Generated' ? aiModel : undefined
    })

    await updateBusinessStatus(selectedLead.id, 'Contacted')
    alert(`✅ Outreach logged & dispatched via ${outreachChannel} to ${selectedLead.name}`)
  }

  // Handle Manual Add Lead
  const handleAddManualLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBizName) return
    await addBusiness({
      name: newBizName,
      phone: newBizPhone,
      email: newBizEmail,
      website: newBizWebsite,
      city: newBizCity,
      state: newBizState,
      category: newBizCategory,
      source: 'Manual Entry'
    })
    setNewBizName('')
    setNewBizPhone('')
    setNewBizEmail('')
    setNewBizWebsite('')
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100 font-sans">
      
      {/* Sleek Metrics Ticker Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Prospects Stored */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/60 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-emerald-500/[0.06]"></div>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Prospects Stored</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Database size={16} />
            </div>
          </div>
          <div className="mt-4 text-3xl font-black tracking-tight text-white font-display">
            {businesses.length}
          </div>
          <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {businesses.filter(b => b.priority === 'High').length} High Priority Opportunities
          </div>
        </div>

        {/* Card 2: Google Maps API Quota */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/60 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.03] rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-indigo-500/[0.06]"></div>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Maps API Quota</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <MapPin size={16} />
            </div>
          </div>
          <div className="mt-4 text-3xl font-black tracking-tight text-white font-display">
            {googleMapsQuotaUsed} <span className="text-slate-500 text-lg font-medium">/ {googleMapsQuotaLimit}</span>
          </div>
          <div className="mt-2 text-xs font-mono text-slate-400">
            Remaining: <strong className="text-indigo-300">{googleMapsQuotaLimit - googleMapsQuotaUsed}</strong> API requests
          </div>
        </div>

        {/* Card 3: Monthly AI Spend */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/60 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.03] rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-cyan-500/[0.06]"></div>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Monthly AI Spend</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-4 text-3xl font-black tracking-tight text-white font-display">
            ₹{(currentMonthAiSpendINR || 0).toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Budget Cap: <strong className="text-slate-300">₹{monthlyBudgetCapINR || 500}</strong> ({( (currentMonthAiSpendINR || 0) / (monthlyBudgetCapINR || 500) * 100 ).toFixed(1)}% limit)
          </div>
        </div>

        {/* Card 4: Outreach Conversion Rate */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/60 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/[0.03] rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-violet-500/[0.06]"></div>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Conversion Rate</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-4 text-3xl font-black tracking-tight text-white font-display">
            {businesses.length > 0 ? Math.round((businesses.filter(b => b.status === 'Won').length / businesses.length) * 100) : 0}%
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span className="font-semibold text-violet-400">{businesses.filter(b => b.status === 'Won').length} converted client{businesses.filter(b => b.status === 'Won').length !== 1 ? 's' : ''}</span> total
          </div>
        </div>
      </div>

      {/* Streamlined Tab Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
            { id: 'finder', label: 'Maps Lead Finder', icon: Search },
            { id: 'extension', label: 'Chrome Scraper Sync', icon: Cpu },
            { id: 'database', label: `Prospect Database (${businesses.length})`, icon: Database },
            { id: 'outreach', label: 'Outreach & AI Studio', icon: MessageSquare },
            { id: 'backup', label: 'Backup & Logs', icon: Server }
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-md'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] text-slate-400 border border-transparent'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Prospect</span>
          </button>

          <button
            onClick={() => exportDatabaseBackup('csv')}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* TAB: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          {/* Left Column: Pipeline & Logs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pipeline Funnel */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/40 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base font-display">Prospect Pipeline Funnel</h3>
                <span className="text-xs text-slate-400 font-mono">Conversion Funnel</span>
              </div>

              <div className="space-y-4">
                {[
                  { status: 'New', label: 'Discovered (New)', color: 'bg-indigo-500', text: 'text-indigo-400' },
                  { status: 'Contacted', label: 'Contacted (Outreach sent)', color: 'bg-blue-500', text: 'text-blue-400' },
                  { status: 'Replied', label: 'Replied (Leads engaged)', color: 'bg-amber-500', text: 'text-amber-400' },
                  { status: 'Meeting Scheduled', label: 'Meetings Scheduled', color: 'bg-orange-500', text: 'text-orange-400' },
                  { status: 'Proposal Sent', label: 'Proposals Submitted', color: 'bg-pink-500', text: 'text-pink-400' },
                  { status: 'Won', label: 'Won (Closed Contracts)', color: 'bg-emerald-500', text: 'text-emerald-400' },
                ].map(step => {
                  const count = businesses.filter(b => b.status === step.status).length
                  const pct = businesses.length > 0 ? Math.round((count / businesses.length) * 100) : 0
                  return (
                    <div key={step.status} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-300">{step.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${step.text}`}>{count} leads</span>
                          <span className="text-slate-500 font-normal">({pct}%)</span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${step.color} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/40 space-y-4">
              <h3 className="font-bold text-white text-base font-display">Recent Outreach Logs</h3>
              <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto pr-1">
                {outreachLogs.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">No outreach attempts recorded yet.</div>
                ) : (
                  outreachLogs.slice(0, 5).map(log => {
                    const biz = businesses.find(b => b.id === log.business_id)
                    return (
                      <div key={log.id} className="py-3 flex items-start justify-between text-xs">
                        <div className="space-y-1">
                          <div className="font-bold text-white">{biz?.name || 'Unknown Client'}</div>
                          <div className="text-slate-400 text-[11px] truncate max-w-sm">{log.message}</div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                            {log.channel}
                          </span>
                          <div className="text-[10px] text-slate-500 mt-1">{new Date(log.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Workflow Steps & Status */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/40 space-y-4">
              <h3 className="font-bold text-white text-base font-display">Interactive Workflow</h3>
              <div className="space-y-3">
                <div
                  onClick={() => setActiveTab('extension')}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer flex items-start gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                    <Cpu size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">1. Setup Chrome Scraper</div>
                    <p className="text-[10.5px] text-slate-400 mt-0.5">Download and install the unpack scraper extension to grab live maps data.</p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('finder')}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer flex items-start gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
                    <Search size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">2. Query OpenStreetMap</div>
                    <p className="text-[10.5px] text-slate-400 mt-0.5">Run zero-cost geocoded keywords discovery jobs globally.</p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('database')}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer flex items-start gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                    <Database size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">3. Verify Lead Quality</div>
                    <p className="text-[10.5px] text-slate-400 mt-0.5">Run real-time site audits and review duplicates in the list.</p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('outreach')}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer flex items-start gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 group-hover:scale-105 transition-transform shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">4. Deploy AI Outreach</div>
                    <p className="text-[10.5px] text-slate-400 mt-0.5">Write multilingual pitches and record analytics.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/40 space-y-4">
              <h3 className="font-bold text-white text-base font-display">Discovery Analytics</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-slate-400 text-[10px]">Active Jobs</div>
                  <div className="text-lg font-bold text-white mt-1">{jobs.filter(j => j.status === 'processing').length} active</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-slate-400 text-[10px]">OSM Successes</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">{jobs.filter(j => j.source === 'OpenStreetMap API').length} runs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: MAPS LEAD FINDER */}
      {activeTab === 'finder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Left Column: Job Creator Form */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base font-display">Create Discovery Search Job</h3>
              <p className="text-xs text-slate-400">Discovers business listings via Search API and Google Maps API quota engine.</p>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Search Keyword / Business Type</label>
                <input
                  type="text"
                  value={jobKeyword}
                  onChange={e => setJobKeyword(e.target.value)}
                  placeholder="e.g. Textile Manufacturers, Hospitals, Colleges"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Category</label>
                <select
                  value={jobCategory}
                  onChange={e => setJobCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-emerald-500 outline-none"
                >
                  <option className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Web Development &amp; IT Services</option>
                  <option className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Custom ERP &amp; Billing Systems</option>
                  <option className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Mobile App Prospects</option>
                  <option className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Industrial Manufacturers</option>
                  <option className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Healthcare &amp; Hospitals</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Scrape Filter Mode</label>
                <select
                  value={jobScrapeOption}
                  onChange={e => setJobScrapeOption(e.target.value as 'all' | 'no_website' | 'only_phone' | 'both')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-emerald-500 outline-none"
                >
                  <option value="all" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Scrape All Discovered Leads</option>
                  <option value="no_website" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Only Leads with No Website</option>
                  <option value="only_phone" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Only Leads with Phone Numbers</option>
                  <option value="both" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Only Phone Numbers &amp; No Website</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Discovery Source API</label>
                <select
                  value={jobSource}
                  onChange={e => setJobSource(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-emerald-500 outline-none"
                >
                  <option value="simulated" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Mock Maps API (Simulated)</option>
                  <option value="openstreetmap" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">OpenStreetMap (Live Free POIs)</option>
                  <option value="mapbox" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Mapbox Search Box API (requires token)</option>
                  <option value="geoapify" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Geoapify Places API (requires key)</option>
                  <option value="locationiq" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">LocationIQ Search API (requires key)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">City / District</label>
                  <input
                    type="text"
                    value={jobLocation}
                    onChange={e => setJobLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">State</label>
                  <input
                    type="text"
                    value={jobState}
                    onChange={e => setJobState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none"
                  />
                </div>
              </div>

              {/* API Keys Configurations Accordion */}
              <div className="border-t border-slate-200 dark:border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setShowKeysDrawer(!showKeysDrawer)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  <span>🔑 API Keys Configurations</span>
                  <span className="text-[10px]">{showKeysDrawer ? '▲ Hide' : '▼ Show'}</span>
                </button>

                {showKeysDrawer && (
                  <div className="mt-3 space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 animate-fade-in">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Mapbox Access Token</label>
                      <input
                        type="password"
                        value={mapboxKey}
                        onChange={e => { setMapboxKey(e.target.value); localStorage.setItem('mapbox_api_key', e.target.value); }}
                        placeholder="pk.ey..."
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Geoapify API Key</label>
                      <input
                        type="password"
                        value={geoapifyKey}
                        onChange={e => { setGeoapifyKey(e.target.value); localStorage.setItem('geoapify_api_key', e.target.value); }}
                        placeholder="geo_..."
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">LocationIQ Token</label>
                      <input
                        type="password"
                        value={locationiqKey}
                        onChange={e => { setLocationiqKey(e.target.value); localStorage.setItem('locationiq_api_key', e.target.value); }}
                        placeholder="pk.loc..."
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={jobSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {jobSubmitting ? <RefreshCw className="animate-spin" size={16} /> : <Search size={16} />}
                <span>Launch Worker Discovery Job</span>
              </button>
            </form>
          </div>

          {/* Right Column: Worker Discovery Queue Table */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
            <h3 className="font-bold text-white text-base font-display">Worker Discovery Jobs Queue</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="pb-3">Keyword &amp; Target</th>
                    <th className="pb-3">Source API</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Found</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">No active discovery jobs in queue.</td>
                    </tr>
                  ) : (
                    jobs.map(j => (
                      <tr key={j.id} className="hover:bg-white/5">
                        <td className="py-3 font-semibold text-white">{j.keyword} ({j.location})</td>
                        <td className="py-3 text-slate-400">{j.source}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            j.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {j.status}
                          </span>
                        </td>
                        <td className="py-3 text-emerald-400 font-bold">+{j.records_found} leads</td>
                        <td className="py-3 text-slate-500 text-[11px]">{new Date(j.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CHROME EXTENSION SCRAPER & REAL-TIME SYNC */}
      {activeTab === 'extension' && (
        <div className="space-y-8 animate-fade-in">
          {/* Extension Header Banner */}
          <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-black space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
                  <CheckCircle2 size={14} />
                  <span>Real-Time Google Maps Scraper Ready</span>
                </div>
                <h2 className="text-2xl font-bold text-white font-display uppercase tracking-tight">
                  SpringWeb Instant Lead Scraper Extension (v1.1)
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                  Scrape business leads directly from any Google Maps search results in real time. Automatically normalizes phone numbers, calculates lead scores, and syncs clean leads live into this Admin Panel.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="/chrome-extension/manifest.json"
                  target="_blank"
                  download="manifest.json"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Download size={16} />
                  <span>Extension Location: /chrome-extension</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase">Real-Time Webhook Endpoint</div>
                <div className="text-xs font-mono text-emerald-400 truncate">https://www.springwebsolutions.in/api/lead-sync</div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase">Target Search Engine</div>
                <div className="text-xs font-semibold text-white">Google Maps &amp; Local Pack Search</div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase">Phone Deduplication Engine</div>
                <div className="text-xs font-semibold text-emerald-400">normalized_phone (10-Digit Primary Key)</div>
              </div>
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6">
              <h3 className="font-bold text-white text-lg font-display">1-Minute Chrome Extension Installation Guide</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="h-7 w-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">1</div>
                  <div>
                    <div className="text-xs font-bold text-white">Open Chrome Extensions Manager</div>
                    <div className="text-xs text-slate-400 mt-0.5">Open Google Chrome and navigate to <code className="text-emerald-400 bg-white/5 px-1 py-0.5 rounded">chrome://extensions</code> in your address bar.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="h-7 w-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">2</div>
                  <div>
                    <div className="text-xs font-bold text-white">Enable Developer Mode</div>
                    <div className="text-xs text-slate-400 mt-0.5">Toggle the <strong className="text-white">Developer mode</strong> switch in the top-right corner of the Chrome page.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="h-7 w-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">3</div>
                  <div>
                    <div className="text-xs font-bold text-white">Load Unpacked Extension Folder</div>
                    <div className="text-xs text-slate-400 mt-0.5">Click <strong className="text-white">Load unpacked</strong> button and select the workspace folder: <code className="text-emerald-400 bg-white/5 px-1 py-0.5 rounded">.../SpringWeb Solutions/chrome-extension</code></div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">4</div>
                  <div>
                    <div className="text-xs font-bold text-white">Scrape &amp; Sync in Real Time!</div>
                    <div className="text-xs text-slate-400 mt-0.5">Open any Google Maps search (e.g. <em>Hotels in Udumalpet</em>) and click the extension icon to scrape and sync!</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scraped Live Leads Stream */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base font-display">Live Synced Leads Stream</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {businesses.filter(b => b.source.includes('Extension')).length} Extension Leads
                </span>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {businesses.filter(b => b.source.includes('Extension')).length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <Cpu size={32} className="mx-auto text-slate-600 animate-pulse" />
                    <div className="text-xs font-semibold text-slate-300">Waiting for live extension sync...</div>
                    <div className="text-[11px] text-slate-500 max-w-xs mx-auto">Use the Chrome extension on google.com/maps to instantly stream clean leads into this console.</div>
                  </div>
                ) : (
                  businesses.filter(b => b.source.includes('Extension')).map(lead => (
                    <div key={lead.id} className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{lead.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">📍 {lead.city}, {lead.state} &bull; 📞 {lead.phone || 'No Phone'}</div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {lead.lead_score} pts
                        </span>
                        <div className="text-[9px] text-slate-500 mt-1">{new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEAD DATABASE & DEDUPLICATION */}
      {activeTab === 'database' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filter Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Filter by business name, phone, city..."
                className="w-full bg-transparent text-slate-900 dark:text-white text-xs outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none"
              >
                <option value="All" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">All States</option>
                <option value="Tamil Nadu" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Tamil Nadu (Tamil)</option>
                <option value="Karnataka" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Karnataka</option>
                <option value="Kerala" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Kerala</option>
                <option value="Maharashtra" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Maharashtra</option>
              </select>

              <select
                value={selectedPriority}
                onChange={e => setSelectedPriority(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none"
              >
                <option value="All" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">All Priorities</option>
                <option value="High" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">High Priority (Score &gt; 50)</option>
                <option value="Medium" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Medium Priority</option>
                <option value="Low" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Low Priority</option>
              </select>

              <label className="flex items-center gap-2 text-xs text-amber-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyDuplicates}
                  onChange={e => setOnlyDuplicates(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                <span>Show Potential Duplicates</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-blue-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyNoWebsite}
                  onChange={e => setOnlyNoWebsite(e.target.checked)}
                  className="rounded accent-blue-500"
                />
                <span>No Website Only</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-emerald-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyPhone}
                  onChange={e => setOnlyPhone(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span>Phone Only</span>
              </label>
            </div>
          </div>

          {/* Database Workspace Split Pane */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left side: Database List */}
            <div className="lg:col-span-8 glass-panel rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 text-slate-400 uppercase text-[10px] bg-white/5">
                    <tr>
                      <th className="p-4">Business Name</th>
                      <th className="p-4">Phone / WhatsApp</th>
                      <th className="p-4">Score</th>
                      <th className="p-4">Est. Value</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBusinesses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">No matching business records found.</td>
                      </tr>
                    ) : (
                      filteredBusinesses.map(b => {
                        const lang = determineLanguage(b.state)
                        const isSelected = selectedLead?.id === b.id
                        return (
                          <tr
                            key={b.id}
                            onClick={() => setSelectedLead(b)}
                            className={`hover:bg-white/5 transition-all cursor-pointer ${
                              isSelected ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : ''
                            } ${b.dnc_flag ? 'opacity-40 bg-red-500/5' : ''}`}
                          >
                            <td className="p-4 font-semibold text-white">
                              <div className="flex items-center gap-2">
                                <span>{b.name}</span>
                                {b.dnc_flag && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400">DNC</span>}
                                {b.duplicate_flag && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400">DUP</span>}
                              </div>
                              <div className="text-[11px] text-slate-400 font-normal">
                                {b.category} &bull; <span className="text-emerald-400 font-mono">{lang}</span>
                              </div>
                            </td>

                            <td className="p-4 font-mono text-slate-300">
                              <div>{b.phone || 'N/A'}</div>
                              <div className="text-[10px] text-slate-500">{b.email || 'No email'}</div>
                            </td>

                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white font-mono text-sm">{b.lead_score}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  b.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                  {b.priority}
                                </span>
                              </div>
                            </td>

                            <td className="p-4 font-mono text-emerald-400 font-semibold">{b.estimated_value_band}</td>

                            <td className="p-4" onClick={e => e.stopPropagation()}>
                              <select
                                value={b.status}
                                onChange={e => updateBusinessStatus(b.id, e.target.value as any)}
                                className="px-2 py-1 rounded bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-[11px] text-slate-900 dark:text-white outline-none"
                              >
                                <option value="New" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">New</option>
                                <option value="Contacted" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Contacted</option>
                                <option value="Replied" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Replied</option>
                                <option value="Meeting Scheduled" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Meeting Scheduled</option>
                                <option value="Proposal Sent" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Proposal Sent</option>
                                <option value="Won" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Won</option>
                                <option value="Lost" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">Lost</option>
                              </select>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right side: Detail Inspector panel */}
            <div className="lg:col-span-4 space-y-6">
              {selectedLead ? (
                <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/40 space-y-6 animate-fade-in">
                  <div>
                    <div className="text-[9px] uppercase font-bold tracking-widest text-emerald-400">Prospect Inspector</div>
                    <h3 className="font-bold text-white text-base font-display mt-1">{selectedLead.name}</h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">{selectedLead.category}</div>
                    <div className="text-[11px] text-slate-400">📍 {selectedLead.city}, {selectedLead.state}</div>
                  </div>

                  {/* Score Info */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Lead Score</div>
                      <div className="text-xl font-black text-white mt-0.5">{selectedLead.lead_score} <span className="text-[10px] text-slate-500 font-semibold">/ 100</span></div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      selectedLead.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {selectedLead.priority} Priority
                    </span>
                  </div>

                  {/* Lead Metadata */}
                  <div className="space-y-3 text-xs border-t border-white/5 pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="font-mono text-white font-semibold">{selectedLead.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="font-mono text-white truncate max-w-[180px]">{selectedLead.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Website:</span>
                      {selectedLead.website ? (
                        <a
                          href={selectedLead.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline truncate max-w-[180px] font-mono"
                        >
                          {selectedLead.website}
                        </a>
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                    </div>
                  </div>

                  {/* Recommended Services */}
                  <div className="border-t border-white/5 pt-4 space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommended Services</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedLead.recommended_services || ['Website Development']).map((srv, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="border-t border-white/5 pt-4 space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setActiveTab('outreach') }}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-950/20"
                      >
                        <MessageSquare size={13} />
                        <span>Launch Studio</span>
                      </button>

                      <button
                        onClick={() => { setActiveTab('audit') }}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Globe size={13} />
                        <span>Audit Site</span>
                      </button>
                    </div>

                    <button
                      onClick={() => toggleDncFlag(selectedLead.id, !selectedLead.dnc_flag)}
                      className={`w-full py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        selectedLead.dnc_flag
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {selectedLead.dnc_flag ? '⛔ DNC Active' : 'Set Do Not Contact (DNC)'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-slate-900/40 text-center py-24 space-y-4">
                  <Database size={32} className="mx-auto text-slate-600 animate-pulse" />
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select a Prospect</h4>
                  <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                    Click any lead in the database list to inspect parameters and trigger campaigns.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WEBSITE AUDIT & SCORING */}
      {activeTab === 'audit' && selectedLead && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Audit Controls & Status */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base font-display">Target Audit Prospect</h3>
              <p className="text-xs text-slate-400">{selectedLead.name} ({selectedLead.city}, {selectedLead.state})</p>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="text-xs text-slate-400">Website URL:</div>
              <div className="font-mono text-emerald-400 text-xs truncate">{selectedLead.website || 'No website found'}</div>
            </div>

            <button
              onClick={handleRunAudit}
              disabled={auditing}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {auditing ? <RefreshCw className="animate-spin" size={16} /> : <Globe size={16} />}
              <span>Run Automated Website Audit</span>
            </button>
          </div>

          {/* Audit Metrics Output */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6">
            <h3 className="font-bold text-white text-base font-display">Audit &amp; Service Suggestion Metrics</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[11px] text-slate-400">Speed Performance Score</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">{currentAudit ? currentAudit.speed_score : 85} / 100</div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[11px] text-slate-400">Mobile Friendly</div>
                <div className="text-lg font-bold text-white">{currentAudit ? (currentAudit.mobile_friendly ? '✅ Yes' : '❌ No') : '✅ Yes'}</div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[11px] text-slate-400">SSL Certificate</div>
                <div className="text-lg font-bold text-white">{currentAudit ? (currentAudit.ssl_active ? '✅ Active' : '❌ Missing') : '✅ Active'}</div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[11px] text-slate-400">Contact Form</div>
                <div className="text-lg font-bold text-white">{currentAudit ? (currentAudit.has_contact_form ? '✅ Present' : '❌ Missing') : '❌ Missing'}</div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[11px] text-slate-400">WhatsApp Button</div>
                <div className="text-lg font-bold text-white">{currentAudit ? (currentAudit.has_whatsapp_button ? '✅ Present' : '❌ Missing') : '❌ Missing'}</div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[11px] text-slate-400">Estimated Project Value</div>
                <div className="text-lg font-bold font-mono text-emerald-400">{selectedLead.estimated_value_band}</div>
              </div>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Auto-Recommended SpringWeb Services:</h4>
              <div className="flex flex-wrap gap-2">
                {(selectedLead.recommended_services || ['Website Development', 'WhatsApp Integration']).map((srv, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-xs">
                    ⚡ {srv}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: OUTREACH STUDIO */}
      {activeTab === 'outreach' && selectedLead && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Target Prospect Sidebar */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6">
            <div className="space-y-1">
              <h3 className="font-bold text-white text-base font-display">Target Prospect</h3>
              <div className="text-sm font-semibold text-emerald-400">{selectedLead.name}</div>
              <div className="text-xs text-slate-400">{selectedLead.city}, {selectedLead.state} &bull; <strong className="text-white font-mono">{determineLanguage(selectedLead.state)}</strong></div>
            </div>

            {selectedLead.dnc_flag && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
                <ShieldAlert size={18} />
                <span>Do Not Contact (DNC) Active! Outreach blocked.</span>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-xs text-slate-400">Outreach Channel</label>
              <div className="grid grid-cols-3 gap-2">
                {(['WhatsApp', 'Email', 'LinkedIn'] as const).map(ch => (
                  <button
                    key={ch}
                    onClick={() => setOutreachChannel(ch)}
                    className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      outreachChannel === ch ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs text-slate-400">Outreach Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOutreachMode('Template')}
                  className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    outreachMode === 'Template' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  Template (Free)
                </button>

                <button
                  onClick={() => setOutreachMode('AI Generated')}
                  className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    outreachMode === 'AI Generated' ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  AI Generated (Token Guard)
                </button>
              </div>
            </div>

            {outreachMode === 'AI Generated' && (
              <div className="space-y-3 border-t border-white/10 pt-4">
                <label className="block text-xs text-slate-400">Select AI Model</label>
                <select
                  value={aiModel}
                  onChange={e => setAiModel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-none"
                >
                  <option value="gpt-4o-mini" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">gpt-4o-mini (Free / Zero Cost — ₹0.00)</option>
                  <option value="claude-3-haiku" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">claude-3-haiku (Free / Zero Cost — ₹0.00)</option>
                  <option value="gpt-4o" className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">gpt-4o (Free / Zero Cost — ₹0.00)</option>
                </select>

                <button
                  onClick={handleRequestAiDraft}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-900/30"
                >
                  <Sparkles size={16} />
                  <span>Generate AI Message Draft</span>
                </button>
              </div>
            )}
          </div>

          {/* Message Content Editor & Sender */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base font-display">Outreach Message Content</h3>
              <span className="text-xs font-mono text-emerald-400">Language: {determineLanguage(selectedLead.state)}</span>
            </div>

            <textarea
              value={outreachText}
              onChange={e => setOutreachText(e.target.value)}
              rows={8}
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white font-sans text-xs outline-none focus:border-emerald-500 leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400">
                Recipient: <strong className="text-white">{selectedLead.phone || selectedLead.email || 'No Direct Contact'}</strong>
              </div>

              <button
                onClick={handleSendOutreach}
                disabled={selectedLead.dnc_flag}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-900/30"
              >
                <MessageSquare size={16} />
                <span>Dispatch &amp; Log Outreach ({outreachChannel})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BACKUP & SYSTEM LOGS */}
      {activeTab === 'backup' && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/5 space-y-6 animate-fade-in">
          <h3 className="font-bold text-white text-base font-display">Weekly Database Backup &amp; Logs</h3>
          
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => exportDatabaseBackup('json')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Download size={16} />
              <span>Download Full Database Backup (JSON)</span>
            </button>

            <button
              onClick={() => exportDatabaseBackup('csv')}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <FileText size={16} />
              <span>Export Leads Table (CSV)</span>
            </button>
          </div>

          {/* AI Usage Logs */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Token Usage Logs</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 text-slate-400 text-[10px] uppercase">
                  <tr>
                    <th className="py-2">Feature</th>
                    <th className="py-2">Model</th>
                    <th className="py-2">Prompt Tokens</th>
                    <th className="py-2">Completion Tokens</th>
                    <th className="py-2">Est. Cost (₹)</th>
                    <th className="py-2">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {aiUsageLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">No AI usage logs recorded yet this month.</td>
                    </tr>
                  ) : (
                    aiUsageLogs.map(log => (
                      <tr key={log.id}>
                        <td className="py-2 font-semibold text-white">{log.feature}</td>
                        <td className="py-2 font-mono text-emerald-400">{log.model}</td>
                        <td className="py-2 font-mono text-slate-300">{log.prompt_tokens}</td>
                        <td className="py-2 font-mono text-slate-300">{log.completion_tokens}</td>
                        <td className="py-2 font-mono text-white">₹{log.estimated_cost_inr}</td>
                        <td className="py-2 text-slate-500 text-[11px]">{new Date(log.created_at).toLocaleTimeString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AI Token Confirmation Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-indigo-500/40 max-w-md w-full bg-[#0a0d18] space-y-6 animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">AI Token Execution Confirmation</h3>
                <p className="text-xs text-slate-400">Explicit confirmation required before AI API invocation.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Model Selected:</span>
                <span className="font-mono font-bold text-indigo-300">{aiModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Est. Prompt Tokens:</span>
                <span className="font-mono text-white">{estimatedTokens.prompt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Est. Completion Tokens:</span>
                <span className="font-mono text-white">{estimatedTokens.completion}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 font-bold">
                <span className="text-slate-300">Estimated Cost:</span>
                <span className="font-mono text-emerald-400">₹{estimatedTokens.costINR}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAiModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmAiGenerate}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-indigo-900/30"
              >
                Confirm &amp; Generate Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 max-w-md w-full bg-[#070a13] space-y-4 animate-scale-up">
            <h3 className="font-bold text-white text-base">Add Manual Business Prospect</h3>

            <form onSubmit={handleAddManualLead} className="space-y-3">
              <input
                type="text"
                value={newBizName}
                onChange={e => setNewBizName(e.target.value)}
                placeholder="Business Name"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none"
                required
              />

              <input
                type="text"
                value={newBizPhone}
                onChange={e => setNewBizPhone(e.target.value)}
                placeholder="Phone Number / WhatsApp (+91...)"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none"
              />

              <input
                type="email"
                value={newBizEmail}
                onChange={e => setNewBizEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none"
              />

              <input
                type="url"
                value={newBizWebsite}
                onChange={e => setNewBizWebsite(e.target.value)}
                placeholder="Website URL (e.g. https://...)"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newBizCity}
                  onChange={e => setNewBizCity(e.target.value)}
                  placeholder="City (e.g. Udumalpet)"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none"
                />

                <input
                  type="text"
                  value={newBizState}
                  onChange={e => setNewBizState(e.target.value)}
                  placeholder="State (e.g. Tamil Nadu)"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
export default LeadGenSystem
