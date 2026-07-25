import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Zap, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react'

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
  const title = content?.title || "Transparent & Scalable Pricing Plans"
  const subtitle = content?.subtitle || "Choose a package designed for your current scale, or request a custom software quotation for bespoke enterprise requirements."

  const defaultPlans: PricingPlan[] = [
    {
      name: "Starter Business",
      tagline: "Essential digital presence for startups & local businesses.",
      price: "₹14,999",
      period: "one-time",
      features: [
        "High-Speed Responsive Website",
        "Modern Glassmorphic / Dark UI",
        "Mobile-First Touch Optimization",
        "On-Page Technical SEO Setup",
        "Contact & Lead Capture Form",
        "1 Month Free Technical Support"
      ],
      ctaText: "Choose Starter",
      ctaHref: "/contact?plan=starter"
    },
    {
      name: "Professional Growth",
      tagline: "Full-scale corporate platform & lead generation engine.",
      price: "₹39,999",
      period: "one-time",
      isPopular: true,
      features: [
        "Everything in Starter Plan",
        "Custom Dynamic CMS & Admin Panel",
        "Blog & Knowledge Base Integration",
        "WhatsApp & Email API Automations",
        "Advanced SEO & Speed Optimization",
        "3 Months Priority Support SLA"
      ],
      ctaText: "Start Professional",
      ctaHref: "/contact?plan=professional"
    },
    {
      name: "Enterprise & Custom Software",
      tagline: "Bespoke SaaS, ERP, CRM, and automated workflow engines.",
      price: "Custom Quote",
      period: "based on scope",
      features: [
        "Custom React / Node / Python Stack",
        "Dedicated Supabase / Postgres DB",
        "Role-Based Access & Security Audit",
        "Custom API & Webhook Infrastructure",
        "Scalable Cloud Deployment (Vercel/AWS)",
        "Dedicated Account Lead & 24/7 SLA"
      ],
      ctaText: "Get Enterprise Quote",
      ctaHref: "/contact?plan=enterprise"
    }
  ]

  const plans = content?.plans || defaultPlans

  return (
    <section id="pricing" className="py-20 relative bg-[#06080f] border-b border-white/5 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo text-xs font-bold uppercase tracking-wider">
            <Zap size={13} strokeWidth={2.5} />
            <span>Investment Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            {title}
          </h2>
          <p className="text-base text-slate-400 font-sans font-light leading-relaxed max-w-2xl mx-auto">
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
                  ? 'bg-gradient-to-b from-brand-indigo/15 via-[#0b101d] to-[#06080f] border-2 border-brand-indigo shadow-2xl shadow-brand-indigo/10 -translate-y-2'
                  : 'glass-panel border border-white/5 hover:border-white/15'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-indigo text-white text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-md">
                  <Sparkles size={12} />
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="py-2 border-y border-white/5">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl sm:text-4xl font-extrabold text-white">{plan.price}</span>
                    {plan.period && <span className="text-xs text-slate-500 font-medium">/{plan.period}</span>}
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">What's included:</div>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-snug">
                        <span className="h-4 w-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={10} className="text-emerald-400" strokeWidth={3} />
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  to={plan.ctaHref}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-xs text-center flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    plan.isPopular
                      ? 'bg-brand-emerald hover:bg-brand-emerald-hover text-white shadow-lg shadow-brand-emerald/20'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom SLA guarantee bar */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="text-emerald-400" size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Need custom milestone payments or SLA retainer?</div>
              <div className="text-xs text-slate-400">We offer flexible milestone-based contracts and monthly maintenance retainers.</div>
            </div>
          </div>
          <Link to="/contact" className="btn-secondary text-xs shrink-0">
            Talk to Solutions Architect
          </Link>
        </div>

      </div>
    </section>
  )
}
export default PricingSection
