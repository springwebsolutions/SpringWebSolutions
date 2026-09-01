import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import SEOHead from '@/components/seo/SEOHead'
import AnimatedBackground from '@/components/ui/AnimatedBackground'
import { 
  Palette, PenTool, Layers, CheckCircle2, ArrowRight, Sparkles, 
  MapPin, MessageSquare, HelpCircle, Eye, Image, FileText, Check
} from 'lucide-react'

export const GraphicDesignLogoDesign: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': 'Graphic Design, Logo Design & Brand Identity in Udumalpet',
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
    'description': 'Professional logo design, brand identity systems, vector branding, business cards, brochures, and UI/UX design in Udumalpet and Tamil Nadu.'
  }

  const packages = [
    {
      name: 'Essential Brand Identity',
      price: '₹4,999',
      period: '/one-time',
      desc: 'Ideal for new startups, retail shops, and local business launches in Udumalpet.',
      features: [
        '3 Unique Vector Logo Concepts',
        'High-Res Vector Source Files (AI, SVG, EPS, PNG, PDF)',
        'Full Commercial Copyright Ownership',
        'Business Card & Letterhead Design',
        'Color Palette & Font Guidelines',
        'Social Media Profile & Cover Package'
      ],
      popular: false,
      cta: 'Order Logo Package'
    },
    {
      name: 'Corporate Branding Suite',
      price: '₹11,999',
      period: '/one-time',
      desc: 'Complete identity overhaul for established companies, hospitals, and textile brands.',
      features: [
        '5 Premium Logo Concepts with 3D Mockups',
        'Complete Brand Style Guide (Typography, Spacing, Usage)',
        'Stationery Design (Invoice, Letterhead, Envelopes)',
        'Marketing Brochure / Pamphlet Vector Design',
        'Product Packaging & Label Design Templates',
        'Unlimited Revision Rounds Until 100% Satisfied'
      ],
      popular: true,
      cta: 'Build Full Brand'
    },
    {
      name: 'Full UI/UX & Digital Brand',
      price: '₹24,999',
      period: '/one-time',
      desc: 'End-to-end design system for web platforms, mobile apps, and SaaS interfaces.',
      features: [
        'Custom Figma Design System & Component Library',
        'Full Website / Mobile App UI/UX Mockups',
        'Interactive Clickable Prototype',
        'Custom Vector Icons & Illustrations',
        'Developer-Ready Hand-off Specifications',
        '1-on-1 Design Consultation with Lead UI Designer'
      ],
      popular: false,
      cta: 'Design UI/UX System'
    }
  ]

  const faqs = [
    {
      q: 'Will I get the original source vector files for printing?',
      a: 'Yes! We deliver all industry-standard vector files including Adobe Illustrator (.AI), SVG, EPS, High-Res PNG (Transparent Background), and Print-Ready CMYK PDF files.'
    },
    {
      q: 'Do I own 100% copyright of the designed logo?',
      a: 'Absolutely. Upon project completion and handover, 100% intellectual property and copyright ownership is transferred directly to your company.'
    },
    {
      q: 'How long does a logo design project take?',
      a: 'Initial logo concepts are delivered within 3 to 5 business days. Once you select your favorite concept, revisions and final file export packages are completed within 48 hours.'
    },
    {
      q: 'Can you redesign our existing old logo while keeping brand recognition?',
      a: 'Yes! We frequently modernize legacy logos into clean, high-performance vector graphics that look sharp on modern 4K displays and billboards while honoring your brand history.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#040509] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-300">
      <SEOHead
        title="Graphic Design & Logo Design Company in Udumalpet (Udumalaipettai)"
        description="#1 Graphic Design & Logo Creation Company in Udumalpet (Udumalaipettai), Pollachi, Tiruppur. Modern Vector Logos, Brand Identity, Brochures & UI/UX Design."
        canonical="/graphic-design-logo-design"
        keywords="graphic design udumalpet, logo design udumalaipettai, brand identity pollachi, brochure design tiruppur, ui ux design company udumalpet, vector logo design tamil nadu"
        schema={schema}
      />

      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative overflow-hidden">
        <AnimatedBackground accent="indigo" particleCount={18} beams />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">

          {/* ── Hero Header ────────────────────────────────────────────── */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider font-display">
              <Sparkles size={13} /> Creative Branding &amp; Graphic Design in Udumalpet
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-tight">
              Distinguish Your Brand with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400">
                Iconic Graphic &amp; Logo Design
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
              We craft memorable vector logos, cohesive visual identity guidelines, marketing collateral, and UI/UX systems for enterprises in <strong>Udumalpet (Udumalaipettai)</strong>, Pollachi, Tiruppur, and Coimbatore.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href="https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20am%20interested%20in%20Logo%20Design%20and%20Graphic%20Design%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                <span>Discuss Logo on WhatsApp</span>
              </a>

              <Link
                to="/portfolio"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>View Design Portfolio</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* ── Core Design Services ────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-md space-y-4 hover:border-indigo-500/40 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <PenTool size={24} />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Logo &amp; Brand Identity</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Timeless vector logos engineered for digital screens, embroidery, signboards, and business cards with mathematical symmetry.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-indigo-400" /> Vector SVG, AI, EPS master files</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-indigo-400" /> 100% original conceptual designs</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-indigo-400" /> Brand typography &amp; color palettes</li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-md space-y-4 hover:border-purple-500/40 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Palette size={24} />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Marketing &amp; Print Collateral</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                High-resolution brochures, flyers, social media carousels, packaging boxes, and exhibition banners ready for offset print.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-purple-400" /> Print-ready CMYK 300 DPI exports</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-purple-400" /> Social media poster bundles</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-purple-400" /> Product packaging &amp; label designs</li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-md space-y-4 hover:border-emerald-500/40 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-bold text-white font-display">UI/UX &amp; Digital Interfaces</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Modern mobile app screens, web application wireframes, and SaaS design systems in Figma that convert users into paying customers.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Interactive Figma prototypes</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Mobile-first responsive grids</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Design-to-code design tokens</li>
              </ul>
            </div>
          </div>

          {/* ── Transparent Packages ─────────────────────────────────────── */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-bold text-white font-display">Design Packages</h2>
              <p className="text-xs sm:text-sm text-slate-400">Fixed upfront pricing with complete source files included.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {packages.map((pkg, i) => (
                <div 
                  key={i} 
                  className={`p-8 rounded-3xl border transition-all flex flex-col justify-between space-y-6 ${
                    pkg.popular 
                      ? 'border-indigo-500/50 bg-gradient-to-b from-indigo-950/40 to-slate-900/60 shadow-2xl shadow-indigo-500/10 relative' 
                      : 'border-white/10 bg-slate-900/30'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-extrabold uppercase tracking-widest">
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
                          <CheckCircle2 size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/918012622119?text=Hello%20SpringWeb%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20graphic%20design%20package.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      pkg.popular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
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
              <p className="text-xs text-slate-400">Common questions regarding graphic design and logo creation.</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-2xl border border-white/10 bg-slate-900/30 space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle size={15} className="text-indigo-400 shrink-0" />
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

export default GraphicDesignLogoDesign
