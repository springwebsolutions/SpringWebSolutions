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
    <section className="py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white light:text-slate-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-slate-400 light:text-slate-600">
              {subtitle}
            </p>
          )}
        </div>

        {/* Tech Stack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {techCategories.map((cat, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6 flex flex-col"
            >
              <h3 className="font-display text-lg font-bold text-brand-emerald border-b border-white/5 pb-3 light:border-slate-200">
                {cat.name}
              </h3>
              
              <div className="flex flex-wrap gap-2.5">
                {cat.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 font-medium tracking-wide light:bg-slate-100 light:border-slate-200 light:text-slate-700"
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
