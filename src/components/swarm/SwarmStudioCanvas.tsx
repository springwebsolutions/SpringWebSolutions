import React, { useEffect, useRef, useState } from 'react'
import type { SpringCursorState, AgentPersonaId } from '@/lib/swarm/types'
import { SwarmSpringEngine } from '@/lib/swarm/swarmSpringEngine'
import { SwarmWaveChoreographer } from '@/lib/swarm/swarmWaveChoreographer'
import { SwarmAgentCursor } from './SwarmAgentCursor'
import { swarmAudio } from '@/lib/swarm/audioEngine'

interface SwarmStudioCanvasProps {
  speed?: '1x' | '2x' | '3x'
  soundEnabled?: boolean
  onComplete: () => void
  onDismiss: () => void
}

export const SwarmStudioCanvas: React.FC<SwarmStudioCanvasProps> = ({
  speed = '2x',
  soundEnabled = true,
  onComplete,
  onDismiss,
}) => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  })

  const cursorsRef = useRef<Map<AgentPersonaId, SpringCursorState>>(new Map())
  const [, setFrameTick] = useState<number>(0)

  const springEngineRef = useRef<SwarmSpringEngine>(new SwarmSpringEngine())
  const choreographerRef = useRef<SwarmWaveChoreographer | null>(null)
  const animFrameIdRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(performance.now())

  // Configure Audio
  useEffect(() => {
    swarmAudio.setEnabled(soundEnabled)
  }, [soundEnabled])

  // Handle Window Resizing
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Esc key & global click listener for instant skip
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

  // Lock body scroll during animation to prevent drift
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  // Initialize and run animation loop
  useEffect(() => {
    const width = window.innerWidth
    const height = window.innerHeight

    cursorsRef.current = springEngineRef.current.createInitialCursors(width, height)

    const choreographer = new SwarmWaveChoreographer(speed, onComplete)
    choreographerRef.current = choreographer

    let running = true

    const loop = (time: number) => {
      if (!running) return

      const deltaMs = Math.min(time - lastTimeRef.current, 45)
      lastTimeRef.current = time

      // Update Choreographer waves
      choreographer.update(cursorsRef.current, width, height, deltaMs)

      // Update Cursor Spring Physics
      const speedMult = speed === '1x' ? 1 : speed === '2x' ? 1.6 : 2.2
      springEngineRef.current.update(cursorsRef.current, speedMult, deltaMs / 16.66)

      setFrameTick((prev) => (prev + 1) % 1000)
      animFrameIdRef.current = requestAnimationFrame(loop)
    }

    animFrameIdRef.current = requestAnimationFrame(loop)

    return () => {
      running = false
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
    }
  }, [speed, onComplete])

  const ch = choreographerRef.current
  const boxes = ch?.activeBoxes || []
  const laserGuides = ch?.activeLaserGuides || []
  const distanceRulers = ch?.activeDistanceRulers || []
  const sweepY = ch?.sweepY ?? null
  const canvasOpacity = ch?.canvasOpacity ?? 1
  const cursorsList = Array.from(cursorsRef.current.values())

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-[9999] cursor-pointer select-none overflow-hidden"
      style={{
        opacity: canvasOpacity,
        transition: 'opacity 0.25s ease-out',
      }}
      title="Click or press Esc to skip animation"
    >
      {/* ── Pristine Studio Canvas Background ── */}
      <div className="absolute inset-0 bg-[#040711]">
        {/* Subtle Figma 24px Dot Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-45"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient Top Blueprint Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

        {/* Corner Studio Technical Markers */}
        <div className="absolute top-4 left-6 text-[10px] font-mono text-slate-500 font-semibold tracking-wider pointer-events-none">
          SYSTEM_CANVAS: ACTIVE // X: 0 Y: 0
        </div>
        <div className="absolute top-4 right-6 text-[10px] font-mono text-slate-500 font-semibold tracking-wider pointer-events-none">
          DIMENSIONS: {dimensions.width} × {dimensions.height}
        </div>
        <div className="absolute bottom-4 left-6 text-[10px] font-mono text-slate-600 pointer-events-none">
          ESC TO SKIP
        </div>
      </div>

      {/* ── Full-Screen SVG Layer for Frames, Guides & Rulers ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="laserGuideGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Laser Snap Guides */}
        {laserGuides.map((guide) => {
          if (guide.orientation === 'horizontal') {
            return (
              <g key={guide.id} opacity={guide.opacity}>
                <line
                  x1={guide.start}
                  y1={guide.pos}
                  x2={guide.end}
                  y2={guide.pos}
                  stroke={guide.color}
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  filter="url(#laserGuideGlow)"
                />
                {guide.label && (
                  <text
                    x={guide.start + 12}
                    y={guide.pos - 5}
                    fill={guide.color}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {guide.label}
                  </text>
                )}
              </g>
            )
          } else {
            return (
              <g key={guide.id} opacity={guide.opacity}>
                <line
                  x1={guide.pos}
                  y1={guide.start}
                  x2={guide.pos}
                  y2={guide.end}
                  stroke={guide.color}
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  filter="url(#laserGuideGlow)"
                />
                {guide.label && (
                  <text
                    x={guide.pos + 6}
                    y={guide.start + 24}
                    fill={guide.color}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {guide.label}
                  </text>
                )}
              </g>
            )
          }
        })}

        {/* Distance Gap Indicators (for ⌥-Cloned Cards) */}
        {distanceRulers.map((dist) => (
          <g key={dist.id}>
            <line x1={dist.x1} y1={dist.y1} x2={dist.x2} y2={dist.y2} stroke={dist.color} strokeWidth="1.5" />
            <line x1={dist.x1} y1={dist.y1 - 4} x2={dist.x1} y2={dist.y1 + 4} stroke={dist.color} strokeWidth="1.5" />
            <line x1={dist.x2} y1={dist.y2 - 4} x2={dist.x2} y2={dist.y2 + 4} stroke={dist.color} strokeWidth="1.5" />
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
              {dist.gapPx}px
            </text>
          </g>
        ))}

        {/* Wireframe Bounding Boxes with Corner Handles */}
        {boxes.map((box) => {
          const w = Math.max(2, box.w)
          const h = Math.max(2, box.h)
          const handle = 5

          return (
            <g key={box.id}>
              {/* Dashed selection rect */}
              <rect
                x={box.x}
                y={box.y}
                width={w}
                height={h}
                fill={`${box.color}15`}
                stroke={box.color}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                rx="6"
              />

              {/* Corner Figma Brackets */}
              <rect x={box.x - 2} y={box.y - 2} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1" />
              <rect x={box.x + w - 3} y={box.y - 2} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1" />
              <rect x={box.x - 2} y={box.y + h - 3} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1" />
              <rect x={box.x + w - 3} y={box.y + h - 3} width={handle} height={handle} fill="#ffffff" stroke={box.color} strokeWidth="1" />

              {/* Dimension / Label Badge */}
              <rect
                x={box.x}
                y={Math.max(0, box.y - 18)}
                width={box.label.length * 6.5 + 16}
                height="16"
                fill={box.color}
                rx="4"
              />
              <text
                x={box.x + 6}
                y={Math.max(11, box.y - 6)}
                fill="#ffffff"
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                {box.label}
              </text>
            </g>
          )
        })}

        {/* Luminous Synthesis Wave Sweep (Wave 4) */}
        {sweepY !== null && (
          <g>
            <line
              x1="0"
              y1={sweepY}
              x2={dimensions.width}
              y2={sweepY}
              stroke="#38bdf8"
              strokeWidth="3"
              filter="url(#laserGuideGlow)"
            />
            <rect
              x="0"
              y={Math.max(0, sweepY - 30)}
              width={dimensions.width}
              height="30"
              fill="url(#sweepGrad)"
              opacity="0.4"
            />
            <defs>
              <linearGradient id="sweepGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </g>
        )}
      </svg>

      {/* ── Multi-Player Cursors ── */}
      {cursorsList.map((cursor) => (
        <SwarmAgentCursor key={cursor.id} cursor={cursor} />
      ))}
    </div>
  )
}
