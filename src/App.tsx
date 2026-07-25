import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'

// Public Pages
import DynamicPage from '@/pages/DynamicPage'
import BlogListing from '@/pages/BlogListing'
import BlogPost from '@/pages/BlogPost'
import Marketplace from '@/pages/Marketplace'
import ProductDetail from '@/pages/ProductDetail'
import Contact from '@/pages/Contact'
import Login from '@/pages/Login'
import KBListing from '@/pages/KBListing'
import KBArticle from '@/pages/KBArticle'
import SupportPortal from '@/pages/SupportPortal'
import SupportTicketDetail from '@/pages/SupportTicketDetail'

// Admin Operations Suite Views
import { AdminLayout } from '@/components/layout/AdminLayout'
import AdminLogin from '@/pages/admin/AdminLogin'
import Dashboard from '@/pages/admin/Dashboard'
import ContentManager from '@/pages/admin/ContentManager'
import BlogCMS from '@/pages/admin/BlogCMS'
import MarketplaceCMS from '@/pages/admin/MarketplaceCMS'
import LeadCRM from '@/pages/admin/LeadCRM'
import MediaLibrary from '@/pages/admin/MediaLibrary'
import SiteSettings from '@/pages/admin/SiteSettings'
import KBCMS from '@/pages/admin/KBCMS'
import SupportManager from '@/pages/admin/SupportManager'

const ExternalRedirect: React.FC<{ to: string }> = ({ to }) => {
  useEffect(() => {
    window.location.href = to
  }, [to])
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#040509] text-white text-xs">
      Redirecting to SpringWeb Operations Suite…
    </div>
  )
}

function App() {
  const { initialize } = useAuthStore()
  const { prefetchAllPages } = usePageBuilderStore()

  useEffect(() => {
    initialize()
    prefetchAllPages()
  }, [])

  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : ''
  const isSuiteDomain = hostname.startsWith('suite.')

  // ─── Subdomain Route Router for suite.springwebsolutions.in ────────────────
  if (isSuiteDomain) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="admin/dashboard" element={<Dashboard />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="admin/content" element={<ContentManager />} />
            <Route path="blog" element={<BlogCMS />} />
            <Route path="admin/blog" element={<BlogCMS />} />
            <Route path="kb" element={<KBCMS />} />
            <Route path="admin/kb" element={<KBCMS />} />
            <Route path="marketplace" element={<MarketplaceCMS />} />
            <Route path="admin/marketplace" element={<MarketplaceCMS />} />
            <Route path="crm" element={<LeadCRM />} />
            <Route path="admin/crm" element={<LeadCRM />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="admin/media" element={<MediaLibrary />} />
            <Route path="support" element={<SupportManager />} />
            <Route path="admin/support" element={<SupportManager />} />
            <Route path="settings" element={<SiteSettings />} />
            <Route path="admin/settings" element={<SiteSettings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    )
  }

  // ─── Main Domain Router for springwebsolutions.in & www.springwebsolutions.in ───
  return (
    <Router>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<DynamicPage />} />
        <Route path="/about" element={<DynamicPage />} />
        <Route path="/services" element={<DynamicPage />} />
        <Route path="/industries" element={<DynamicPage />} />
        <Route path="/process" element={<DynamicPage />} />
        <Route path="/contact" element={<Contact />} />

        {/* Blog System */}
        <Route path="/blog" element={<BlogListing />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* Knowledge Base */}
        <Route path="/kb" element={<KBListing />} />
        <Route path="/kb/:slug" element={<KBArticle />} />

        {/* Support Desk */}
        <Route path="/support" element={<SupportPortal />} />
        <Route path="/support/:id" element={<SupportTicketDetail />} />

        {/* Marketplace */}
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:slug" element={<ProductDetail />} />

        {/* Public Client Auth */}
        <Route path="/login" element={<Login />} />
        
        {/* Main Domain /admin -> Redirect to suite subdomain */}
        <Route path="/admin" element={<ExternalRedirect to="https://suite.springwebsolutions.in/" />} />
        <Route path="/admin/*" element={<ExternalRedirect to="https://suite.springwebsolutions.in/" />} />
        <Route path="/setup" element={<Navigate to="/login" replace />} />

        {/* Catch All - Redirect to Homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
