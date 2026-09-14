import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import SEOHead from '@/components/seo/SEOHead'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import { 
  Layers, Zap, MessageSquare, CheckCircle2, ArrowRight, 
  Database, RefreshCw, Smartphone, Sparkles, HelpCircle, 
  FileSpreadsheet, FileText, Send, Lock, Workflow, Globe
} from 'lucide-react'

export const WorkflowAutomationBots: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': 'Business Workflow Automation & Custom WhatsApp Bots',
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Spring Web Solutions',
      'telephone': '+91-80126-22119',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Udumalpet',
        'addressRegion': 'Tamil Nadu',
        'postalCode': '642126',
        'addressCountry': 'IN'
      }
    },
    'areaServed': ['Global', 'India', 'Tamil Nadu', 'Udumalpet', 'Coimbatore', 'Tiruppur', 'Pollachi'],
    'description': 'Custom business workflow automation: WhatsApp Cloud API bots, automated lead webhooks, invoice generation, web scrapers, and database synchronizers.'
  }

  const useCases = [
    {
      title: 'WhatsApp Cloud API Bots',
      desc: 'Official WhatsApp Business API integration with automated catalog browsing, order booking, payment collection, and 24/7 customer support handling.',
      icon: MessageSquare,
      color: 'text-emerald-400',
      badge: 'Official Meta API'
    },
    {
      title: 'Automated Invoicing & Billing',
      desc: 'Automatically generate PDF tax invoices with GST calculation upon order checkout, and dispatch them via WhatsApp and email instantly to clients.',
      icon: FileText,
      color: 'text-indigo-400',
      badge: 'GST Compliant'
    },
    {
      title: 'Multi-System Database Sync',
      desc: 'Keep your Shopify/WooCommerce store, local Windows POS/billing software, and Google Sheets synchronized with real-time webhooks.',
      icon: Database,
      color: 'text-teal-400',
      badge: 'Real-Time Sync'
    },
    {
      title: 'Web Scrapers & Lead Harvesters',
      desc: 'Custom high-speed browser scrapers to harvest B2B contact records, market price fluctuations, and directory leads directly into your CRM.',
      icon: RefreshCw,
      color: 'text-amber-400',
      badge: 'High Accuracy'
    }
  ]

  const packages = [
    {
      name: 'Single Pipeline Automation',
      price: '₹9,999',
      period: 'one-time',
      desc: 'Automate one specific core workflow, such as Lead Capture ➔ WhatsApp Alert ➔ Google Sheets / CRM Sync.',
      features: [
        '1 Dedicated End-to-End Automation Pipeline',
        'WhatsApp / Telegram Instant Alert Notification',
        'Google Sheets / Supabase CRM Database Hook',
        'Webhook Error Handling & Automatic Retries',
        'Setup & Testing on Cloud Server'
      ],
      popular: false,
      cta: 'Automate Single Flow'
    },
    {
      name: 'WhatsApp Cloud Business Suite',
      price: '₹24,999',
      period: 'one-time',
      desc: 'Complete WhatsApp customer engagement bot with interactive quick-reply menus, catalog browsing, and CRM sync.',
      features: [
        'Official Meta WhatsApp Cloud API Setup',
        'Interactive Button Menus & FAQ Automation',
        'Automated Order & Booking Flow with Razorpay UPI',
        'Automated PDF Invoice Dispatch on WhatsApp',
        'Multi-Agent Human Handover Live Chat Portal',
        'Complete Admin Broadcast Console'
      ],
      popular: true,
      badge: 'High ROI',
      cta: 'Build WhatsApp Suite'
    },
    {
      name: 'Enterprise Workflow Core',
      price: '₹44,999',
      period: 'one-time',
      desc: 'Full-scale enterprise process automation connecting your ERP, billing, scrapers, and customer notification channels.',
      features: [
        'Unlimited Webhook Pipelines & Data Mappers',
        'Custom Web Scraper / Lead Extraction Engine',
        'Native Windows POS / Desktop Software Bridge',
        'Automated SMS, Email & WhatsApp Multi-Channel Engine',
        'Custom Analytics Dashboard & Real-Time Event Logs',
        'Priority SLA Support & Maintenance'
      ],
      popular: false,
      cta: 'Build Enterprise Core'
    }
  ]

  return (
    <div className="min-h-screen page-bg flex flex-col">
      <SEOHead
        title="Business Workflow Automation & Custom WhatsApp Bots | SpringWeb Solutions"
        description="Automate repetitive business processes: WhatsApp Cloud API bots, automated PDF invoice generation, multi-system database sync, and high-speed B2B lead scrapers."
      />
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 relative overflow-hidden">
        <AnimatedBackground accent="teal" particleCount={20} />

        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 space-y-24 relative z-10">
          
          {/* ── Hero Section ── */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 dark:text-teal-400 light:text-teal-700 text-xs font-bold uppercase tracking-widest font-display shadow-lg shadow-teal-500/10">
              <Workflow size={15} className="text-teal-400" />
              <span>Zero-Manual-Work Engineering</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white dark:text-white light:text-slate-900 font-display tracking-tight uppercase leading-tight">
              Business Workflow Automation &amp;{' '}
              <span className="text-teal-400 dark:text-teal-400 light:text-teal-700 bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-indigo-400 light:from-teal-700 light:to-indigo-700">
                WhatsApp Cloud Bots
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 dark:text-slate-300 light:text-slate-600 font-sans font-light leading-relaxed max-w-3xl mx-auto">
              Replace repetitive manual tasks with bulletproof automated pipelines. From WhatsApp customer bots to automated GST invoicing and real-time CRM synchronizers.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20want%20to%20automate%20my%20business%20workflows%20%2F%20WhatsApp%20bots."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 shadow-xl shadow-teal-500/30 text-sm font-bold py-4 px-8"
              >
                <span>Discuss Automation on WhatsApp</span>
                <ArrowRight size={16} />
              </a>
              <Link
                to="/contact"
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold py-4 px-8 bg-white/10 dark:bg-white/10 light:bg-slate-100 hover:bg-white/20 light:hover:bg-slate-200 text-white dark:text-white light:text-slate-800 border border-white/20 light:border-slate-300 backdrop-blur-md rounded-xl transition-all"
              >
                <span>Request Custom Automation Audit</span>
              </Link>
            </div>
          </div>

          {/* ── Use Cases Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((uc, i) => {
              const Icon = uc.icon
              return (
                <div
                  key={i}
                  className="p-7 rounded-3xl bg-[#080b14]/80 dark:bg-[#080b14]/80 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 space-y-4 hover:border-teal-500/40 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 flex items-center justify-center ${uc.color}`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                      {uc.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 font-display">
                      {uc.title}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 font-light leading-relaxed">
                      {uc.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Pricing Packages ── */}
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider font-display">
                <Sparkles size={14} /> Fixed-Price Engineering
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 font-display tracking-tight uppercase">
                Workflow Automation Packages
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {packages.map((pkg, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative ${
                    pkg.popular
                      ? 'bg-gradient-to-b from-teal-950/40 via-slate-900/90 to-[#080b14] border-teal-500 shadow-2xl shadow-teal-500/15 scale-[1.03]'
                      : 'bg-[#080b14]/80 dark:bg-[#080b14]/80 light:bg-white border-white/10 dark:border-white/10 light:border-slate-200'
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-teal-500 text-slate-950 text-xs font-bold uppercase tracking-wider font-display shadow-md">
                      {pkg.badge}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900 font-display">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 mt-2 font-sans font-light leading-relaxed">
                        {pkg.desc}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white dark:text-white light:text-slate-900 font-display">
                        {pkg.price}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {pkg.period}
                      </span>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10 dark:border-white/10 light:border-slate-200">
                      {pkg.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
                          <CheckCircle2 size={15} className="text-teal-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <a
                      href={`https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20(${pkg.price})%20Workflow%20Automation.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider font-display flex items-center justify-center gap-2 transition-all shadow-lg ${
                        pkg.popular
                          ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/25'
                          : 'bg-white/10 dark:bg-white/10 light:bg-slate-900 text-white dark:text-white light:text-white hover:bg-white/20'
                      }`}
                    >
                      <span>{pkg.cta}</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default WorkflowAutomationBots
