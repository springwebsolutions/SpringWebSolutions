import React, { useEffect } from 'react'

export interface SEOHeadProps {
  title: string
  description: string
  keywords?: string
  canonicalUrl?: string
  canonical?: string
  ogImage?: string
  type?: string
  jsonLd?: object | object[]
  schema?: object | object[]
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = 'web development company in Udumalpet, website development Udumalaipettai, software company Coimbatore, web development company Tamil Nadu, Spring Web Solutions',
  canonicalUrl,
  canonical,
  ogImage = 'https://www.springwebsolutions.in/logo-emblem.png',
  type = 'website',
  jsonLd,
  schema
}) => {
  const activeCanonical = canonical || canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://www.springwebsolutions.in/')
  const activeSchema = schema || jsonLd
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
    const setLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`)
      if (!element) {
        element = document.createElement('link')
        element.setAttribute('rel', rel)
        document.head.appendChild(element)
      }
      element.setAttribute('href', href)
    }

    // 2. Truncate description to max 155 characters for SEO SERP safety
    const cleanDesc = description.length > 155 
      ? description.substring(0, 152).trim() + '...' 
      : description

    setMeta('description', cleanDesc)
    if (keywords) setMeta('keywords', keywords)
    setMeta('author', 'Spring Web Solutions')

    // 3. Canonical Link
    setLink('canonical', activeCanonical)

    // 4. OpenGraph Social Sharing
    setMeta('og:type', type, true)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:url', activeCanonical, true)
    setMeta('og:site_name', 'Spring Web Solutions', true)
    setMeta('og:image', ogImage, true)

    // 5. Twitter Cards
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', ogImage)

    // 6. Dynamic JSON-LD Structured Data for Search Engine & AI Answer Engine Indexing
    if (activeSchema) {
      let script = document.getElementById('schema-ld-json') as HTMLScriptElement
      if (!script) {
        script = document.createElement('script')
        script.id = 'schema-ld-json'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.text = JSON.stringify(activeSchema)
    }

  }, [title, description, keywords, activeCanonical, ogImage, type, activeSchema])

  return null
}

export default SEOHead
