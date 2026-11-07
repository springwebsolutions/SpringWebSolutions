import React, { useState, useEffect, useCallback, useRef } from 'react'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { SwarmStudioCanvas } from './SwarmStudioCanvas'
import type { SwarmAdminConfig } from '@/lib/swarm/types'
import { DEFAULT_SWARM_CONFIG } from '@/lib/swarm/types'

export const SiteSwarmController: React.FC = () => {
  const { siteConfig } = usePageBuilderStore()

  // Read admin config with local cache fallback for instant reactivity
  const getSwarmConfig = (): SwarmAdminConfig => {
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('springweb_swarm_config')
        if (cached) return JSON.parse(cached)
      }
    } catch (e) {}
    return siteConfig?.swarm_config || DEFAULT_SWARM_CONFIG
  }

  const swarmConfig = getSwarmConfig()
  const [isActive, setIsActive] = useState<boolean>(false)
  const hasTriggeredRef = useRef<boolean>(false)

  // Complete and dismiss animation
  const dismissAnimation = useCallback(() => {
    setIsActive(false)
    try {
      sessionStorage.setItem('sw_swarm_rebuilt', '1')
    } catch (e) {}
  }, [])

  // Auto-trigger on initial visitor landing
  useEffect(() => {
    if (!swarmConfig.is_enabled || hasTriggeredRef.current) return
    hasTriggeredRef.current = true

    // Check crawler bots and reduced-motion
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse/i.test(navigator.userAgent)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isBot || prefersReducedMotion) return

    // Check trigger frequency governance
    if (swarmConfig.trigger_frequency === 'manual_only') return

    if (swarmConfig.trigger_frequency === 'first_visit_session') {
      try {
        const alreadySeen = sessionStorage.getItem('sw_swarm_rebuilt')
        if (alreadySeen) return
      } catch (e) {}
    }

    // Wait for real page content to mount before starting animation
    const checkDomReady = () => {
      const heroOrMain = document.querySelector('#hero-section') || document.querySelector('main')
      if (heroOrMain) {
        setIsActive(true)
      } else {
        setTimeout(checkDomReady, 100)
      }
    }

    // Start check after brief stabilization
    const timer = setTimeout(checkDomReady, 150)
    return () => clearTimeout(timer)
  }, [swarmConfig])

  if (!swarmConfig.is_enabled || !isActive) {
    return null
  }

  return (
    <SwarmStudioCanvas
      speed={swarmConfig.default_speed || '2x'}
      soundEnabled={swarmConfig.sound_enabled ?? true}
      onComplete={dismissAnimation}
      onDismiss={dismissAnimation}
    />
  )
}
