import React, { useEffect } from 'react'

interface CareersSeoProps {
  title?: string
  description?: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  schemaJson?: object
}

export const CareersSeo: React.FC<CareersSeoProps> = ({
  title = 'Software Jobs in Udumalpet, Tamil Nadu, India & Remote | SpringWeb Careers',
  description = 'Discover software engineering jobs & developer vacancies in Udumalpet, Tamil Nadu, and remote. Apply today to build your career with SpringWeb!',
  keywords = 'software jobs Udumalpet, web developer jobs Udumalpet, IT career vacancies Udumalpet, software jobs Tiruppur, software company jobs Coimbatore, developer vacancies Tamil Nadu, Chennai tech jobs, software engineer jobs India, remote software jobs India, international remote developer vacancies, SpringWeb Careers',
  canonicalUrl = 'https://careers.springwebsolutions.in/',
  ogImage = 'https://www.springwebsolutions.in/logo-emblem.png',
  schemaJson
}) => {
  useEffect(() => {
    // 1. Title
    document.title = title

    // Helper to set or create meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attr}="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attr, name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Helper to set or create link tag
    const setLink = (rel: string, href: string, sizes?: string, type?: string) => {
      let selector = `link[rel="${rel}"]`
      if (sizes) selector += `[sizes="${sizes}"]`
      let element = document.querySelector(selector)
      if (!element) {
        element = document.createElement('link')
        element.setAttribute('rel', rel)
        if (sizes) element.setAttribute('sizes', sizes)
        if (type) element.setAttribute('type', type)
        document.head.appendChild(element)
      }
      element.setAttribute('href', href)
    }

    // 2. Primary Meta Tags (Hierarchy: Local -> State -> National -> International)
    const cleanDesc = description.length > 155 
      ? description.substring(0, 152).trim() + '...' 
      : description

    setMeta('description', cleanDesc)
    setMeta('keywords', keywords)
    setMeta('author', 'Spring Web Solutions')
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')

    // 3. Local & Tiered Geo Meta Tags (Udumalpet -> Tamil Nadu -> India -> Global)
    setMeta('geo.region', 'IN-TN')
    setMeta('geo.placename', 'Udumalpet, Tiruppur, Coimbatore, Tamil Nadu, India')
    setMeta('geo.position', '10.5847;77.2472')
    setMeta('ICBM', '10.5847, 77.2472')

    // 4. Canonical Link
    setLink('canonical', canonicalUrl)

    // 5. OpenGraph Social Sharing
    setMeta('og:type', 'website', true)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:url', canonicalUrl, true)
    setMeta('og:site_name', 'SpringWeb Careers Engine', true)
    setMeta('og:image', ogImage, true)

    // 6. Twitter Cards
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', ogImage)

    // 7. Favicons & Touch Icons (Google Search Engine Compliance)
    setLink('icon', '/favicon.svg', undefined, 'image/svg+xml')
    setLink('icon', '/favicon-48x48.png', '48x48', 'image/png')
    setLink('icon', '/favicon-96x96.png', '96x96', 'image/png')
    setLink('icon', '/favicon-192x192.png', '192x192', 'image/png')
    setLink('icon', '/favicon-512x512.png', '512x512', 'image/png')
    setLink('shortcut icon', '/favicon.ico')
    setLink('apple-touch-icon', '/apple-touch-icon.png', '180x180')

    // 8. Inject JSON-LD AEO & Geo Schema Graph (Answer Engine Optimization)
    const defaultSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': 'https://careers.springwebsolutions.in/#website',
          'name': 'SpringWeb Careers & Education Hub',
          'url': 'https://careers.springwebsolutions.in',
          'description': description,
          'publisher': {
            '@type': 'Organization',
            'name': 'Spring Web Solutions',
            'logo': ogImage,
            'url': 'https://www.springwebsolutions.in'
          },
          'potentialAction': {
            '@type': 'SearchAction',
            'target': 'https://careers.springwebsolutions.in/jobs?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'EducationalOrganization',
          '@id': 'https://careers.springwebsolutions.in/#organization',
          'name': 'SpringWeb Tech Academy & Careers',
          'url': 'https://careers.springwebsolutions.in',
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': '11A, Kasturi Street, near Kuttal Thidal',
            'addressLocality': 'Udumalpet',
            'addressRegion': 'Tamil Nadu',
            'postalCode': '642126',
            'addressCountry': 'IN'
          },
          'parentOrganization': {
            '@type': 'Organization',
            'name': 'Spring Web Solutions'
          },
          'knowsAbout': [
            'Software Engineering Careers',
            'Full Stack Web Development Roadmaps',
            'Android & iOS Mobile App Engineering',
            'Technical Interview Preparation & Guides'
          ]
        },
        {
          '@type': 'FAQPage',
          '@id': 'https://careers.springwebsolutions.in/#aeo-faq',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'Does SpringWeb Solutions currently have internal software engineering job vacancies?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'SpringWeb Solutions does not currently have open internal vacancies. SpringWeb maintains the Careers Vault and 13 comprehensive educational career guides as a free public service curating 100% verified external tech vacancies across top product firms in India and global remote teams.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What verified software engineering opportunities are curated on SpringWeb Careers in 2026?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'SpringWeb Careers features 21 verified active tech openings with transparent 100% INR compensation benchmarks from top companies including Cisco, HackerRank, Swiggy, Zoho, Thoughtworks, Canonical (Ubuntu), GitLab, Automattic, Red Hat, Hexaware, TCS, Fractal, CrowdStrike, BrowserStack, CRED, Jio, Freshworks, PhonePe, Postman, Razorpay, and Atlassian.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Where can candidates access free IT career roadmaps, system design blueprints, and interview guides?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'SpringWeb Careers provides 13 free educational blueprints covering Full-Stack, Frontend, Backend, DevOps, System Design, Applied AI, Cybersecurity, SDET, Cloud Architecture, Data Engineering, MLOps, Mobile Apps, and Global Remote Contracting at https://careers.springwebsolutions.in/career-guides.'
              }
            }
          ]
        }
      ]
    }

    const finalSchema = schemaJson || defaultSchema
    let scriptTag = document.getElementById('careers-jsonld-schema')
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.id = 'careers-jsonld-schema'
      scriptTag.setAttribute('type', 'application/ld+json')
      document.head.appendChild(scriptTag)
    }
    scriptTag.textContent = JSON.stringify(finalSchema)

  }, [title, description, keywords, canonicalUrl, ogImage, schemaJson])

  return null
}
