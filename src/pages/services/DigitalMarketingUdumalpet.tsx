import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import SEOHead from '@/components/seo/SEOHead'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import { 
  TrendingUp, Target, Search, BarChart3, MessageSquare, CheckCircle2, 
  ArrowRight, Zap, Sparkles, MapPin, Phone, HelpCircle, Award, Users, Globe
} from 'lucide-react'

export const DigitalMarketingUdumalpet: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': 'Digital Marketing & Google Ads in Udumalpet (Udumalaipettai)',
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
    'description': 'ROI-driven digital marketing, Google Ads PPC management, Meta & Instagram Ads, local SEO, and conversion optimization for businesses in Udumalpet and Tamil Nadu.'
  }

  const packages = [
    {
      name: 'Local Business Booster',
      price: '₹9,999',
      period: '/month',
      desc: 'Ideal for local clinics, retail showrooms, schools, and restaurants in Udumalpet & Pollachi.',
      features: [
        'Google Business Profile (GMB) Optimization',
        'Top 3 Local Map Pack Ranking Strategy',
        'Google Search Ads (Targeted Radius)',
        'Local Keyword SEO & Content Setup',
        'Monthly Transparent Analytics Report',
        'WhatsApp Lead Capture Integration'
      ],
      popular: false,
      cta: 'Start Local Campaign'
    },
    {
      name: 'Regional Growth & Ads',
      price: '₹19,999',
      period: '/month',
      desc: 'High-growth performance marketing for textile mills, manufacturers, and multi-branch brands.',
      features: [
        'Google Search & Display Network Ads',
        'Meta (Instagram & Facebook) Retargeting Ads',
        'High-Converting Landing Page Design',
        'Conversion Tracking & Pixel Setup',
        'A/B Creative & Copy Testing',
        'Bi-Weekly Strategy & ROI Optimization'
      ],
      popular: true,
      cta: 'Scale Your Leads'
    },
    {
      name: 'Enterprise Market Dominance',
      price: '₹34,999',
      period: '/month',
      desc: 'Comprehensive multi-channel marketing, technical SEO, and automated lead nurturing systems.',
      features: [
        'Full-Funnel Omnichannel Ads Management',
        'National & International Target Campaigns',
        'CRM & Automated WhatsApp Follow-ups',
        'Advanced Technical SEO & Link Building',
        'Dedicated Campaign Manager & Weekly Calls',
        'Custom ROI & Attribution Dashboard'
      ],
      popular: false,
      cta: 'Book Strategy Call'
    }
  ]

  const faqs = [
    {
      q: 'Why should my Udumalpet business invest in local digital marketing?',
      a: 'Over 85% of customers in Udumalpet, Pollachi, and Tiruppur search on Google Maps and Google Search before visiting a clinic, showroom, or business. Target Google Ads and Local SEO put your phone number and location right in front of active buyers.'
    },
    {
      q: 'How fast will we see leads from Google & Instagram Ads?',
      a: 'Google Search Ads and Meta Ads campaigns typically begin generating phone calls and WhatsApp inquiries within 48 to 72 hours after launch.'
    },
    {
      q: 'Do you handle creative ad graphics and Tamil copy?',
      a: 'Yes! Our in-house creative team designs high-converting bilingual creatives (Tamil and English) tailored specifically to resonance with audiences in Western Tamil Nadu.'
    },
    {
      q: 'Is there a long-term lock-in contract?',
      a: 'No. We work on flexible monthly agreements because we believe in retaining clients through proven ROI, measurable sales, and verified leads.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#040509] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      <SEOHead
        title="Digital Marketing Agency in Udumalpet (Udumalaipettai) | Google & Meta Ads"
        description="#1 Digital Marketing Agency in Udumalpet (Udumalaipettai), Pollachi & Tiruppur. Google Ads, Meta Ads, Local SEO, and High-ROI Lead Generation. Get free consultation!"
        canonical="/digital-marketing-udumalpet"
        keywords="digital marketing udumalpet, google ads company udumalpet, meta ads udumalaipettai, seo agency udumalpet, local seo pollachi, lead generation tiruppur, digital marketing company tamil nadu"
        schema={schema}
      />

      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative overflow-hidden">
        <AnimatedBackground accent="emerald" particleCount={18} beams />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">

          {/* ── Hero Header ────────────────────────────────────────────── */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider font-display">
              <MapPin size={13} /> Targeted Digital Marketing in Udumalpet &amp; Tamil Nadu
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-tight">
              Get High-Intent Leads with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                Performance Marketing
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
              We engineer revenue-focused Google Ads, Meta Ad campaigns, and Local SEO strategies for businesses in <strong>Udumalpet (Udumalaipettai)</strong>, Pollachi, Tiruppur, and Coimbatore.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20am%20interested%20in%20Digital%20Marketing%20and%20Google%20Ads%20for%20my%20business."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                <span>Start WhatsApp Consultation</span>
              </a>

              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>Request Custom Proposal</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* ── Key Service Pillars ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-md space-y-4 hover:border-emerald-500/40 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Google Search &amp; Maps PPC</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Capture buyers at the exact moment they search for your services in Udumalpet. Maximum keyword relevance and minimal cost-per-click.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Negative keyword filtering</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Call-only campaigns</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Map pack location extensions</li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-md space-y-4 hover:border-indigo-500/40 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Meta (Facebook &amp; Instagram) Ads</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Hyper-targeted visual ads targeting age, demographics, local pincodes (642126, 642001), and buyer interests across Tamil Nadu.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-indigo-400" /> Tamil &amp; English video creatives</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-indigo-400" /> Direct WhatsApp message ads</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-indigo-400" /> Retargeting warm website visitors</li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-md space-y-4 hover:border-teal-500/40 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Local SEO &amp; GMB Dominance</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Rank organically on Google Search and Google Maps for high-volume local terms in Udumalpet, Udumalaipettai, and nearby taluks.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-teal-400" /> Google Business Profile ranking</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-teal-400" /> Schema &amp; Local citation building</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-teal-400" /> Review generation systems</li>
              </ul>
            </div>
          </div>

          {/* ── Transparent Pricing Packages ─────────────────────────────── */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-bold text-white font-display">Transparent Marketing Packages</h2>
              <p className="text-xs sm:text-sm text-slate-400">Clear pricing with zero hidden fees. Built specifically for local business ROI.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {packages.map((pkg, i) => (
                <div 
                  key={i} 
                  className={`p-8 rounded-3xl border transition-all flex flex-col justify-between space-y-6 ${
                    pkg.popular 
                      ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-950/40 to-slate-900/60 shadow-2xl shadow-emerald-500/10 relative' 
                      : 'border-white/10 bg-slate-900/30'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest">
                      Most Popular
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
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20package.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      pkg.popular
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
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
              <p className="text-xs text-slate-400">Everything you need to know about digital marketing in Udumalpet.</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-2xl border border-white/10 bg-slate-900/30 space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle size={15} className="text-emerald-400 shrink-0" />
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

export default DigitalMarketingUdumalpet
