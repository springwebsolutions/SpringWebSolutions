import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useCRMStore } from '@/stores/crmStore'
import { useAuthStore } from '@/stores/authStore'
import {
  Users, Download, IndianRupee, TrendingUp, Inbox, RefreshCw, ArrowUpRight,
  BookOpen, Ticket, Globe, Activity, CheckCircle2, Clock, AlertTriangle,
  MessageSquare, HelpCircle, Settings, FileText, Image, Briefcase, UserCheck,
  Megaphone, BarChart2, Cpu, ShoppingCart, MapPin, Database, Layers,
  Zap, Star, TrendingDown, ArrowUp, ArrowDown
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LineChart, Line, ReferenceLine
} from 'recharts'

// ─── Animated Count-Up Hook ──────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const startRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    startRef.current = null

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [target, duration])

  return value
}

// ─── Sparkline Mini Chart ─────────────────────────────────────────────────────
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const points = data.map((v, i) => ({ i, v }))
  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={points} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
        <Line
          type="monotone" dataKey="v" stroke={color}
          strokeWidth={1.5} dot={false}
          activeDot={{ r: 2, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── KPI Stat Card ────────────────────────────────────────────────────────────
const StatCard: React.FC<{
  title: string
  value: number
  format?: (n: number) => string
  sub?: string
  icon: React.ComponentType<any>
  iconColor: string
  iconBg: string
  glowColor: string
  trend?: { pct: string; up: boolean; label?: string }
  sparkData?: number[]
  sparkColor?: string
}> = ({ title, value, format, sub, icon: Icon, iconColor, iconBg, glowColor, trend, sparkData, sparkColor }) => {
  const animated = useCountUp(value)
  const display = format ? format(animated) : animated.toLocaleString()

  return (
    <div className={`relative overflow-hidden bg-[#07090f] border border-white/[0.07] rounded-2xl p-5 group hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-0.5`}>
      {/* Background glow */}
      <div className={`absolute top-0 right-0 h-24 w-24 rounded-full ${glowColor} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -translate-y-6 translate-x-6 pointer-events-none`} />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`h-10 w-10 rounded-xl ${iconBg} border border-white/[0.06] flex items-center justify-center shadow-sm`}>
            <Icon size={18} className={iconColor} />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold ${
              trend.up ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-rose-500/10 text-rose-400 border border-rose-500/15'
            }`}>
              {trend.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
              {trend.pct}
            </div>
          )}
        </div>

        <div className="text-2xl font-black text-white tracking-tight tabular-nums">{display}</div>
        <div className="text-[10.5px] font-semibold text-slate-600 uppercase tracking-wider mt-0.5">{title}</div>
        {sub && <div className="text-[11px] text-slate-600 mt-1 leading-snug">{sub}</div>}

        {/* Sparkline */}
        {sparkData && sparkData.length > 0 && (
          <div className="mt-3 opacity-60 group-hover:opacity-90 transition-opacity">
            <Sparkline data={sparkData} color={sparkColor || '#10b981'} />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0d1117] border border-white/10 rounded-xl px-3.5 py-2.5 shadow-2xl text-xs">
      <div className="font-bold text-slate-300 mb-1.5">{label}</div>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-500 capitalize">{entry.dataKey}:</span>
          <span className="font-bold text-white">{Number(entry.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Module Hub Tile ──────────────────────────────────────────────────────────
const ModuleTile: React.FC<{
  to: string; icon: React.ComponentType<any>; label: string; desc: string
  color: string; bg: string; border: string; badge?: string
}> = ({ to, icon: Icon, label, desc, color, bg, border, badge }) => (
  <Link
    to={to}
    className={`group relative flex flex-col items-start gap-2 p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${bg} ${border} hover:border-white/[0.12]`}
  >
    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${bg} ${border}`}>
      <Icon size={16} className={color} />
    </div>
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors leading-tight">{label}</span>
        {badge && (
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[8px] font-bold border border-emerald-500/20">{badge}</span>
        )}
      </div>
      <div className="text-[10px] text-slate-600 truncate mt-0.5">{desc}</div>
    </div>
    <ArrowUpRight size={11} className={`absolute top-3 right-3 ${color} opacity-0 group-hover:opacity-60 transition-opacity`} />
  </Link>
)

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader: React.FC<{
  title: string; sub: string; action?: React.ReactNode
}> = ({ title, sub, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="text-[11px] text-slate-600 mt-0.5">{sub}</p>
    </div>
    {action}
  </div>
)

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export const Dashboard: React.FC = () => {
  const { leads, fetchLeads, metrics } = useCRMStore()
  const { user, profile } = useAuthStore()

  const [visitorCount, setVisitorCount] = useState(0)
  const [downloadCount, setDownloadCount] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [contactCount, setContactCount] = useState(0)
  const [ticketCount, setTicketCount] = useState(0)
  const [recentAudits, setRecentAudits] = useState<any[]>([])
  const [visitorChartData, setVisitorChartData] = useState<any[]>([])
  const [visitorSparkData, setVisitorSparkData] = useState<number[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [notConfigured, setNotConfigured] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const greetingHour = new Date().getHours()
  const greeting = greetingHour < 12 ? '☀️ Good morning' : greetingHour < 18 ? '🌤️ Good afternoon' : '🌙 Good evening'
  const displayName = (profile as any)?.full_name || user?.email?.split('@')[0] || 'Admin'
  const todayStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const leadPipelineData = [
    { name: 'New',       count: metrics.newCount,                                        color: '#38bdf8' },
    { name: 'Contacted', count: leads.filter(l => l.status === 'contacted').length,       color: '#a78bfa' },
    { name: 'Qualified', count: metrics.qualified,                                        color: '#f59e0b' },
    { name: 'Proposal',  count: metrics.proposal,                                         color: '#fb923c' },
    { name: 'Won',       count: metrics.won,                                               color: '#10b981' },
    { name: 'Lost',      count: metrics.lost,                                              color: '#f43f5e' },
  ]

  const loadDashboardStats = async () => {
    if (!isSupabaseConfigured) { setNotConfigured(true); return }
    setRefreshing(true)
    try {
      await fetchLeads()

      // Pageviews total
      const { count: vCount } = await supabase.from('analytics_pageviews').select('*', { count: 'exact', head: true })
      setVisitorCount(vCount ?? 0)

      // Last 7 days pageviews
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
      sevenDaysAgo.setHours(0, 0, 0, 0)
      const { data: pvRows } = await supabase
        .from('analytics_pageviews').select('visited_at')
        .gte('visited_at', sevenDaysAgo.toISOString())
        .order('visited_at', { ascending: true })

      const dayMap: Record<string, number> = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i)
        dayMap[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0
      }
      pvRows?.forEach((row: any) => {
        const key = new Date(row.visited_at).toLocaleDateString('en-US', { weekday: 'short' })
        if (key in dayMap) dayMap[key]++
      })
      const chartData = Object.entries(dayMap).map(([name, visitors]) => ({ name, visitors }))
      setVisitorChartData(chartData)
      setVisitorSparkData(chartData.map(d => d.visitors))

      // Downloads
      const { count: dCount } = await supabase.from('downloads').select('*', { count: 'exact', head: true })
      setDownloadCount(dCount ?? 0)

      // Revenue
      const { data: orders } = await supabase.from('orders').select('total').eq('status', 'completed')
      setRevenue(orders ? orders.reduce((s, o) => s + Number(o.total), 0) : 0)

      // Contacts
      const { count: cCount } = await supabase.from('contact_submissions').select('*', { count: 'exact', head: true })
      setContactCount(cCount ?? 0)

      // Open tickets
      const { count: tCount } = await supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open')
      setTicketCount(tCount ?? 0)

      // Audit logs
      const { data: audits } = await supabase
        .from('audit_logs').select('action, table_name, created_at')
        .order('created_at', { ascending: false }).limit(8)
      setRecentAudits(audits || [])

    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setRefreshing(false)
      setLoaded(true)
    }
  }

  useEffect(() => { loadDashboardStats() }, [])

  const isSuiteDomain = typeof window !== 'undefined' && window.location.hostname.toLowerCase().startsWith('suite.')
  const prefix = isSuiteDomain ? '' : '/admin'

  // ─── Module Hub data ───────────────────────────────────────────────────────
  const modules = [
    { to: `${prefix}/content`,         icon: Globe,         label: 'Website CMS',     desc: 'Pages & sections',     color: 'text-sky-400',      bg: 'bg-sky-500/5',      border: 'border-sky-500/15' },
    { to: `${prefix}/blog`,            icon: BookOpen,      label: 'Blog CMS',        desc: 'Articles & posts',     color: 'text-violet-400',   bg: 'bg-violet-500/5',   border: 'border-violet-500/15' },
    { to: `${prefix}/marketplace`,     icon: ShoppingCart,  label: 'Marketplace',     desc: 'Products & goods',     color: 'text-amber-400',    bg: 'bg-amber-500/5',    border: 'border-amber-500/15' },
    { to: `${prefix}/media`,           icon: Image,         label: 'Media Library',   desc: 'Files & assets',       color: 'text-pink-400',     bg: 'bg-pink-500/5',     border: 'border-pink-500/15' },
    { to: `${prefix}/jobs`,            icon: Briefcase,     label: 'Job Openings',    desc: 'Open positions',       color: 'text-emerald-400',  bg: 'bg-emerald-500/5',  border: 'border-emerald-500/15' },
    { to: `${prefix}/job-applications`,icon: UserCheck,     label: 'Applications',    desc: 'Candidate review',     color: 'text-teal-400',     bg: 'bg-teal-500/5',     border: 'border-teal-500/15' },
    { to: `${prefix}/kb`,              icon: HelpCircle,    label: 'Knowledge Base',  desc: 'Help articles',        color: 'text-cyan-400',     bg: 'bg-cyan-500/5',     border: 'border-cyan-500/15' },
    { to: `${prefix}/career-guides`,   icon: FileText,      label: 'Career Guides',   desc: 'Learning resources',   color: 'text-blue-400',     bg: 'bg-blue-500/5',     border: 'border-blue-500/15' },
    { to: `${prefix}/ads`,             icon: Megaphone,     label: 'Ad Slots',        desc: 'Ad placements',        color: 'text-orange-400',   bg: 'bg-orange-500/5',   border: 'border-orange-500/15' },
    { to: `${prefix}/crm`,             icon: Users,         label: 'Lead CRM',        desc: 'Pipeline & contacts',  color: 'text-emerald-400',  bg: 'bg-emerald-500/5',  border: 'border-emerald-500/15' },
    { to: `${prefix}/lead-gen`,        icon: MapPin,        label: 'Lead Gen',        desc: 'Maps scraper',         color: 'text-green-400',    bg: 'bg-green-500/5',    border: 'border-green-500/15',   badge: 'v2.1' },
    { to: `${prefix}/analytics`,       icon: BarChart2,     label: 'Analytics',       desc: 'Funnel metrics',       color: 'text-indigo-400',   bg: 'bg-indigo-500/5',   border: 'border-indigo-500/15' },
    { to: `${prefix}/support`,         icon: Ticket,        label: 'Support Desk',    desc: 'Customer tickets',     color: 'text-rose-400',     bg: 'bg-rose-500/5',     border: 'border-rose-500/15' },
    { to: `${prefix}/contacts`,        icon: MessageSquare, label: 'Contacts',        desc: 'Enquiry forms',        color: 'text-violet-400',   bg: 'bg-violet-500/5',   border: 'border-violet-500/15' },
    { to: `${prefix}/health`,          icon: Activity,      label: 'System Health',   desc: 'API diagnostics',      color: 'text-slate-400',    bg: 'bg-slate-500/5',    border: 'border-slate-500/15' },
    { to: `${prefix}/settings`,        icon: Settings,      label: 'Settings',        desc: 'Config & integrations',color: 'text-slate-400',    bg: 'bg-slate-500/5',    border: 'border-slate-500/15' },
  ]

  const auditActionColor = (action: string) => {
    if (action?.toLowerCase().includes('insert') || action?.toLowerCase().includes('create')) return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400' }
    if (action?.toLowerCase().includes('update')) return { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: 'text-indigo-400' }
    if (action?.toLowerCase().includes('delete')) return { bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: 'text-rose-400' }
    return { bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: 'text-slate-400' }
  }

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="space-y-5 pb-6 animate-in fade-in duration-500">

      {/* ── Hero Welcome Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1421] via-[#07090f] to-[#080d14] border border-white/[0.07] rounded-2xl p-6">
        {/* Animated blobs */}
        <div className="absolute top-0 right-8 w-72 h-72 bg-emerald-500/6 rounded-full -translate-y-1/2 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-indigo-500/6 rounded-full translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-violet-500/5 rounded-full -translate-y-1/2 blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">SpringWeb Operations Suite</span>
              <span className="h-1 w-1 rounded-full bg-emerald-500/40" />
              <span className="text-[10px] text-slate-600">{todayStr}</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{displayName}</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1.5 max-w-xl">
              Here's your complete platform overview. {metrics.total > 0 ? `${metrics.newCount} new lead${metrics.newCount !== 1 ? 's' : ''} awaiting action.` : 'All systems operational.'}
            </p>
          </div>
          <button
            onClick={loadDashboardStats}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.13] text-xs font-semibold text-slate-300 hover:text-white transition-all disabled:opacity-40"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing…' : 'Refresh All'}
          </button>
        </div>

        {/* Status chips */}
        <div className="relative flex items-center justify-between flex-wrap gap-3 mt-4 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400">LIVE ENGINE</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <Database size={10} className="text-slate-500" />
              <span className="text-[10px] text-slate-400">
                {isSupabaseConfigured ? 'Supabase Connected' : 'Supabase Not Configured'}
              </span>
            </div>
            {metrics.total > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                <Users size={10} className="text-indigo-400" />
                <span className="text-[10px] text-indigo-400">{metrics.total} CRM Leads</span>
              </div>
            )}
            {ticketCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
                <Ticket size={10} className="text-rose-400" />
                <span className="text-[10px] text-rose-400">{ticketCount} Open Tickets</span>
              </div>
            )}
          </div>

          {/* Quick Action Launchpad */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`${prefix}/blog`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300 hover:bg-violet-500/25 text-xs font-bold transition-all shadow-sm shadow-violet-500/10"
            >
              <BookOpen size={13} />
              <span>New Article</span>
            </Link>
            <Link
              to={`${prefix}/lead-gen`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-xs font-bold transition-all shadow-sm shadow-emerald-500/10"
            >
              <MapPin size={13} />
              <span>Maps Scraper</span>
            </Link>
            <Link
              to={`${prefix}/crm`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 text-xs font-bold transition-all shadow-sm shadow-indigo-500/10"
            >
              <Users size={13} />
              <span>Manage Leads</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Supabase not configured */}
      {notConfigured && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
          <AlertTriangle size={16} className="text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300">Supabase is not configured. Connect your database in <Link to={`${prefix}/settings`} className="underline hover:text-amber-200">Settings</Link> to see live data.</p>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard
          title="Pageviews" value={visitorCount}
          icon={Layers} iconColor="text-indigo-400" iconBg="bg-indigo-500/10" glowColor="bg-indigo-500/15"
          sub={visitorCount === 0 ? 'No data yet' : 'All-time events'}
          sparkData={visitorSparkData} sparkColor="#6366f1"
        />
        <StatCard
          title="Total Leads" value={metrics.total}
          icon={Users} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" glowColor="bg-emerald-500/15"
          trend={metrics.newCount > 0 ? { pct: `+${metrics.newCount}`, up: true } : undefined}
          sub={metrics.total === 0 ? 'No leads yet' : `${metrics.newCount} new`}
          sparkData={[metrics.won, metrics.proposal, metrics.qualified, metrics.newCount]}
          sparkColor="#10b981"
        />
        <StatCard
          title="Downloads" value={downloadCount}
          icon={Download} iconColor="text-sky-400" iconBg="bg-sky-500/10" glowColor="bg-sky-500/15"
          sub={downloadCount === 0 ? 'None tracked' : 'Installer events'}
        />
        <StatCard
          title="Revenue (₹)" value={revenue}
          format={n => n === 0 ? '₹0' : `₹${n.toLocaleString('en-IN')}`}
          icon={IndianRupee} iconColor="text-amber-400" iconBg="bg-amber-500/10" glowColor="bg-amber-500/15"
          sub={revenue === 0 ? 'No orders yet' : 'Completed orders'}
        />
        <StatCard
          title="Enquiries" value={contactCount}
          icon={MessageSquare} iconColor="text-violet-400" iconBg="bg-violet-500/10" glowColor="bg-violet-500/15"
          sub={contactCount === 0 ? 'No enquiries' : 'Contact form'}
        />
        <StatCard
          title="Open Tickets" value={ticketCount}
          icon={Ticket} iconColor="text-rose-400" iconBg="bg-rose-500/10" glowColor="bg-rose-500/15"
          trend={ticketCount > 0 ? { pct: `${ticketCount} open`, up: false } : undefined}
          sub={ticketCount === 0 ? '✅ All resolved' : 'Need response'}
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* Pageview Area Chart */}
        <div className="xl:col-span-8 bg-[#07090f] border border-white/[0.07] rounded-2xl p-5">
          <SectionHeader
            title="Pageview Traffic"
            sub="Last 7 days — real data from analytics_pageviews"
            action={
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <span className="h-2 w-2 rounded-full bg-indigo-500" /> Pageviews
              </div>
            }
          />
          {visitorChartData.length === 0 || visitorChartData.every(d => d.visitors === 0) ? (
            <div className="h-52 flex flex-col items-center justify-center gap-2">
              <AlertTriangle size={20} className="text-slate-700" />
              <p className="text-xs text-slate-600">No pageview events in the last 7 days</p>
            </div>
          ) : (
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gPageviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="#374151" tick={{ fill: '#6b7280', fontSize: 10.5 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#374151" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={2} fill="url(#gPageviews)" dot={false} activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Lead Pipeline Horizontal Bar */}
        <div className="xl:col-span-4 bg-[#07090f] border border-white/[0.07] rounded-2xl p-5">
          <SectionHeader title="Lead Pipeline" sub="CRM funnel overview" />
          {metrics.total === 0 ? (
            <div className="h-52 flex flex-col items-center justify-center gap-2">
              <Inbox size={20} className="text-slate-700" />
              <p className="text-xs text-slate-600">No leads in CRM yet</p>
              <Link to={`${prefix}/crm`} className="text-xs text-emerald-500 hover:text-emerald-400 font-semibold flex items-center gap-1">
                Add first lead <ArrowUpRight size={11} />
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5 mt-1">
              {leadPipelineData.map(stage => {
                const pct = metrics.total > 0 ? Math.round((stage.count / metrics.total) * 100) : 0
                return (
                  <div key={stage.name}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400 font-medium">{stage.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{pct}%</span>
                        <span className="font-bold text-white tabular-nums">{stage.count}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: stage.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Module Hub ── */}
      <div className="bg-[#07090f] border border-white/[0.07] rounded-2xl p-5">
        <SectionHeader
          title="Module Hub"
          sub="All 16 admin modules — click to navigate"
          action={
            <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
              <Zap size={10} className="text-emerald-500" />
              <span className="text-emerald-500/70">⌘K to search</span>
            </div>
          }
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2.5">
          {modules.map(mod => (
            <ModuleTile key={mod.to} {...mod} />
          ))}
        </div>
      </div>

      {/* ── Bottom Row: Recent Leads + Activity Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Leads */}
        <div className="bg-[#07090f] border border-white/[0.07] rounded-2xl p-5">
          <SectionHeader
            title="Recent Leads"
            sub="Latest CRM entries"
            action={
              <Link to={`${prefix}/crm`} className="text-[11px] text-emerald-500 hover:text-emerald-400 font-semibold flex items-center gap-1 transition-colors">
                View all <ArrowUpRight size={11} />
              </Link>
            }
          />
          {leads.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Inbox size={24} className="mx-auto text-slate-700" />
              <p className="text-xs text-slate-600">No leads in CRM yet</p>
              <Link to={`${prefix}/lead-gen`} className="inline-flex items-center gap-1 text-xs text-emerald-500 hover:text-emerald-400 font-semibold">
                <MapPin size={11} /> Start scraping leads
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {leads.slice(0, 6).map(lead => {
                const statusStyleMap: Record<string, string> = {
                  won:           'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                  lost:          'bg-rose-500/10 text-rose-400 border-rose-500/20',
                  new:           'bg-sky-500/10 text-sky-400 border-sky-500/20',
                  contacted:     'bg-violet-500/10 text-violet-400 border-violet-500/20',
                  qualified:     'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  proposal:      'bg-orange-500/10 text-orange-400 border-orange-500/20',
                  proposal_sent: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                  negotiation:   'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
                }
                const statusStyle = statusStyleMap[lead.status || 'new'] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'

                return (
                  <div key={lead.id} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0 group hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 border border-white/[0.06] flex items-center justify-center shrink-0">
                      <span className="text-white text-[10px] font-bold uppercase">{lead.name?.[0] || '?'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors">{lead.name}</div>
                      <div className="text-[10px] text-slate-600 truncate">{lead.company || lead.email || 'Individual'}</div>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wide border ${statusStyle}`}>
                      {lead.status}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-[#07090f] border border-white/[0.07] rounded-2xl p-5">
          <SectionHeader
            title="Admin Activity"
            sub="Recent system audit log"
            action={
              <button onClick={loadDashboardStats} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-600 hover:text-slate-300 transition-all">
                <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
              </button>
            }
          />
          {recentAudits.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <CheckCircle2 size={24} className="mx-auto text-slate-700" />
              <p className="text-xs text-slate-600">No audit records yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentAudits.map((audit, idx) => {
                const style = auditActionColor(audit.action)
                return (
                  <div key={idx} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
                    <div className={`h-7 w-7 rounded-lg ${style.bg} border ${style.border} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Activity size={11} className={style.icon} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-slate-300 leading-snug">
                        <span className="font-semibold text-white">{audit.action}</span>
                        {' '}on{' '}
                        <span className="text-emerald-400 font-mono text-[10px]">{audit.table_name}</span>
                      </div>
                      <div className="text-[10px] text-slate-600 mt-0.5 flex items-center gap-1">
                        <Clock size={9} />
                        {relativeTime(audit.created_at)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard
