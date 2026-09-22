import React, { useState, useEffect, useMemo } from 'react'
import { useCareersStore } from '@/stores/careersStore'
import type { DiscoveredJob } from '@/stores/careersStore'
import {
  Search, Filter, CheckCircle2, XCircle, Upload, Trash2, RefreshCw,
  MapPin, Briefcase, DollarSign, Building2, Globe, ChevronDown,
  Eye, ExternalLink, Zap, Clock, AlertTriangle, Loader2, Sparkles,
  ArrowRight, ChevronRight, Tag, Shield
} from 'lucide-react'

const STATUS_CONFIG = {
  discovered: { label: 'Discovered', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Search, dotColor: 'bg-amber-400' },
  verified:   { label: 'Verified',   color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2, dotColor: 'bg-emerald-400' },
  published:  { label: 'Published',  color: 'bg-sky-500/20 text-sky-400 border-sky-500/30', icon: Upload, dotColor: 'bg-sky-400' },
  rejected:   { label: 'Rejected',   color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle, dotColor: 'bg-red-400' },
  expired:    { label: 'Expired',    color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30', icon: Clock, dotColor: 'bg-zinc-400' },
}

const JobCard: React.FC<{
  job: DiscoveredJob
  onVerify: () => void
  onReject: () => void
  onPublish: () => void
  onExpire: () => void
}> = ({ job, onVerify, onReject, onPublish, onExpire }) => {
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [expanded, setExpanded] = useState(false)
  const config = STATUS_CONFIG[job.status]

  return (
    <div className="group bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 hover:border-zinc-700/80 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-lg ${config.color} shrink-0`}>
          <config.icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate" title={job.raw_title}>{job.raw_title}</h3>
          <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
            <Building2 size={11} className="text-zinc-500" />
            <span className="truncate">{job.raw_company}</span>
          </p>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${config.color} shrink-0 font-medium`}>
          {config.label}
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-3 text-[11px] text-zinc-400">
        {job.raw_location && (
          <span className="flex items-center gap-1 bg-zinc-800/60 px-2 py-0.5 rounded-full">
            <MapPin size={10} /> {job.raw_location.substring(0, 30)}
          </span>
        )}
        {job.raw_salary && (
          <span className="flex items-center gap-1 bg-zinc-800/60 px-2 py-0.5 rounded-full" title="Verified Source Fact">
            <DollarSign size={10} /> {job.raw_salary.substring(0, 25)}
            <Shield size={8} className="text-emerald-500 ml-0.5" />
          </span>
        )}
        {job.ai_category && (
          <span className="flex items-center gap-1 bg-zinc-800/60 px-2 py-0.5 rounded-full">
            <Tag size={10} /> {job.ai_category}
          </span>
        )}
        <span className="flex items-center gap-1 bg-zinc-800/60 px-2 py-0.5 rounded-full">
          <Globe size={10} /> {job.source_name}
        </span>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="mb-3 text-xs text-zinc-400 border-t border-zinc-800/60 pt-3 space-y-2">
          {job.ai_summary && (
            <p className="leading-relaxed">{job.ai_summary.startsWith('[AI SUMMARY]') ? <><span className="text-amber-400 text-[10px] font-mono mr-1">AI SUMMARY</span>{job.ai_summary.replace('[AI SUMMARY] ', '')}</> : job.ai_summary}</p>
          )}
          {job.source_url && (
            <a href={job.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sky-400 hover:text-sky-300 text-[11px]">
              <ExternalLink size={10} /> View original listing
            </a>
          )}
          {job.ai_experience_level && <p className="text-zinc-500">Experience: {job.ai_experience_level}</p>}
          <p className="text-zinc-500 text-[10px]">Discovered: {new Date(job.discovered_at).toLocaleString()}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/50">
        <button onClick={() => setExpanded(!expanded)} className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 mr-auto transition-colors">
          <Eye size={11} /> {expanded ? 'Less' : 'More'}
        </button>

        {showRejectInput ? (
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Rejection reason..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-[11px] text-white placeholder:text-zinc-500 focus:border-red-500/50 focus:outline-none"
            />
            <button onClick={() => { onReject(); setShowRejectInput(false) }} className="text-[11px] bg-red-500/20 text-red-400 px-2 py-1 rounded-lg hover:bg-red-500/30 transition-colors">Reject</button>
            <button onClick={() => setShowRejectInput(false)} className="text-[11px] text-zinc-500 hover:text-zinc-300">✕</button>
          </div>
        ) : (
          <>
            {(job.status === 'discovered') && (
              <>
                <button onClick={onVerify} className="text-[11px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-1">
                  <CheckCircle2 size={11} /> Verify
                </button>
                <button onClick={() => setShowRejectInput(true)} className="text-[11px] bg-red-500/20 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-1">
                  <XCircle size={11} /> Reject
                </button>
              </>
            )}
            {(job.status === 'verified') && (
              <button onClick={onPublish} className="text-[11px] bg-sky-500/20 text-sky-400 px-3 py-1 rounded-lg hover:bg-sky-500/30 transition-colors flex items-center gap-1">
                <Upload size={11} /> Publish
              </button>
            )}
            {(job.status === 'discovered' || job.status === 'verified') && (
              <button onClick={onExpire} className="text-[11px] bg-zinc-700/40 text-zinc-400 px-2 py-1 rounded-lg hover:bg-zinc-700/60 transition-colors">
                <Clock size={11} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export const AdminJobDiscovery: React.FC = () => {
  const {
    discoveredJobs, discoveryStats, discoveryLoading,
    fetchDiscoveredJobs, fetchDiscoveryStats,
    verifyJob, rejectJob, publishDiscoveredJob, expireJob,
    triggerDiscovery, triggerCategorization
  } = useCareersStore()

  const [activeTab, setActiveTab] = useState<'all' | 'discovered' | 'verified' | 'published' | 'rejected' | 'expired'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDiscovering, setIsDiscovering] = useState(false)
  const [discoveryQuery, setDiscoveryQuery] = useState('software developer')
  const [discoveryLocation, setDiscoveryLocation] = useState('India')
  const [showDiscoveryPanel, setShowDiscoveryPanel] = useState(false)
  const [selectedSources, setSelectedSources] = useState<string[]>([
    'company_ats', 'linkedin', 'indeed', 'naukri', 'adzuna', 'remotive', 'jsearch'
  ])
  const [lastDiscoveryResult, setLastDiscoveryResult] = useState<{ total_new: number; total_found: number } | null>(null)

  const toggleSource = (s: string) => {
    setSelectedSources(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  useEffect(() => {
    fetchDiscoveredJobs()
    fetchDiscoveryStats()
  }, [])

  const filteredJobs = useMemo(() => {
    let filtered = discoveredJobs
    if (activeTab !== 'all') {
      filtered = filtered.filter(j => j.status === activeTab)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(j =>
        j.raw_title.toLowerCase().includes(q) ||
        j.raw_company.toLowerCase().includes(q) ||
        j.raw_location?.toLowerCase().includes(q) ||
        j.ai_category?.toLowerCase().includes(q)
      )
    }
    return filtered
  }, [discoveredJobs, activeTab, searchQuery])

  const statusCounts = useMemo(() => ({
    all: discoveredJobs.length,
    discovered: discoveredJobs.filter(j => j.status === 'discovered').length,
    verified: discoveredJobs.filter(j => j.status === 'verified').length,
    published: discoveredJobs.filter(j => j.status === 'published').length,
    rejected: discoveredJobs.filter(j => j.status === 'rejected').length,
    expired: discoveredJobs.filter(j => j.status === 'expired').length,
  }), [discoveredJobs])

  const handleTriggerDiscovery = async () => {
    setIsDiscovering(true)
    setLastDiscoveryResult(null)
    try {
      const result = await triggerDiscovery(discoveryQuery, discoveryLocation, selectedSources)
      setLastDiscoveryResult(result)
    } finally {
      setIsDiscovering(false)
    }
  }

  const handleBulkVerify = async () => {
    const pending = discoveredJobs.filter(j => j.status === 'discovered')
    for (const job of pending.slice(0, 20)) {
      await verifyJob(job.id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="text-emerald-400" size={24} />
            Job Discovery Engine
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Multi-source scraping across Official Company Portals, LinkedIn, Indeed, Naukri & APIs</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDiscoveryPanel(!showDiscoveryPanel)}
            className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-500/30 transition-all cursor-pointer"
          >
            <Sparkles size={16} />
            Run Discovery
          </button>
          <button
            onClick={() => { fetchDiscoveredJobs(); fetchDiscoveryStats() }}
            className="flex items-center gap-2 bg-zinc-800 text-zinc-300 px-4 py-2 rounded-xl text-sm hover:bg-zinc-700 transition-all cursor-pointer"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total', value: statusCounts.all, color: 'text-white', bg: 'from-zinc-800/80 to-zinc-900/80' },
          { label: 'Pending', value: statusCounts.discovered, color: 'text-amber-400', bg: 'from-amber-500/10 to-amber-500/5' },
          { label: 'Verified', value: statusCounts.verified, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-500/5' },
          { label: 'Published', value: statusCounts.published, color: 'text-sky-400', bg: 'from-sky-500/10 to-sky-500/5' },
          { label: 'Rejected', value: statusCounts.rejected, color: 'text-red-400', bg: 'from-red-500/10 to-red-500/5' },
          { label: 'Expired', value: statusCounts.expired, color: 'text-zinc-400', bg: 'from-zinc-800/40 to-zinc-900/40' },
        ].map(stat => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.bg} border border-zinc-800/60 rounded-xl p-4`}>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Discovery Configuration Panel */}
      {showDiscoveryPanel && (
        <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-6 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="text-emerald-400" size={16} />
              <span>Multi-Source Crawler Configuration</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {selectedSources.length} Active Sources
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Search Query / Roles</label>
              <input
                value={discoveryQuery}
                onChange={e => setDiscoveryQuery(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
                placeholder="e.g., React developer, Python engineer..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Target Location</label>
              <input
                value={discoveryLocation}
                onChange={e => setDiscoveryLocation(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
                placeholder="e.g., India, Bengaluru, Chennai, Remote..."
              />
            </div>
          </div>

          {/* Source Checkboxes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
              Select Crawler Sources
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'company_ats', label: '🏢 Company Official ATS (Greenhouse / Lever)', color: 'text-emerald-400' },
                { id: 'linkedin', label: '💼 LinkedIn Public Jobs', color: 'text-sky-400' },
                { id: 'indeed', label: '🔍 Indeed India', color: 'text-indigo-400' },
                { id: 'naukri', label: '🇮🇳 Naukri India Feeds', color: 'text-amber-400' },
                { id: 'adzuna', label: '⚡ Adzuna India API', color: 'text-teal-400' },
                { id: 'remotive', label: '🌐 Remotive (100% WFH)', color: 'text-purple-400' },
                { id: 'jsearch', label: '🚀 JSearch Network', color: 'text-rose-400' },
              ].map(src => {
                const checked = selectedSources.includes(src.id)
                return (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => toggleSource(src.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      checked
                        ? 'bg-zinc-800/90 border-emerald-500/40 text-white shadow-sm'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <span className="font-medium text-[11px] truncate mr-2">{src.label}</span>
                    <span className={`h-4 w-4 rounded flex items-center justify-center text-[10px] font-bold ${
                      checked ? 'bg-emerald-500 text-slate-950' : 'bg-zinc-800 text-zinc-600'
                    }`}>
                      {checked ? '✓' : ''}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-800/80">
            <button
              onClick={handleTriggerDiscovery}
              disabled={isDiscovering || selectedSources.length === 0}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 px-6 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isDiscovering ? <><Loader2 size={14} className="animate-spin" /> Crawling Selected Sources...</> : <><Zap size={14} /> Start Discovery Crawl</>}
            </button>
            <button
              onClick={() => triggerCategorization()}
              className="flex items-center gap-2 bg-violet-500/20 text-violet-300 border border-violet-500/30 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-violet-500/30 transition-all cursor-pointer"
            >
              <Tag size={14} /> Auto-Categorize All
            </button>
            {statusCounts.discovered > 0 && (
              <button
                onClick={handleBulkVerify}
                className="flex items-center gap-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-500/25 transition-all cursor-pointer"
              >
                <CheckCircle2 size={14} /> Bulk Verify ({Math.min(statusCounts.discovered, 20)})
              </button>
            )}
          </div>
          {lastDiscoveryResult && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-emerald-400">✓ Found {lastDiscoveryResult.total_found} jobs</span>
              <span className="text-zinc-500">•</span>
              <span className="text-sky-400">{lastDiscoveryResult.total_new} new</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">{lastDiscoveryResult.total_found - lastDiscoveryResult.total_new} duplicates skipped</span>
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-1 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-1 overflow-x-auto">
          {(['all', 'discovered', 'verified', 'published', 'rejected', 'expired'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-zinc-700/80 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              {tab === 'all' ? 'All' : STATUS_CONFIG[tab].label}
              <span className="ml-1.5 text-[10px] opacity-60">{statusCounts[tab]}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search jobs..."
            className="w-full bg-zinc-900/60 border border-zinc-800/60 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Loading */}
      {discoveryLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-emerald-400" size={24} />
          <span className="ml-2 text-sm text-zinc-400">Loading discovered jobs...</span>
        </div>
      )}

      {/* Jobs Grid */}
      {!discoveryLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onVerify={() => verifyJob(job.id)}
              onReject={() => rejectJob(job.id, 'Rejected by admin')}
              onPublish={() => publishDiscoveredJob(job.id)}
              onExpire={() => expireJob(job.id)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!discoveryLoading && filteredJobs.length === 0 && (
        <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800/60 rounded-xl">
          <Search className="mx-auto text-zinc-600 mb-3" size={32} />
          <p className="text-zinc-400 text-sm">No discovered jobs found</p>
          <p className="text-zinc-500 text-xs mt-1">Run a discovery to scrape jobs from external sources</p>
          <button
            onClick={() => setShowDiscoveryPanel(true)}
            className="mt-4 text-emerald-400 text-sm hover:text-emerald-300 flex items-center gap-1 mx-auto"
          >
            <Sparkles size={14} /> Run Discovery <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
