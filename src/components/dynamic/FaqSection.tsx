import React, { useState } from 'react'
import { ChevronDown, HelpCircle, ShieldCheck, Code2, Zap, Clock, ArrowRight } from 'lucide-react'
import AnimatedBackground from '../ui/AnimatedBackground'

interface FaqItem {
  question: string
  answer: string
  category: 'general' | 'tech' | 'pricing' | 'support'
}

const faqData: FaqItem[] = [
  {
    question: "What website development services does Spring Web Solutions provide?",
    answer: "Spring Web Solutions builds high-speed corporate websites, React & Next.js web applications, e-commerce storefronts, and conversion-focused portals for businesses locally in Udumalpet, Tiruppur & Coimbatore, statewide across Tamil Nadu, nationally in India, and internationally worldwide.",
    category: "general"
  },
  {
    question: "How do your custom ERP and CRM systems help businesses streamline operations?",
    answer: "Our custom ERP & CRM platforms integrate inventory management, automated billing, client lead tracking, automated PDF reporting, and WhatsApp notification bots into a unified dashboard tailored for local, national, and global business workflows.",
    category: "tech"
  },
  {
    question: "What mobile and desktop app development services do you offer?",
    answer: "We engineer native Android mobile apps (Kotlin/Flutter), iOS applications, and high-speed C# .NET Windows desktop software equipped with offline synchronization, local database storage, and Play Store publishing.",
    category: "tech"
  },
  {
    question: "What is Spring Web Solutions' service and SEO priority hierarchy?",
    answer: "Our service delivery and SEO priority flow is: 1. Local (Udumalpet, Tiruppur, Coimbatore), 2. State (Tamil Nadu), 3. National (Pan-India), and 4. International (Global/Worldwide).",
    category: "general"
  },
  {
    question: "Do clients receive 100% full source code ownership?",
    answer: "Yes, 100%. Spring Web Solutions grants complete ownership of all website code repositories, database instances, and domain assets without any mandatory hosting lock-in.",
    category: "pricing"
  },
  {
    question: "How fast do your engineered websites and web applications load?",
    answer: "Every platform we build is optimized for sub-second (< 1.0 second) load times and top 95+ Core Web Vitals performance scores using Next.js/Vite and CDN caching.",
    category: "tech"
  },
  {
    question: "How does Answer Engine Optimization (AEO) help my business rank on AI search engines?",
    answer: "Every site we deliver includes AEO multi-schema JSON-LD markup (FAQPage, ProfessionalService, OfferCatalog) formatted so AI engines like Google AI Overviews, ChatGPT Search, Perplexity, and Gemini extract and cite your business as the direct answer.",
    category: "general"
  },
  {
    question: "How can I request a project consultation or quote?",
    answer: "Submit our discovery form at springwebsolutions.in/contact or message our technical team directly on WhatsApp at +91 80126 22119 for a fast consultation.",
    category: "support"
  }
]

export const FaqSection: React.FC<{ content?: any; styling?: any }> = ({ content }) => {
  const title = content?.title || "Frequently Asked Questions"
  const subtitle = content?.subtitle || "Everything you need to know about our web engineering process, code ownership, timelines, and technical standards."

  const [activeTab, setActiveTab] = useState<string>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const filteredFaqs = activeTab === 'all'
    ? faqData
    : faqData.filter(item => item.category === activeTab)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-[#040509] dark:bg-[#040509] light:bg-slate-50 text-slate-900 dark:text-white border-b border-white/5 light:border-slate-200 transition-colors duration-300 relative overflow-hidden">
      <AnimatedBackground accent="emerald" particleCount={16} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold uppercase tracking-widest">
            <HelpCircle size={13} /> Transparent Answers
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white dark:text-white light:text-slate-900">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 dark:text-slate-400 light:text-slate-600 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Questions', icon: HelpCircle },
            { id: 'general', label: 'General & Ownership', icon: ShieldCheck },
            { id: 'tech', label: 'Tech & Speed', icon: Code2 },
            { id: 'pricing', label: 'Timelines & Scope', icon: Clock },
            { id: 'support', label: 'Support & Location', icon: Zap }
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setOpenIndex(0) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-white/5 dark:bg-white/5 light:bg-white border border-white/10 light:border-slate-200 text-slate-400 dark:text-slate-400 light:text-slate-700 hover:text-emerald-500'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className={`rounded-2xl border overflow-hidden shadow-sm transition-all duration-300 ${
                  isOpen
                    ? 'bg-white/[0.04] dark:bg-white/[0.04] light:bg-white border-emerald-500/30 light:border-emerald-400/40 shadow-emerald-500/10'
                    : 'bg-white/[0.02] dark:bg-white/[0.02] light:bg-white border-white/10 light:border-slate-200'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span className={`font-bold text-sm sm:text-base font-display transition-colors duration-200 ${
                    isOpen ? 'text-emerald-400 light:text-emerald-600' : 'text-white dark:text-white light:text-slate-900'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg transition-all duration-300 shrink-0 ${
                    isOpen
                      ? 'rotate-180 bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/5 dark:bg-white/5 light:bg-slate-100 text-emerald-500'
                  }`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? '400px' : '0px', opacity: isOpen ? 1 : 0 }}
                >
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 font-sans leading-relaxed border-t border-white/5 light:border-slate-100">
                    {faq.answer}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default FaqSection
