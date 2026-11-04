import React, { useState, useEffect } from 'react'
import type { DiscoveredJob, JobPosting } from '@/stores/careersStore'
import { generateCardCanvas } from '@/lib/socialCardGenerator'
import { generateJobCaption, type SocialPlatform } from '@/lib/captionGenerator'
import {
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsAppIcon,
  TelegramIcon
} from '@/components/ui/BrandIcons'
import {
  Download, Copy, Check, Share2,
  Sparkles, RefreshCw, X, CheckCircle2
} from 'lucide-react'

interface SocialCardPreviewProps {
  job: DiscoveredJob | JobPosting
  onClose?: () => void
}

const PLATFORMS: { key: SocialPlatform; label: string; resolution: string; icon: React.ComponentType<any>; color: string }[] = [
  { key: 'linkedin', label: 'LinkedIn', resolution: '1200×627', icon: LinkedinIcon, color: 'border-sky-500/40 text-sky-400 bg-sky-500/10' },
  { key: 'instagram', label: 'Instagram', resolution: '1080×1080', icon: InstagramIcon, color: 'border-pink-500/40 text-pink-400 bg-pink-500/10' },
  { key: 'twitter', label: 'Twitter / X', resolution: '1200×675', icon: TwitterIcon, color: 'border-zinc-400/40 text-zinc-200 bg-zinc-500/10' },
  { key: 'whatsapp', label: 'WhatsApp', resolution: '800×800', icon: WhatsAppIcon, color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
  { key: 'telegram', label: 'Telegram', resolution: '800×800', icon: TelegramIcon, color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' },
]

export const SocialCardPreview: React.FC<SocialCardPreviewProps> = ({ job, onClose }) => {
  const [activePlatform, setActivePlatform] = useState<SocialPlatform>('linkedin')
  const [dataUrl, setDataUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [copied, setCopied] = useState<boolean>(false)

  const company = 'raw_company' in job ? job.raw_company : job.company_name
  const title = 'raw_title' in job ? job.raw_title : job.title

  const caption = generateJobCaption(job, activePlatform)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    generateCardCanvas(job, activePlatform).then((url) => {
      if (isMounted) {
        setDataUrl(url)
        setLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [job, activePlatform])

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!dataUrl) return
    const link = document.createElement('a')
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-')
    link.download = `job-card-${sanitizedTitle}-${activePlatform}.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="bg-[#0b101b] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white max-w-2xl w-full mx-auto relative max-h-[92vh] overflow-y-auto">
      {/* Header with Title and Dedicated Top-Right X Close Button */}
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/15 text-emerald-400">
              <Share2 size={16} />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              Share Verified Vacancy
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
              Ready to Publish
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Export official branded social card &amp; compliant caption for <span className="text-white font-semibold">{company}</span>
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 border border-white/5 hover:border-white/20"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Platform Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PLATFORMS.map((p) => {
          const Icon = p.icon
          const isActive = activePlatform === p.key
          return (
            <button
              key={p.key}
              onClick={() => setActivePlatform(p.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? `border ${p.color} text-white shadow-lg`
                  : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={14} className={isActive ? '' : 'text-slate-400'} />
              <span>{p.label}</span>
              <span className="text-[10px] opacity-60 font-mono hidden sm:inline">({p.resolution})</span>
            </button>
          )
        })}
      </div>

      {/* Card Preview Display Viewport */}
      <div className="relative flex items-center justify-center bg-[#050811] rounded-2xl border border-white/10 p-4 sm:p-5 overflow-hidden min-h-[260px] shadow-inner">
        {loading ? (
          <div className="flex flex-col items-center gap-2 text-slate-400 text-xs py-10">
            <RefreshCw size={24} className="animate-spin text-emerald-400" />
            <span className="font-mono text-emerald-400">Generating dynamic high-resolution card…</span>
          </div>
        ) : (
          <img
            src={dataUrl}
            alt="Social Job Card Preview"
            className="max-h-[340px] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
          />
        )}
      </div>

      {/* Action Buttons: Download PNG & Copy Caption */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={handleDownload}
          disabled={loading || !dataUrl}
          className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <Download size={15} />
          <span>Download {PLATFORMS.find(p => p.key === activePlatform)?.label} Card (PNG)</span>
        </button>

        <button
          onClick={handleCopyCaption}
          className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold">Caption Copied!</span>
            </>
          ) : (
            <>
              <Copy size={15} />
              <span>Copy Ready Caption</span>
            </>
          )}
        </button>
      </div>

      {/* Caption Preview Textbox */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles size={12} className="text-amber-400" />
            <span>Ready-To-Publish Caption ({activePlatform.toUpperCase()})</span>
          </label>
          <button
            onClick={handleCopyCaption}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer flex items-center gap-1"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <pre className="p-3.5 rounded-xl bg-[#060a12] border border-white/5 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto selection:bg-emerald-500/30 selection:text-emerald-200">
          {caption}
        </pre>
      </div>
    </div>
  )
}
