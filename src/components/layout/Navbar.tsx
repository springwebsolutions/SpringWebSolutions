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

  // ─── ScrollSpy Window Scroll Listener ────────────────────────────────────
  useEffect(() => {
    let rafId: number | null = null

    const computeActive = () => {
      const isHomePage = location.pathname === '/' || location.pathname === '' || location.pathname === '/about' || location.pathname === '/services'
      if (!isHomePage) return

      const scrollPos = window.scrollY + 140
      const sectionIds = ['home', 'about', 'services', 'marketplace', 'blog', 'contact']
      let current = 'home'

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            current = id
            break
          }
        }
      }

      setActiveSection(current)
    }

    const handleScroll = () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(computeActive)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    computeActive()
    const timer = setTimeout(computeActive, 400)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
      clearTimeout(timer)
    }
  }, [location.pathname])

  const scrollToTarget = (id: string) => {
    const targetEl = document.getElementById(id)
    if (targetEl) {
      const navOffset = 70
      const elementPosition = targetEl.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - navOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const handleNavClick = (e: React.MouseEvent, href: string, label: string) => {
    const lowerLabel = (label || '').toLowerCase()
    const lowerHref = (href || '').toLowerCase()

    // Direct page navigation for standalone pages
    if (
      lowerLabel === 'portfolio' || lowerHref === '/portfolio' ||
      lowerLabel === 'contact' || lowerHref === '/contact' ||
      lowerLabel === 'marketplace' || lowerHref === '/marketplace' ||
      lowerLabel === 'blog' || lowerHref === '/blog' ||
      lowerLabel === 'support' || lowerHref === '/support' ||
      lowerLabel === 'kb' || lowerHref === '/kb'
    ) {
      setMobileMenuOpen(false)
      return
    }

    const isHomePage = location.pathname === '/' || location.pathname === '' || location.pathname === '/about' || location.pathname === '/services'
    const scrollTargetId = (lowerLabel === 'home' || lowerHref === '/') ? 'home'
      : (lowerLabel === 'about' || lowerHref === '/about') ? 'about'
      : (lowerLabel === 'services' || lowerHref === '/services') ? 'services'
      : null

    if (scrollTargetId) {
      if (isHomePage) {
        e.preventDefault()
        scrollToTarget(scrollTargetId)
      } else {
        e.preventDefault()
        navigate('/')
        setTimeout(() => {
          scrollToTarget(scrollTargetId)
        }, 200)
      }
    }
    setMobileMenuOpen(false)
  }

  const baseLinks = (navigation?.header_menu && Array.isArray(navigation.header_menu) && navigation.header_menu.length > 0)
    ? navigation.header_menu
    : [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Blog', href: '/blog' },
        { label: 'KB', href: 'https://careers.springwebsolutions.in/kb' },
        { label: 'Support', href: '/support' },
        { label: 'Contact', href: '/contact' }
      ]

  // Filter out unwanted links (Marketplace, Downloads, Pricing)
  const filteredBaseLinks = baseLinks.filter((link: any) => {
    const href = (link.href || '').toLowerCase()
    const label = (link.label || '').toLowerCase()
    return (
      href !== '/downloads' && 
      href !== '/pricing' && 
      href !== '/marketplace' &&
      label !== 'downloads' && 
      label !== 'pricing' &&
      label !== 'download center' &&
      label !== 'marketplace'
    )
  })

  // Ensure Portfolio is ALWAYS in headerLinks even if DB navigation settings omitted it
  const hasPortfolio = filteredBaseLinks.some((l: any) => (l.href || '').toLowerCase() === '/portfolio' || (l.label || '').toLowerCase() === 'portfolio')
  const headerLinks = hasPortfolio 
    ? filteredBaseLinks 
    : (() => {
        const servicesIdx = filteredBaseLinks.findIndex((l: any) => (l.href || '').toLowerCase() === '/services' || (l.label || '').toLowerCase() === 'services')
        const insertIdx = servicesIdx !== -1 ? servicesIdx + 1 : 3
        const list = [...filteredBaseLinks]
        list.splice(insertIdx, 0, { label: 'Portfolio', href: '/portfolio' })
        return list
      })()

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
              const isHomePage = location.pathname === '/' || location.pathname === '' || location.pathname === '/about' || location.pathname === '/services'

              let isActive = false
              if (isHomePage) {
                if (activeSection === 'home' && (lowerLabel === 'home' || lowerHref === '/')) isActive = true
                else if (activeSection === 'about' && (lowerLabel === 'about' || lowerHref === '/about')) isActive = true
                else if (activeSection === 'services' && (lowerLabel === 'services' || lowerHref === '/services')) isActive = true
                else if (activeSection === lowerLabel) isActive = true
              } else {
                isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href))
              }

              if (link.href.startsWith('http')) {
                return (
                  <a
                    key={idx}
                    href={link.href}
                    className="relative px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl font-display text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </a>
                )
              }

              return (
                <Link
                  key={idx}
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.label)}
                  className="relative px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl font-display"
                  style={{
                    color: isActive ? 'rgb(52,211,153)' : '',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {/* Emerald active box — fades in/out independently via opacity */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(16,185,129,0.4)',
                      background: 'rgba(16,185,129,0.12)',
                      boxShadow: '0 4px 24px 0 rgba(16,185,129,0.15)',
                      opacity: isActive ? 1 : 0,
                      transition: 'opacity 0.35s ease',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Label — inherits color from parent Link */}
                  <span className={`relative z-10 ${isActive ? '' : 'text-slate-300 dark:text-slate-300 light:text-slate-700'}`}>
                    {link.label}
                  </span>
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
              if (link.href.startsWith('http')) {
                return (
                  <a
                    key={idx}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-base font-medium rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-white/5 light:text-slate-700 light:hover:bg-slate-100"
                  >
                    {link.label}
                  </a>
                )
              }
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
