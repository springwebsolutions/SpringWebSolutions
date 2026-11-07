/**
 * Task Choreographer — Schedules, assigns, and executes design-tool Swarm Rebuild tasks
 */

import type { SwarmRebuildTask, SwarmAgentState, AgentPersonaId, LaserSnapLine } from './types'
import { AGENT_PERSONAS } from './types'
import { SiteBlueprintEngine } from './siteBlueprintEngine'
import { swarmAudio } from './audioSynthesizer'

export interface ChoreographerEvents {
  onProgress?: (progress: number, completedCount: number, totalCount: number) => void
  onTaskCompleted?: (task: SwarmRebuildTask) => void
  onAllCompleted?: () => void
}

export class TaskChoreographer {
  private tasks: SwarmRebuildTask[] = []
  private pendingTasks: SwarmRebuildTask[] = []
  private completedTaskIds: Set<string> = new Set()
  private speedMultiplier: number = 2
  private isRunning: boolean = false
  private events: ChoreographerEvents = {}
  public activeLaserLines: LaserSnapLine[] = []

  constructor(tasks: SwarmRebuildTask[], events: ChoreographerEvents = {}) {
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
        this.speedMultiplier = 2.2
        break
      case '3x':
        this.speedMultiplier = 3.6
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
    this.activeLaserLines = []
    this.isRunning = false
  }

  public getProgress(): number {
    if (this.tasks.length === 0) return 100
    return Math.round((this.completedTaskIds.size / this.tasks.length) * 100)
  }

  /**
   * Main simulation frame tick
   */
  public update(agents: Map<AgentPersonaId, SwarmAgentState>, deltaMs: number): void {
    if (!this.isRunning) return

    // 1. Assign pending tasks to available agents (Multi-Agent Concurrent Queue)
    this.pendingTasks = this.pendingTasks.filter((task) => {
      // Find assigned persona, or allow any idle agent to assist
      let agent = agents.get(task.assignedAgent)
      if (!agent || agent.isWorking) {
        agent = Array.from(agents.values()).find((a) => !a.isWorking)
      }
      if (!agent) return true // All agents are currently working

      // Assign task
      agent.isWorking = true
      agent.currentTaskId = task.id
      agent.progress = 0

      // Calculate target anchor coordinates
      const targetX = task.rect.x + task.rect.width / 2
      const targetY = task.rect.y + task.rect.height / 2
      agent.targetX = targetX
      agent.targetY = targetY

      const persona = AGENT_PERSONAS[agent.id]

      switch (task.type) {
        case 'marquee_box':
          agent.cursorMode = 'crosshair'
          agent.actionText = `Marquee [${Math.round(task.rect.width)}×${Math.round(task.rect.height)}]`
          break
        case 'typewriter':
          agent.cursorMode = 'caret'
          agent.actionText = `Typing "${task.textSnippet?.slice(0, 16)}…"`
          break
        case 'option_clone':
          agent.cursorMode = 'clone'
          agent.actionText = `⌥ Option Duplicate`
          break
        case 'vector_pen':
          agent.cursorMode = 'crosshair'
          agent.actionText = `Pen Tool Vector`
          break
        default:
          agent.cursorMode = 'arrow'
          agent.actionText = `Snap Element`
          break
      }

      // Add temporary ruler snap line across axis
      if (Math.random() < 0.35) {
        this.activeLaserLines.push({
          id: `line-${task.id}`,
          orientation: Math.random() < 0.5 ? 'horizontal' : 'vertical',
          pos: task.rect.y,
          startPos: Math.max(0, task.rect.x - 200),
          endPos: task.rect.x + task.rect.width + 200,
          color: persona.color,
          opacity: 0.8,
        })
      }

      return false // Successfully assigned
    })

    // Fade active laser snap lines
    this.activeLaserLines = this.activeLaserLines
      .map((l) => ({ ...l, opacity: l.opacity - 0.05 }))
      .filter((l) => l.opacity > 0)

    // 2. Step work progress for active agents
    agents.forEach((agent) => {
      if (!agent.isWorking || !agent.currentTaskId) return

      const task = this.tasks.find((t) => t.id === agent.currentTaskId)
      if (!task) {
        agent.isWorking = false
        agent.currentTaskId = null
        return
      }

      // Advance work progress
      const duration = task.durationMs / this.speedMultiplier
      const step = deltaMs / duration
      agent.progress = Math.min(1, agent.progress + step)

      const persona = AGENT_PERSONAS[agent.id]

      // Visual updates based on task type
      if (task.type === 'marquee_box' || task.type === 'option_clone') {
        const p = agent.progress
        agent.marqueeBox = {
          x: task.rect.x,
          y: task.rect.y,
          width: task.rect.width * p,
          height: task.rect.height * p,
          color: persona.color,
          label: `${persona.name} • ${Math.round(task.rect.width * p)}×${Math.round(task.rect.height * p)}`,
        }
      } else if (task.type === 'typewriter') {
        const text = task.textSnippet || ''
        const charCount = Math.floor(text.length * agent.progress)
        agent.typewriterText = text.slice(0, charCount)
        if (Math.random() < 0.3) {
          swarmAudio.playTypewriterTick()
        }
      }

      // 3. Task Completion check
      if (agent.progress >= 1) {
        SiteBlueprintEngine.revealTask(task)
        swarmAudio.playSnapPop(task.type === 'marquee_box' ? 520 : 680)

        // Reset agent work state
        agent.isWorking = false
        agent.currentTaskId = null
        agent.cursorMode = 'arrow'
        agent.marqueeBox = null
        agent.typewriterText = ''
        agent.actionText = 'Live'

        this.completedTaskIds.add(task.id)
        this.events.onTaskCompleted?.(task)

        const currentProgress = this.getProgress()
        this.events.onProgress?.(currentProgress, this.completedTaskIds.size, this.tasks.length)

        // All tasks completed check
        if (this.completedTaskIds.size >= this.tasks.length) {
          this.isRunning = false
          swarmAudio.playBuildCompleteChime()
          this.events.onAllCompleted?.()
        }
      }
    })
  }
}
