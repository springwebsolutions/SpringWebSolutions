import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCareersStore } from '@/stores/careersStore'
import { CareersNavbar } from '@/components/careers/CareersNavbar'
import { CareersFooter } from '@/components/careers/CareersFooter'
import { AdBanner } from '@/components/careers/AdBanner'
import { CareersSeo } from '@/components/seo/CareersSeo'
import { POPULAR_INDIA_LOCATIONS } from '@/data/indiaLocations'
import {
  Search, MapPin, Briefcase, Globe, Sparkles, Building2, CheckCircle2,
  BookOpen, ArrowRight, Laptop, Filter, ChevronRight, Award, Zap, LocateFixed, Loader2
} from 'lucide-react'

export const CareersHome: React.FC = () => {
  const navigate = useNavigate()
  const { jobs, guides, fetchJobs, fetchGuides } = useCareersStore()

  // Search & Filter state
  const [keyword, setKeyword] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false)
  const [isWfhOnly, setIsWfhOnly] = useState(false)
  const [detectingGps, setDetectingGps] = useState(false)
  const [gpsMessage, setGpsMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchJobs()
    fetchGuides()
    document.title = 'Careers & Job Vacancies Vault | SpringWeb Solutions'
  }, [])

  const handleDetectGps = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!navigator.geolocation) {
      setGpsMessage('GPS is not supported on this browser.')
      return
    }

    setDetectingGps(true)
    setGpsMessage(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          const data = await res.json()
          const detectedCity = data.city || data.locality || data.principalSubdivision || 'Tamil Nadu'
          setSelectedLocation(detectedCity)
          setGpsMessage(`Location detected: ${detectedCity}`)
          setTimeout(() => setGpsMessage(null), 3000)
        } catch (err) {
          setGpsMessage('Could not reverse geocode location. Please type manually.')
        } finally {
          setDetectingGps(false)
        }
      },
      (error) => {
        setDetectingGps(false)
        setGpsMessage('GPS permission denied or unavailable.')
        setTimeout(() => setGpsMessage(null), 3000)
      },
      { timeout: 10000, maximumAge: 60000 }
    )
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const queryParams = new URLSearchParams()
    if (keyword) queryParams.set('q', keyword)
    if (selectedLocation && selectedLocation !== 'all') queryParams.set('loc', selectedLocation)
    if (isWfhOnly) queryParams.set('wfh', 'true')
    navigate(`/jobs?${queryParams.toString()}`)
  }

  // Filter jobs for featured grid
  const activeJobs = jobs.filter(j => j.status === 'active')
  const featuredJobs = activeJobs.filter(j => j.featured).slice(0, 6)
  const publishedGuides = guides.filter(g => g.status === 'published').slice(0, 3)

  // Geographical Location Matrix (All-India, Tamil Nadu Statewide, Metros & Remote)
  const locations = [
    { name: 'All-India National Openings', query: 'India', count: activeJobs.filter(j => j.location_country === 'India').length, badge: 'Pan-India' },
    { name: 'Tamil Nadu Statewide', query: 'Tamil Nadu', count: activeJobs.filter(j => j.location_state === 'Tamil Nadu' || j.location_city === 'Chennai' || j.location_city === 'Coimbatore' || j.location_city === 'Udumalpet' || j.location_city === 'Tiruppur').length, badge: 'Statewide' },
    { name: 'Remote / Work From Home', query: 'WFH', count: activeJobs.filter(j => j.is_wfh || j.is_remote).length, badge: '100% WFH' },
    { name: 'Bengaluru & Tech Metros', query: 'Bengaluru', count: activeJobs.filter(j => j.location_city === 'Bengaluru' || j.location_state === 'Karnataka' || j.location_city === 'Hyderabad').length, badge: 'Tech Metros' },
    { name: 'International & Global', query: 'International', count: activeJobs.filter(j => j.location_country !== 'India' || j.is_remote).length, badge: 'Worldwide' }
  ]

  const nicheCategories = [
    { name: 'Software & Web Engineering', icon: Laptop, color: 'emerald' },
    { name: 'Mobile App Development (Android/iOS)', icon: Briefcase, color: 'blue' },
    { name: 'Windows Desktop Software', icon: Building2, color: 'indigo' },
    { name: 'Technical SEO & Digital Growth', icon: Zap, color: 'purple' },
    { name: 'Business Automation & Data', icon: Award, color: 'teal' }
  ]

  return (
    <div className="min-h-screen bg-[#040509] text-white flex flex-col font-sans transition-colors duration-300">
      <CareersSeo />
      <CareersNavbar />

      <main className="flex-grow">
        
        {/* Header Leaderboard Ad Banner Zone */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          <AdBanner zoneId="header_leaderboard" />
        </div>

        {/* Hero Section */}
        <section className="py-16 md:py-24 relative z-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
            
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest font-display">
                <Sparkles size={14} /> Global &amp; All-India Careers Engine
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight font-display uppercase leading-tight">
                Discover Career Vacancies Across <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                  All-India, Tamil Nadu &amp; Global Remote
                </span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto font-light leading-relaxed">
                Search active openings across All-India metros (Bengaluru, Chennai, Hyderabad, Mumbai, Delhi), Tamil Nadu statewide regions, and high-paying International Remote/WFH contracts.
              </p>
            </div>

            {/* Main Search Bar Card - Overflow Visible to allow Dropdown Floating */}
            <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto p-4 sm:p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-2xl relative z-40 overflow-visible">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                
                {/* Keyword Search Input */}
                <div className="md:col-span-5 relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Job title, skills (e.g. React, Kotlin, C#, SEO)..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Location Filter: Open LinkedIn/Indeed Style Search with GPS */}
                <div className="md:col-span-4 relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none z-10">
                    <MapPin size={18} className="text-emerald-400" />
                  </span>
                  <input
                    type="text"
                    value={selectedLocation === 'all' ? '' : selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    onFocus={() => setLocationDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setLocationDropdownOpen(false), 200)}
                    placeholder="City, state, country or 'Remote'..."
                    className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                  />

                  {/* GPS Target Button inside Input */}
                  <button
                    type="button"
                    onClick={handleDetectGps}
                    title="Detect My Current GPS Location"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer z-10"
                  >
                    {detectingGps ? (
                      <Loader2 size={16} className="animate-spin text-emerald-400" />
                    ) : (
                      <LocateFixed size={16} className="hover:scale-110 transition-transform" />
                    )}
                  </button>

                  {/* Dynamic Real-Time Location Autocomplete Dropdown */}
                  {locationDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 sm:min-w-[340px] mt-2 p-2 rounded-2xl bg-[#0b0f1a] border border-emerald-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-50 space-y-1 backdrop-blur-2xl max-h-72 overflow-y-auto">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border-b border-white/5 mb-1 flex items-center justify-between">
                        <span>{selectedLocation && selectedLocation !== 'all' ? 'Matching Cities & States' : 'Popular Cities & Regions'}</span>
                        <span className="text-[9px] text-slate-400 font-mono">India &amp; Global</span>
                      </div>

                      {/* GPS Detection Button inside Dropdown */}
                      <button
                        type="button"
                        onMouseDown={handleDetectGps}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all flex items-center justify-between cursor-pointer border border-emerald-500/30"
                      >
                        <div className="flex items-center gap-2">
                          {detectingGps ? <Loader2 size={13} className="animate-spin" /> : <LocateFixed size={13} />}
                          <span>Detect My Current GPS Location</span>
                        </div>
                        <span className="text-[9px] font-mono uppercase bg-emerald-500/20 px-1.5 py-0.5 rounded">GPS</span>
                      </button>
                      
                      {/* Option for All Locations */}
                      <button
                        type="button"
                        onMouseDown={() => { setSelectedLocation('all'); setLocationDropdownOpen(false) }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-between cursor-pointer border border-white/5"
                      >
                        <span>All Locations (Global &amp; Pan-India)</span>
                        <span className="text-[10px] font-mono">Reset</span>
                      </button>

                      {(
                        selectedLocation && selectedLocation !== 'all'
                          ? POPULAR_INDIA_LOCATIONS.filter(loc => 
                              loc.name.toLowerCase().includes(selectedLocation.toLowerCase()) || 
                              loc.state.toLowerCase().includes(selectedLocation.toLowerCase())
                            )
                          : POPULAR_INDIA_LOCATIONS
                      ).slice(0, 16).map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={() => { setSelectedLocation(item.name.replace(/ \(.*\)/, '')); setLocationDropdownOpen(false) }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/30 border border-transparent transition-all flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-emerald-400 flex-shrink-0" />
                            <span className="font-medium text-white">{item.name}</span>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                            {item.state}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Search Button */}
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Search Jobs</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

              </div>

              {/* Quick Filter Toggles & GPS Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-white/5 text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={isWfhOnly}
                    onChange={(e) => setIsWfhOnly(e.target.checked)}
                    className="h-4 w-4 rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Work From Home (WFH) &amp; 100% Remote Only</span>
                </label>

                <div className="flex items-center gap-3">
                  {gpsMessage && (
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                      <LocateFixed size={12} /> {gpsMessage}
                    </span>
                  )}
                  <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>{activeJobs.length} Active Openings</span>
                  </div>
                </div>
              </div>

            </form>

          </div>
        </section>

        {/* Location Hierarchy Explorer Section */}
        <section className="py-12 border-y border-white/5 bg-[#060810]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-xl font-bold font-display text-white uppercase tracking-tight">
                Explore Vacancies by Region &amp; Location
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Find opportunities across Tamil Nadu, Pan-India Metros, or 100% Remote/WFH contracts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {locations.map((loc, idx) => (
                <Link
                  key={idx}
                  to={`/jobs?loc=${encodeURIComponent(loc.query)}`}
                  className="p-5 rounded-2xl bg-[#080b14] border border-white/10 hover:border-emerald-500/40 hover:-translate-y-1 transition-all group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <MapPin size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {loc.badge}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {loc.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {loc.count} Active Openings
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Practice Areas & Tech Stack Showcase Section */}
        <section className="py-16 bg-gradient-to-b from-[#060810] to-[#040509]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-display">
                Engineering &amp; Technology Domains
              </div>
              <h2 className="text-3xl font-extrabold font-display text-white uppercase">
                Active Hiring Practice Areas
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Discover vacancies across specialized tech stacks with verified employer logo tags.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group p-8 rounded-3xl bg-[#080b14] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 flex items-center justify-center text-emerald-400">
                    <Laptop size={24} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase font-mono">
                    React &amp; Node
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white font-display group-hover:text-emerald-400 transition-colors">
                    Full-Stack Web Engineering
                  </h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Enterprise SaaS platforms, React/Next.js frontends, Node.js REST microservices, and cloud databases.
                  </p>
                  <div className="pt-2">
                    <Link to="/jobs?q=Software" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                      <span>Explore Web Engineering Roles</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="group p-8 rounded-3xl bg-[#080b14] border border-white/10 hover:border-blue-500/40 transition-all duration-300 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 p-2.5 flex items-center justify-center text-blue-400">
                    <Briefcase size={24} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase font-mono">
                    Kotlin &amp; Flutter
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white font-display group-hover:text-blue-400 transition-colors">
                    Mobile App Development
                  </h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Native Kotlin Android apps, iOS Swift mobile clients, and cross-platform Flutter applications.
                  </p>
                  <div className="pt-2">
                    <Link to="/jobs?q=Android" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      <span>Explore Mobile Developer Roles</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="group p-8 rounded-3xl bg-[#080b14] border border-white/10 hover:border-purple-500/40 transition-all duration-300 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 p-2.5 flex items-center justify-center text-purple-400">
                    <Building2 size={24} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase font-mono">
                    .NET &amp; SEO
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white font-display group-hover:text-purple-400 transition-colors">
                    Desktop &amp; Growth Engineering
                  </h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    C# .NET WPF desktop applications, automated POS solutions, technical SEO, and analytics suites.
                  </p>
                  <div className="pt-2">
                    <Link to="/jobs?q=Desktop" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                      <span>Explore Desktop &amp; SEO Roles</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-display mb-1">
                  Verified Opportunities
                </div>
                <h2 className="text-3xl font-extrabold font-display text-white uppercase">
                  Featured Job Openings
                </h2>
              </div>
              <Link to="/jobs" className="btn-secondary text-xs flex items-center gap-1.5">
                <span>View All {activeJobs.length} Jobs</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 rounded-3xl bg-[#080b14] border border-white/10 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 space-y-5 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 p-1.5 flex items-center justify-center font-bold text-emerald-400 shrink-0">
                          {job.company_logo ? (
                            <img src={job.company_logo} alt={job.company_name} className="h-full w-full object-contain" />
                          ) : (
                            job.company_name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="text-xs text-slate-400 font-medium">{job.company_name}</div>
                          <h3 className="text-lg font-bold text-white font-display group-hover:text-emerald-400 transition-colors">
                            {job.title}
                          </h3>
                        </div>
                      </div>
                      
                      {job.is_wfh && (
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                          <Laptop size={11} /> WFH / Remote
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light">
                      {job.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-emerald-400" />
                        <span>{job.location_city}, {job.location_country}</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-400">
                        {job.salary_range}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-white/5 text-[11px] text-slate-300 border border-white/10">
                        {job.job_type}
                      </span>

                      <Link
                        to={`/jobs/${job.slug}`}
                        className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <span>Apply &amp; Details</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* In-Feed Ad Banner Zone */}
            <AdBanner zoneId="in_feed_banner" />

          </div>
        </section>

        {/* Educational Career Guides Section */}
        <section className="py-20 bg-[#060810] border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-display mb-1">
                  Skill Building &amp; Exam Roadmaps
                </div>
                <h2 className="text-3xl font-extrabold font-display text-white uppercase">
                  Educational Career Guides
                </h2>
              </div>
              <Link to="/career-guides" className="btn-secondary text-xs flex items-center gap-1.5">
                <span>View All Articles</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {publishedGuides.map((guide) => (
                <Link
                  key={guide.id}
                  to={`/career-guides/${guide.slug}`}
                  className="rounded-3xl bg-[#080b14] border border-white/10 hover:border-emerald-500/40 hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div className="p-6 space-y-4">
                    <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider w-max">
                      {guide.category}
                    </div>
                    <h3 className="text-lg font-bold text-white font-display group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed line-clamp-3">
                      {guide.excerpt}
                    </p>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between text-xs text-slate-500 border-t border-white/5 mt-4">
                    <span>By {guide.author}</span>
                    <span className="text-emerald-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Read Guide</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>

      </main>

      <CareersFooter />
    </div>
  )
}
