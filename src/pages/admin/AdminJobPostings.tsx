import { useCareersStore } from '@/stores/careersStore'
import type { JobPosting } from '@/stores/careersStore'
import { Plus, Trash2, Edit2, CheckCircle2, MapPin, Laptop, Sparkles } from 'lucide-react'

export const AdminJobPostings: React.FC = () => {
  const { jobs, addJob, updateJob, deleteJob } = useCareersStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    company_name: 'Spring Web Solutions',
    location_country: 'India',
    location_state: 'Tamil Nadu',
    location_city: 'Udumalpet',
    location_area: 'Main Road',
    is_remote: true,
    is_wfh: true,
    job_type: 'Full-Time' as JobPosting['job_type'],
    experience_level: 'Mid Level' as JobPosting['experience_level'],
    salary_range: '₹8,00,000 - ₹14,00,000 / year',
    niche_category: 'Software Engineering',
    description: '',
    requirements: '',
    apply_link_or_email: 'mailto:careers@springwebsolutions.in',
    status: 'active' as JobPosting['status'],
    featured: true
  })

  const handleOpenAdd = () => {
    setEditingJob(null)
    setForm({
      title: '',
      slug: '',
      company_name: 'Spring Web Solutions',
      location_country: 'India',
      location_state: 'Tamil Nadu',
      location_city: 'Udumalpet',
      location_area: 'Main Road',
      is_remote: true,
      is_wfh: true,
      job_type: 'Full-Time',
      experience_level: 'Mid Level',
      salary_range: '₹8,00,000 - ₹14,00,000 / year',
      niche_category: 'Software Engineering',
      description: '',
      requirements: '3+ years experience with React/Next.js\nStrong backend knowledge',
      apply_link_or_email: 'mailto:careers@springwebsolutions.in',
      status: 'active',
      featured: true
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (job: JobPosting) => {
    setEditingJob(job)
    setForm({
      title: job.title,
      slug: job.slug,
      company_name: job.company_name,
      location_country: job.location_country,
      location_state: job.location_state,
      location_city: job.location_city,
      location_area: job.location_area || '',
      is_remote: job.is_remote,
      is_wfh: job.is_wfh,
      job_type: job.job_type,
      experience_level: job.experience_level,
      salary_range: job.salary_range,
      niche_category: job.niche_category,
      description: job.description,
      requirements: job.requirements.join('\n'),
      apply_link_or_email: job.apply_link_or_email,
      status: job.status,
      featured: job.featured
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const reqArray = form.requirements.split('\n').filter(r => r.trim().length > 0)
    const generatedSlug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    if (editingJob) {
      await updateJob(editingJob.id, {
        ...form,
        slug: generatedSlug,
        requirements: reqArray
      })
    } else {
      await addJob({
        ...form,
        slug: generatedSlug,
        requirements: reqArray
      })
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white font-display uppercase tracking-tight">
            Manage Job Vacancies &amp; Careers
          </h1>
          <p className="text-xs text-slate-400 font-light mt-1">
            Post, edit, and publish job openings across local, national, and remote categories.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary text-xs flex items-center gap-1.5 cursor-pointer w-max"
        >
          <Plus size={15} />
          <span>Post New Vacancy</span>
        </button>
      </div>

      {/* Table / List View */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/5 border-b border-white/10 text-slate-400 font-mono uppercase text-[10px]">
            <tr>
              <th className="p-4">Title &amp; Company</th>
              <th className="p-4">Location</th>
              <th className="p-4">Type &amp; Category</th>
              <th className="p-4">Salary</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-white text-sm">{job.title}</div>
                  <div className="text-[11px] text-emerald-400">{job.company_name}</div>
                </td>
                <td className="p-4">
                  <div>{job.location_city}, {job.location_country}</div>
                  {job.is_wfh && <div className="text-[10px] text-indigo-400">WFH Remote</div>}
                </td>
                <td className="p-4">
                  <div>{job.job_type}</div>
                  <div className="text-[10px] text-slate-400">{job.niche_category}</div>
                </td>
                <td className="p-4 font-mono font-semibold text-emerald-400">
                  {job.salary_range}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    job.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(job)}
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => deleteJob(job.id)}
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#080b14] border border-white/10 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <h2 className="text-xl font-bold font-display text-white">
              {editingJob ? 'Edit Vacancy Posting' : 'Post New Vacancy'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={form.company_name}
                    onChange={e => setForm({ ...form, company_name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={form.location_country}
                    onChange={e => setForm({ ...form, location_country: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={form.location_state}
                    onChange={e => setForm({ ...form, location_state: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={form.location_city}
                    onChange={e => setForm({ ...form, location_city: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Salary Range</label>
                  <input
                    type="text"
                    required
                    value={form.salary_range}
                    onChange={e => setForm({ ...form, salary_range: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Apply Email / Link</label>
                  <input
                    type="text"
                    required
                    value={form.apply_link_or_email}
                    onChange={e => setForm({ ...form, apply_link_or_email: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Qualifications / Requirements (1 per line)</label>
                <textarea
                  rows={3}
                  required
                  value={form.requirements}
                  onChange={e => setForm({ ...form, requirements: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.is_wfh}
                    onChange={e => setForm({ ...form, is_wfh: e.target.checked })}
                    className="h-4 w-4 rounded bg-white/10"
                  />
                  <span>Work From Home / Remote</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })}
                    className="h-4 w-4 rounded bg-white/10"
                  />
                  <span>Featured Vacancy</span>
                </label>
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
                  Save Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
