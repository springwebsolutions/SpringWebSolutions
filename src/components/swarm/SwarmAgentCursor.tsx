import React from 'react'
import type { SpringCursorState } from '@/lib/swarm/types'
import { AGENT_PERSONAS } from '@/lib/swarm/types'

interface SwarmAgentCursorProps {
  cursor: SpringCursorState
}

export const SwarmAgentCursor: React.FC<SwarmAgentCursorProps> = ({ cursor }) => {
  const persona = AGENT_PERSONAS[cursor.id]

  return (
    <div
      className="absolute top-0 left-0 pointer-events-none z-[100] select-none"
      style={{
        transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0) rotate(${cursor.tiltAngle}deg)`,
        opacity: cursor.opacity,
        willChange: 'transform, opacity',
        transition: 'opacity 0.2s ease-out',
      }}
    >
      <div className="relative">
        
        {/* Cursor Glyph based on Active Design Tool Mode */}
        {cursor.cursorMode === 'crosshair' ? (
          /* Marquee Crosshair Pin */
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={persona.color} strokeWidth="2" className="filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              <circle cx="12" cy="12" r="4" fill={`${persona.color}40`} stroke={persona.color} strokeWidth="1.5" />
              <line x1="12" y1="2" x2="12" y2="7" />
              <line x1="12" y1="17" x2="12" y2="22" />
              <line x1="2" y1="12" x2="7" y2="12" />
              <line x1="17" y1="12" x2="22" y2="12" />
            </svg>
          </div>
        ) : cursor.cursorMode === 'caret' ? (
          /* Blinking Typewriter I-Beam Caret */
          <div className="relative -translate-x-[2px] -translate-y-3">
            <div
              className="w-1 h-7 rounded-full animate-pulse"
              style={{ backgroundColor: persona.color, boxShadow: `0 0 10px ${persona.color}` }}
            />
          </div>
        ) : cursor.cursorMode === 'clone' ? (
          /* Option-Drag Clone Pointer */
          <div className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <path d="M3 2L18.5 13.5L11.5 15.5L8 22L3 2Z" fill={persona.color} stroke="#ffffff" strokeWidth="1.5" />
            </svg>
            <div className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded bg-black/90 border border-white/40 text-[9px] font-bold text-white font-mono">
              ⌥+
            </div>
          </div>
        ) : (
          /* Clean Multiplayer Arrow Pointer */
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            <path d="M3 2L18.5 13.5L11.5 15.5L8 22L3 2Z" fill={persona.color} stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        )}

      </div>
    </div>
  )
}
