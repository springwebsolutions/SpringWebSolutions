import React from 'react'
import type { AgentBoidState } from '@/lib/swarm/types'
import { AGENT_PERSONAS } from '@/lib/swarm/types'

interface SwarmAgentCursorProps {
  agent: AgentBoidState
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
        {/* SVG Cursor Pointer with tip precisely at (0, 0) */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
        >
          <path
            d="M3 2L18.5 13.5L11.5 15.5L8 22L3 2Z"
            fill={persona.color}
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>

        {/* Floating Persona Badge Pill cleanly anchored to tip */}
        <div
          className="absolute left-4 top-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-xl backdrop-blur-md border border-white/25 whitespace-nowrap"
          style={{
            backgroundColor: `${persona.color}f0`,
            boxShadow: `0 4px 14px ${persona.accentGlow}`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>{persona.badgeLabel}</span>

          {/* Live Action Sub-badge */}
          {agent.isWorking && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono tracking-tight font-medium text-white/95">
              {agent.actionText}
            </span>
          )}
        </div>

        {/* Typewriter Floating Text Box */}
        {agent.typewriterText && (
          <div
            className="absolute left-4 top-9 px-2 py-1 rounded-md bg-[#04060e]/95 border border-white/20 text-white font-mono text-[10px] shadow-lg max-w-[200px] truncate"
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

