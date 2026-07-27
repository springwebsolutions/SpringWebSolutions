import React, { useState } from 'react'
import { useCareersStore } from '@/stores/careersStore'
import type { AdConfig } from '@/stores/careersStore'
import { Megaphone, CheckCircle2, Save, ExternalLink, ShieldCheck, Zap } from 'lucide-react'

export const AdminAdManager: React.FC = () => {
  const { adConfigs, updateAdConfig } = useCareersStore()
  const [selectedZone, setSelectedZone] = useState<AdConfig['zone_id']>('header_leaderboard')

  const currentAd = adConfigs.find(a => a.zone_id === selectedZone) || {
    id: `ad-${selectedZone}`,
    zone_id: selectedZone,
    title: 'Ad Zone',
    ad_type: 'custom_banner' as const,
    adsense_client_id: '',
    adsense_slot_id: '',
    image_url: '',
    target_url: 'https://www.springwebsolutions.in/contact',
    html_code: '',
    is_active: false
  }

  const [form, setForm] = useState<Partial<AdConfig>>(currentAd)

  const handleZoneSelect = (zone: AdConfig['zone_id']) => {
    setSelectedZone(zone)
    const ad = adConfigs.find(a => a.zone_id === zone)
    if (ad) {
      setForm(ad)
    } else {
      setForm({
        zone_id: zone,
        title: 'Ad Zone',
        ad_type: 'custom_banner',
        image_url: '',
        target_url: 'https://www.springwebsolutions.in/contact',
        is_active: false
      })
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateAdConfig(selectedZone, form)
    alert('Ad slot configuration saved successfully!')
  }

  const zones: { id: AdConfig['zone_id']; label: string; desc: string }[] = [
    { id: 'header_leaderboard', label: 'Header Leaderboard Banner', desc: 'Main banner at top of Careers & Job Vault homepage' },
    { id: 'sidebar_rectangle', label: 'Sidebar Medium Rectangle', desc: 'Sticky sidebar unit on Job Listings filter view' },
    { id: 'in_feed_banner', label: 'In-Feed Native Job Banner', desc: 'Promotional banner embedded inside the job listings feed' },
    { id: 'article_bottom', label: 'Career Article Bottom Unit', desc: 'Banner at bottom of Educational Guides & Job Details' }
  ]

  return (
    <div className="space-y-8">
      
      <div className="border-b border-white/5 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-display mb-2">
          <Megaphone size={13} /> Dedicated Subdomain Ad Engine
        </div>
        <h1 className="text-2xl font-black text-white font-display uppercase tracking-tight">
          Ad Slot &amp; Monetization Manager
        </h1>
        <p className="text-xs text-slate-400 font-light mt-1">
          Configure Google AdSense or custom sponsor banners for your Careers Subdomain. Ads render strictly inside the Careers &amp; Jobs Vault and never impact your main agency site.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Zone Selector Column */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Select Ad Placement Zone
          </div>
          {zones.map((zone) => {
            const isSelected = selectedZone === zone.id
            const isLive = adConfigs.find(a => a.zone_id === zone.id)?.is_active
            return (
              <button
                key={zone.id}
                onClick={() => handleZoneSelect(zone.id)}
                className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                    : 'bg-[#080b14] border-white/10 hover:border-white/20 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs font-display">{zone.label}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    isLive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'
                  }`}>
                    {isLive ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-light mt-1">{zone.desc}</div>
              </button>
            )
          })}
        </div>

        {/* Configuration Form Column */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSave} className="p-8 rounded-3xl glass-panel border border-white/10 space-y-6 text-xs">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <div className="text-sm font-bold text-white font-display">
                  Configuring: {zones.find(z => z.id === selectedZone)?.label}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">Zone ID: {selectedZone}</div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active || false}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded bg-white/10 text-emerald-500"
                />
                <span className="font-bold text-slate-200">Enable Ad Slot</span>
              </label>
            </div>

            {/* Ad Type Switcher */}
            <div className="space-y-2">
              <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">Ad Format Type</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, ad_type: 'custom_banner' })}
                  className={`p-3 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                    form.ad_type === 'custom_banner'
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Custom Banner Image
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, ad_type: 'google_adsense' })}
                  className={`p-3 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                    form.ad_type === 'google_adsense'
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Google AdSense
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, ad_type: 'html_code' })}
                  className={`p-3 rounded-xl border font-bold text-xs cursor-pointer transition-all ${
                    form.ad_type === 'html_code'
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Custom HTML / Script
                </button>
              </div>
            </div>

            {/* Custom Banner Fields */}
            {form.ad_type === 'custom_banner' && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Banner Image URL</label>
                  <input
                    type="url"
                    value={form.image_url || ''}
                    onChange={e => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://example.com/banner-728x90.png"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Click Destination URL</label>
                  <input
                    type="url"
                    value={form.target_url || ''}
                    onChange={e => setForm({ ...form, target_url: e.target.value })}
                    placeholder="https://example.com/promotions"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>
            )}

            {/* Google AdSense Fields */}
            {form.ad_type === 'google_adsense' && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Google AdSense Publisher ID (ca-pub-XXX)</label>
                  <input
                    type="text"
                    value={form.adsense_client_id || ''}
                    onChange={e => setForm({ ...form, adsense_client_id: e.target.value })}
                    placeholder="ca-pub-1234567890123456"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Ad Unit Slot ID</label>
                  <input
                    type="text"
                    value={form.adsense_slot_id || ''}
                    onChange={e => setForm({ ...form, adsense_slot_id: e.target.value })}
                    placeholder="9876543210"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* HTML / Script Field */}
            {form.ad_type === 'html_code' && (
              <div className="space-y-2 pt-2">
                <label className="block text-slate-300 font-bold mb-1">Raw HTML / Script Code Snippet</label>
                <textarea
                  rows={4}
                  value={form.html_code || ''}
                  onChange={e => setForm({ ...form, html_code: e.target.value })}
                  placeholder="<script>...</script>"
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs"
                />
              </div>
            )}

            <div className="pt-4 border-t border-white/5 flex items-center justify-end">
              <button
                type="submit"
                className="btn-primary text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} />
                <span>Save Ad Slot Config</span>
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  )
}
