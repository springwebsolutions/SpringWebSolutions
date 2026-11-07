/**
 * Task Choreographer — Enforces 5-Phase Hierarchical Staging & Squad Clustering
 * 
 * Implements strict sequential phase gating:
 *   Phase 1: Wireframing Containers -> Phase 2: Alignment Guides ->
 *   Phase 3: Typographic Streaming -> Phase 4: Detailing & ⌥-Clone ->
 *   Phase 5: Synthesis / Going Live
 */

import type {
  SwarmRebuildTask, SwarmAgentState, AgentPersonaId,
  LaserSnapLine, DistanceIndicator, SwarmPhaseId
} from './types'
import { AGENT_PERSONAS } from './types'
import { SiteBlueprintEngine } from './siteBlueprintEngine'
import { swarmAudio } from './audioSynthesizer'

export interface ChoreographerEvents {
  onProgress?: (progress: number, completedCount: number, totalCount: number, phase: SwarmPhaseId) => void
  onPhaseChange?: (phase: SwarmPhaseId) => void
  onTaskCompleted?: (task: SwarmRebuildTask) => void
  onAllCompleted?: () => void
}

export class TaskChoreographer {
  private allTasks: SwarmRebuildTask[] = []
  private phaseTasksMap: Map<SwarmPhaseId, SwarmRebuildTask[]> = new Map()
  private currentPhase: SwarmPhaseId = 1
  private pendingPhaseTasks: SwarmRebuildTask[] = []
  private completedTaskIds: Set<string> = new Set()
  
  private speedMultiplier: number = 2
  private isRunning: boolean = false
  private events: ChoreographerEvents = {}
  
  public activeLaserLines: LaserSnapLine[] = []
  public activeDistanceIndicators: DistanceIndicator[] = []

  constructor(tasks: SwarmRebuildTask[], events: ChoreographerEvents = {}) {
    this.allTasks = [...tasks]
    this.events = events

    // Group tasks by phase
    const phases: SwarmPhaseId[] = [1, 2, 3, 4]
    phases.forEach((p) => {
      this.phaseTasksMap.set(p, tasks.filter((t) => t.phase === p))
    })

    this.initPhase(1)
  }

  private initPhase(phase: SwarmPhaseId): void {
    this.currentPhase = phase
    this.pendingPhaseTasks = [...(this.phaseTasksMap.get(phase) || [])]
    this.events.onPhaseChange?.(phase)

    // Trigger phase sound
    if (phase === 2) {
      swarmAudio.playSnapPop(750)
    } else if (phase === 3) {
      swarmAudio.playSnapPop(600)
    } else if (phase === 4) {
      swarmAudio.playSnapPop(520)
    }
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
    this.completedTaskIds.clear()
    this.activeLaserLines = []
    this.activeDistanceIndicators = []
    this.isRunning = false
    this.initPhase(1)
  }

  public getCurrentPhase(): SwarmPhaseId {
    return this.currentPhase
  }

  public getProgress(): number {
    if (this.allTasks.length === 0) return 100
    return Math.round((this.completedTaskIds.size / this.allTasks.length) * 100)
  }

