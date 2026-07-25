import React from 'react'

interface AdminPageHeaderProps {
  icon?: React.ComponentType<{ size?: number; className?: string }>
  title: string
  description?: string
  iconColor?: string
  iconBg?: string
  actions?: React.ReactNode
}

/**
 * Shared page header for all admin panel pages.
 * Provides a consistent look: icon + title + description + optional action buttons.
 */
export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  icon: Icon,
  title,
  description,
  iconColor = 'text-emerald-400',
  iconBg = 'bg-emerald-500/10',
  actions
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className={`h-10 w-10 rounded-xl ${iconBg} border border-white/[0.06] flex items-center justify-center shrink-0`}>
            <Icon size={18} className={iconColor} />
          </div>
        )}
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight leading-tight">{title}</h1>
          {description && <p className="text-[12px] text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  )
}

export default AdminPageHeader
