import React, { useState, useRef } from 'react'
import {
  Zap, Play, RotateCcw, Activity, ShieldCheck,
  Server, Cpu, Database, Sparkles, Layers
} from 'lucide-react'
import { DOMBlueprintScanner, type ScannedBlueprint } from '@/lib/swarm/domBlueprintScanner'
import { SwarmCanvasOverlay } from './SwarmCanvasOverlay'
import { AGENT_PERSONAS } from '@/lib/swarm/types'

export const SwarmHeroShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isSwarmActive, setIsSwarmActive] = useState<boolean>(false)
  const [scannedBlueprint, setScannedBlueprint] = useState<ScannedBlueprint | null>(null)
  const [assembledCount, setAssembledCount] = useState<number>(0)

  const handleStartSwarm = () => {
    if (!containerRef.current) return

    const blueprint = DOMBlueprintScanner.scanContainer(containerRef.current)
    if (blueprint.tasks.length === 0) return

    DOMBlueprintScanner.applyInitialBuildState(blueprint)
    setScannedBlueprint(blueprint)
    setIsSwarmActive(true)
  }

  const handleDismiss = () => {
    if (scannedBlueprint) {
      DOMBlueprintScanner.restoreOriginalStyles(scannedBlueprint)
    }
    setIsSwarmActive(false)
    setScannedBlueprint(null)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-8">
      {/* Outer ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none" />

      {/* Main Sandbox Frame */}
      <div className="relative rounded-3xl bg-[#060a14]/90 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden">
        
        {/* Frame Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-xs font-mono text-slate-400">
              springweb-engine-orchestrator.tsx
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isSwarmActive ? (
              <button
                onClick={handleStartSwarm}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 text-xs font-bold font-display shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Zap size={13} className="text-slate-950" />
                <span>Watch Swarm Assemble Architecture</span>
              </button>
            ) : (
              <button
                onClick={handleStartSwarm}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Re-Assemble</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Multi-Cursor Overlay (renders only when swarm is active) */}
        {isSwarmActive && scannedBlueprint && (
          <SwarmCanvasOverlay
            tasks={scannedBlueprint.tasks}
            containerRef={containerRef}
            defaultSpeed="2x"
            defaultMuted={true}
            onComplete={() => {
              setAssembledCount(prev => prev + 1)
            }}
            onDismiss={handleDismiss}
          />
        )}

        {/* Interactive Architecture Workspace (Target for DOM Scanner) */}
        <div ref={containerRef} className="p-6 sm:p-8 space-y-6">
          
          {/* Top Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Card 1: Frontend Performance */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/[0.08] to-transparent border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Activity size={14} />
                  <span>Frontend Core</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  99.8% Speed
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                12.4ms LCP
              </div>
              <p className="text-[11px] text-slate-400">
                Next-gen hydration &amp; zero layout shift delivery.
              </p>
            </div>

            {/* Card 2: TypeScript Backend */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/[0.08] to-transparent border border-sky-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                  <Cpu size={14} />
                  <span>TypeScript Engine</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                  TypeSafe
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                0 Type Errors
              </div>
              <p className="text-[11px] text-slate-400">
                Strict compile-time schemas &amp; API validation.
              </p>
            </div>

            {/* Card 3: Realtime Database */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/[0.08] to-transparent border border-purple-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                  <Database size={14} />
                  <span>PostgreSQL / Redis</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                  ACID Live
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                100k Req/min
              </div>
              <p className="text-[11px] text-slate-400">
                Partitioned high-concurrency schema indexing.
              </p>
            </div>

          </div>

          {/* Lower Section: Action Pipeline & Real-Time Log */}
          <div className="p-5 rounded-2xl bg-[#04060f] border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <Server size={14} className="text-amber-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Deployment Pipeline
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                <ShieldCheck size={13} />
                <span>Zero-Downtime Rolling Update</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-white">
                  Autonomous Multi-Agent Architecture
                </div>
                <div className="text-[11px] text-slate-400">
                  Four specialized engineering personas synchronously architecting, typing, and validating UI components.
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="/contact"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all text-center"
                >
                  Schedule Technical Architecture Call
                </a>
              </div>
            </div>
          </div>

          {/* Active Persona Roster Footer */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-1 text-xs text-slate-400 border-t border-white/5">
            <span className="font-semibold text-slate-300">
              Autonomous Swarm Roster:
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              {Object.values(AGENT_PERSONAS).map((p) => (
                <div key={p.id} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="text-[11px] font-medium text-white">{p.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({p.role})</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
