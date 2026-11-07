/**
 * Spring-Damper Trajectory & Banking Physics for Multi-Player Cursors
 */

import type { SpringCursorState, AgentPersonaId } from './types'

export class SwarmSpringEngine {
  private stiffness: number = 0.085
  private damping: number = 0.76

  /**
   * Initializes responsive agent squad
   */
  public createInitialCursors(width: number, height: number): Map<AgentPersonaId, SpringCursorState> {
    const isMobile = width < 768
    const personaIds: AgentPersonaId[] = isMobile ? ['sarah', 'alex'] : ['sarah', 'alex', 'arjun', 'vikram']

    const map = new Map<AgentPersonaId, SpringCursorState>()
    const startX = width / 2
    const startY = Math.min(100, height * 0.15)

    personaIds.forEach((id, idx) => {
      const angle = (idx / personaIds.length) * Math.PI * 2
      const radius = 35 + idx * 8
      map.set(id, {
        id,
        x: startX + Math.cos(angle) * radius,
        y: startY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        targetX: startX + Math.cos(angle) * radius,
        targetY: startY + Math.sin(angle) * radius,
        tiltAngle: 0,
        cursorMode: 'arrow',
        actionText: 'Ready',
        opacity: 0,
      })
    })

    return map
  }

  /**
   * Updates spring physics positions with banking tilt
   */
  public update(
    cursors: Map<AgentPersonaId, SpringCursorState>,
    speedMultiplier: number,
    deltaFactor: number
  ): void {
    const speed = Math.max(0.6, speedMultiplier)

    cursors.forEach((cursor) => {
      // Spring force toward target
      const dx = cursor.targetX - cursor.x
      const dy = cursor.targetY - cursor.y

      const ax = dx * this.stiffness * speed
      const ay = dy * this.stiffness * speed

      cursor.vx = (cursor.vx + ax * deltaFactor) * Math.pow(this.damping, deltaFactor)
      cursor.vy = (cursor.vy + ay * deltaFactor) * Math.pow(this.damping, deltaFactor)

      cursor.x += cursor.vx * deltaFactor
      cursor.y += cursor.vy * deltaFactor

      // Calculate banking tilt based on velocity
      const velocityMag = Math.sqrt(cursor.vx * cursor.vx + cursor.vy * cursor.vy)
      if (velocityMag > 0.4) {
        const targetTilt = Math.max(-18, Math.min(18, (cursor.vx / 8) * 12))
        cursor.tiltAngle += (targetTilt - cursor.tiltAngle) * 0.15
      } else {
        cursor.tiltAngle *= 0.85
      }

      // Smooth fade-in
      cursor.opacity = Math.min(1, cursor.opacity + 0.05 * deltaFactor)
    })
  }
}
