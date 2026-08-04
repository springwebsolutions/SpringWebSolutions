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
  ogImage = 'https://careers.springwebsolutions.in/logo-emblem.png',
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
              'name': 'What software engineering jobs are available at SpringWeb Solutions in Udumalpet, Tamil Nadu?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'SpringWeb Solutions offers software developer vacancies in Web Development (React/TypeScript), Custom ERP/CRM Engineering (Node.js/Supabase), Mobile App Development (Android/iOS), and Windows Desktop Software for candidates in Udumalpet, Tiruppur, Coimbatore, statewide across Tamil Nadu, nationally across India, and Global Remote.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Does SpringWeb Careers list remote software jobs for candidates across India and worldwide?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Yes, SpringWeb Careers features both on-site developer positions at Headquarters in Udumalpet, Tamil Nadu, as well as remote software engineering vacancies open to candidates across India and internationally.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Where can I access free educational software engineering career guides and interview prep roadmaps?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'SpringWeb Careers Portal provides free educational guides, full-stack software developer roadmaps, and interview preparation resources at https://careers.springwebsolutions.in/career-guides.'
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
