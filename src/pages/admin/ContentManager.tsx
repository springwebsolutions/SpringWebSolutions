import React, { useEffect, useState } from 'react'
import { usePageBuilderStore, DEFAULT_PAGES_CACHE, type PageData, type SectionData } from '@/stores/pageBuilderStore'
import { isSupabaseConfigured } from '@/lib/supabase'
import { 
  FileText, Edit, Eye, EyeOff, ArrowUp, ArrowDown, 
  Save, CheckCircle, AlertCircle, Loader2, Plus, Trash2, Globe, Sparkles, RefreshCw
} from 'lucide-react'

// Human-friendly names for each section type
const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero Header',
  stats: 'About / Company Overview',
  about: 'About / Company Overview',
  about_summary: 'About Summary',
  company_overview: 'Company Overview',
  services: 'Services Grid',
  services_summary: 'Services Grid',
  pricing: 'Pricing Plans',
  pricing_summary: 'Pricing Plans',
  pricing_table: 'Pricing Table',
  case_studies: 'Case Studies',
  comparison: 'Comparison Table',
  faq: 'FAQ Section',
  tech_stack: 'Tech Stack',
  process: 'Engineering Process',
  process_steps: 'Engineering Process',
  team: 'Team Section',
  cta: 'Call to Action',
  testimonials_summary: 'Testimonials',
}

