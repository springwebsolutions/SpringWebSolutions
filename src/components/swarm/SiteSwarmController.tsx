import React, { useState, useEffect, useCallback, useRef } from 'react'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { SwarmStudioCanvas, type RealDomTargets } from './SwarmStudioCanvas'
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
  const targetsRef = useRef<RealDomTargets | null>(null)
  const originalStylesRef = useRef<Map<HTMLElement, { opacity: string; transform: string; transition: string }>>(new Map())
  const hasTriggeredRef = useRef<boolean>(false)

  // Restore real DOM elements
  const restoreDom = useCallback(() => {
    originalStylesRef.current.forEach((st, el) => {
      el.style.opacity = st.opacity
      el.style.transform = st.transform
      el.style.transition = st.transition
    })
  }, [])

  // Complete and dismiss animation
  const dismissAnimation = useCallback(() => {
    restoreDom()
    setIsActive(false)
    try {
      sessionStorage.setItem('sw_swarm_rebuilt', '1')
    } catch (e) {}
  }, [restoreDom])

  // Auto-trigger on visitor landing
  useEffect(() => {
    if (!swarmConfig.is_enabled || hasTriggeredRef.current) return
    hasTriggeredRef.current = true

    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse/i.test(navigator.userAgent)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isBot || prefersReducedMotion) return

    if (swarmConfig.trigger_frequency === 'manual_only') return

    if (swarmConfig.trigger_frequency === 'first_visit_session') {
      try {
        const alreadySeen = sessionStorage.getItem('sw_swarm_rebuilt')
        if (alreadySeen) return
      } catch (e) {}
    }

    // Wait for real page content to mount
    let attempts = 0
    const checkDomReady = () => {
      attempts++
      const header = (document.querySelector('nav') || document.querySelector('header')) as HTMLElement | null
      const badge = document.querySelector('.hero-badge-enter') as HTMLElement | null
      const h1 = (document.querySelector('.hero-h1-enter') || document.querySelector('h1')) as HTMLElement | null
      const sub = document.querySelector('.hero-sub-enter') as HTMLElement | null
      const p = document.querySelector('.hero-p-enter') as HTMLElement | null
      const cta = document.querySelector('.hero-cta-enter') as HTMLElement | null
      const terminal = document.querySelector('.hero-terminal-box') as HTMLElement | null
      const cards = Array.from(document.querySelectorAll<HTMLElement>('.hero-terminal-box .grid > div'))
      const services = (document.querySelector('#services') || document.querySelector('section#services')) as HTMLElement | null

      if (h1 && terminal) {
        const targets: RealDomTargets = {
          header,
          badge,
          h1,
          sub,
          p,
          cta,
          terminal,
          cards,
          services,
        }

        // Cache original styles & apply initial zero-opacity
        const elsToMask: Array<HTMLElement | null> = [
          header, badge, h1, sub, p, cta, terminal, ...cards, services
        ]

        elsToMask.forEach((el) => {
          if (el) {
            originalStylesRef.current.set(el, {
              opacity: el.style.opacity,
              transform: el.style.transform,
              transition: el.style.transition,
            })
            el.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            el.style.opacity = '0'
            el.style.transform = 'scale(0.97)'
          }
        })

        targetsRef.current = targets
        setIsActive(true)
      } else if (attempts < 20) {
        setTimeout(checkDomReady, 100)
      }
    }

    const timer = setTimeout(checkDomReady, 150)
    return () => clearTimeout(timer)
  }, [swarmConfig])

  if (!swarmConfig.is_enabled || !isActive || !targetsRef.current) {
    return null
  }

  return (
    <SwarmStudioCanvas
      targets={targetsRef.current}
      speed={swarmConfig.default_speed || '2x'}
      soundEnabled={swarmConfig.sound_enabled ?? true}
      onComplete={dismissAnimation}
      onDismiss={dismissAnimation}
    />
  )
}
