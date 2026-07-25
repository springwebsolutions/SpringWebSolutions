import React from 'react'
import { Quote, Star } from 'lucide-react'

interface TestimonialItem {
  quote: string
  author: string
  company: string
  role: string
  rating?: number
  avatar_url?: string
}

interface TestimonialProps {
  content: {
    title: string
    subtitle?: string
    items: TestimonialItem[]
  }
  styling?: any
}

export const TestimonialCarousel: React.FC<TestimonialProps> = ({ content }) => {
  const { title, subtitle, items } = content
  const testimonials = items || []

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

        {/* Testimonials list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6 relative flex flex-col justify-between animate-fade-in-up"
              style={{ animationDelay: `${(idx + 1) * 150}ms` }}
            >
              <div className="absolute top-6 right-6 text-brand-emerald/10 pointer-events-none">
                <Quote size={64} className="text-brand-emerald opacity-20" />
              </div>

              <div className="space-y-4 relative">
                {/* Stars */}
                <div className="flex space-x-1">
                  {[...Array(test.rating || 5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-brand-emerald text-brand-emerald" />
                  ))}
                </div>

                <p className="text-base italic text-slate-600 dark:text-slate-300 leading-relaxed font-sans font-light">
                  "{test.quote}"
                </p>
              </div>

              {/* Author profile */}
              <div className="flex items-center space-x-4 border-t border-white/5 pt-6 light:border-slate-200">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-emerald to-brand-indigo flex items-center justify-center font-bold text-white uppercase text-sm">
                  {test.author.charAt(0)}
                </div>
                <div>
                  <div className="font-display font-bold text-slate-900 dark:text-white text-sm">
                    {test.author}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                    {test.role}, <span className="text-brand-emerald">{test.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default TestimonialCarousel
