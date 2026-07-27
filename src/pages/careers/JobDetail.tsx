import React, { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCareersStore } from '@/stores/careersStore'
import { CareersNavbar } from '@/components/careers/CareersNavbar'
import { AdBanner } from '@/components/careers/AdBanner'
import { Footer } from '@/components/layout/Footer'
import {
  MapPin, Briefcase, Building2, CheckCircle2, Laptop, ArrowLeft,
  Share2, Mail, ExternalLink, Calendar, Award
} from 'lucide-react'

export const JobDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { jobs, fetchJobs } = useCareersStore()

  useEffect(() => {
    fetchJobs()
  }, [slug])

  const job = jobs.find(j => j.slug === slug || j.id === slug)

  useEffect(() => {
    if (job) {
      document.title = `${job.title} - ${job.company_name} | SpringWeb Careers`
    }
  }, [job])

  if (!job) {
    return (
      <div className="min-h-screen bg-[#040509] text-white flex flex-col font-sans">
        <CareersNavbar />
        <div className="flex-grow flex items-center justify-center py-20 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display">Job Posting Not Found</h2>
            <p className="text-xs text-slate-400">The vacancy you are looking for may have been filled or expired.</p>
            <Link to="/jobs" className="btn-primary text-xs inline-flex items-center gap-2">
              <ArrowLeft size={14} />
              <span>Back to Job Listings</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const relatedJobs = jobs
    .filter(j => j.id !== job.id && (j.niche_category === job.niche_category || j.location_city === job.location_city))
    .slice(0, 3)

  const handleApply = () => {
    if (job.apply_link_or_email.startsWith('mailto:')) {
      window.location.href = job.apply_link_or_email
    } else {
      window.open(job.apply_link_or_email, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-[#040509] text-white flex flex-col font-sans">
      <CareersNavbar />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Top Breadcrumb & Back button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Vacancies</span>
            </button>

            <div className="text-xs text-slate-500 font-mono">
              Posted: {new Date(job.created_at).toLocaleDateString()}
            </div>
          </div>

          {/* Job Header Hero Card */}
          <div className="p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-display">
                    {job.company_name}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-300 text-xs border border-white/10">
                    {job.job_type}
                  </span>
                  {job.is_wfh && (
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <Laptop size={12} /> Work From Home
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                  {job.title}
                </h1>

                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-emerald-400" />
                    <span>{job.location_city}, {job.location_state}, {job.location_country}</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {job.salary_range}
                  </span>
                  <span>Experience: {job.experience_level}</span>
                </div>
              </div>

              <div>
                <button
                  onClick={handleApply}
                  className="w-full md:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Job Description & Requirements */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 space-y-8">
              
              <div className="p-8 rounded-3xl bg-[#080b14] border border-white/10 space-y-6">
                <div>
                  <h2 className="text-lg font-bold font-display text-white uppercase tracking-tight mb-3">
                    Role Description
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed font-light whitespace-pre-line">
                    {job.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <h2 className="text-lg font-bold font-display text-white uppercase tracking-tight">
                    Key Qualifications &amp; Skills
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-light">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={handleApply}
                    className="btn-primary text-xs flex items-center gap-1.5"
                  >
                    <span>Send Application</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>

              {/* In-Article Ad Banner Zone */}
              <AdBanner zoneId="article_bottom" />

            </div>

            {/* Sidebar Summary */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-[#080b14] border border-white/10 space-y-4 text-xs text-slate-300">
                <h3 className="font-bold text-white font-display text-sm border-b border-white/5 pb-3">
                  Job Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="font-semibold text-white">{job.niche_category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-semibold text-white">{job.location_city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Remote/WFH:</span>
                    <span className="font-semibold text-emerald-400">{job.is_wfh ? 'Yes (WFH)' : 'On-Site'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Package:</span>
                    <span className="font-semibold text-white">{job.salary_range}</span>
                  </div>
                </div>
              </div>
            </aside>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