  /**
   * Main simulation frame tick
   */
  public update(agents: Map<AgentPersonaId, SwarmAgentState>, deltaMs: number): void {
    if (!this.isRunning) return

    // ─────────────────────────────────────────────────────────────
    // 1. Task Assignment for Current Phase (Phase-Gated Queue)
    // ─────────────────────────────────────────────────────────────
    this.pendingPhaseTasks = this.pendingPhaseTasks.filter((task) => {
      // Find assigned persona, or assign to any idle agent
      let agent = agents.get(task.assignedAgent)
      if (!agent || agent.isWorking) {
        agent = Array.from(agents.values()).find((a) => !a.isWorking)
      }
      if (!agent) return true // All agents are currently busy

      // Assign task to this agent
      agent.isWorking = true
      agent.currentTaskId = task.id
      agent.progress = 0

      // Calculate center anchor
      const targetX = task.rect.x + task.rect.width / 2
      const targetY = task.rect.y + task.rect.height / 2
      agent.targetX = targetX
      agent.targetY = targetY

      const persona = AGENT_PERSONAS[agent.id]

      // Set specialized cursor behaviors based on task type
      switch (task.type) {
        case 'marquee_box':
          agent.cursorMode = 'crosshair'
          agent.actionText = `Frame [${Math.round(task.rect.width)}×${Math.round(task.rect.height)}]`
          break
        case 'snap_guide':
          agent.cursorMode = 'arrow'
          agent.actionText = `Snap: ${task.textSnippet || 'Axis'}`
          // Fire a laser line across the canvas
          this.activeLaserLines.push({
            id: `snap-${task.id}`,
            orientation: 'horizontal',
            pos: task.rect.y,
            startPos: Math.max(0, task.rect.x - 300),
            endPos: task.rect.x + task.rect.width + 300,
            color: persona.color,
            opacity: 1,
            label: task.textSnippet,
          })
          break
        case 'typewriter':
          agent.cursorMode = 'caret'
          agent.actionText = `Typing: "${task.textSnippet?.slice(0, 18)}…"`
          break
        case 'option_clone':
          agent.cursorMode = 'clone'
          agent.actionText = `⌥ Option Duplicate`
          // Add distance gap indicator between previous card and current
          if (task.cloneFromTaskId) {
            this.activeDistanceIndicators.push({
              x1: task.rect.x - (task.distanceGapPx || 12),
              y1: task.rect.y + task.rect.height / 2,
              x2: task.rect.x,
              y2: task.rect.y + task.rect.height / 2,
              gapPx: task.distanceGapPx || 12,
              label: `${task.distanceGapPx || 12}px`,
              color: '#f43f5e',
            })
          }
          break
        case 'vector_pen':
          agent.cursorMode = 'crosshair'
          agent.actionText = `Pen Tool Vector`
          break
      }

      return false // Successfully assigned
    })

    // Fade laser snap lines smoothly
    this.activeLaserLines = this.activeLaserLines
      .map((l) => ({ ...l, opacity: l.opacity - 0.04 }))
      .filter((l) => l.opacity > 0)

    // Clear stale distance indicators
    if (this.activeDistanceIndicators.length > 4) {
      this.activeDistanceIndicators.shift()
    }

    // ─────────────────────────────────────────────────────────────
    // 2. Step Work Progress for Active Agents
    // ─────────────────────────────────────────────────────────────
    agents.forEach((agent) => {
      if (!agent.isWorking || !agent.currentTaskId) return

      const task = this.allTasks.find((t) => t.id === agent.currentTaskId)
      if (!task) {
        agent.isWorking = false
        agent.currentTaskId = null
        return
      }

      // Step progress
      const duration = task.durationMs / this.speedMultiplier
      const step = deltaMs / duration
      agent.progress = Math.min(1, agent.progress + step)

      const persona = AGENT_PERSONAS[agent.id]

      // Visual feedback updates
      if (task.type === 'marquee_box') {
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
        agent.typewriterText = text.slice(0, charCount) + '|'
        if (Math.random() < 0.28) {
          swarmAudio.playTypewriterTick()
        }
      } else if (task.type === 'option_clone') {
        const p = agent.progress
        agent.marqueeBox = {
          x: task.rect.x,
          y: task.rect.y,
          width: task.rect.width,
          height: task.rect.height * p,
          color: persona.color,
          label: `⌥ Duplicate (${Math.round(p * 100)}%)`,
        }
      }

      // ─────────────────────────────────────────────────────────────
      // 3. Task Completion Check
      // ─────────────────────────────────────────────────────────────
      if (agent.progress >= 1) {
        SiteBlueprintEngine.revealTask(task)

        if (task.type === 'marquee_box') {
          swarmAudio.playSnapPop(520)
        } else if (task.type === 'option_clone') {
          swarmAudio.playSnapPop(680)
        } else if (task.type === 'snap_guide') {
          swarmAudio.playSnapPop(820)
        }

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
        this.events.onProgress?.(currentProgress, this.completedTaskIds.size, this.allTasks.length, this.currentPhase)

        // ───────────────────────────────────────────────────────────
        // 4. Phase Transition Check
        // ───────────────────────────────────────────────────────────
        const currentPhaseTasks = this.phaseTasksMap.get(this.currentPhase) || []
        const currentPhaseCompleted = currentPhaseTasks.every((t) => this.completedTaskIds.has(t.id))

        if (currentPhaseCompleted && this.pendingPhaseTasks.length === 0) {
          if (this.currentPhase < 4) {
            const nextPhase = (this.currentPhase + 1) as SwarmPhaseId
            this.initPhase(nextPhase)
          } else {
            // All phases completed! Phase 5: Synthesis
            this.currentPhase = 5
            this.isRunning = false
            this.activeDistanceIndicators = []
            this.activeLaserLines = []
            swarmAudio.playBuildCompleteChime()
            this.events.onProgress?.(100, this.allTasks.length, this.allTasks.length, 5)
            this.events.onPhaseChange?.(5)
            this.events.onAllCompleted?.()
          }
        }
      }
    })
  }
}
