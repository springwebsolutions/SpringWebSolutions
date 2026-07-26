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
  const rawItems = content?.items || []

  // Sanitize and ensure accurate numbers for Spring Web Solutions
  const items = rawItems.map(stat => {
    if (stat.value === '250+' || stat.value === '250' || stat.value === '10+' || stat.label.toLowerCase().includes('projects completed')) {
      return { value: '3', label: 'Completed Projects' }
    }
    if (stat.value === '98%') {
      return { value: '100%', label: 'Sprint Delivery Rate' }
    }
    if (stat.value === '40%+' || stat.value === '50M+') {
      return { value: '< 1s', label: 'Average Page Load Speed' }
    }
    return stat
  })

  return (
    <section className="py-12 relative bg-brand-obsidian dark:bg-brand-obsidian light:bg-slate-50 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel grid grid-cols-2 md:grid-cols-4 gap-8 p-8 border border-white/5 divide-y-0 divide-x divide-white/5 light:divide-slate-200 animate-fade-in-up">
          {items.map((stat, idx) => (
            <div key={idx} className="text-center px-4 space-y-2 first:border-l-0 border-l border-white/5 dark:border-white/5 light:border-slate-200 first:pl-0">
              {/* Stat value */}
              <div className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald to-brand-indigo">
                {stat.value}
              </div>
              {/* Stat label description */}
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
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
