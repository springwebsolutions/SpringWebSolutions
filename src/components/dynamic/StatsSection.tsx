import React from 'react'

interface StatsProps {
  content: {
    items: Array<{
      value: string
      label: string
    }>
  }
  styling?: any
}

export const StatsSection: React.FC<StatsProps> = ({ content }) => {
  const items = content?.items || []

  return (
    <section className="relative py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-8 p-8 border border-white/5 divide-y-0 divide-x divide-white/5 light:divide-slate-200">
          {items.map((stat, idx) => (
            <div key={idx} className="text-center px-4 space-y-2 first:border-l-0 border-l border-white/5 dark:border-white/5 light:border-slate-200 first:pl-0">
              {/* Stat value */}
              <div className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald to-brand-indigo">
                {stat.value}
              </div>
              {/* Stat label description */}
              <div className="text-xs sm:text-sm font-medium text-slate-400 light:text-slate-600 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default StatsSection
