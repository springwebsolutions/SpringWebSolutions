import React, { useEffect, useRef, useState } from 'react'
import type { SwarmAgentState, AgentPersonaId, SwarmRebuildTask, SwarmPhaseId } from '@/lib/swarm/types'
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
  const [currentPhase, setCurrentPhase] = useState<SwarmPhaseId>(1)

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
      onProgress: (p, compCount, _total, phase) => {
        setProgress(p)
        setCompletedCount(compCount)
        if (phase) setCurrentPhase(phase)
      },
      onPhaseChange: (phase) => {
        setCurrentPhase(phase)
      },
      onAllCompleted: () => {
        setIsPlaying(false)
        setCurrentPhase(5)
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
    setCurrentPhase(1)
    setIsPlaying(true)
  }

  const agentsList = Array.from(agentsRef.current.values())
  const laserLines = choreographerRef.current?.activeLaserLines || []
  const distanceIndicators = choreographerRef.current?.activeDistanceIndicators || []

  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden select-none">
      
      {/* Top Floating Controls HUD */}
      <SwarmControlsToolbar
        progress={progress}
        activeCount={completedCount}
        totalCount={tasks.length}
        currentPhase={currentPhase}
        isPlaying={isPlaying}
        isMuted={isMuted}
        speed={speed}
        onTogglePlay={handleTogglePlay}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onChangeSpeed={handleSpeedChange}
        onReplay={handleReplay}
        onDismiss={onDismiss}
      />

      {/* Full-Viewport SVG for Marquee Crosshairs, Laser Guides & Distance Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Laser Ruler Guides */}
        {laserLines.map((line) => {
          if (line.orientation === 'horizontal') {
            return (
              <g key={line.id} opacity={line.opacity}>
                <line
                  x1={line.startPos}
                  y1={line.pos}
                  x2={line.endPos}
                  y2={line.pos}
                  stroke={line.color}
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  filter="url(#laserGlow)"
                />
                {line.label && (
                  <text
                    x={line.startPos + 10}
                    y={line.pos - 4}
                    fill={line.color}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {line.label}
                  </text>
                )}
              </g>
            )
          } else {
            return (
              <g key={line.id} opacity={line.opacity}>
                <line
                  x1={line.pos}
                  y1={line.startPos}
                  x2={line.pos}
                  y2={line.endPos}
                  stroke={line.color}
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  filter="url(#laserGlow)"
                />
              </g>
            )
          }
        })}

        {/* Distance Gap Indicators (for Option-Clone Cards) */}
        {distanceIndicators.map((dist, idx) => (
          <g key={`dist-${idx}`}>
            <line
              x1={dist.x1}
              y1={dist.y1}
              x2={dist.x2}
              y2={dist.y2}
              stroke={dist.color}
              strokeWidth="1.5"
            />
            {/* End caps */}
            <line x1={dist.x1} y1={dist.y1 - 4} x2={dist.x1} y2={dist.y1 + 4} stroke={dist.color} strokeWidth="1.5" />
            <line x1={dist.x2} y1={dist.y2 - 4} x2={dist.x2} y2={dist.y2 + 4} stroke={dist.color} strokeWidth="1.5" />
            {/* Pill */}
            <rect
              x={(dist.x1 + dist.x2) / 2 - 16}
              y={dist.y1 - 10}
              width="32"
              height="14"
              fill={dist.color}
              rx="3"
            />
            <text
              x={(dist.x1 + dist.x2) / 2}
              y={dist.y1}
              fill="#ffffff"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              {dist.label}
            </text>
          </g>
        ))}

        {/* Marquee Bounding Boxes with Corner Handles */}
        {agentsList.map((agent) => {
          const m = agent.marqueeBox
          if (!m) return null

          const w = Math.max(2, m.width)
          const h = Math.max(2, m.height)
          const handleSize = 5

          return (
            <g key={`marquee-${agent.id}`}>
              {/* Dashed selection rect */}
              <rect
                x={m.x}
                y={m.y}
                width={w}
                height={h}
                fill={`${m.color}15`}
                stroke={m.color}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                rx="6"
              />

              {/* Figma Corner Handles */}
              <rect x={m.x - 2} y={m.y - 2} width={handleSize} height={handleSize} fill="#ffffff" stroke={m.color} strokeWidth="1" />
              <rect x={m.x + w - 3} y={m.y - 2} width={handleSize} height={handleSize} fill="#ffffff" stroke={m.color} strokeWidth="1" />
              <rect x={m.x - 2} y={m.y + h - 3} width={handleSize} height={handleSize} fill="#ffffff" stroke={m.color} strokeWidth="1" />
              <rect x={m.x + w - 3} y={m.y + h - 3} width={handleSize} height={handleSize} fill="#ffffff" stroke={m.color} strokeWidth="1" />

              {/* Label Pill */}
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
