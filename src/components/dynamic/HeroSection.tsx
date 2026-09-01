import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Sparkles, Zap, CheckCircle2, ShieldCheck, Award } from 'lucide-react'
import AnimatedBackground from '../ui/AnimatedBackground'

interface HeroProps {
  content: {
    headline: string
    subheadline: string
    cta_primary_text: string
    cta_primary_href: string
    cta_secondary_text: string
    cta_secondary_href: string
  }
  styling?: any
}

/* ── Interactive Typewriter Animated Text Component ── */
const TYPEWRITER_WORDS = [
  'Websites & Web Apps',
  'Android & Mobile Apps',
  'Windows Desktop Apps',
  'SaaS & Custom Software',
  'Business Automation',
  'WhatsApp & Lead CRMs'
]

const TypewriterText: React.FC = () => {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [reverse, setReverse] = useState(false)

  useEffect(() => {
    if (subIndex === TYPEWRITER_WORDS[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 2000)
      return () => clearTimeout(timeout)
    }

    if (subIndex === 0 && reverse) {
      setReverse(false)
      setIndex((prev) => (prev + 1) % TYPEWRITER_WORDS.length)
      return
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1))
    }, reverse ? 40 : 75)

    return () => clearTimeout(timeout)
  }, [subIndex, index, reverse])

  return (
    <span className="inline-block text-emerald-400 dark:text-emerald-400 light:text-emerald-700 font-black min-w-[200px] text-left drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
      {TYPEWRITER_WORDS[index].substring(0, subIndex)}
      <span className="animate-pulse text-emerald-400 font-light ml-0.5">|</span>
    </span>
  )
}

/* ── Interactive Mouse-Magnetic Constellation & 3D Wave Canvas ── */
const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let W = canvas.offsetWidth
    let H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    // Mouse tracking for magnetic constellation & spotlight
    let mouse = { x: -1000, y: -1000, active: false }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
    }

    const parent = canvas.parentElement
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove)
      parent.addEventListener('mouseleave', handleMouseLeave)
    }

    const isMobile = W < 768
    const NUM = isMobile ? 18 : 65
    type Pt = { x: number; y: number; vx: number; vy: number; r: number; color: string; origX: number; origY: number }
    const colors = ['rgba(16,185,129,', 'rgba(99,102,241,', 'rgba(45,212,191,', 'rgba(59,130,246,']

    const pts: Pt[] = Array.from({ length: NUM }, () => {
      const rx = Math.random() * W
      const ry = Math.random() * H
      return {
        x: rx,
        y: ry,
        origX: rx,
        origY: ry,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      }
    })

    const MAX_DIST = isMobile ? 120 : 175
    const MOUSE_MAGNET_DIST = 220
    let time = 0

    const draw = () => {
      time += 0.02
      ctx.clearRect(0, 0, W, H)

      // 1. Draw 3D-perspective wave grid lines at bottom
      const gridY = H * 0.65
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(16,185,129,0.06)'
      ctx.lineWidth = 1
      for (let i = 0; i <= 14; i++) {
        const y = gridY + Math.pow(i / 14, 1.8) * (H - gridY)
        const wave = Math.sin(time + i * 0.3) * 6
        ctx.moveTo(0, y + wave)
        ctx.lineTo(W, y + wave)
      }
      for (let j = 0; j <= 20; j++) {
        const xPercent = j / 20
        const topX = W * 0.5 + (xPercent - 0.5) * W * 0.3
        const botX = W * 0.5 + (xPercent - 0.5) * W * 1.4
        ctx.moveTo(topX, gridY)
        ctx.lineTo(botX, H)
      }
      ctx.stroke()

      // 2. Mouse Glow Spotlight
      if (mouse.active) {
        const spotGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250)
        spotGrad.addColorStop(0, 'rgba(16,185,129,0.14)')
        spotGrad.addColorStop(0.5, 'rgba(99,102,241,0.06)')
        spotGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = spotGrad
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 250, 0, Math.PI * 2)
        ctx.fill()
      }

      // 3. Node Connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35
            ctx.beginPath()
            ctx.strokeStyle = `rgba(16,185,129,${alpha})`
            ctx.lineWidth = 0.9
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
      }

      // 4. Mouse Magnetic Pull & Connections to Mouse
      for (const p of pts) {
        if (mouse.active) {
          const mdx = mouse.x - p.x
          const mdy = mouse.y - p.y
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
          if (mdist < MOUSE_MAGNET_DIST) {
            const pullForce = (1 - mdist / MOUSE_MAGNET_DIST) * 1.5
            p.x += (mdx / mdist) * pullForce
            p.y += (mdy / mdist) * pullForce

            // Magnetic line to mouse
            const mAlpha = (1 - mdist / MOUSE_MAGNET_DIST) * 0.45
            ctx.beginPath()
            ctx.strokeStyle = `rgba(52,211,153,${mAlpha})`
            ctx.lineWidth = 1.2
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
          }
        }

        // Render Particle Node
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + '0.9)'
        ctx.shadowBlur = 12
        ctx.shadowColor = p.color + '0.7)'
        ctx.fill()
        ctx.shadowBlur = 0

        // Physics velocity step
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W
      canvas.height = H
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove)
        parent.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-85 z-[2]"
      aria-hidden="true"
    />
  )
}

