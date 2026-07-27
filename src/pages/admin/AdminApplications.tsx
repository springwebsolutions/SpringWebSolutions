import React, { useState } from 'react'
import { 
  Users, Search, Filter, Mail, Phone, MapPin, Briefcase, 
  CheckCircle2, Clock, XCircle, ExternalLink, Download, Sparkles, FileText, ChevronRight
} from 'lucide-react'

export interface JobApplication {
  id: string
  applicant_name: string
  email: string
  phone: string
  job_title: string
  location: string
  experience_years: string
  expected_salary: string
  resume_url: string
  cover_note: string
  status: 'new' | 'reviewing' | 'shortlisted' | 'interview' | 'hired' | 'rejected'
  applied_at: string
  match_score: number
}

const SAMPLE_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-101',
    applicant_name: 'Karthik Subramanian',
    email: 'karthik.s@gmail.com',
    phone: '+91 98765 43210',
    job_title: 'Senior Full-Stack React & Node Engineer',
    location: 'Chennai, Tamil Nadu',
    experience_years: '4 Years',
    expected_salary: '₹12,00,000 / year',
    resume_url: 'https://careers.springwebsolutions.in/resumes/karthik_resume.pdf',
    cover_note: 'Extensive experience in Next.js 14, Zustand, Supabase, and building enterprise web portals.',
    status: 'shortlisted',
    applied_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    match_score: 95
  },
  {
    id: 'app-102',
    applicant_name: 'Priya Sundaram',
    email: 'priya.dev@outlook.com',
    phone: '+91 94432 10987',
    job_title: 'Native Android (Kotlin) Mobile Developer',
    location: 'Coimbatore, Tamil Nadu',
    experience_years: '3 Years',
    expected_salary: '₹8,50,000 / year',
    resume_url: 'https://careers.springwebsolutions.in/resumes/priya_android.pdf',
    cover_note: 'Published 3 Kotlin apps on Play Store using Jetpack Compose and Coroutines.',
    status: 'interview',
    applied_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    match_score: 91
  },
  {
    id: 'app-103',
    applicant_name: 'Arun Kumar',
    email: 'arunkumar.dev@yahoo.com',
    phone: '+91 91234 56789',
    job_title: 'Windows Desktop Application Engineer (C# .NET)',
    location: 'Udumalpet, Tamil Nadu',
    experience_years: '5 Years',
    expected_salary: '₹14,00,000 / year',
    resume_url: 'https://careers.springwebsolutions.in/resumes/arun_dotnet.pdf',
    cover_note: 'Built billing POS desktop systems with C# WPF, WinUI 3, and thermal printer hardware integrations.',
    status: 'new',
    applied_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    match_score: 88
  },
  {
    id: 'app-104',
    applicant_name: 'Siddharth Rao',
    email: 'siddharth.seo@gmail.com',
    phone: '+91 99887 76655',
    job_title: 'Remote Digital Marketing & Technical SEO Specialist',
    location: 'Bengaluru, Karnataka',
    experience_years: '4.5 Years',
    expected_salary: '₹11,00,000 / year',
    resume_url: 'https://careers.springwebsolutions.in/resumes/siddharth_seo.pdf',
    cover_note: 'Specialized in schema markup, Core Web Vitals optimization, and keyword ranking growth.',
    status: 'hired',
    applied_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    match_score: 98
  }
]

export const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>(SAMPLE_APPLICATIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null)

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateAppStatus = (id: string, newStatus: JobApplication['status']) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null)
    }
  }

  const getStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'hired':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> Hired</span>
      case 'interview':
        return <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1"><Clock size={12} /> Interview</span>
      case 'shortlisted':
        return <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold flex items-center gap-1"><Sparkles size={12} /> Shortlisted</span>
      case 'reviewing':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold flex items-center gap-1"><Clock size={12} /> Reviewing</span>
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1"><XCircle size={12} /> Rejected</span>
      default:
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold flex items-center gap-1"><FileText size={12} /> New</span>
    }
  }

  return (
    <div className="space-y-8 p-6 sm:p-8 max-w-7xl mx-auto text-white">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-500/20">
            <Briefcase size={13} /> Recruitment Console
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight uppercase text-white">Candidate Applications</h1>
          <p className="text-sm text-slate-400 mt-1 font-light">Manage candidate applications, resume submissions, match scores, and interview stages exclusively for SpringWeb Solutions internal hiring positions.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
            <span className="text-emerald-400 font-bold">{applications.length}</span> Total Candidates
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-8 relative">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, email, job position, or location..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-[#080b14] border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Application Statuses</option>
            <option value="new">New Submissions</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview Scheduled</option>
            <option value="hired">Hired / Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Applications Table + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table List */}
        <div className={selectedApp ? "lg:col-span-7 space-y-4" : "lg:col-span-12 space-y-4"}>
          <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-white/5 border-b border-white/10 uppercase tracking-wider font-mono text-[10px] text-slate-400">
                  <tr>
                    <th className="p-4">Candidate</th>
                    <th className="p-4">Applied Position</th>
                    <th className="p-4">Match Score</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredApps.map(app => (
                    <tr 
                      key={app.id} 
                      onClick={() => setSelectedApp(app)}
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${selectedApp?.id === app.id ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500' : ''}`}
                    >
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{app.applicant_name}</div>
                        <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail size={11} /> {app.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-200">{app.job_title}</div>
                        <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={11} /> {app.location}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
                          {app.match_score}%
                        </span>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedApp(app) }}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-white transition-all text-xs font-semibold cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Candidate Inspector Drawer */}
        {selectedApp && (
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl glass-panel border border-white/15 space-y-6 relative shadow-2xl bg-[#080c18]">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold font-display text-white">{selectedApp.applicant_name}</h3>
                  <div className="text-xs text-emerald-400 font-mono mt-0.5">{selectedApp.job_title}</div>
                </div>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <XCircle size={18} />
                </button>
              </div>

              {/* Candidate Info Breakdown */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-slate-400 font-mono text-[10px] uppercase">Experience</div>
                  <div className="font-bold text-white">{selectedApp.experience_years}</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-slate-400 font-mono text-[10px] uppercase">Expected Salary</div>
                  <div className="font-bold text-white">{selectedApp.expected_salary}</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1 col-span-2">
                  <div className="text-slate-400 font-mono text-[10px] uppercase">Contact Details</div>
                  <div className="text-slate-200 font-mono">{selectedApp.email} • {selectedApp.phone}</div>
                </div>
              </div>

              {/* Cover Note */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Candidate Pitch / Note</div>
                <p className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 font-light leading-relaxed">
                  "{selectedApp.cover_note}"
                </p>
              </div>

              {/* Status Selector */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Update Application Stage</div>
                <div className="grid grid-cols-3 gap-2">
                  {(['new', 'shortlisted', 'interview', 'hired', 'rejected'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => updateAppStatus(selectedApp.id, s)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        selectedApp.status === s 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                          : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <a
                  href={`mailto:${selectedApp.email}?subject=SpringWeb%20Careers%20Update%3A%20${encodeURIComponent(selectedApp.job_title)}`}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail size={14} /> Email Candidate
                </a>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  )
}
