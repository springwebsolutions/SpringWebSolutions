/**
 * Autonomous Swarm Wave Choreographer
 * 
 * Drives the 4 systematic construction waves:
 *   Wave 1: Navigation & Header
 *   Wave 2: Hero & Typography
 *   Wave 3: Architecture Showcase & Option-Cloned Cards
 *   Wave 4: Synthesis Light Sweep & Go Live
 */

import type { SpringCursorState, AgentPersonaId, StudioBox, LaserGuide, DistanceRuler } from './types'
import { AGENT_PERSONAS } from './types'
import { swarmAudio } from './audioEngine'

export class SwarmWaveChoreographer {
  private totalDurationMs: number = 3600
  private elapsedMs: number = 0
  private isFinished: boolean = false
  private speedMultiplier: number = 2

  public activeBoxes: StudioBox[] = []
  public activeLaserGuides: LaserGuide[] = []
  public activeDistanceRulers: DistanceRuler[] = []
  public sweepY: number | null = null
  public canvasOpacity: number = 1

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
        this.totalDurationMs = 4800
        break
      case '2x':
        this.speedMultiplier = 2
        this.totalDurationMs = 3600
        break
      case '3x':
        this.speedMultiplier = 3
        this.totalDurationMs = 2600
        break
    }
  }

  public reset(): void {
    this.elapsedMs = 0
    this.isFinished = false
    this.activeBoxes = []
    this.activeLaserGuides = []
    this.activeDistanceRulers = []
    this.sweepY = null
    this.canvasOpacity = 1
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
    // WAVE 1: NAVIGATION & HEADER (0% – 22%)
    // ─────────────────────────────────────────────────────────────
    if (progress < 0.22) {
      const p1 = progress / 0.22
      const navW = Math.min(viewportWidth - 32, 1280)
      const navX = (viewportWidth - navW) / 2
      const navY = 16
      const navH = 64

      // Sarah drags navbar bounding frame
      if (sarah) {
        sarah.targetX = navX + navW * Math.min(1, p1 * 1.4)
        sarah.targetY = navY + navH
        sarah.cursorMode = 'crosshair'
        sarah.actionText = `Frame [${Math.round(navW)}×${navH}]`

        this.activeBoxes = [
          {
            id: 'navbar-frame',
            x: navX,
            y: navY,
            w: navW * Math.min(1, p1 * 1.4),
            h: navH,
            color: AGENT_PERSONAS.sarah.color,
            label: 'Header Navbar',
            progress: p1,
          },
        ]
      }

      // Vikram snaps horizontal baseline
      if (vikram && p1 > 0.3) {
        vikram.targetX = navX + navW
        vikram.targetY = navY + navH
        vikram.cursorMode = 'arrow'
        vikram.actionText = 'Snap Margin Y: 80px'

        if (!this.audioPlayedState['snap-nav']) {
          swarmAudio.playSnapPop(780)
          this.audioPlayedState['snap-nav'] = true
        }

        this.activeLaserGuides = [
          {
            id: 'nav-baseline',
            orientation: 'horizontal',
            pos: navY + navH,
            start: navX - 40,
            end: navX + navW + 40,
            color: AGENT_PERSONAS.vikram.color,
            opacity: 0.9,
            label: 'Header Baseline Y: 80px',
          },
        ]
      }

      // Alex types brand logo
      if (alex && p1 > 0.4) {
        alex.targetX = navX + 110
        alex.targetY = navY + 34
        alex.cursorMode = 'caret'
        alex.actionText = 'Logo Brand'
        const logoText = 'Spring Web Solutions'
        const chars = Math.floor(logoText.length * Math.min(1, (p1 - 0.4) * 2.2))
        alex.typewriterText = logoText.slice(0, chars) + '|'

        if (Math.random() < 0.28) {
          swarmAudio.playTypewriterTick()
        }
      }

      // Arjun drops Client Login button
      if (arjun && p1 > 0.65) {
        arjun.targetX = navX + navW - 60
        arjun.targetY = navY + 34
        arjun.cursorMode = 'arrow'
        arjun.actionText = 'Button: Client Login'
        if (!this.audioPlayedState['snap-login']) {
          swarmAudio.playSnapPop(640)
          this.audioPlayedState['snap-login'] = true
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // WAVE 2: HERO HEADLINE & VALUE PROP (22% – 55%)
    // ─────────────────────────────────────────────────────────────
    else if (progress >= 0.22 && progress < 0.55) {
      const p2 = (progress - 0.22) / 0.33
      const heroW = Math.min(viewportWidth - 40, 960)
      const heroX = (viewportWidth - heroW) / 2
      const heroY = 120
      const heroH = 240

      // Sarah draws Hero container box
      if (sarah) {
        sarah.targetX = heroX + heroW * Math.min(1, p2 * 1.3)
        sarah.targetY = heroY + heroH * Math.min(1, p2 * 1.3)
        sarah.cursorMode = 'crosshair'
        sarah.actionText = `Hero Canvas [${Math.round(heroW)}×${heroH}]`

        this.activeBoxes = [
          {
            id: 'hero-bounds',
            x: heroX,
            y: heroY,
            w: heroW * Math.min(1, p2 * 1.3),
            h: heroH * Math.min(1, p2 * 1.3),
            color: AGENT_PERSONAS.sarah.color,
            label: 'Hero Section',
            progress: p2,
          },
        ]
      }

      // Vikram shoots center axis guideline
      if (vikram && p2 > 0.25) {
        vikram.targetX = centerX
        vikram.targetY = heroY + heroH / 2
        vikram.cursorMode = 'arrow'
        vikram.actionText = 'Align Center Axis'

        this.activeLaserGuides = [
          {
            id: 'hero-center-axis',
            orientation: 'vertical',
            pos: centerX,
            start: heroY - 20,
            end: heroY + heroH + 40,
            color: AGENT_PERSONAS.vikram.color,
            opacity: 0.85,
            label: 'Center Axis 50%',
          },
        ]
      }

      // Alex types H1 Headline letter-by-letter
      if (alex && p2 > 0.2) {
        alex.targetX = centerX
        alex.targetY = heroY + 80
        alex.cursorMode = 'caret'
        alex.actionText = 'Typing H1'

        const headline = 'Spring Web Solutions'
        const chars = Math.floor(headline.length * Math.min(1, (p2 - 0.2) * 1.8))
        alex.typewriterText = headline.slice(0, chars) + '|'

        if (Math.random() < 0.32) {
          swarmAudio.playTypewriterTick()
        }
      }

      // Arjun sets CTA buttons
      if (arjun && p2 > 0.6) {
        arjun.targetX = centerX - 80
        arjun.targetY = heroY + 180
        arjun.cursorMode = 'arrow'
        arjun.actionText = 'CTA: Free Consultation'

        if (!this.audioPlayedState['snap-cta']) {
          swarmAudio.playSnapPop(580)
          this.audioPlayedState['snap-cta'] = true
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // WAVE 3: ARCHITECTURE SHOWCASE & ⌥-CLONED CARDS (55% – 85%)
    // ─────────────────────────────────────────────────────────────
    else if (progress >= 0.55 && progress < 0.85) {
      const p3 = (progress - 0.55) / 0.3
      const termW = Math.min(viewportWidth - 40, 880)
      const termX = (viewportWidth - termW) / 2
      const termY = Math.min(380, viewportHeight * 0.48)
      const termH = 180

      // Sarah frames Terminal Box
      if (sarah) {
        sarah.targetX = termX + termW
        sarah.targetY = termY + termH
        sarah.cursorMode = 'crosshair'
        sarah.actionText = `Architecture Terminal`

        this.activeBoxes = [
          {
            id: 'term-box',
            x: termX,
            y: termY,
            w: termW,
            h: termH,
            color: AGENT_PERSONAS.sarah.color,
            label: 'Architecture Terminal Box',
            progress: 1,
          },
        ]
      }

      // Arjun duplicates cards across 4 columns with ⌥ Option-Drag & red distance guidelines
      const cardCount = 4
      const gap = 16
      const cardW = (termW - 32 - gap * (cardCount - 1)) / cardCount
      const cardY = termY + 50
      const cardH = 95

      const activeCardIdx = Math.min(cardCount - 1, Math.floor(p3 * cardCount))

      if (arjun) {
        const curCardX = termX + 16 + activeCardIdx * (cardW + gap)
        arjun.targetX = curCardX + cardW / 2
        arjun.targetY = cardY + cardH / 2
        arjun.cursorMode = activeCardIdx > 0 ? 'clone' : 'crosshair'
        arjun.actionText = activeCardIdx > 0 ? `⌥ Duplicate Card ${activeCardIdx + 1}` : 'Card 1 Base'

        const audioKey = `card-${activeCardIdx}`
        if (!this.audioPlayedState[audioKey]) {
          swarmAudio.playSnapPop(520 + activeCardIdx * 50)
          this.audioPlayedState[audioKey] = true
        }

        // Draw completed cards + active card
        const cardBoxes: StudioBox[] = []
        for (let i = 0; i <= activeCardIdx; i++) {
          const cX = termX + 16 + i * (cardW + gap)
          cardBoxes.push({
            id: `card-${i}`,
            x: cX,
            y: cardY,
            w: cardW,
            h: cardH,
            color: AGENT_PERSONAS.arjun.color,
            label: `Metric ${i + 1}`,
            progress: 1,
          })
        }
        this.activeBoxes.push(...cardBoxes)

        // Show distance ruler between previous and current card
        if (activeCardIdx > 0) {
          const prevX = termX + 16 + (activeCardIdx - 1) * (cardW + gap) + cardW
          this.activeDistanceRulers = [
            {
              id: 'card-gap-ruler',
              x1: prevX,
              y1: cardY + cardH / 2,
              x2: curCardX,
              y2: cardY + cardH / 2,
              gapPx: gap,
              color: '#f43f5e',
            },
          ]
        }
      }

      // Vikram snaps horizontal card alignment axis
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
            label: '16px Grid Gutter',
          },
        ]
      }
    }

    // ─────────────────────────────────────────────────────────────
    // WAVE 4: SYNTHESIS LIGHT SWEEP & GO LIVE (85% – 100%)
    // ─────────────────────────────────────────────────────────────
    else {
      const p4 = (progress - 0.85) / 0.15

      // Light sweep line descends down viewport
      this.sweepY = p4 * (viewportHeight + 100)
      this.canvasOpacity = Math.max(0, 1 - p4 * 1.5)

      // Cursors scatter gracefully outward
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
