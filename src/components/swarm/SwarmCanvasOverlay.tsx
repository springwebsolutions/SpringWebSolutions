import React, { useEffect, useRef, useState } from 'react'
import type { AgentBoidState, AgentPersonaId, BlueprintTask } from '@/lib/swarm/types'
import { AGENT_PERSONAS } from '@/lib/swarm/types'
import { BoidsEngine } from '@/lib/swarm/boidsEngine'
import { TaskChoreographer } from '@/lib/swarm/taskChoreographer'
import { SwarmAgentCursor } from './SwarmAgentCursor'
import { SwarmControlsToolbar } from './SwarmControlsToolbar'
import { swarmAudio } from '@/lib/swarm/audioSynthesizer'

interface SwarmCanvasOverlayProps {
  tasks: BlueprintTask[]
  containerRef?: React.RefObject<HTMLElement | null>
  defaultSpeed?: '1x' | '2x' | '3x'
  defaultMuted?: boolean
  onComplete?: () => void
  onDismiss: () => void
}

export const SwarmCanvasOverlay: React.FC<SwarmCanvasOverlayProps> = ({
  tasks,
  containerRef,
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

  // Agent states map
  const agentsRef = useRef<Map<AgentPersonaId, AgentBoidState>>(new Map())
  const [, setFrameTick] = useState<number>(0)

  // Engines
  const boidsEngineRef = useRef<BoidsEngine>(new BoidsEngine())
  const choreographerRef = useRef<TaskChoreographer | null>(null)
  const animFrameIdRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(performance.now())

  // Initialize Audio & Choreographer
  useEffect(() => {
    swarmAudio.setMuted(isMuted)
  }, [isMuted])

  useEffect(() => {
    const container = containerRef?.current || document.body
    const rect = container.getBoundingClientRect()
    const bounds = {
      width: rect.width || window.innerWidth,
      height: rect.height || window.innerHeight,
    }

    // Initialize initial agents
    const initialAgents = boidsEngineRef.current.createInitialAgents(bounds)
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

    // Mouse listener for cursor repulsion
    const handleMouseMove = (e: MouseEvent) => {
      let x = e.clientX
      let y = e.clientY
      if (containerRef?.current) {
        const cRect = containerRef.current.getBoundingClientRect()
        x -= cRect.left
        y -= cRect.top
      }
      boidsEngineRef.current.setUserMouse(x, y)
    }

    const handleMouseLeave = () => {
      boidsEngineRef.current.setUserMouse(null, null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Main 60 FPS Render Loop
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

      // Trigger React render tick for cursor transforms
      setFrameTick((prev) => (prev + 1) % 1000)

      animFrameIdRef.current = requestAnimationFrame(loop)
    }

    animFrameIdRef.current = requestAnimationFrame(loop)

    return () => {
      running = false
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [tasks])

  // Handle speed changes
  const handleSpeedChange = (newSpeed: '1x' | '2x' | '3x') => {
    setSpeed(newSpeed)
    choreographerRef.current?.setSpeed(newSpeed)
    boidsEngineRef.current.setSpeedMultiplier(newSpeed === '1x' ? 1 : newSpeed === '2x' ? 1.6 : 2.4)
  }

  // Handle Play/Pause
  const handleTogglePlay = () => {
    if (isPlaying) {
      choreographerRef.current?.pause()
      setIsPlaying(false)
    } else {
      choreographerRef.current?.start()
      setIsPlaying(true)
    }
  }

  // Handle Replay
  const handleReplay = () => {
    choreographerRef.current?.reset()
    choreographerRef.current?.start()
    setProgress(0)
    setCompletedCount(0)
    setIsPlaying(true)
  }

  const agentsList = Array.from(agentsRef.current.values())

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden select-none">
      
      {/* Top Floating Controls Toolbar */}
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

      {/* SVG Canvas for Marquee Selections & Alignment Guidelines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {agentsList.map((agent) => {
          const m = agent.marqueeSelection
          if (!m) return null

          return (
            <g key={`marquee-${agent.id}`}>
              {/* Marquee Box */}
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

              {/* Top-Left Marquee Badge Tag */}
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

      {/* Render 4 Live Agent Cursors */}
      {agentsList.map((agent) => (
        <SwarmAgentCursor key={agent.id} agent={agent} />
      ))}
    </div>
  )
}

