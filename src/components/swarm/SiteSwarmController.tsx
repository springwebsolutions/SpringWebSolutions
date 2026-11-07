import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { SwarmStudioCanvas } from './SwarmStudioCanvas'
import type { SwarmAdminConfig, RealDomTargets } from '@/lib/swarm/types'
import { DEFAULT_SWARM_CONFIG } from '@/lib/swarm/types'

export const SiteSwarmController: React.FC = () => {
  const location = useLocation()
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
  const originalStylesRef = useRef<Map<HTMLElement, { opacity: string; transform: string; transition: string; clipPath: string }>>(new Map())
  const hasActivatedRouteRef = useRef<string | null>(null)

  // Restore real DOM elements to full visibility, unclipped typography and native interactivity
  const restoreDom = useCallback(() => {
    originalStylesRef.current.forEach((st, el) => {
      el.style.opacity = st.opacity
      el.style.transform = st.transform
      el.style.transition = st.transition
      el.style.clipPath = st.clipPath || ''
    })
    originalStylesRef.current.clear()
  }, [])

  // Complete and dismiss animation cleanly
  const dismissAnimation = useCallback(() => {
    restoreDom()
    setIsActive(false)
    try {
      if (swarmConfig.trigger_frequency === 'first_visit_session') {
        sessionStorage.setItem('sw_swarm_rebuilt', '1')
      }
    } catch (e) {}
  }, [restoreDom, swarmConfig.trigger_frequency])

  // Route-aware and DOM-ready autonomous trigger
  useEffect(() => {
    // Only run on public homepage/landing
    const isPublicPage = location.pathname === '/' || location.pathname === ''
    if (!isPublicPage) return

    if (!swarmConfig.is_enabled) return
    if (hasActivatedRouteRef.current === location.key) return

    // Check crawlers and reduced motion
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse/i.test(navigator.userAgent)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isBot || prefersReducedMotion) return

    // Trigger frequency governance
    if (swarmConfig.trigger_frequency === 'manual_only') return

    if (swarmConfig.trigger_frequency === 'first_visit_session') {
      try {
        const alreadySeen = sessionStorage.getItem('sw_swarm_rebuilt')
        if (alreadySeen === '1') return
      } catch (e) {}
    }

    let observer: MutationObserver | null = null
    let pollInterval: any = null
    let timeoutTimer: any = null
    let isCancelled = false

    const tryActivate = () => {
      if (isCancelled || isActive || hasActivatedRouteRef.current === location.key) return

      const header = (document.querySelector('nav') || document.querySelector('header')) as HTMLElement | null
      const navLogo = (document.querySelector('nav a[aria-label*="Homepage"]') || document.querySelector('nav a[href="/"]')) as HTMLElement | null
      const navLinks = Array.from(document.querySelectorAll<HTMLElement>('nav .hidden.md\\:flex a'))
      const navActions = (document.querySelector('nav .hidden.md\\:flex.items-center.space-x-3') || document.querySelector('nav a[href="/games"]')) as HTMLElement | null
      const techBadges = Array.from(document.querySelectorAll<HTMLElement>('.hero-banner [class*="animate-float-gentle"]'))
      const badge = document.querySelector('.hero-badge-enter') as HTMLElement | null
      const h1 = (document.querySelector('.hero-h1-enter') || document.querySelector('h1')) as HTMLElement | null
      const sub = document.querySelector('.hero-sub-enter') as HTMLElement | null
      const p = document.querySelector('.hero-p-enter') as HTMLElement | null
      const ctaPrimary = (document.querySelector('.hero-cta-enter a:first-child') || document.querySelector('.hero-cta-enter .btn-primary')) as HTMLElement | null
      const ctaSecondary = document.querySelector('.hero-cta-enter a:last-child') as HTMLElement | null
      const terminal = document.querySelector('.hero-terminal-box') as HTMLElement | null
      const terminalHeader = (document.querySelector('.hero-terminal-box > div:first-child') || document.querySelector('.hero-terminal-box .flex')) as HTMLElement | null
      const cards = Array.from(document.querySelectorAll<HTMLElement>('.hero-terminal-box .grid > div'))
      const aboutSection = (document.querySelector('#about') || document.querySelector('section#about')) as HTMLElement | null
      const aboutPillars = Array.from(document.querySelectorAll<HTMLElement>('#about .grid > div'))
      const services = (document.querySelector('#services') || document.querySelector('section#services')) as HTMLElement | null

      // Ready when primary headline and header/terminal exist
      if (h1 && (header || terminal)) {
        if (observer) observer.disconnect()
        if (pollInterval) clearInterval(pollInterval)
        if (timeoutTimer) clearTimeout(timeoutTimer)

        hasActivatedRouteRef.current = location.key

        const targets: RealDomTargets = {
          header,
          navLogo,
          navLinks,
          navActions,
          techBadges,
          badge,
          h1,
          sub,
          p,
          ctaPrimary,
          ctaSecondary,
          terminal,
          terminalHeader,
          cards,
          aboutSection,
          aboutPillars,
          services,
        }

        // Cache original styles & apply initial blueprint mask
        const elsToMask: Array<HTMLElement | null> = [
          header,
          navLogo,
          ...navLinks,
          navActions,
          ...techBadges,
          badge,
          h1,
          sub,
          p,
          ctaPrimary,
          ctaSecondary,
          terminal,
          terminalHeader,
          ...cards,
          aboutSection,
          ...aboutPillars,
          services,
        ]

        elsToMask.forEach((el) => {
          if (el) {
            originalStylesRef.current.set(el, {
              opacity: el.style.opacity,
              transform: el.style.transform,
              transition: el.style.transition,
              clipPath: el.style.clipPath,
            })
            el.style.transition = 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            el.style.opacity = '0'
          }
        })

        // Prepare elements for progressive builder forming
        if (h1) {
          h1.style.clipPath = 'inset(0 100% 0 0)'
        }
        if (sub) {
          sub.style.clipPath = 'inset(0 100% 0 0)'
        }
        if (badge) {
          badge.style.transform = 'scale(0.92)'
        }
        if (ctaPrimary) {
          ctaPrimary.style.transform = 'scale(0.85)'
        }
        if (ctaSecondary) {
          ctaSecondary.style.transform = 'scale(0.85)'
        }
        techBadges.forEach((tb) => {
          tb.style.transform = 'scale(0.7)'
        })
        cards.forEach((c) => {
          c.style.transform = 'scale(0.92)'
        })
        aboutPillars.forEach((ap) => {
          ap.style.transform = 'scale(0.95)'
        })

        targetsRef.current = targets
        setIsActive(true)
      }
    }

    // Check immediately
    tryActivate()

    // MutationObserver to catch dynamic hydration immediately as elements appear
    observer = new MutationObserver(() => {
      tryActivate()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    // Polling fallback (every 60ms for up to 8s)
    pollInterval = setInterval(tryActivate, 60)
    timeoutTimer = setTimeout(() => {
      if (observer) observer.disconnect()
      if (pollInterval) clearInterval(pollInterval)
    }, 8000)

    return () => {
      isCancelled = true
      if (observer) observer.disconnect()
      if (pollInterval) clearInterval(pollInterval)
      if (timeoutTimer) clearTimeout(timeoutTimer)
    }
  }, [location.pathname, location.key, swarmConfig.is_enabled, swarmConfig.trigger_frequency, isActive])

  if (!swarmConfig.is_enabled || !isActive || !targetsRef.current) {
    return null
  }

  return (
    <SwarmStudioCanvas
      targets={targetsRef.current}
      speed={swarmConfig.default_speed}
      soundEnabled={swarmConfig.sound_enabled}
      onComplete={dismissAnimation}
      onDismiss={dismissAnimation}
    />
  )
}
