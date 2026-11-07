/**
 * Boids Physics Engine — 60 FPS multi-cursor flocking simulation
 * 
 * Implements Reynolds Flocking algorithm tailored for UI engineering cursors:
 * - Separation, Alignment, Cohesion
 * - Arrival deceleration curve (avoids overshoot)
 * - User cursor repulsion field
 * - Micro-tremor natural human hand motion
 */

import type { AgentBoidState, AgentPersonaId, BlueprintTask } from './types'
import { AGENT_PERSONAS } from './types'

export interface PhysicsWorldConfig {
  maxSpeed: number
  maxForce: number
  slowingRadius: number
  separationRadius: number
  neighborRadius: number
  mouseRepulsionRadius: number
}

export const DEFAULT_PHYSICS_CONFIG: PhysicsWorldConfig = {
  maxSpeed: 14,
  maxForce: 0.8,
  slowingRadius: 120,
  separationRadius: 70,
  neighborRadius: 180,
  mouseRepulsionRadius: 110,
}

export class BoidsEngine {
  private config: PhysicsWorldConfig
  private userMouse: { x: number; y: number } | null = null
  private timeOffset: number = 0

  constructor(config: Partial<PhysicsWorldConfig> = {}) {
    this.config = { ...DEFAULT_PHYSICS_CONFIG, ...config }
  }

  public setUserMouse(x: number | null, y: number | null): void {
    if (x === null || y === null) {
      this.userMouse = null
    } else {
      this.userMouse = { x, y }
    }
  }

  public setSpeedMultiplier(multiplier: number): void {
    this.config.maxSpeed = DEFAULT_PHYSICS_CONFIG.maxSpeed * multiplier
    this.config.maxForce = DEFAULT_PHYSICS_CONFIG.maxForce * multiplier
  }

  /**
   * Initializes initial agent positions scattered around target bounds
   */
  public createInitialAgents(
    bounds: { width: number; height: number },
    agentIds: AgentPersonaId[] = ['frontend', 'typescript', 'database', 'sre']
  ): Map<AgentPersonaId, AgentBoidState> {
    const agents = new Map<AgentPersonaId, AgentBoidState>()

    const spawnAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75]

    agentIds.forEach((id, index) => {
      const angle = spawnAngles[index % spawnAngles.length]
      const radius = Math.min(bounds.width, bounds.height) * 0.4
      const centerX = bounds.width / 2
      const centerY = bounds.height / 2

      const startX = centerX + Math.cos(angle) * radius
      const startY = centerY + Math.sin(angle) * radius

      agents.set(id, {
        id,
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        targetX: startX,
        targetY: startY,
        currentTaskId: null,
        isWorking: false,
        actionText: 'Ready',
        marqueeSelection: null,
        typewriterText: '',
        progress: 0,
      })
    })

    return agents
  }

  /**
   * Main 60 FPS physics tick
   */
  public update(
    agents: Map<AgentPersonaId, AgentBoidState>,
    bounds: { width: number; height: number },
    deltaFactor: number = 1
  ): void {
    this.timeOffset += 0.04 * deltaFactor
    const agentList = Array.from(agents.values())

    agentList.forEach((agent) => {
      let steerX = 0
      let steerY = 0

      // 1. Steering toward Target
      const targetSteer = this.steerToward(agent, agent.targetX, agent.targetY)
      steerX += targetSteer.x * 1.6
      steerY += targetSteer.y * 1.6

      // 2. Separation force (avoid overlapping with other cursors)
      const sep = this.calculateSeparation(agent, agentList)
      steerX += sep.x * 2.2
      steerY += sep.y * 2.2

      // 3. User cursor repulsion field
      if (this.userMouse) {
        const rep = this.calculateMouseRepulsion(agent, this.userMouse.x, this.userMouse.y)
        steerX += rep.x * 3.0
        steerY += rep.y * 3.0
      }

      // Apply steering force to velocity with max force cap
      const steerMag = Math.hypot(steerX, steerY)
      if (steerMag > this.config.maxForce) {
        steerX = (steerX / steerMag) * this.config.maxForce
        steerY = (steerY / steerMag) * this.config.maxForce
      }

      agent.vx += steerX * deltaFactor
      agent.vy += steerY * deltaFactor

      // Limit speed
      const speed = Math.hypot(agent.vx, agent.vy)
      if (speed > this.config.maxSpeed) {
        agent.vx = (agent.vx / speed) * this.config.maxSpeed
        agent.vy = (agent.vy / speed) * this.config.maxSpeed
      }

      // Add gentle damping when very close to target
      const distToTarget = Math.hypot(agent.targetX - agent.x, agent.targetY - agent.y)
      if (distToTarget < 12) {
        agent.vx *= 0.6
        agent.vy *= 0.6
      }

      // Update position
      agent.x += agent.vx * deltaFactor
      agent.y += agent.vy * deltaFactor

      // Clamp within visible bounds with soft padding
      const pad = 20
      agent.x = Math.max(pad, Math.min(bounds.width - pad, agent.x))
      agent.y = Math.max(pad, Math.min(bounds.height - pad, agent.y))
    })
  }

  private steerToward(agent: AgentBoidState, targetX: number, targetY: number): { x: number; y: number } {
    const dx = targetX - agent.x
    const dy = targetY - agent.y
    const dist = Math.hypot(dx, dy)

    if (dist < 1) return { x: 0, y: 0 }

    // Arrival deceleration curve
    let desiredSpeed = this.config.maxSpeed
    if (dist < this.config.slowingRadius) {
      desiredSpeed = this.config.maxSpeed * (dist / this.config.slowingRadius)
    }

    const desiredVx = (dx / dist) * desiredSpeed
    const desiredVy = (dy / dist) * desiredSpeed

    return {
      x: desiredVx - agent.vx,
      y: desiredVy - agent.vy,
    }
  }

  private calculateSeparation(
    agent: AgentBoidState,
    allAgents: AgentBoidState[]
  ): { x: number; y: number } {
    let steerX = 0
    let steerY = 0
    let count = 0

    allAgents.forEach((other) => {
      if (other.id === agent.id) return

      const dx = agent.x - other.x
      const dy = agent.y - other.y
      const dist = Math.hypot(dx, dy)

      if (dist > 0 && dist < this.config.separationRadius) {
        // Force inversely proportional to distance squared
        const force = 1 / Math.max(dist, 1)
        steerX += (dx / dist) * force * 40
        steerY += (dy / dist) * force * 40
        count++
      }
    })

    if (count > 0) {
      steerX /= count
      steerY /= count
    }

    return { x: steerX, y: steerY }
  }

  private calculateMouseRepulsion(
    agent: AgentBoidState,
    mouseX: number,
    mouseY: number
  ): { x: number; y: number } {
    const dx = agent.x - mouseX
    const dy = agent.y - mouseY
    const dist = Math.hypot(dx, dy)

    if (dist > 0 && dist < this.config.mouseRepulsionRadius) {
      const factor = (1 - dist / this.config.mouseRepulsionRadius) ** 2
      return {
        x: (dx / dist) * factor * this.config.maxForce * 2.5,
        y: (dy / dist) * factor * this.config.maxForce * 2.5,
      }
    }

    return { x: 0, y: 0 }
  }
}

