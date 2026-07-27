import React, { useState } from 'react'
import { useCareersStore } from '@/stores/careersStore'
import type { CareerGuide } from '@/stores/careersStore'
import { Plus, Trash2, Edit2, BookOpen } from 'lucide-react'

export const AdminCareerGuides: React.FC = () => {
  const { guides, addGuide, updateGuide, deleteGuide } = useCareersStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuide, setEditingGuide] = useState<CareerGuide | null>(null)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Career Guidance' as CareerGuide['category'],
    author: 'SpringWeb Educational Team',
    tags: 'Career, Skills, Education',
    status: 'published' as CareerGuide['status']
  })

  const handleOpenAdd = () => {
    setEditingGuide(null)
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Career Guidance',
      author: 'SpringWeb Educational Team',
      tags: 'Career, Skills, Education',
      status: 'published'
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (guide: CareerGuide) => {
    setEditingGuide(guide)
    setForm({
      title: guide.title,
      slug: guide.slug,
      excerpt: guide.excerpt,
      content: guide.content,
      category: guide.category,
      author: guide.author,
      tags: guide.tags ? guide.tags.join(', ') : '',
      status: guide.status
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const tagsArray = form.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    const generatedSlug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    if (editingGuide) {
      await updateGuide(editingGuide.id, {
        ...form,
        slug: generatedSlug,
        tags: tagsArray
      })
    } else {
      await addGuide({
        ...form,
        slug: generatedSlug,
        tags: tagsArray
      })
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white font-display uppercase tracking-tight">
            Manage Educational Career Guides
          </h1>
          <p className="text-xs text-slate-400 font-light mt-1">
            Publish educational content, exam roadmaps, and career advice articles.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary text-xs flex items-center gap-1.5 cursor-pointer w-max"
        >
          <Plus size={15} />
          <span>New Educational Article</span>
        </button>
      </div>

      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
            <tr>
              <th className="p-4">Title &amp; Excerpt</th>
              <th className="p-4">Category</th>
              <th className="p-4">Author</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {guides.map((g) => (
              <tr key={g.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-white text-sm line-clamp-1">{g.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{g.excerpt}</div>
                </td>
                <td className="p-4 font-semibold text-emerald-400">{g.category}</td>
                <td className="p-4 text-slate-300">{g.author}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    g.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {g.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(g)}
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => deleteGuide(g.id)}
                    className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#080b14] border border-white/10 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <h2 className="text-xl font-bold font-display text-white">
              {editingGuide ? 'Edit Guide Article' : 'New Guide Article'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  required
                  value={form.excerpt}
                  onChange={e => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Content (Markdown supported)</label>
                <textarea
                  rows={8}
                  required
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as any })}
                    className="w-full p-3 rounded-xl bg-[#080b14] border border-white/10 text-white cursor-pointer"
                  >
                    <option value="Career Guidance">Career Guidance</option>
                    <option value="Entrance Exams">Entrance Exams</option>
                    <option value="Skill Building">Skill Building</option>
                    <option value="Remote Work Tips">Remote Work Tips</option>
                    <option value="Resume & Interviews">Resume &amp; Interviews</option>
                    <option value="Job Market Trends">Job Market Trends</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Author Name</label>
                  <input
                    type="text"
                    required
                    value={form.author}
                    onChange={e => setForm({ ...form, author: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Save Guide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
