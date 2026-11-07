/**
 * DOM Blueprint Scanner — Parses target DOM trees into structured Swarm tasks
 * 
 * Traverses a container element, classifies nodes into:
 * - Containers (layout frames, cards, sections)
 * - Typography (headings, paragraphs, labels)
 * - Vectors (icons, SVG emblems, badge pills)
 * - Actions (buttons, interactive triggers)
 * 
 * Captures bounding coordinates and prepares elements for sequential reveal.
 */

import type { BlueprintTask, BlueprintTaskType, AgentPersonaId } from './types'

export interface ScannedBlueprint {
  tasks: BlueprintTask[]
  containerRect: DOMRect
  originalStyles: Map<HTMLElement, { opacity: string; transition: string; transform: string }>
}

export class DOMBlueprintScanner {
  /**
   * Scans a target container element and returns an ordered list of tasks
   */
  public static scanContainer(container: HTMLElement): ScannedBlueprint {
    const containerRect = container.getBoundingClientRect()
    const originalStyles = new Map<HTMLElement, { opacity: string; transition: string; transform: string }>()
    const tasks: BlueprintTask[] = []

    // Find candidate elements within container
    const selector = [
      'h1', 'h2', 'h3', 'p', 'button', 'a',
      '[data-swarm-node]',
      '.glass-panel',
      'span.badge', 'div.rounded-2xl', 'div.rounded-3xl', 'div.rounded-xl'
    ].join(', ')

    const elements = Array.from(container.querySelectorAll<HTMLElement>(selector))
      .filter((el) => {
        // Skip invisible or zero-dimension elements
        const r = el.getBoundingClientRect()
        if (r.width < 10 || r.height < 10) return false
        // Skip if inside another element that is already deeply nested
        return true
      })
      .slice(0, 24) // Cap at 24 key focal tasks for crisp, rapid assembly

    // Record original styling and stash
    elements.forEach((el, index) => {
      originalStyles.set(el, {
        opacity: el.style.opacity,
        transition: el.style.transition,
        transform: el.style.transform
      })

      const rect = el.getBoundingClientRect()
      const relativeX = rect.left - containerRect.left
      const relativeY = rect.top - containerRect.top

      const taskType = this.classifyElementType(el)
      const assignedAgent = this.assignPersona(taskType, index)

      const task: BlueprintTask = {
        id: `swarm-task-${index}-${Date.now()}`,
        type: taskType,
        rect: {
          x: relativeX,
          y: relativeY,
          width: rect.width,
          height: rect.height
        },
        textContent: (el.innerText || el.textContent || '').trim().slice(0, 80),
        assignedAgent,
        dependencies: index > 0 ? [`swarm-task-${index - 1}`] : [],
        durationMs: taskType === 'text' ? 450 : 350,
        domElement: el,
        orderIndex: index
      }

      tasks.push(task)
    })

    return {
      tasks,
      containerRect,
      originalStyles
    }
  }

  /**
   * Sets initial build state: hides elements with 0 opacity
   */
  public static applyInitialBuildState(blueprint: ScannedBlueprint): void {
    blueprint.tasks.forEach((t) => {
      t.domElement.style.transition = 'none'
      t.domElement.style.opacity = '0'
      t.domElement.style.transform = 'scale(0.96) translateY(6px)'
    })
  }

  /**
   * Reveals a completed task element with crisp transition
   */
  public static revealTaskElement(task: BlueprintTask): void {
    task.domElement.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    task.domElement.style.opacity = '1'
    task.domElement.style.transform = 'scale(1) translateY(0)'
  }

  /**
   * Restores original styles when swarm finishes or is dismissed
   */
  public static restoreOriginalStyles(blueprint: ScannedBlueprint): void {
    blueprint.originalStyles.forEach((style, el) => {
      el.style.opacity = style.opacity
      el.style.transition = style.transition
      el.style.transform = style.transform
    })
  }

  private static classifyElementType(el: HTMLElement): BlueprintTaskType {
    const tag = el.tagName.toLowerCase()
    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'p') {
      return 'text'
    }
    if (tag === 'button' || tag === 'a' || el.getAttribute('role') === 'button') {
      return 'action'
    }
    if (el.querySelector('svg') || tag === 'svg' || el.classList.contains('badge')) {
      return 'vector'
    }
    return 'container'
  }

  private static assignPersona(type: BlueprintTaskType, index: number): AgentPersonaId {
    switch (type) {
      case 'container':
        return 'frontend' // Sarah
      case 'text':
        return index % 2 === 0 ? 'typescript' : 'frontend' // Alex & Sarah
      case 'vector':
        return 'database' // Arjun
      case 'action':
        return 'sre' // Vikram
      default:
        return 'frontend'
    }
  }
}
