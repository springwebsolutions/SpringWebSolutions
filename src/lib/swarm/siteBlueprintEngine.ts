/**
 * Site Blueprint Engine — Full-page DOM Hierarchical Snapshotter & Zero-CLS Masking Engine
 * 
 * Implements Joel Califa & Dhvanil Patel's Swarm Rebuild architecture:
 * Decomposes the live page into a 4-phase Directed Acyclic Graph (DAG):
 *   Phase 1: Macro Wireframing (Containers & Layout Frames)
 *   Phase 2: Alignment & Laser Snap Guides (Axes & Rulers)
 *   Phase 3: Typographic Streaming (H1, H2, Copy with Carets)
 *   Phase 4: Component Duplication & Detailing (⌥-Cloning Cards, CTAs, Badges)
 */

import type { SwarmRebuildTask, SwarmTaskType, AgentPersonaId, SwarmPhaseId } from './types'

export interface LiveSiteBlueprint {
  tasks: SwarmRebuildTask[]
  phaseTasks: Record<SwarmPhaseId, SwarmRebuildTask[]>
  originalStyles: Map<HTMLElement, { opacity: string; visibility: string; transition: string; transform: string; pointerEvents: string }>
}

export class SiteBlueprintEngine {
  /**
   * Scans the live document DOM and constructs a strictly phased DAG blueprint
   */
  public static snapshotPage(): LiveSiteBlueprint {
    const originalStyles = new Map<HTMLElement, { opacity: string; visibility: string; transition: string; transform: string; pointerEvents: string }>()
    const tasks: SwarmRebuildTask[] = []
    const phaseTasks: Record<SwarmPhaseId, SwarmRebuildTask[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    }

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return { tasks, phaseTasks, originalStyles }
    }

    const viewportHeight = window.innerHeight
    const scrollY = window.scrollY
    const scrollX = window.scrollX
    const seen = new Set<HTMLElement>()

    const registerElement = (el: HTMLElement) => {
      if (seen.has(el)) return false
      const r = el.getBoundingClientRect()
      // Capture elements within or just outside the visible viewport
      if (r.width > 8 && r.height > 8 && r.top < viewportHeight + 350 && r.bottom > -150) {
        seen.add(el)
        originalStyles.set(el, {
          opacity: el.style.opacity,
          visibility: el.style.visibility,
          transition: el.style.transition,
          transform: el.style.transform,
          pointerEvents: el.style.pointerEvents,
        })
        return true
      }
      return false
    }

    let globalOrder = 0

    // ─────────────────────────────────────────────────────────────
    // PHASE 1: STRUCTURAL WIREFRAMING (Macro Layout Containers)
    // ─────────────────────────────────────────────────────────────
    const containerSelectors = [
      'header',
      'header nav',
      'main section:first-of-type',
      '#hero-section',
      '.hero-terminal-box',
      'section#services',
      'section#services .grid',
    ]

    const containerElements: HTMLElement[] = []
    containerSelectors.forEach((sel) => {
      try {
        const found = Array.from(document.querySelectorAll<HTMLElement>(sel))
        found.forEach((el) => {
          if (registerElement(el)) {
            containerElements.push(el)
          }
        })
      } catch (e) {}
    })

    // If no explicit containers were found, fall back to header & main
    if (containerElements.length === 0) {
      const fallbackContainers = Array.from(document.querySelectorAll<HTMLElement>('header, main, section, .glass-panel'))
      fallbackContainers.forEach((el) => {
        if (registerElement(el)) containerElements.push(el)
      })
    }

    containerElements.forEach((el, index) => {
      const r = el.getBoundingClientRect()
      const task: SwarmRebuildTask = {
        id: `phase1-frame-${index}`,
        domElement: el,
        type: 'marquee_box',
        phase: 1,
        bandName: 'Structural Frame',
        rect: {
          x: r.left + scrollX,
          y: r.top + scrollY,
          width: r.width,
          height: r.height,
        },
        assignedAgent: index % 2 === 0 ? 'sarah' : 'vikram',
        durationMs: 380,
        order: globalOrder++,
      }
      tasks.push(task)
      phaseTasks[1].push(task)
    })

