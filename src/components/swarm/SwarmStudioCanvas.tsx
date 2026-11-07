import React, { useEffect, useRef, useState } from 'react'
import type { SpringCursorState, AgentPersonaId } from '@/lib/swarm/types'
import { SwarmSpringEngine } from '@/lib/swarm/swarmSpringEngine'
import { SwarmWaveChoreographer } from '@/lib/swarm/swarmWaveChoreographer'
import { SwarmAgentCursor } from './SwarmAgentCursor'
import { swarmAudio } from '@/lib/swarm/audioEngine'
import { Logo } from '@/components/ui/Logo'
import { 
  Sparkles, ArrowRight, ArrowUpRight, Award, 
  CheckCircle2, Zap, ShieldCheck 
} from 'lucide-react'

interface SwarmStudioCanvasProps {
  speed?: '1x' | '2x' | '3x'
  soundEnabled?: boolean
  onComplete: () => void
  onDismiss: () => void
}

export const SwarmStudioCanvas: React.FC<SwarmStudioCanvasProps> = ({
  speed = '2x',
  soundEnabled = true,
  onComplete,
  onDismiss,
}) => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  })

  const cursorsRef = useRef<Map<AgentPersonaId, SpringCursorState>>(new Map())
  const [, setFrameTick] = useState<number>(0)

  const springEngineRef = useRef<SwarmSpringEngine>(new SwarmSpringEngine())
  const choreographerRef = useRef<SwarmWaveChoreographer | null>(null)
  const animFrameIdRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(performance.now())

  // Configure Audio
  useEffect(() => {
    swarmAudio.setEnabled(soundEnabled)
  }, [soundEnabled])

  // Handle Window Resizing
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Esc key & global click listener for instant skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onDismiss()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onDismiss])

  // Lock body scroll during animation to prevent drift
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  // Initialize and run 60 FPS animation loop
  useEffect(() => {
    const width = window.innerWidth
    const height = window.innerHeight

    cursorsRef.current = springEngineRef.current.createInitialCursors(width, height)

    const choreographer = new SwarmWaveChoreographer(speed, onComplete)
    choreographerRef.current = choreographer

    let running = true

    const loop = (time: number) => {
      if (!running) return

      const deltaMs = Math.min(time - lastTimeRef.current, 45)
      lastTimeRef.current = time

      // Update Choreographer
      choreographer.update(cursorsRef.current, width, height, deltaMs)

      // Update Spring Physics
      const speedMult = speed === '1x' ? 1 : speed === '2x' ? 1.6 : 2.2
      springEngineRef.current.update(cursorsRef.current, speedMult, deltaMs / 16.66)

      setFrameTick((prev) => (prev + 1) % 1000)
      animFrameIdRef.current = requestAnimationFrame(loop)
    }

    animFrameIdRef.current = requestAnimationFrame(loop)

    return () => {
      running = false
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
    }
  }, [speed, onComplete])

  const ch = choreographerRef.current
  const stage = ch?.stage || {
    navProgress: 0,
    badgeProgress: 0,
    h1CharsCount: 0,
    subtitleProgress: 0,
    ctasProgress: 0,
    terminalProgress: 0,
    visibleCardsCount: 0,
    techBadgesProgress: 0,
    sweepY: null,
    canvasOpacity: 1,
  }

  const laserGuides = ch?.activeLaserGuides || []
  const distanceRulers = ch?.activeDistanceRulers || []
  const cursorsList = Array.from(cursorsRef.current.values())

  // Format H1 streaming text
  const fullHeadline = 'Spring Web Solutions'
  const renderedChars = fullHeadline.slice(0, stage.h1CharsCount)
  const isSolutionsActive = stage.h1CharsCount > 11
  const firstPart = renderedChars.slice(0, 11)
  const solutionsPart = isSolutionsActive ? renderedChars.slice(11) : ''

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-[9999] cursor-pointer select-none overflow-hidden"
      style={{
        opacity: stage.canvasOpacity,
        transition: 'opacity 0.2s ease-out',
      }}
      title="Click or press Esc to skip animation"
    >
      {/* ── Real Site Backdrop Atmosphere ── */}
      <div className="absolute inset-0 bg-[#040509]">
        {/* Fine Dot Grid Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
            backgroundSize: '2.5rem 2.5rem',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, #000 60%, transparent 100%)',
          }}
        />

        {/* Emerald & Indigo Ambient Radial Spotlights */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[350px] bg-indigo-500/10 blur-[130px] pointer-events-none" />
      </div>

      {/* ── Real Components Layer Being Constructed Live ── */}
      <div className="relative z-10 w-full min-h-screen flex flex-col pointer-events-none">
        
        {/* 1. Header Navbar Component */}
        <header
          className="sticky top-0 w-full border-b bg-[#040509]/90 border-white/10 backdrop-blur-xl transition-all duration-200"
          style={{
            opacity: stage.navProgress,
            transform: `translateY(${(1 - stage.navProgress) * -16}px)`,
          }}
        >
          <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <Logo size="sm" />
              </div>

              {/* Nav Links */}
              <div className="hidden md:flex items-center space-x-2.5">
                {['Home', 'About', 'Services', 'Portfolio', 'Blog', 'Contact'].map((item, idx) => (
                  <span
                    key={idx}
                    className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl font-display ${
                      idx === 0 ? 'text-emerald-400 bg-white/5 border border-white/10' : 'text-slate-300'
                    }`}
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Client Login CTA */}
              <div className="flex items-center space-x-3">
                <span className="btn-primary text-xs font-bold py-2 px-4 shadow-lg shadow-emerald-500/20">
                  Client Login
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 2. Hero Section Component */}
        <main className="flex-grow flex flex-col items-center justify-start pt-8 sm:pt-12 px-6 sm:px-10 lg:px-14 text-center max-w-[1400px] mx-auto w-full space-y-7">
          
          {/* Location Badge Capsule */}
          <div
            className="transition-all duration-300"
            style={{
              opacity: stage.badgeProgress,
              transform: `scale(${0.9 + stage.badgeProgress * 0.1})`,
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#060913]/90 border border-emerald-500/40 text-emerald-400 text-xs font-extrabold uppercase tracking-widest font-display shadow-2xl backdrop-blur-md">
              <Sparkles size={14} className="text-emerald-400 animate-spin" />
              <span>#1 Web Development &amp; Software Engineering Agency in Udumalpet</span>
            </div>
          </div>

          {/* H1 Headline Title */}
          <div className="min-h-[64px] sm:min-h-[80px] flex items-center justify-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight font-display text-white leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)]">
              {firstPart}
              {solutionsPart && (
                <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                  {solutionsPart}
                </span>
              )}
            </h1>
          </div>

          {/* Subtitle */}
          <div
            className="max-w-2xl mx-auto transition-all duration-300"
            style={{
              opacity: stage.subtitleProgress,
              transform: `translateY(${(1 - stage.subtitleProgress) * 10}px)`,
            }}
          >
            <h2 className="text-lg sm:text-2xl font-extrabold text-white font-display leading-snug drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
              Helping Businesses Grow in Udumalpet &amp; Beyond Through{' '}
              <span className="text-emerald-400 font-black">Websites &amp; Web Apps</span>
            </h2>
          </div>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1 transition-all duration-300"
            style={{
              opacity: stage.ctasProgress,
              transform: `scale(${0.95 + stage.ctasProgress * 0.05})`,
            }}
          >
            <div className="btn-primary flex items-center justify-center gap-2 text-sm font-bold py-3.5 px-8 shadow-xl shadow-blue-500/40 rounded-xl">
              <span>Get Free Consultation</span>
              <ArrowRight size={16} />
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-bold py-3.5 px-8 bg-white/10 text-white border border-white/20 backdrop-blur-md rounded-xl shadow-xl">
              <span>Explore Services</span>
              <ArrowUpRight size={16} />
            </div>
          </div>

          {/* 3. Architecture Showcase Terminal Card */}
          <div
            className="w-full max-w-4xl mx-auto pt-2 transition-all duration-300"
            style={{
              opacity: stage.terminalProgress,
              transform: `scale(${0.96 + stage.terminalProgress * 0.04})`,
            }}
          >
            <div className="rounded-3xl border border-white/15 bg-[#080b14]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-mono text-[11px] text-slate-300 font-semibold">springweb-architecture-v3.ts</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>STATUS: 99.9% UPTIME SLA</span>
                </div>
              </div>

              {/* 4 Metric Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                {/* Card 1 */}
                <div
                  className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 space-y-1 transition-all duration-200"
                  style={{
                    opacity: stage.visibleCardsCount >= 1 ? 1 : 0,
                    transform: stage.visibleCardsCount >= 1 ? 'scale(1)' : 'scale(0.9)',
                  }}
                >
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold uppercase tracking-wider font-display">
                    <Award size={14} /> Completed Projects
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-display">3</div>
                </div>

                {/* Card 2 */}
                <div
                  className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 space-y-1 transition-all duration-200"
                  style={{
                    opacity: stage.visibleCardsCount >= 2 ? 1 : 0,
                    transform: stage.visibleCardsCount >= 2 ? 'scale(1)' : 'scale(0.9)',
                  }}
                >
                  <div className="flex items-center gap-1.5 text-indigo-400 text-[11px] font-bold uppercase tracking-wider font-display">
                    <CheckCircle2 size={14} /> Sprint Delivery
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-display">100%</div>
                </div>

                {/* Card 3 */}
                <div
                  className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 space-y-1 transition-all duration-200"
                  style={{
                    opacity: stage.visibleCardsCount >= 3 ? 1 : 0,
                    transform: stage.visibleCardsCount >= 3 ? 'scale(1)' : 'scale(0.9)',
                  }}
                >
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold uppercase tracking-wider font-display">
                    <Zap size={14} /> PageSpeed
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-display">&lt; 1s Load</div>
                </div>

                {/* Card 4 */}
                <div
                  className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 space-y-1 transition-all duration-200"
                  style={{
                    opacity: stage.visibleCardsCount >= 4 ? 1 : 0,
                    transform: stage.visibleCardsCount >= 4 ? 'scale(1)' : 'scale(0.9)',
                  }}
                >
                  <div className="flex items-center gap-1.5 text-teal-400 text-[11px] font-bold uppercase tracking-wider font-display">
                    <ShieldCheck size={14} /> Uptime SLA
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-display">99.9%</div>
                </div>
              </div>

            </div>
          </div>

          {/* Floating Tech Badges */}
          <div
            className="w-full flex items-center justify-center gap-2 flex-wrap pt-2 transition-all duration-300"
            style={{ opacity: stage.techBadgesProgress }}
          >
            {['<React 19 />', '<Next.js 15 />', 'Kotlin Native', 'WinUI 3 & WPF', 'Supabase SQL', 'WhatsApp CRM'].map((badge, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-white/[0.04] border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold shadow-md backdrop-blur-md"
              >
                {badge}
              </span>
            ))}
          </div>

        </main>
      </div>

      {/* ── Multi-User Design Tool SVG Layer (Guides, Rulers, Sweep) ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
        <defs>
          <filter id="laserGlowHigh" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Laser Snap Guides */}
        {laserGuides.map((guide) => {
          if (guide.orientation === 'horizontal') {
            return (
              <g key={guide.id} opacity={guide.opacity}>
                <line
                  x1={guide.start}
                  y1={guide.pos}
                  x2={guide.end}
                  y2={guide.pos}
                  stroke={guide.color}
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  filter="url(#laserGlowHigh)"
                />
                {guide.label && (
                  <text
                    x={guide.start + 14}
                    y={guide.pos - 5}
                    fill={guide.color}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {guide.label}
                  </text>
                )}
              </g>
            )
          } else {
            return (
              <g key={guide.id} opacity={guide.opacity}>
                <line
                  x1={guide.pos}
                  y1={guide.start}
                  x2={guide.pos}
                  y2={guide.end}
                  stroke={guide.color}
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  filter="url(#laserGlowHigh)"
                />
                {guide.label && (
                  <text
                    x={guide.pos + 6}
                    y={guide.start + 24}
                    fill={guide.color}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {guide.label}
                  </text>
                )}
              </g>
            )
          }
        })}

        {/* Red Distance Gap Indicators for ⌥-Cloned Cards */}
        {distanceRulers.map((dist) => (
          <g key={dist.id}>
            <line x1={dist.x1} y1={dist.y1} x2={dist.x2} y2={dist.y2} stroke={dist.color} strokeWidth="1.5" />
            <line x1={dist.x1} y1={dist.y1 - 4} x2={dist.x1} y2={dist.y1 + 4} stroke={dist.color} strokeWidth="1.5" />
            <line x1={dist.x2} y1={dist.y2 - 4} x2={dist.x2} y2={dist.y2 + 4} stroke={dist.color} strokeWidth="1.5" />
            <rect
              x={(dist.x1 + dist.x2) / 2 - 16}
              y={dist.y1 - 10}
              width="32"
              height="14"
              fill={dist.color}
              rx="3"
            />
            <text
              x={(dist.x1 + dist.x2) / 2}
              y={dist.y1}
              fill="#ffffff"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              {dist.gapPx}px
            </text>
          </g>
        ))}

        {/* Luminous Synthesis Beam (Wave 4) */}
        {stage.sweepY !== null && (
          <g>
            <line
              x1="0"
              y1={stage.sweepY}
              x2={dimensions.width}
              y2={stage.sweepY}
              stroke="#38bdf8"
              strokeWidth="3.5"
              filter="url(#laserGlowHigh)"
            />
          </g>
        )}
      </svg>

      {/* ── Multi-Player Design Cursors ── */}
      {cursorsList.map((cursor) => (
        <SwarmAgentCursor key={cursor.id} cursor={cursor} />
      ))}
    </div>
  )
}
