import React, { useEffect, useRef, useState } from 'react'
import type { SpringCursorState, AgentPersonaId, LaserGuide, DistanceRuler, StudioBox, GhostCard } from '@/lib/swarm/types'
import { AGENT_PERSONAS } from '@/lib/swarm/types'
import { SwarmSpringEngine } from '@/lib/swarm/swarmSpringEngine'
import { SwarmAgentCursor } from './SwarmAgentCursor'
import { swarmAudio } from '@/lib/swarm/audioEngine'

export interface RealDomTargets {
  header: HTMLElement | null
  badge: HTMLElement | null
  h1: HTMLElement | null
  sub: HTMLElement | null
  p: HTMLElement | null
  cta: HTMLElement | null
  terminal: HTMLElement | null
  cards: HTMLElement[]
  services: HTMLElement | null
}

interface SwarmStudioCanvasProps {
  targets: RealDomTargets
  speed?: '1x' | '2x' | '3x'
  soundEnabled?: boolean
  onComplete: () => void
  onDismiss: () => void
}

export const SwarmStudioCanvas: React.FC<SwarmStudioCanvasProps> = ({
  targets,
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
  const animFrameIdRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(performance.now())

  // Dynamic visual artifacts
  const boxesRef = useRef<StudioBox[]>([])
  const laserGuidesRef = useRef<LaserGuide[]>([])
  const distanceRulersRef = useRef<DistanceRuler[]>([])
  const ghostCardRef = useRef<GhostCard | null>(null)
  const sweepYRef = useRef<number | null>(null)
  const audioPlayedRef = useRef<Record<string, boolean>>({})

  // Audio setup
  useEffect(() => {
    swarmAudio.setEnabled(soundEnabled)
  }, [soundEnabled])

  // Resize listener
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

  // Main 60 FPS Animation & Choreography Loop
  useEffect(() => {
    const width = window.innerWidth
    const height = window.innerHeight

    cursorsRef.current = springEngineRef.current.createInitialCursors(width, height)
    startTimeRef.current = performance.now()

    const totalDurationMs = speed === '1x' ? 5200 : speed === '2x' ? 4000 : 3000
    let running = true

    const loop = (now: number) => {
      if (!running) return

      const elapsed = now - startTimeRef.current
      const progress = Math.min(1, elapsed / totalDurationMs)

      const sarah = cursorsRef.current.get('sarah')
      const alex = cursorsRef.current.get('alex')
      const arjun = cursorsRef.current.get('arjun')
      const vikram = cursorsRef.current.get('vikram')

      boxesRef.current = []
      laserGuidesRef.current = []
      distanceRulersRef.current = []
      ghostCardRef.current = null

      // Get real sub-pixel DOM rects
      const headerRect = targets.header?.getBoundingClientRect()
      const badgeRect = targets.badge?.getBoundingClientRect()
      const h1Rect = targets.h1?.getBoundingClientRect()
      const subRect = targets.sub?.getBoundingClientRect()
      const ctaRect = targets.cta?.getBoundingClientRect()
      const terminalRect = targets.terminal?.getBoundingClientRect()
      const cardRects = targets.cards.map((c) => c.getBoundingClientRect())
      const servicesRect = targets.services?.getBoundingClientRect()

      // ─────────────────────────────────────────────────────────────
      // WAVE 1: NAVBAR REBUILD (0% – 18%)
      // ─────────────────────────────────────────────────────────────
      if (progress < 0.18) {
        const p1 = progress / 0.18
        if (headerRect) {
          const dragW = headerRect.width * Math.min(1, p1 * 1.3)

          if (sarah) {
            sarah.targetX = headerRect.left + dragW
            sarah.targetY = headerRect.top + headerRect.height / 2
            sarah.cursorMode = 'crosshair'
            sarah.actionText = `Navbar [${Math.round(dragW)}×${Math.round(headerRect.height)}]`
          }

          boxesRef.current.push({
            id: 'box-navbar',
            x: headerRect.left,
            y: headerRect.top,
            w: dragW,
            h: headerRect.height,
            color: AGENT_PERSONAS.sarah.color,
            label: 'Header Navbar',
            progress: p1,
          })

          if (p1 > 0.3 && targets.header) {
            targets.header.style.opacity = '1'
            targets.header.style.transform = 'scale(1)'
          }

          if (vikram && p1 > 0.4) {
            vikram.targetX = headerRect.right
            vikram.targetY = headerRect.bottom
            vikram.cursorMode = 'arrow'
            vikram.actionText = 'Align Margin Y: 64px'

            if (!audioPlayedRef.current['snap-nav']) {
              swarmAudio.playSnapPop(800)
              audioPlayedRef.current['snap-nav'] = true
            }

            laserGuidesRef.current.push({
              id: 'nav-baseline',
              orientation: 'horizontal',
              pos: headerRect.bottom,
              start: headerRect.left,
              end: headerRect.right,
              color: AGENT_PERSONAS.vikram.color,
              opacity: 0.85,
              label: 'Navbar Baseline',
            })
          }

          if (arjun && p1 > 0.6) {
            arjun.targetX = headerRect.right - 80
            arjun.targetY = headerRect.top + headerRect.height / 2
            arjun.cursorMode = 'arrow'
            arjun.actionText = 'Button: Client Login'
          }
        }
      }

      // ─────────────────────────────────────────────────────────────
      // WAVE 2: HERO HEADLINE & VALUE PROP (18% – 48%)
      // ─────────────────────────────────────────────────────────────
      else if (progress >= 0.18 && progress < 0.48) {
        const p2 = (progress - 0.18) / 0.3
        if (targets.header) {
          targets.header.style.opacity = '1'
          targets.header.style.transform = 'scale(1)'
        }

        // 1. Location Badge Capsule
        if (badgeRect && targets.badge) {
          targets.badge.style.opacity = '1'
          targets.badge.style.transform = 'scale(1)'
          if (sarah) {
            sarah.targetX = badgeRect.left + badgeRect.width / 2
            sarah.targetY = badgeRect.top + badgeRect.height / 2
            sarah.cursorMode = 'crosshair'
            sarah.actionText = 'Badge Capsule'
          }
        }

        // 2. H1 Title Typography
        if (h1Rect && targets.h1) {
          targets.h1.style.opacity = '1'
          targets.h1.style.transform = 'scale(1)'

          boxesRef.current.push({
            id: 'box-h1',
            x: h1Rect.left - 8,
            y: h1Rect.top - 6,
            w: h1Rect.width + 16,
            h: h1Rect.height + 12,
            color: AGENT_PERSONAS.alex.color,
            label: 'H1 Typography',
            progress: 1,
          })

          if (alex) {
            alex.targetX = h1Rect.left + (h1Rect.width * Math.min(1, p2 * 1.4))
            alex.targetY = h1Rect.top + h1Rect.height / 2
            alex.cursorMode = 'caret'
            alex.actionText = 'Typing H1'
            alex.typewriterText = 'Spring Web Solutions'

            if (Math.random() < 0.3) {
              swarmAudio.playTypewriterTick()
            }
          }
        }

        // 3. Subtitle & CTAs
        if (p2 > 0.4 && targets.sub) {
          targets.sub.style.opacity = '1'
          targets.sub.style.transform = 'scale(1)'
        }
        if (p2 > 0.5 && targets.p) {
          targets.p.style.opacity = '1'
          targets.p.style.transform = 'scale(1)'
        }

        if (p2 > 0.7 && ctaRect && targets.cta) {
          targets.cta.style.opacity = '1'
          targets.cta.style.transform = 'scale(1)'

          if (arjun) {
            arjun.targetX = ctaRect.left + ctaRect.width / 4
            arjun.targetY = ctaRect.top + ctaRect.height / 2
            arjun.cursorMode = 'arrow'
            arjun.actionText = 'CTA: Free Consultation'

            if (!audioPlayedRef.current['snap-cta']) {
              swarmAudio.playSnapPop(580)
              audioPlayedRef.current['snap-cta'] = true
            }
          }
        }
      }

      // ─────────────────────────────────────────────────────────────
      // WAVE 3: ARCHITECTURE TERMINAL & ⌥-GHOST DRAGGED CARDS (48% – 76%)
      // ─────────────────────────────────────────────────────────────
      else if (progress >= 0.48 && progress < 0.76) {
        const p3 = (progress - 0.48) / 0.28

        // Guarantee hero elements are visible
        if (targets.badge) targets.badge.style.opacity = '1'
        if (targets.h1) targets.h1.style.opacity = '1'
        if (targets.sub) targets.sub.style.opacity = '1'
        if (targets.p) targets.p.style.opacity = '1'
        if (targets.cta) targets.cta.style.opacity = '1'

        // Terminal Box Framing
        if (terminalRect && targets.terminal) {
          targets.terminal.style.opacity = '1'
          targets.terminal.style.transform = 'scale(1)'

          if (sarah) {
            sarah.targetX = terminalRect.right
            sarah.targetY = terminalRect.bottom
            sarah.cursorMode = 'crosshair'
            sarah.actionText = 'Architecture Terminal Box'
          }

          boxesRef.current.push({
            id: 'box-terminal',
            x: terminalRect.left,
            y: terminalRect.top,
            w: terminalRect.width,
            h: terminalRect.height,
            color: AGENT_PERSONAS.sarah.color,
            label: 'Architecture Terminal Box',
            progress: 1,
          })
        }

        // ⌥-Option Dragging Cards 1 to 4
        if (cardRects.length >= 4) {
          const rawStep = p3 * 4.2
          const activeIdx = Math.min(3, Math.floor(rawStep))
          const stepSub = Math.min(1, rawStep - activeIdx)

          // Reveal completed cards
          for (let i = 0; i <= activeIdx; i++) {
            if (targets.cards[i]) {
              targets.cards[i].style.opacity = '1'
              targets.cards[i].style.transform = 'scale(1)'
            }
          }

          if (arjun) {
            if (activeIdx === 0) {
              arjun.targetX = cardRects[0].left + cardRects[0].width / 2
              arjun.targetY = cardRects[0].top + cardRects[0].height / 2
              arjun.cursorMode = 'crosshair'
              arjun.actionText = 'Card 1: Base Metric'

              if (!audioPlayedRef.current['card-0']) {
                swarmAudio.playSnapPop(520)
                audioPlayedRef.current['card-0'] = true
              }
            } else {
              // Ghost card slides from previous card to target card!
              const prevRect = cardRects[activeIdx - 1]
              const targetRect = cardRects[activeIdx]

              const ghostX = prevRect.left + (targetRect.left - prevRect.left) * stepSub
              const ghostY = targetRect.top

              arjun.targetX = ghostX + targetRect.width / 2
              arjun.targetY = ghostY + targetRect.height / 2
              arjun.cursorMode = 'clone'
              arjun.actionText = `⌥ Dragging Card ${activeIdx + 1}`

              ghostCardRef.current = {
                x: ghostX,
                y: ghostY,
                w: targetRect.width,
                h: targetRect.height,
                opacity: 0.75,
              }

              distanceRulersRef.current.push({
                id: 'dist-ruler',
                x1: prevRect.right,
                y1: targetRect.top + targetRect.height / 2,
                x2: Math.max(prevRect.right + 4, ghostX),
                y2: targetRect.top + targetRect.height / 2,
                gapPx: Math.round(Math.max(4, ghostX - prevRect.right)),
                color: '#f43f5e',
              })

              const audioKey = `card-${activeIdx}`
              if (!audioPlayedRef.current[audioKey] && stepSub > 0.8) {
                swarmAudio.playSnapPop(520 + activeIdx * 50)
                audioPlayedRef.current[audioKey] = true
              }
            }
          }
        }
      }

      // ─────────────────────────────────────────────────────────────
      // WAVE 4: SERVICES SECTION FRAMING (76% – 88%)
      // ─────────────────────────────────────────────────────────────
      else if (progress >= 0.76 && progress < 0.88) {
        const p4 = (progress - 0.76) / 0.12

        // Reveal all cards
        targets.cards.forEach((c) => {
          c.style.opacity = '1'
          c.style.transform = 'scale(1)'
        })

        if (servicesRect && targets.services) {
          targets.services.style.opacity = '1'
          targets.services.style.transform = 'scale(1)'

          if (sarah) {
            sarah.targetX = servicesRect.left + servicesRect.width * Math.min(1, p4 * 1.3)
            sarah.targetY = servicesRect.top + 80
            sarah.cursorMode = 'crosshair'
            sarah.actionText = 'Section: Engineered Services'
          }

          boxesRef.current.push({
            id: 'box-services',
            x: servicesRect.left,
            y: servicesRect.top,
            w: servicesRect.width * Math.min(1, p4 * 1.3),
            h: 120,
            color: AGENT_PERSONAS.sarah.color,
            label: 'Section: Engineered Services',
            progress: p4,
          })
        }
      }

      // ─────────────────────────────────────────────────────────────
      // WAVE 5: LIVE SYNTHESIS SWEEP & UNLOCK (88% – 100%)
      // ─────────────────────────────────────────────────────────────
      else {
        const p5 = (progress - 0.88) / 0.12

        // Reveal all components
        if (targets.header) targets.header.style.opacity = '1'
        if (targets.badge) targets.badge.style.opacity = '1'
        if (targets.h1) targets.h1.style.opacity = '1'
        if (targets.sub) targets.sub.style.opacity = '1'
        if (targets.p) targets.p.style.opacity = '1'
        if (targets.cta) targets.cta.style.opacity = '1'
        if (targets.terminal) targets.terminal.style.opacity = '1'
        targets.cards.forEach((c) => (c.style.opacity = '1'))
        if (targets.services) targets.services.style.opacity = '1'

        // Laser sweep beam wipes down the page
        sweepYRef.current = p5 * (height + 120)

        // Cursors scatter outward in celebration
        cursorsRef.current.forEach((cursor, id) => {
          cursor.cursorMode = 'arrow'
          cursor.actionText = 'Live'
          cursor.typewriterText = ''
          if (id === 'sarah') cursor.targetY = -80
          if (id === 'alex') cursor.targetX = -80
          if (id === 'arjun') cursor.targetX = width + 80
          if (id === 'vikram') cursor.targetY = height + 80
        })

        if (!audioPlayedRef.current['chime-finish']) {
          swarmAudio.playCompletionChime()
          audioPlayedRef.current['chime-finish'] = true
        }

        if (progress >= 1 && running) {
          running = false
          onComplete()
        }
      }

      // Update Cursor Spring Physics
      const speedMult = speed === '1x' ? 1 : speed === '2x' ? 1.6 : 2.2
      springEngineRef.current.update(cursorsRef.current, speedMult, 1)

      setFrameTick((prev) => (prev + 1) % 1000)
      animFrameIdRef.current = requestAnimationFrame(loop)
    }

    animFrameIdRef.current = requestAnimationFrame(loop)

    return () => {
      running = false
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
    }
  }, [speed, onComplete, targets])

  const boxes = boxesRef.current
  const laserGuides = laserGuidesRef.current
  const distanceRulers = distanceRulersRef.current
  const ghostCard = ghostCardRef.current
  const sweepY = sweepYRef.current
  const cursorsList = Array.from(cursorsRef.current.values())

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-[9999] cursor-pointer select-none pointer-events-none overflow-hidden"
      title="Click or press Esc to skip animation"
    >
      {/* ── Multi-User Design Tool SVG Layer (Wireframes, Brackets, Guides, Sweep) ── */}
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

        {/* 1. Active Figma Bounding Boxes with Corner Handles ⌜ ⌝ ⌞ ⌟ */}
        {boxes.map((box) => {
          const w = Math.max(2, box.w)
          const h = Math.max(2, box.h)
          const handle = 5

          return (
            <g key={box.id}>
              {/* Dashed selection rect */}
              <rect
                x={box.x}
                y={box.y}
                width={w}
                height={h}
                fill={`${box.color}10`}
                stroke={box.color}
                strokeWidth="1.5"
                strokeDasharray="6 4"
                rx="6"
              />

              {/* Corner Figma Brackets */}
              <rect x={box.x - 2} y={box.y - 2} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1" />
              <rect x={box.x + w - 3} y={box.y - 2} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1" />
              <rect x={box.x - 2} y={box.y + h - 3} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1" />
              <rect x={box.x + w - 3} y={box.y + h - 3} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1" />
            </g>
          )
        })}

        {/* 2. Ghost Card Being Actively Option-Dragged across Columns */}
        {ghostCard && (
          <g opacity={ghostCard.opacity}>
            <rect
              x={ghostCard.x}
              y={ghostCard.y}
              width={ghostCard.w}
              height={ghostCard.h}
              fill="rgba(168, 85, 247, 0.25)"
              stroke="#a855f7"
              strokeWidth="2"
              strokeDasharray="4 3"
              rx="16"
            />
            <rect
              x={ghostCard.x + 8}
              y={ghostCard.y - 12}
              width="64"
              height="16"
              fill="#a855f7"
              rx="4"
            />
            <text
              x={ghostCard.x + 12}
              y={ghostCard.y}
              fill="#ffffff"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              ⌥ CLONE
            </text>
          </g>
        )}

        {/* 3. Laser Snap Guides */}
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
              </g>
            )
          }
        })}

        {/* 4. Red Distance Gap Indicators for ⌥-Cloned Cards */}
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

        {/* 5. Luminous Synthesis Beam (Wave 5) */}
        {sweepY !== null && (
          <g>
            <line
              x1="0"
              y1={sweepY}
              x2={dimensions.width}
              y2={sweepY}
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
