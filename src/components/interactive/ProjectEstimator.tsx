import React, { useState } from 'react'
import { 
  Calculator, Check, MessageSquare, ArrowRight, Sparkles, Clock, 
  ShieldCheck, Smartphone, Globe, Cpu, Layers, DollarSign
} from 'lucide-react'

interface ProjectTier {
  id: string
  name: string
  basePrice: number
  baseDays: number
  icon: any
  desc: string
}

const TIERS: ProjectTier[] = [
  {
    id: 'website',
    name: 'High-Speed Business Website',
    basePrice: 19999,
    baseDays: 5,
    icon: Globe,
    desc: 'Sub-second speed corporate site with SEO, responsive UI & WhatsApp integration.'
  },
  {
    id: 'webapp',
    name: 'Custom React Web Application',
    basePrice: 39999,
    baseDays: 10,
    icon: Cpu,
    desc: 'Full-stack platform with authentication, client dashboard & dynamic database.'
  },
  {
    id: 'crm-erp',
    name: 'Custom CRM & ERP Software',
    basePrice: 59999,
    baseDays: 14,
    icon: Layers,
    desc: 'Multi-user operational software with billing, inventory & automated lead workflows.'
  },
  {
    id: 'mobile-app',
    name: 'Android & iOS Mobile App',
    basePrice: 49999,
    baseDays: 12,
    icon: Smartphone,
    desc: 'Native or Flutter app with offline sync, push notifications & store publishing.'
  }
]

interface Addon {
  id: string
  name: string
  price: number
  extraDays: number
  desc: string
}

const ADDONS: Addon[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Cloud Automation',
    price: 3500,
    extraDays: 1,
    desc: 'Instant lead alert bots, order notifications & customer support handoff'
  },
  {
    id: 'payments',
    name: 'Razorpay / UPI Payment Gateway',
    price: 4500,
    extraDays: 1,
    desc: 'Instant checkout, automated webhook verification & GST invoices'
  },
  {
    id: 'seo',
    name: 'Local SEO & Google Dominance',
    price: 5000,
    extraDays: 2,
    desc: 'Targeted Udumalpet, Pollachi & Tiruppur keyword ranking + schema'
  },
  {
    id: 'bilingual',
    name: 'Tamil & English Dual Language',
    price: 3500,
    extraDays: 1,
    desc: 'Bilingual content localization for regional Tamil Nadu conversion'
  },
  {
    id: 'sla',
    name: 'Annual Maintenance & Cloud AMC',
    price: 9999,
    extraDays: 0,
    desc: '12 months priority 24/7 SLA, weekly backups & speed tuneups'
  }
]

