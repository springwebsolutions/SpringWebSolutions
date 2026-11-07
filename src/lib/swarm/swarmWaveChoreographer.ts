/**
 * Autonomous Swarm Wave Choreographer
 * 
 * Synchronizes the 4 systematic construction waves to build the exact UI & UX:
 *   Wave 1: Navigation & Header
 *   Wave 2: Hero Headline & Typography
 *   Wave 3: Architecture Showcase Terminal & ⌥-Cloned Metric Cards
 *   Wave 4: Live Synthesis Light Sweep
 */

import type { SpringCursorState, AgentPersonaId, LaserGuide, DistanceRuler } from './types'
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
  techBadgesProgress: number
  sweepY: number | null
  canvasOpacity: number
}

export class SwarmWaveChoreographer {
  private totalDurationMs: number = 3800
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
    techBadgesProgress: 0,
    sweepY: null,
    canvasOpacity: 1,
  }

  public activeLaserGuides: LaserGuide[] = []
  public activeDistanceRulers: DistanceRuler[] = []

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
        this.totalDurationMs = 5000
        break
      case '2x':
        this.speedMultiplier = 2
        this.totalDurationMs = 3800
        break
      case '3x':
        this.speedMultiplier = 3
        this.totalDurationMs = 2800
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
      techBadgesProgress: 0,
      sweepY: null,
      canvasOpacity: 1,
    }
    this.activeLaserGuides = []
    this.activeDistanceRulers = []
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

    // ─────────────────────────────────────────────────────────────
    // WAVE 1: NAVIGATION & HEADER (0% – 20%)
    // ─────────────────────────────────────────────────────────────
    if (progress < 0.20) {
      const p1 = progress / 0.20
      this.stage.navProgress = Math.min(1, p1 * 1.3)

      const navW = Math.min(viewportWidth - 32, 1400)
      const navX = (viewportWidth - navW) / 2

      // Sarah sweeps across framing the navbar
      if (sarah) {
        sarah.targetX = navX + navW * Math.min(1, p1 * 1.4)
        sarah.targetY = 48
        sarah.cursorMode = 'crosshair'
        sarah.actionText = 'Navbar Frame'
      }

      // Alex sets the brand typography
      if (alex && p1 > 0.25) {
        alex.targetX = navX + 110
        alex.targetY = 32
        alex.cursorMode = 'caret'
        alex.actionText = 'Brand Emblem'
        alex.typewriterText = 'Spring Web Solutions'
      }

      // Vikram snaps horizontal margin guide
      if (vikram && p1 > 0.4) {
        vikram.targetX = navX + navW
        vikram.targetY = 64
        vikram.cursorMode = 'arrow'
        vikram.actionText = 'Align Margin Y: 64px'

        if (!this.audioPlayedState['snap-nav']) {
          swarmAudio.playSnapPop(800)
          this.audioPlayedState['snap-nav'] = true
        }

        this.activeLaserGuides = [
          {
            id: 'nav-baseline',
            orientation: 'horizontal',
            pos: 64,
            start: navX - 20,
            end: navX + navW + 20,
            color: AGENT_PERSONAS.vikram.color,
            opacity: 0.85,
            label: 'Navbar Margin: 64px',
          },
        ]
      }

      // Arjun snaps Client Login CTA
      if (arjun && p1 > 0.65) {
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
    // WAVE 2: HERO HEADLINE & VALUE PROP (20% – 52%)
    // ─────────────────────────────────────────────────────────────
    else if (progress >= 0.20 && progress < 0.52) {
      const p2 = (progress - 0.20) / 0.32
      this.stage.navProgress = 1
      this.stage.badgeProgress = Math.min(1, p2 * 2.5)

      const fullHeadline = 'Spring Web Solutions'
      const h1Start = 0.15
      const h1End = 0.85
      if (p2 >= h1Start) {
        const charRatio = Math.min(1, (p2 - h1Start) / (h1End - h1Start))
        this.stage.h1CharsCount = Math.floor(fullHeadline.length * charRatio)
      }

      if (p2 > 0.5) {
        this.stage.subtitleProgress = Math.min(1, (p2 - 0.5) * 2.2)
      }
      if (p2 > 0.75) {
        this.stage.ctasProgress = Math.min(1, (p2 - 0.75) * 4)
      }

      // Sarah frames the hero text bounds
      if (sarah) {
        sarah.targetX = centerX + Math.min(350, viewportWidth * 0.35)
        sarah.targetY = 190
        sarah.cursorMode = 'crosshair'
        sarah.actionText = 'Hero Typography Frame'
      }

      // Vikram shoots center axis guideline
      if (vikram && p2 > 0.1) {
        vikram.targetX = centerX
        vikram.targetY = 180
        vikram.cursorMode = 'arrow'
        vikram.actionText = 'Center Alignment Axis'

        this.activeLaserGuides = [
          {
            id: 'hero-axis',
            orientation: 'vertical',
            pos: centerX,
            start: 90,
            end: 320,
            color: AGENT_PERSONAS.vikram.color,
            opacity: 0.8,
            label: 'Center Axis 50%',
          },
        ]
      }

      // Alex types the H1 title with cyan caret
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

      // Arjun drops the CTA buttons
      if (arjun && p2 > 0.75) {
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
    // WAVE 3: ARCHITECTURE SHOWCASE & ⌥-CLONED CARDS (52% – 84%)
    // ─────────────────────────────────────────────────────────────
    else if (progress >= 0.52 && progress < 0.84) {
      const p3 = (progress - 0.52) / 0.32
      this.stage.navProgress = 1
      this.stage.badgeProgress = 1
      this.stage.h1CharsCount = 20
      this.stage.subtitleProgress = 1
      this.stage.ctasProgress = 1
      this.stage.terminalProgress = Math.min(1, p3 * 2.2)

      const termW = Math.min(viewportWidth - 40, 896)
      const termX = (viewportWidth - termW) / 2
      const termY = Math.min(360, viewportHeight * 0.44)

      // Sarah frames Terminal container box
      if (sarah) {
        sarah.targetX = termX + termW
        sarah.targetY = termY + 220
        sarah.cursorMode = 'crosshair'
        sarah.actionText = 'Architecture Terminal Box'
      }

      // Arjun duplicates cards across 4 columns with ⌥ Option-Drag & red distance guidelines
      const cardCount = 4
      const gap = 12
      const cardW = (termW - 32 - gap * (cardCount - 1)) / cardCount
      const cardY = termY + 68

      // Determine how many cards are revealed (1 to 4)
      const currentCardIdx = Math.min(cardCount, Math.max(1, Math.floor(p3 * 4.5) + 1))
      this.stage.visibleCardsCount = currentCardIdx

      if (arjun) {
        const activeIdx = currentCardIdx - 1
        const curCardX = termX + 16 + activeIdx * (cardW + gap)
        arjun.targetX = curCardX + cardW / 2
        arjun.targetY = cardY + 45
        arjun.cursorMode = activeIdx > 0 ? 'clone' : 'crosshair'
        arjun.actionText = activeIdx > 0 ? `⌥ Duplicate Card ${activeIdx + 1}` : 'Base Card 1'

        const audioKey = `card-${activeIdx}`
        if (!this.audioPlayedState[audioKey]) {
          swarmAudio.playSnapPop(520 + activeIdx * 50)
          this.audioPlayedState[audioKey] = true
        }

        // Show red distance measurement between cards
        if (activeIdx > 0) {
          const prevX = termX + 16 + (activeIdx - 1) * (cardW + gap) + cardW
          this.activeDistanceRulers = [
            {
              id: 'card-gap-ruler',
              x1: prevX,
              y1: cardY + 45,
              x2: curCardX,
              y2: cardY + 45,
              gapPx: gap,
              color: '#f43f5e',
            },
          ]
        }
      }

      // Vikram snaps horizontal card gutter guideline
      if (vikram) {
        vikram.targetX = termX + termW
        vikram.targetY = cardY
        vikram.cursorMode = 'arrow'
        vikram.actionText = 'Grid Gutter Snap'

        this.activeLaserGuides = [
          {
            id: 'card-gutter-axis',
            orientation: 'horizontal',
            pos: cardY,
            start: termX,
            end: termX + termW,
            color: AGENT_PERSONAS.vikram.color,
            opacity: 0.75,
            label: '12px Grid Gutter',
          },
        ]
      }

      // Floating tech badges begin fading in
      if (p3 > 0.4) {
        this.stage.techBadgesProgress = Math.min(1, (p3 - 0.4) * 1.8)
      }
    }

    // ─────────────────────────────────────────────────────────────
    // WAVE 4: LIVE SYNTHESIS SWEEP & UNLOCK (84% – 100%)
    // ─────────────────────────────────────────────────────────────
    else {
      const p4 = (progress - 0.84) / 0.16
      this.stage.navProgress = 1
      this.stage.badgeProgress = 1
      this.stage.h1CharsCount = 20
      this.stage.subtitleProgress = 1
      this.stage.ctasProgress = 1
      this.stage.terminalProgress = 1
      this.stage.visibleCardsCount = 4
      this.stage.techBadgesProgress = 1

      // Luminous synthesis beam sweeps down the screen
      this.stage.sweepY = p4 * (viewportHeight + 120)
      this.stage.canvasOpacity = Math.max(0, 1 - p4 * 1.4)

      // Cursors scatter outward
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
