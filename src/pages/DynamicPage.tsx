import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { usePageBuilderStore, type SectionData } from '@/stores/pageBuilderStore'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { SectionRenderer } from '@/components/dynamic/SectionRenderer'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ShieldAlert, Database, Terminal, ArrowRight, Loader2 } from 'lucide-react'
import SEOHead from '@/components/seo/SEOHead'

// Helper to guarantee section order and layout consistency
const ensureFullSections = (slug: string, fetchedSections: SectionData[]): SectionData[] => {
  let list = fetchedSections || []
  if (slug === 'plans' || slug === 'pricing') {
    list = list.filter(s => s.type !== 'hero')
  }
  return list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
}

export const DynamicPage: React.FC = () => {
  const location = useLocation()
  const path = location.pathname.replace('/', '')
  const pageSlug = path === '' ? 'home' : path
  
  const { 
    currentPage, 
    currentSections, 
    loading, 
    fetchPageData, 
    fetchPages,
    pages 
  } = usePageBuilderStore()

  const [hasSuperAdmin, setHasSuperAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchPageData(pageSlug)
      fetchPages()
    }
  }, [pageSlug])

  // ── Per-page SEO + AEO JSON-LD data ──────────────────────────────────────
  const getSeoData = () => {
    const BASE_ORG = {
      '@type': 'Organization',
      '@id': 'https://www.springwebsolutions.in/#organization',
      name: 'Spring Web Solutions',
      url: 'https://www.springwebsolutions.in',
      logo: 'https://www.springwebsolutions.in/logo-emblem.png',
      telephone: '+91-80126-22119',
      email: 'hello@springwebsolutions.in',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Udumalpet Main Road',
        addressLocality: 'Udumalpet',
        addressRegion: 'Tamil Nadu',
        postalCode: '642126',
        addressCountry: 'IN',
      },
      sameAs: [
        'https://github.com/springwebsolutions',
        'https://www.linkedin.com/company/springwebsolutions',
      ],
    }

    if (pageSlug === 'home') {
      return {
        title: 'Web Development Company in Udumalpet | Spring Web Solutions',
        description:
          '#1 Web Development Company in Udumalpet (Udumalaipettai), Tamil Nadu. Sub-second websites, mobile apps, custom ERP/CRM, digital marketing & automation. Free project quote!',
        keywords:
          'web development company in Udumalpet, website development Udumalaipettai, web designers Udumalpet, digital marketing Udumalpet, graphic design logo design Udumalpet, web hosting maintenance Udumalpet, website design Pollachi, software company Tiruppur, IT agency Coimbatore, web development company Tamil Nadu, ERP software Tamil Nadu, mobile app development Tamil Nadu, custom CRM development India, software agency India',
        canonical: 'https://www.springwebsolutions.in/',
        schema: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              ...BASE_ORG,
              '@type': ['SoftwareCompany', 'ProfessionalService', 'LocalBusiness'],
              description:
                'Spring Web Solutions is the #1 website development, digital marketing, graphic design, and custom software engineering agency in Udumalpet (Udumalaipettai), Tamil Nadu.',
              priceRange: '$$',
              areaServed: [
                { '@type': 'City', name: 'Udumalpet' },
                { '@type': 'City', name: 'Pollachi' },
                { '@type': 'City', name: 'Tiruppur' },
                { '@type': 'City', name: 'Coimbatore' },
                { '@type': 'AdministrativeArea', name: 'Tamil Nadu' },
                { '@type': 'Country', name: 'India' },
              ],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Spring Web Solutions Service Catalog',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    price: '24999',
                    priceCurrency: 'INR',
                    availability: 'https://schema.org/InStock',
                    priceValidUntil: '2027-12-31',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Starter Business Website Package',
                      description:
                        'High-performance responsive startup website with modern UI, mobile optimization, on-page SEO, and 1 month SLA support.',
                    },
                  },
                  {
                    '@type': 'Offer',
                    price: '49999',
                    priceCurrency: 'INR',
                    availability: 'https://schema.org/InStock',
                    priceValidUntil: '2027-12-31',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Professional Growth Software Platform',
                      description:
                        'Full-scale corporate platform with custom dynamic CMS, admin suite, blog, WhatsApp & Email automations, and 3 months priority SLA support.',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Enterprise SaaS, Custom ERP & CRM Software',
                      description:
                        'Bespoke SaaS platforms, custom ERP & CRM software, Supabase/Postgres infrastructure, role-based access, and custom API architecture.',
                    },
                  },
                ],
              },
            },
            {
              '@type': 'WebSite',
              '@id': 'https://www.springwebsolutions.in/#website',
              url: 'https://www.springwebsolutions.in',
              name: 'Spring Web Solutions',
              publisher: { '@id': 'https://www.springwebsolutions.in/#organization' },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://www.springwebsolutions.in/blog?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            },
            {
              '@type': 'FAQPage',
              '@id': 'https://www.springwebsolutions.in/#faq',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Which is the best web development company in Udumalpet?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Spring Web Solutions is the leading web development company in Udumalpet (Udumalaipettai), Tamil Nadu, delivering sub-second websites, mobile apps, custom ERP/CRM software, and digital marketing to local, national, and global clients.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What are the website development prices at Spring Web Solutions?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Spring Web Solutions offers transparent pricing: Starter Business Website at ₹24,999 INR, Professional Growth Platform at ₹49,999 INR, and bespoke Enterprise Software on custom quote. All packages include 100% source code ownership.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does Spring Web Solutions develop mobile apps and ERP/CRM software?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. Spring Web Solutions engineers native Android (Kotlin/Flutter) mobile apps, iOS apps, Windows desktop software (C# .NET), and fully custom ERP & CRM systems tailored for businesses in Udumalpet, Tamil Nadu, and globally.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What digital marketing services does Spring Web Solutions provide in Udumalpet?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Spring Web Solutions provides Google Ads (PPC), Meta/Instagram Ads, local SEO, Google Business Profile optimization, technical SEO, and conversion-focused landing page design for businesses in Udumalpet, Pollachi, Tiruppur, Coimbatore, and Tamil Nadu.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does Spring Web Solutions work with clients outside Udumalpet?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. While headquartered in Udumalpet, Spring Web Solutions serves clients across Tamil Nadu, pan-India, and internationally — including USA, UK, UAE, and global remote clients — via fully remote engineering delivery.',
                  },
                },
              ],
            },
          ],
        },
      }
    }

    if (pageSlug === 'about') {
      return {
        title: 'About Spring Web Solutions | Software Agency, Udumalpet Tamil Nadu',
        description:
          "Learn about Spring Web Solutions — Udumalpet's premier software engineering agency. Expert team building websites, mobile apps, ERP/CRM & automation for businesses across India.",
        keywords:
          'about Spring Web Solutions, software engineering agency Udumalpet, web development team Tamil Nadu, IT company Udumalaipettai, tech agency Coimbatore',
        canonical: 'https://www.springwebsolutions.in/about',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          '@id': 'https://www.springwebsolutions.in/about#webpage',
          url: 'https://www.springwebsolutions.in/about',
          name: 'About Spring Web Solutions — Software Engineering Agency, Udumalpet',
          description:
            'Spring Web Solutions is a software engineering agency based in Udumalpet, Tamil Nadu, delivering high-performance web development, mobile apps, ERP/CRM systems, and digital marketing to clients across India and globally.',
          isPartOf: { '@id': 'https://www.springwebsolutions.in/#website' },
          about: { '@id': 'https://www.springwebsolutions.in/#organization' },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.springwebsolutions.in/' },
              { '@type': 'ListItem', position: 2, name: 'About', item: 'https://www.springwebsolutions.in/about' },
            ],
          },
        },
      }
    }

    if (pageSlug === 'services') {
      return {
        title: 'Services — Web Dev, Mobile Apps, ERP/CRM | Spring Web Solutions',
        description:
          'Explore Spring Web Solutions services: custom web development, Android/iOS mobile apps, ERP & CRM software, digital marketing, automation bots & technical SEO. Get a free quote!',
        keywords:
          'web development services Udumalpet, mobile app development Tamil Nadu, ERP CRM software India, digital marketing services Udumalpet, automation bots Tamil Nadu, SEO services Coimbatore',
        canonical: 'https://www.springwebsolutions.in/services',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': 'https://www.springwebsolutions.in/services#webpage',
          url: 'https://www.springwebsolutions.in/services',
          name: 'Services — Spring Web Solutions',
          description:
            'Full-stack digital engineering services: web development, mobile apps, ERP/CRM software, digital marketing, and workflow automation from Udumalpet, Tamil Nadu.',
          isPartOf: { '@id': 'https://www.springwebsolutions.in/#website' },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.springwebsolutions.in/' },
              { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.springwebsolutions.in/services' },
            ],
          },
        },
      }
    }

    if (pageSlug === 'plans' || pageSlug === 'pricing') {
      return {
        title: 'Pricing Plans — Website & Software Packages | Spring Web Solutions',
        description:
          'Transparent pricing for web development, ERP/CRM software, and mobile apps by Spring Web Solutions Udumalpet. Starter ₹24,999 · Pro ₹49,999 · Enterprise custom quote.',
        keywords:
          'web development price Udumalpet, website cost India, ERP software price Tamil Nadu, website package pricing Spring Web Solutions, affordable web development Udumalpet',
        canonical: 'https://www.springwebsolutions.in/plans',
        schema: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebPage',
              '@id': 'https://www.springwebsolutions.in/plans#webpage',
              url: 'https://www.springwebsolutions.in/plans',
              name: 'Pricing Plans — Spring Web Solutions',
              description:
                'Transparent one-time investment packages for web development, mobile apps, and ERP/CRM software by Spring Web Solutions, Udumalpet.',
              breadcrumb: {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.springwebsolutions.in/' },
                  { '@type': 'ListItem', position: 2, name: 'Pricing Plans', item: 'https://www.springwebsolutions.in/plans' },
                ],
              },
            },
            {
              '@type': 'PriceSpecification',
              name: 'Starter Business Website',
              price: '24999',
              priceCurrency: 'INR',
              description: 'High-performance responsive startup & local business website with on-page SEO and 1 month SLA support.',
            },
            {
              '@type': 'PriceSpecification',
              name: 'Professional Growth Platform',
              price: '49999',
              priceCurrency: 'INR',
              description: 'Full-scale corporate platform with dynamic CMS, admin suite, blog, API automations, and 3 months priority SLA support.',
            },
            {
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What does the ₹24,999 Starter website package include?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The Starter package includes a high-speed responsive website, mobile optimization, on-page SEO, JSON-LD structured data, 100% source code ownership, and 1 month of SLA support.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What does the ₹49,999 Professional platform include?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The Professional package includes everything in Starter plus a dynamic CMS, admin suite, blog system, WhatsApp & email automations, speed tuning, and 3 months priority support.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does Spring Web Solutions charge recurring monthly fees?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No. All packages are one-time investments with 100% full source code and database ownership. There are no recurring platform lock-in fees.',
                  },
                },
              ],
            },
          ],
        },
      }
    }

    // Generic fallback with page-level breadcrumb schema
    const pageTitle = currentPage?.title
      ? `${currentPage.title} | Spring Web Solutions`
      : 'Spring Web Solutions | Digital Engineering Agency'
    return {
      title: pageTitle,
      description:
        'Spring Web Solutions builds high-performance web applications, ERP/CRM software, and mobile apps from Udumalpet, Tamil Nadu. Contact us to start your project!',
      canonical: `https://www.springwebsolutions.in/${pageSlug}`,
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url: `https://www.springwebsolutions.in/${pageSlug}`,
        name: pageTitle,
        isPartOf: { '@id': 'https://www.springwebsolutions.in/#website' },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.springwebsolutions.in/' },
            { '@type': 'ListItem', position: 2, name: currentPage?.title || pageSlug, item: `https://www.springwebsolutions.in/${pageSlug}` },
          ],
        },
      },
    }
  }

  const seoData = getSeoData()

  useEffect(() => {
    if (!loading) {
      const targetSectionId = window.location.hash.replace('#', '')
      if (targetSectionId) {
        setTimeout(() => {
          const targetEl = document.getElementById(targetSectionId)
          if (targetEl) {
            const navOffset = 70
            const elementPosition = targetEl.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - navOffset
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
          }
        }, 200)
      }
    }
  }, [loading, pageSlug])

  // Render Supabase Connection Guide if credentials are missing
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-brand-light dark:bg-brand-obsidian text-slate-800 dark:text-slate-200 flex flex-col justify-between transition-colors duration-300">
        <header className="h-16 border-b border-grid flex items-center justify-between px-8 bg-[#FDFBF7]/80 dark:bg-[#121110]/80 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="h-7 w-7 rounded-full border border-brand-emerald flex items-center justify-center font-display font-medium text-brand-emerald text-sm">s</span>
            <span className="font-display text-xl font-normal text-slate-900 dark:text-white lowercase">Spring Web Solutions</span>
          </div>
        </header>

        <main className="flex-grow max-w-3xl mx-auto px-6 py-12 flex flex-col justify-center space-y-8">
          <div className="p-8 rounded-none border border-grid bg-brand-sand dark:bg-brand-dark space-y-6 text-center">
            <div className="h-12 w-12 mx-auto rounded-full border border-brand-emerald flex items-center justify-center text-brand-emerald">
              <Database size={20} />
            </div>
            
            <h1 className="text-3xl font-normal text-slate-900 dark:text-white font-display lowercase leading-tight">
              database configuration <span className="italic-accent">required</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xl mx-auto font-sans font-light">
              Spring Web Solutions has been scaffolded successfully! To boot up the dynamic CMS, blog, marketplace, CRM, and admin panel, link it to your Supabase PostgreSQL instance.
            </p>
          </div>
        </main>

        <footer className="h-16 border-t border-grid flex items-center justify-center text-xs text-slate-500 font-sans font-light lowercase">
          <p>© {new Date().getFullYear()} spring web solutions. all rights reserved.</p>
        </footer>
      </div>
    )
  }

  const activeSections = ensureFullSections(pageSlug, currentSections)

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-obsidian flex flex-col transition-colors duration-300">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={(seoData as any).keywords}
        canonical={(seoData as any).canonical}
        schema={(seoData as any).schema}
      />
      <Navbar />
      
      {/* Dynamic compiler compiling the dynamic layout grid sections */}
      <main id="main-content" className="flex-grow flex flex-col">
        {loading || (currentPage && currentPage.slug !== pageSlug) ? (
          <div className="flex-grow flex items-center justify-center text-brand-emerald min-h-[300px] py-20">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : currentPage?.is_published === false ? (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-800 dark:text-slate-200 px-4 py-16">
            <div className="p-8 sm:p-12 rounded-3xl border border-rose-500/20 glass-panel text-center max-w-lg space-y-6 bg-brand-sand dark:bg-brand-dark shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
                <ShieldAlert size={36} />
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest font-mono text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                  Page Disabled
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
                  Page Under Maintenance
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-sans font-light leading-relaxed">
                  The <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{pageSlug}</span> page is currently offline for scheduled updates or has been temporarily disabled by administrators.
                </p>
              </div>
              <div className="flex justify-center pt-2">
                <Link to="/" className="btn-primary flex items-center gap-2 text-sm font-semibold">
                  <span>Return to Homepage</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ) : !currentPage && !['home', 'about', 'services', 'plans', 'pricing'].includes(pageSlug) ? (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-800 dark:text-slate-200 px-4 py-16">
            <div className="p-8 rounded-none border border-grid glass-panel text-center max-w-md space-y-6 bg-brand-sand dark:bg-brand-dark">
              <ShieldAlert size={48} className="mx-auto text-brand-emerald" />
              <h1 className="text-3xl font-normal text-slate-900 dark:text-white font-display lowercase leading-tight">Page Not Found</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-sans font-light">
                The page slug you are looking for (slug: <code className="bg-brand-sand dark:bg-brand-dark px-1.5 py-0.5 border border-grid rounded text-xs text-brand-emerald font-mono">{pageSlug}</code>) has not been initialized or is set to draft.
              </p>
              <div className="flex justify-center pt-2">
                <Link to="/" className="btn-primary flex items-center gap-1.5 text-sm">
                  <span>Back to Home</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <SectionRenderer sections={activeSections} />
        )}
      </main>

      <Footer />
    </div>
  )
}
export default DynamicPage
