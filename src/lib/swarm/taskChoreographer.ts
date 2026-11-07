/**
 * Task Choreographer — Schedules, assigns, and executes Blueprint tasks across the swarm
 */

import type { BlueprintTask, AgentBoidState, AgentPersonaId } from './types'
import { AGENT_PERSONAS } from './types'
import { DOMBlueprintScanner } from './domBlueprintScanner'
import { swarmAudio } from './audioSynthesizer'

export interface ChoreographerEvents {
  onProgress?: (progress: number, completedCount: number, totalCount: number) => void
  onTaskCompleted?: (task: BlueprintTask) => void
  onAllCompleted?: () => void
}

export class TaskChoreographer {
  private tasks: BlueprintTask[] = []
  private pendingTasks: BlueprintTask[] = []
  private completedTaskIds: Set<string> = new Set()
  private speedMultiplier: number = 2
  private isRunning: boolean = false
  private events: ChoreographerEvents = {}

  constructor(tasks: BlueprintTask[], events: ChoreographerEvents = {}) {
    this.tasks = [...tasks]
    this.pendingTasks = [...tasks]
    this.events = events
  }

  public setSpeed(speed: '1x' | '2x' | '3x'): void {
    switch (speed) {
      case '1x':
        this.speedMultiplier = 1
        break
      case '2x':
        this.speedMultiplier = 2
        break
      case '3x':
        this.speedMultiplier = 3.2
        break
    }
  }

  public start(): void {
    this.isRunning = true
  }

  public pause(): void {
    this.isRunning = false
  }

  public reset(): void {
    this.pendingTasks = [...this.tasks]
    this.completedTaskIds.clear()
    this.isRunning = false
  }

  public getProgress(): number {
    if (this.tasks.length === 0) return 100
    return Math.round((this.completedTaskIds.size / this.tasks.length) * 100)
  }

  /**
   * Called every frame to step the task execution DAG
   */
  public update(agents: Map<AgentPersonaId, AgentBoidState>, deltaMs: number): void {
    if (!this.isRunning) return

    // 1. Assign pending tasks to available agents
    this.pendingTasks = this.pendingTasks.filter((task) => {
      // Check if task dependencies are satisfied
      const depsReady = task.dependencies.every((depId) => this.completedTaskIds.has(depId))
      if (!depsReady) return true // Keep waiting

      // Check if assigned agent is free
      const agent = agents.get(task.assignedAgent)
      if (!agent || agent.isWorking) return true

      // Assign task to this agent
      agent.isWorking = true
      agent.currentTaskId = task.id
      agent.progress = 0

      // Calculate anchor point
      const targetX = task.rect.x + task.rect.width / 2
      const targetY = task.rect.y + task.rect.height / 2
      agent.targetX = targetX
      agent.targetY = targetY

      const persona = AGENT_PERSONAS[agent.id]
      if (task.type === 'container') {
        agent.actionText = `Marquee Box [${Math.round(task.rect.width)}×${Math.round(task.rect.height)}]`
      } else if (task.type === 'text') {
        agent.actionText = `Typewriter "${task.textContent?.slice(0, 18)}…"`
      } else if (task.type === 'vector') {
        agent.actionText = `Vector Snap [${persona.name}]`
      } else {
        agent.actionText = `Hydrate Component`
      }

      return false // Removed from pending
    })

    // 2. Step work progress for active agents
    agents.forEach((agent) => {
      if (!agent.isWorking || !agent.currentTaskId) return

      const task = this.tasks.find((t) => t.id === agent.currentTaskId)
      if (!task) {
        agent.isWorking = false
        agent.currentTaskId = null
        return
      }

      // Check if agent has arrived near task
      const dist = Math.hypot(agent.targetX - agent.x, agent.targetY - agent.y)
      if (dist > 35 && agent.progress === 0) {
        // Still flying toward target, don't advance work progress yet
        return
      }

      // Advance work progress
      const duration = task.durationMs / this.speedMultiplier
      const step = (deltaMs / duration)
      agent.progress = Math.min(1, agent.progress + step)

      const persona = AGENT_PERSONAS[agent.id]

      // Visual updates based on task type
      if (task.type === 'container') {
        // Expand marquee selection box
        const p = agent.progress
        agent.marqueeSelection = {
          x: task.rect.x,
          y: task.rect.y,
          width: task.rect.width * p,
          height: task.rect.height * p,
          color: persona.color,
          label: `${persona.name} • ${Math.round(task.rect.width * p)}×${Math.round(task.rect.height * p)}`,
        }
      } else if (task.type === 'text') {
        // Advance typewriter text
        const text = task.textContent || ''
        const charCount = Math.floor(text.length * agent.progress)
        agent.typewriterText = text.slice(0, charCount)
        if (Math.random() < 0.28) {
          swarmAudio.playTypewriterTick()
        }
      }

      // 3. Task Completion check
      if (agent.progress >= 1) {
        // Reveal DOM element
        DOMBlueprintScanner.revealTaskElement(task)
        swarmAudio.playSnapPop(task.type === 'container' ? 440 : 660)

        // Clear agent work state
        agent.isWorking = false
        agent.currentTaskId = null
        agent.marqueeSelection = null
        agent.typewriterText = ''
        agent.actionText = 'Sync Complete'

        this.completedTaskIds.add(task.id)
        this.events.onTaskCompleted?.(task)

        const currentProgress = this.getProgress()
        this.events.onProgress?.(currentProgress, this.completedTaskIds.size, this.tasks.length)

        // All tasks completed check
        if (this.completedTaskIds.size === this.tasks.length) {
          this.isRunning = false
          swarmAudio.playBuildCompleteChime()
          this.events.onAllCompleted?.()
        }
      }
    })
  }
}

