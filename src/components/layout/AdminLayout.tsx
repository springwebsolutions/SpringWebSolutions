import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import AdminLogin from '@/pages/admin/AdminLogin'
import {
  LayoutDashboard, FileText, BookOpen, ShoppingBag,
  Users, Image, Ticket, Settings, ArrowLeft, Loader2,
  ShieldAlert, HelpCircle, ChevronRight, Bell, LogOut,
  Zap, Globe, Menu, X, MessageSquare, Calendar, Briefcase, Megaphone,
  TrendingUp, Activity, UserCheck, Cpu, Search, Command,
  ChevronDown, RefreshCw, Star, BarChart2, ShoppingCart,
  Database, Layers, MapPin
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

// ─── Types ──────────────────────────────────────────────────────────────────
type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<any>
  badge?: string
  desc?: string
  color?: string
}

type NavGroup = {
  label: string
  icon: React.ComponentType<any>
  items: NavItem[]
}

// ─── All modules for command palette ────────────────────────────────────────
const ALL_MODULES: NavItem[] = [
  { label: 'Dashboard',              href: '/dashboard',        icon: LayoutDashboard, desc: 'Overview & analytics',                  color: 'text-indigo-400' },
  { label: 'Website CMS',            href: '/content',          icon: Globe,           desc: 'Edit site pages & content',            color: 'text-sky-400' },
  { label: 'Blog CMS',               href: '/blog',             icon: BookOpen,        desc: 'Write & publish articles',             color: 'text-violet-400' },
  { label: 'Media Library',          href: '/media',            icon: Image,           desc: 'Images, videos & files',               color: 'text-pink-400' },
  { label: 'Marketplace CMS',        href: '/marketplace',      icon: ShoppingCart,    desc: 'Products & digital goods',             color: 'text-amber-400' },
  { label: 'Job Openings',           href: '/jobs',             icon: Briefcase,       desc: 'Manage job postings',                  color: 'text-emerald-400' },
  { label: 'Candidate Applications', href: '/job-applications', icon: UserCheck,       desc: 'Review applicants',                    color: 'text-teal-400' },
  { label: 'Knowledge Base',         href: '/kb',               icon: HelpCircle,      desc: 'Help articles & guides',               color: 'text-cyan-400' },
  { label: 'Career Guides',          href: '/career-guides',    icon: FileText,        desc: 'Learning resources',                   color: 'text-blue-400' },
  { label: 'Ad Slot Manager',        href: '/ads',              icon: Megaphone,       desc: 'Manage ad placements',                 color: 'text-orange-400' },
  { label: 'Lead CRM',               href: '/crm',              icon: Users,           desc: 'Manage & convert leads',               color: 'text-emerald-400' },
  { label: 'Lead Gen System',        href: '/lead-gen',         icon: MapPin,          desc: 'Google Maps scraper & outreach',       color: 'text-green-400', badge: 'v2.1' },
  { label: 'Lead Analytics',         href: '/analytics',        icon: BarChart2,       desc: 'Pipeline & funnel metrics',            color: 'text-indigo-400' },
  { label: 'Support Desk',           href: '/support',          icon: Ticket,          desc: 'Customer support tickets',             color: 'text-rose-400' },
  { label: 'Contact Submissions',    href: '/contacts',         icon: MessageSquare,   desc: 'Enquiry form responses',               color: 'text-violet-400' },
  { label: 'System Health',          href: '/health',           icon: Activity,        desc: 'API & service diagnostics',            color: 'text-slate-400' },
  { label: 'Site Settings',          href: '/settings',         icon: Settings,        desc: 'Configuration & integrations',         color: 'text-slate-400' },
]

