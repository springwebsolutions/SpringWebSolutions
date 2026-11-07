import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Zap } from 'lucide-react'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { SiteBlueprintEngine, type LiveSiteBlueprint } from '@/lib/swarm/siteBlueprintEngine'
import { SwarmCanvasOverlay } from './SwarmCanvasOverlay'
import type { SwarmAdminConfig } from '@/lib/swarm/types'

export const SiteSwarmController: React.FC = () => {
  const { siteConfig } = usePageBuilderStore()
  const swarmConfig: SwarmAdminConfig = siteConfig?.swarm_config || {
    is_enabled: true,
    trigger_frequency: 'first_visit_session',
    show_floating_badge: true,
    hotkey_enabled: true,
    sound_enabled: true,
    default_muted: true,
    default_speed: '2x',
  }

  const [isActive, setIsActive] = useState<boolean>(false)
  const [blueprint, setBlueprint] = useState<LiveSiteBlueprint | null>(null)
  const hasTriggeredOnMount = useRef<boolean>(false)

  // Trigger Swarm Rebuild on Page
  const triggerRebuild = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    // Don't run for crawlers or reduced motion
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse/i.test(navigator.userAgent)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isBot || prefersReducedMotion) return

    // Snapshot live DOM
    const bp = SiteBlueprintEngine.snapshotPage()
    if (bp.tasks.length === 0) return

    // Zero out elements cleanly
    SiteBlueprintEngine.maskPage(bp)
    setBlueprint(bp)
    setIsActive(true)

    try {
      sessionStorage.setItem('sw_swarm_rebuilt', '1')
    } catch (e) {}
  }, [])

  // Dismiss Swarm Rebuild and restore live site
  const dismissRebuild = useCallback(() => {
    if (blueprint) {
      SiteBlueprintEngine.restorePage(blueprint)
    }
    setIsActive(false)
    setBlueprint(null)
  }, [blueprint])

  // Auto-trigger on initial visitor landing based on trigger_frequency
  useEffect(() => {
    if (!swarmConfig.is_enabled || hasTriggeredOnMount.current) return
    hasTriggeredOnMount.current = true

    if (swarmConfig.trigger_frequency === 'manual_only') return

    if (swarmConfig.trigger_frequency === 'first_visit_session') {
      try {
        const alreadySeen = sessionStorage.getItem('sw_swarm_rebuilt')
        if (alreadySeen) return
      } catch (e) {}
    }

    // Small delay for initial paint to stabilize before snapshotting
    const timer = setTimeout(() => {
      triggerRebuild()
    }, 350)

    return () => clearTimeout(timer)
  }, [swarmConfig, triggerRebuild])

  // Keyboard Hotkey listener (Alt + S)
  useEffect(() => {
    if (!swarmConfig.is_enabled || !swarmConfig.hotkey_enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        if (isActive) {
          dismissRebuild()
        } else {
          triggerRebuild()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [swarmConfig, isActive, triggerRebuild, dismissRebuild])

  if (!swarmConfig.is_enabled) return null

  return (
    <>
      {/* Floating Replay Trigger Pill (Bottom Corner) */}
      {swarmConfig.show_floating_badge && !isActive && (
        <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
          <button
            onClick={triggerRebuild}
            className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#080d1a]/95 hover:bg-[#0d1629] border border-cyan-500/30 hover:border-cyan-400 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            title="Trigger Full-Page Swarm Rebuild (Alt + S)"
          >
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md group-hover:bg-cyan-500/35 transition-opacity" />

            <div className="relative flex items-center gap-2">
              <span className="p-1 rounded-full bg-cyan-500/20 text-cyan-400">
                <Zap size={13} className="animate-pulse" />
              </span>
              <span className="text-xs font-bold font-display tracking-wide text-white">
                Swarm Rebuild
              </span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-400 border border-white/10">
                Alt+S
              </kbd>
            </div>
          </button>
        </div>
      )}

      {/* Full-Page Swarm Canvas Layer */}
      {isActive && blueprint && (
        <SwarmCanvasOverlay
          tasks={blueprint.tasks}
          defaultSpeed={swarmConfig.default_speed}
          defaultMuted={swarmConfig.default_muted}
          onComplete={dismissRebuild}
          onDismiss={dismissRebuild}
        />
      )}
    </>
  )
}
