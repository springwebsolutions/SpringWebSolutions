/**
 * Swarm Site Animation Types & Persona Configuration
 */

export interface SwarmAdminConfig {
  is_enabled: boolean
  trigger_frequency: 'first_visit_session' | 'every_visit' | 'manual_only'
  sound_enabled: boolean
  default_speed: '1x' | '2x' | '3x'
  show_floating_badge?: boolean
  hotkey_enabled?: boolean
  default_muted?: boolean
}

export const DEFAULT_SWARM_CONFIG: SwarmAdminConfig = {
  is_enabled: true,
  trigger_frequency: 'every_visit',
  sound_enabled: true,
  default_speed: '2x',
  show_floating_badge: false,
  hotkey_enabled: false,
  default_muted: false,
}

export type AgentPersonaId = 'sarah' | 'alex' | 'arjun' | 'vikram'

export interface AgentPersona {
  id: AgentPersonaId
  name: string
  role: string
  color: string
  accentGlow: string
  badgeLabel: string
  avatarChar: string
}

export const AGENT_PERSONAS: Record<AgentPersonaId, AgentPersona> = {
  sarah: {
    id: 'sarah',
    name: 'Sarah',
    role: 'Frontend Architect',
    color: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.45)',
    badgeLabel: 'Sarah • Architect',
    avatarChar: 'S',
  },
  alex: {
    id: 'alex',
    name: 'Alex',
    role: 'TypeScript Core',
    color: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.45)',
    badgeLabel: 'Alex • TypeScript',
    avatarChar: 'A',
  },
  arjun: {
    id: 'arjun',
    name: 'Arjun',
    role: 'Database & ERP Lead',
    color: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.45)',
    badgeLabel: 'Arjun • DB Lead',
    avatarChar: 'J',
  },
  vikram: {
    id: 'vikram',
    name: 'Vikram',
    role: 'SRE & Performance',
    color: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    badgeLabel: 'Vikram • SRE / Ops',
    avatarChar: 'V',
  },
}

export interface SpringCursorState {
  id: AgentPersonaId
  x: number
  y: number
  vx: number
  vy: number
  targetX: number
  targetY: number
  tiltAngle: number
  cursorMode: 'arrow' | 'crosshair' | 'caret' | 'clone'
  actionText: string
  typewriterText?: string
  opacity: number
}

export interface StudioBox {
  id: string
  x: number
  y: number
  w: number
  h: number
  color: string
  label: string
  progress: number
}

export interface LaserGuide {
  id: string
  orientation: 'horizontal' | 'vertical'
  pos: number
  start: number
  end: number
  color: string
  opacity: number
  label?: string
}

export interface DistanceRuler {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  gapPx: number
  color: string
}

export interface GhostCard {
  x: number
  y: number
  w: number
  h: number
  opacity: number
}

export interface RealDomTargets {
  header: HTMLElement | null
  navLogo: HTMLElement | null
  navLinks: HTMLElement[]
  navActions: HTMLElement | null
  techBadges: HTMLElement[]
  badge: HTMLElement | null
  h1: HTMLElement | null
  sub: HTMLElement | null
  p: HTMLElement | null
  ctaPrimary: HTMLElement | null
  ctaSecondary: HTMLElement | null
  terminal: HTMLElement | null
  terminalHeader: HTMLElement | null
  cards: HTMLElement[]
  aboutSection: HTMLElement | null
  aboutPillars: HTMLElement[]
  services: HTMLElement | null
}


