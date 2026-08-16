/**
 * SpringWeb Instant Lead Scraper v2.1 - Google Maps Content Script
 *
 * v2.1 Improvements over v2.0:
 * - MutationObserver replaces fixed 1500ms sleep → 2-4x faster scraping
 * - Extract reviews_count, google_maps_url, opening_hours from detail pane
 * - Smarter auto-scroll with end-of-results detection
 * - Stop signal support (can be cancelled mid-scrape)
 * - Review count extraction from card list (no extra click needed)
 * - Verified selectors: button[data-item-id^="phone:tel:"] · a[href^="tel:"] · .Io6YTe
 */

;(() => {
  'use strict'

  // ─── Selectors (verified from live Google Maps DOM, August 2026) ──────────
  const SEL = {
    phoneByDataItemId: 'button[data-item-id^="phone:tel:"]',
    phoneByTelHref:    'a[href^="tel:"]',
    phoneByAriaLabel:  'button[aria-label^="Phone:"], button[aria-label^="Call phone"]',
    addressBtn:        'button[data-item-id="address"]',
    feed:              'div[role="feed"]',
    cards:             'div[role="feed"] > div',
    cardLink:          'a.hfpxzc',
    cardName:          '.qBF1Pd, .fontHeadlineSmall',
    cardMeta:          '.W4Efsd',
    cardRating:        '.MW450e',
    cardReviews:       '.UY7F9, .e4rVHe span',
    searchBox:         '#searchboxinput, input[aria-label*="Search"]',
    detailPane:        'div[role="main"]',
    infoRowText:       '.Io6YTe',
    endOfResults:      '.PbZDve, .m6QErb[aria-label*="end"]',
    openHours:         'div[aria-label*="Hours"], button[data-item-id="oh"]',
    ratingSelectors:   ['.F7beT', 'div.fontDisplayLarge', 'span[aria-label*="star" i]', '.MW450e'],
    reviewsCount:      'button[aria-label*="review" i], span[aria-label*="review" i]',
  }

  const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/

  // ─── Global stop flag (set by STOP_SCRAPE message) ───────────────────────
  let stopRequested = false
  const seenKeys    = new Set()

  function makeDedupKey(name, phone) {
    const n = (name || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30)
    const p = (phone || '').replace(/[^0-9]/g, '').slice(-10)
    return `${n}::${p}`
  }

  // ─── Phone Extraction ─────────────────────────────────────────────────────
  function extractPhone(root) {
    root = root || document

    // 1. data-item-id^="phone:tel:"  ← MOST RELIABLE (confirmed live)
    const byId = root.querySelector(SEL.phoneByDataItemId)
    if (byId) {
      const raw = (byId.getAttribute('data-item-id') || byId.innerText || '')
        .replace('phone:tel:', '').replace('tel:', '').trim()
      const formatted = formatIndianPhone(raw)
      if (formatted) return formatted
    }

    // 2. a[href^="tel:"]
    const telEl = root.querySelector(SEL.phoneByTelHref)
    if (telEl) {
      const raw = (telEl.getAttribute('href') || '').replace('tel:', '').trim()
      const formatted = formatIndianPhone(raw)
      if (formatted) return formatted
    }

    // 3. button[aria-label^="Phone:"]
    const ariaEl = root.querySelector(SEL.phoneByAriaLabel)
    if (ariaEl) {
      const label = ariaEl.getAttribute('aria-label') || ariaEl.innerText || ''
      const m = label.match(/(?:Phone|Call)[:\s]+([\d\s+\-.()\u00a0]+)/i)
      if (m?.[1]) {
        const formatted = formatIndianPhone(m[1])
        if (formatted) return formatted
      }
    }

    // 4. .Io6YTe text rows
    for (const el of root.querySelectorAll(SEL.infoRowText)) {
      const phone = parsePhoneFromText(el.innerText || '')
      if (phone) return phone
    }

    // 5. Full pane text fallback
    const pane = document.querySelector(SEL.detailPane)
    if (pane) {
      const phone = parsePhoneFromText(pane.innerText || '')
      if (phone) return phone
    }

    return null
  }

  function parsePhoneFromText(text) {
    if (!text) return null
    const str = text.replace(/[\u00a0\u202f\u2009\u2002\u2003\u200b]/g, ' ')
    const patterns = [
      /\+91[\s\-.]?[6-9]\d{4}[\s\-.]?\d{5}/,
      /0[6-9]\d{4}[\s\-.]?\d{5}/,
      /0\d{2,4}[\s\-.]?\d{3,4}[\s\-.]?\d{3,4}/,
      /[6-9]\d{4}[\s\-.]?\d{5}/,
    ]
    for (const re of patterns) {
      const m = str.match(re)
      if (m) return formatIndianPhone(m[0])
    }
    return null
  }

  function formatIndianPhone(raw) {
    if (!raw) return null
    const d = raw.replace(/[^0-9]/g, '')
    if (d.length === 12 && d.startsWith('91')) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`
    if (d.length === 11 && d.startsWith('0')) {
      const mob = d.slice(1)
      if (/^[6-9]/.test(mob)) return `+91 ${mob.slice(0, 5)} ${mob.slice(5)}`
      return `+91 ${d.slice(1, 5)} ${d.slice(5)}`
    }
    if (d.length === 10 && /^[6-9]/.test(d)) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`
    if (d.length >= 8) return raw.trim()
    return null
  }

  // ─── Website Extraction ───────────────────────────────────────────────────
  function extractWebsite(root) {
    root = root || document
    const auth = root.querySelector('a[data-item-id="authority"]')
    if (auth) return cleanUrl(auth.getAttribute('href'))

    const ws = root.querySelector('a[aria-label*="website" i]')
    if (ws) return cleanUrl(ws.getAttribute('href'))

    for (const a of root.querySelectorAll('a[href^="http"]')) {
      const href = a.getAttribute('href') || ''
      if (!href.includes('google.com') && !href.includes('goo.gl')) return cleanUrl(href)
    }
    return null
  }

  function cleanUrl(href) {
    if (!href) return null
    if (href.includes('google.com/url')) {
      try {
        const u = new URL(href)
        return u.searchParams.get('q') || u.searchParams.get('url') || href
      } catch {}
    }
    return href
  }

  // ─── Address Extraction ───────────────────────────────────────────────────
  function extractAddress(root) {
    root = root || document
    const btn = root.querySelector(SEL.addressBtn)
    if (btn) {
      return (btn.getAttribute('aria-label') || btn.innerText || '')
        .replace(/^Address:\s*/i, '').trim()
    }
    for (const el of root.querySelectorAll(SEL.infoRowText)) {
      const text = el.innerText?.trim() || ''
      if (
        text.length > 10 &&
        !text.match(/^[\d\s+\-.]{7,}$/) &&
        !text.startsWith('http') &&
        /(Street|Road|Nagar|Colony|Layout|Salai|District|Tamil Nadu|Karnataka|Kerala|Andhra|\d{1,4})/i.test(text)
      ) return text
    }
    return ''
  }

  // ─── Category Extraction ──────────────────────────────────────────────────
  function extractCategory(root) {
    root = root || document
    const catEl = root.querySelector('button[jsaction*="category"], .DkEaL, button[jsaction*="pane.rating.category"]')
    if (catEl?.innerText?.trim()) return catEl.innerText.trim()

    for (const el of root.querySelectorAll('.W4Efsd, .fontBodyMedium')) {
      const txt = el.innerText?.split('·')[0].trim()
      if (txt && txt.length > 2 && txt.length < 45 && !/^\d/.test(txt)) return txt
    }
    return 'Business'
  }

  // ─── Rating Extraction ────────────────────────────────────────────────────
  function extractRating(root) {
    root = root || document
    for (const sel of SEL.ratingSelectors) {
      const el = root.querySelector(sel)
      if (el) {
        const text = el.innerText?.trim() || el.getAttribute('aria-label') || ''
        const num = parseFloat(text)
        if (!isNaN(num) && num >= 1 && num <= 5) return num
      }
    }
    return null
  }

  // ─── Reviews Count Extraction ─────────────────────────────────────────────
  function extractReviewsCount(root) {
    root = root || document
    // Try aria-label "X reviews" button
    const reviewBtn = root.querySelector(SEL.reviewsCount)
    if (reviewBtn) {
      const label = reviewBtn.getAttribute('aria-label') || reviewBtn.innerText || ''
      const m = label.match(/([\d,]+)\s*review/i)
      if (m) return parseInt(m[1].replace(/,/g, ''), 10)
    }
    // Try text pattern "(\d+)" or "(1,234 reviews)"
    const pane = (root === document ? document.querySelector(SEL.detailPane) : root)
    const text = pane?.innerText || ''
    const m = text.match(/\(([\d,]+)\s*review/i) || text.match(/\b([\d,]+)\s*review/i)
    if (m) return parseInt(m[1].replace(/,/g, ''), 10)
    return null
  }

  // ─── Opening Hours ────────────────────────────────────────────────────────
  function extractOpenStatus(root) {
    root = root || document
    const el = root.querySelector(SEL.openHours)
    if (el) {
      const text = el.innerText?.trim() || el.getAttribute('aria-label') || ''
      if (/open now/i.test(text)) return 'Open Now'
      if (/closed/i.test(text)) return 'Closed'
      return text.slice(0, 40) || null
    }
    // Also check span-level
    const spans = root.querySelectorAll('span')
    for (const span of spans) {
      const txt = span.innerText?.trim() || ''
      if (/^(open now|closed|opens at|closes at)/i.test(txt)) return txt.slice(0, 50)
    }
    return null
  }

  // ─── Google Maps URL for current detail pane ─────────────────────────────
  function extractMapsUrl() {
    // The canonical URL is in the browser address bar
    return window.location.href.split('?')[0] || null
  }

  // ─── Location inference from search box ──────────────────────────────────
  function inferLocation() {
    const searchEl = document.querySelector(SEL.searchBox)
    const raw = (searchEl?.value || document.title || '').toLowerCase()

    const MAP = [
      { keys: ['udumalpet', 'udumalaipettai'], city: 'Udumalpet',  district: 'Tiruppur',        state: 'Tamil Nadu' },
      { keys: ['tiruppur', 'tirupur'],          city: 'Tiruppur',   district: 'Tiruppur',         state: 'Tamil Nadu' },
      { keys: ['coimbatore', 'kovai'],           city: 'Coimbatore', district: 'Coimbatore',       state: 'Tamil Nadu' },
      { keys: ['chennai', 'madras'],             city: 'Chennai',    district: 'Chennai',          state: 'Tamil Nadu' },
      { keys: ['madurai'],                       city: 'Madurai',    district: 'Madurai',          state: 'Tamil Nadu' },
      { keys: ['salem'],                         city: 'Salem',      district: 'Salem',            state: 'Tamil Nadu' },
      { keys: ['trichy', 'tiruchirappalli'],     city: 'Trichy',     district: 'Tiruchirappalli',  state: 'Tamil Nadu' },
      { keys: ['erode'],                         city: 'Erode',      district: 'Erode',            state: 'Tamil Nadu' },
      { keys: ['bengaluru', 'bangalore'],        city: 'Bengaluru',  district: 'Bengaluru Urban',  state: 'Karnataka' },
      { keys: ['hyderabad'],                     city: 'Hyderabad',  district: 'Hyderabad',        state: 'Telangana' },
      { keys: ['mumbai', 'bombay'],              city: 'Mumbai',     district: 'Mumbai',           state: 'Maharashtra' },
      { keys: ['delhi', 'new delhi'],            city: 'New Delhi',  district: 'New Delhi',        state: 'Delhi' },
      { keys: ['pune'],                          city: 'Pune',       district: 'Pune',             state: 'Maharashtra' },
      { keys: ['kochi', 'cochin'],               city: 'Kochi',      district: 'Ernakulam',        state: 'Kerala' },
    ]

    for (const entry of MAP) {
      if (entry.keys.some(k => raw.includes(k))) {
        return { city: entry.city, district: entry.district, state: entry.state, country: 'India' }
      }
    }
    return { city: 'Udumalpet', district: 'Tiruppur', state: 'Tamil Nadu', country: 'India' }
  }

  // ─── MutationObserver-based wait for h1 to change ────────────────────────
  /**
   * Waits until the detail pane h1 contains `expectedName` (case-insensitive partial match).
   * Falls back to a timeout if the observer fires late.
   * Much faster than fixed sleep: typically 200-600ms instead of 1500ms.
   */
  function waitForDetailPane(expectedName, timeout = 3000) {
    return new Promise((resolve) => {
      const start = Date.now()
      const lowerExpected = expectedName.toLowerCase().trim()

      // Helper to check current h1
      function check() {
        const h1 = document.querySelector('h1')
        const current = (h1?.innerText || h1?.textContent || '').toLowerCase().trim()
        return current.includes(lowerExpected) || lowerExpected.includes(current.slice(0, 15))
      }

      if (check()) { resolve(true); return }

      const observer = new MutationObserver(() => {
        if (check()) {
          observer.disconnect()
          resolve(true)
        }
        if (Date.now() - start >= timeout) {
          observer.disconnect()
          resolve(false)
        }
      })

      observer.observe(document.querySelector(SEL.detailPane) || document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      })

      // Absolute timeout fallback
      setTimeout(() => {
        observer.disconnect()
        resolve(false)
      }, timeout)
    })
  }

  // ─── Reviews Snippets Extraction ─────────────────────────────────────────
  function extractReviews(root) {
    root = root || document
    const reviews = []
    // 1. Check standard quote elements (Google Maps quote blocks)
    const quotes = root.querySelectorAll('q')
    for (const q of quotes) {
      const text = q.innerText?.trim()?.replace(/^["']|["']$/g, '') // remove outer quotes
      if (text && text.length > 5 && !reviews.includes(text)) {
        reviews.push(text)
        if (reviews.length >= 3) break
      }
    }
    // 2. Check standard class containers (like .wi370c review highlight text span)
    if (reviews.length < 3) {
      const textSpans = root.querySelectorAll('span.wi370c, .w6ppb')
      for (const el of textSpans) {
        const text = el.innerText?.trim()?.replace(/^["']|["']$/g, '')
        if (text && text.length > 5 && !reviews.includes(text)) {
          reviews.push(text)
          if (reviews.length >= 3) break
        }
      }
    }
    return reviews
  }

  // ─── Build lead object from current detail pane ───────────────────────────
  function buildLeadFromPane(cardName, cardCategory, cardRatingNum, cardReviewsNum) {
    const name  = document.querySelector('h1')?.innerText?.trim() || cardName
    if (!name || name.length < 2) return null

    const phone        = extractPhone()
    const website      = extractWebsite()
    const address      = extractAddress()
    const category     = extractCategory() || cardCategory || 'Business'
    const rating       = extractRating() || cardRatingNum
    const reviews      = extractReviewsCount() || cardReviewsNum
    const openStatus   = extractOpenStatus()
    const mapsUrl      = extractMapsUrl()
    const loc          = inferLocation()
    const snippets     = extractReviews()

    const paneText     = document.querySelector(SEL.detailPane)?.innerText || ''
    const emailMatch   = paneText.match(EMAIL_RE)
    const email        = emailMatch ? emailMatch[0] : null

    const key = makeDedupKey(name, phone)
    if (seenKeys.has(key)) return null
    seenKeys.add(key)

    return {
      id:             `ext-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      owner_name:     null,
      category,
      phone:          phone || null,
      email:          email || null,
      website:        website || null,
      address:        address || `${loc.city}, ${loc.state}`,
      city:           loc.city,
      district:       loc.district,
      state:          loc.state,
      country:        loc.country,
      rating:         rating || null,
      reviews_count:  reviews || null,
      open_status:    openStatus || null,
      google_maps_url: mapsUrl || null,
      review_snippets: snippets,
      source:         'SpringWeb Maps Scraper v2.1',
    }
  }

  // ─── Wait helper ──────────────────────────────────────────────────────────
  function wait(ms) { return new Promise(r => setTimeout(r, ms)) }

  // ─── Main: scrape all visible feed cards ──────────────────────────────────
  async function scrapeAllLeadsFromFeed(progressCallback) {
    const leads = []
    stopRequested = false

    // Single place page (/maps/place/...)
    if (window.location.href.includes('/maps/place/')) {
      await wait(800)
      const lead = buildLeadFromPane('', 'Business', null, null)
      if (lead) leads.push(lead)
      return leads
    }

    const cards = document.querySelectorAll(SEL.cards)
    if (cards.length === 0) {
      const lead = buildLeadFromPane('', 'Business', null, null)
      if (lead) leads.push(lead)
      return leads
    }

    const total = cards.length
    let processed = 0

    for (let i = 0; i < total; i++) {
      if (stopRequested) break

      const card = cards[i]

      // Card name (required)
      const nameEl   = card.querySelector(SEL.cardName)
      const cardName = nameEl?.innerText?.trim() || ''
      if (!cardName || cardName.length < 2) continue

      // Card rating & reviews (extracted from card list – no click needed)
      const ratingEl    = card.querySelector(SEL.cardRating)
      const ratingNum   = parseFloat(ratingEl?.innerText?.trim()) || null

      const reviewsEl   = card.querySelector(SEL.cardReviews)
      const reviewsTxt  = (reviewsEl?.innerText || '').replace(/[^0-9]/g, '')
      const reviewsNum  = reviewsTxt ? parseInt(reviewsTxt, 10) : null

      // Card category
      let cardCategory = 'Business'
      for (const el of card.querySelectorAll(SEL.cardMeta)) {
        const txt = el.innerText?.split('·')[0].trim()
        if (txt && txt.length > 2 && txt.length < 45 && !/^\d/.test(txt)) {
          cardCategory = txt
          break
        }
      }

      // Click to open detail pane
      const clickTarget = card.querySelector(SEL.cardLink) || card.querySelector('a[href*="/maps/place"]')
      if (!clickTarget) continue

      try {
        clickTarget.click()

        // Wait for detail pane to show this business (MutationObserver-based)
        await waitForDetailPane(cardName, 3000)

        // Small extra wait for phone/website elements to render
        await wait(300)

        const lead = buildLeadFromPane(cardName, cardCategory, ratingNum, reviewsNum)
        if (lead) {
          leads.push(lead)
          processed++
          progressCallback?.({ processed, total, latest: lead })
        }
      } catch (err) {
        console.warn('[SpringWeb v2.1] Card error:', cardName, err)
      }
    }

    return leads
  }

  // ─── Auto-scroll + scrape ─────────────────────────────────────────────────
  async function autoScrollAndScrape(maxScrolls, progressCallback) {
    const feed = document.querySelector(SEL.feed)
    if (!feed) throw new Error('Google Maps feed not found. Search for businesses first.')

    stopRequested = false

    for (let s = 0; s < maxScrolls; s++) {
      if (stopRequested) break
      feed.scrollBy({ top: 900, behavior: 'smooth' })
      await wait(900)

      // Detect "end of list" message
      const endEl = document.querySelector(SEL.endOfResults)
      if (endEl && (endEl.innerText?.toLowerCase().includes('end') || endEl.clientHeight > 0)) break
    }

    return scrapeAllLeadsFromFeed(progressCallback)
  }

  // ─── Message Router ───────────────────────────────────────────────────────
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === 'SCRAPE_MAPS_LEADS') {
      seenKeys.clear()
      scrapeAllLeadsFromFeed((p) => {
        chrome.runtime.sendMessage({ action: 'SCRAPE_PROGRESS', ...p }).catch(() => {})
      })
        .then(leads => sendResponse({ status: 'success', count: leads.length, data: leads }))
        .catch(err  => sendResponse({ status: 'error', message: err.message }))
      return true

    } else if (request.action === 'AUTO_SCROLL_FEED') {
      seenKeys.clear()
      autoScrollAndScrape(request.maxScrolls || 15, (p) => {
        chrome.runtime.sendMessage({ action: 'SCRAPE_PROGRESS', ...p }).catch(() => {})
      })
        .then(leads => sendResponse({ status: 'success', count: leads.length, data: leads }))
        .catch(err  => sendResponse({ status: 'error', message: err.message }))
      return true

    } else if (request.action === 'SCRAPE_DETAIL_PANE') {
      // Scrape single currently-open place
      const lead = buildLeadFromPane('', 'Business', null, null)
      sendResponse(lead
        ? { status: 'success', data: lead }
        : { status: 'error', message: 'No business detail pane visible.' }
      )

    } else if (request.action === 'STOP_SCRAPE') {
      stopRequested = true
      sendResponse({ status: 'ok' })

    } else if (request.action === 'PING') {
      sendResponse({ status: 'ok', version: '2.1' })
    }
  })

  console.log('[SpringWeb Scraper v2.1] Loaded on:', window.location.href)
})()
