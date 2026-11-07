import React, { useEffect, useRef, useState } from 'react'
import type {
  SpringCursorState,
  AgentPersonaId,
  LaserGuide,
  DistanceRuler,
  StudioBox,
  GhostCard,
  RealDomTargets,
} from '@/lib/swarm/types'
import { AGENT_PERSONAS } from '@/lib/swarm/types'
import { SwarmSpringEngine } from '@/lib/swarm/swarmSpringEngine'
import { SwarmAgentCursor } from './SwarmAgentCursor'
import { swarmAudio } from '@/lib/swarm/audioEngine'

interface ClickRipple {
  id: string
  x: number
  y: number
  color: string
  radius: number
  opacity: number
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

  // Dynamic visual studio artifacts
  const boxesRef = useRef<StudioBox[]>([])
  const laserGuidesRef = useRef<LaserGuide[]>([])
  const distanceRulersRef = useRef<DistanceRuler[]>([])
  const ripplesRef = useRef<ClickRipple[]>([])
  const ghostCardRef = useRef<GhostCard | null>(null)
  const sweepYRef = useRef<number | null>(null)
  const audioPlayedRef = useRef<Record<string, boolean>>({})

  // Helper to spawn a visual click ripple
  const triggerClickRipple = (x: number, y: number, color: string) => {
    ripplesRef.current.push({
      id: `ripple-${Math.random()}`,
      x,
      y,
      color,
      radius: 4,
      opacity: 0.9,
    })
  }

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

