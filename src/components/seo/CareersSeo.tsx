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
  title = 'Job Vacancies, Remote Openings & Educational Career Guides | SpringWeb Careers',
  description = 'Explore verified software engineering, mobile app development, SEO, and remote job vacancies across Tamil Nadu, All-India Metros, and International WFH positions. Free educational career roadmaps and interview preparation guides.',
  keywords = 'job vacancies, software engineer jobs, remote jobs India, Tamil Nadu tech jobs, Chennai software vacancies, React engineer jobs, Kotlin Android developer jobs, C# desktop jobs, technical interview guide',
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

    // 2. Primary Meta Tags
    setMeta('description', description)
    setMeta('keywords', keywords)
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')

    // 3. Canonical Link
    setLink('canonical', canonicalUrl)

    // 4. OpenGraph Social Sharing
    setMeta('og:type', 'website', true)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:url', canonicalUrl, true)
    setMeta('og:site_name', 'SpringWeb Careers Vault', true)
    setMeta('og:image', ogImage, true)

    // 5. Twitter Cards
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', ogImage)

    // 6. Favicons & Google Search Logo Tags
    setLink('icon', '/favicon.ico', 'any')
    setLink('icon', '/favicon.png', 'any', 'image/png')
    setLink('icon', '/logo-emblem.png', '192x192', 'image/png')
    setLink('icon', '/logo-emblem.png', '96x96', 'image/png')
    setLink('icon', '/logo-emblem.png', '48x48', 'image/png')
    setLink('icon', '/logo-emblem.png', '32x32', 'image/png')
    setLink('shortcut icon', '/logo-emblem.png')
    setLink('apple-touch-icon', '/logo-emblem.png', '180x180')

    // 7. Inject JSON-LD Schema
    const defaultSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'SpringWeb Careers Vault',
      'url': 'https://careers.springwebsolutions.in',
      'description': description,
      'publisher': {
        '@type': 'Organization',
        'name': 'SpringWeb Solutions',
        'logo': ogImage
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://careers.springwebsolutions.in/jobs?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
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
