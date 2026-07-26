import React from 'react'
import { Code2, Cpu } from 'lucide-react'

interface TechCategory {
  name: string
  items: string[]
}

interface TechStackProps {
  content?: {
    title?: string
    subtitle?: string
    categories?: TechCategory[]
  }
  styling?: any
}

const defaultCategories: TechCategory[] = [
  {
    name: "Frontend & High-Speed Frameworks",
    items: ["React.js", "Next.js", "Vite", "TypeScript", "Tailwind CSS", "HTML5/CSS3"]
  },
  {
    name: "Backend & Database Infrastructure",
    items: ["Node.js", "Express", "Python", "Laravel", "Supabase", "PostgreSQL", "REST & Webhook APIs"]
  },
  {
    name: "CMS, E-Commerce & Cloud Deployment",
    items: ["WordPress", "WooCommerce", "Shopify", "Vercel", "Docker", "AWS Cloud"]
  }
]

export const TechStack: React.FC<TechStackProps> = ({ content }) => {
  const title = content?.title || "Our Technology Stack & Ecosystem"
  const subtitle = content?.subtitle || "We build with proven, modern, and reliable frameworks designed for zero lag, top security, and industrial-grade scalability."
  const techCategories = content?.categories && content.categories.length > 0 ? content.categories : defaultCategories

  return (
    <section className="py-20 bg-[#060810] dark:bg-[#060810] light:bg-slate-50 text-slate-900 dark:text-white border-b border-white/5 light:border-slate-200 transition-colors duration-300 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title Block */}
        <div className="space-y-4 max-w-3xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold uppercase tracking-widest">
            <Cpu size={13} /> Modern Stack Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 font-display tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 light:text-slate-600 font-sans font-light leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {techCategories.map((cat, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#080b14] dark:bg-[#080b14] light:bg-white border border-white/10 light:border-slate-200 space-y-6 flex flex-col hover:border-emerald-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 border-b border-white/10 light:border-slate-100 pb-4">
                <Code2 size={18} className="text-emerald-500 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                <h3 className="font-display text-base font-bold text-white dark:text-white light:text-slate-900 group-hover:text-emerald-400 light:group-hover:text-emerald-600 transition-colors">
                  {cat.name}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.04] dark:bg-white/[0.04] light:bg-slate-100 border border-white/10 light:border-slate-200 text-xs text-slate-200 dark:text-slate-200 light:text-slate-700 font-semibold font-mono tracking-wide hover:-translate-y-1 hover:scale-105 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-400 light:hover:text-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 cursor-default"
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
