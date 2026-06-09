import React, { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  kbArticleSchema, kbCategorySchema, 
  type KBArticleData, type KBCategoryData 
} from '@/lib/validation'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'
import { 
  BookOpen, Plus, Trash2, Edit, Save, ArrowLeft, 
  Loader2, AlertCircle, CheckCircle, FileText, FolderPlus 
} from 'lucide-react'

export const KBCMS: React.FC = () => {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'articles' | 'categories'>('articles')
  const [categories, setCategories] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Editing Modes
  const [writingArticle, setWritingArticle] = useState(false)
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)

  // Markdown Preview Toggle
  const [previewMode, setPreviewMode] = useState(false)

  // Category Form
  const { 
    register: regCat, 
    handleSubmit: handleCatSubmit, 
    reset: resetCat, 
    setValue: setCatValue,
    formState: { errors: catErrors } 
  } = useForm<KBCategoryData>({
    resolver: zodResolver(kbCategorySchema)
  })

  // Article Form
  const { 
    register: regArt, 
    handleSubmit: handleArtSubmit, 
    reset: resetArt, 
    setValue: setArtValue,
    watch: watchArt,
    formState: { errors: artErrors } 
  } = useForm<any>({
    resolver: zodResolver(kbArticleSchema) as any,
    defaultValues: {
      is_published: true
    }
  })

  const watchContent = watchArt('content', '')
  const watchTitle = watchArt('title', '')

  const fetchData = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [catRes, artRes] = await Promise.all([
        supabase.from('knowledge_base_categories').select('*').order('name'),
        supabase.from('knowledge_base_articles').select('*, knowledge_base_categories(name)').order('created_at', { ascending: false })
      ])

      setCategories(catRes.data || [])
      setArticles(artRes.data || [])
    } catch (err) {
      console.error('Error fetching CMS data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Auto slug generation helper
  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const titleVal = e.target.value
    if (titleVal && !editingArticleId) {
      const slugVal = titleVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setArtValue('slug', slugVal)
      setArtValue('seo_title', titleVal)
    }
  }

  const handleCategoryTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const titleVal = e.target.value
    if (titleVal && !editingCategory) {
      const slugVal = titleVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setCatValue('slug', slugVal)
    }
  }

  // --- CATEGORY ACTIONS ---
  const onCategorySubmit = async (data: KBCategoryData) => {
    if (!isSupabaseConfigured || !user) return
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('knowledge_base_categories')
          .update({
            name: data.name,
            slug: data.slug,
            description: data.description || null
          })
          .eq('id', editingCategory.id)

        if (error) throw error
        setSuccessMsg('Category updated successfully.')
      } else {
        const { error } = await supabase
          .from('knowledge_base_categories')
          .insert({
            name: data.name,
            slug: data.slug,
            description: data.description || null
          })

        if (error) throw error
        setSuccessMsg('New category added.')
      }

      resetCat()
      setEditingCategory(null)
      setShowCategoryModal(false)
      fetchData()
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Error saving category.')
    }
  }

  const handleEditCategory = (cat: any) => {
    setEditingCategory(cat)
    setCatValue('name', cat.name)
    setCatValue('slug', cat.slug)
    setCatValue('description', cat.description || '')
    setShowCategoryModal(true)
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All articles inside it will also be deleted!')) return
    if (!isSupabaseConfigured) return

    try {
      const { error } = await supabase
        .from('knowledge_base_categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSuccessMsg('Category deleted.')
      fetchData()
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not delete category.')
    }
  }

  // --- ARTICLE ACTIONS ---
  const onArticleSubmit = async (data: any) => {
    if (!isSupabaseConfigured || !user) return
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const payload: any = {
        title: data.title,
        slug: data.slug,
        category_id: data.category_id,
        content: data.content,
        is_published: data.is_published,
        seo_title: data.seo_title || null,
        seo_description: data.seo_description || null,
        author_id: user.id,
        updated_at: new Date().toISOString()
      }

      if (editingArticleId) {
        const { error } = await supabase
          .from('knowledge_base_articles')
          .update(payload)
          .eq('id', editingArticleId)

        if (error) throw error
        setSuccessMsg('Article updated successfully.')
      } else {
        const { error } = await supabase
          .from('knowledge_base_articles')
          .insert(payload)

        if (error) throw error
        setSuccessMsg('Article published/drafted successfully.')
      }

      handleCancelArticleEdit()
      fetchData()
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'Error saving article.')
    }
  }

  const handleEditArticle = (art: any) => {
    setEditingArticleId(art.id)
    setArtValue('title', art.title)
    setArtValue('slug', art.slug)
    setArtValue('category_id', art.category_id)
    setArtValue('content', art.content)
    setArtValue('is_published', art.is_published)
    setArtValue('seo_title', art.seo_title || '')
    setArtValue('seo_description', art.seo_description || '')
    setWritingArticle(true)
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    if (!isSupabaseConfigured) return

    try {
      const { error } = await supabase
        .from('knowledge_base_articles')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSuccessMsg('Article deleted.')
      fetchData()
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not delete article.')
    }
  }

  const handleCancelArticleEdit = () => {
    resetArt()
    setEditingArticleId(null)
    setWritingArticle(false)
    setPreviewMode(false)
  }

  return (
    <div className="space-y-6">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h3 className="font-display text-lg font-bold text-white tracking-tight">Knowledge Base CMS</h3>
          <p className="text-xs text-slate-500 mt-1">Manage technical assistance logs, setup instructions, and tutorials catalog.</p>
        </div>

        {!writingArticle && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                resetArt()
                setEditingArticleId(null)
                setWritingArticle(true)
              }}
              className="btn-primary flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow"
            >
              <Plus size={16} />
              <span>Write Article</span>
            </button>
            <button
              onClick={() => {
                resetCat()
                setEditingCategory(null)
                setShowCategoryModal(true)
              }}
              className="btn-secondary flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <FolderPlus size={16} />
              <span>Add Category</span>
            </button>
          </div>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs flex items-center gap-2">
          <CheckCircle className="shrink-0" size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="shrink-0" size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs list if not writing article */}
      {!writingArticle && (
        <div className="flex border-b border-white/5 space-x-6">
          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-3 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'articles' ? 'text-brand-emerald border-b-2 border-brand-emerald' : 'text-slate-400 hover:text-white'
            }`}
          >
            Articles ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'categories' ? 'text-brand-emerald border-b-2 border-brand-emerald' : 'text-slate-400 hover:text-white'
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>
      )}

      {loading ? (
        <div className="h-64 flex items-center justify-center text-brand-emerald">
          <Loader2 className="animate-spin" size={36} />
        </div>
      ) : writingArticle ? (
        
        /* WRITE/EDIT ARTICLE PANEL */
        <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <button
              onClick={handleCancelArticleEdit}
              className="text-slate-450 hover:text-white text-xs flex items-center gap-1 font-semibold"
            >
              <ArrowLeft size={14} />
              <span>Back to listings</span>
            </button>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                  previewMode 
                    ? 'bg-brand-emerald/10 border-brand-emerald text-brand-emerald' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {previewMode ? 'Edit Mode' : 'Preview Markdown'}
              </button>
            </div>
          </div>

          <form onSubmit={handleArtSubmit(onArticleSubmit)} className="space-y-5">
            {previewMode ? (
              /* PREVIEW TAB */
              <div className="space-y-4 max-w-3xl mx-auto">
                <div className="space-y-1">
                  <span className="text-[10px] bg-brand-emerald/10 text-brand-emerald px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {categories.find(c => c.id === watchArt('category_id'))?.name || 'Category'}
                  </span>
                  <h1 className="text-3xl font-extrabold text-white">{watchTitle || 'Untitled Article'}</h1>
                </div>
                <div className="border-t border-white/5 pt-6">
                  <MarkdownRenderer content={watchContent} />
                </div>
              </div>
            ) : (
              /* EDITOR FORM */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left side inputs */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Article Title</label>
                    <input
                      type="text"
                      {...regArt('title', { onBlur: handleTitleBlur })}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                      placeholder="e.g., Setting up Chrome Extension Sync Keys"
                    />
                    {artErrors.title?.message && <p className="text-xs text-rose-400">{String(artErrors.title.message)}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Article Body (Markdown Supported)</label>
                    <textarea
                      rows={14}
                      {...regArt('content')}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm font-mono text-emerald-450 focus:outline-none focus:border-brand-emerald"
                      placeholder="Write description in Markdown format. Support lists, # headers, > blockquotes and ```code sections."
                    />
                    {artErrors.content?.message && <p className="text-xs text-rose-400">{String(artErrors.content.message)}</p>}
                  </div>
                </div>

                {/* Right side settings metadata */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category Allocation</label>
                    <select
                      {...regArt('category_id')}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#141b2b] border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                    >
                      <option value="">Select category...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {artErrors.category_id?.message && <p className="text-xs text-rose-400">{String(artErrors.category_id.message)}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">URL Slug Path</label>
                    <input
                      type="text"
                      {...regArt('slug')}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                      placeholder="chrome-extension-sync"
                    />
                    {artErrors.slug?.message && <p className="text-xs text-rose-400">{String(artErrors.slug.message)}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SEO Title</label>
                    <input
                      type="text"
                      {...regArt('seo_title')}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SEO Description</label>
                    <textarea
                      rows={3}
                      {...regArt('seo_description')}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2 border-t border-white/5 pt-4">
                    <input
                      type="checkbox"
                      id="is_published"
                      {...regArt('is_published')}
                      className="rounded border-white/10 text-brand-emerald focus:ring-brand-emerald h-4 w-4 bg-white/5"
                    />
                    <label htmlFor="is_published" className="text-xs font-semibold text-slate-300 cursor-pointer">
                      Publish to public listing immediately
                    </label>
                  </div>
                </div>

              </div>
            )}

            {/* Save Buttons row */}
            <div className="pt-4 border-t border-white/5 flex gap-2 justify-end">
              <button
                type="submit"
                className="btn-primary px-6 py-2.5 text-xs font-semibold flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Save size={15} />
                <span>Save Article</span>
              </button>
              <button
                type="button"
                onClick={handleCancelArticleEdit}
                className="btn-secondary px-6 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>

      ) : activeTab === 'articles' ? (
        
        /* ARTICLES TAB INDEX LISTING */
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          {articles.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <BookOpen className="mx-auto text-slate-650" size={40} />
              <h4 className="text-sm font-bold text-white">No Articles Logged</h4>
              <p className="text-xs text-slate-500">Log some articles to documentation directories.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Created Date</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-350">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-white/1">
                      <td className="px-6 py-4 font-semibold text-white">
                        {art.title}
                        <span className="block text-[10px] text-slate-500 mt-0.5 font-normal">/{art.slug}</span>
                      </td>
                      <td className="px-6 py-4">
                        {art.knowledge_base_categories?.name || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          art.is_published 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-slate-700/10 text-slate-400 border border-slate-700/20'
                        }`}>
                          {art.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(art.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditArticle(art)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-1 rounded text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      ) : (

        /* CATEGORIES TAB INDEX LISTING */
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          {categories.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <FolderPlus className="mx-auto text-slate-650" size={40} />
              <h4 className="text-sm font-bold text-white">No Categories Added</h4>
              <p className="text-xs text-slate-500">Define some content categories to list articles.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Slug</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-350">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-white/1">
                      <td className="px-6 py-4 font-semibold text-white">{cat.name}</td>
                      <td className="px-6 py-4 font-mono text-slate-450">{cat.slug}</td>
                      <td className="px-6 py-4 text-slate-400 max-w-sm truncate">{cat.description || 'No Description'}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1 rounded text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CATEGORY DIALOG MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-white/5 space-y-4">
            <h3 className="font-display text-base font-bold text-white">
              {editingCategory ? 'Edit Category' : 'Add Content Category'}
            </h3>

            <form onSubmit={handleCatSubmit(onCategorySubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category Name</label>
                <input
                  type="text"
                  {...regCat('name', { onBlur: handleCategoryTitleBlur })}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-emerald"
                  placeholder="e.g., Guides & Onboarding"
                />
                {catErrors.name && <p className="text-xs text-rose-400">{catErrors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">URL Slug</label>
                <input
                  type="text"
                  {...regCat('slug')}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:outline-none"
                  placeholder="guides-onboarding"
                />
                {catErrors.slug && <p className="text-xs text-rose-400">{catErrors.slug.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  rows={3}
                  {...regCat('description')}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:outline-none"
                  placeholder="Short description of files or documentation in this category."
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4 font-semibold"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false)
                    setEditingCategory(null)
                    resetCat()
                  }}
                  className="btn-secondary text-xs px-4"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
export default KBCMS
