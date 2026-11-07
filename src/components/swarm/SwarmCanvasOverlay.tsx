import React, { useEffect, useRef, useState } from 'react'
import type { SwarmAgentState, AgentPersonaId, SwarmRebuildTask } from '@/lib/swarm/types'
import { BoidsEngine } from '@/lib/swarm/boidsEngine'
import { TaskChoreographer } from '@/lib/swarm/taskChoreographer'
import { SwarmAgentCursor } from './SwarmAgentCursor'
import { SwarmControlsToolbar } from './SwarmControlsToolbar'
import { swarmAudio } from '@/lib/swarm/audioSynthesizer'

interface SwarmCanvasOverlayProps {
  tasks: SwarmRebuildTask[]
  defaultSpeed?: '1x' | '2x' | '3x'
  defaultMuted?: boolean
  onComplete?: () => void
  onDismiss: () => void
}

export const SwarmCanvasOverlay: React.FC<SwarmCanvasOverlayProps> = ({
  tasks,
  defaultSpeed = '2x',
  defaultMuted = true,
  onComplete,
  onDismiss,
}) => {
  const [speed, setSpeed] = useState<'1x' | '2x' | '3x'>(defaultSpeed)
  const [isMuted, setIsMuted] = useState<boolean>(defaultMuted)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [progress, setProgress] = useState<number>(0)
  const [completedCount, setCompletedCount] = useState<number>(0)

  const agentsRef = useRef<Map<AgentPersonaId, SwarmAgentState>>(new Map())
  const [, setFrameTick] = useState<number>(0)

  const boidsEngineRef = useRef<BoidsEngine>(new BoidsEngine())
  const choreographerRef = useRef<TaskChoreographer | null>(null)
  const animFrameIdRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(performance.now())

  // Audio mute sync
  useEffect(() => {
    swarmAudio.setMuted(isMuted)
  }, [isMuted])

  // Esc key listener for instant Go Live
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onDismiss()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onDismiss])

  // Main Swarm Loop
  useEffect(() => {
    const bounds = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    // Initialize 6 personas
    const initialAgents = boidsEngineRef.current.createInitialAgents(bounds, [
      'sarah', 'alex', 'arjun', 'vikram', 'elena', 'dev'
    ])
    agentsRef.current = initialAgents

    // Initialize Choreographer
    const choreographer = new TaskChoreographer(tasks, {
      onProgress: (p, compCount) => {
        setProgress(p)
        setCompletedCount(compCount)
      },
      onAllCompleted: () => {
        setIsPlaying(false)
        onComplete?.()
      },
    })
    choreographer.setSpeed(speed)
    choreographer.start()
    choreographerRef.current = choreographer

    // User mouse repulsion listener
    const handleMouseMove = (e: MouseEvent) => {
      boidsEngineRef.current.setUserMouse(e.clientX, e.clientY)
    }
    const handleMouseLeave = () => {
      boidsEngineRef.current.setUserMouse(null, null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // 60 FPS Render Loop
    let running = true
    const loop = (time: number) => {
      if (!running) return

      const deltaMs = Math.min(time - lastTimeRef.current, 50)
      lastTimeRef.current = time

      // Update Boids physics
      boidsEngineRef.current.update(agentsRef.current, bounds, deltaMs / 16.66)

      // Update Choreographer
      if (choreographerRef.current && isPlaying) {
        choreographerRef.current.update(agentsRef.current, deltaMs)
      }

      setFrameTick((prev) => (prev + 1) % 1000)
      animFrameIdRef.current = requestAnimationFrame(loop)
    }

    animFrameIdRef.current = requestAnimationFrame(loop)

    return () => {
      running = false
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [tasks])

  const handleSpeedChange = (newSpeed: '1x' | '2x' | '3x') => {
    setSpeed(newSpeed)
    choreographerRef.current?.setSpeed(newSpeed)
    boidsEngineRef.current.setSpeedMultiplier(newSpeed === '1x' ? 1 : newSpeed === '2x' ? 1.6 : 2.4)
  }

  const handleTogglePlay = () => {
    if (isPlaying) {
      choreographerRef.current?.pause()
      setIsPlaying(false)
    } else {
      choreographerRef.current?.start()
      setIsPlaying(true)
    }
  }

  const handleReplay = () => {
    choreographerRef.current?.reset()
    choreographerRef.current?.start()
    setProgress(0)
    setCompletedCount(0)
    setIsPlaying(true)
  }

  const agentsList = Array.from(agentsRef.current.values())
  const laserLines = choreographerRef.current?.activeLaserLines || []

  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden select-none">
      
      {/* Top Floating Controls HUD */}
      <SwarmControlsToolbar
        progress={progress}
        activeCount={completedCount}
        totalCount={tasks.length}
        isPlaying={isPlaying}
        isMuted={isMuted}
        speed={speed}
        onTogglePlay={handleTogglePlay}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onChangeSpeed={handleSpeedChange}
        onReplay={handleReplay}
        onDismiss={onDismiss}
      />

      {/* Full-Viewport SVG for Marquee Crosshairs & Alignment Laser Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Laser Ruler Guides */}
        {laserLines.map((line) => {
          if (line.orientation === 'horizontal') {
            return (
              <line
                key={line.id}
                x1={line.startPos}
                y1={line.pos}
                x2={line.endPos}
                y2={line.pos}
                stroke={line.color}
                strokeWidth="1.2"
                strokeDasharray="6 4"
                opacity={line.opacity}
              />
            )
          } else {
            return (
              <line
                key={line.id}
                x1={line.pos}
                y1={line.startPos}
                x2={line.pos}
                y2={line.endPos}
                stroke={line.color}
                strokeWidth="1.2"
                strokeDasharray="6 4"
                opacity={line.opacity}
              />
            )
          }
        })}

        {/* Marquee Boxes */}
        {agentsList.map((agent) => {
          const m = agent.marqueeBox
          if (!m) return null

          return (
            <g key={`marquee-${agent.id}`}>
              <rect
                x={m.x}
                y={m.y}
                width={Math.max(1, m.width)}
                height={Math.max(1, m.height)}
                fill={`${m.color}15`}
                stroke={m.color}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                rx="6"
              />
              <rect
                x={m.x}
                y={Math.max(0, m.y - 18)}
                width={m.label.length * 6.5 + 14}
                height="16"
                fill={m.color}
                rx="4"
              />
              <text
                x={m.x + 6}
                y={Math.max(11, m.y - 6)}
                fill="#ffffff"
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                {m.label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* 6 Live Agent Cursors */}
      {agentsList.map((agent) => (
        <SwarmAgentCursor key={agent.id} agent={agent} />
      ))}
    </div>
  )
}
