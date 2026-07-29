import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { useAuthStore } from '@/stores/authStore'
import { Menu, X, Sun, Moon, Lock, User, LogOut, LayoutDashboard } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme, siteConfig, navigation, fetchSettings } = usePageBuilderStore()
  const { user, profile, hasRole, signOut } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const [activeSection, setActiveSection] = useState<string>('home')

  // ─── ScrollSpy IntersectionObserver ─────────────────────────────────────
  useEffect(() => {
    const sectionIds = ['home', 'about', 'services', 'marketplace', 'blog', 'contact']
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.2
    })

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [location.pathname])

  const handleNavClick = (e: React.MouseEvent, href: string, label: string) => {
    const lowerLabel = (label || '').toLowerCase()
    const lowerHref = (href || '').toLowerCase()

    // Direct page navigation for standalone pages
    if (
      lowerLabel === 'contact' || lowerHref === '/contact' ||
      lowerLabel === 'marketplace' || lowerHref === '/marketplace' ||
      lowerLabel === 'blog' || lowerHref === '/blog' ||
      lowerLabel === 'support' || lowerHref === '/support' ||
      lowerLabel === 'kb' || lowerHref === '/kb'
    ) {
      setMobileMenuOpen(false)
      return
    }

    const isHomePage = location.pathname === '/' || location.pathname === ''
    const scrollTargetId = (lowerLabel === 'home' || lowerHref === '/') ? 'home'
      : (lowerLabel === 'about' || lowerHref === '/about') ? 'about'
      : (lowerLabel === 'services' || lowerHref === '/services') ? 'services'
      : null

    if (scrollTargetId) {
      if (isHomePage) {
        const targetEl = document.getElementById(scrollTargetId)
        if (targetEl) {
          e.preventDefault()
          targetEl.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        e.preventDefault()
        navigate(`/#${scrollTargetId}`)
        setTimeout(() => {
          const targetEl = document.getElementById(scrollTargetId)
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' })
          }
        }, 150)
      }
    }
    setMobileMenuOpen(false)
  }

  const rawLinks = navigation?.header_menu || [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
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
    <nav className="sticky top-0 z-50 w-full border-b bg-[#040509]/90 dark:bg-[#040509]/90 light:bg-white/90 border-white/10 light:border-slate-200 backdrop-blur-xl transition-all duration-300 shadow-xl shadow-black/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo size="sm" />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {headerLinks.map((link: any, idx: number) => {
              const lowerLabel = (link.label || '').toLowerCase()
              const lowerHref = (link.href || '').toLowerCase()

              const isSectionActive = activeSection === lowerLabel ||
                (activeSection === 'home' && (lowerLabel === 'home' || lowerHref === '/')) ||
                (activeSection === 'about' && (lowerLabel === 'about' || lowerHref === '/about')) ||
                (activeSection === 'services' && (lowerLabel === 'services' || lowerHref === '/services'))

              const isActive = isSectionActive || location.pathname === link.href ||
                (link.href !== '/' && location.pathname.startsWith(link.href))

              return (
                <Link
                  key={idx}
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.label)}
                  className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all font-display ${
                    isActive
                      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                      : 'text-slate-300 hover:text-white dark:text-slate-300 dark:hover:text-white light:text-slate-700 light:hover:text-emerald-600'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
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
        <div className="md:hidden border-b border-white/10 light:border-slate-200 bg-[#040509]/98 light:bg-white backdrop-blur-xl p-4 space-y-3 shadow-2xl">
          <div className="space-y-1">
            {headerLinks.map((link: any, idx: number) => {
              const isActive = location.pathname === link.href ||
                (link.href !== '/' && location.pathname.startsWith(link.href))
              return (
                <Link
                  key={idx}
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.label)}
                  className={`block px-3 py-2.5 text-base font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 light:text-emerald-600'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 light:text-slate-700 light:hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
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