    // ─────────────────────────────────────────────────────────────
    // PHASE 2: ALIGNMENT & LASER GUIDES
    // ─────────────────────────────────────────────────────────────
    // Virtual alignment tasks that snap horizontal and vertical ruler axes
    const headerEl = document.querySelector<HTMLElement>('header')
    const h1El = document.querySelector<HTMLElement>('h1')
    const terminalEl = document.querySelector<HTMLElement>('.hero-terminal-box')

    const guideAnchors: Array<{ y: number; x: number; label: string; agent: AgentPersonaId }> = []
    if (headerEl) {
      const r = headerEl.getBoundingClientRect()
      guideAnchors.push({ y: r.bottom + scrollY, x: r.left + scrollX, label: 'Header Margin Y: 80px', agent: 'vikram' })
    }
    if (h1El) {
      const r = h1El.getBoundingClientRect()
      guideAnchors.push({ y: r.top + scrollY, x: r.left + scrollX, label: 'H1 Content Axis', agent: 'dev' })
    }
    if (terminalEl) {
      const r = terminalEl.getBoundingClientRect()
      guideAnchors.push({ y: r.top + scrollY, x: r.left + scrollX, label: 'Showcase Grid Axis', agent: 'vikram' })
    }

    guideAnchors.forEach((anchor, index) => {
      // Use document.body as non-blocking virtual anchor element
      const task: SwarmRebuildTask = {
        id: `phase2-guide-${index}`,
        domElement: document.body,
        type: 'snap_guide',
        phase: 2,
        bandName: 'Laser Alignment',
        rect: {
          x: anchor.x,
          y: anchor.y,
          width: window.innerWidth * 0.9,
          height: 2,
        },
        textSnippet: anchor.label,
        assignedAgent: anchor.agent,
        durationMs: 260,
        order: globalOrder++,
      }
      tasks.push(task)
      phaseTasks[2].push(task)
    })

    // ─────────────────────────────────────────────────────────────
    // PHASE 3: TYPOGRAPHIC STREAMING (Headlines, Subheadings & Copy)
    // ─────────────────────────────────────────────────────────────
    const typographySelectors = [
      '.hero-badge-enter',
      'h1.hero-h1-enter, #hero-section h1, h1',
      'h2.hero-sub-enter, #hero-section h2, h2',
      'p.hero-p-enter, #hero-section p, p',
      '.hero-terminal-box font-mono',
      '.hero-terminal-box .flex > div > span.font-mono',
    ]

    const typographyElements: HTMLElement[] = []
    typographySelectors.forEach((sel) => {
      try {
        const found = Array.from(document.querySelectorAll<HTMLElement>(sel))
        found.forEach((el) => {
          if (registerElement(el)) {
            typographyElements.push(el)
          }
        })
      } catch (e) {}
    })

    typographyElements.forEach((el, index) => {
      const r = el.getBoundingClientRect()
      const text = (el.innerText || el.textContent || '').trim()
      const task: SwarmRebuildTask = {
        id: `phase3-typo-${index}`,
        domElement: el,
        type: 'typewriter',
        phase: 3,
        bandName: 'Typography Influx',
        rect: {
          x: r.left + scrollX,
          y: r.top + scrollY,
          width: r.width,
          height: r.height,
        },
        textSnippet: text.slice(0, 75),
        assignedAgent: index % 2 === 0 ? 'alex' : 'sarah',
        durationMs: Math.max(340, Math.min(680, text.length * 14)),
        order: globalOrder++,
      }
      tasks.push(task)
      phaseTasks[3].push(task)
    })

