export interface SwarmAdminConfig {
  is_enabled: boolean
  trigger_frequency: 'first_visit_session' | 'every_visit' | 'manual_only'
  show_floating_badge: boolean
  hotkey_enabled: boolean
  sound_enabled: boolean
  default_muted: boolean
  default_speed: '1x' | '2x' | '3x'
}

export const DEFAULT_SWARM_CONFIG: SwarmAdminConfig = {
  is_enabled: true,
  trigger_frequency: 'first_visit_session',
  show_floating_badge: true,
  hotkey_enabled: true,
  sound_enabled: true,
  default_muted: true,
  default_speed: '2x',
}

export type AgentPersonaId = 'sarah' | 'alex' | 'arjun' | 'vikram' | 'elena' | 'dev'

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
    avatarChar: 'S'
  },
  alex: {
    id: 'alex',
    name: 'Alex',
    role: 'TypeScript Core',
    color: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.45)',
    badgeLabel: 'Alex • TypeScript',
    avatarChar: 'A'
  },
  arjun: {
    id: 'arjun',
    name: 'Arjun',
    role: 'Database & ERP Lead',
    color: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.45)',
    badgeLabel: 'Arjun • DB Lead',
    avatarChar: 'J'
  },
  vikram: {
    id: 'vikram',
    name: 'Vikram',
    role: 'SRE & Performance',
    color: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    badgeLabel: 'Vikram • SRE / Ops',
    avatarChar: 'V'
  },
  elena: {
    id: 'elena',
    name: 'Elena',
    role: 'UI/UX & Motion',
    color: '#ec4899',
    accentGlow: 'rgba(236, 72, 153, 0.45)',
    badgeLabel: 'Elena • UI/Motion',
    avatarChar: 'E'
  },
  dev: {
    id: 'dev',
    name: 'Dev',
    role: 'Cloud & Security',
    color: '#06b6d4',
    accentGlow: 'rgba(6, 182, 212, 0.45)',
    badgeLabel: 'Dev • Security',
    avatarChar: 'D'
  }
}

export type SwarmTaskType = 'marquee_box' | 'typewriter' | 'snap_guide' | 'option_clone' | 'vector_pen'

export interface SwarmRebuildTask {
  id: string
  domElement: HTMLElement
  type: SwarmTaskType
  rect: {
    x: number
    y: number
    width: number
    height: number
  }
  textSnippet?: string
  assignedAgent: AgentPersonaId
  durationMs: number
  order: number
}

export interface MarqueeCrosshair {
  x: number
  y: number
  width: number
  height: number
  color: string
  label: string
}

export interface LaserSnapLine {
  id: string
  orientation: 'horizontal' | 'vertical'
  pos: number
  startPos: number
  endPos: number
  color: string
  opacity: number
}

export interface SwarmAgentState {
  id: AgentPersonaId
  x: number
  y: number
  vx: number
  vy: number
  targetX: number
  targetY: number
  isWorking: boolean
  currentTaskId: string | null
  actionText: string
  cursorMode: 'arrow' | 'crosshair' | 'caret' | 'clone'
  marqueeBox: MarqueeCrosshair | null
  typewriterText: string
  progress: number
}
