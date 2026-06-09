import React, { useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { 
  LayoutDashboard, FileText, BookOpen, ShoppingBag, 
  Users, Image, Ticket, Settings, ArrowLeft, Loader2, ShieldAlert, HelpCircle
} from 'lucide-react'

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, initialized, hasRole, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    if (initialized && !loading && !user) {
      navigate('/login')
    }
  }, [user, initialized, loading])

  // Verify staff roles access (super_admin, admin, editor, content_writer, sales, support)
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
      <div className="flex h-screen w-screen items-center justify-center bg-brand-obsidian text-brand-emerald">
        <Loader2 className="animate-spin" size={48} />
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-brand-obsidian text-slate-200 px-4">
        <div className="p-8 rounded-2xl glass-panel max-w-md text-center space-y-6">
          <ShieldAlert className="mx-auto text-rose-400" size={64} />
          <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-sm text-slate-400">
            You do not have the required permissions to access the Administration Dashboard control center. Please contact a Super Administrator if this is an error.
          </p>
          <div className="flex justify-center">
            <Link to="/" className="btn-secondary flex items-center gap-1.5 text-sm">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const navItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Website CMS', href: '/admin/content', icon: FileText },
    { label: 'Blog CMS', href: '/admin/blog', icon: BookOpen },
    { label: 'KB CMS', href: '/admin/kb', icon: HelpCircle },
    { label: 'Marketplace CMS', href: '/admin/marketplace', icon: ShoppingBag },
    { label: 'Lead CRM', href: '/admin/crm', icon: Users },
    { label: 'Media Library', href: '/admin/media', icon: Image },
    { label: 'Support Desk', href: '/admin/support', icon: Ticket },
    { label: 'Settings', href: '/admin/settings', icon: Settings }
  ]

  return (
    <div className="flex h-screen w-screen bg-[#04060b] overflow-hidden text-slate-200">
      
      {/* Sidebar Panel */}
      <aside className="w-64 border-r border-white/5 bg-[#070a13] flex flex-col shrink-0">
        
        {/* Header Branding */}
        <div className="h-16 border-b border-white/5 flex items-center px-6 space-x-2">
          <span className="h-7 w-7 rounded-lg bg-gradient-to-tr from-brand-emerald to-brand-indigo flex items-center justify-center font-bold text-xs text-white">S</span>
          <span className="font-display font-bold tracking-tight text-white text-base">Control Center</span>
        </div>

        {/* Sidebar Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item, idx) => {
            const Icon = item.icon
            const isActive = location.pathname.startsWith(item.href)
            return (
              <Link
                key={idx}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-brand-emerald/10 text-brand-emerald border-l-2 border-brand-emerald' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Exit panel link */}
        <div className="p-4 border-t border-white/5">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-white/10 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={16} />
            <span>Exit to Site</span>
          </Link>
        </div>
      </aside>

      {/* Main content grid */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top bar header */}
        <header className="h-16 border-b border-white/5 bg-[#070a13]/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <h2 className="font-display text-lg font-bold text-white">
            {navItems.find(n => location.pathname.startsWith(n.href))?.label || 'Dashboard'}
          </h2>
          
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 font-semibold uppercase tracking-wider">
              {user.email?.split('@')[0]}
            </span>
          </div>
        </header>

        {/* Dynamic Nested View */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#04060b]">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
