import React from 'react'
import { HeroSection } from './HeroSection'
import { AboutSection } from './AboutSection'
import { ServicesGrid } from './ServicesGrid'
import { ProcessSection } from './ProcessSection'
import { PricingSection } from './PricingSection'
import { TechStack } from './TechStack'
import { FaqSection } from './FaqSection'
import { ComparisonTable } from './ComparisonTable'
import { CaseStudiesSection } from './CaseStudiesSection'
import { TeamSection } from './TeamSection'
import type { SectionData } from '@/stores/pageBuilderStore'

interface SectionRendererProps {
  sections: SectionData[]
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ sections }) => {
  return (
    <>
      {(sections || [])
        .filter(sec => sec.is_active)
        .map(sec => {
          switch (sec.type) {
            case 'hero':
              return <div id="home" key={sec.id}><HeroSection content={sec.content} styling={sec.styling} /></div>

            // 'stats' / 'about' types all render the About section (company overview pillars)
            case 'stats':
            case 'about':
            case 'about_summary':
            case 'company_overview':
              return <div id="about" key={sec.id}><AboutSection content={sec.content} styling={sec.styling} /></div>

            case 'services':
            case 'services_summary':
              return <div id="services" key={sec.id}><ServicesGrid content={sec.content} styling={sec.styling} /></div>

            case 'process':
            case 'process_steps':
              return <div id="process" key={sec.id}><ProcessSection content={sec.content} styling={sec.styling} /></div>

            case 'pricing':
            case 'pricing_summary':
            case 'pricing_table':
              return <div id="pricing" key={sec.id}><PricingSection content={sec.content} styling={sec.styling} /></div>

            case 'case_studies':
              return <div id="case-studies" key={sec.id}><CaseStudiesSection content={sec.content} styling={sec.styling} /></div>

            case 'comparison':
              return <div id="comparison" key={sec.id}><ComparisonTable content={sec.content} styling={sec.styling} /></div>

            case 'faq':
              return <div id="faq" key={sec.id}><FaqSection content={sec.content} styling={sec.styling} /></div>

            case 'tech_stack':
              return <div id="tech" key={sec.id}><TechStack content={sec.content} styling={sec.styling} /></div>

            case 'team':
              return <div id="team" key={sec.id}><TeamSection content={sec.content} styling={sec.styling} /></div>

            default:
              return null
          }
        })}
    </>
  )
}
export default SectionRenderer
