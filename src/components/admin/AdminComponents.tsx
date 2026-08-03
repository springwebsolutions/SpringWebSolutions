/**
 * SpringWeb Admin Suite — Shared Components
 *
 * Provides consistent, premium UI primitives used across all 18 admin modules.
 * Import individual exports as needed.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, AlertTriangle } from 'lucide-react'

// ─── AdminCard ─────────────────────────────────────────────────────────────────
interface AdminCardProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
  hover?: boolean
}

export const AdminCard: React.FC<AdminCardProps> = ({
  children, className = '', noPadding, hover,
}) => (
  <div className={`
    relative bg-[#07090f] border border-white/[0.07] rounded-2xl overflow-hidden
    ${noPadding ? '' : 'p-5'}
    ${hover ? 'transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/30' : ''}
    ${className}
  `}>
    {children}
  </div>
)

// ─── AdminSectionHeader ────────────────────────────────────────────────────────
interface AdminSectionHeaderProps {
  title: string
  sub?: string
  action?: React.ReactNode
  icon?: React.ComponentType<any>
  iconColor?: string
}

export const AdminSectionHeader: React.FC<AdminSectionHeaderProps> = ({
  title, sub, action, icon: Icon, iconColor = 'text-emerald-400',
}) => (
  <div className="flex items-start justify-between mb-5 gap-4">
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={17} className={iconColor} />
        </div>
      )}
      <div>
        <h2 className="text-sm font-bold text-white">{title}</h2>
        {sub && <p className="text-[11px] text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
)

// ─── AdminBadge ───────────────────────────────────────────────────────────────
type BadgeVariant = 'emerald' | 'rose' | 'sky' | 'amber' | 'violet' | 'indigo' | 'slate' | 'orange'

const BADGE_STYLES: Record<BadgeVariant, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rose:    'bg-rose-500/10 text-rose-400 border-rose-500/20',
  sky:     'bg-sky-500/10 text-sky-400 border-sky-500/20',
  amber:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  violet:  'bg-violet-500/10 text-violet-400 border-violet-500/20',
  indigo:  'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  slate:   'bg-slate-500/10 text-slate-400 border-slate-500/20',
  orange:  'bg-orange-500/10 text-orange-400 border-orange-500/20',
}

interface AdminBadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: 'xs' | 'sm'
  dot?: boolean
  className?: string
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  children, variant = 'slate', size = 'xs', dot, className = '',
}) => (
  <span className={`
    inline-flex items-center gap-1 rounded-lg border font-bold uppercase tracking-wide
    ${size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-1 text-[10px]'}
    ${BADGE_STYLES[variant]}
    ${className}
  `}>
    {dot && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
    {children}
  </span>
)

// Convenience mapped badge for lead/ticket status
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const MAP: Record<string, { variant: BadgeVariant; label: string }> = {
    new:       { variant: 'sky',     label: 'New' },
    contacted: { variant: 'violet',  label: 'Contacted' },
    qualified: { variant: 'amber',   label: 'Qualified' },
    proposal:  { variant: 'orange',  label: 'Proposal' },
    won:       { variant: 'emerald', label: 'Won' },
    lost:      { variant: 'rose',    label: 'Lost' },
    open:      { variant: 'rose',    label: 'Open', },
    closed:    { variant: 'slate',   label: 'Closed' },
    resolved:  { variant: 'emerald', label: 'Resolved' },
    pending:   { variant: 'amber',   label: 'Pending' },
    active:    { variant: 'emerald', label: 'Active' },
    draft:     { variant: 'slate',   label: 'Draft' },
    published: { variant: 'emerald', label: 'Published' },
  }
  const cfg = MAP[status?.toLowerCase()] || { variant: 'slate' as BadgeVariant, label: status }
  return <AdminBadge variant={cfg.variant}>{cfg.label}</AdminBadge>
}

// ─── AdminEmptyState ──────────────────────────────────────────────────────────
interface AdminEmptyStateProps {
  icon: React.ComponentType<any>
  title: string
  description?: string
  action?: { label: string; to?: string; onClick?: () => void }
  iconColor?: string
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  icon: Icon, title, description, action, iconColor = 'text-slate-600',
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-3">
    <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
      <Icon size={22} className={iconColor} />
    </div>
    <div>
      <div className="text-sm font-semibold text-slate-400">{title}</div>
      {description && <div className="text-xs text-slate-600 mt-1 max-w-xs">{description}</div>}
    </div>
    {action && (
      action.to ? (
        <Link
          to={action.to}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/15 transition-all"
        >
          {action.label} <ArrowUpRight size={12} />
        </Link>
      ) : (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/15 transition-all"
        >
          {action.label}
        </button>
      )
    )}
  </div>
)

// ─── AdminTableRow ────────────────────────────────────────────────────────────
interface AdminTableRowProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export const AdminTableRow: React.FC<AdminTableRowProps> = ({ children, onClick, className = '' }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0 -mx-2 px-2 rounded-lg transition-colors
      ${onClick ? 'cursor-pointer hover:bg-white/[0.025]' : ''}
      ${className}
    `}
  >
    {children}
  </div>
)

// ─── AdminAvatarChip ──────────────────────────────────────────────────────────
export const AdminAvatarChip: React.FC<{
  name: string; size?: 'sm' | 'md'
}> = ({ name, size = 'sm' }) => (
  <div className={`
    rounded-lg bg-gradient-to-br from-emerald-500/30 to-indigo-500/30 border border-white/10
    flex items-center justify-center shrink-0
    ${size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'}
  `}>
    <span className="text-white font-bold uppercase" style={{ fontSize: size === 'sm' ? '10px' : '12px' }}>
      {name?.[0] || '?'}
    </span>
  </div>
)
