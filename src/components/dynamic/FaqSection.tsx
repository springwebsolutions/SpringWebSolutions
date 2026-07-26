import React, { useState } from 'react'
import { ChevronDown, HelpCircle, ShieldCheck, Code2, Zap, Clock } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
  category: 'general' | 'tech' | 'pricing' | 'support'
}

const faqData: FaqItem[] = [
  {
    question: "Do I get 100% full ownership of my website source code and database?",
    answer: "Yes, 100%. Unlike typical agencies that keep your website locked inside proprietary closed systems with mandatory monthly hosting traps, Spring Web Solutions grants you total ownership of all code repositories, database instances, and domain assets. You are never locked in.",
    category: "general"
  },
  {
    question: "How fast will my custom website or application load?",
    answer: "Every platform we engineer is optimized to achieve sub-second (< 1.0 second) load times and top 95+ Core Web Vitals scores. We use modern frameworks like React, Vite, and Next.js combined with CDN caching and zero bloat.",
    category: "tech"
  },
  {
    question: "What technology stack do you use for development?",
    answer: "We select the optimal stack based on your project goals: React / Vite & Next.js for high-speed frontends; Node.js, Python, and Laravel for backend APIs; Supabase & PostgreSQL for enterprise databases; and WordPress / WooCommerce / Shopify for modular e-commerce.",
    category: "tech"
  },
  {
    question: "Can you build custom CRM, ERP, or internal management software?",
    answer: "Yes. We specialize in custom business portals, CRM lead management tools, inventory ERPs, automated WhatsApp/email lead routing, and custom dashboard reporting tailored specifically to your company's operational workflow.",
    category: "general"
  },
  {
    question: "What is your project development timeline?",
    answer: "Standard corporate websites and landing portals are delivered in 1 to 2 weeks. Custom CRM/ERP software applications and complex web platforms typically range between 2 to 4 weeks depending on feature scope and sprint iterations.",
    category: "pricing"
  },
  {
    question: "Do you serve clients in Udumalpet, Tamil Nadu, and internationally?",
    answer: "Yes! We provide both local in-person consultations in Udumalpet, Tiruppur, Coimbatore, and Tamil Nadu, as well as seamless remote collaboration for clients across India and internationally.",
    category: "support"
  },
  {
    question: "How do you handle Technical SEO and search ranking setup?",
    answer: "Every site we build includes built-in Technical SEO: JSON-LD Schema markup, canonical tag structure, sitemap auto-generation, mobile responsive styling, and fast indexation setup on Google Search Console.",
    category: "tech"
  },
  {
    question: "What post-launch support and maintenance do you offer?",
    answer: "We provide dedicated maintenance contracts, 99.9% uptime SLA guarantees, security patching, database backups, and direct technical support via our client portal and WhatsApp.",
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        
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
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white/[0.02] dark:bg-white/[0.02] light:bg-white border border-white/10 light:border-slate-200 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-white dark:text-white light:text-slate-900 font-display">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-white/5 dark:bg-white/5 light:bg-slate-100 text-emerald-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-emerald-500/20' : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 dark:text-slate-300 light:text-slate-600 font-sans leading-relaxed border-t border-white/5 light:border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default FaqSection
