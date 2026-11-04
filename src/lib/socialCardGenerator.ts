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

const BRAND_COLORS: Record<string, [string, string]> = {
  automattic: ['#0087be', '#005a87'],
  cisco: ['#00bceb', '#005073'],
  hackerrank: ['#00ea64', '#008a38'],
  swiggy: ['#fc8019', '#b34700'],
  zoho: ['#008bd2', '#e42527'],
  hexaware: ['#0077ff', '#003380'],
  freshworks: ['#ff5a00', '#c43d00'],
  postman: ['#ff6c37', '#b33600'],
  phonepe: ['#5f259f', '#320b66'],
  cred: ['#222222', '#050505'],
  atlassian: ['#0052cc', '#002966'],
  canonical: ['#e95420', '#77216f'],
  gitlab: ['#fc6d26', '#e24329'],
  razorpay: ['#3395ff', '#0c2340'],
  thoughtworks: ['#f2617a', '#1b0028'],
  redhat: ['#ee0000', '#660000'],
  browserstack: ['#0080ff', '#00c853'],
  fractal: ['#00e676', '#04202c'],
  crowdstrike: ['#ff2a2a', '#660000'],
  jio: ['#0a2885', '#e11b22'],
  tcs: ['#00a8e8', '#001d4a'],
}

