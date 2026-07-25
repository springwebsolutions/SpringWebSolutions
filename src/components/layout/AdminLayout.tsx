import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import AdminLogin from '@/pages/admin/AdminLogin'
import { 
  LayoutDashboard, FileText, BookOpen, ShoppingBag, 
  Users, Image, Ticket, Settings, ArrowLeft, Loader2, 
  ShieldAlert, HelpCircle, ChevronRight, Bell, LogOut,
  Zap, Globe, Menu, X
} from 'lucide-react'

type NavGroup = {
  label: string
  items: { label: string; href: string; icon: React.ComponentType<any>; badge?: string }[]
}

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, initialized, hasRole, initialize, signOut } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    initialize()
  }, [])

  const isSuiteDomain = typeof window !== 'undefined' && window.location.hostname.toLowerCase().startsWith('suite.')

  // If not logged in on subdomain or admin route, render login component directly at root URL
  if (initialized && !loading && !user) {
    return <AdminLogin />
  }

  // Verify staff roles access
  const isAuthorized = user && (
    hasRole('super_admin') || 
    hasRole('admin') || 
    hasRole('editor') || 
    hasRole('content_writer') || 
    hasRole('sales') || 
    hasRole('support')
  )

  if (loading || !initialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#040509]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center">
              <Zap className="text-emerald-400 animate-pulse" size={28} />
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/30 animate-ping" />
          </div>
          <div className="text-center">
            <div className="text-white font-semibold text-sm">Initializing Operations Suite</div>
            <div className="text-slate-500 text-xs mt-1">Verifying authentication…</div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#040509] px-4">
        <div className="p-10 rounded-3xl bg-white/[0.03] border border-white/8 max-w-md w-full text-center space-y-6 backdrop-blur-xl shadow-2xl shadow-black/60">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <ShieldAlert className="text-rose-400" size={36} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Access Restricted</h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              You don't have the required permissions to access the Administration Dashboard. 
              Contact your Super Administrator for access.
            </p>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-slate-300 hover:text-white transition-all">
            <ArrowLeft size={15} />
            Back to Website
          </Link>
        </div>
      </div>
    )
  }

  const prefix = isSuiteDomain ? '' : '/admin'

  const navGroups: NavGroup[] = [
    {
      label: 'Core',
      items: [
        { label: 'Overview', href: `${prefix}/dashboard`, icon: LayoutDashboard },
      ]
    },
    {
      label: 'Content',
      items: [
        { label: 'Website CMS', href: `${prefix}/content`, icon: Globe },
        { label: 'Blog CMS', href: `${prefix}/blog`, icon: BookOpen },
        { label: 'Knowledge Base', href: `${prefix}/kb`, icon: HelpCircle },
        { label: 'Marketplace', href: `${prefix}/marketplace`, icon: ShoppingBag },
        { label: 'Media Library', href: `${prefix}/media`, icon: Image },
      ]
    },
    {
      label: 'Operations',
      items: [
        { label: 'Lead CRM', href: `${prefix}/crm`, icon: Users },
        { label: 'Support Desk', href: `${prefix}/support`, icon: Ticket },
      ]
    },
    {
      label: 'System',
      items: [
        { label: 'Settings', href: `${prefix}/settings`, icon: Settings },
      ]
    }
  ]

  const currentNavItem = navGroups
    .flatMap(g => g.items)
    .find(n => location.pathname.startsWith(n.href))

  const role = (hasRole('super_admin') ? 'Super Admin' : hasRole('admin') ? 'Admin' : hasRole('editor') ? 'Editor' : hasRole('sales') ? 'Sales' : 'Support')

  const SidebarContent = () => (
    <>
      {/* Logo / Branding */}
      <div className={`flex items-center gap-3 px-5 h-[64px] border-b border-white/[0.06] shrink-0 ${!sidebarOpen && 'justify-center px-0'}`}>
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
          <Zap size={15} className="text-white" />
        </div>
        {sidebarOpen && (
          <div className="min-w-0">
            <div className="font-display font-bold text-white text-sm tracking-tight leading-none">Spring Web</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5 tracking-widest uppercase">Operations Suite</div>
          </div>
        )}
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-3">
        {navGroups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'pt-4' : ''}>
            {sidebarOpen && (
              <div className="px-2 mb-2 text-[9px] font-bold tracking-[0.15em] text-slate-600 uppercase">
                {group.label}
              </div>
            )}
            {!sidebarOpen && gi > 0 && (
              <div className="my-3 border-t border-white/[0.05]" />
            )}
            <div className="space-y-0.5">
              {group.items.map((item, ii) => {
                const Icon = item.icon
                const isActive = location.pathname.startsWith(item.href)
                return (
                  <Link
                    key={ii}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    title={!sidebarOpen ? item.label : undefined}
                    className={`group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-150
                      ${sidebarOpen ? 'px-3 py-2.5' : 'justify-center px-0 py-3 mx-1'}
                      ${isActive
                        ? 'bg-emerald-500/10 text-emerald-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-emerald-400" />
                    )}
                    <Icon size={17} className={isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'} />
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                    {sidebarOpen && isActive && (
                      <ChevronRight size={13} className="ml-auto text-emerald-500/60" />
                    )}
                    {item.badge && sidebarOpen && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">{item.badge}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile footer */}
      <div className={`border-t border-white/[0.06] p-3 shrink-0 ${!sidebarOpen && 'flex flex-col items-center gap-2'}`}>
        {sidebarOpen ? (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-all group cursor-default">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold uppercase">{user?.email?.[0]}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">{user?.email?.split('@')[0]}</div>
              <div className="text-[10px] text-emerald-500 font-medium">{role}</div>
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
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/30 to-indigo-500/30 border border-white/10 flex items-center justify-center" title={user?.email}>
            <span className="text-white text-xs font-bold uppercase">{user?.email?.[0]}</span>
          </div>
        )}
        <Link
          to="/"
          className={`flex items-center gap-2 mt-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-300 hover:bg-white/[0.04] transition-all ${!sidebarOpen && 'justify-center w-9 h-9 mt-0'}`}
          title="Exit to Site"
        >
          <ArrowLeft size={13} />
          {sidebarOpen && <span>Back to Site</span>}
        </Link>
      </div>
    </>
  )

  return (
    <div className="flex h-screen w-screen bg-[#040509] overflow-hidden text-slate-200">
      
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col shrink-0 bg-[#06080f] border-r border-white/[0.06] transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-60' : 'w-[60px]'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed top-0 left-0 h-full z-50 w-72 flex flex-col bg-[#06080f] border-r border-white/[0.06] transition-transform duration-300 ease-in-out lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top Bar */}
        <header className="h-[64px] border-b border-white/[0.06] bg-[#06080f]/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 shrink-0 gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all"
            >
              <Menu size={18} />
            </button>
            
            {/* Desktop collapse toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all"
              title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600 hidden sm:inline">Admin</span>
              {currentNavItem && <>
                <ChevronRight size={13} className="text-slate-700 hidden sm:inline" />
                <span className="font-semibold text-white">{currentNavItem.label}</span>
              </>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-400 tracking-wide">LIVE</span>
            </div>

            {/* Notification bell placeholder */}
            <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all relative">
              <Bell size={16} />
            </button>

            {/* Role badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07]">
              <div className="h-5 w-5 rounded-md bg-gradient-to-br from-emerald-500/40 to-indigo-500/40 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold uppercase">{user?.email?.[0]}</span>
              </div>
              <span className="text-xs font-semibold text-slate-300">{user?.email?.split('@')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-semibold">{role}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 mx-auto max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