    // ─────────────────────────────────────────────────────────────
    // PHASE 4: COMPONENT DUPLICATION & DETAILING (Cards, CTAs, Badges)
    // ─────────────────────────────────────────────────────────────
    // 1. Terminal Metric Cards (Card 1 base, Cards 2-4 option-cloned)
    const terminalCards = Array.from(document.querySelectorAll<HTMLElement>('.hero-terminal-box .grid > div'))
    let previousCardId: string | undefined = undefined

    terminalCards.forEach((card, index) => {
      if (registerElement(card)) {
        const r = card.getBoundingClientRect()
        const isClone = index > 0 && previousCardId !== undefined
        const taskId = `phase4-card-${index}`

        const task: SwarmRebuildTask = {
          id: taskId,
          domElement: card,
          type: isClone ? 'option_clone' : 'marquee_box',
          phase: 4,
          bandName: 'Component Grid',
          cloneFromTaskId: isClone ? previousCardId : undefined,
          distanceGapPx: 12,
          rect: {
            x: r.left + scrollX,
            y: r.top + scrollY,
            width: r.width,
            height: r.height,
          },
          textSnippet: (card.innerText || '').slice(0, 30),
          assignedAgent: isClone ? 'arjun' : 'elena',
          durationMs: isClone ? 280 : 340,
          order: globalOrder++,
        }
        previousCardId = taskId
        tasks.push(task)
        phaseTasks[4].push(task)
      }
    })

    // 2. CTAs and Action Buttons
    const ctaSelectors = [
      '.hero-cta-enter a',
      '.hero-cta-enter button',
      'header a',
      'header button',
      '.tech-badge-glow',
      '#services .grid > div',
    ]

    ctaSelectors.forEach((sel) => {
      try {
        const found = Array.from(document.querySelectorAll<HTMLElement>(sel))
        found.forEach((el, index) => {
          if (registerElement(el)) {
            const r = el.getBoundingClientRect()
            const task: SwarmRebuildTask = {
              id: `phase4-elem-${tasks.length}`,
              domElement: el,
              type: el.classList.contains('tech-badge-glow') ? 'vector_pen' : 'marquee_box',
              phase: 4,
              bandName: 'Interactive Controls',
              rect: {
                x: r.left + scrollX,
                y: r.top + scrollY,
                width: r.width,
                height: r.height,
              },
              textSnippet: (el.innerText || el.textContent || '').trim().slice(0, 24),
              assignedAgent: index % 2 === 0 ? 'dev' : 'elena',
              durationMs: 280,
              order: globalOrder++,
            }
            tasks.push(task)
            phaseTasks[4].push(task)
          }
        })
      } catch (e) {}
    })

    return { tasks, phaseTasks, originalStyles }
  }

  /**
   * Applies ghost masking across all captured elements:
   * Preserves DOM geometry (0 Layout Shift) while setting zero visibility
   */
  public static maskPage(blueprint: LiveSiteBlueprint): void {
    blueprint.tasks.forEach((t) => {
      if (t.domElement && t.domElement !== document.body) {
        t.domElement.style.transition = 'none'
        t.domElement.style.visibility = 'hidden'
        t.domElement.style.opacity = '0'
        t.domElement.style.transform = 'scale(0.98)'
        t.domElement.style.pointerEvents = 'none'
      }
    })
  }

  /**
   * Reveals a built element with smooth spring pop transition
   */
  public static revealTask(task: SwarmRebuildTask): void {
    if (!task.domElement || task.domElement === document.body) return
    task.domElement.style.visibility = 'visible'
    task.domElement.style.transition = 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
    task.domElement.style.opacity = '1'
    task.domElement.style.transform = 'scale(1)'
    task.domElement.style.pointerEvents = 'auto'
  }

  /**
   * Restores original page styling immediately (on Go Live, Esc, or Finish)
   */
  public static restorePage(blueprint: LiveSiteBlueprint): void {
    blueprint.originalStyles.forEach((style, el) => {
      el.style.opacity = style.opacity
      el.style.visibility = style.visibility
      el.style.transition = style.transition
      el.style.transform = style.transform
      el.style.pointerEvents = style.pointerEvents
    })
  }
}
