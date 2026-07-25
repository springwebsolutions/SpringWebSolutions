import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { useAuthStore } from '@/stores/authStore'
import { Menu, X, Sun, Moon, Lock, User, LogOut, LayoutDashboard } from 'lucide-react'

export const Navbar: React.FC = () => {
  const navigate = useNavigate()
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

  const headerLinks = navigation?.header_menu || [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Blog', href: '/blog' },
    { label: 'KB', href: '/kb' },
    { label: 'Support', href: '/support' },
    { label: 'Contact', href: '/contact' }
  ]

  const companyName = siteConfig?.company_name || 'Spring Web Solutions'

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b bg-brand-obsidian/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-emerald to-brand-indigo flex items-center justify-center font-bold text-white shadow-md">S</span>
              <span className="font-display text-xl font-bold tracking-tight text-white dark:text-white light:text-brand-dark">
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
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-md transition-colors light:text-slate-600 light:hover:text-slate-900"
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

            {/* Admin Dashboard Entry */}
            {user && (hasRole('super_admin') || hasRole('admin') || hasRole('editor') || hasRole('sales') || hasRole('support')) && (
              <Link
                to="/admin/dashboard"
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-brand-emerald hover:text-white transition-all light:bg-slate-100 light:border-slate-200"
                title="Admin Dashboard"
              >
                <LayoutDashboard size={18} />
              </Link>
            )}

            {user && (
              <div className="flex items-center space-x-2 border-l border-white/10 pl-3 light:border-slate-200">
                <span className="text-sm font-medium text-slate-300 light:text-slate-600 flex items-center gap-1.5 animate-fade-in-up">
                  <User size={15} />
                  {profile?.full_name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => toggleTheme()}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all light:bg-slate-100 light:border-slate-200"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all light:bg-slate-100 light:border-slate-200"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 light:border-slate-200 bg-brand-obsidian/95 backdrop-blur-lg px-4 py-4 space-y-2">
          {headerLinks.map((link: any, idx: number) => (
            <Link
              key={idx}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white rounded-md transition-colors light:text-slate-600 light:hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Auth Sections */}
          <div className="border-t border-white/10 pt-4 mt-2 light:border-slate-200 space-y-2">
            {user && (
              <>
                <div className="px-3 py-1.5 text-slate-300 light:text-slate-600 flex items-center gap-2 text-sm font-medium">
                  <User size={16} />
                  {profile?.full_name || user.email}
                </div>
                {/* Admin Dashboard */}
                {(hasRole('super_admin') || hasRole('admin') || hasRole('editor') || hasRole('sales') || hasRole('support')) && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-brand-emerald rounded-md"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-rose-500/10 text-rose-500 font-medium"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
