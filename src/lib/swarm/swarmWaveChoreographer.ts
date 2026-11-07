/**
 * Autonomous Swarm Wave Choreographer
 * 
 * Synchronizes the 5 systematic construction waves to build the exact UI & UX:
 *   Wave 1: Navigation & Header Wireframing
 *   Wave 2: Hero Headline & Typography Influx
 *   Wave 3: Architecture Showcase Terminal & ⌥-Ghost Dragged Metric Cards
 *   Wave 4: Engineered Services Grid Preview
 *   Wave 5: Live Synthesis Light Sweep & Seamless Handoff
 */

import type {
  SpringCursorState, AgentPersonaId, LaserGuide,
  DistanceRuler, StudioBox, GhostCard
} from './types'
import { AGENT_PERSONAS } from './types'
import { swarmAudio } from './audioEngine'

export interface WaveStageProgress {
  navProgress: number
  badgeProgress: number
  h1CharsCount: number
  subtitleProgress: number
  ctasProgress: number
  terminalProgress: number
  visibleCardsCount: number
  servicesProgress: number
  techBadgesProgress: number
  sweepY: number | null
  canvasOpacity: number
}

export class SwarmWaveChoreographer {
  private totalDurationMs: number = 4400
  private elapsedMs: number = 0
  private isFinished: boolean = false
  private speedMultiplier: number = 2

  public stage: WaveStageProgress = {
    navProgress: 0,
    badgeProgress: 0,
    h1CharsCount: 0,
    subtitleProgress: 0,
    ctasProgress: 0,
    terminalProgress: 0,
    visibleCardsCount: 0,
    servicesProgress: 0,
    techBadgesProgress: 0,
    sweepY: null,
    canvasOpacity: 1,
  }

  public activeBoxes: StudioBox[] = []
  public activeLaserGuides: LaserGuide[] = []
  public activeDistanceRulers: DistanceRuler[] = []
  public ghostCard: GhostCard | null = null

  private onCompleteCallback?: () => void
  private audioPlayedState: Record<string, boolean> = {}

  constructor(speed: '1x' | '2x' | '3x' = '2x', onComplete?: () => void) {
    this.setSpeed(speed)
    this.onCompleteCallback = onComplete
  }

  public setSpeed(speed: '1x' | '2x' | '3x'): void {
    switch (speed) {
      case '1x':
        this.speedMultiplier = 1
        this.totalDurationMs = 5600
        break
      case '2x':
        this.speedMultiplier = 2
        this.totalDurationMs = 4400
        break
      case '3x':
        this.speedMultiplier = 3
        this.totalDurationMs = 3200
        break
    }
  }

  public reset(): void {
    this.elapsedMs = 0
    this.isFinished = false
    this.stage = {
      navProgress: 0,
      badgeProgress: 0,
      h1CharsCount: 0,
      subtitleProgress: 0,
      ctasProgress: 0,
      terminalProgress: 0,
      visibleCardsCount: 0,
      servicesProgress: 0,
      techBadgesProgress: 0,
      sweepY: null,
      canvasOpacity: 1,
    }
    this.activeBoxes = []
    this.activeLaserGuides = []
    this.activeDistanceRulers = []
    this.ghostCard = null
    this.audioPlayedState = {}
  }

