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
      className="absolute top-0 left-0 pointer-events-none z-50 transition-transform duration-75 ease-out select-none"
      style={{
        transform: `translate3d(${agent.x}px, ${agent.y}px, 0)`,
        willChange: 'transform',
      }}
    >
      {/* SVG Cursor Pointer */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] -translate-x-[2px] -translate-y-[2px]"
      >
        <path
          d="M4.5 3L19.5 12L12 14.5L8.5 21L4.5 3Z"
          fill={persona.color}
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Floating Persona Badge Pill */}
      <div
        className="ml-4 -mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-xl backdrop-blur-md border border-white/20 whitespace-nowrap animate-fadeIn"
        style={{
          backgroundColor: `${persona.color}dd`,
          boxShadow: `0 4px 14px ${persona.accentGlow}`,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span>{persona.badgeLabel}</span>

        {/* Live Action Sub-badge */}
        {agent.isWorking && (
          <span className="ml-1 px-1.5 py-0.2 rounded bg-black/30 text-[9px] font-mono tracking-tight font-medium text-white/90">
            {agent.actionText}
          </span>
        )}
      </div>

      {/* Typewriter Floating Text Box */}
      {agent.typewriterText && (
        <div
          className="ml-5 mt-1 px-2 py-1 rounded-md bg-[#04060e]/90 border border-white/20 text-white font-mono text-[10px] shadow-lg max-w-[200px] truncate"
          style={{ borderColor: persona.color }}
        >
          <span className="text-emerald-400 font-bold">&gt;&nbsp;</span>
          <span>{agent.typewriterText}</span>
          <span className="inline-block w-1.5 h-3 bg-white ml-0.5 animate-pulse align-middle" />
        </div>
      )}
    </div>
  )
}