export const ContentManager: React.FC = () => {
  const { 
    pages, 
    fetchPages, 
    currentPage, 
    currentSections, 
    fetchPageData, 
    saveSectionContent, 
    toggleSectionActive, 
    updateSectionsOrder,
    addSection,
    deleteSection,
    updatePageSEO
  } = usePageBuilderStore()

  const [selectedPage, setSelectedPage] = useState<string>('home')
  const [editingSection, setEditingSection] = useState<SectionData | null>(null)
  
  // Section edit fields
  const [formData, setFormData] = useState<any>({})
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Per-section toggle loading state
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [toggleError, setToggleError] = useState<string | null>(null)

  // SEO Editing State
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDesc, setSeoDesc] = useState('')
  const [seoKeywords, setSeoKeywords] = useState('')
  const [seoSaving, setSeoSaving] = useState(false)
  const [seoSuccess, setSeoSuccess] = useState(false)

  // Add Section Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSectionType, setNewSectionType] = useState('services_summary')
  const [addLoading, setAddLoading] = useState(false)

  // Pages shown in sidebar — Home first, then alphabetical, exclude pages without dedicated UI routes
  const SIDEBAR_PAGE_SLUGS = ['home', 'about', 'services', 'portfolio']
  const sidebarPages = SIDEBAR_PAGE_SLUGS
    .map(slug => {
      const found = pages.find(p => p.slug === slug)
      if (found) return found
      const cacheEntry = (DEFAULT_PAGES_CACHE as any)[slug]
      return cacheEntry ? cacheEntry.page : null
    })
    .filter(Boolean) as typeof pages

  useEffect(() => {
    fetchPages()
  }, [])

  useEffect(() => {
    fetchPageData(selectedPage)
    setEditingSection(null)
    setToggleError(null)
  }, [selectedPage])

  useEffect(() => {
    if (currentPage) {
      setSeoTitle(currentPage.seo_title || '')
      setSeoDesc(currentPage.seo_description || '')
      setSeoKeywords(currentPage.seo_keywords || '')
      setSeoSuccess(false)
    }
  }, [currentPage])

  const handleEditClick = (sec: SectionData) => {
    setEditingSection(sec)
    setFormData(JSON.parse(JSON.stringify(sec.content))) // Deep copy
    setSaveSuccess(false)
  }

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    if (!editingSection) return
    setSaveLoading(true)
    setSaveSuccess(false)
    try {
      await saveSectionContent(editingSection.id, formData)
      setSaveSuccess(true)
      setTimeout(() => setEditingSection(null), 1200)
    } catch (err) {
      console.error(err)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleSaveSEO = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPage) return
    setSeoSaving(true)
    setSeoSuccess(false)
    try {
      await updatePageSEO(currentPage.id, seoTitle, seoDesc, seoKeywords)
      setSeoSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSeoSaving(false)
    }
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1
    if (nextIndex < 0 || nextIndex >= currentSections.length) return

    const reordered = [...currentSections]
    const temp = reordered[index]
    reordered[index] = reordered[nextIndex]
    reordered[nextIndex] = temp

    try {
      await updateSectionsOrder(reordered)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section from the page layout?')) return
    try {
      await deleteSection(sectionId)
      if (editingSection?.id === sectionId) {
        setEditingSection(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggle = async (sec: SectionData) => {
    setTogglingId(sec.id)
    setToggleError(null)
    try {
      await toggleSectionActive(sec.id, !sec.is_active)
    } catch (err: any) {
      setToggleError(`Toggle failed: ${err?.message || 'Unknown error'}`)
    } finally {
      setTogglingId(null)
    }
  }

  const handleAddSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPage) return
    setAddLoading(true)

    let defaultContent: any = {}
    if (newSectionType === 'hero') {
      defaultContent = {
        headline: "New Section Headline",
        subheadline: "Descriptive subheadline text explaining your value proposition.",
        cta_primary_text: "Get Started",
        cta_primary_href: "/contact",
        cta_secondary_text: "Learn More",
        cta_secondary_href: "/services"
      }
    } else if (newSectionType === 'services_summary') {
      defaultContent = {
        title: "Key Digital Solutions",
        subtitle: "Explore our software engineering capabilities.",
        items: [
          { title: "Service Feature", desc: "Detailed description of feature.", href: "/services" }
        ]
      }
    } else if (newSectionType === 'case_studies') {
      defaultContent = {
        title: "Engineering Transformation Case Studies",
        subtitle: "Explore real-world technical transformations where custom software and high-speed web engineering delivered measurable business results."
      }
    } else if (newSectionType === 'comparison') {
      defaultContent = {
        title: "Why Choose Spring Web Solutions?",
        subtitle: "See how our high-performance engineering standards compare against traditional freelance work and generic template agencies."
      }
    } else if (newSectionType === 'faq') {
      defaultContent = {
        title: "Frequently Asked Questions",
        subtitle: "Everything you need to know about our web engineering process, code ownership, timelines, and technical standards."
      }
    } else if (newSectionType === 'tech_stack') {
      defaultContent = {
        title: "Our Engineering Ecosystem",
        subtitle: "We use modern, reliable, and secure tools to build platforms that do not go offline or suffer from bloat.",
        categories: [
          { name: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "Vite", "Next.js"] },
          { name: "Backend & Database", items: ["Node.js", "PostgreSQL", "Supabase"] }
        ]
      }
    } else if (newSectionType === 'cta') {
      defaultContent = {
        title: "Ready to Accelerate Growth?",
        subtitle: "Schedule a direct consultation with our solution engineering team.",
        cta_primary_text: "Book Call",
        cta_primary_href: "/contact",
        cta_secondary_text: "View Work",
        cta_secondary_href: "/blog"
      }
    } else if (newSectionType === 'process') {
      defaultContent = {
        title: 'Our Transparent Engineering Process',
        subtitle: 'Six clear steps from first conversation to launched product — and everything in between.'
      }
    } else if (newSectionType === 'team') {
      defaultContent = {
        title: "The Team Behind the Engineering",
        subtitle: "Meet the engineers, architects, and designers who build your platform.",
        members: []
      }
    } else if (newSectionType === 'pricing_summary') {
      defaultContent = {
        title: "Transparent Pricing",
        subtitle: "Choose the plan that fits your business.",
        plans: []
      }
    } else {
      defaultContent = {
        title: "Custom Section Title",
        subtitle: "Custom subtext content for this section."
      }
    }

    try {
      await addSection(currentPage.id, newSectionType, defaultContent)
      setShowAddModal(false)
    } catch (err) {
      console.error(err)
    } finally {
      setAddLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* ── Top Horizontal Page Selector Bar ── */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Globe size={18} />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-sm leading-tight">Website Pages CMS</h3>
            <p className="text-[11px] text-slate-400 font-light">Select a site page below to edit its SEO metadata, section visibility, and live layout content.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {sidebarPages.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPage(p.slug)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedPage === p.slug
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-105'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-emerald-500/30'
              }`}
            >
              <FileText size={14} />
              <span>{p.title}</span>
              <span className={`text-[10px] font-mono font-normal opacity-75 ${selectedPage === p.slug ? 'text-slate-900' : 'text-slate-400'}`}>
                /{p.slug}
              </span>
            </button>
          ))}

          <button
            onClick={() => fetchPageData(selectedPage)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer ml-auto md:ml-1"
            title="Refresh Page Data"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ── Main Full-Width Content Area ── */}
      <div className="w-full space-y-6">
        
        {/* SEO Metadata Editor Card */}
        <form onSubmit={handleSaveSEO} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Globe size={18} className="text-brand-emerald" />
                <span>Page SEO Metadata & Title ({currentPage?.title})</span>
              </h3>
              {seoSuccess && (
                <span className="text-xs text-brand-emerald flex items-center gap-1">
                  <CheckCircle size={14} />
                  <span>SEO saved!</span>
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SEO Page Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Page Title | Agency Name"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder="Summary description for Google search snippet..."
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Search Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="websites, custom software, SEO services"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={seoSaving}
              className="btn-secondary py-2 px-4 text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              {seoSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              <span>Save Page SEO Meta</span>
            </button>
          </form>

          {/* Section Layout Manager */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-white tracking-tight">
                  Page Layout Sections: {currentPage?.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Toggle visibility, reorder, edit content, or add new sections. Changes sync to the live site.</p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 font-semibold cursor-pointer shrink-0 shadow shadow-brand-emerald/15"
              >
                <Plus size={16} />
                <span>Add New Section</span>
              </button>
            </div>

            {/* Toggle error banner */}
            {toggleError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{toggleError}</span>
                <button onClick={() => setToggleError(null)} className="ml-auto text-rose-400 hover:text-white">✕</button>
              </div>
            )}

            <div className="divide-y divide-white/5 space-y-3">
              {currentSections.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No sections on this page yet. Click "Add New Section" above to add layout blocks.
                </div>
              ) : (
                currentSections.map((sec, idx) => (
                  <div key={sec.id} className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">
                          {SECTION_LABELS[sec.type] || sec.type.replace(/_/g, ' ')}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sec.is_active
                            ? 'bg-brand-emerald/15 text-brand-emerald border border-brand-emerald/20'
                            : 'bg-white/5 text-slate-500 border border-white/5'
                        }`}>
                          {sec.is_active ? '● Active' : '○ Hidden'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        type: {sec.type} &nbsp;·&nbsp; order: #{sec.display_order + 1}
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === currentSections.length - 1}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>

                      {/* Toggle visibility button with loading state */}
                      <button
                        onClick={() => handleToggle(sec)}
                        disabled={togglingId === sec.id}
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          sec.is_active
                            ? 'bg-brand-emerald/10 hover:bg-brand-emerald/20 text-brand-emerald'
                            : 'bg-white/5 hover:bg-white/10 text-slate-400'
                        } disabled:opacity-60`}
                        title={sec.is_active ? 'Click to Hide Section' : 'Click to Show Section'}
                      >
                        {togglingId === sec.id
                          ? <Loader2 size={14} className="animate-spin" />
                          : sec.is_active
                            ? <Eye size={14} />
                            : <EyeOff size={14} />
                        }
                      </button>

                      <button
                        onClick={() => handleEditClick(sec)}
                        className="btn-primary py-1.5 px-3 flex items-center gap-1 text-xs cursor-pointer"
                      >
                        <Edit size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(sec.id)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all cursor-pointer"
                        title="Delete Section"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Section Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <form onSubmit={handleAddSectionSubmit} className="glass-panel p-8 rounded-3xl border border-brand-emerald/20 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h4 className="font-display font-bold text-white text-base flex items-center gap-2">
                    <Sparkles size={18} className="text-brand-emerald" />
                    <span>Add New Page Section</span>
                  </h4>
                  <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Section Module Type</label>
                  <select
                    value={newSectionType}
                    onChange={(e) => setNewSectionType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                  >
                    <option value="hero">Hero Header Section</option>
                    <option value="services_summary">Services & Features Grid</option>
                    <option value="process">Engineering Process Steps</option>
                    <option value="tech_stack">Tech Stack Ecosystem Grid</option>
                    <option value="case_studies">Case Studies & Success Stories</option>
                    <option value="comparison">Why Choose Us / Comparison Table</option>
                    <option value="faq">Frequently Asked Questions (FAQ)</option>
                    <option value="pricing_summary">Pricing & Package Plans</option>
                    <option value="team">Team Members Section</option>
                    <option value="cta">Call to Action Banner</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary text-xs">Cancel</button>
                  <button type="submit" disabled={addLoading} className="btn-primary text-xs flex items-center gap-1.5">
                    {addLoading ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                    <span>Add to Layout</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Section Content Details Editor */}
          {editingSection && (
            <div className="glass-panel p-8 rounded-3xl border border-brand-emerald/20 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h4 className="font-display font-bold text-white text-base capitalize flex items-center gap-2">
                    <Edit size={16} className="text-brand-emerald" />
                    <span>Edit: {SECTION_LABELS[editingSection.type] || editingSection.type.replace(/_/g, ' ')}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Modify texts and items below. Click save to commit to database.</p>
                </div>
                <button
                  onClick={() => setEditingSection(null)}
                  className="btn-secondary py-1 px-3 text-xs"
                >
                  Close Editor
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3.5 rounded-xl bg-brand-emerald/15 border border-brand-emerald/20 text-brand-emerald text-xs flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Section updates saved to database successfully!</span>
                </div>
              )}

              {/* Dynamic Editing Fields Form */}
              <div className="space-y-5 text-sm">
                {Object.keys(formData).map((key) => {
                  const val = formData[key]

                  if (typeof val === 'string') {
                    return (
                      <div key={key} className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider capitalize">
                          {key.replace(/_/g, ' ')}
                        </label>
                        {val.length > 80 ? (
                          <textarea
                            rows={3}
                            value={val}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                          />
                        ) : (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                          />
                        )}
                      </div>
                    )
                  }

                  if (typeof val === 'object') {
                    return (
                      <div key={key} className="space-y-2 border-t border-white/5 pt-4">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider capitalize flex items-center justify-between">
                          <span>{key.replace(/_/g, ' ')} (Items Data)</span>
                          <span className="text-[10px] text-slate-500 font-mono">JSON/List Object</span>
                        </label>
                        <textarea
                          rows={6}
                          value={JSON.stringify(val, null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value)
                              setFormData((prev: any) => ({
                                ...prev,
                                [key]: parsed
                              }))
                            } catch (err) {
                              // Let user type JSON smoothly
                            }
                          }}
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-emerald-400 focus:outline-none focus:border-brand-emerald"
                        />
                      </div>
                    )
                  }

                  return null
                })}
              </div>

              <button
                onClick={handleSave}
                disabled={saveLoading}
                className="w-full btn-primary py-2.5 flex items-center justify-center gap-1.5 font-semibold cursor-pointer"
              >
                {saveLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                <span>Save Section Changes</span>
              </button>
            </div>
          )}
        </div>

    </div>
  )
}
export default ContentManager