  /**
   * Main simulation step
   */
  public update(
    cursors: Map<AgentPersonaId, SpringCursorState>,
    viewportWidth: number,
    viewportHeight: number,
    deltaMs: number
  ): void {
    if (this.isFinished) return

    this.elapsedMs += deltaMs
    const progress = Math.min(1, this.elapsedMs / this.totalDurationMs)

    const sarah = cursors.get('sarah')
    const alex = cursors.get('alex')
    const arjun = cursors.get('arjun')
    const vikram = cursors.get('vikram')

    const centerX = viewportWidth / 2
    this.activeBoxes = []
    this.activeLaserGuides = []
    this.activeDistanceRulers = []
    this.ghostCard = null

    // ─────────────────────────────────────────────────────────────
    // WAVE 1: NAVIGATION & HEADER (0% – 18%)
    // ─────────────────────────────────────────────────────────────
    if (progress < 0.18) {
      const p1 = progress / 0.18
      this.stage.navProgress = Math.min(1, p1 * 1.3)

      const navW = Math.min(viewportWidth - 32, 1400)
      const navX = (viewportWidth - navW) / 2
      const dragWidth = navW * Math.min(1, p1 * 1.3)

      // Sarah sweeps across framing the navbar
      if (sarah) {
        sarah.targetX = navX + dragWidth
        sarah.targetY = 48
        sarah.cursorMode = 'crosshair'
        sarah.actionText = `Navbar [${Math.round(dragWidth)}×64]`
      }

      // Active bounding box for Navbar
      this.activeBoxes.push({
        id: 'box-navbar',
        x: navX,
        y: 4,
        w: dragWidth,
        h: 64,
        color: AGENT_PERSONAS.sarah.color,
        label: 'Header Navbar [100% × 64]',
        progress: p1,
      })

      // Alex sets brand logo
      if (alex && p1 > 0.25) {
        alex.targetX = navX + 110
        alex.targetY = 32
        alex.cursorMode = 'caret'
        alex.actionText = 'Brand Emblem'
        alex.typewriterText = 'Spring Web Solutions'
      }

      // Vikram snaps horizontal margin guide
      if (vikram && p1 > 0.35) {
        vikram.targetX = navX + navW
        vikram.targetY = 64
        vikram.cursorMode = 'arrow'
        vikram.actionText = 'Align Margin Y: 64px'

        if (!this.audioPlayedState['snap-nav']) {
          swarmAudio.playSnapPop(800)
          this.audioPlayedState['snap-nav'] = true
        }

        this.activeLaserGuides.push({
          id: 'nav-baseline',
          orientation: 'horizontal',
          pos: 64,
          start: navX - 20,
          end: navX + navW + 20,
          color: AGENT_PERSONAS.vikram.color,
          opacity: 0.85,
          label: 'Navbar Baseline: 64px',
        })
      }

      // Arjun snaps Client Login CTA
      if (arjun && p1 > 0.6) {
        arjun.targetX = navX + navW - 75
        arjun.targetY = 32
        arjun.cursorMode = 'arrow'
        arjun.actionText = 'Button: Client Login'

        if (!this.audioPlayedState['snap-login']) {
          swarmAudio.playSnapPop(640)
          this.audioPlayedState['snap-login'] = true
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // WAVE 2: HERO HEADLINE & VALUE PROP (18% – 46%)
    // ─────────────────────────────────────────────────────────────
    else if (progress >= 0.18 && progress < 0.46) {
      const p2 = (progress - 0.18) / 0.28
      this.stage.navProgress = 1
      this.stage.badgeProgress = Math.min(1, p2 * 2.8)

      const fullHeadline = 'Spring Web Solutions'
      const h1Start = 0.12
      const h1End = 0.82
      if (p2 >= h1Start) {
        const charRatio = Math.min(1, (p2 - h1Start) / (h1End - h1Start))
        this.stage.h1CharsCount = Math.floor(fullHeadline.length * charRatio)
      }

      if (p2 > 0.45) {
        this.stage.subtitleProgress = Math.min(1, (p2 - 0.45) * 2.2)
      }
      if (p2 > 0.72) {
        this.stage.ctasProgress = Math.min(1, (p2 - 0.72) * 4)
      }

      const heroW = Math.min(viewportWidth - 40, 960)
      const heroX = (viewportWidth - heroW) / 2
      const heroY = 90
      const heroH = 240

      // Sarah frames Hero container
      if (sarah) {
        sarah.targetX = heroX + heroW * Math.min(1, p2 * 1.3)
        sarah.targetY = heroY + heroH * Math.min(1, p2 * 1.2)
        sarah.cursorMode = 'crosshair'
        sarah.actionText = `Hero Canvas [${Math.round(heroW)}×${heroH}]`
      }

      this.activeBoxes.push({
        id: 'box-hero',
        x: heroX,
        y: heroY,
        w: heroW * Math.min(1, p2 * 1.3),
        h: heroH * Math.min(1, p2 * 1.2),
        color: AGENT_PERSONAS.sarah.color,
        label: 'Hero Frame [960 × 240]',
        progress: p2,
      })

      // Vikram shoots center axis guideline
      if (vikram && p2 > 0.08) {
        vikram.targetX = centerX
        vikram.targetY = 190
        vikram.cursorMode = 'arrow'
        vikram.actionText = 'Center Alignment Axis'

        this.activeLaserGuides.push({
          id: 'hero-axis',
          orientation: 'vertical',
          pos: centerX,
          start: 85,
          end: 330,
          color: AGENT_PERSONAS.vikram.color,
          opacity: 0.8,
          label: 'Center Axis 50%',
        })
      }

      // Alex types H1 title with cyan caret
      if (alex && p2 >= h1Start && p2 <= h1End) {
        alex.targetX = centerX + (this.stage.h1CharsCount - fullHeadline.length / 2) * 14
        alex.targetY = 175
        alex.cursorMode = 'caret'
        alex.actionText = 'Typing H1'
        alex.typewriterText = fullHeadline.slice(0, this.stage.h1CharsCount) + '|'

        if (Math.random() < 0.35) {
          swarmAudio.playTypewriterTick()
        }
      }

      // Active highlight box around H1 headline
      if (p2 >= h1Start) {
        const textW = Math.min(680, this.stage.h1CharsCount * 32 + 40)
        this.activeBoxes.push({
          id: 'box-h1',
          x: centerX - textW / 2,
          y: 145,
          w: textW,
          h: 60,
          color: AGENT_PERSONAS.alex.color,
          label: 'H1 Typography [64px Display]',
          progress: 1,
        })
      }

      // Arjun drops CTA buttons
      if (arjun && p2 > 0.72) {
        arjun.targetX = centerX - 90
        arjun.targetY = 285
        arjun.cursorMode = 'arrow'
        arjun.actionText = 'CTA: Get Free Consultation'

        if (!this.audioPlayedState['snap-cta']) {
          swarmAudio.playSnapPop(580)
          this.audioPlayedState['snap-cta'] = true
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // WAVE 3: ARCHITECTURE TERMINAL & ⌥-GHOST DRAGGED CARDS (46% – 74%)
    // ─────────────────────────────────────────────────────────────
    else if (progress >= 0.46 && progress < 0.74) {
      const p3 = (progress - 0.46) / 0.28
      this.stage.navProgress = 1
      this.stage.badgeProgress = 1
      this.stage.h1CharsCount = 20
      this.stage.subtitleProgress = 1
      this.stage.ctasProgress = 1
      this.stage.terminalProgress = Math.min(1, p3 * 2.2)

      const termW = Math.min(viewportWidth - 40, 896)
      const termX = (viewportWidth - termW) / 2
      const termY = Math.min(360, viewportHeight * 0.44)
      const termH = 190

      // Sarah frames Terminal Box
      if (sarah) {
        sarah.targetX = termX + termW
        sarah.targetY = termY + termH
        sarah.cursorMode = 'crosshair'
        sarah.actionText = `Architecture Terminal [${Math.round(termW)}×${termH}]`
      }

      this.activeBoxes.push({
        id: 'box-terminal',
        x: termX,
        y: termY,
        w: termW,
        h: termH,
        color: AGENT_PERSONAS.sarah.color,
        label: 'Architecture Terminal Box [896 × 190]',
        progress: 1,
      })

      // Card dimensions across 4 columns
      const cardCount = 4
      const gap = 12
      const cardW = (termW - 32 - gap * (cardCount - 1)) / cardCount
      const cardY = termY + 68
      const cardH = 88

      // Determine step in cloning (0 to 3)
      const rawStep = p3 * 4.2
      const activeIdx = Math.min(3, Math.floor(rawStep))
      const stepSubProgress = Math.min(1, rawStep - activeIdx)

      this.stage.visibleCardsCount = activeIdx + 1

      if (arjun) {
        const curCardX = termX + 16 + activeIdx * (cardW + gap)

        if (activeIdx === 0) {
          // Base card 1 creation
          arjun.targetX = curCardX + cardW / 2
          arjun.targetY = cardY + cardH / 2
          arjun.cursorMode = 'crosshair'
          arjun.actionText = 'Card 1: Base Metric'

          if (!this.audioPlayedState['card-0']) {
            swarmAudio.playSnapPop(520)
            this.audioPlayedState['card-0'] = true
          }
        } else {
          // Option-clone motion: ghost card slides from previous card to current card!
          const prevCardX = termX + 16 + (activeIdx - 1) * (cardW + gap)
          const ghostX = prevCardX + (curCardX - prevCardX) * stepSubProgress

          arjun.targetX = ghostX + cardW / 2
          arjun.targetY = cardY + cardH / 2
          arjun.cursorMode = 'clone'
          arjun.actionText = `⌥ Dragging Duplicate ${activeIdx + 1}`

          // Ghost card outline being actively dragged by cursor
          this.ghostCard = {
            x: ghostX,
            y: cardY,
            w: cardW,
            h: cardH,
            opacity: 0.75,
          }

          // Red distance ruler between previous card and ghost card
          this.activeDistanceRulers.push({
            id: 'card-gap-ruler',
            x1: prevCardX + cardW,
            y1: cardY + cardH / 2,
            x2: Math.max(prevCardX + cardW + 4, ghostX),
            y2: cardY + cardH / 2,
            gapPx: Math.round(Math.max(4, ghostX - (prevCardX + cardW))),
            color: '#f43f5e',
          })

          const audioKey = `card-${activeIdx}`
          if (!this.audioPlayedState[audioKey] && stepSubProgress > 0.8) {
            swarmAudio.playSnapPop(520 + activeIdx * 50)
            this.audioPlayedState[audioKey] = true
          }
        }
      }

      // Vikram snaps horizontal card gutter guideline
      if (vikram) {
        vikram.targetX = termX + termW
        vikram.targetY = cardY
        vikram.cursorMode = 'arrow'
        vikram.actionText = 'Grid Gutter Snap'

        this.activeLaserGuides.push({
          id: 'card-gutter-axis',
          orientation: 'horizontal',
          pos: cardY,
          start: termX,
          end: termX + termW,
          color: AGENT_PERSONAS.vikram.color,
          opacity: 0.75,
          label: '12px Grid Gutter',
        })
      }

      // Floating tech badges begin fading in
      if (p3 > 0.3) {
        this.stage.techBadgesProgress = Math.min(1, (p3 - 0.3) * 1.8)
      }
    }

    // ─────────────────────────────────────────────────────────────
    // WAVE 4: SERVICES SECTION WIREFRAME PEEK (74% – 86%)
    // ─────────────────────────────────────────────────────────────
    else if (progress >= 0.74 && progress < 0.86) {
      const p4 = (progress - 0.74) / 0.12
      this.stage.navProgress = 1
      this.stage.badgeProgress = 1
      this.stage.h1CharsCount = 20
      this.stage.subtitleProgress = 1
      this.stage.ctasProgress = 1
      this.stage.terminalProgress = 1
      this.stage.visibleCardsCount = 4
      this.stage.techBadgesProgress = 1
      this.stage.servicesProgress = Math.min(1, p4 * 1.6)

      const svcW = Math.min(viewportWidth - 40, 1100)
      const svcX = (viewportWidth - svcW) / 2
      const svcY = Math.min(590, viewportHeight * 0.74)

      // Sarah sweeps down to frame the Services grid container
      if (sarah) {
        sarah.targetX = svcX + svcW * Math.min(1, p4 * 1.3)
        sarah.targetY = svcY + 120
        sarah.cursorMode = 'crosshair'
        sarah.actionText = 'Section: Engineered Services'
      }

      this.activeBoxes.push({
        id: 'box-services',
        x: svcX,
        y: svcY,
        w: svcW * Math.min(1, p4 * 1.3),
        h: 120,
        color: AGENT_PERSONAS.sarah.color,
        label: 'Section: Engineered Services [1100 × 120]',
        progress: p4,
      })

      // Vikram drops horizontal section separator guide
      if (vikram) {
        vikram.targetX = svcX + svcW
        vikram.targetY = svcY
        vikram.cursorMode = 'arrow'
        vikram.actionText = 'Section Gutter: 80px'

        this.activeLaserGuides.push({
          id: 'svc-gutter',
          orientation: 'horizontal',
          pos: svcY,
          start: svcX,
          end: svcX + svcW,
          color: AGENT_PERSONAS.vikram.color,
          opacity: 0.75,
          label: 'Section Gutter: 80px',
        })
      }

      // Alex drops service title
      if (alex) {
        alex.targetX = centerX
        alex.targetY = svcY + 30
        alex.cursorMode = 'caret'
        alex.actionText = 'Services Title'
        alex.typewriterText = 'Engineered Services'
      }
    }

    // ─────────────────────────────────────────────────────────────
    // WAVE 5: LIVE SYNTHESIS SWEEP & SEAMLESS HANDOFF (86% – 100%)
    // ─────────────────────────────────────────────────────────────
    else {
      const p5 = (progress - 0.86) / 0.14
      this.stage.navProgress = 1
      this.stage.badgeProgress = 1
      this.stage.h1CharsCount = 20
      this.stage.subtitleProgress = 1
      this.stage.ctasProgress = 1
      this.stage.terminalProgress = 1
      this.stage.visibleCardsCount = 4
      this.stage.servicesProgress = 1
      this.stage.techBadgesProgress = 1

      // Luminous synthesis beam sweeps down the entire screen
      this.stage.sweepY = p5 * (viewportHeight + 140)
      this.stage.canvasOpacity = Math.max(0, 1 - p5 * 1.3)

      // Cursors scatter outward in celebration
      cursors.forEach((cursor, id) => {
        cursor.cursorMode = 'arrow'
        cursor.actionText = 'Live'
        cursor.typewriterText = ''
        if (id === 'sarah') cursor.targetY = -80
        if (id === 'alex') cursor.targetX = -80
        if (id === 'arjun') cursor.targetX = viewportWidth + 80
        if (id === 'vikram') cursor.targetY = viewportHeight + 80
      })

      if (!this.audioPlayedState['chime-finish']) {
        swarmAudio.playCompletionChime()
        this.audioPlayedState['chime-finish'] = true
      }

      if (progress >= 1 && !this.isFinished) {
        this.isFinished = true
        this.onCompleteCallback?.()
      }
    }
  }
}
