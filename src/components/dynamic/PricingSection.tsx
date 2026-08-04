import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Zap, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react'
import { displayRazorpayCheckout } from '@/lib/razorpayService'

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

interface PricingSectionProps {
  content?: {
    title?: string
    subtitle?: string
    plans?: PricingPlan[]
  }
  styling?: any
}

export const PricingSection: React.FC<PricingSectionProps> = ({ content }) => {
  const title = content?.title || "Transparent & Scalable Investment Plans"
  const subtitle = content?.subtitle || "Choose a package designed for your current scale, or initiate a direct milestone deposit via Razorpay."

  const defaultPlans: PricingPlan[] = [
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

  const plans = content?.plans || defaultPlans

  return (
    <section id="pricing" className="py-24 relative bg-[#04060c] border-b border-white/5 transition-colors duration-300 overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-teal-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={14} className="text-emerald-400" />
            <span>Transparent Investment Plans</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight uppercase">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-slate-400 font-sans font-light leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-emerald-500/15 via-[#080d18] to-[#04060c] border-2 border-emerald-500 shadow-2xl shadow-emerald-950/40 -translate-y-2'
                  : 'glass-panel border border-white/10 hover:border-white/20 bg-white/[0.02]'
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
                  <h3 className="font-display text-2xl font-bold text-white tracking-tight">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px] font-light leading-relaxed">{plan.tagline}</p>
                </div>

                <div className="py-3 border-y border-white/10 space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{plan.price}</span>
                    {plan.period && <span className="text-xs text-slate-400 font-medium">/{plan.period}</span>}
                  </div>
                  {plan.price !== "Custom Quote" && (
                    <p className="text-[11px] text-amber-400/90 font-sans leading-tight pt-1">
                      * Extra charges may apply based on domain requirement if requested domain cost exceeds standard expectations.
                    </p>
                  )}
                </div>

                {/* Feature List */}
                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">What's included:</div>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-snug">
                        <span className="h-4 w-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={10} className="text-emerald-400" strokeWidth={3} />
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
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
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
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Pay Deposit via Razorpay</span>
                  <span className="font-mono opacity-80">({plan.price})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom SLA & Trust guarantee bar */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="text-emerald-400" size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">100% Code Ownership &bull; Zero Monthly Lock-ins</div>
              <div className="text-xs text-slate-400">
                All repositories, database assets, and SSL keys belong 100% to your company. 
                <span className="text-amber-400/90 font-medium block mt-0.5">* Note: Extra charges may apply based on domain requirement if requested domain cost exceeds standard expectations.</span>
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
