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
import DownloadCenter from '@/pages/DownloadCenter'
import Contact from '@/pages/Contact'
import Login from '@/pages/Login'
import Setup from '@/pages/Setup'
import KBListing from '@/pages/KBListing'
import KBArticle from '@/pages/KBArticle'
import SupportPortal from '@/pages/SupportPortal'
import SupportTicketDetail from '@/pages/SupportTicketDetail'

// Admin Views
import { AdminLayout } from '@/components/layout/AdminLayout'
import Dashboard from '@/pages/admin/Dashboard'
import ContentManager from '@/pages/admin/ContentManager'
import BlogCMS from '@/pages/admin/BlogCMS'
import MarketplaceCMS from '@/pages/admin/MarketplaceCMS'
import LeadCRM from '@/pages/admin/LeadCRM'
import MediaLibrary from '@/pages/admin/MediaLibrary'
import SiteSettings from '@/pages/admin/SiteSettings'
import KBCMS from '@/pages/admin/KBCMS'
import SupportManager from '@/pages/admin/SupportManager'

function App() {
  const { initialize } = useAuthStore()
  const { prefetchAllPages } = usePageBuilderStore()

  useEffect(() => {
    initialize()
    prefetchAllPages()
  }, [])

  return (
    <Router>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<DynamicPage />} />
        <Route path="/about" element={<DynamicPage />} />
        <Route path="/services" element={<DynamicPage />} />
        <Route path="/pricing" element={<DynamicPage />} />
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

        {/* Marketplace & Download Center */}
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:slug" element={<ProductDetail />} />
        <Route path="/downloads" element={<DownloadCenter />} />

        {/* Auth & Initialization Wizards */}
        <Route path="/login" element={<Login />} />
        <Route path="/setup" element={<Setup />} />

        {/* Protected Control Panel Console Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="blog" element={<BlogCMS />} />
          <Route path="kb" element={<KBCMS />} />
          <Route path="marketplace" element={<MarketplaceCMS />} />
          <Route path="crm" element={<LeadCRM />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="support" element={<SupportManager />} />
          <Route path="settings" element={<SiteSettings />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Catch All - Redirect to Homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
