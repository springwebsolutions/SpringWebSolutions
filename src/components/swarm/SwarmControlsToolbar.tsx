import React from 'react'
import {
  Zap, Volume2, VolumeX, Play, Pause,
  RotateCcw, CheckCircle2, X
} from 'lucide-react'

interface SwarmControlsToolbarProps {
  progress: number
  activeCount: number
  totalCount: number
  isPlaying: boolean
  isMuted: boolean
  speed: '1x' | '2x' | '3x'
  onTogglePlay: () => void
  onToggleMute: () => void
  onChangeSpeed: (speed: '1x' | '2x' | '3x') => void
  onReplay: () => void
  onDismiss: () => void
}

export const SwarmControlsToolbar: React.FC<SwarmControlsToolbarProps> = ({
  progress,
  activeCount,
  totalCount,
  isPlaying,
  isMuted,
  speed,
  onTogglePlay,
  onToggleMute,
  onChangeSpeed,
  onReplay,
  onDismiss,
}) => {
  const isComplete = progress >= 100

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] max-w-2xl w-[92vw] pointer-events-auto select-none animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="p-2.5 sm:p-3 rounded-2xl bg-[#060a14]/95 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/80 text-white flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap ring-1 ring-white/10">
        
        {/* Left: Swarm status and progress badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-xl bg-gradient-to-br from-emerald-500/25 to-cyan-500/25 border border-emerald-500/40 text-emerald-400 shrink-0 shadow-sm shadow-emerald-500/20">
            <Zap size={16} className="animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xs sm:text-sm text-white truncate">
                Swarm Rebuild
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shrink-0">
                {isComplete ? 'Page Live' : `${progress}% Built`}
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-24 sm:w-36 h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Play/Pause, Speed and Sound */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Play/Pause Button */}
          {!isComplete ? (
            <button
              onClick={onTogglePlay}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause Swarm' : 'Resume Swarm'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
          ) : (
            <button
              onClick={onReplay}
              className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
              title="Re-run Swarm Build"
            >
              <RotateCcw size={14} />
            </button>
          )}

          {/* Speed Selector */}
          <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono">
            {(['1x', '2x', '3x'] as const).map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  speed === s
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              !isMuted
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-sm shadow-amber-500/20'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={isMuted ? 'Unmute procedural sound' : 'Mute procedural sound'}
          >
            {!isMuted ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>

        {/* Right: Go Live Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onDismiss}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
              isComplete
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110'
                : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
            }`}
          >
            {isComplete ? <CheckCircle2 size={14} /> : <X size={14} />}
            <span>{isComplete ? 'Live' : 'Go Live (Esc)'}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