function getBrandColors(company: string): [string, string] {
  const lower = (company || '').toLowerCase()
  for (const [key, colors] of Object.entries(BRAND_COLORS)) {
    if (lower.includes(key)) return colors
  }
  return ['#10b981', '#047857']
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
  maxLines: number = 2
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
      ctx.fillText(line.trim(), x, currentY)
      line = words[n] + ' '
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line.trim(), x, currentY)
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
    const location = isDiscovered ? job.raw_location : `${job.location_city}, ${job.location_country}`
    const salary = isDiscovered ? job.raw_salary : job.salary_range
    const category = isDiscovered ? job.ai_category : job.niche_category
    const expLevel = isDiscovered ? job.ai_experience_level : job.experience_level
    const isWfh = 'is_wfh' in job ? job.is_wfh : true

    const isLandscape = w / h > 1.3

    // Palette & brand accents
    const palette = (category && CATEGORY_PALETTES[category]) || CATEGORY_PALETTES.default
    const primaryColor = options.accentColor || palette[0]
    const secondaryColor = palette[1]
    const [brandPrimary, brandSecondary] = getBrandColors(company)

    // Deep modern dark background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h)
    bgGrad.addColorStop(0, '#040711')
    bgGrad.addColorStop(0.5, '#070c18')
    bgGrad.addColorStop(1, '#020409')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)

    // Ambient radial glow
    const glow1 = ctx.createRadialGradient(w * 0.85, h * 0.15, 40, w * 0.85, h * 0.15, w * 0.55)
    glow1.addColorStop(0, `${primaryColor}55`)
    glow1.addColorStop(1, 'transparent')
    ctx.fillStyle = glow1
    ctx.fillRect(0, 0, w, h)

    const glow2 = ctx.createRadialGradient(w * 0.15, h * 0.85, 40, w * 0.15, h * 0.85, w * 0.5)
    glow2.addColorStop(0, `${secondaryColor}35`)
    glow2.addColorStop(1, 'transparent')
    ctx.fillStyle = glow2
    ctx.fillRect(0, 0, w, h)

    // Subtle Grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)'
    ctx.lineWidth = 1
    const gridSize = 44
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

    const pad = Math.round(isLandscape ? w * 0.06 : w * 0.07)
    const textW = w - pad * 2

    // ── 1. Top Header Row: Verified Badge (Left) & Category/Experience Pill (Right) ────
    const headerY = pad
    const headerH = Math.round(isLandscape ? h * 0.065 : h * 0.05)

    // Left Verified Badge
    const badgeText = '⚡ SPRINGWEB CAREERS • VERIFIED'
    ctx.font = `bold ${Math.round(isLandscape ? w * 0.020 : w * 0.024)}px Inter, system-ui, sans-serif`
    const badgeMetrics = ctx.measureText(badgeText)
    const badgeW = badgeMetrics.width + Math.round(w * 0.035)

    ctx.fillStyle = 'rgba(16, 185, 129, 0.14)'
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.roundRect(pad, headerY, badgeW, headerH, 10)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#34d399'
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    ctx.fillText(badgeText, pad + Math.round(w * 0.018), headerY + headerH / 2)

    // Right Category / Experience Pill
    const tagText = [category, expLevel].filter(Boolean).join(' • ')
    if (tagText) {
      ctx.font = `600 ${Math.round(isLandscape ? w * 0.018 : w * 0.022)}px Inter, system-ui, sans-serif`
      const tagMetrics = ctx.measureText(tagText)
      const tagW = Math.min(tagMetrics.width + Math.round(w * 0.03), textW - badgeW - Math.round(w * 0.03))
      const tagX = w - pad - tagW

      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(tagX, headerY, tagW, headerH, 10)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#94a3b8'
      ctx.textAlign = 'center'
      ctx.fillText(tagText, tagX + tagW / 2, headerY + headerH / 2)
      ctx.textAlign = 'left'
    }

    // ── 2. Job Title ─────────────────────────────────────────────────────────────
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#ffffff'
    const titleFontSize = Math.round(isLandscape ? w * 0.038 : w * 0.052)
    ctx.font = `900 ${titleFontSize}px Inter, system-ui, sans-serif`
    const titleY = headerY + headerH + Math.round(isLandscape ? h * 0.09 : h * 0.08)
    const titleLineHeight = Math.round(titleFontSize * 1.22)
    const maxTitleLines = isLandscape ? 2 : 3
    const lastTitleY = wrapText(ctx, title, pad, titleY, textW, titleLineHeight, maxTitleLines)

    // ── 3. Company & Location Card (Crisp Brand Avatar - ZERO BROKEN EMOJI) ───────
    const infoY = lastTitleY + Math.round(isLandscape ? h * 0.05 : h * 0.06)
    const infoH = Math.round(isLandscape ? h * 0.22 : h * 0.17)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)'
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(pad, infoY, textW, infoH, 16)
    ctx.fill()
    ctx.stroke()

    // Brand Avatar Box
    const avatarSize = Math.round(infoH * 0.62)
    const avatarX = pad + Math.round(w * 0.025)
    const avatarY = infoY + Math.round((infoH - avatarSize) / 2)

    ctx.save()
    const avatarGrad = ctx.createLinearGradient(avatarX, avatarY, avatarX + avatarSize, avatarY + avatarSize)
    avatarGrad.addColorStop(0, brandPrimary)
    avatarGrad.addColorStop(1, brandSecondary)
    ctx.fillStyle = avatarGrad
    ctx.beginPath()
    ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 12)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Initials inside avatar
    const initials = company
      .split(' ')
      .slice(0, 2)
      .map((w: string) => w.charAt(0).toUpperCase())
      .join('') || company.charAt(0).toUpperCase()
    ctx.fillStyle = '#ffffff'
    ctx.font = `900 ${Math.round(avatarSize * 0.46)}px Inter, system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(initials, avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 1)
    ctx.restore()

    // Text details to right of avatar
    const detailsX = avatarX + avatarSize + Math.round(w * 0.025)
    ctx.textBaseline = 'alphabetic'
    ctx.textAlign = 'left'

    // Company Name
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${Math.round(isLandscape ? w * 0.028 : w * 0.036)}px Inter, system-ui, sans-serif`
    ctx.fillText(company, detailsX, infoY + Math.round(infoH * 0.44))

    // Location & Mode
    if (location) {
      ctx.fillStyle = '#94a3b8'
      ctx.font = `500 ${Math.round(isLandscape ? w * 0.020 : w * 0.026)}px Inter, system-ui, sans-serif`
      ctx.fillText(`📍 ${location}`, detailsX, infoY + Math.round(infoH * 0.78))
    }

    // Work Mode Pill on right side of company card
    const modeText = isWfh ? '🌐 100% Remote / WFH' : '🏢 On-Site / Hybrid'
    ctx.font = `bold ${Math.round(isLandscape ? w * 0.017 : w * 0.022)}px Inter, system-ui, sans-serif`
    const modeMetrics = ctx.measureText(modeText)
    const modeW = modeMetrics.width + Math.round(w * 0.03)
    const modeH = Math.round(infoH * 0.42)
    const modeX = w - pad - modeW - Math.round(w * 0.025)
    const modeY = infoY + Math.round((infoH - modeH) / 2)

    ctx.fillStyle = isWfh ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)'
    ctx.strokeStyle = isWfh ? 'rgba(99, 102, 241, 0.4)' : 'rgba(16, 185, 129, 0.4)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(modeX, modeY, modeW, modeH, 10)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = isWfh ? '#a5b4fc' : '#6ee7b7'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(modeText, modeX + modeW / 2, modeY + modeH / 2)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'

    // ── 4. Dedicated Salary / Package Bar (ZERO OVERLAPPING GUARANTEE) ───────────
    const salaryY = infoY + infoH + Math.round(isLandscape ? h * 0.045 : h * 0.04)
    if (salary) {
      const salH = Math.round(isLandscape ? h * 0.095 : h * 0.08)

      // Emerald glass container spanning full content width
      ctx.fillStyle = 'rgba(16, 185, 129, 0.12)'
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(pad, salaryY, textW, salH, 14)
      ctx.fill()
      ctx.stroke()

      const salPrefix = '💰 Offered Package: '
      const fullSalText = `${salPrefix}${salary}`

      // Auto-fit font size so it NEVER clips or overflows textW
      const maxSalWidth = textW - Math.round(w * 0.06)
      const baseSize = Math.round(isLandscape ? w * 0.026 : w * 0.034)
      const minSize = Math.round(isLandscape ? w * 0.017 : w * 0.022)
      let fontSize = baseSize
      ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`
      while (ctx.measureText(fullSalText).width > maxSalWidth && fontSize > minSize) {
        fontSize -= 1
        ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`
      }

      ctx.fillStyle = '#34d399'
      ctx.textBaseline = 'middle'
      ctx.fillText(fullSalText, pad + Math.round(w * 0.025), salaryY + salH / 2)
      ctx.textBaseline = 'alphabetic'
    }

    // ── 5. Footer Watermark / Direct Apply Link ──────────────────────────────────
    const footerY = h - Math.round(isLandscape ? pad * 0.65 : pad * 0.75)

    ctx.fillStyle = '#64748b'
    ctx.font = `500 ${Math.round(isLandscape ? w * 0.018 : w * 0.022)}px Inter, system-ui, sans-serif`
    ctx.fillText('🔗 careers.springwebsolutions.in', pad, footerY)

    ctx.fillStyle = '#94a3b8'
    ctx.font = `bold ${Math.round(isLandscape ? w * 0.018 : w * 0.022)}px Inter, system-ui, sans-serif`
    ctx.textAlign = 'right'
    ctx.fillText('SpringWeb Career Intelligence', w - pad, footerY)

    resolve(canvas.toDataURL('image/png'))
  })
}
