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
    <section className="py-20 bg-brand-obsidian/20 relative">
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

        {/* Testimonials list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6 relative flex flex-col justify-between"
            >
              <div className="absolute top-6 right-6 text-brand-emerald/10 pointer-events-none">
                <Quote size={64} />
              </div>

              <div className="space-y-4 relative">
                {/* Stars */}
                <div className="flex space-x-1">
                  {[...Array(test.rating || 5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-brand-emerald text-brand-emerald" />
                  ))}
                </div>

                <p className="text-base italic text-slate-300 light:text-slate-750 leading-relaxed">
                  "{test.quote}"
                </p>
              </div>

              {/* Author profile */}
              <div className="flex items-center space-x-4 border-t border-white/5 pt-6 light:border-slate-200">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-emerald to-brand-indigo flex items-center justify-center font-bold text-white uppercase">
                  {test.author.charAt(0)}
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm light:text-slate-900">
                    {test.author}
                  </div>
                  <div className="text-xs text-slate-400 light:text-slate-500">
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
