/**
 * Site Blueprint Engine — Full-page DOM snapshotter & zero-CLS masking engine
 * 
 * Traverses the actual live webpage, maps component bounding boxes,
 * and orchestrates real-time reconstruction without shifting document flow.
 */

import type { SwarmRebuildTask, SwarmTaskType, AgentPersonaId } from './types'

export interface LiveSiteBlueprint {
  tasks: SwarmRebuildTask[]
  originalStyles: Map<HTMLElement, { opacity: string; visibility: string; transition: string; transform: string }>
}

export class SiteBlueprintEngine {
  /**
   * Scans the live document body for key visible components to rebuild
   */
  public static snapshotPage(): LiveSiteBlueprint {
    const originalStyles = new Map<HTMLElement, { opacity: string; visibility: string; transition: string; transform: string }>()
    const tasks: SwarmRebuildTask[] = []

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return { tasks: [], originalStyles }
    }

    const viewportHeight = window.innerHeight
    const scrollY = window.scrollY

    // Selectors prioritized in natural top-to-bottom reading & design flow
    const targetSelectors = [
      'header nav',
      'header a',
      'header button',
      '#hero-section .hero-badge-enter',
      '#hero-section h1',
      '#hero-section h2',
      '#hero-section p',
      '#hero-section .hero-cta-enter a',
      '#hero-section .hero-cta-enter button',
      '#hero-section .hero-terminal-box',
      '#hero-section .hero-terminal-box > div > div',
      '#hero-section .hero-terminal-box .grid > div',
      '#hero-section .tech-badge-glow',
      'section#services h2',
      'section#services .grid > div',
    ]

    const candidateElements: HTMLElement[] = []
    const seen = new Set<HTMLElement>()

    targetSelectors.forEach((sel) => {
      try {
        const found = Array.from(document.querySelectorAll<HTMLElement>(sel))
        found.forEach((el) => {
          if (seen.has(el)) return
          const r = el.getBoundingClientRect()
          // Only capture elements currently within or near the visible viewport
          if (r.width > 12 && r.height > 10 && r.top < viewportHeight + 400 && r.bottom > -200) {
            seen.add(el)
            candidateElements.push(el)
          }
        })
      } catch (e) {}
    })

    // If candidate list is sparse, fall back to standard headings, buttons, and panels
    if (candidateElements.length < 5) {
      const fallback = Array.from(document.querySelectorAll<HTMLElement>('header, h1, h2, h3, p, button, a.btn-primary, .glass-panel'))
      fallback.forEach((el) => {
        if (seen.has(el)) return
        const r = el.getBoundingClientRect()
        if (r.width > 20 && r.height > 14 && r.top < viewportHeight + 400 && r.bottom > -200) {
          seen.add(el)
          candidateElements.push(el)
        }
      })
    }

    // Sort top-to-bottom, left-to-right
    candidateElements.sort((a, b) => {
      const rA = a.getBoundingClientRect()
      const rB = b.getBoundingClientRect()
      if (Math.abs(rA.top - rB.top) > 30) {
        return rA.top - rB.top
      }
      return rA.left - rB.left
    })

    // Map each element into an action task
    const personaRotation: AgentPersonaId[] = ['sarah', 'alex', 'arjun', 'vikram', 'elena', 'dev']

    candidateElements.forEach((el, index) => {
      originalStyles.set(el, {
        opacity: el.style.opacity,
        visibility: el.style.visibility,
        transition: el.style.transition,
        transform: el.style.transform,
      })

      const r = el.getBoundingClientRect()
      const taskType = this.classifyTaskType(el)
      const assignedAgent = this.assignPersona(taskType, index, personaRotation)

      tasks.push({
        id: `site-task-${index}`,
        domElement: el,
        type: taskType,
        rect: {
          x: r.left + window.scrollX,
          y: r.top + window.scrollY,
          width: r.width,
          height: r.height,
        },
        textSnippet: (el.innerText || el.textContent || '').trim().slice(0, 60),
        assignedAgent,
        durationMs: taskType === 'typewriter' ? 420 : 320,
        order: index,
      })
    })

    return { tasks, originalStyles }
  }

  /**
   * Applies ghost masking: preserves DOM box model, zeroes visibility
   */
  public static maskPage(blueprint: LiveSiteBlueprint): void {
    blueprint.tasks.forEach((t) => {
      t.domElement.style.transition = 'none'
      t.domElement.style.visibility = 'hidden'
      t.domElement.style.opacity = '0'
      t.domElement.style.transform = 'scale(0.97)'
    })
  }

  /**
   * Reveals a built element with smooth pop transition
   */
  public static revealTask(task: SwarmRebuildTask): void {
    task.domElement.style.visibility = 'visible'
    task.domElement.style.transition = 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
    task.domElement.style.opacity = '1'
    task.domElement.style.transform = 'scale(1)'
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
    })
  }

  private static classifyTaskType(el: HTMLElement): SwarmTaskType {
    const tag = el.tagName.toLowerCase()
    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'p' || el.classList.contains('font-display')) {
      return 'typewriter'
    }
    if (el.parentElement?.classList.contains('grid') && el.classList.contains('rounded-2xl')) {
      return 'option_clone'
    }
    if (tag === 'button' || tag === 'a' || el.getAttribute('role') === 'button') {
      return 'marquee_box'
    }
    if (el.classList.contains('badge') || el.classList.contains('tech-badge-glow')) {
      return 'vector_pen'
    }
    return 'marquee_box'
  }

  private static assignPersona(
    type: SwarmTaskType,
    index: number,
    rotation: AgentPersonaId[]
  ): AgentPersonaId {
    switch (type) {
      case 'marquee_box':
        return index % 2 === 0 ? 'sarah' : 'elena'
      case 'typewriter':
        return index % 2 === 0 ? 'alex' : 'sarah'
      case 'option_clone':
        return 'arjun'
      case 'vector_pen':
        return 'dev'
      case 'snap_guide':
        return 'vikram'
      default:
        return rotation[index % rotation.length]
    }
  }
}