// ─── Command Palette ─────────────────────────────────────────────────────────
const CommandPalette: React.FC<{
  open: boolean
  onClose: () => void
  prefix: string
}> = ({ open, onClose, prefix }) => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const filtered = query.trim()
    ? ALL_MODULES.filter(m =>
        m.label.toLowerCase().includes(query.toLowerCase()) ||
        m.desc?.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_MODULES

  const handleSelect = (href: string) => {
    navigate(`${prefix}${href}`)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[#0c1018]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Jump to module… (type to filter)"
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none"
            onKeyDown={e => {
              if (e.key === 'Escape') onClose()
              if (e.key === 'Enter' && filtered[0]) handleSelect(filtered[0].href)
            }}
          />
          <kbd className="px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.09] text-[10px] text-slate-500 font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-600">No modules match "{query}"</div>
          ) : (
            filtered.map((mod) => {
              const Icon = mod.icon
              return (
                <button
                  key={mod.href}
                  onClick={() => handleSelect(mod.href)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors group text-left"
                >
                  <div className={`h-8 w-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center shrink-0`}>
                    <Icon size={15} className={mod.color || 'text-slate-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{mod.label}</span>
                      {mod.badge && (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-bold">{mod.badge}</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 truncate">{mod.desc}</div>
                  </div>
                  <ChevronRight size={13} className="text-slate-700 group-hover:text-slate-400 transition-colors shrink-0" />
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-white/[0.06] flex items-center gap-4 text-[10px] text-slate-600">
          <span><kbd className="font-mono bg-white/[0.05] px-1 rounded">↵</kbd> Open</span>
          <span><kbd className="font-mono bg-white/[0.05] px-1 rounded">↑↓</kbd> Navigate</span>
          <span><kbd className="font-mono bg-white/[0.05] px-1 rounded">Esc</kbd> Close</span>
          <span className="ml-auto">{filtered.length} modules</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main AdminLayout ─────────────────────────────────────────────────────────
export const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, profile, loading, initialized, mfaRequired, hasRole, initialize, signOut } = useAuthStore()
  const [sidebarOpen, setSidebarOpen]   = useState(true)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false)
  const [currentTime, setCurrentTime]   = useState(new Date())
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
  const [notifCount, setNotifCount]     = useState(0)
  const [notifDetails, setNotifDetails] = useState<{ tickets: number; newLeads: number }>({ tickets: 0, newLeads: 0 })
  const [notifOpen, setNotifOpen]       = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => { initialize() }, [])

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet')
  }, [])

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  // ⌘K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdPaletteOpen(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Click-outside close notif
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Fetch notification counts from Supabase
  const fetchNotifCounts = useCallback(async () => {
    if (!isSupabaseConfigured) return
    try {
      const [{ count: tickets }, { count: newLeads }] = await Promise.all([
        supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      ])
      const t = tickets ?? 0
      const l = newLeads ?? 0
      setNotifDetails({ tickets: t, newLeads: l })
      setNotifCount(t + l)
    } catch {}
  }, [])

  useEffect(() => {
    fetchNotifCounts()
    const interval = setInterval(fetchNotifCounts, 60000)
    return () => clearInterval(interval)
  }, [fetchNotifCounts])

  const isSuiteDomain = typeof window !== 'undefined' && window.location.hostname.toLowerCase().startsWith('suite.')

  if (initialized && !loading && (!user || mfaRequired)) {
    return <AdminLogin initialStep={mfaRequired ? 'totp' : 'credentials'} />
  }

  const isAuthorized = user && (
    hasRole('super_admin') || hasRole('admin') || hasRole('editor') ||
    hasRole('content_writer') || hasRole('sales') || hasRole('support')
  )

  if (loading || !initialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#040509]">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-indigo-500/10 to-transparent border border-emerald-500/20 flex items-center justify-center backdrop-blur-xl">
              <Zap className="text-emerald-400" size={32} />
            </div>
            <div className="absolute inset-0 rounded-3xl border border-emerald-400/20 animate-ping" />
            <div className="absolute -inset-2 rounded-[28px] border border-emerald-400/8 animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <div className="text-white font-bold text-sm tracking-tight">SpringWeb Operations Suite</div>
            <div className="text-slate-500 text-xs">Verifying session…</div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#040509] px-4">
        <div className="p-10 rounded-3xl bg-white/[0.03] border border-white/[0.08] max-w-md w-full text-center space-y-6 backdrop-blur-xl">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <ShieldAlert className="text-rose-400" size={36} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Access Restricted</h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              You don't have permissions to access the Administration Suite.
              Contact your Super Administrator.
            </p>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-slate-300 hover:text-white transition-all">
            <ArrowLeft size={15} /> Back to Website
          </Link>
        </div>
      </div>
    )
  }

  const prefix = isSuiteDomain ? '' : '/admin'

  const navGroups: NavGroup[] = [
    {
      label: 'Main',
      icon: Layers,
      items: [
        { label: 'Overview', href: `${prefix}/dashboard`, icon: LayoutDashboard, desc: 'Control tower & metrics' },
      ]
    },
    {
      label: 'Content Hub',
      icon: FileText,
      items: [
        { label: 'Website CMS', href: `${prefix}/content`, icon: Globe, desc: 'Site pages & content' },
        { label: 'Blog CMS', href: `${prefix}/blog`, icon: BookOpen, desc: 'Articles & posts' },
        { label: 'Marketplace', href: `${prefix}/marketplace`, icon: ShoppingCart, desc: 'Products & goods' },
        { label: 'Media Library', href: `${prefix}/media`, icon: Image, desc: 'Files & assets' },
      ]
    },
    {
      label: 'Growth & Ads',
      icon: Briefcase,
      items: [
        { label: 'Recruitment', href: `${prefix}/jobs`, icon: Briefcase, desc: 'Jobs & applications' },
        { label: 'Knowledge Base', href: `${prefix}/kb`, icon: HelpCircle, desc: 'Help articles & guides' },
        { label: 'Ad Manager', href: `${prefix}/ads`, icon: Megaphone, desc: 'Ad slot placements' },
      ]
    },
    {
      label: 'Sales & Service',
      icon: Users,
      items: [
        { label: 'Lead CRM', href: `${prefix}/crm`, icon: Users, desc: 'Pipeline & contacts' },
        { label: 'Lead Scraper', href: `${prefix}/lead-gen`, icon: MapPin, desc: 'Google Maps lead scraper', badge: 'v2.1' },
        { label: 'Support & Contacts', href: `${prefix}/support`, icon: Ticket, desc: 'Support desk & enquiries' },
      ]
    },
    {
      label: 'System',
      icon: Settings,
      items: [
        { label: 'Settings & Health', href: `${prefix}/settings`, icon: Settings, desc: 'Configuration & diagnostics' },
      ]
    }
  ]

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  const allNavItems = navGroups.flatMap(g => g.items)
  const currentNavItem = allNavItems.find(n => location.pathname === n.href || location.pathname.startsWith(n.href + '/'))

  const displayName = (profile as any)?.full_name || user?.email?.split('@')[0] || 'Admin'
  const role = (
    hasRole('super_admin') ? 'Super Admin' :
    hasRole('admin') ? 'Admin' :
    hasRole('editor') ? 'Editor' :
    hasRole('content_writer') ? 'Writer' :
    hasRole('sales') ? 'Sales' : 'Support'
  )

  // ─── Sidebar Nav Content ───────────────────────────────────────────────────
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 h-[64px] border-b border-white/[0.05] shrink-0 ${!sidebarOpen && 'justify-center px-0'}`}>
        {sidebarOpen ? (
          <Logo size="sm" variant="light" />
        ) : (
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500/30 to-indigo-500/30 border border-emerald-500/20 flex items-center justify-center">
            <Zap size={16} className="text-emerald-400" />
          </div>
        )}
      </div>

      {/* ⌘K Search Trigger */}
      {sidebarOpen && (
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={() => setCmdPaletteOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all group"
          >
            <Search size={13} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
            <span className="flex-1 text-left text-xs text-slate-600 group-hover:text-slate-400 transition-colors">Jump to module…</span>
            <div className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[9px] font-mono text-slate-700">⌘K</kbd>
            </div>
          </button>
        </div>
      )}

      {/* Nav Groups */}
      <nav className="flex-1 py-2 overflow-y-auto px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-white/5">
        {navGroups.map((group) => {
          const isCollapsed = collapsedGroups.has(group.label)
          const GroupIcon = group.icon
          const hasActive = group.items.some(item => location.pathname.startsWith(item.href))

          return (
            <div key={group.label}>
              {/* Group Header */}
              {sidebarOpen ? (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-bold tracking-[0.12em] uppercase transition-all mt-2 mb-0.5 group
                    ${hasActive ? 'text-emerald-500/80' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  <GroupIcon size={11} className={hasActive ? 'text-emerald-500/60' : 'text-slate-700 group-hover:text-slate-500'} />
                  <span className="flex-1 text-left">{group.label}</span>
                  <ChevronDown
                    size={11}
                    className={`transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'} text-slate-700`}
                  />
                </button>
              ) : (
                <div className="my-2 border-t border-white/[0.04]" />
              )}

              {/* Nav Items */}
              {(!isCollapsed || !sidebarOpen) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        title={!sidebarOpen ? item.label : undefined}
                        className={`group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150
                          ${sidebarOpen ? 'px-3 py-2' : 'justify-center px-0 py-2.5 mx-1'}
                          ${isActive
                            ? 'bg-gradient-to-r from-emerald-500/12 to-emerald-500/5 text-emerald-400'
                            : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
                          }`}
                      >
                        {/* Active glow accent */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-emerald-400 shadow-sm shadow-emerald-400/60" />
                        )}
                        <Icon
                          size={16}
                          className={isActive ? 'text-emerald-400' : 'text-slate-600 group-hover:text-slate-300'}
                        />
                        {sidebarOpen && (
                          <>
                            <div className="flex-1 min-w-0">
                              <div className="truncate leading-none">{item.label}</div>
                            </div>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
                                {item.badge}
                              </span>
                            )}
                            {isActive && <ChevronRight size={12} className="ml-auto text-emerald-500/50 shrink-0" />}
                          </>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Profile Footer */}
      <div className={`border-t border-white/[0.05] p-2.5 shrink-0 space-y-1 ${!sidebarOpen && 'flex flex-col items-center'}`}>
        {sidebarOpen ? (
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.08] transition-all group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/40 to-indigo-500/40 border border-white/10 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/10">
              <span className="text-white text-xs font-bold uppercase">{displayName[0]}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate leading-none">{displayName}</div>
              <div className="text-[10px] text-emerald-500 font-medium mt-0.5">{role}</div>
            </div>
            <button
              onClick={() => signOut?.().then(() => navigate('/'))}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center" title={displayName}>
            <span className="text-white text-xs font-bold uppercase">{displayName[0]}</span>
          </div>
        )}

        <Link
          to="/"
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-600 hover:text-slate-300 hover:bg-white/[0.04] transition-all ${!sidebarOpen && 'justify-center w-9 h-9'}`}
          title="Back to Site"
        >
          <ArrowLeft size={12} />
          {sidebarOpen && <span>Back to Site</span>}
        </Link>
      </div>
    </>
  )

  return (
    <div className="flex h-screen w-screen bg-[#030508] overflow-hidden text-slate-200">

      {/* Command Palette */}
      <CommandPalette open={cmdPaletteOpen} onClose={() => setCmdPaletteOpen(false)} prefix={prefix} />

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-[#06080f] border-r border-white/[0.05] transition-all duration-300 ease-in-out relative
          ${sidebarOpen ? 'w-[228px]' : 'w-[56px]'}`}
      >
        {/* Left glow edge */}
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent pointer-events-none" />
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-72 flex flex-col bg-[#06080f] border-r border-white/[0.06] transition-transform duration-300 ease-in-out lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── Top Bar ── */}
        <header className="h-[60px] border-b border-white/[0.05] bg-[#06080f]/90 backdrop-blur-xl flex items-center justify-between px-4 sm:px-5 shrink-0 gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"
            >
              <Menu size={18} />
            </button>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"
              title={sidebarOpen ? 'Collapse' : 'Expand'}
            >
              <Menu size={16} />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline text-slate-700 text-xs font-mono">suite</span>
              {currentNavItem && (
                <>
                  <ChevronRight size={12} className="text-slate-700 hidden sm:inline" />
                  <div className="flex items-center gap-1.5">
                    <currentNavItem.icon size={13} className="text-emerald-400/70" />
                    <span className="font-semibold text-slate-200 text-[13px]">{currentNavItem.label}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* ⌘K palette trigger */}
            <button
              onClick={() => setCmdPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all group"
            >
              <Search size={12} className="text-slate-600 group-hover:text-slate-400" />
              <span className="text-[11px] text-slate-600 group-hover:text-slate-400">Search modules</span>
              <kbd className="ml-1 px-1 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[9px] font-mono text-slate-700">⌘K</kbd>
            </button>

            {/* Live clock */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <Calendar size={11} className="text-slate-600" />
              <span className="text-[11px] text-slate-500 font-mono">
                {currentTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                {' · '}
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>

            {/* Live dot */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider">LIVE</span>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="relative p-2 rounded-lg hover:bg-white/[0.05] text-slate-500 hover:text-white transition-all"
              >
                <Bell size={16} />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 border border-[#06080f] flex items-center justify-center text-[9px] font-bold text-white">
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#0c1018]/95 backdrop-blur-xl border border-white/[0.1] rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/[0.07] flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    <button onClick={fetchNotifCounts} className="p-1 rounded hover:bg-white/5 text-slate-600 hover:text-slate-300 transition-all">
                      <RefreshCw size={11} />
                    </button>
                  </div>
                  <div className="p-2 space-y-1">
                    {notifDetails.newLeads > 0 ? (
                      <Link to={`${prefix}/crm`} onClick={() => setNotifOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-all group">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <Users size={14} className="text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-white">{notifDetails.newLeads} New Lead{notifDetails.newLeads > 1 ? 's' : ''}</div>
                          <div className="text-[10px] text-slate-600">Awaiting review in CRM</div>
                        </div>
                      </Link>
                    ) : null}
                    {notifDetails.tickets > 0 ? (
                      <Link to={`${prefix}/support`} onClick={() => setNotifOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-all group">
                        <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                          <Ticket size={14} className="text-rose-400" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-white">{notifDetails.tickets} Open Ticket{notifDetails.tickets > 1 ? 's' : ''}</div>
                          <div className="text-[10px] text-slate-600">Support desk awaiting response</div>
                        </div>
                      </Link>
                    ) : null}
                    {notifCount === 0 && (
                      <div className="text-center py-6 text-xs text-slate-600">
                        <Star size={20} className="mx-auto mb-2 text-slate-700" />
                        All clear — no pending items
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User chip */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="h-5 w-5 rounded-md bg-gradient-to-br from-emerald-500/50 to-indigo-500/50 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold uppercase">{displayName[0]}</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-300">{displayName}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-bold">{role}</span>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
          <div className="p-4 sm:p-5 lg:p-7 mx-auto max-w-[1600px]">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
