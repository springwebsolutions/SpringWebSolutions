import React, { useEffect } from 'react'
import { useCareersStore } from '@/stores/careersStore'
import { Activity, CheckCircle2, XCircle, Clock, AlertTriangle, Search, RefreshCw, Loader2, ArrowRight, Globe, Zap, Hash } from 'lucide-react'

export const AdminScrapeMonitor: React.FC = () => {
  const { scrapeRuns, fetchScrapeRuns } = useCareersStore()

  useEffect(() => { fetchScrapeRuns() }, [])

  const statusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full text-[11px]"><CheckCircle2 size={10} /> Completed</span>
      case 'running': return <span className="flex items-center gap-1 text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full text-[11px]"><Loader2 size={10} className="animate-spin" /> Running</span>
      case 'failed': return <span className="flex items-center gap-1 text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full text-[11px]"><XCircle size={10} /> Failed</span>
      default: return <span className="text-zinc-400 text-[11px]">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Activity className="text-amber-400" size={24} /> Scrape Monitor</h1>
          <p className="text-sm text-zinc-400 mt-1">Track job discovery runs and source health</p>
        </div>
        <button onClick={fetchScrapeRuns} className="flex items-center gap-2 bg-zinc-800 text-zinc-300 px-4 py-2 rounded-xl text-sm hover:bg-zinc-700 transition-all">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Runs', value: scrapeRuns.length, color: 'text-white', bg: 'from-zinc-800/80 to-zinc-900/80' },
          { label: 'Successful', value: scrapeRuns.filter(r => r.status === 'completed').length, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-500/5' },
          { label: 'Failed', value: scrapeRuns.filter(r => r.status === 'failed').length, color: 'text-red-400', bg: 'from-red-500/10 to-red-500/5' },
          { label: 'Total Jobs Found', value: scrapeRuns.reduce((acc, r) => acc + r.jobs_found, 0), color: 'text-sky-400', bg: 'from-sky-500/10 to-sky-500/5' },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.bg} border border-zinc-800/60 rounded-xl p-4`}>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Scrape Runs Table */}
      <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800/60">
                <th className="text-left py-3 px-4 text-xs text-zinc-500 font-medium uppercase tracking-wider">Source</th>
                <th className="text-left py-3 px-4 text-xs text-zinc-500 font-medium uppercase tracking-wider">Status</th>
                <th className="text-center py-3 px-4 text-xs text-zinc-500 font-medium uppercase tracking-wider">Found</th>
                <th className="text-center py-3 px-4 text-xs text-zinc-500 font-medium uppercase tracking-wider">New</th>
                <th className="text-center py-3 px-4 text-xs text-zinc-500 font-medium uppercase tracking-wider">Duplicates</th>
                <th className="text-left py-3 px-4 text-xs text-zinc-500 font-medium uppercase tracking-wider">Started</th>
                <th className="text-left py-3 px-4 text-xs text-zinc-500 font-medium uppercase tracking-wider">Duration</th>
                <th className="text-left py-3 px-4 text-xs text-zinc-500 font-medium uppercase tracking-wider">Error</th>
              </tr>
            </thead>
            <tbody>
              {scrapeRuns.map(run => {
                const duration = run.completed_at
                  ? `${((new Date(run.completed_at).getTime() - new Date(run.started_at).getTime()) / 1000).toFixed(1)}s`
                  : '—'

                return (
                  <tr key={run.id} className="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Globe size={12} className="text-zinc-500" />
                        <span className="text-white font-medium">{run.source_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{statusBadge(run.status)}</td>
                    <td className="py-3 px-4 text-center text-zinc-300">{run.jobs_found}</td>
                    <td className="py-3 px-4 text-center text-emerald-400 font-medium">{run.jobs_new}</td>
                    <td className="py-3 px-4 text-center text-zinc-500">{run.jobs_duplicate}</td>
                    <td className="py-3 px-4 text-zinc-400 text-xs">{new Date(run.started_at).toLocaleString()}</td>
                    <td className="py-3 px-4 text-zinc-400 text-xs font-mono">{duration}</td>
                    <td className="py-3 px-4 text-xs text-red-400 max-w-[200px] truncate" title={run.error_message || ''}>
                      {run.error_message || '—'}
                    </td>
                  </tr>
                )
              })}
              {scrapeRuns.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500 text-sm">
                    No scrape runs found. Trigger a discovery to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
