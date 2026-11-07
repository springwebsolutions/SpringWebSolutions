export interface SwarmAdminConfig {
  is_enabled: boolean
  display_mode: 'hero_only' | 'site_wide_overlay' | 'both' | 'disabled'
  show_floating_badge: boolean
  hotkey_enabled: boolean
  audio_synthesizer_enabled: boolean
  default_muted: boolean
  default_speed: '1x' | '2x' | '3x'
  enabled_routes: string[]
}

export const DEFAULT_SWARM_CONFIG: SwarmAdminConfig = {
  is_enabled: true,
  display_mode: 'both',
  show_floating_badge: true,
  hotkey_enabled: true,
  audio_synthesizer_enabled: true,
  default_muted: true,
  default_speed: '2x',
  enabled_routes: ['/']
}

export type AgentPersonaId = 'frontend' | 'typescript' | 'database' | 'sre'

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
  frontend: {
    id: 'frontend',
    name: 'Sarah',
    role: 'Frontend Architect',
    color: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.45)',
    badgeLabel: 'Architect • Sarah',
    avatarChar: 'S'
  },
  typescript: {
    id: 'typescript',
    name: 'Alex',
    role: 'TypeScript Core',
    color: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.45)',
    badgeLabel: 'Core TS • Alex',
    avatarChar: 'A'
  },
  database: {
    id: 'database',
    name: 'Arjun',
    role: 'Database & ERP Lead',
    color: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.45)',
    badgeLabel: 'DB Lead • Arjun',
    avatarChar: 'J'
  },
  sre: {
    id: 'sre',
    name: 'Vikram',
    role: 'SRE & Performance',
    color: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.45)',
    badgeLabel: 'SRE / Ops • Vikram',
    avatarChar: 'V'
  }
}

export type BlueprintTaskType = 'container' | 'text' | 'vector' | 'action'

export interface BlueprintTask {
  id: string
  type: BlueprintTaskType
  rect: {
    x: number
    y: number
    width: number
    height: number
  }
  textContent?: string
  assignedAgent: AgentPersonaId
  dependencies: string[]
  durationMs: number
  domElement: HTMLElement
  orderIndex: number
}

export interface MarqueeSelection {
  x: number
  y: number
  width: number
  height: number
  color: string
  label: string
}

export interface SnapGuideLine {
  orientation: 'horizontal' | 'vertical'
  pos: number
  color: string
  opacity: number
}

export interface AgentBoidState {
  id: AgentPersonaId
  x: number
  y: number
  vx: number
  vy: number
  targetX: number
  targetY: number
  currentTaskId: string | null
  isWorking: boolean
  actionText: string
  marqueeSelection: MarqueeSelection | null
  typewriterText: string
  progress: number
}

export interface SwarmPlaybackControls {
  speed: '1x' | '2x' | '3x'
  isMuted: boolean
  isPlaying: boolean
  progress: number // 0 to 100
  activeTaskCount: number
  totalTaskCount: number
}
