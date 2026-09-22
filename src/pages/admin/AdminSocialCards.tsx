import React, { useState, useEffect } from 'react'
import { useCareersStore } from '@/stores/careersStore'
import type { DiscoveredJob, SocialCard } from '@/stores/careersStore'
import { Image, Download, Trash2, RefreshCw, Eye, Copy, CheckCircle2, MessageSquare, Send, Sparkles, Loader2 } from 'lucide-react'
import {
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsAppIcon,
  TelegramIcon
} from '@/components/ui/BrandIcons'

const PLATFORM_CONFIG = {
  instagram: { label: 'Instagram', icon: InstagramIcon, color: 'text-pink-400', bg: 'bg-pink-500/20', dims: '1080×1080' },
  linkedin: { label: 'LinkedIn', icon: LinkedinIcon, color: 'text-sky-400', bg: 'bg-sky-500/20', dims: '1200×627' },
  twitter: { label: 'Twitter / X', icon: TwitterIcon, color: 'text-zinc-300', bg: 'bg-zinc-500/20', dims: '1200×675' },
  whatsapp: { label: 'WhatsApp', icon: WhatsAppIcon, color: 'text-emerald-400', bg: 'bg-emerald-500/20', dims: '800×800' },
  telegram: { label: 'Telegram', icon: TelegramIcon, color: 'text-sky-300', bg: 'bg-sky-500/20', dims: '800×800' },
}

const CATEGORY_GRADIENTS: Record<string, string[]> = {
  'Software Engineering': ['#059669', '#0ea5e9'],
  'Mobile App Development': ['#8b5cf6', '#ec4899'],
  'Cloud & Infrastructure': ['#0284c7', '#06b6d4'],
  'Data Science & AI': ['#7c3aed', '#2563eb'],
  'Digital Marketing & SEO': ['#f59e0b', '#ef4444'],
  'Design & Creative': ['#ec4899', '#f97316'],
  'default': ['#10b981', '#3b82f6'],
}

function generateCardCanvas(
  job: DiscoveredJob,
  platform: keyof typeof PLATFORM_CONFIG
): Promise<string> {
  return new Promise((resolve) => {
    const dims = { instagram: [1080, 1080], linkedin: [1200, 627], twitter: [1200, 675], whatsapp: [800, 800], telegram: [800, 800] }
    const [w, h] = dims[platform] || [1080, 1080]
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!

    // Gradient background
    const colors = CATEGORY_GRADIENTS[job.ai_category || ''] || CATEGORY_GRADIENTS.default
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, colors[0])
    gradient.addColorStop(1, colors[1])
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)

    // Overlay pattern
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fillRect(0, 0, w, h)

    // Decorative circles
    ctx.globalAlpha = 0.1
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(w * 0.85, h * 0.15, w * 0.2, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(w * 0.1, h * 0.85, w * 0.15, 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = 1

    const pad = w * 0.08
    const textW = w - pad * 2

    // "WE'RE HIRING" badge
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    const badgeText = '🔥 WE\'RE HIRING'
    ctx.font = `bold ${w * 0.028}px Inter, system-ui, sans-serif`
    const badgeMetrics = ctx.measureText(badgeText)
    const badgeW = badgeMetrics.width + w * 0.04
    const badgeH = h * 0.05
    const badgeX = pad
    const badgeY = pad
    ctx.beginPath()
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, h * 0.015)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.fillText(badgeText, badgeX + w * 0.02, badgeY + badgeH * 0.68)

    // Job Title
    ctx.fillStyle = '#fff'
    ctx.font = `bold ${w * 0.052}px Inter, system-ui, sans-serif`
    const titleY = badgeY + badgeH + h * 0.06
    wrapText(ctx, job.raw_title, pad, titleY, textW, w * 0.065, 3)

    // Company
    const companyY = titleY + h * 0.22
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.font = `600 ${w * 0.032}px Inter, system-ui, sans-serif`
    ctx.fillText(`🏢 ${job.raw_company}`, pad, companyY)

    // Location
    if (job.raw_location) {
      ctx.fillText(`📍 ${job.raw_location}`, pad, companyY + h * 0.06)
    }

    // Salary (SOURCE FACT)
    if (job.raw_salary) {
      ctx.fillStyle = '#fbbf24'
      ctx.font = `bold ${w * 0.036}px Inter, system-ui, sans-serif`
      ctx.fillText(`💰 ${job.raw_salary}`, pad, companyY + h * 0.14)
    }

    // Category tag
    if (job.ai_category) {
      const tagY = h - pad - h * 0.12
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.font = `600 ${w * 0.024}px Inter, system-ui, sans-serif`
      const tagMetrics = ctx.measureText(job.ai_category)
      ctx.beginPath()
      ctx.roundRect(pad, tagY, tagMetrics.width + w * 0.04, h * 0.04, h * 0.01)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.fillText(job.ai_category, pad + w * 0.02, tagY + h * 0.03)
    }

    // Brand footer
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = `500 ${w * 0.022}px Inter, system-ui, sans-serif`
    ctx.fillText('careers.springwebsolutions.in', pad, h - pad)

    // Apply CTA
    ctx.fillStyle = '#fff'
    ctx.font = `bold ${w * 0.026}px Inter, system-ui, sans-serif`
    const ctaText = 'Apply Now →'
    const ctaMetrics = ctx.measureText(ctaText)
    ctx.fillText(ctaText, w - pad - ctaMetrics.width, h - pad)

    resolve(canvas.toDataURL('image/png'))
  })
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number) {
  const words = text.split(' ')
  let line = ''
  let lineNum = 0

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && i > 0) {
      lineNum++
      if (lineNum > maxLines) break
      ctx.fillText(line.trim(), x, y + (lineNum - 1) * lineHeight)
      line = words[i] + ' '
    } else {
      line = testLine
    }
  }
  ctx.fillText(line.trim(), x, y + lineNum * lineHeight)
}

