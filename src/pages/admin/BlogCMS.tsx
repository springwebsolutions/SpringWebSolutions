import React, { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { 
  BookOpen, Plus, Edit, Trash2, Save, FileText, 
  Eye, EyeOff, Loader2, CheckCircle, AlertCircle, ArrowLeft, Terminal
} from 'lucide-react'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string | null
  status: 'draft' | 'published' | 'scheduled'
  published_at: string | null
  reading_time_minutes: number
  is_featured: boolean
  seo_title: string | null
  seo_description: string | null
  profiles?: {
    full_name: string
  } | null
  categories?: any[]
}

export const BlogCMS: React.FC = () => {
  const { user } = useAuthStore()
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Editor view states
  const [isEditing, setIsEditing] = useState(false)
  const [currentPost, setCurrentPost] = useState<Post | null>(null)
  
  // Editor Form fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')
  const [isFeatured, setIsFeatured] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDesc, setSeoDesc] = useState('')
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write')

  const [actionLoading, setActionLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

  const fetchPostsAndMeta = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    try {
      const [postRes, catRes, tagRes] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('*, profiles(full_name), blog_post_categories(blog_categories(*))')
          .order('created_at', { ascending: false }),
        supabase.from('blog_categories').select('*'),
        supabase.from('blog_tags').select('*')
      ])

      if (postRes.error) throw postRes.error
      
      const mapped = (postRes.data || []).map((p: any) => ({
        ...p,
        categories: p.blog_post_categories?.map((c: any) => c.blog_categories).filter(Boolean) || []
      }))

      setPosts(mapped)
      setCategories(catRes.data || [])
      setTags(tagRes.data || [])
    } catch (err) {
      console.error('Error fetching blog CMS logs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPostsAndMeta()
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (!currentPost && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      )
    }
  }, [title, currentPost])

  const handleCreateNewClick = () => {
    setCurrentPost(null)
    setTitle('')
    setSlug('')
    setExcerpt('')
    setContent('')
    setFeaturedImage('')
    setStatus('draft')
    setIsFeatured(false)
    setSelectedCategory(categories[0]?.id || '')
    setSeoTitle('')
    setSeoDesc('')
    setIsEditing(true)
    setEditorTab('write')
    setNotification(null)
  }

  const handleEditClick = (post: Post) => {
    setCurrentPost(post)
    setTitle(post.title)
    setSlug(post.slug)
    setExcerpt(post.excerpt)
    setContent(post.content)
    setFeaturedImage(post.featured_image || '')
    setStatus(post.status)
    setIsFeatured(post.is_featured)
    setSelectedCategory(post.categories?.[0]?.id || '')
    setSeoTitle(post.seo_title || '')
    setSeoDesc(post.seo_description || '')
    setIsEditing(true)
    setEditorTab('write')
    setNotification(null)
  }

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return
    
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', postId)
      if (error) throw error
      
      setPosts(posts.filter(p => p.id !== postId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    setNotification(null)

    const readTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 200))

    try {
      const postPayload: any = {
        title,
        slug,
        excerpt,
        content,
        featured_image: featuredImage || null,
        status,
        is_featured: isFeatured,
        reading_time_minutes: readTime,
        seo_title: seoTitle || title,
        seo_description: seoDesc || excerpt,
        author_id: user?.id,
        updated_at: new Date().toISOString()
      }

      if (status === 'published' && (!currentPost || !currentPost.published_at)) {
        postPayload.published_at = new Date().toISOString()
      }

      let activePostId = currentPost?.id

      if (currentPost) {
        // Update Post
        const { error } = await supabase
          .from('blog_posts')
          .update(postPayload)
          .eq('id', currentPost.id)
        if (error) throw error
      } else {
        // Insert Post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            ...postPayload,
            published_at: status === 'published' ? new Date().toISOString() : null
          })
          .select('id')
          .single()
        
        if (error) throw error
        activePostId = data.id
      }

      // Sync Categories Mapping in blog_post_categories table
      if (selectedCategory && activePostId) {
        // 1. Delete previous mapping
        await supabase.from('blog_post_categories').delete().eq('post_id', activePostId)
        // 2. Insert new mapping
        await supabase.from('blog_post_categories').insert({
          post_id: activePostId,
          category_id: selectedCategory
        })
      }

      setNotification({ type: 'success', msg: 'Blog article successfully saved to database.' })
      setTimeout(() => {
        setIsEditing(false)
        fetchPostsAndMeta()
      }, 1000)
    } catch (err: any) {
      console.error(err)
      setNotification({ type: 'error', msg: err.message || 'Error occurred while saving.' })
    } finally {
      setActionLoading(false)
    }
  }

  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={28} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {isEditing ? (
        // EDIT / CREATE POST FORM VIEW
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsEditing(false)}
              className="btn-admin-secondary cursor-pointer"
            >
              <ArrowLeft size={13} />
              Back to Listing
            </button>
            <h2 className="font-bold text-white text-base">
              {currentPost ? 'Edit Article' : 'Compose New Article'}
            </h2>
          </div>

          {notification && (
            <div className={`p-3.5 rounded-xl flex items-start gap-2.5 text-xs border ${
              notification.type === 'success' ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/8 border-rose-500/20 text-rose-400'
            }`}>
              {notification.type === 'success' ? <CheckCircle className="shrink-0 mt-0.5" size={14} /> : <AlertCircle className="shrink-0 mt-0.5" size={14} />}
              <span>{notification.msg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Editor Text Fields (Col: 8) */}
            <div className="lg:col-span-8 admin-card p-6 space-y-5">
              
              {/* Title & Slug */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Article Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                    placeholder="E.g., How to Become a Web Developer in 2026"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Slug URL (Auto-Generated)</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#070a13] border border-white/5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-brand-emerald"
                    placeholder="how-to-become-a-web-developer"
                  />
                </div>
              </div>

              {/* Excerpt Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Excerpt / Summary Description</label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                  placeholder="Provide a short 1-2 sentence overview summary of the article for listings."
                />
              </div>

              {/* Markdown Body Tabs */}
              <div className="space-y-4">
                <div className="flex border-b border-white/5">
                  <button
                    type="button"
                    onClick={() => setEditorTab('write')}
                    className={`py-2 px-4 text-xs font-semibold border-b-2 cursor-pointer ${
                      editorTab === 'write' ? 'border-brand-emerald text-white' : 'border-transparent text-slate-400'
                    }`}
                  >
                    Compose Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('preview')}
                    className={`py-2 px-4 text-xs font-semibold border-b-2 cursor-pointer ${
                      editorTab === 'preview' ? 'border-brand-emerald text-white' : 'border-transparent text-slate-400'
                    }`}
                  >
                    Markdown Live Preview
                  </button>
                </div>

                {editorTab === 'write' ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Article Markdown Body</span>
                      <span className="text-[10px] lowercase text-slate-500 font-mono">Supports standard # H2, ## H3, &gt; quotes, * lists, ``` code</span>
                    </label>
                    <textarea
                      rows={14}
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/3 border border-white/10 text-sm font-mono text-slate-200 focus:outline-none focus:border-brand-emerald focus:bg-transparent"
                      placeholder="# Software Roadmaps 2026\n\nWrite your markdown content here..."
                    />
                  </div>
                ) : (
                  <div className="p-6 rounded-lg bg-brand-obsidian/30 border border-white/5 min-h-[300px] overflow-y-auto">
                    <MarkdownRenderer content={content || '*Type content to preview formatted headings, lists, and code blocks.*'} />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar properties (Col: 4) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Settings Card */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h4 className="font-display font-semibold text-xs text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">Publish Settings</h4>
                
                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Primary Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141b2b] border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Article Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141b2b] border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                  >
                    <option value="draft">Draft (Private)</option>
                    <option value="published">Published (Public)</option>
                  </select>
                </div>

                {/* Featured checkbox */}
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none py-1">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-white/10 text-brand-emerald focus:ring-brand-emerald"
                  />
                  <span>Mark as Featured Post</span>
                </label>

                {/* Image URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Featured Image URL</label>
                  <input
                    type="text"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>

              {/* SEO configuration panel */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h4 className="font-display font-semibold text-xs text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">SEO Configurations</h4>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">SEO Title Tag Override</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                    placeholder={title}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Meta Description Override</label>
                  <textarea
                    rows={3}
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                    placeholder={excerpt}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full btn-primary py-3 px-6 font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow shadow-brand-emerald/10"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                <span>Save Blog Article</span>
              </button>

            </div>

          </form>
        </div>
      ) : (
        // ARTICLE CMS LISTING VIEW
        <div className="admin-card p-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-white/[0.06] flex items-center justify-center">
                <BookOpen size={18} className="text-indigo-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Blog CMS</h1>
                <p className="text-[12px] text-slate-500 mt-0.5">Compose, publish, and manage blog articles &amp; SEO metadata.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter articles..."
                className="admin-input py-1.5 px-3 text-xs w-full sm:w-48"
              />
              <button
                onClick={handleCreateNewClick}
                className="btn-admin-primary cursor-pointer shrink-0"
              >
                <Plus size={14} />
                Compose Article
              </button>
            </div>
          </div>

          {/* Posts Table */}
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map(post => (
                  <tr key={post.id}>
                    <td>
                      <div className="font-semibold text-slate-200 max-w-xs truncate">{post.title}</div>
                    </td>
                    <td className="text-slate-500">
                      {post.categories?.[0]?.name || 'Uncategorized'}
                    </td>
                    <td>
                      <span className={`badge ${
                        post.status === 'published' ? 'badge-green' : 'badge-slate'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="text-slate-500">
                      {post.profiles?.full_name || 'Staff'}
                    </td>
                    <td className="text-slate-600">
                      {post.published_at 
                        ? new Date(post.published_at).toLocaleDateString()
                        : '—'
                      }
                    </td>
                    <td className="text-center">
                      <div className="inline-flex gap-1.5">
                        <button
                          onClick={() => handleEditClick(post)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPosts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-600">
                      <BookOpen size={28} className="mx-auto mb-2 opacity-30" />
                      No articles yet. Click "Compose Article" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  )
}
export default BlogCMS
