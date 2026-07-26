import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { useAuthStore } from '@/stores/authStore'
import { Menu, X, Sun, Moon, Lock, User, LogOut, LayoutDashboard } from 'lucide-react'

export const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme, siteConfig, navigation, fetchSettings } = usePageBuilderStore()
  const { user, profile, hasRole, signOut } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const handleNavClick = (e: React.MouseEvent, href: string, label: string) => {
    // Contact link should ALWAYS navigate directly to /contact page
    if (label.toLowerCase() === 'contact' || href === '/contact') {
      setMobileMenuOpen(false)
      return
    }

    const isHomePage = location.pathname === '/' || location.pathname === ''
    const scrollTargetId = label.toLowerCase() === 'home' ? 'home'
      : label.toLowerCase() === 'about' ? 'about'
      : label.toLowerCase() === 'services' ? 'services'
      : null

    if (scrollTargetId) {
      if (isHomePage) {
        e.preventDefault()
        const targetEl = document.getElementById(scrollTargetId)
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } else {
        e.preventDefault()
        navigate('/')
        setTimeout(() => {
          const targetEl = document.getElementById(scrollTargetId)
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' })
          }
        }, 300)
      }
    }
    setMobileMenuOpen(false)
  }

  const rawLinks = navigation?.header_menu || [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Blog', href: '/blog' },
    { label: 'KB', href: '/kb' },
    { label: 'Support', href: '/support' },
    { label: 'Contact', href: '/contact' }
  ]

  const headerLinks = rawLinks.filter((link: any) => {
    const href = (link.href || '').toLowerCase()
    const label = (link.label || '').toLowerCase()
    return (
      href !== '/downloads' && 
      href !== '/pricing' && 
      label !== 'downloads' && 
      label !== 'pricing' &&
      label !== 'download center'
    )
  })

  const companyName = siteConfig?.company_name || 'Spring Web Solutions'

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-[#040509]/90 dark:bg-[#040509]/90 light:bg-white/95 border-white/10 light:border-slate-200 backdrop-blur-md transition-colors duration-300 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">S</span>
              <span className="font-display text-xl font-bold tracking-tight text-white dark:text-white light:text-slate-900">
                {companyName}
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {headerLinks.map((link: any, idx: number) => (
              <Link
                key={idx}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.label)}
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white dark:text-slate-300 dark:hover:text-white light:text-slate-700 light:hover:text-emerald-600 rounded-md transition-colors font-sans"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action Buttons (Auth & Theme Switcher) */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={() => toggleTheme()}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer light:bg-slate-100 light:border-slate-200 light:text-slate-600 light:hover:text-slate-900"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Operations Suite Entry */}
            {user && (hasRole('super_admin') || hasRole('admin') || hasRole('editor') || hasRole('sales') || hasRole('support')) && (
              <a
                href="https://suite.springwebsolutions.in/"
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-brand-emerald hover:text-white transition-all light:bg-slate-100 light:border-slate-200"
                title="Operations Suite"
              >
                <LayoutDashboard size={18} />
              </a>
            )}

            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-300 light:text-slate-600 font-medium">
                  {profile?.full_name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary text-xs flex items-center space-x-1"
              >
                <User size={14} />
                <span>Client Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => toggleTheme()}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 light:text-slate-600"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white light:text-slate-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b bg-brand-obsidian p-4 space-y-3">
          <div className="space-y-1">
            {headerLinks.map((link: any, idx: number) => (
              <Link
                key={idx}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.label)}
                className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white rounded-md light:text-slate-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-white/10 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-1.5 text-slate-300 light:text-slate-600 flex items-center gap-2 text-sm font-medium">
                  <User size={16} />
                  {profile?.full_name || user.email}
                </div>
                {(hasRole('super_admin') || hasRole('admin') || hasRole('editor') || hasRole('sales') || hasRole('support')) && (
                  <a
                    href="https://suite.springwebsolutions.in/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-brand-emerald rounded-md"
                  >
                    Operations Suite
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-rose-500/10 text-rose-500 font-medium"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full text-center block text-sm"
              >
                Client Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
export default Navbar
