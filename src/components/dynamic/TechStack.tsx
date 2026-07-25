import React from 'react'

interface TechCategory {
  name: string
  items: string[]
}

interface TechStackProps {
  content: {
    title: string
    subtitle?: string
    categories: TechCategory[]
  }
  styling?: any
}

export const TechStack: React.FC<TechStackProps> = ({ content }) => {
  const { title, subtitle, categories } = content
  const techCategories = categories || []

  return (
    <section className="py-20 bg-brand-obsidian dark:bg-brand-obsidian light:bg-slate-50 border-b border-white/5 light:border-slate-200 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title Block */}
        <div className="space-y-4 max-w-3xl animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-slate-600 dark:text-slate-400 font-sans font-light leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Tech Stack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {techCategories.map((cat, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6 flex flex-col animate-fade-in-up"
              style={{ animationDelay: `${(idx + 1) * 150}ms` }}
            >
              <h3 className="font-display text-lg font-bold text-brand-emerald border-b border-slate-200 dark:border-white/5 pb-3">
                {cat.name}
              </h3>
              
              <div className="flex flex-wrap gap-2.5">
                {cat.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-slate-300 font-medium tracking-wide"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default TechStack
