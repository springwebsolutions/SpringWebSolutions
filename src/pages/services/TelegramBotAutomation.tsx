import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import SEOHead from '@/components/seo/SEOHead'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import { 
  Send, Bot, ShieldCheck, CheckCircle2, ArrowRight, Zap, 
  CreditCard, MessageSquare, Smartphone, Sparkles, HelpCircle, 
  Lock, RefreshCw, Terminal, Users, Database, Globe
} from 'lucide-react'

export const TelegramBotAutomation: React.FC = () => {
  const [activeBotTab, setActiveBotTab] = useState<'signals' | 'paywall' | 'miniapp' | 'crm'>('signals')

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': 'Custom Telegram Bot Development & Signal Automation',
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
    'areaServed': ['Global', 'India', 'Tamil Nadu', 'Udumalpet', 'Coimbatore', 'Bangalore', 'Dubai'],
    'description': 'Custom Telegram bots for trading signal auto-forwarders, automated VIP channel paywalls, Razorpay/USDT crypto subscription bots, Telegram Mini Apps, and CRM lead notification systems.'
  }

  const packages = [
    {
      name: 'Starter Telegram Bot',
      price: '₹7,999',
      period: 'one-time',
      desc: 'Ideal for community managers, business inquiries, FAQ automation, and instant alert notifications.',
      features: [
        'Interactive Custom Menu & Inline Buttons',
        'Automated Welcome & FAQ Auto-Responder',
        'Lead Capture & Google Sheets / CRM Sync',
        'Admin Broadcast Messaging Tool',
        '24/7 Cloud Hosting Setup Guide',
        '100% Source Code Ownership (Python / Node.js)'
      ],
      popular: false,
      cta: 'Build Starter Bot'
    },
    {
      name: 'VIP Paywall & Signal Forwarder',
      price: '₹18,999',
      period: 'one-time',
      desc: 'Complete automation for trading educators, signal providers, and paid subscription communities.',
      features: [
        'Automated Signal Scraper & Channel Forwarder',
        'Auto-Formatting with Emojis & TP/SL Target Buttons',
        'Razorpay, Stripe & Crypto (USDT TRC20/BEP20) Paywall',
        'Automated Invite Link Generation on Payment',
        'Auto-Kick / Revoke Access upon Subscription Expiry',
        'Admin Revenue & Subscriber Analytics Dashboard',
        'Zero Transaction Fees (Direct to Your Wallet)'
      ],
      popular: true,
      badge: 'Most Popular',
      cta: 'Build VIP Paywall Bot'
    },
    {
      name: 'Enterprise Mini App & AI Bot',
      price: '₹34,999',
      period: 'one-time',
      desc: 'Full-stack Telegram Mini App (Web App inside Telegram) with AI conversational knowledge base and backend ERP sync.',
      features: [
        'Full React / Next.js Telegram Mini App (TMA)',
        'In-Chat Checkout, E-Commerce & Interactive UI',
        'ChatGPT / Claude AI Custom Knowledge Base Bot',
        'Multi-Tier Affiliate & Referral Commission System',
        'PostgreSQL / Supabase Database Architecture',
        'Dedicated Cloud VPS Deployment & Monitoring SLA'
      ],
      popular: false,
      cta: 'Build Enterprise Mini App'
    }
  ]

  const faqs = [
    {
      q: 'How does the Telegram VIP subscription & paywall bot work?',
      a: 'The bot automatically presents your subscription plans (Monthly, Yearly, Lifetime). When a user pays via Razorpay, UPI, Stripe, or Crypto (USDT TRC20 / BEP20), the bot verifies the payment on blockchain or gateway webhook, generates a unique single-use invite link, and adds the member. When their plan expires, the bot automatically warns them and removes them from the private channel if they do not renew.'
    },
    {
      q: 'How does the Signal Auto-Forwarder bot work for trading channels?',
      a: 'The bot listens to source channels (or private VIP groups), instantly parses signal text (e.g. `BUY GOLD @ 2350 SL 2345 TP 2360`), cleans up spam/links, reformats it with custom brand templates and emojis, and broadcasts it to your destination channel within milliseconds without latency.'
    },
    {
      q: 'Can users pay with Crypto (USDT TRC20/BEP20) directly without middlemen?',
      a: 'Yes! We build direct non-custodial crypto payment verification. The bot generates unique payment addresses or transaction hash verification, confirming USDT/BTC/ETH receipts directly on the blockchain and routing funds straight into your private wallet with 0% platform commissions.'
    },
    {
      q: 'What is a Telegram Mini App (TMA)?',
      a: 'Telegram Mini Apps are modern full-screen web applications (built with React 19 / Next.js) that open seamlessly inside Telegram when a user clicks a menu button. They allow users to browse catalogs, play web3 games, trade, or buy products with native haptic feedback without ever leaving Telegram.'
    },
    {
      q: 'What technology stack is used to build the bots?',
      a: 'We build enterprise Telegram bots using Python (`aiogram 3.x`, `Pyrogram`, `Telethon`) and Node.js (`Telegraf`, `GrammY`), backed by PostgreSQL databases, Redis in-memory caches, and Dockerized cloud VPS deployments for 99.99% continuous uptime.'
    }
  ]

  return (
    <div className="min-h-screen page-bg flex flex-col">
      <SEOHead
        title="Custom Telegram Bot Development & Signal Automation | SpringWeb Solutions"
        description="Engineering custom Telegram bots: VIP subscription paywalls with Razorpay/Crypto USDT, trading signal auto-forwarders, Telegram Mini Apps, and CRM automation bots."
      />
      <Navbar />

      <main className="flex-grow py-12 sm:py-20 relative overflow-hidden">
        <AnimatedBackground accent="indigo" particleCount={22} />

        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 space-y-24 relative z-10">
          
          {/* ── Hero Section ── */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 dark:text-indigo-400 light:text-indigo-700 text-xs font-bold uppercase tracking-widest font-display shadow-lg shadow-indigo-500/10">
              <Send size={15} className="text-indigo-400" />
              <span>Next-Gen Telegram Engineering</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white dark:text-white light:text-slate-900 font-display tracking-tight uppercase leading-tight">
              Custom Telegram Bots &amp;{' '}
              <span className="text-indigo-400 dark:text-indigo-400 light:text-indigo-700 bg-clip-text bg-gradient-to-r from-indigo-400 via-teal-300 to-emerald-400 light:from-indigo-700 light:to-emerald-700">
                VIP Signal Automation
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 dark:text-slate-300 light:text-slate-600 font-sans font-light leading-relaxed max-w-3xl mx-auto">
              Automate paid VIP channel subscriptions, signal copy-forwarding, instant Crypto &amp; Razorpay paywalls, and interactive Telegram Mini Apps. Built with Python &amp; Node.js for 24/7 reliability.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-black text-indigo-400 dark:text-indigo-400 light:text-indigo-700 font-display">0%</div>
                <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono mt-1">Platform Commission</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 dark:text-emerald-400 light:text-emerald-700 font-display">&lt; 50ms</div>
                <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono mt-1">Signal Forward Delay</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-black text-teal-400 dark:text-teal-400 light:text-teal-700 font-display">USDT &amp; UPI</div>
                <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono mt-1">Automated Gateways</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 shadow-xl backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-black text-purple-400 dark:text-purple-400 light:text-purple-700 font-display">100%</div>
                <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono mt-1">Source Code Rights</div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20want%20to%20develop%20a%20custom%20Telegram%20Bot%20%2F%20VIP%20Paywall%20System."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/30 text-sm font-bold py-4 px-8"
              >
                <span>Consult Bot Engineers on WhatsApp</span>
                <ArrowRight size={16} />
              </a>
              <Link
                to="/contact"
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold py-4 px-8 bg-white/10 dark:bg-white/10 light:bg-slate-100 hover:bg-white/20 light:hover:bg-slate-200 text-white dark:text-white light:text-slate-800 border border-white/20 light:border-slate-300 backdrop-blur-md rounded-xl transition-all"
              >
                <span>Request Custom Bot Specs</span>
              </Link>
            </div>
          </div>

          {/* ── Interactive Bot Types / Matrix ── */}
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider font-display">
                <Bot size={14} /> Telegram Solutions Matrix
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white dark:text-white light:text-slate-900 uppercase tracking-tight font-display">
                Engineered For Scalable Telegram Communities
              </h2>
            </div>

            {/* Selector Buttons */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
              {[
                { id: 'signals', label: 'Signal Forwarders & Copiers', icon: Zap },
                { id: 'paywall', label: 'VIP Membership & Crypto Paywalls', icon: CreditCard },
                { id: 'miniapp', label: 'Telegram Mini Apps (WebApps)', icon: Smartphone },
                { id: 'crm', label: 'Lead CRM & Support Bots', icon: MessageSquare }
              ].map(tab => {
                const TabIcon = tab.icon
                const isActive = activeBotTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveBotTab(tab.id as any)}
                    className={`px-5 py-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/25 scale-[1.02]'
                        : 'bg-white/5 dark:bg-white/5 light:bg-white text-slate-300 dark:text-slate-300 light:text-slate-700 border-white/10 dark:border-white/10 light:border-slate-200 hover:border-indigo-500/30'
                    }`}
                  >
                    <TabIcon size={16} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Tab Details Content Card */}
            <div className="p-8 sm:p-12 rounded-3xl border border-white/15 dark:border-white/15 light:border-slate-200 bg-gradient-to-br from-[#080b14]/95 via-slate-900/90 to-indigo-950/20 dark:from-[#080b14]/95 dark:via-slate-900/90 dark:to-indigo-950/20 light:from-white light:via-slate-50 light:to-indigo-50/40 shadow-2xl backdrop-blur-xl">
              {activeBotTab === 'signals' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                      HIGH-SPEED SIGNAL COPIER ENGINE
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 font-display">
                      Instant Signal Scraping &amp; Auto-Forwarding
                    </h3>
                    <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 font-light leading-relaxed">
                      Automatically capture trading signals from master channels, filter out unwanted promotional texts, rebrand with your custom templates &amp; emojis, and broadcast to your private VIP groups in under 50 milliseconds.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {[
                        'Sub-50ms Ultra Low-Latency Scraping',
                        'Custom Template Formatting & Emoji Badges',
                        'Automatic Link & Username Removal Filter',
                        'Auto-Calculate TP1, TP2, TP3 & SL Targets',
                        'Forward to Multiple Destination Channels',
                        'Direct Quotex / MT5 Auto-Execution Bridge'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 dark:text-slate-200 light:text-slate-700">
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/60 border border-emerald-500/30 font-mono text-xs text-emerald-400 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-white/10">
                      <span>TELEGRAM_SIGNAL_ROUTER.log</span>
                      <span className="text-emerald-400">● 42ms LATENCY</span>
                    </div>
                    <div className="text-slate-400">[14:35:10.012] RAW SIGNAL DETECTED: EUR/USD 5M CALL @ 1.0845</div>
                    <div className="text-indigo-300">[14:35:10.028] SANITIZED: Promo links stripped ✓</div>
                    <div className="text-teal-300">[14:35:10.038] TEMPLATE APPLIED: 🚀 VIP ACCURACY SIGNAL</div>
                    <div className="text-emerald-400 font-bold">[14:35:10.054] BROADCAST: Sent to 1,480 VIP Subscribers [SUCCESS]</div>
                  </div>
                </div>
              )}

              {activeBotTab === 'paywall' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold">
                      AUTOMATED SUBSCRIPTION &amp; VIP PAYWALL
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 font-display">
                      Razorpay &amp; Crypto USDT Membership Bot
                    </h3>
                    <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 font-light leading-relaxed">
                      Monetize your trading or content community automatically. Accept payments via UPI, Credit Cards, Razorpay, Stripe, and Crypto (USDT TRC20/BEP20). The bot grants unique invite links and auto-removes users when their subscription ends.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {[
                        'Automated Razorpay & UPI Payment Links',
                        'Direct USDT (TRC20/BEP20) Blockchain Verification',
                        'Single-Use Unique Invite Link Generation',
                        'Automatic Join Request Approval',
                        'Auto-Kick / Ban on Expiry with Renewal Reminders',
                        'Affiliate Commission System for Promoters'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 dark:text-slate-200 light:text-slate-700">
                          <CheckCircle2 size={14} className="text-indigo-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/60 border border-indigo-500/30 font-mono text-xs text-indigo-300 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-white/10">
                      <span>VIP_PAYWALL_GATEWAY</span>
                      <span className="text-indigo-400">● AUTO-PAY ACTIVE</span>
                    </div>
                    <div className="text-slate-400">[PAYMENT] User @alex_trader selected '3-Month VIP ($89 USDT)'</div>
                    <div className="text-teal-300">[BLOCKCHAIN] TxHash verified on TRON Network: 89.00 USDT ✓</div>
                    <div className="text-emerald-400 font-bold">[INVITE] Generated Single-Use Link: t.me/+SpringVIP_8x9a</div>
                    <div className="text-slate-400">[MEMBER] @alex_trader joined VIP Channel (Expires in 90 Days)</div>
                    <div className="text-purple-300">[NOTIFY] Admin credited $89 USDT directly into private wallet</div>
                  </div>
                </div>
              )}

              {activeBotTab === 'miniapp' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold">
                      TELEGRAM MINI APPS (TMA WEBAPPS)
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 font-display">
                      Interactive Web Apps Inside Telegram
                    </h3>
                    <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 font-light leading-relaxed">
                      Build full-screen interactive React web applications running natively inside Telegram chat windows. Perfect for tap-to-earn apps, token claim portals, e-commerce storefronts, and trading interfaces.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {[
                        'React 19 & Tailwind CSS High-Speed UI',
                        'Telegram Cloud Storage & Haptic Feedback API',
                        'TON Wallet & Web3 Crypto Connect',
                        'In-App Storefront & Digital Products Checkout',
                        'Viral Invite & Referral Tracking Engine',
                        'Seamless Full-Screen Mobile Experience'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 dark:text-slate-200 light:text-slate-700">
                          <CheckCircle2 size={14} className="text-teal-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/60 border border-teal-500/30 font-mono text-xs text-teal-300 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-white/10">
                      <span>TELEGRAM_MINI_APP_CORE</span>
                      <span className="text-teal-400">● REACT 19 RUNTIME</span>
                    </div>
                    <div className="text-slate-400">&lt;TelegramWebApp /&gt; mounted inside viewport</div>
                    <div className="text-teal-300">User Telegram ID: 694208119 | Auth: InitData Verified ✓</div>
                    <div className="text-emerald-400 font-bold">In-App Checkout: Digital Strategy Guide Purchased</div>
                    <div className="text-purple-300">TON Wallet connected: EQB4...8f2a (Instant Delivery)</div>
                  </div>
                </div>
              )}

              {activeBotTab === 'crm' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold">
                      24/7 LEAD CRM &amp; AI CHATBOTS
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 font-display">
                      Automated Customer Onboarding &amp; Support
                    </h3>
                    <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 font-light leading-relaxed">
                      Capture high-intent leads 24/7. Our bots answer customer questions, qualify prospect requirements, book consultations, and notify your sales team instantly on Telegram and WhatsApp.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {[
                        'AI-Powered Conversational FAQs (ChatGPT Integration)',
                        'Instant Admin Alert on High-Value Leads',
                        'Automated Meeting Scheduling & Calendar Sync',
                        'Customer Support Ticket Creation & Routing',
                        'Broadcast Segmentation to Tagged Subscribers',
                        'PostgreSQL / Supabase Database Sync'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 dark:text-slate-200 light:text-slate-700">
                          <CheckCircle2 size={14} className="text-purple-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/60 border border-purple-500/30 font-mono text-xs text-purple-300 space-y-3 shadow-inner">
                    <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-white/10">
                      <span>LEAD_CRM_NOTIFIER.py</span>
                      <span className="text-purple-400">● LISTENING</span>
                    </div>
                    <div className="text-slate-400">[INQUIRY] Prospect @rahul_enterprise started onboarding</div>
                    <div className="text-teal-300">[QUALIFIED] Project: Custom ERP Software | Budget: ₹50k+</div>
                    <div className="text-emerald-400 font-bold">[CRM SYNC] Lead logged in Supabase CRM #LEAD-774</div>
                    <div className="text-purple-300">[BROADCAST] Instant WhatsApp & Telegram Alert sent to Founder</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Investment Packages ── */}
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider font-display">
                <Sparkles size={14} /> Transparent Fixed-Price Engineering
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 font-display tracking-tight uppercase">
                Telegram Bot Packages
              </h2>
              <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm sm:text-base font-light">
                Fixed one-time investment with zero recurring commissions. Includes full source code ownership, setup on your Telegram account, and deployment.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {packages.map((pkg, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative ${
                    pkg.popular
                      ? 'bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-[#080b14] border-indigo-500 shadow-2xl shadow-indigo-500/15 scale-[1.03]'
                      : 'bg-[#080b14]/80 dark:bg-[#080b14]/80 light:bg-white border-white/10 dark:border-white/10 light:border-slate-200'
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider font-display shadow-md">
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
                          <CheckCircle2 size={15} className="text-indigo-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <a
                      href={`https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20(${pkg.price})%20Telegram%20Bot.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider font-display flex items-center justify-center gap-2 transition-all shadow-lg ${
                        pkg.popular
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
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

          {/* ── FAQs ── */}
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <HelpCircle size={14} /> Frequently Asked Questions
              </div>
              <h2 className="text-3xl font-black text-white dark:text-white light:text-slate-900 font-display uppercase">
                Telegram Bot FAQs
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 space-y-2 shadow-sm"
                >
                  <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 font-display">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 font-light leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA Banner ── */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-emerald-900/40 border border-indigo-500/30 text-center space-y-6 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
              Ready to Launch Your Telegram Bot?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
              Tell us your desired bot features, payment methods, or signal scraping needs for a quick technical audit and fixed-price quote.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20want%20to%20build%20a%20Custom%20Telegram%20Bot%20%2F%20VIP%20Paywall."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2 py-3.5 px-8 shadow-xl shadow-indigo-500/30 text-xs font-bold uppercase tracking-wider"
              >
                <Send size={15} />
                <span>Start Direct WhatsApp Chat</span>
              </a>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 text-xs font-bold uppercase tracking-wider transition-all"
              >
                Send Requirements via Form
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TelegramBotAutomation