export const ProjectEstimator: React.FC = () => {
  const [selectedTierId, setSelectedTierId] = useState<string>('website')
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['whatsapp', 'seo'])

  const activeTier = TIERS.find(t => t.id === selectedTierId) || TIERS[0]

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Calculation
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const addon = ADDONS.find(a => a.id === id)
    return sum + (addon ? addon.price : 0)
  }, 0)

  const addonsDays = selectedAddons.reduce((sum, id) => {
    const addon = ADDONS.find(a => a.id === id)
    return sum + (addon ? addon.extraDays : 0)
  }, 0)

  const totalPrice = activeTier.basePrice + addonsTotal
  const totalDays = activeTier.baseDays + addonsDays

  // Build WhatsApp Spec Message
  const addonNames = selectedAddons
    .map(id => ADDONS.find(a => a.id === id)?.name)
    .filter(Boolean)
    .join(', ')

  const waMessage = encodeURIComponent(
    `Hello SpringWeb Solutions, I calculated an estimate on your website:\n\n` +
    `• Project Type: ${activeTier.name}\n` +
    `• Selected Add-ons: ${addonNames || 'None'}\n` +
    `• Estimated Budget: ₹${totalPrice.toLocaleString('en-IN')}\n` +
    `• Estimated Timeline: ${totalDays} business days\n\n` +
    `Can we discuss technical architecture and kickstart this?`
  )

  const waUrl = `https://wa.me/918012622119?text=${waMessage}`

  return (
    <div className="p-6 sm:p-10 rounded-3xl border border-white/15 dark:border-white/15 light:border-slate-200 bg-gradient-to-b from-[#080b14]/95 to-slate-950/90 dark:from-[#080b14]/95 dark:to-slate-950/90 light:from-white light:to-slate-50 shadow-2xl dark:shadow-black/50 light:shadow-slate-200/80 backdrop-blur-2xl space-y-8 relative overflow-hidden">
      
      {/* ── Background Highlights ── */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 filter blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 dark:text-emerald-400 light:text-emerald-700 light:bg-emerald-50 light:border-emerald-300 text-[11px] font-bold uppercase tracking-wider font-display">
          <Calculator size={13} /> Interactive Budget &amp; Timeline Estimator
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 font-display">
          Configure Your <span className="text-emerald-400 dark:text-emerald-400 light:text-emerald-700">Custom Project Spec</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 font-light">
          Select your solution tier and desired feature add-ons for an immediate investment and timeline estimate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Tiers & Add-on Checkboxes */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Select Archetype */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-slate-300 light:text-slate-700 font-display">
              1. Choose Solution Archetype
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TIERS.map(tier => {
                const Icon = tier.icon
                const isSelected = tier.id === selectedTierId

                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/40 dark:bg-emerald-950/40 light:bg-emerald-50/80 light:border-emerald-500 shadow-lg shadow-emerald-500/15'
                        : 'border-white/10 dark:border-white/10 light:border-slate-200 bg-white/5 dark:bg-white/5 light:bg-white hover:border-white/20 light:hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 dark:bg-white/5 light:bg-slate-100 text-slate-400 light:text-slate-600'
                      }`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 dark:text-emerald-400 light:text-emerald-700">
                        From ₹{tier.basePrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-white dark:text-white light:text-slate-900 font-display">{tier.name}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 leading-snug mt-0.5">{tier.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Optional Feature Addons */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-slate-300 light:text-slate-700 font-display">
              2. Select Feature Modules &amp; Integrations
            </label>
            <div className="space-y-2.5">
              {ADDONS.map(addon => {
                const isChecked = selectedAddons.includes(addon.id)

                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer ${
                      isChecked
                        ? 'border-emerald-500/40 dark:border-emerald-500/40 light:border-emerald-400 bg-emerald-950/20 dark:bg-emerald-950/20 light:bg-emerald-50/80'
                        : 'border-white/10 dark:border-white/10 light:border-slate-200 bg-white/5 dark:bg-white/5 light:bg-white hover:border-white/20 light:hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-500 text-slate-950 font-bold'
                          : 'border-white/20 dark:border-white/20 light:border-slate-300 bg-transparent'
                      }`}>
                        {isChecked && <Check size={13} strokeWidth={3} />}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-white dark:text-white light:text-slate-900">{addon.name}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 font-light">{addon.desc}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono text-xs text-emerald-400 dark:text-emerald-400 light:text-emerald-700 font-semibold">
                      +₹{addon.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Live Calculation Summary Box */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-emerald-500/30 dark:border-emerald-500/30 light:border-emerald-300 bg-gradient-to-b from-emerald-950/30 via-slate-900/90 to-[#080b14] dark:from-emerald-950/30 dark:via-slate-900/90 dark:to-[#080b14] light:from-emerald-50/80 light:via-white light:to-emerald-50/30 light:shadow-xl space-y-6">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 dark:border-white/10 light:border-slate-200 pb-4">
              <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-400 light:text-slate-500 uppercase">Estimated Budget</span>
              <span className="text-xs font-mono text-emerald-400 dark:text-emerald-400 light:text-emerald-700 font-semibold">Zero Hidden Charges</span>
            </div>

            {/* Big Price Display */}
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white dark:text-white light:text-slate-900 font-display">
                ₹{totalPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-1">
                All inclusive • 100% Full Source Code Ownership
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 space-y-0.5 light:shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono">Sprint Duration</div>
                <div className="text-sm font-bold text-emerald-400 dark:text-emerald-400 light:text-emerald-700 flex items-center gap-1.5 font-display">
                  <Clock size={14} />
                  <span>{totalDays} Business Days</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 space-y-0.5 light:shadow-sm">
                <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 light:text-slate-500 font-mono">Performance SLA</div>
                <div className="text-sm font-bold text-indigo-300 dark:text-indigo-300 light:text-indigo-700 flex items-center gap-1.5 font-display">
                  <ShieldCheck size={14} />
                  <span>&lt; 1s PageSpeed</span>
                </div>
              </div>
            </div>

            {/* Included Guarantees Checklist */}
            <div className="space-y-2 pt-2 text-xs text-slate-300 dark:text-slate-300 light:text-slate-700">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
                <span>Private Live Staging URL throughout development</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
                <span>Zero Bloatware • Clean React / Next.js architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
                <span>Free Cloudflare SSL &amp; Edge CDN setup</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-white/10 dark:border-white/10 light:border-slate-200">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full py-3.5 px-6 font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <MessageSquare size={16} />
              <span>Send Spec to WhatsApp</span>
            </a>

            <div className="text-center">
              <span className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-500">
                Direct chat with engineering lead • Instant response
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default ProjectEstimator
