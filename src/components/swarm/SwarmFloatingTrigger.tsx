import React, { useState, useEffect } from 'react'
import { Zap, Sparkles } from 'lucide-react'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { DOMBlueprintScanner, type ScannedBlueprint } from '@/lib/swarm/domBlueprintScanner'
import { SwarmCanvasOverlay } from './SwarmCanvasOverlay'
import type { SwarmAdminConfig } from '@/lib/swarm/types'

export const SwarmFloatingTrigger: React.FC = () => {
  const { siteConfig } = usePageBuilderStore()
  const swarmConfig: SwarmAdminConfig = siteConfig?.swarm_config || {
    is_enabled: true,
    display_mode: 'both',
    show_floating_badge: true,
    hotkey_enabled: true,
    audio_synthesizer_enabled: true,
    default_muted: true,
    default_speed: '2x',
    enabled_routes: ['/'],
  }

  const [isActive, setIsActive] = useState<boolean>(false)
  const [scannedBlueprint, setScannedBlueprint] = useState<ScannedBlueprint | null>(null)

  // Hotkey listener (Alt + S)
  useEffect(() => {
    if (!swarmConfig.is_enabled || !swarmConfig.hotkey_enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        handleTriggerSwarm()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [swarmConfig])

  // Don't render if disabled by Admin Suite or display_mode is hero_only
  if (
    !swarmConfig.is_enabled ||
    swarmConfig.display_mode === 'hero_only' ||
    swarmConfig.display_mode === 'disabled'
  ) {
    return null
  }

  const handleTriggerSwarm = () => {
    if (isActive) return

    // Scan target: prefer hero or main container, fallback to document.body
    const target =
      document.querySelector<HTMLElement>('#hero-section') ||
      document.querySelector<HTMLElement>('main') ||
      document.body

    const blueprint = DOMBlueprintScanner.scanContainer(target)
    if (blueprint.tasks.length === 0) return

    DOMBlueprintScanner.applyInitialBuildState(blueprint)
    setScannedBlueprint(blueprint)
    setIsActive(true)
  }

  const handleDismiss = () => {
    if (scannedBlueprint) {
      DOMBlueprintScanner.restoreOriginalStyles(scannedBlueprint)
    }
    setIsActive(false)
    setScannedBlueprint(null)
  }

  return (
    <>
      {/* Floating Pill Badge (Bottom Right) */}
      {swarmConfig.show_floating_badge && !isActive && (
        <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
          <button
            onClick={handleTriggerSwarm}
            className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#080d1a]/90 hover:bg-[#0d1629] border border-cyan-500/30 hover:border-cyan-400 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            title="Trigger Autonomous Engineering Swarm (Alt + S)"
          >
            {/* Ambient cyan glow behind badge */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md group-hover:bg-cyan-500/30 transition-opacity" />

            <div className="relative flex items-center gap-2">
              <span className="p-1 rounded-full bg-cyan-500/20 text-cyan-400">
                <Zap size={13} className="animate-pulse" />
              </span>
              <span className="text-xs font-bold font-display tracking-wide text-white">
                Swarm Build
              </span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-400 border border-white/10">
                Alt+S
              </kbd>
            </div>
          </button>
        </div>
      )}

      {/* Full-Page Canvas Overlay */}
      {isActive && scannedBlueprint && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <SwarmCanvasOverlay
            tasks={scannedBlueprint.tasks}
            defaultSpeed={swarmConfig.default_speed}
            defaultMuted={swarmConfig.default_muted}
            onComplete={() => {}}
            onDismiss={handleDismiss}
          />
        </div>
      )}
    </>
  )
}
