import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Zap, Sparkles, ShieldCheck, ArrowRight, Bot, Send, Globe, Layers } from 'lucide-react'
import { displayRazorpayCheckout } from '@/lib/razorpayService'
import TiltSpotlightCard from '../ui/TiltSpotlightCard'
import ProjectEstimator from '../interactive/ProjectEstimator'

interface PricingPlan {
  name: string
  tagline: string
  price: string
  period?: string
  isPopular?: boolean
  features: string[]
  ctaText: string
  ctaHref: string
}

interface PricingCategory {
  id: 'web' | 'trading-bots' | 'telegram-bots'
  label: string
  icon: any
  plans: PricingPlan[]
}

const PRICING_CATEGORIES: PricingCategory[] = [
  {
    id: 'web',
    label: 'Web & Enterprise Software',
    icon: Globe,
    plans: [
      {
        name: "Starter Business",
        tagline: "Essential high-speed digital presence for startups & local brands.",
        price: "₹24,999",
        period: "one-time",
        features: [
          "High-Speed Responsive Website",
          "Modern Glassmorphic Dark UI",
          "Mobile-First Touch Optimization",
          "On-Page Technical SEO Setup",
          "Contact & Lead Capture Form",
          "1 Month Free Technical SLA Support"
        ],
        ctaText: "Choose Starter",
        ctaHref: "/contact?plan=starter"
      },
      {
        name: "Professional Growth",
        tagline: "Full-scale corporate platform, CMS & lead automation engine.",
        price: "₹49,999",
        period: "one-time",
        isPopular: true,
        features: [
          "Everything in Starter Plan",
          "Custom Dynamic CMS & Admin Panel",
          "Blog & Knowledge Base System",
          "WhatsApp & Email API Automations",
          "Advanced SEO & Speed Tuning",
          "3 Months Priority Support SLA"
        ],
        ctaText: "Start Professional",
        ctaHref: "/contact?plan=professional"
      },
      {
        name: "Enterprise Software",
        tagline: "Bespoke SaaS, ERP, CRM, and automated workflow engines.",
        price: "Custom Quote",
        period: "based on scope",
        features: [
          "Custom React / Node / Python Stack",
          "Dedicated Supabase / Postgres DB",
          "Role-Based Access & Security Audit",
          "Custom API & Webhook Architecture",
          "Scalable Cloud Deployment (Vercel/AWS)",
          "Dedicated Account Lead & 24/7 SLA"
        ],
        ctaText: "Get Enterprise Quote",
        ctaHref: "/contact?plan=enterprise"
      }
    ]
  },
  {
    id: 'trading-bots',
    label: 'Trading & Quotex Signal Bots',
    icon: Bot,
    plans: [
      {
        name: "TradingView Webhook Bot",
        tagline: "Bridge custom PineScript alerts directly to broker execution.",
        price: "₹14,999",
        period: "one-time",
        features: [
          "TradingView Webhook Alert Listener",
          "Sub-second order execution engine (<150ms)",
          "Supports Crypto (Binance/Bybit) & Forex",
          "Take-Profit (TP) & Stop-Loss (SL) Automation",
          "Telegram Instant Execution Alerts",
          "Cloud Server Setup (24/7 VPS Uptime)"
        ],
        ctaText: "Build Webhook Bot",
        ctaHref: "/trading-bot-development"
      },
      {
        name: "Quotex & Binary Pro Bot",
        tagline: "Ultra-fast automated execution with payout filters & martingale.",
        price: "₹29,999",
        period: "one-time",
        isPopular: true,
        features: [
          "Direct Quotex / Pocket Option WebSocket API",
          "Sub-80ms Execution Reaction Time",
          "Smart Martingale & Anti-Martingale Rules",
          "Auto Payout Filter (>80% Payout Pairs Only)",
          "Daily Target Profit & Max Loss Auto-Stop",
          "Telegram VIP Signal Scraper & Auto-Trader"
        ],
        ctaText: "Build Quotex Bot",
        ctaHref: "/trading-bot-development"
      },
      {
        name: "Enterprise Master Bot",
        tagline: "Multi-account trade copier, signal server & encrypted license keys.",
        price: "₹59,999",
        period: "one-time",
        features: [
          "Multi-Account Master Trade Copier",
          "Encrypted License Key Generation Engine",
          "MT4 / MT5 MQL5 Bridge & Custom Indicators",
          "Live Web Dashboard with P&L Analytics",
          "Dedicated Telegram Command Console Bot",
          "Priority 24/7 SLA & Free Broker API Updates"
        ],
        ctaText: "Build Master Engine",
        ctaHref: "/trading-bot-development"
      }
    ]
  },
  {
    id: 'telegram-bots',
    label: 'Telegram & Workflow Bots',
    icon: Send,
    plans: [
      {
        name: "Starter Telegram Bot",
        tagline: "Automated community greeting, FAQ auto-responder & CRM lead alerts.",
        price: "₹7,999",
        period: "one-time",
        features: [
          "Interactive Custom Menus & Inline Buttons",
          "Automated Welcome & FAQ Auto-Responder",
          "Lead Capture & CRM Database Sync",
          "Admin Broadcast Messaging Console",
          "24/7 Cloud Hosting Setup Guide",
          "100% Source Code Rights (Python/Node.js)"
        ],
        ctaText: "Build Telegram Bot",
        ctaHref: "/telegram-bot-development"
      },
      {
        name: "VIP Paywall & Signal Bot",
        tagline: "Automated signal forwarding & Razorpay/USDT Crypto VIP subscriptions.",
        price: "₹18,999",
        period: "one-time",
        isPopular: true,
        features: [
          "Automated Signal Scraper & Channel Forwarder",
          "Auto-Formatting with Emojis & TP/SL Buttons",
          "Razorpay, UPI & USDT Crypto Paywall",
          "Automated Single-Use Invite Link Delivery",
          "Auto-Kick / Revoke Access on Expiry",
          "Zero Transaction Fees (Direct to Wallet)"
        ],
        ctaText: "Build VIP Paywall Bot",
        ctaHref: "/telegram-bot-development"
      },
      {
        name: "WhatsApp Business Suite",
        tagline: "Official Meta WhatsApp Cloud API bot with automated invoicing.",
        price: "₹24,999",
        period: "one-time",
        features: [
          "Official Meta WhatsApp Cloud API Setup",
          "Interactive Button Menus & Catalog Order Bot",
          "Automated GST Invoice Dispatch on WhatsApp",
          "Multi-Agent Live Support Handoff Chat",
          "Real-Time CRM Sync & Analytics Dashboard",
          "High Deliverability & Verified Sender"
        ],
        ctaText: "Build WhatsApp Suite",
        ctaHref: "/workflow-automation-bots"
      }
    ]
  }
]

