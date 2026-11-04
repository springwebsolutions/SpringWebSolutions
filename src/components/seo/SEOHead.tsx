import React, { useEffect } from 'react'

export interface SEOHeadProps {
  title: string
  description: string
  keywords?: string
  canonicalUrl?: string
  canonical?: string
  ogImage?: string
  ogImageWidth?: string
  ogImageHeight?: string
  ogImageAlt?: string
  type?: 'website' | 'article' | 'product' | 'profile'
  jsonLd?: object | object[]
  schema?: object | object[]
  noindex?: boolean
  twitterSite?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  articleSection?: string
}

const SITE_NAME = 'Spring Web Solutions'
const DEFAULT_OG_IMAGE = 'https://www.springwebsolutions.in/logo-emblem.png'
const DEFAULT_TWITTER_HANDLE = '@SpringWebSol'
const DEFAULT_KEYWORDS =
  'web development company in Udumalpet, website development Udumalaipettai, software company Coimbatore, web development company Tamil Nadu, Spring Web Solutions'

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageWidth = '1200',
  ogImageHeight = '630',
  ogImageAlt,
  type = 'website',
  jsonLd,
  schema,
  noindex = false,
  twitterSite = DEFAULT_TWITTER_HANDLE,
  publishedTime,
  modifiedTime,
  author = SITE_NAME,
  articleSection,
}) => {
  const activeCanonical =
    canonical ||
    canonicalUrl ||
    (typeof window !== 'undefined'
      ? window.location.href.split('?')[0].split('#')[0]
      : 'https://www.springwebsolutions.in/')

  const activeSchema = schema || jsonLd

  // Enforce 60-char title cap and 155-char description cap (SERP safety)
  const cleanTitle =
    title.length > 60 ? title.substring(0, 57).trim() + '…' : title
  const cleanDesc =
    description.length > 155
      ? description.substring(0, 152).trim() + '…'
      : description

  const resolvedOgAlt =
    ogImageAlt || `${cleanTitle} — Spring Web Solutions`

  useEffect(() => {
    // ── 1. Title ────────────────────────────────────────────────────────────
    document.title = title // keep full title for browser tab

    // ── Helper: upsert a <meta> tag ─────────────────────────────────────────
    const setMeta = (
      name: string,
      content: string,
      isProperty = false
    ) => {
      const attr = isProperty ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // ── Helper: upsert a <link> tag ─────────────────────────────────────────
    const setLink = (rel: string, href: string, extra?: Record<string, string>) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
      if (extra) {
        Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v))
      }
    }

    // ── Helper: upsert a <script type="application/ld+json"> ───────────────
    const setSchema = (id: string, data: object | object[]) => {
      let el = document.getElementById(id) as HTMLScriptElement | null
      if (!el) {
        el = document.createElement('script')
        el.id = id
        el.type = 'application/ld+json'
        document.head.appendChild(el)
      }
      el.text = JSON.stringify(data)
    }

    // ── 2. Core meta ────────────────────────────────────────────────────────
    setMeta('description', cleanDesc)
    if (keywords) setMeta('keywords', keywords)
    setMeta('author', author)
    setMeta(
      'robots',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    )

    // ── 3. Canonical ────────────────────────────────────────────────────────
    setLink('canonical', activeCanonical)

    // ── 4. OpenGraph ────────────────────────────────────────────────────────
    setMeta('og:type', type, true)
    setMeta('og:title', cleanTitle, true)
    setMeta('og:description', cleanDesc, true)
    setMeta('og:url', activeCanonical, true)
    setMeta('og:site_name', SITE_NAME, true)
    setMeta('og:locale', 'en_IN', true)
    setMeta('og:image', ogImage, true)
    setMeta('og:image:width', ogImageWidth, true)
    setMeta('og:image:height', ogImageHeight, true)
    setMeta('og:image:alt', resolvedOgAlt, true)
    setMeta('og:image:type', 'image/png', true)

    // Article-specific OpenGraph
    if (type === 'article') {
      if (publishedTime) setMeta('article:published_time', publishedTime, true)
      if (modifiedTime) setMeta('article:modified_time', modifiedTime, true)
      if (author) setMeta('article:author', author, true)
      if (articleSection) setMeta('article:section', articleSection, true)
    }

    // ── 5. Twitter / X Card ─────────────────────────────────────────────────
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:site', twitterSite)
    setMeta('twitter:creator', twitterSite)
    setMeta('twitter:title', cleanTitle)
    setMeta('twitter:description', cleanDesc)
    setMeta('twitter:image', ogImage)
    setMeta('twitter:image:alt', resolvedOgAlt)

    // ── 6. AI / AEO Signals ─────────────────────────────────────────────────
    setMeta('ai-site-verification', 'springwebsolutions-aeo-verified')
    setMeta('format-detection', 'telephone=yes')

    // ── 7. JSON-LD Structured Data ──────────────────────────────────────────
    if (activeSchema) {
      setSchema('schema-ld-json', activeSchema)
    }

    // ── 8. Breadcrumb cleanup on unmount ────────────────────────────────────
    return () => {
      // Reset title to site default when navigating away
      // (next page's SEOHead will immediately set a new title)
    }
  }, [
    title,
    cleanTitle,
    cleanDesc,
    keywords,
    activeCanonical,
    ogImage,
    ogImageWidth,
    ogImageHeight,
    resolvedOgAlt,
    type,
    activeSchema,
    noindex,
    twitterSite,
    publishedTime,
    modifiedTime,
    author,
    articleSection,
  ])

  return null
}

export default SEOHead