function generateCaption(job: DiscoveredJob, platform: string): string {
  const title = job.raw_title
  const company = job.raw_company
  const location = job.raw_location || 'India'
  const salary = job.raw_salary ? `\n💰 ${job.raw_salary}` : ''
  const category = job.ai_category || ''
  const applyUrl = `https://careers.springwebsolutions.in/jobs`

  const hashtags = [
    '#Hiring', '#Jobs', '#IndiaJobs', '#Careers',
    category ? `#${category.replace(/[^a-zA-Z]/g, '')}` : '',
    '#JobSearch', '#NowHiring', '#SpringWebCareers'
  ].filter(Boolean).join(' ')

  switch (platform) {
    case 'instagram':
      return `🔥 We're Hiring!\n\n📋 ${title}\n🏢 ${company}\n📍 ${location}${salary}\n\n🔗 Apply: Link in bio\n\n${hashtags}`
    case 'linkedin':
      return `🚀 Exciting opportunity!\n\n${title} at ${company}\n📍 ${location}${salary}\n\nApply now: ${applyUrl}\n\n${hashtags}`
    case 'twitter':
      return `🔥 ${title} at ${company} | ${location}${salary ? ` | ${job.raw_salary}` : ''}\n\nApply: ${applyUrl}\n\n${hashtags}`
    case 'whatsapp':
    case 'telegram':
      return `*🔥 Job Alert*\n\n*${title}*\n🏢 ${company}\n📍 ${location}${salary}\n\n🔗 Apply: ${applyUrl}`
    default:
      return `${title} at ${company} - ${location}`
  }
}

