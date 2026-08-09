import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCareersStore } from '@/stores/careersStore'
import { CareersNavbar } from '@/components/careers/CareersNavbar'
import { CareersFooter } from '@/components/careers/CareersFooter'
import { AdBanner } from '@/components/careers/AdBanner'
import { CareersSeo } from '@/components/seo/CareersSeo'
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
        <CareersFooter />
      </div>
    )
  }

  const relatedJobs = jobs
    .filter(j => j.id !== job.id && (j.niche_category === job.niche_category || j.location_city === job.location_city))
    .slice(0, 3)

  const isInternal = job.is_internal_hiring !== false
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [applicantForm, setApplicantForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '3 Years',
    expected_salary: '',
    resume_url: '',
    cover_note: ''
  })

  const handleApply = () => {
    if (isInternal) {
      setIsApplyModalOpen(true)
    } else {
      if (job.apply_link_or_email.startsWith('mailto:')) {
        window.location.href = job.apply_link_or_email
      } else {
        window.open(job.apply_link_or_email, '_blank')
      }
    }
  }

  const handleInternalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittedSuccess(true)
    setTimeout(() => {
      setSubmittedSuccess(false)
      setIsApplyModalOpen(false)
    }, 2500)
  }

  const jobPostingSchema = job ? {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    'title': job.title,
    'description': job.description,
    'identifier': {
      '@type': 'PropertyValue',
      'name': job.company_name,
      'value': job.id
    },
    'datePosted': job.created_at,
    'employmentType': job.job_type.toUpperCase().replace('-', '_'),
    'hiringOrganization': {
      '@type': 'Organization',
      'name': job.company_name,
      'sameAs': 'https://careers.springwebsolutions.in',
      'logo': 'https://www.springwebsolutions.in/logo-emblem.png'
    },
    'jobLocation': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': job.location_city,
        'addressRegion': job.location_state,
        'addressCountry': job.location_country
      }
    },
    'applicantLocationRequirements': {
      '@type': 'Country',
      'name': job.location_country
    },
    'jobLocationType': job.is_wfh || job.is_remote ? 'TELECOMMUTE' : undefined
  } : undefined

  return (
    <div className="min-h-screen bg-[#040509] text-white flex flex-col font-sans">
      <CareersSeo 
        title={`${job.title} | ${job.company_name} | SpringWeb Careers`}
        description={`${job.title} vacancy at ${job.company_name} in ${job.location_city}, ${job.location_state}. Package: ${job.salary_range}. Work mode: ${job.is_wfh ? '100% WFH' : 'On-Site'}.`}
        canonicalUrl={`https://careers.springwebsolutions.in/jobs/${job.slug}`}
        schemaJson={jobPostingSchema}
      />
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

            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
              isInternal 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
            }`}>
              {isInternal ? '🌟 SpringWeb Direct Opening' : '🏢 Employer Vacancy'}
            </span>

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

      {/* Application Modal for SpringWeb Internal Openings */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#080b14] border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Apply for Position</h3>
                <div className="text-xs text-emerald-400 font-mono mt-0.5">{job.title}</div>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {submittedSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">Application Submitted Successfully!</h4>
                <p className="text-xs text-slate-400">Our hiring team will review your resume and contact you via email.</p>
              </div>
            ) : (
              <form onSubmit={handleInternalSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={applicantForm.name}
                    onChange={(e) => setApplicantForm({ ...applicantForm, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={applicantForm.email}
                      onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                      placeholder="you@email.com"
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={applicantForm.phone}
                      onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Resume Link / Portfolio URL</label>
                  <input
                    type="url"
                    required
                    value={applicantForm.resume_url}
                    onChange={(e) => setApplicantForm({ ...applicantForm, resume_url: e.target.value })}
                    placeholder="https://drive.google.com/your-resume.pdf or LinkedIn"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cover Note / Key Achievements</label>
                  <textarea
                    rows={3}
                    value={applicantForm.cover_note}
                    onChange={(e) => setApplicantForm({ ...applicantForm, cover_note: e.target.value })}
                    placeholder="Briefly describe your relevant skills and project experience..."
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <CareersFooter />
    </div>
  )
}
