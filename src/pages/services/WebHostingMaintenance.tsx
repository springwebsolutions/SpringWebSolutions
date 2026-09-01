import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import SEOHead from '@/components/seo/SEOHead'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import { 
  Server, ShieldCheck, Cpu, HardDrive, RefreshCw, CheckCircle2, 
  ArrowRight, Zap, Sparkles, MapPin, MessageSquare, HelpCircle, Lock, Cloud
} from 'lucide-react'

export const WebHostingMaintenance: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': 'Website Hosting, Cloud Servers & AMC Maintenance Services in Udumalpet',
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Spring Web Solutions',
      'telephone': '+91-80126-22119',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Udumalpet',
        'addressRegion': 'Tamil Nadu',
        'postalCode': '642126',
        'addressCountry': 'IN'
      }
    },
    'areaServed': ['Udumalpet', 'Udumalaipettai', 'Pollachi', 'Tiruppur', 'Coimbatore', 'Tamil Nadu'],
    'description': 'Managed high-speed cloud web hosting, annual website maintenance contracts (AMC), 24/7 uptime monitoring, automated backups, and SSL security for businesses in Udumalpet and Tamil Nadu.'
  }

  const packages = [
    {
      name: 'Starter Hosting & Security',
      price: '₹3,999',
      period: '/year',
      desc: 'High-speed cloud hosting with SSL and daily backups for small business websites.',
      features: [
        'NVMe High-Speed SSD Storage (10 GB)',
        'Free Automated SSL Certificate (HTTPS)',
        'Global Cloudflare CDN Edge Caching',
        'Automated Daily Offsite Backups',
        '99.9% Uptime Guarantee SLA',
        'Business Email Accounts (5 Inboxes)'
      ],
      popular: false,
      cta: 'Choose Hosting Plan'
    },
    {
      name: 'Full AMC & Maintenance Pro',
      price: '₹14,999',
      period: '/year',
      desc: 'Complete worry-free Annual Maintenance Contract (AMC) for corporate & e-commerce sites.',
      features: [
        'Everything in Starter Hosting included',
        'Monthly Content, Text & Image Updates (Up to 5 hrs/mo)',
        'Weekly Security Patching & Plugin Audits',
        'Continuous Speed Optimization (<1s load)',
        'Priority 2-Hour Emergency Support SLA',
        'Quarterly SEO & Health Checkup Reports'
      ],
      popular: true,
      cta: 'Start Annual AMC'
    },
    {
      name: 'Enterprise Dedicated Cloud',
      price: '₹29,999',
      period: '/year',
      desc: 'High-concurrency cloud infrastructure for ERP platforms, SaaS, and heavy traffic portals.',
      features: [
        'Dedicated Cloud CPU & RAM Allocation',
        'DDoS Shield & Web Application Firewall (WAF)',
        'Custom Database Clustering & PostgreSQL Optimization',
        'Zero-Downtime Blue/Green Deployments',
        '24/7 Server Monitoring with SMS/Call Alerts',
        'Dedicated Senior DevOps Engineer Support'
      ],
      popular: false,
      cta: 'Deploy Enterprise Cloud'
    }
  ]

  const faqs = [
    {
      q: 'What is included in your Annual Website Maintenance Contract (AMC)?',
      a: 'Our AMC includes proactive security patches, core software updates, routine content updates (banners, blogs, pricing changes), speed tuning, daily automated backups, and priority bug resolution within guaranteed SLA windows.'
    },
    {
      q: 'Will my website experience downtime during hosting migration?',
      a: 'Zero downtime. We perform staged DNS switches and test complete mirror environments before switching live traffic to ensure uninterrupted access for your customers.'
    },
    {
      q: 'Do you provide business email hosting (@mycompany.in)?',
      a: 'Yes! We configure enterprise business emails with SPF, DKIM, and DMARC DNS records to ensure 100% inbox delivery and zero spam filtering.'
    },
    {
      q: 'How fast is your cloud hosting compared to shared hosting providers?',
      a: 'Our cloud servers use enterprise NVMe SSD drives, HTTP/3, and Global Edge CDN caching, delivering page load speeds 3x to 5x faster than conventional shared hosting (under 1 second TTFB).'
    }
  ]

  return (
    <div className="min-h-screen bg-[#040509] text-slate-100 flex flex-col selection:bg-teal-500/30 selection:text-teal-300">
      <SEOHead
        title="Web Hosting & Annual Website Maintenance (AMC) in Udumalpet"
        description="#1 Cloud Web Hosting & Website Maintenance AMC Company in Udumalpet (Udumalaipettai), Pollachi, Tiruppur. 99.9% Uptime, Daily Backups, SSL & 24/7 Security."
        canonical="/web-hosting-maintenance"
        keywords="web hosting udumalpet, website maintenance amc udumalaipettai, cloud servers pollachi, website support tiruppur, website amc tamil nadu, ssl certificate hosting udumalpet"
        schema={schema}
      />

      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative overflow-hidden">
        <AnimatedBackground accent="emerald" particleCount={18} beams />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">

          {/* ── Hero Header ────────────────────────────────────────────── */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider font-display">
              <Server size={13} /> Cloud Hosting &amp; AMC Maintenance in Udumalpet
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-tight">
              Ultra-Fast Cloud Hosting &amp;{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-300 to-indigo-400">
                Worry-Free Website AMC
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
              Keep your digital infrastructure fast, secure, and always online with 99.9% uptime SLA, daily automated backups, and dedicated maintenance engineers in <strong>Udumalpet (Udumalaipettai)</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20am%20interested%20in%20Website%20Hosting%20and%20AMC%20Maintenance%20plans."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                <span>Inquire AMC on WhatsApp</span>
              </a>

              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>Free Hosting Migration</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* ── Key Hosting & AMC Highlights ────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-md space-y-4 hover:border-teal-500/40 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Sub-Second Load Speeds</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Powered by enterprise NVMe SSD cloud instances and Global CDN edge caching. Faster load times directly improve your Google rankings.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-teal-400" /> HTTP/3 &amp; Brotli compression</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-teal-400" /> Free SSL (HTTPS) certificate</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-teal-400" /> 99.9% uptime SLA guarantee</li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-md space-y-4 hover:border-emerald-500/40 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <RefreshCw size={24} />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Annual Maintenance (AMC)</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Never worry about broken links, outdated content, or security exploits. Our team updates your site regularly without manual hassle.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Monthly text &amp; banner updates</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Security audits &amp; core patching</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Fast 2-hour bug fix turnaround</li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-md space-y-4 hover:border-indigo-500/40 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-white font-display">DDoS &amp; Daily Backups</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Automated daily off-site cloud snapshots protect your data against corruption, accidental deletes, or server outages.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-indigo-400" /> 30-day snapshot restore points</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-indigo-400" /> Web Application Firewall (WAF)</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-indigo-400" /> 1-Click instant disaster recovery</li>
              </ul>
            </div>
          </div>

          {/* ── Transparent Packages ─────────────────────────────────────── */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-bold text-white font-display">Hosting &amp; Maintenance Plans</h2>
              <p className="text-xs sm:text-sm text-slate-400">Straightforward annual pricing with complete server management included.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {packages.map((pkg, i) => (
                <div 
                  key={i} 
                  className={`p-8 rounded-3xl border transition-all flex flex-col justify-between space-y-6 ${
                    pkg.popular 
                      ? 'border-teal-500/50 bg-gradient-to-b from-teal-950/40 to-slate-900/60 shadow-2xl shadow-teal-500/10 relative' 
                      : 'border-white/10 bg-slate-900/30'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest">
                      Most Recommended
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">{pkg.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{pkg.desc}</p>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white font-display">{pkg.price}</span>
                      <span className="text-xs text-slate-400">{pkg.period}</span>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-white/10">
                      {pkg.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 size={14} className="text-teal-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20hosting%20and%20maintenance%20plan.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      pkg.popular
                        ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20'
                        : 'bg-white/10 hover:bg-white/15 text-white'
                    }`}
                  >
                    <span>{pkg.cta}</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ Section ──────────────────────────────────────────────── */}
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white font-display">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-400">Everything you need to know about cloud web hosting and maintenance.</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-2xl border border-white/10 bg-slate-900/30 space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle size={15} className="text-teal-400 shrink-0" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default WebHostingMaintenance
