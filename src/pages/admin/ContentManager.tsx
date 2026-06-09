import React, { useEffect, useState } from 'react'
import { usePageBuilderStore, type PageData, type SectionData } from '@/stores/pageBuilderStore'
import { isSupabaseConfigured } from '@/lib/supabase'
import { 
  FileText, Edit, Eye, EyeOff, ArrowUp, 
  ArrowDown, Save, CheckCircle, AlertCircle, Loader2 
} from 'lucide-react'

export const ContentManager: React.FC = () => {
  const { 
    pages, 
    fetchPages, 
    currentPage, 
    currentSections, 
    fetchPageData, 
    saveSectionContent, 
    toggleSectionActive, 
    updateSectionsOrder 
  } = usePageBuilderStore()

  const [selectedPage, setSelectedPage] = useState<string>('home')
  const [editingSection, setEditingSection] = useState<SectionData | null>(null)
  
  // Section edit fields
  const [formData, setFormData] = useState<any>({})
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    fetchPages()
  }, [])

  useEffect(() => {
    fetchPageData(selectedPage)
  }, [selectedPage])

  const handleEditClick = (sec: SectionData) => {
    setEditingSection(sec)
    setFormData(JSON.parse(JSON.stringify(sec.content))) // Deep copy
    setSaveSuccess(false)
  }

  const handleInputChange = (key: string, value: string) => {
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
      setTimeout(() => setEditingSection(null), 1000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaveLoading(false)
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

  return (
    <div className="space-y-8">
      
      {/* Selector and pages grid */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* Page selector side panel (Col: 3) */}
        <div className="w-full md:w-64 glass-panel p-6 rounded-2xl border border-white/5 space-y-4 shrink-0">
          <h3 className="font-display font-bold text-white text-sm">Site Pages</h3>
          <div className="space-y-1.5">
            {pages.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPage(p.slug)
                  setEditingSection(null)
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-all text-left cursor-pointer ${
                  selectedPage === p.slug
                    ? 'bg-brand-emerald/10 text-brand-emerald font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText size={16} />
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic section manager */}
        <div className="flex-grow w-full space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-white uppercase tracking-tight">
                  Page Layout Structure: {currentPage?.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Configure, reorder, or update sections in real-time.</p>
              </div>
            </div>

            <div className="divide-y divide-white/5 space-y-4">
              {currentSections.map((sec, idx) => (
                <div key={sec.id} className="pt-4 flex items-center justify-between first:pt-0">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-200 text-sm capitalize">{sec.type.replace('_', ' ')}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        sec.is_active ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-white/5 text-slate-500'
                      }`}>
                        {sec.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">Display Index: {sec.display_order}</div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center space-x-2">
                    {/* Move Up */}
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-2 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                      <ArrowUp size={14} />
                    </button>
                    {/* Move Down */}
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === currentSections.length - 1}
                      className="p-2 rounded bg-white/5 hover:bg-white/10 text-slate-400 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                      <ArrowDown size={14} />
                    </button>
                    {/* Toggle Active */}
                    <button
                      onClick={() => toggleSectionActive(sec.id, !sec.is_active)}
                      className="p-2 rounded bg-white/5 hover:bg-white/10 text-slate-400 transition-all cursor-pointer"
                      title={sec.is_active ? 'Disable Section' : 'Enable Section'}
                    >
                      {sec.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    {/* Edit content */}
                    <button
                      onClick={() => handleEditClick(sec)}
                      className="btn-primary py-1.5 px-3 flex items-center gap-1 text-xs cursor-pointer"
                    >
                      <Edit size={12} />
                      <span>Edit Content</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section content details editor (Overlay modal style or edit block) */}
          {editingSection && (
            <div className="glass-panel p-8 rounded-3xl border border-brand-emerald/20 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-white text-base capitalize">
                    Section Content: {editingSection.type.replace('_', ' ')}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Modify structural texts below. Fields auto-save to database.</p>
                </div>
                <button
                  onClick={() => setEditingSection(null)}
                  className="btn-secondary py-1 px-3 text-xs"
                >
                  Close
                </button>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-lg bg-brand-emerald/15 border border-brand-emerald/20 text-brand-emerald text-xs flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Section updates saved to PostgreSQL database!</span>
                </div>
              )}

              {/* Dynamic editing fields form */}
              <div className="space-y-4 text-sm">
                {Object.keys(formData).map((key) => {
                  const val = formData[key]
                  // Handle strings or nested arrays (e.g. stats items list)
                  if (typeof val === 'string') {
                    return (
                      <div key={key} className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider capitalize">
                          {key.replace('_', ' ')}
                        </label>
                        {val.length > 80 ? (
                          <textarea
                            rows={3}
                            value={val}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-900/5 light:border-slate-200"
                          />
                        ) : (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-900/5 light:border-slate-200"
                          />
                        )}
                      </div>
                    )
                  }
                  
                  // For arrays/objects, we provide a warning or let them edit as stringified JSON for advanced control
                  if (typeof val === 'object') {
                    return (
                      <div key={key} className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider capitalize">
                          {key.replace('_', ' ')} (JSON Object)
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
                              // Let them type without crashing, only validate on save
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

    </div>
  )
}
export default ContentManager
