import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCareersStore } from '@/stores/careersStore'
import { CareersNavbar } from '@/components/careers/CareersNavbar'
import { CareersFooter } from '@/components/careers/CareersFooter'
import { AdBanner } from '@/components/careers/AdBanner'
import {
  Search, MapPin, Briefcase, Filter, Laptop, ArrowRight,
  Sparkles, CheckCircle2, ChevronRight, RefreshCw, Building2, LocateFixed, Loader2
} from 'lucide-react'

export const JobListings: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { jobs, fetchJobs } = useCareersStore()

  // Filter states
  const [keyword, setKeyword] = useState(searchParams.get('q') || '')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedCity, setSelectedCity] = useState(searchParams.get('loc') || 'all')
  const [selectedJobType, setSelectedJobType] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isWfhOnly, setIsWfhOnly] = useState(searchParams.get('wfh') === 'true')
  const [detectingGps, setDetectingGps] = useState(false)

  const handleDetectGps = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!navigator.geolocation) return

    setDetectingGps(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          const data = await res.json()
          const detectedCity = data.city || data.locality || data.principalSubdivision || 'Tamil Nadu'
          setSelectedCity(detectedCity)
        } catch (err) {
          // Silent fallback
        } finally {
          setDetectingGps(false)
        }
      },
      () => setDetectingGps(false),
      { timeout: 10000 }
    )
  }

  useEffect(() => {
    fetchJobs()
    document.title = 'Active Job Openings & Vacancies Vault | SpringWeb Solutions'
  }, [])

  const activeJobs = jobs.filter(j => j.status === 'active')

  // Multi-attribute filtering logic
  const filteredJobs = activeJobs.filter(job => {
    const matchesKeyword = !keyword || (
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.description.toLowerCase().includes(keyword.toLowerCase()) ||
      job.company_name.toLowerCase().includes(keyword.toLowerCase()) ||
      job.niche_category.toLowerCase().includes(keyword.toLowerCase())
    )

    const matchesCountry = selectedCountry === 'all' || job.location_country.toLowerCase().includes(selectedCountry.toLowerCase())
    
    const matchesCity = selectedCity === 'all' || 
      job.location_city.toLowerCase().includes(selectedCity.toLowerCase()) ||
      job.location_state.toLowerCase().includes(selectedCity.toLowerCase()) ||
      (selectedCity === 'Udumalpet' && job.location_city === 'Udumalpet')

    const matchesJobType = selectedJobType === 'all' || job.job_type === selectedJobType
    const matchesCategory = selectedCategory === 'all' || job.niche_category === selectedCategory
    const matchesWfh = !isWfhOnly || job.is_wfh || job.is_remote

    return matchesKeyword && matchesCountry && matchesCity && matchesJobType && matchesCategory && matchesWfh
  })

  const resetFilters = () => {
    setKeyword('')
    setSelectedCountry('all')
    setSelectedCity('all')
    setSelectedJobType('all')
    setSelectedCategory('all')
    setIsWfhOnly(false)
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-[#040509] text-white flex flex-col font-sans transition-colors duration-300">
      <CareersNavbar />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider font-display">
              <Briefcase size={14} />
              <span>Job Vacancies Vault</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-display uppercase">
              Explore Active Career Openings
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
              Filter openings by city, state, country, work from home (WFH) remote status, and employment category.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Filters & Ad Slot */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-6">
                
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2 font-bold text-sm text-white font-display">
                    <Filter size={16} className="text-emerald-400" />
                    <span>Filter Vacancies</span>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Keyword Search */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Search Keyword</label>
                  <div className="relative">
                    <Search size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="Title, skill, company..."
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Location Filter: Open LinkedIn / Indeed Style Input with GPS */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">City, State or Country</label>
                    <button
                      type="button"
                      onClick={handleDetectGps}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {detectingGps ? <Loader2 size={10} className="animate-spin" /> : <LocateFixed size={10} />}
                      <span>GPS Detect</span>
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-3.5 text-emerald-400" />
                    <input
                      type="text"
                      value={selectedCity === 'all' ? '' : selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value || 'all')}
                      placeholder="e.g. Chennai, Mumbai, London, Remote..."
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={handleDetectGps}
                      title="Detect My Location"
                      className="absolute right-2.5 top-2.5 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      {detectingGps ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {[
                      { label: 'All', val: 'all' },
                      { label: 'Pan-India', val: 'India' },
                      { label: 'Tamil Nadu', val: 'Tamil Nadu' },
                      { label: 'Chennai', val: 'Chennai' },
                      { label: 'Coimbatore', val: 'Coimbatore' },
                      { label: 'Bengaluru', val: 'Bengaluru' },
                      { label: 'Hyderabad', val: 'Hyderabad' },
                      { label: 'Mumbai', val: 'Mumbai' },
                      { label: 'Delhi NCR', val: 'Delhi' },
                      { label: 'Remote WFH', val: 'Remote' }
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedCity(chip.val)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
                          selectedCity.toLowerCase() === chip.val.toLowerCase()
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Type Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Employment Type</label>
                  <select
                    value={selectedJobType}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080b14] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="all">All Job Types</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                {/* Remote / WFH Checkbox */}
                <div className="pt-2 border-t border-white/5">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={isWfhOnly}
                      onChange={(e) => setIsWfhOnly(e.target.checked)}
                      className="h-4 w-4 rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <span>100% Work From Home (WFH) Only</span>
                  </label>
                </div>

              </div>

              {/* Sidebar Ad Rectangle Banner Zone */}
              <AdBanner zoneId="sidebar_rectangle" />

            </aside>

            {/* Main Job Results Feed */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="text-xs font-mono text-slate-400">
                  Showing <span className="font-bold text-emerald-400">{filteredJobs.length}</span> active postings
                </div>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-3xl space-y-4">
                  <Briefcase size={48} className="mx-auto text-slate-500" />
                  <h3 className="text-lg font-bold text-white">No Matching Vacancies Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try broadening your search keywords or resetting filters to see all available openings.
                  </p>
                  <button onClick={resetFilters} className="btn-secondary text-xs">
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-6 rounded-3xl bg-[#080b14] border border-white/10 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all space-y-4 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-emerald-400">{job.company_name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                              {job.niche_category}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-white font-display group-hover:text-emerald-400 transition-colors">
                            {job.title}
                          </h2>
                        </div>

                        {job.is_wfh && (
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max">
                            <Laptop size={11} /> Remote / WFH
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 font-light">
                        {job.description}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5 text-xs text-slate-400">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-emerald-400" />
                            <span>{job.location_city}, {job.location_state}, {job.location_country}</span>
                          </span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {job.salary_range}
                          </span>
                        </div>

                        <Link
                          to={`/jobs/${job.slug}`}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 w-max shadow-md shadow-emerald-500/20"
                        >
                          <span>Apply Now</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      <CareersFooter />
    </div>
  )
}
