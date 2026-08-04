import React, { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { Loader2 } from 'lucide-react'

// Public Website Pages
import DynamicPage from '@/pages/DynamicPage'
import Portfolio from '@/pages/Portfolio'
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

// Careers & Jobs Subdomain Portal
import { CareersHome } from '@/pages/careers/CareersHome'
import { JobListings } from '@/pages/careers/JobListings'
import { JobDetail } from '@/pages/careers/JobDetail'
import { CareerGuideListing } from '@/pages/careers/CareerGuideListing'
import { CareerGuideDetail } from '@/pages/careers/CareerGuideDetail'

import WhatsAppWidget from '@/components/ui/WhatsAppWidget'

// SpringWeb Operations Suite Admin Views (Lazy Loaded for Bundle Optimization)
import { AdminLayout } from '@/components/layout/AdminLayout'
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const ContentManager = lazy(() => import('@/pages/admin/ContentManager'))
const BlogCMS = lazy(() => import('@/pages/admin/BlogCMS'))
const MarketplaceCMS = lazy(() => import('@/pages/admin/MarketplaceCMS'))
const LeadCRM = lazy(() => import('@/pages/admin/LeadCRM'))
const MediaLibrary = lazy(() => import('@/pages/admin/MediaLibrary'))
const SiteSettings = lazy(() => import('@/pages/admin/SiteSettings'))
const KBCMS = lazy(() => import('@/pages/admin/KBCMS'))
const SupportManager = lazy(() => import('@/pages/admin/SupportManager'))
const ContactSubmissions = lazy(() => import('@/pages/admin/ContactSubmissions'))

// Careers & Ads Admin Consoles
const AdminJobPostings = lazy(() => import('@/pages/admin/AdminJobPostings').then(m => ({ default: m.AdminJobPostings })))
const AdminCareerGuides = lazy(() => import('@/pages/admin/AdminCareerGuides').then(m => ({ default: m.AdminCareerGuides })))
const AdminAdManager = lazy(() => import('@/pages/admin/AdminAdManager').then(m => ({ default: m.AdminAdManager })))

const AdminApplications = lazy(() => import('@/pages/admin/AdminApplications').then(m => ({ default: m.AdminApplications })))
const SystemHealth = lazy(() => import('@/pages/admin/SystemHealth').then(m => ({ default: m.SystemHealth })))
const Admin2FASetup = lazy(() => import('@/pages/admin/Admin2FASetup').then(m => ({ default: m.Admin2FASetup })))

const AdminLoader: React.FC = () => (
  <div className="flex h-64 w-full items-center justify-center">
    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
      <Loader2 className="animate-spin" size={18} />
      <span>Loading Module…</span>
    </div>
  </div>
)

const CareersKBRedirect: React.FC = () => {
  useEffect(() => {
    const isProd = typeof window !== 'undefined' && window.location.hostname.includes('springwebsolutions.in')
    const path = window.location.pathname + window.location.search
    if (isProd) {
      window.location.href = `https://careers.springwebsolutions.in${path}`
    } else {
      window.location.href = `https://careers.springwebsolutions.in${path}`
    }
  }, [])
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#040509] text-white text-xs font-mono">
      Redirecting to Knowledge Base on SpringWeb Careers…
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

  const hostname = typeof window !== 'undefined' ? (window.location.hostname || window.location.host || '').toLowerCase() : ''
  const isSuiteDomain = hostname.startsWith('suite.') || hostname.includes('suite.springwebsolutions.in')
  const isCareersDomain = hostname.startsWith('careers.') || hostname.includes('careers.springwebsolutions.in') || hostname.startsWith('jobs.') || hostname.includes('jobs.springwebsolutions.in')

  // Dynamically set noindex, nofollow meta tag on suite subdomain to permanently prevent Google search indexing
  useEffect(() => {
    if (isSuiteDomain) {
      let meta = document.querySelector('meta[name="robots"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'robots')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet')
    }
  }, [isSuiteDomain])

  // Clean URL history if /admin is present in address bar on suite subdomain
  useEffect(() => {
    if (isSuiteDomain && typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
      const cleanPath = window.location.pathname.replace(/\/admin/g, '') || '/'
      window.history.replaceState(null, '', cleanPath)
    }
  }, [isSuiteDomain])

  // ─── Subdomain Router for careers.springwebsolutions.in / jobs.springwebsolutions.in ───
  if (isCareersDomain) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<CareersHome />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:slug" element={<JobDetail />} />
          <Route path="/career-guides" element={<CareerGuideListing />} />
          <Route path="/career-guides/:slug" element={<CareerGuideDetail />} />

          {/* Knowledge Base moved to Careers domain */}
          <Route path="/kb" element={<KBListing />} />
          <Route path="/kb/:slug" element={<KBArticle />} />
          <Route path="/guides" element={<KBListing />} />
          <Route path="/guides/:slug" element={<KBArticle />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    )
  }

  // ─── Subdomain Router for suite.springwebsolutions.in ─────────────────────
  if (isSuiteDomain) {
    return (
      <Router>
        <Suspense fallback={<AdminLoader />}>
          <Routes>
            {/* Explicitly strip /admin or /admin/* on subdomain and force clean root URL */}
            <Route path="/admin" element={<Navigate to="/" replace />} />
            <Route path="/admin/*" element={<Navigate to="/" replace />} />

            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="blog" element={<BlogCMS />} />
              <Route path="kb" element={<KBCMS />} />
              <Route path="marketplace" element={<MarketplaceCMS />} />
              <Route path="jobs" element={<AdminJobPostings />} />
              <Route path="job-applications" element={<AdminApplications />} />
              <Route path="career-guides" element={<AdminCareerGuides />} />
              <Route path="ads" element={<AdminAdManager />} />
              <Route path="crm" element={<LeadCRM />} />
              <Route path="lead-gen" element={<LeadCRM />} />
              <Route path="analytics" element={<LeadCRM />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="support" element={<SupportManager />} />
              <Route path="contacts" element={<ContactSubmissions />} />
              <Route path="health" element={<SystemHealth />} />
              <Route path="settings" element={<SiteSettings />} />
              <Route path="security/2fa" element={<Admin2FASetup />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    )
  }

  const SectionRedirect: React.FC<{ targetId: string }> = ({ targetId }) => {
    useEffect(() => {
      window.location.href = `/#${targetId}`
    }, [targetId])
    return null
  }

  // Main Domain Router for springwebsolutions.in & www.springwebsolutions.in ───
  return (
    <Router>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<DynamicPage />} />
        <Route path="/about" element={<DynamicPage />} />
        <Route path="/services" element={<Navigate to="/#services" replace />} />
        <Route path="/plans" element={<DynamicPage />} />
        <Route path="/pricing" element={<DynamicPage />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />

        {/* Careers & Jobs Subdomain Portal Routes */}
        <Route path="/careers" element={<CareersHome />} />
        <Route path="/jobs" element={<JobListings />} />
        <Route path="/jobs/:slug" element={<JobDetail />} />
        <Route path="/career-guides" element={<CareerGuideListing />} />
        <Route path="/career-guides/:slug" element={<CareerGuideDetail />} />

        {/* Blog System */}
        <Route path="/blog" element={<BlogListing />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* Knowledge Base -> Redirects to careers subdomain */}
        <Route path="/kb" element={<CareersKBRedirect />} />
        <Route path="/kb/*" element={<CareersKBRedirect />} />

        {/* Support Desk */}
        <Route path="/support" element={<SupportPortal />} />
        <Route path="/support/:id" element={<SupportTicketDetail />} />

        {/* Marketplace */}
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:slug" element={<ProductDetail />} />

        {/* Public Client Auth */}
        <Route path="/login" element={<Login />} />

        {/* Catch All - Redirect to Homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <WhatsAppWidget />
    </Router>
  )
}

export default App
