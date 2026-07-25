import React from 'react'
import { HeroSection } from './HeroSection'
import { StatsSection } from './StatsSection'
import { ServicesGrid } from './ServicesGrid'
import { PricingSection } from './PricingSection'
import { TestimonialCarousel } from './TestimonialCarousel'
import { TechStack } from './TechStack'
import { CtaSection } from './CtaSection'
import type { SectionData } from '@/stores/pageBuilderStore'

interface SectionRendererProps {
  sections: SectionData[]
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ sections }) => {
  return (
    <>
      {sections
        .filter(sec => sec.is_active)
        .map(sec => {
          switch (sec.type) {
            case 'hero':
              return <HeroSection key={sec.id} content={sec.content} styling={sec.styling} />
            case 'stats':
              return <StatsSection key={sec.id} content={sec.content} styling={sec.styling} />
            case 'services_summary':
              return <ServicesGrid key={sec.id} content={sec.content} styling={sec.styling} />
            case 'pricing':
            case 'pricing_summary':
            case 'pricing_table':
              return <PricingSection key={sec.id} content={sec.content} styling={sec.styling} />
            case 'testimonials_summary':
              return <TestimonialCarousel key={sec.id} content={sec.content} styling={sec.styling} />
            case 'tech_stack':
              return <TechStack key={sec.id} content={sec.content} styling={sec.styling} />
            case 'cta':
              return <CtaSection key={sec.id} content={sec.content} styling={sec.styling} />
            default:
              return (
                <div key={sec.id} className="py-8 text-center text-xs text-slate-500 border border-dashed border-white/5 my-4 rounded-xl">
                  Dynamic Component (Type: {sec.type}) editable in Admin Content Panel.
                </div>
              )
          }
        })}
    </>
  )
}
export default SectionRenderer
