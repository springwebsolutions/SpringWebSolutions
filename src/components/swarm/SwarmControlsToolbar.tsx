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
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-2xl w-[92vw] pointer-events-auto">
      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#060a14]/90 backdrop-blur-xl border border-white/15 shadow-2xl text-white flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
        
        {/* Left: Swarm status and progress badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Zap size={16} className="animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xs sm:text-sm text-white truncate">
                Autonomous Swarm
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shrink-0">
                {isComplete ? '100% Deployed' : `${progress}% Built`}
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-28 sm:w-36 h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-300"
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
              title="Re-run Assembly"
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
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={isMuted ? 'Unmute procedural audio' : 'Mute procedural audio'}
          >
            {!isMuted ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>

        {/* Right: Go Live / Close Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onDismiss}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
              isComplete
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110'
                : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
            }`}
          >
            {isComplete ? <CheckCircle2 size={14} /> : <X size={14} />}
            <span>{isComplete ? 'Go Live' : 'Dismiss'}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
