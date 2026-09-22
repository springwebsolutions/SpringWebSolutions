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
  MessageSquare, Send, Sparkles, RefreshCw
} from 'lucide-react'

interface SocialCardPreviewProps {
  job: DiscoveredJob | JobPosting
  onClose?: () => void
}

const PLATFORMS: { key: SocialPlatform; label: string; icon: React.ComponentType<any>; color: string }[] = [
  { key: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon, color: 'text-sky-400 border-sky-500/30' },
  { key: 'instagram', label: 'Instagram', icon: InstagramIcon, color: 'text-pink-400 border-pink-500/30' },
  { key: 'twitter', label: 'Twitter / X', icon: TwitterIcon, color: 'text-zinc-200 border-zinc-500/30' },
  { key: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon, color: 'text-emerald-400 border-emerald-500/30' },
  { key: 'telegram', label: 'Telegram', icon: TelegramIcon, color: 'text-cyan-400 border-cyan-500/30' },
]

export const SocialCardPreview: React.FC<SocialCardPreviewProps> = ({ job, onClose }) => {
  const [activePlatform, setActivePlatform] = useState<SocialPlatform>('linkedin')
  const [dataUrl, setDataUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [copied, setCopied] = useState<boolean>(false)

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
    const title = ('raw_title' in job ? job.raw_title : job.title).toLowerCase().replace(/[^a-z0-9]/g, '-')
    link.download = `job-card-${title}-${activePlatform}.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="bg-[#0b101b] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6 text-white max-w-2xl w-full mx-auto">
      {/* Platform Switcher Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {PLATFORMS.map((p) => {
            const Icon = p.icon
            const isActive = activePlatform === p.key
            return (
              <button
                key={p.key}
                onClick={() => setActivePlatform(p.key)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? `bg-white/15 border ${p.color} text-white shadow-lg`
                    : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={14} className={isActive ? '' : 'text-slate-400'} />
                <span>{p.label}</span>
              </button>
            )
          })}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            Close
          </button>
        )}
      </div>

      {/* Card Preview Display */}
      <div className="relative flex items-center justify-center bg-[#050811] rounded-xl border border-white/10 p-4 overflow-hidden min-h-[260px]">
        {loading ? (
          <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
            <RefreshCw size={20} className="animate-spin text-emerald-400" />
            <span>Rendering high-resolution card…</span>
          </div>
        ) : (
          <img
            src={dataUrl}
            alt="Social Job Card Preview"
            className="max-h-[360px] w-auto object-contain rounded-lg shadow-2xl border border-white/10"
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={handleDownload}
          disabled={loading || !dataUrl}
          className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <Download size={15} />
          <span>Download PNG</span>
        </button>

        <button
          onClick={handleCopyCaption}
          className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={15} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy size={15} />
              <span>Copy Caption</span>
            </>
          )}
        </button>
      </div>

      {/* Caption Preview Textbox */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles size={12} className="text-amber-400" />
          <span>Ready-To-Publish Caption ({activePlatform.toUpperCase()})</span>
        </label>
        <pre className="p-3.5 rounded-xl bg-[#060a12] border border-white/5 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto selection:bg-emerald-500/30 selection:text-emerald-200">
          {caption}
        </pre>
      </div>
    </div>
  )
}