interface PricingSectionProps {
  content?: {
    title?: string
    subtitle?: string
    plans?: PricingPlan[]
  }
  styling?: any
}

export const PricingSection: React.FC<PricingSectionProps> = ({ content }) => {
  const [activeCategory, setActiveCategory] = useState<'web' | 'trading-bots' | 'telegram-bots'>('web')

  const title = content?.title || "Transparent & Scalable Investment Plans"
  const subtitle = content?.subtitle || "Choose a package designed for your current scale, or initiate a direct milestone deposit via Razorpay."

  const currentCategoryData = PRICING_CATEGORIES.find(c => c.id === activeCategory) || PRICING_CATEGORIES[0]
  const plans = currentCategoryData.plans

  return (
    <section id="pricing" className="py-24 relative dark:bg-[#04060c] light:bg-slate-50 border-b dark:border-white/5 light:border-slate-200 transition-colors duration-300 overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 blur-[120px] pointer-events-none rounded-full dark:opacity-100 light:opacity-30" />

      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 space-y-16 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full dark:bg-emerald-500/10 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 light:bg-emerald-100 light:border-emerald-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Transparent Investment Plans</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold dark:text-white light:text-slate-900 font-display tracking-tight uppercase">
            {title}
          </h2>

          <p className="text-sm sm:text-base dark:text-slate-400 light:text-slate-600 font-sans font-light leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* ── Category Switcher ── */}
        <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
          {PRICING_CATEGORIES.map(category => {
            const CatIcon = category.icon
            const isActive = activeCategory === category.id
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                    : 'bg-white/5 dark:bg-white/5 light:bg-white text-slate-300 dark:text-slate-300 light:text-slate-700 border-white/10 dark:border-white/10 light:border-slate-200 hover:border-emerald-500/30'
                }`}
              >
                <CatIcon size={16} />
                <span>{category.label}</span>
              </button>
            )
          })}
        </div>

        {/* Pricing Cards Grid with 3D Tilt & Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((plan, idx) => (
            <TiltSpotlightCard key={idx} className="h-full rounded-3xl">
              <div
                className={`relative rounded-3xl p-8 flex flex-col justify-between h-full transition-all duration-300 ${
                  plan.isPopular
                    ? 'dark:bg-gradient-to-b dark:from-emerald-500/15 dark:via-[#080d18] dark:to-[#04060c] light:bg-gradient-to-b light:from-emerald-500/10 light:via-white light:to-emerald-50/40 border-2 border-emerald-500 shadow-2xl dark:shadow-emerald-950/40 light:shadow-emerald-500/10'
                    : 'dark:glass-panel dark:border-white/10 dark:hover:border-white/20 dark:bg-white/[0.02] light:bg-white light:border-slate-200 light:hover:border-slate-300 light:shadow-lg light:hover:shadow-xl'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-emerald-500/30">
                    <Zap size={12} />
                    <span>Most Popular</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-2xl font-bold dark:text-white light:text-slate-900 tracking-tight">{plan.name}</h3>
                    <p className="text-xs dark:text-slate-400 light:text-slate-600 mt-1 min-h-[32px] font-light leading-relaxed">{plan.tagline}</p>
                  </div>

                  <div className="py-3 border-y dark:border-white/10 light:border-slate-200 space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl sm:text-5xl font-extrabold dark:text-white light:text-slate-900 tracking-tight">{plan.price}</span>
                      {plan.period && <span className="text-xs dark:text-slate-400 light:text-slate-500 font-medium">/{plan.period}</span>}
                    </div>
                    {plan.price !== "Custom Quote" && (
                      <p className="text-[11px] dark:text-amber-400/90 light:text-amber-700 font-sans leading-tight pt-1 font-medium">
                        * Extra charges may apply based on domain requirement if requested domain cost exceeds standard expectations.
                      </p>
                    )}
                  </div>

                  {/* Feature List */}
                  <div className="space-y-3 pt-2">
                    <div className="text-[11px] font-bold dark:text-slate-400 light:text-slate-500 uppercase tracking-wider">What's included:</div>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs dark:text-slate-300 light:text-slate-700 leading-snug">
                          <span className="h-4 w-4 rounded-full dark:bg-emerald-500/20 dark:border-emerald-500/40 light:bg-emerald-100 light:border-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border">
                            <Check size={10} className="text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8 space-y-3">
                  <Link
                    to={plan.ctaHref}
                    className={`w-full py-3 px-6 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      plan.isPopular
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                        : 'dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-white light:bg-slate-100 light:hover:bg-slate-200 light:border-slate-300 light:text-slate-900 border'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight size={14} />
                  </Link>

                  <button
                    onClick={() => {
                      const cleanPrice = parseInt(plan.price.replace(/[^0-9]/g, ''), 10) || 5000
                      displayRazorpayCheckout({
                        amountInRupees: cleanPrice,
                        productName: `${plan.name} Plan Deposit`,
                        productDescription: `Spring Web Solutions — ${plan.name}`,
                        notes: { planName: plan.name }
                      })
                    }}
                    className="w-full py-2.5 px-4 rounded-xl dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400 light:bg-emerald-50 light:hover:bg-emerald-100 light:border-emerald-300 light:text-emerald-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border"
                  >
                    <span>Pay Deposit via Razorpay</span>
                    <span className="font-mono opacity-80">({plan.price})</span>
                  </button>
                </div>
              </div>
            </TiltSpotlightCard>
          ))}
        </div>

        {/* ── Interactive Budget & Timeline Estimator (NavaNala-inspired) ── */}
        <div className="pt-8">
          <ProjectEstimator />
        </div>

        {/* Bottom SLA & Trust guarantee bar */}
        <div className="p-6 rounded-2xl border dark:border-white/10 dark:bg-white/[0.02] light:border-slate-200 light:bg-white light:shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl dark:bg-emerald-500/10 dark:border-emerald-500/20 light:bg-emerald-100 light:border-emerald-200 flex items-center justify-center shrink-0 border">
              <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <div>
              <div className="text-sm font-bold dark:text-white light:text-slate-900">100% Code Ownership &bull; Zero Monthly Lock-ins</div>
              <div className="text-xs dark:text-slate-400 light:text-slate-600">
                All repositories, database assets, and SSL keys belong 100% to your company. 
                <span className="dark:text-amber-400/90 light:text-amber-700 font-medium block mt-0.5">* Note: Extra charges may apply based on domain requirement if requested domain cost exceeds standard expectations.</span>
              </div>
            </div>
          </div>
          <Link to="/contact" className="btn-secondary text-xs shrink-0 py-2.5 px-5">
            Talk to Solutions Architect
          </Link>
        </div>

      </div>
    </section>
  )
}
export default PricingSection
