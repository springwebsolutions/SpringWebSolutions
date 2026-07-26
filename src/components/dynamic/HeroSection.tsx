import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Sparkles, Zap, CheckCircle2, ShieldCheck, Award } from 'lucide-react'

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
  'SaaS & Custom Software',
  'Business Automation',
  'WhatsApp & Lead CRMs',
  'High-Speed Web Platforms'
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
    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400 light:from-emerald-300 light:via-teal-200 light:to-indigo-300 font-black min-w-[200px] text-left drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
      {TYPEWRITER_WORDS[index].substring(0, subIndex)}
      <span className="animate-pulse text-emerald-400 light:text-emerald-300 font-light ml-0.5">|</span>
    </span>
  )
}

/* ── Animated Particle Network Canvas ── */
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

    const NUM = 55
    type Pt = { x: number; y: number; vx: number; vy: number; r: number; color: string }
    const colors = ['rgba(16,185,129,', 'rgba(99,102,241,', 'rgba(45,212,191,']

    const pts: Pt[] = Array.from({ length: NUM }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))

    const MAX_DIST = 145

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Draw connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.28
            ctx.beginPath()
            ctx.strokeStyle = `rgba(16,185,129,${alpha})`
            ctx.lineWidth = 0.8
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      for (const p of pts) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + '0.75)'
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color + '0.5)'
        ctx.fill()
        ctx.shadowBlur = 0

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
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60 dark:opacity-60 light:opacity-20"
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
    <section className="relative overflow-hidden py-20 lg:py-28 flex items-center bg-[#040509] dark:bg-[#040509] light:bg-slate-900 border-b border-white/5 light:border-slate-200 transition-colors duration-300">

      {/* ── High-Tech Hero Background Image & Overlay (UNTOUCHED IMAGE VISIBILITY) ── */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 dark:opacity-60 light:opacity-85 pointer-events-none transition-opacity duration-500 scale-105 contrast-110 brightness-105 light:contrast-115 light:brightness-100"
        style={{ backgroundImage: `url('/hero-bg.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#040509]/75 via-[#040509]/55 to-[#040509]/95 dark:from-[#040509]/75 dark:via-[#040509]/55 dark:to-[#040509]/95 light:from-white/30 light:via-transparent light:to-slate-100/40 pointer-events-none" />

      {/* ── Particle Network Background ── */}
      <ParticleCanvas />

      {/* ── Layered Animated Gradient Orbs ── */}
      <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-400/10 filter blur-[130px] pointer-events-none animate-orb-1" />
      <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] rounded-full bg-indigo-600/20 dark:bg-indigo-600/20 light:bg-indigo-400/10 filter blur-[130px] pointer-events-none animate-orb-2" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-teal-500/15 filter blur-[100px] pointer-events-none animate-pulse-slow" />

      {/* ── Animated SVG Circuit Lines ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-10 dark:opacity-10 light:opacity-5"
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
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none opacity-100" />

      {/* ── Content Container with Crystal-Clear High-Contrast Text Over Image ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 text-center">
        
        {/* Brand Title Block */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Badge: Glass capsule */}
          <div className="hero-badge-enter inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#060913]/85 border border-emerald-500/40 text-emerald-400 text-xs font-extrabold uppercase tracking-widest font-display shadow-2xl backdrop-blur-md">
            <Sparkles size={14} className="text-emerald-400 animate-spin-slow" /> Official Web Engineering &amp; Automation Agency
          </div>

          {/* H1 Title: Brilliant White with High-Contrast Drop Shadow */}
          <h1 className="hero-h1-enter hero-h1-glow text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight font-display text-white dark:text-white light:text-white leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)]">
            Spring Web{' '}
            <span className="hero-shimmer-text text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400 light:from-emerald-300 light:via-teal-200 light:to-indigo-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              Solutions
            </span>
          </h1>
        </div>

        {/* Sub-Headline & Description with Glass Backdrop & Crisp Shadow */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* H2 Headline */}
          <h2 className="hero-sub-enter text-xl sm:text-2xl md:text-3xl font-extrabold text-white dark:text-white light:text-white font-display leading-snug drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
            Helping Businesses Grow Through{' '}
            <br className="hidden sm:inline" />
            <TypewriterText />
          </h2>

          {/* Paragraph: Crisp Glass Backdrop for 100% Readability Over Busy Image */}
          <div className="hero-p-enter max-w-2xl mx-auto bg-[#040509]/65 light:bg-[#040509]/65 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shadow-2xl">
            <p className="text-sm sm:text-base text-slate-100 dark:text-slate-100 light:text-slate-100 font-sans font-normal leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              {subheadline}
            </p>
          </div>

          {/* CTAs */}
          <div className="hero-cta-enter flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to={cta_primary_href || '/contact'}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group shadow-xl shadow-emerald-500/30 text-sm font-bold py-3.5 px-8"
            >
              <span>{cta_primary_text || 'Get Free Consultation'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to={cta_secondary_href || '/#services'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold py-3.5 px-8 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md rounded-xl transition-all shadow-xl"
            >
              <span>{cta_secondary_text || 'Explore Services'}</span>
              <ArrowUpRight size={16} className="opacity-70 group-hover:opacity-100 transition-all" />
            </Link>
          </div>
        </div>

        {/* Stats Terminal Card */}
        <div className="hero-terminal-enter max-w-4xl mx-auto pt-4">
          <div className="rounded-3xl bg-[#080b14]/90 dark:bg-[#080b14]/90 light:bg-[#080b14]/90 border border-white/10 p-4 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-mono text-[11px] text-slate-300 font-semibold">springweb-architecture-v3.ts</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>STATUS: 99.9% UPTIME SLA</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold uppercase tracking-wider font-display">
                  <Award size={14} /> Completed Projects
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-display">3</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] font-bold uppercase tracking-wider font-display">
                  <CheckCircle2 size={14} /> Sprint Delivery
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-display">100%</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold uppercase tracking-wider font-display">
                  <Zap size={14} /> PageSpeed
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-display">&lt; 1s Load</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-teal-400 text-[11px] font-bold uppercase tracking-wider font-display">
                  <ShieldCheck size={14} /> Uptime SLA
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-display">99.9%</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
export default HeroSection