export const AdminSocialCards: React.FC = () => {
  const { discoveredJobs, socialCards, fetchDiscoveredJobs, fetchSocialCards, addSocialCard, deleteSocialCard } = useCareersStore()
  const [selectedPlatform, setSelectedPlatform] = useState<keyof typeof PLATFORM_CONFIG>('instagram')
  const [generatedCards, setGeneratedCards] = useState<Map<string, string>>(new Map())
  const [generating, setGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchDiscoveredJobs()
    fetchSocialCards()
  }, [])

  const verifiedJobs = discoveredJobs.filter(j => j.status === 'verified' || j.status === 'published')

  const handleGenerateCard = async (job: DiscoveredJob) => {
    setGenerating(true)
    try {
      const dataUrl = await generateCardCanvas(job, selectedPlatform)
      setGeneratedCards(prev => new Map(prev).set(`${job.id}-${selectedPlatform}`, dataUrl))
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateAll = async () => {
    setGenerating(true)
    for (const job of verifiedJobs.slice(0, 20)) {
      const dataUrl = await generateCardCanvas(job, selectedPlatform)
      setGeneratedCards(prev => new Map(prev).set(`${job.id}-${selectedPlatform}`, dataUrl))
    }
    setGenerating(false)
  }

  const handleDownload = (jobId: string, jobTitle: string) => {
    const dataUrl = generatedCards.get(`${jobId}-${selectedPlatform}`)
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `${jobTitle.replace(/[^a-z0-9]/gi, '_').substring(0, 40)}_${selectedPlatform}.png`
    a.click()
  }

  const handleCopyCaption = (job: DiscoveredJob) => {
    const caption = generateCaption(job, selectedPlatform)
    navigator.clipboard.writeText(caption)
    setCopiedId(job.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Image className="text-pink-400" size={24} />
            Social Media Cards
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Generate and download social media cards for job postings</p>
        </div>
        <button
          onClick={handleGenerateAll}
          disabled={generating || verifiedJobs.length === 0}
          className="flex items-center gap-2 bg-pink-500/20 text-pink-400 border border-pink-500/30 px-4 py-2 rounded-xl text-sm font-medium hover:bg-pink-500/30 disabled:opacity-50 transition-all"
        >
          {generating ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : <><Sparkles size={14} /> Generate All ({Math.min(verifiedJobs.length, 20)})</>}
        </button>
      </div>

      {/* Platform Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {(Object.entries(PLATFORM_CONFIG) as [keyof typeof PLATFORM_CONFIG, typeof PLATFORM_CONFIG[keyof typeof PLATFORM_CONFIG]][]).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedPlatform(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
              selectedPlatform === key
                ? `${config.bg} ${config.color} border border-current/20`
                : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800/60 hover:bg-zinc-800/40'
            }`}
          >
            <config.icon size={14} />
            {config.label}
            <span className="text-[10px] opacity-60">{config.dims}</span>
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {verifiedJobs.map(job => {
          const cardKey = `${job.id}-${selectedPlatform}`
          const cardUrl = generatedCards.get(cardKey)
          const caption = generateCaption(job, selectedPlatform)

          return (
            <div key={job.id} className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl overflow-hidden hover:border-zinc-700/60 transition-all">
              {/* Card Preview */}
              <div className="aspect-square bg-zinc-800/60 flex items-center justify-center relative">
                {cardUrl ? (
                  <img src={cardUrl} alt={job.raw_title} className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center p-6">
                    <Image className="mx-auto text-zinc-600 mb-2" size={32} />
                    <p className="text-xs text-zinc-500">Click generate to create card</p>
                    <button
                      onClick={() => handleGenerateCard(job)}
                      disabled={generating}
                      className="mt-3 flex items-center gap-1 mx-auto text-xs bg-pink-500/20 text-pink-400 px-3 py-1.5 rounded-lg hover:bg-pink-500/30 transition-all"
                    >
                      <Sparkles size={12} /> Generate
                    </button>
                  </div>
                )}
              </div>

              {/* Card Info */}
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-white truncate">{job.raw_title}</h3>
                <p className="text-xs text-zinc-400 truncate">{job.raw_company} • {job.raw_location}</p>

                {/* Caption Preview */}
                <div className="bg-zinc-800/60 rounded-lg p-2 max-h-24 overflow-y-auto">
                  <p className="text-[11px] text-zinc-400 whitespace-pre-line">{caption.substring(0, 200)}...</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {cardUrl && (
                    <button
                      onClick={() => handleDownload(job.id, job.raw_title)}
                      className="flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition-all"
                    >
                      <Download size={12} /> Download
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyCaption(job)}
                    className="flex items-center gap-1 text-xs bg-zinc-700/40 text-zinc-300 px-3 py-1.5 rounded-lg hover:bg-zinc-700/60 transition-all"
                  >
                    {copiedId === job.id ? <><CheckCircle2 size={12} /> Copied!</> : <><Copy size={12} /> Caption</>}
                  </button>
                  {!cardUrl && (
                    <button
                      onClick={() => handleGenerateCard(job)}
                      disabled={generating}
                      className="flex items-center gap-1 text-xs bg-pink-500/20 text-pink-400 px-3 py-1.5 rounded-lg hover:bg-pink-500/30 transition-all ml-auto"
                    >
                      <Sparkles size={12} /> Generate
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {verifiedJobs.length === 0 && (
        <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800/60 rounded-xl">
          <Image className="mx-auto text-zinc-600 mb-3" size={32} />
          <p className="text-zinc-400 text-sm">No verified jobs available</p>
          <p className="text-zinc-500 text-xs mt-1">Verify jobs in the Discovery Engine to generate social cards</p>
        </div>
      )}
    </div>
  )
}
