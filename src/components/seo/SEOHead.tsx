import React, { useEffect } from 'react'

export interface SEOHeadProps {
  title: string
  description: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  type?: string
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = 'website development Udumalpet, custom ERP CRM software Udumalpet, app development Udumalpet, software company Coimbatore, web development company Tamil Nadu, custom CRM development India, software agency Udumalpet, Spring Web Solutions',
  canonicalUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.springwebsolutions.in/',
  ogImage = 'https://www.springwebsolutions.in/logo-emblem.png',
  type = 'website'
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
    const setLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`)
      if (!element) {
        element = document.createElement('link')
        element.setAttribute('rel', rel)
        document.head.appendChild(element)
      }
      element.setAttribute('href', href)
    }

    // 2. Primary Meta Tags
    setMeta('description', description)
    if (keywords) setMeta('keywords', keywords)
    setMeta('author', 'Spring Web Solutions')

    // 3. Canonical Link
    setLink('canonical', canonicalUrl)

    // 4. OpenGraph Social Sharing
    setMeta('og:type', type, true)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:url', canonicalUrl, true)
    setMeta('og:site_name', 'Spring Web Solutions', true)
    setMeta('og:image', ogImage, true)

    // 5. Twitter Cards
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', ogImage)

  }, [title, description, keywords, canonicalUrl, ogImage, type])

  return null
}

export default SEOHead
