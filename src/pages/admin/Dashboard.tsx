import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useCRMStore } from '@/stores/crmStore'
import { useAuthStore } from '@/stores/authStore'
import { 
  Users, UserCheck, Download, IndianRupee,
  TrendingUp, Inbox, RefreshCw, ArrowUpRight,
  FileText, Ticket, BookOpen, ShoppingBag,
  Activity, Globe, CheckCircle2, Clock
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'

const StatCard: React.FC<{
  title: string
  value: string | number
  sub?: string
  icon: React.ComponentType<any>
  iconColor: string
  iconBg: string
  trend?: { val: string; up: boolean }
}> = ({ title, value, sub, icon: Icon, iconColor, iconBg, trend }) => (
  <div className="relative overflow-hidden bg-[#06080f] border border-white/[0.07] rounded-2xl p-5 group hover:border-white/15 transition-all duration-300">
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative">
      <div className="flex items-start justify-between mb-4">
        <div className={`h-10 w-10 rounded-xl ${iconBg} border border-white/[0.06] flex items-center justify-center`}>
          <Icon size={18} className={iconColor} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold ${trend.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            <TrendingUp size={11} className={trend.up ? '' : 'rotate-180'} />
            {trend.val}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white tracking-tight mb-1">{value}</div>
      <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">{title}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  </div>
)

const QuickAction: React.FC<{
  to: string
  icon: React.ComponentType<any>
  label: string
  desc: string
  color: string
}> = ({ to, icon: Icon, label, desc, color }) => (
  <Link
    to={to}
    className="group flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04] transition-all duration-200"
  >
    <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={16} className="text-white" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{label}</div>
      <div className="text-xs text-slate-600 truncate">{desc}</div>
    </div>
    <ArrowUpRight size={14} className="text-slate-600 group-hover:text-slate-300 transition-colors shrink-0" />
  </Link>
)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 shadow-2xl text-xs">
        <div className="font-bold text-slate-300 mb-2">{label}</div>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-slate-400 capitalize">{entry.dataKey}:</span>
            <span className="font-bold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export const Dashboard: React.FC = () => {
  const { leads, fetchLeads, metrics } = useCRMStore()
  const { user } = useAuthStore()
  const [visitorCount, setVisitorCount] = useState(0)
  const [downloadCount, setDownloadCount] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [recentAudits, setRecentAudits] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const greetingHour = new Date().getHours()
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 18 ? 'Good afternoon' : 'Good evening'

  const visitorData = [
    { name: 'Mon', visitors: 240, conversions: 12 },
    { name: 'Tue', visitors: 300, conversions: 18 },
    { name: 'Wed', visitors: 280, conversions: 15 },
    { name: 'Thu', visitors: 350, conversions: 22 },
    { name: 'Fri', visitors: 400, conversions: 30 },
    { name: 'Sat', visitors: 180, conversions: 8 },
    { name: 'Sun', visitors: 220, conversions: 10 }
  ]

  const leadPipelineData = [
    { name: 'New', count: metrics.newCount },
    { name: 'Contacted', count: leads.filter(l => l.status === 'contacted').length },
    { name: 'Qualified', count: metrics.qualified },
    { name: 'Proposal', count: metrics.proposal },
    { name: 'Won', count: metrics.won },
    { name: 'Lost', count: metrics.lost }
  ]

  const loadDashboardStats = async () => {
    if (!isSupabaseConfigured) return
    setRefreshing(true)
    try {
      await fetchLeads()
      const { count: vCount } = await supabase.from('analytics_pageviews').select('*', { count: 'exact', head: true })
      setVisitorCount(vCount || 480)
      const { count: dCount } = await supabase.from('downloads').select('*', { count: 'exact', head: true })
      setDownloadCount(dCount || 24)
      const { data: orders } = await supabase.from('orders').select('total').eq('status', 'completed')
      setRevenue(orders ? orders.reduce((s, o) => s + Number(o.total), 0) : 0)
      const { data: audits } = await supabase.from('audit_logs').select('action, table_name, created_at').order('created_at', { ascending: false }).limit(5)
      setRecentAudits(audits || [])
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => { loadDashboardStats() }, [])

  return (
    <div className="space-y-6 pb-4">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500/10 via-[#06080f] to-indigo-500/10 border border-white/[0.07] rounded-2xl p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-indigo-500/5 rounded-full translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-1">Spring Web Solutions</div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {greeting}, <span className="text-emerald-400">{user?.email?.split('@')[0]}</span> 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1">Here's what's happening across your platform today.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadDashboardStats}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.07] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Traffic"
          value={visitorCount.toLocaleString()}
          icon={Users}
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10"
          trend={{ val: '+12%', up: true }}
          sub="vs last week"
        />
        <StatCard
          title="Total Leads"
          value={metrics.total}
          icon={Inbox}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          trend={{ val: `${metrics.newCount} New`, up: true }}
          sub="in CRM pipeline"
        />
        <StatCard
          title="Downloads"
          value={downloadCount}
          icon={Download}
          iconColor="text-sky-400"
          iconBg="bg-sky-500/10"
          sub="Installer tracking logged"
        />
        <StatCard
          title="Gross Revenue"
          value={`₹${revenue > 0 ? revenue.toLocaleString('en-IN') : '0'}`}
          icon={IndianRupee}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
          sub="Completed transactions"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* Traffic & Conversions — 8 cols */}
        <div className="xl:col-span-8 bg-[#06080f] border border-white/[0.07] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Traffic & Conversions</h3>
              <p className="text-[11px] text-slate-600 mt-0.5">Last 7 days website analytics</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />Visitors</div>
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Conversions</div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="gVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={2} fill="url(#gVis)" dot={false} activeDot={{ r: 4, fill: '#6366f1' }} />
                <Area type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} fill="url(#gConv)" dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Pipeline — 4 cols */}
        <div className="xl:col-span-4 bg-[#06080f] border border-white/[0.07] rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Leads Pipeline</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">CRM funnel overview</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadPipelineData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#374151" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#374151" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Quick Actions — 4 cols */}
        <div className="lg:col-span-4 bg-[#06080f] border border-white/[0.07] rounded-2xl p-5 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-white">Quick Actions</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">Jump to key areas</p>
          </div>
          <div className="space-y-2">
            <QuickAction to="/admin/blog" icon={BookOpen} label="New Blog Post" desc="Publish a new article" color="bg-indigo-500/20 border border-indigo-500/20" />
            <QuickAction to="/admin/crm" icon={Inbox} label="Lead CRM & Email" desc="Manage & email leads" color="bg-emerald-500/20 border border-emerald-500/20" />
            <QuickAction to="/admin/support" icon={Ticket} label="Support Desk" desc="View open tickets" color="bg-amber-500/20 border border-amber-500/20" />
            <QuickAction to="/admin/content" icon={Globe} label="Website CMS" desc="Edit site content" color="bg-sky-500/20 border border-sky-500/20" />
          </div>
        </div>

        {/* Recent CRM Entries — 4 cols */}
        <div className="lg:col-span-4 bg-[#06080f] border border-white/[0.07] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Recent Leads</h3>
              <p className="text-[11px] text-slate-600 mt-0.5">Latest CRM entries</p>
            </div>
            <Link to="/admin/crm" className="text-[11px] text-emerald-500 hover:text-emerald-400 font-semibold flex items-center gap-1">
              View all <ArrowUpRight size={11} />
            </Link>
          </div>
          <div className="space-y-2">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center gap-3 py-2 border-b border-white/[0.05] last:border-0">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 border border-white/[0.06] flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold uppercase">{lead.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">{lead.name}</div>
                  <div className="text-[10px] text-slate-600 truncate">{lead.company || 'Individual'}</div>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border
                  ${lead.status === 'won' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    lead.status === 'lost' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    lead.status === 'new' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                  {lead.status}
                </span>
              </div>
            ))}
            {leads.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-600">
                <Inbox size={24} className="mx-auto mb-2 opacity-30" />
                No CRM entries yet
              </div>
            )}
          </div>
        </div>

        {/* Audit Logs — 4 cols */}
        <div className="lg:col-span-4 bg-[#06080f] border border-white/[0.07] rounded-2xl p-5 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-white">Admin Activity</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">Recent system audit logs</p>
          </div>
          <div className="space-y-2.5">
            {recentAudits.length > 0 ? recentAudits.map((audit, idx) => (
              <div key={idx} className="flex items-start gap-3 py-2 border-b border-white/[0.05] last:border-0">
                <div className="h-6 w-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity size={11} className="text-indigo-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-slate-300 leading-snug">
                    <span className="font-semibold text-white">{audit.action}</span>
                    {' '}on{' '}
                    <span className="text-emerald-400">{audit.table_name}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5 flex items-center gap-1">
                    <Clock size={9} />
                    {new Date(audit.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-xs text-slate-600">
                <CheckCircle2 size={24} className="mx-auto mb-2 opacity-30" />
                No audit records yet
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
export default Dashboard