  // Esc key & global pointer click/tap listener for instant skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onDismiss()
      }
    }
    const handlePointerDismiss = () => {
      onDismiss()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('click', handlePointerDismiss, { capture: true })
    window.addEventListener('touchend', handlePointerDismiss, { capture: true })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('click', handlePointerDismiss, { capture: true })
      window.removeEventListener('touchend', handlePointerDismiss, { capture: true })
    }
  }, [onDismiss])

  // Lock body scroll during animation to prevent coordinate drift
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  // Main 60 FPS Swarm Studio Construction Loop
  useEffect(() => {
    const width = window.innerWidth
    const height = window.innerHeight

    cursorsRef.current = springEngineRef.current.createInitialCursors(width, height)
    startTimeRef.current = performance.now()

    const totalDurationMs = speed === '1x' ? 5600 : speed === '2x' ? 4400 : 3400
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

      // Age and update click ripples
      ripplesRef.current = ripplesRef.current
        .map((r) => ({
          ...r,
          radius: r.radius + 2.8,
          opacity: r.opacity - 0.045,
        }))
        .filter((r) => r.opacity > 0.05 && r.radius < 65)

      // Get real sub-pixel DOM rects
      const headerRect = targets.header?.getBoundingClientRect()
      const badgeRect = targets.badge?.getBoundingClientRect()
      const h1Rect = targets.h1?.getBoundingClientRect()
      const subRect = targets.sub?.getBoundingClientRect()
      const btn1Rect = targets.ctaPrimary?.getBoundingClientRect()
      const btn2Rect = targets.ctaSecondary?.getBoundingClientRect()
      const terminalRect = targets.terminal?.getBoundingClientRect()
      const terminalHeaderRect = targets.terminalHeader?.getBoundingClientRect()
      const cardRects = targets.cards.map((c) => c.getBoundingClientRect())
      const servicesRect = targets.services?.getBoundingClientRect()

      // ─────────────────────────────────────────────────────────────
      // WAVE 1: NAVBAR REBUILD & SCREEN BLUEPRINT (0% – 20%)
      // ─────────────────────────────────────────────────────────────
      if (progress < 0.2) {
        const p1 = progress / 0.2

        if (headerRect) {
          const dragW = headerRect.width * Math.min(1, p1 * 1.35)

          // Sarah: Drags Navbar Marquee Frame
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

          if (p1 > 0.22 && targets.header) {
            targets.header.style.opacity = '1'
            targets.header.style.transform = 'scale(1)'
          }

          // Alex: Assembles Brand Logo & Navigation Links
          if (alex) {
            if (p1 < 0.5) {
              alex.targetX = headerRect.left + 50
              alex.targetY = headerRect.top + headerRect.height / 2
              alex.cursorMode = 'arrow'
              alex.actionText = 'Brand Emblem'
              if (!audioPlayedRef.current['logo-drop'] && p1 > 0.2) {
                triggerClickRipple(alex.targetX, alex.targetY, AGENT_PERSONAS.alex.color)
                swarmAudio.playSnapPop(700)
                audioPlayedRef.current['logo-drop'] = true
              }
            } else {
              alex.targetX = headerRect.left + headerRect.width * 0.42
              alex.targetY = headerRect.top + headerRect.height / 2
              alex.cursorMode = 'crosshair'
              alex.actionText = 'Nav Links Menu'
            }
          }

          // Arjun: Stretches right-side Arcade & Theme actions
          if (arjun) {
            arjun.targetX = headerRect.right - 80 + Math.sin(p1 * Math.PI) * 15
            arjun.targetY = headerRect.top + headerRect.height / 2
            arjun.cursorMode = 'arrow'
            arjun.actionText = 'Action Controls'
          }

          // Vikram: Snaps horizontal baseline guide across the entire viewport
          if (vikram) {
            vikram.targetX = headerRect.right
            vikram.targetY = headerRect.bottom
            vikram.cursorMode = 'arrow'
            vikram.actionText = 'Baseline Y: 64px'

            if (!audioPlayedRef.current['snap-nav'] && p1 > 0.35) {
              triggerClickRipple(headerRect.left + dragW, headerRect.bottom, AGENT_PERSONAS.vikram.color)
              swarmAudio.playSnapPop(800)
              audioPlayedRef.current['snap-nav'] = true
            }

            laserGuidesRef.current.push({
              id: 'nav-baseline',
              orientation: 'horizontal',
              pos: headerRect.bottom,
              start: 0,
              end: dimensions.width,
              color: AGENT_PERSONAS.vikram.color,
              opacity: 0.85,
              label: 'Navbar Baseline Align',
            })
          }
        }
      }

      // ─────────────────────────────────────────────────────────────
      // WAVE 2: PARALLEL TYPOGRAPHY & PROGRESSIVE TYPING (20% – 50%)
      // ─────────────────────────────────────────────────────────────
      else if (progress >= 0.2 && progress < 0.5) {
        const p2 = (progress - 0.2) / 0.3
        if (targets.header) {
          targets.header.style.opacity = '1'
          targets.header.style.transform = 'scale(1)'
        }

        // ── Sarah: Draws Location Badge Capsule (20% – 26%) ──
        if (badgeRect && targets.badge) {
          const pBadge = Math.min(1, p2 / 0.2)
          if (sarah) {
            sarah.targetX = badgeRect.left + badgeRect.width * pBadge
            sarah.targetY = badgeRect.top + badgeRect.height / 2
            sarah.cursorMode = 'crosshair'
            sarah.actionText = `Badge [${Math.round(badgeRect.width)}×${Math.round(badgeRect.height)}]`
          }

          boxesRef.current.push({
            id: 'box-badge',
            x: badgeRect.left,
            y: badgeRect.top,
            w: badgeRect.width * pBadge,
            h: badgeRect.height,
            color: AGENT_PERSONAS.sarah.color,
            label: 'Badge Capsule',
            progress: pBadge,
          })

          if (pBadge > 0.3) {
            targets.badge.style.opacity = '1'
            targets.badge.style.transform = 'scale(1)'
            if (!audioPlayedRef.current['snap-badge']) {
              triggerClickRipple(badgeRect.left + badgeRect.width / 2, badgeRect.top + badgeRect.height / 2, AGENT_PERSONAS.sarah.color)
              swarmAudio.playSnapPop(720)
              audioPlayedRef.current['snap-badge'] = true
            }
          }
        }

        // ── Alex: Types H1 Headline Progressive Characters (24% – 42%) ──
        if (h1Rect && targets.h1) {
          const pH1 = Math.min(1, Math.max(0, (p2 - 0.12) / 0.55))

          if (alex) {
            alex.targetX = h1Rect.left + (h1Rect.width * pH1)
            alex.targetY = h1Rect.top + h1Rect.height / 2
            alex.cursorMode = 'caret'
            alex.actionText = 'Typing: Spring Web Solutions'
            alex.typewriterText = 'Spring Web Solutions'

            if (pH1 > 0.05 && pH1 < 0.96 && Math.random() < 0.4) {
              swarmAudio.playTypewriterTick()
            }
          }

          boxesRef.current.push({
            id: 'box-h1',
            x: h1Rect.left - 6,
            y: h1Rect.top - 4,
            w: Math.max(4, h1Rect.width * pH1 + 8),
            h: h1Rect.height + 8,
            color: AGENT_PERSONAS.alex.color,
            label: 'H1 Typography',
            progress: pH1,
          })

          // Progressive in-place reveal via sub-pixel clipPath
          targets.h1.style.opacity = '1'
          targets.h1.style.transition = 'none'
          if (pH1 < 0.98) {
            targets.h1.style.clipPath = `inset(0 ${Math.max(0, (1 - pH1) * 100).toFixed(2)}% 0 0)`
          } else {
            targets.h1.style.clipPath = ''
          }
        }

        // ── Arjun: Previews CTA Button Anchors simultaneously ──
        if (btn1Rect && arjun) {
          arjun.targetX = btn1Rect.left + btn1Rect.width / 2
          arjun.targetY = btn1Rect.top + btn1Rect.height / 2
          arjun.cursorMode = 'crosshair'
          arjun.actionText = 'Primary CTA Frame'
        }

        // ── Vikram: Snaps Left Margin Laser Guide ──
        if (h1Rect && vikram) {
          vikram.targetX = h1Rect.left
          vikram.targetY = h1Rect.bottom + 12
          vikram.cursorMode = 'arrow'
          vikram.actionText = 'Left Margin Align: 0px'

          laserGuidesRef.current.push({
            id: 'h1-left-align',
            orientation: 'vertical',
            pos: h1Rect.left,
            start: h1Rect.top - 20,
            end: (subRect ? subRect.bottom : h1Rect.bottom) + 40,
            color: AGENT_PERSONAS.vikram.color,
            opacity: 0.8,
            label: 'Content Left Align',
          })
        }

        // ── Alex transitions to H2 Subtitle (40% – 50%) ──
        if (p2 > 0.65 && subRect && targets.sub) {
          const pSub = Math.min(1, Math.max(0, (p2 - 0.65) / 0.35))

          if (alex) {
            alex.targetX = subRect.left + (subRect.width * pSub)
            alex.targetY = subRect.top + subRect.height / 2
            alex.cursorMode = 'caret'
            alex.actionText = 'Typing H2 Subtitle'

            if (pSub > 0.05 && pSub < 0.95 && Math.random() < 0.32) {
              swarmAudio.playTypewriterTick()
            }
          }

          boxesRef.current.push({
            id: 'box-sub',
            x: subRect.left - 4,
            y: subRect.top - 2,
            w: Math.max(4, subRect.width * pSub + 6),
            h: subRect.height + 4,
            color: AGENT_PERSONAS.alex.color,
            label: 'H2 Subtitle',
            progress: pSub,
          })

          targets.sub.style.opacity = '1'
          targets.sub.style.transition = 'none'
          if (pSub < 0.98) {
            targets.sub.style.clipPath = `inset(0 ${Math.max(0, (1 - pSub) * 100).toFixed(2)}% 0 0)`
          } else {
            targets.sub.style.clipPath = ''
          }

          if (pSub > 0.35 && targets.p) {
            targets.p.style.opacity = '1'
            targets.p.style.transition = 'opacity 0.35s ease'
          }
        }
      }

      // ─────────────────────────────────────────────────────────────
      // WAVE 3: BUTTONS & SEGMENTATION FORMING (50% – 72%)
      // ─────────────────────────────────────────────────────────────
      else if (progress >= 0.5 && progress < 0.72) {
        const p3 = (progress - 0.5) / 0.22

        // Guarantee all typography is 100% visible and unclipped
        if (targets.badge) targets.badge.style.opacity = '1'
        if (targets.h1) {
          targets.h1.style.opacity = '1'
          targets.h1.style.clipPath = ''
        }
        if (targets.sub) {
          targets.sub.style.opacity = '1'
          targets.sub.style.clipPath = ''
        }
        if (targets.p) targets.p.style.opacity = '1'

        // ── 3A: PARALLEL BUTTONS FORMING (50% – 62%) ──
        if (p3 < 0.5) {
          const pBtns = p3 / 0.5

          // Button 1: Primary CTA ("Get Free Consultation")
          if (btn1Rect && targets.ctaPrimary) {
            const pBtn1 = Math.min(1, pBtns * 1.5)

            if (sarah) {
              sarah.targetX = btn1Rect.left + btn1Rect.width * pBtn1
              sarah.targetY = btn1Rect.top + btn1Rect.height / 2
              sarah.cursorMode = 'crosshair'
              sarah.actionText = `CTA 1 [${Math.round(btn1Rect.width)}×${Math.round(btn1Rect.height)}]`
            }

            boxesRef.current.push({
              id: 'box-btn-primary',
              x: btn1Rect.left,
              y: btn1Rect.top,
              w: Math.max(4, btn1Rect.width * pBtn1),
              h: btn1Rect.height,
              color: AGENT_PERSONAS.sarah.color,
              label: 'Button: Primary CTA',
              progress: pBtn1,
            })

            if (pBtn1 > 0.35) {
              targets.ctaPrimary.style.opacity = '1'
              targets.ctaPrimary.style.transform = 'scale(1)'
              targets.ctaPrimary.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'

              if (!audioPlayedRef.current['snap-btn1']) {
                triggerClickRipple(btn1Rect.left + btn1Rect.width / 2, btn1Rect.top + btn1Rect.height / 2, AGENT_PERSONAS.sarah.color)
                swarmAudio.playSnapPop(640)
                audioPlayedRef.current['snap-btn1'] = true
              }
            }
          }

          // Button 2: Secondary CTA ("Explore Services") & Red Distance Ruler
          if (pBtns > 0.35 && btn2Rect && targets.ctaSecondary) {
            const pBtn2 = Math.min(1, (pBtns - 0.35) / 0.65)

            if (arjun) {
              arjun.targetX = btn2Rect.left + btn2Rect.width * pBtn2
              arjun.targetY = btn2Rect.top + btn2Rect.height / 2
              arjun.cursorMode = 'arrow'
              arjun.actionText = `CTA 2 [${Math.round(btn2Rect.width)}×${Math.round(btn2Rect.height)}]`
            }

            boxesRef.current.push({
              id: 'box-btn-secondary',
              x: btn2Rect.left,
              y: btn2Rect.top,
              w: Math.max(4, btn2Rect.width * pBtn2),
              h: btn2Rect.height,
              color: AGENT_PERSONAS.arjun.color,
              label: 'Button: Secondary CTA',
              progress: pBtn2,
            })

            if (btn1Rect && btn2Rect) {
              distanceRulersRef.current.push({
                id: 'dist-buttons',
                x1: btn1Rect.right,
                y1: btn1Rect.top + btn1Rect.height / 2,
                x2: btn2Rect.left,
                y2: btn2Rect.top + btn2Rect.height / 2,
                gapPx: Math.round(Math.max(4, btn2Rect.left - btn1Rect.right)),
                color: '#f43f5e',
              })
            }

            if (pBtn2 > 0.35) {
              targets.ctaSecondary.style.opacity = '1'
              targets.ctaSecondary.style.transform = 'scale(1)'
              targets.ctaSecondary.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'

              if (!audioPlayedRef.current['snap-btn2']) {
                triggerClickRipple(btn2Rect.left + btn2Rect.width / 2, btn2Rect.top + btn2Rect.height / 2, AGENT_PERSONAS.arjun.color)
                swarmAudio.playSnapPop(720)
                audioPlayedRef.current['snap-btn2'] = true
              }
            }
          }

          // Vikram: Verifies baseline across both CTA buttons
          if (btn1Rect && vikram) {
            vikram.targetX = btn1Rect.right + 20
            vikram.targetY = btn1Rect.bottom
            vikram.cursorMode = 'arrow'
            vikram.actionText = 'CTA Baseline Align'

            laserGuidesRef.current.push({
              id: 'cta-baseline',
              orientation: 'horizontal',
              pos: btn1Rect.bottom,
              start: btn1Rect.left - 20,
              end: (btn2Rect ? btn2Rect.right : btn1Rect.right) + 20,
              color: AGENT_PERSONAS.vikram.color,
              opacity: 0.75,
              label: 'CTA Alignment',
            })
          }
        }

        // ── 3B: TERMINAL CONTAINER & WINDOW CONTROLS (62% – 72%) ──
        else {
          const pTerm = (p3 - 0.5) / 0.5

          if (targets.ctaPrimary) targets.ctaPrimary.style.opacity = '1'
          if (targets.ctaSecondary) targets.ctaSecondary.style.opacity = '1'

          // Sarah: Frames Terminal Window Box
          if (terminalRect && targets.terminal) {
            targets.terminal.style.opacity = '1'
            targets.terminal.style.transform = 'scale(1)'

            if (sarah) {
              sarah.targetX = terminalRect.right
              sarah.targetY = terminalRect.bottom
              sarah.cursorMode = 'crosshair'
              sarah.actionText = `Terminal [${Math.round(terminalRect.width)}×${Math.round(terminalRect.height)}]`
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

          // Alex: Stamps the 3 window controls in sequence (Red, Amber, Green) + tab
          if (terminalHeaderRect && targets.terminalHeader && alex) {
            targets.terminalHeader.style.opacity = '1'
            targets.terminalHeader.style.transform = 'scale(1)'

            const dotX = terminalHeaderRect.left + 24
            const dotY = terminalHeaderRect.top + 10

            alex.targetX = dotX + pTerm * 40
            alex.targetY = dotY
            alex.cursorMode = 'arrow'
            alex.actionText = 'Window Controls (●●●)'

            if (!audioPlayedRef.current['dot-0'] && pTerm > 0.1) {
              triggerClickRipple(dotX, dotY, '#ef4444')
              swarmAudio.playDotPop(0)
              audioPlayedRef.current['dot-0'] = true
            }
            if (!audioPlayedRef.current['dot-1'] && pTerm > 0.3) {
              triggerClickRipple(dotX + 16, dotY, '#f59e0b')
              swarmAudio.playDotPop(1)
              audioPlayedRef.current['dot-1'] = true
            }
            if (!audioPlayedRef.current['dot-2'] && pTerm > 0.5) {
              triggerClickRipple(dotX + 32, dotY, '#10b981')
              swarmAudio.playDotPop(2)
              audioPlayedRef.current['dot-2'] = true
            }

            boxesRef.current.push({
              id: 'box-tab',
              x: terminalHeaderRect.left + 72,
              y: terminalHeaderRect.top + 2,
              w: 210,
              h: 22,
              color: AGENT_PERSONAS.alex.color,
              label: 'Segment: architecture-v3.ts',
              progress: 1,
            })
          }

          // Vikram: Stamps the SLA status pill on the right
          if (terminalHeaderRect && vikram) {
            vikram.targetX = terminalHeaderRect.right - 100
            vikram.targetY = terminalHeaderRect.top + 10
            vikram.cursorMode = 'arrow'
            vikram.actionText = 'STATUS: 99.9% UPTIME'

            if (!audioPlayedRef.current['snap-sla'] && pTerm > 0.6) {
              triggerClickRipple(terminalHeaderRect.right - 100, terminalHeaderRect.top + 10, AGENT_PERSONAS.vikram.color)
              swarmAudio.playSnapPop(850)
              audioPlayedRef.current['snap-sla'] = true
            }
          }
        }
      }

      // ─────────────────────────────────────────────────────────────
      // WAVE 4: METRIC CARD CLONING & DISTANCE RULERS (72% – 88%)
      // ─────────────────────────────────────────────────────────────
      else if (progress >= 0.72 && progress < 0.88) {
        const p4 = (progress - 0.72) / 0.16

        // Reveal buttons & terminal header
        if (targets.ctaPrimary) targets.ctaPrimary.style.opacity = '1'
        if (targets.ctaSecondary) targets.ctaSecondary.style.opacity = '1'
        if (targets.terminalHeader) targets.terminalHeader.style.opacity = '1'

        // ⌥-Option Dragging Cards across the 4 Columns
        if (cardRects.length >= 4) {
          const rawStep = p4 * 4.2
          const activeIdx = Math.min(3, Math.floor(rawStep))
          const stepSub = Math.min(1, rawStep - activeIdx)

          // Reveal completed cards
          for (let i = 0; i <= activeIdx; i++) {
            if (targets.cards[i]) {
              targets.cards[i].style.opacity = '1'
              targets.cards[i].style.transform = 'scale(1)'
              targets.cards[i].style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'
            }
          }

          if (arjun) {
            if (activeIdx === 0) {
              arjun.targetX = cardRects[0].left + cardRects[0].width / 2
              arjun.targetY = cardRects[0].top + cardRects[0].height / 2
              arjun.cursorMode = 'crosshair'
              arjun.actionText = `Card 1: [${Math.round(cardRects[0].width)}×${Math.round(cardRects[0].height)}]`

              if (!audioPlayedRef.current['card-0']) {
                triggerClickRipple(arjun.targetX, arjun.targetY, AGENT_PERSONAS.arjun.color)
                swarmAudio.playSnapPop(520)
                audioPlayedRef.current['card-0'] = true
              }
            } else {
              // Ghost card slides smoothly from previous card to target column!
              const prevRect = cardRects[activeIdx - 1]
              const targetRect = cardRects[activeIdx]

              const ghostX = prevRect.left + (targetRect.left - prevRect.left) * stepSub
              const ghostY = targetRect.top

              arjun.targetX = ghostX + targetRect.width / 2
              arjun.targetY = ghostY + targetRect.height / 2
              arjun.cursorMode = 'clone'
              arjun.actionText = `⌥ Clone Metric Card ${activeIdx + 1}`

              ghostCardRef.current = {
                x: ghostX,
                y: ghostY,
                w: targetRect.width,
                h: targetRect.height,
                opacity: 0.8,
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
                triggerClickRipple(targetRect.left + targetRect.width / 2, targetRect.top + targetRect.height / 2, AGENT_PERSONAS.arjun.color)
                swarmAudio.playSnapPop(520 + activeIdx * 55)
                audioPlayedRef.current[audioKey] = true
              }
            }
          }

          // Sarah: Frames Section Heading below terminal
          if (servicesRect && targets.services && sarah) {
            targets.services.style.opacity = '1'
            targets.services.style.transform = 'scale(1)'

            sarah.targetX = servicesRect.left + servicesRect.width * Math.min(1, p4 * 1.3)
            sarah.targetY = servicesRect.top + 80
            sarah.cursorMode = 'crosshair'
            sarah.actionText = 'Section: Engineered Services'

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

          // Vikram: Full baseline alignment guide across all 4 cards
          if (vikram && cardRects[0] && cardRects[3]) {
            laserGuidesRef.current.push({
              id: 'cards-baseline',
              orientation: 'horizontal',
              pos: cardRects[0].bottom,
              start: cardRects[0].left - 10,
              end: cardRects[3].right + 10,
              color: AGENT_PERSONAS.vikram.color,
              opacity: 0.85,
              label: 'Metric Cards Baseline Align',
            })
          }
        }
      }

      // ─────────────────────────────────────────────────────────────
      // WAVE 5: LIVE SYNTHESIS SWEEP & PRODUCTION BAKE (88% – 100%)
      // ─────────────────────────────────────────────────────────────
      else {
        const p5 = (progress - 0.88) / 0.12

        // Reveal all components with zero clips
        if (targets.header) targets.header.style.opacity = '1'
        if (targets.badge) targets.badge.style.opacity = '1'
        if (targets.h1) {
          targets.h1.style.opacity = '1'
          targets.h1.style.clipPath = ''
        }
        if (targets.sub) {
          targets.sub.style.opacity = '1'
          targets.sub.style.clipPath = ''
        }
        if (targets.p) targets.p.style.opacity = '1'
        if (targets.ctaPrimary) targets.ctaPrimary.style.opacity = '1'
        if (targets.ctaSecondary) targets.ctaSecondary.style.opacity = '1'
        if (targets.terminal) targets.terminal.style.opacity = '1'
        if (targets.terminalHeader) targets.terminalHeader.style.opacity = '1'
        targets.cards.forEach((c) => (c.style.opacity = '1'))
        if (targets.services) targets.services.style.opacity = '1'

        // Laser sweep beam wipes down the page
        sweepYRef.current = p5 * (height + 140)

        // Cursors scatter outward in celebration
        cursorsRef.current.forEach((cursor, id) => {
          cursor.cursorMode = 'arrow'
          cursor.actionText = 'Live'
          cursor.typewriterText = ''
          if (id === 'sarah') cursor.targetY = -90
          if (id === 'alex') cursor.targetX = -90
          if (id === 'arjun') cursor.targetX = width + 90
          if (id === 'vikram') cursor.targetY = height + 90
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
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
    }
  }, [targets, speed, onComplete])

  const cursorsList = Array.from(cursorsRef.current.values())
  const boxes = boxesRef.current
  const laserGuides = laserGuidesRef.current
  const distanceRulers = distanceRulersRef.current
  const ripples = ripplesRef.current
  const ghostCard = ghostCardRef.current
  const sweepY = sweepYRef.current

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none"
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* ── Studio Architectural Blueprint Underlay ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        width={dimensions.width}
        height={dimensions.height}
      >
        <defs>
          {/* Studio Dot Matrix Pattern */}
          <pattern id="swarmDotGrid" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="18" cy="18" r="1.1" fill="rgba(255, 255, 255, 0.08)" />
          </pattern>

          {/* High Glow Filter */}
          <filter id="laserGlowHigh" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Blueprint Grid (fades out as site synthesizes) */}
        {sweepY === null && (
          <rect width="100%" height="100%" fill="url(#swarmDotGrid)" opacity="0.75" />
        )}

        {/* 1. Active Bounding Boxes with 8 Corner/Edge Anchor Handles & Studio Header Tag Pills */}
        {boxes.map((box) => {
          const w = Math.max(4, box.w)
          const h = Math.max(4, box.h)
          const handle = 6

          return (
            <g key={box.id}>
              {/* Dashed selection rect */}
              <rect
                x={box.x}
                y={box.y}
                width={w}
                height={h}
                fill={`${box.color}14`}
                stroke={box.color}
                strokeWidth="1.5"
                strokeDasharray="6 4"
                rx="6"
              />

              {/* 8 Corner & Edge Anchor Handles */}
              <rect x={box.x - 3} y={box.y - 3} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1.5" rx="1" />
              <rect x={box.x + w / 2 - 3} y={box.y - 3} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1.5" rx="1" />
              <rect x={box.x + w - 3} y={box.y - 3} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1.5" rx="1" />
              <rect x={box.x - 3} y={box.y + h / 2 - 3} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1.5" rx="1" />
              <rect x={box.x + w - 3} y={box.y + h / 2 - 3} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1.5" rx="1" />
              <rect x={box.x - 3} y={box.y + h - 3} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1.5" rx="1" />
              <rect x={box.x + w / 2 - 3} y={box.y + h - 3} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1.5" rx="1" />
              <rect x={box.x + w - 3} y={box.y + h - 3} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1.5" rx="1" />

              {/* Studio Header Tag Pill showing Component Type & Dimensions */}
              {box.label && (
                <g>
                  <rect
                    x={box.x}
                    y={box.y - 17}
                    width={box.label.length * 6.6 + 48}
                    height="16"
                    fill={box.color}
                    rx="4"
                  />
                  <text
                    x={box.x + 6}
                    y={box.y - 5}
                    fill="#ffffff"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="0.02em"
                  >
                    {box.label} [{Math.round(w)}×{Math.round(h)}]
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* 2. Visual Click Ripple Radiations */}
        {ripples.map((rip) => (
          <circle
            key={rip.id}
            cx={rip.x}
            cy={rip.y}
            r={rip.radius}
            fill="none"
            stroke={rip.color}
            strokeWidth="2"
            opacity={rip.opacity}
          />
        ))}

        {/* 3. Ghost Card Being Actively Option-Dragged across Columns */}
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

        {/* 4. Laser Snap Alignment Guides */}
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

        {/* 5. Distance Gap Measurement Indicators for ⌥-Cloned Cards & Buttons */}
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

        {/* 6. Luminous Synthesis Beam (Wave 5) */}
        {sweepY !== null && (
          <g>
            <line
              x1="0"
              y1={sweepY}
              x2={dimensions.width}
              y2={sweepY}
              stroke="#38bdf8"
              strokeWidth="4"
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
