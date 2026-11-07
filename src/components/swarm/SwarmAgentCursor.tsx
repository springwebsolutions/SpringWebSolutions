import React from 'react'
import type { SwarmAgentState } from '@/lib/swarm/types'
import { AGENT_PERSONAS } from '@/lib/swarm/types'

interface SwarmAgentCursorProps {
  agent: SwarmAgentState
}

export const SwarmAgentCursor: React.FC<SwarmAgentCursorProps> = ({ agent }) => {
  const persona = AGENT_PERSONAS[agent.id]

  return (
    <div
      className="absolute top-0 left-0 pointer-events-none z-50 select-none"
      style={{
        transform: `translate3d(${agent.x}px, ${agent.y}px, 0)`,
        willChange: 'transform',
      }}
    >
      <div className="relative">
        
        {/* Cursor Glyph based on Active Design Tool Mode */}
        {agent.cursorMode === 'crosshair' ? (
          /* Marquee Crosshairs */
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={persona.color} strokeWidth="2">
              <circle cx="12" cy="12" r="4" fill={`${persona.color}33`} stroke={persona.color} strokeWidth="1.5" />
              <line x1="12" y1="2" x2="12" y2="7" />
              <line x1="12" y1="17" x2="12" y2="22" />
              <line x1="2" y1="12" x2="7" y2="12" />
              <line x1="17" y1="12" x2="22" y2="12" />
            </svg>
          </div>
        ) : agent.cursorMode === 'caret' ? (
          /* Blinking Typewriter Caret */
          <div className="relative -translate-x-[2px] -translate-y-3">
            <div
              className="w-0.5 h-6 rounded-full animate-pulse shadow-md"
              style={{ backgroundColor: persona.color, boxShadow: `0 0 8px ${persona.color}` }}
            />
          </div>
        ) : agent.cursorMode === 'clone' ? (
          /* Option-Drag Clone Pointer */
          <div className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              <path d="M3 2L18.5 13.5L11.5 15.5L8 22L3 2Z" fill={persona.color} stroke="#ffffff" strokeWidth="1.5" />
            </svg>
            <div className="absolute -top-1 -right-2 px-1 py-0.2 rounded bg-black/80 border border-white/30 text-[9px] font-bold text-white font-mono">
              +
            </div>
          </div>
        ) : (
          /* Standard Multi-Player Arrow Pointer */
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            <path d="M3 2L18.5 13.5L11.5 15.5L8 22L3 2Z" fill={persona.color} stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        )}

        {/* Floating Persona Badge Pill firmly attached next to tip */}
        <div
          className="absolute left-4 top-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-xl backdrop-blur-md border border-white/25 whitespace-nowrap"
          style={{
            backgroundColor: `${persona.color}f0`,
            boxShadow: `0 4px 14px ${persona.accentGlow}`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>{persona.badgeLabel}</span>

          {/* Real-Time Action Sub-chip */}
          {agent.isWorking && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono tracking-tight font-medium text-white/95">
              {agent.actionText}
            </span>
          )}
        </div>

        {/* Floating Typewriter Preview Bubble */}
        {agent.typewriterText && (
          <div
            className="absolute left-4 top-8 px-2 py-1 rounded-md bg-[#04060e]/95 border border-white/25 text-white font-mono text-[10px] shadow-2xl max-w-[220px] truncate"
            style={{ borderColor: persona.color }}
          >
            <span className="text-emerald-400 font-bold">&gt;&nbsp;</span>
            <span>{agent.typewriterText}</span>
            <span className="inline-block w-1.5 h-3 bg-white ml-0.5 animate-pulse align-middle" />
          </div>
        )}

      </div>
    </div>
  )
}