export const HeroSection: React.FC<HeroProps> = ({ content }) => {
  const {
    headline,
    subheadline,
    cta_primary_text,
    cta_primary_href,
    cta_secondary_text,
    cta_secondary_href
  } = content

  return (
    <section className="relative overflow-hidden py-20 lg:py-28 flex items-center bg-[#040509] dark:bg-[#040509] light:bg-slate-50 border-b border-white/10 light:border-slate-200 transition-colors duration-300 hero-banner">

      {/* ── Premium Multi-Layer Animated Background System ── */}
      <AnimatedBackground accent="emerald" particleCount={24} beams geoShapes />

      {/* ── High-Tech Radiant Aurora Mesh Overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 dark:from-emerald-900/20 light:from-emerald-200/30 via-transparent to-indigo-950/40 dark:to-indigo-950/40 light:to-indigo-100/30 pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 dark:from-emerald-500/15 light:from-emerald-400/10 via-transparent to-transparent pointer-events-none z-[1]" />

      {/* ── Particle Network Background ── */}
      <ParticleCanvas />

      {/* ── Layered Animated Gradient Orbs ── */}
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-emerald-500/25 dark:bg-emerald-500/25 light:bg-emerald-400/15 filter blur-[140px] pointer-events-none animate-orb-1 z-[1]" />
      <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] rounded-full bg-indigo-600/25 dark:bg-indigo-600/25 light:bg-indigo-400/15 filter blur-[140px] pointer-events-none animate-orb-2 z-[1]" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-teal-500/20 dark:bg-teal-500/20 light:bg-teal-400/15 filter blur-[110px] pointer-events-none animate-pulse-slow z-[1]" />

      {/* ── Animated SVG Circuit Lines ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-10 dark:opacity-10 light:opacity-20"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="50%" stopColor="#2dd4bf" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="25%" x2="30%" y2="25%" stroke="url(#lineGrad1)" strokeWidth="1">
          <animate attributeName="x2" values="0%;30%;0%" dur="8s" repeatCount="indefinite" />
        </line>
        <line x1="70%" y1="70%" x2="100%" y2="70%" stroke="url(#lineGrad2)" strokeWidth="1">
          <animate attributeName="x1" values="100%;70%;100%" dur="10s" repeatCount="indefinite" />
        </line>
        <line x1="15%" y1="0" x2="15%" y2="40%" stroke="url(#lineGrad1)" strokeWidth="0.8">
          <animate attributeName="y2" values="0%;40%;0%" dur="9s" repeatCount="indefinite" />
        </line>
        <line x1="85%" y1="60%" x2="85%" y2="100%" stroke="url(#lineGrad2)" strokeWidth="0.8">
          <animate attributeName="y1" values="100%;60%;100%" dur="7s" repeatCount="indefinite" />
        </line>
        <circle cx="15%" cy="40%" r="4" fill="#10b981" opacity="0.6">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="85%" cy="60%" r="4" fill="#6366f1" opacity="0.6">
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="30%" cy="25%" r="3" fill="#2dd4bf" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="70%" cy="70%" r="3" fill="#10b981" opacity="0.5">
          <animate attributeName="opacity" values="0.9;0.3;0.9" dur="5s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* ── Fine Dot Grid Overlay ── */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] light:bg-[radial-gradient(rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none opacity-100" />

      {/* ── Floating Tech Badges in Background Space for 3D Depth ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[3] hidden lg:block">
        <div className="absolute top-[18%] left-[4%] px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.04] light:bg-white border border-emerald-500/30 light:border-emerald-500/40 text-emerald-400 light:text-emerald-700 text-[11px] font-mono font-bold shadow-xl light:shadow-md shadow-emerald-500/10 backdrop-blur-md animate-float-gentle">
          &lt;React 19 /&gt;
        </div>
        <div className="absolute top-[28%] right-[5%] px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.04] light:bg-white border border-indigo-500/30 light:border-indigo-500/40 text-indigo-300 light:text-indigo-700 text-[11px] font-mono font-bold shadow-xl light:shadow-md shadow-indigo-500/10 backdrop-blur-md animate-float-gentle [animation-delay:-2s]">
          &lt;Next.js 15 /&gt;
        </div>
        <div className="absolute top-[58%] left-[3%] px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.04] light:bg-white border border-teal-500/30 light:border-teal-500/40 text-teal-300 light:text-teal-700 text-[11px] font-mono font-bold shadow-xl light:shadow-md shadow-teal-500/10 backdrop-blur-md animate-float-gentle [animation-delay:-3.5s]">
          Kotlin Native
        </div>
        <div className="absolute top-[68%] right-[4%] px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.04] light:bg-white border border-emerald-500/30 light:border-emerald-500/40 text-emerald-400 light:text-emerald-700 text-[11px] font-mono font-bold shadow-xl light:shadow-md shadow-emerald-500/10 backdrop-blur-md animate-float-gentle [animation-delay:-1.5s]">
          WinUI 3 &amp; WPF
        </div>
        <div className="absolute bottom-[12%] left-[8%] px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.04] light:bg-white border border-indigo-500/30 light:border-indigo-500/40 text-indigo-400 light:text-indigo-700 text-[11px] font-mono font-bold shadow-xl light:shadow-md shadow-indigo-500/10 backdrop-blur-md animate-float-gentle [animation-delay:-4s]">
          Supabase SQL
        </div>
        <div className="absolute bottom-[16%] right-[8%] px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.04] light:bg-white border border-teal-500/30 light:border-teal-500/40 text-teal-300 light:text-teal-700 text-[11px] font-mono font-bold shadow-xl light:shadow-md shadow-teal-500/10 backdrop-blur-md animate-float-gentle [animation-delay:-2.5s]">
          WhatsApp CRM
        </div>
      </div>

      {/* ── Content Container ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 text-center">
        
        {/* Brand Title Block */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Badge: Glass capsule with location signal */}
          <div className="hero-badge-enter inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#060913]/90 dark:bg-[#060913]/90 light:bg-white border border-emerald-500/40 light:border-emerald-500/30 text-emerald-400 light:text-emerald-700 text-xs font-extrabold uppercase tracking-widest font-display shadow-2xl light:shadow-md backdrop-blur-md">
            <Sparkles size={14} className="text-emerald-400 light:text-emerald-600 animate-spin-slow" /> #1 Web Development &amp; Software Engineering Agency in Udumalpet (Udumalaipettai)
          </div>

          {/* H1 Title with Primary Local Keywords */}
          <h1 className="hero-h1-enter hero-h1-glow text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight font-display text-white dark:text-white light:text-slate-900 leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)] light:drop-shadow-none">
            <span className="block text-xs sm:text-sm md:text-base font-bold tracking-widest text-emerald-400 dark:text-emerald-400 light:text-emerald-700 mb-2 normal-case font-mono">
              Web Development Company in Udumalpet (Udumalaipettai) &bull; Tamil Nadu
            </span>
            Spring Web{' '}
            <span className="hero-shimmer-text text-emerald-400 dark:text-emerald-400 light:text-emerald-700 bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 light:from-emerald-700 light:via-teal-700 light:to-indigo-700">
              Solutions
            </span>
          </h1>
        </div>

        {/* Sub-Headline & Description */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* H2 Headline */}
          <h2 className="hero-sub-enter text-xl sm:text-2xl md:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 font-display leading-snug drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] light:drop-shadow-none">
            <span className="sr-only">
              #1 Web Development, Custom Software, Mobile Apps, and Digital Marketing in Udumalpet (Udumalaipettai)
            </span>
            <span aria-hidden="true">
              Helping Businesses Grow in Udumalpet &amp; Beyond Through{' '}
              <br className="hidden sm:inline" />
              <TypewriterText />
            </span>
          </h2>

          {/* Hero Subtitle Paragraph */}
          <p className="hero-p-enter max-w-2xl mx-auto text-base sm:text-lg text-slate-200 dark:text-slate-200 light:text-slate-600 font-sans font-normal leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] light:drop-shadow-none">
            {subheadline}
          </p>

          {/* CTAs */}
          <div className="hero-cta-enter flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to={cta_primary_href || '/contact'}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/40 text-sm font-bold py-3.5 px-8"
            >
              <span>{cta_primary_text || 'Get Free Consultation'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to={cta_secondary_href || '/#services'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold py-3.5 px-8 bg-white/10 dark:bg-white/10 light:bg-slate-100 hover:bg-white/20 light:hover:bg-slate-200 text-white dark:text-white light:text-slate-800 border border-white/20 light:border-slate-300 backdrop-blur-md rounded-xl transition-all shadow-xl light:shadow-sm"
            >
              <span>{cta_secondary_text || 'Explore Services'}</span>
              <ArrowUpRight size={16} className="opacity-70 group-hover:opacity-100 transition-all" />
            </Link>
          </div>
        </div>

        {/* Stats Terminal Card */}
        <div className="hero-terminal-enter max-w-4xl mx-auto pt-4">
          <div className="hero-terminal-box rounded-3xl border border-white/15 dark:border-white/15 light:border-slate-200 bg-[#080b14]/90 dark:bg-[#080b14]/90 light:bg-white p-4 sm:p-6 shadow-2xl light:shadow-xl backdrop-blur-xl space-y-4">
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-white/10 light:border-slate-200 pb-3 text-xs text-slate-400 light:text-slate-500">
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-700 font-semibold">springweb-architecture-v3.ts</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 light:text-emerald-600">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>STATUS: 99.9% UPTIME SLA</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-4 rounded-2xl bg-white/[0.06] dark:bg-white/[0.06] light:bg-slate-50 border border-white/15 light:border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 light:text-emerald-600 text-[11px] font-bold uppercase tracking-wider font-display">
                  <Award size={14} /> Completed Projects
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 font-display">3</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.06] dark:bg-white/[0.06] light:bg-slate-50 border border-white/15 light:border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-400 light:text-indigo-600 text-[11px] font-bold uppercase tracking-wider font-display">
                  <CheckCircle2 size={14} /> Sprint Delivery
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 font-display">100%</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-50 border border-white/15 light:border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 light:text-emerald-600 text-[11px] font-bold uppercase tracking-wider font-display">
                  <Zap size={14} /> PageSpeed
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 font-display">&lt; 1s Load</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-50 border border-white/15 light:border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-teal-400 light:text-teal-600 text-[11px] font-bold uppercase tracking-wider font-display">
                  <ShieldCheck size={14} /> Uptime SLA
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white dark:text-white light:text-slate-900 font-display">99.9%</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
export default HeroSection
