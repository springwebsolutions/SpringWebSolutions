import type { DiscoveredJob, JobPosting } from '@/stores/careersStore'
import type { SocialPlatform } from './captionGenerator'

export interface CardOptions {
  theme?: 'dark' | 'gradient' | 'minimal'
  accentColor?: string
  includeBranding?: boolean
}

const CATEGORY_PALETTES: Record<string, [string, string]> = {
  'Software Engineering': ['#065f46', '#0284c7'],
  'Mobile App Development': ['#6d28d9', '#db2777'],
  'Cloud & Infrastructure': ['#0369a1', '#0891b2'],
  'Data Science & AI': ['#5b21b6', '#1d4ed8'],
  'Digital Marketing & SEO': ['#b45309', '#b91c1c'],
  'Design & Creative': ['#be185d', '#c2410c'],
  default: ['#047857', '#1d4ed8'],
}

const PLATFORM_DIMENSIONS: Record<SocialPlatform, [number, number]> = {
  instagram: [1080, 1080],
  linkedin: [1200, 627],
  twitter: [1200, 675],
  whatsapp: [800, 800],
  telegram: [800, 800],
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 3
): number {
  const words = text.split(' ')
  let line = ''
  let currentY = y
  let linesDrawn = 0

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width

    if (testWidth > maxWidth && n > 0) {
      linesDrawn++
      if (linesDrawn >= maxLines) {
        ctx.fillText(line.trim() + '…', x, currentY)
        return currentY
      }
      ctx.fillText(line, x, currentY)
      line = words[n] + ' '
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, currentY)
  return currentY
}

export function generateCardCanvas(
  job: DiscoveredJob | JobPosting,
  platform: SocialPlatform = 'instagram',
  options: CardOptions = {}
): Promise<string> {
  return new Promise((resolve) => {
    const [w, h] = PLATFORM_DIMENSIONS[platform] || [1080, 1080]
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return resolve('')

    const isDiscovered = 'raw_title' in job
    const title = isDiscovered ? job.raw_title : job.title
    const company = isDiscovered ? job.raw_company : job.company_name
    const location = isDiscovered ? job.raw_location : `${job.location_city}, ${job.location_state}`
    const salary = isDiscovered ? job.raw_salary : job.salary_range
    const category = isDiscovered ? job.ai_category : job.niche_category
    const expLevel = isDiscovered ? job.ai_experience_level : job.experience_level

    // Palette
    const palette = (category && CATEGORY_PALETTES[category]) || CATEGORY_PALETTES.default
    const primaryColor = options.accentColor || palette[0]
    const secondaryColor = palette[1]

    // Base background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h)
    bgGrad.addColorStop(0, '#090d16')
    bgGrad.addColorStop(0.5, '#0d1527')
    bgGrad.addColorStop(1, '#050811')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)

    // Glow accents
    const glow = ctx.createRadialGradient(w * 0.8, h * 0.2, 50, w * 0.8, h * 0.2, w * 0.6)
    glow.addColorStop(0, `${primaryColor}66`)
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)

    const glow2 = ctx.createRadialGradient(w * 0.2, h * 0.8, 50, w * 0.2, h * 0.8, w * 0.5)
    glow2.addColorStop(0, `${secondaryColor}44`)
    glow2.addColorStop(1, 'transparent')
    ctx.fillStyle = glow2
    ctx.fillRect(0, 0, w, h)

    // Subtle Grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
    ctx.lineWidth = 1
    const gridSize = 40
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    const pad = Math.round(w * 0.08)
    const textW = w - pad * 2

    // Top Header Badge: "SPRINGWEB CAREERS • VERIFIED JOB VACANCY"
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)'
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'
    ctx.lineWidth = 1.5
    const badgeText = '⚡ SPRINGWEB CAREERS • VERIFIED VACANCY'
    ctx.font = `bold ${Math.round(w * 0.024)}px Inter, system-ui, sans-serif`
    const badgeMetrics = ctx.measureText(badgeText)
    const badgeW = badgeMetrics.width + w * 0.04
    const badgeH = Math.round(h * 0.06)
    const badgeX = pad
    const badgeY = pad

    ctx.beginPath()
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 10)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#34d399'
    ctx.fillText(badgeText, badgeX + w * 0.02, badgeY + badgeH * 0.65)

    // Job Title
    ctx.fillStyle = '#ffffff'
    ctx.font = `900 ${Math.round(w * 0.048)}px Inter, system-ui, sans-serif`
    const titleY = badgeY + badgeH + Math.round(h * 0.08)
    const lastTitleY = wrapText(ctx, title, pad, titleY, textW, Math.round(w * 0.06), 2)

    // Company & Location Card container
    const infoY = lastTitleY + Math.round(h * 0.06)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    const infoH = Math.round(h * 0.22)
    ctx.beginPath()
    ctx.roundRect(pad, infoY, textW, infoH, 16)
    ctx.fill()
    ctx.stroke()

    // Company Name
    ctx.fillStyle = '#38bdf8'
    ctx.font = `bold ${Math.round(w * 0.032)}px Inter, system-ui, sans-serif`
    ctx.fillText(`🏢 ${company}`, pad + Math.round(w * 0.03), infoY + Math.round(infoH * 0.35))

    // Location
    if (location) {
      ctx.fillStyle = '#cbd5e1'
      ctx.font = `500 ${Math.round(w * 0.026)}px Inter, system-ui, sans-serif`
      ctx.fillText(`📍 ${location}`, pad + Math.round(w * 0.03), infoY + Math.round(infoH * 0.72))
    }

    // Salary & Tags row
    let bottomRowY = infoY + infoH + Math.round(h * 0.05)
    if (salary) {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)'
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)'
      const salText = `💰 ${salary} (Verified Fact)`
      ctx.font = `bold ${Math.round(w * 0.028)}px Inter, system-ui, sans-serif`
      const salMetrics = ctx.measureText(salText)
      const salW = salMetrics.width + w * 0.04
      const salH = Math.round(h * 0.065)

      ctx.beginPath()
      ctx.roundRect(pad, bottomRowY, salW, salH, 10)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#fbbf24'
      ctx.fillText(salText, pad + w * 0.02, bottomRowY + salH * 0.65)
    }

    // Category / Experience pill
    if (category || expLevel) {
      const tagText = [category, expLevel].filter(Boolean).join(' • ')
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.font = `600 ${Math.round(w * 0.022)}px Inter, system-ui, sans-serif`
      const tagMetrics = ctx.measureText(tagText)
      const tagW = tagMetrics.width + w * 0.04
      const tagH = Math.round(h * 0.055)
      const tagX = w - pad - tagW

      ctx.beginPath()
      ctx.roundRect(tagX, bottomRowY, tagW, tagH, 8)
      ctx.fill()

      ctx.fillStyle = '#94a3b8'
      ctx.fillText(tagText, tagX + w * 0.02, bottomRowY + tagH * 0.65)
    }

    // Footer Watermark / Apply URL
    const footerY = h - Math.round(pad * 0.7)
    ctx.fillStyle = '#64748b'
    ctx.font = `500 ${Math.round(w * 0.02)}px Inter, system-ui, sans-serif`
    ctx.fillText('🔗 careers.springwebsolutions.in', pad, footerY)

    ctx.fillStyle = '#94a3b8'
    ctx.font = `bold ${Math.round(w * 0.02)}px Inter, system-ui, sans-serif`
    ctx.textAlign = 'right'
    ctx.fillText('SpringWeb Career Intelligence', w - pad, footerY)

    resolve(canvas.toDataURL('image/png'))
  })
}
