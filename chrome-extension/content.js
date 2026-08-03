/**
 * SpringWeb Instant Lead Scraper v2.0 - Google Maps Content Script
 *
 * ROOT-CAUSE FIX for previous versions:
 * 1. Previous 350ms wait was too short → now 1500ms per card click
 * 2. Wrong selectors used → now using VERIFIED live DOM selectors from Google Maps:
 *    - button[data-item-id^="phone:tel:"]   ← MOST RELIABLE (confirmed live)
 *    - a[href^="tel:"]                       ← tel: href link (confirmed live)
 *    - button[aria-label^="Phone:"]          ← aria-label (confirmed live)
 *    - .Io6YTe                               ← text elements row (confirmed live)
 * 3. Deduplication: by normalized phone + business name
 * 4. Auto-scroll: scroll feed, wait 1s for DOM to settle, then scrape visible cards
 */

;(() => {
  'use strict'

  // ─── Selectors (verified from live Google Maps DOM, August 2026) ───────────
  const SEL = {
    // Phone selectors – ordered from most to least reliable
    phoneByDataItemId: 'button[data-item-id^="phone:tel:"]',   // e.g. data-item-id="phone:tel:09095190555"
    phoneByTelHref:    'a[href^="tel:"]',                       // e.g. href="tel:09095190555"
    phoneByAriaLabel:  'button[aria-label^="Phone:"], button[aria-label^="Call phone"]',

    // Website
    websiteBtn:        'a[data-item-id="authority"], a[aria-label^="Website"], a[data-tooltip="Open website"]',
    websiteHref:       'a[href]:not([href*="google.com"]):not([href^="tel:"]):not([href^="mailto:"])',

    // Address
    addressBtn:        'button[data-item-id="address"]',

    // Name (detail pane h1)
    placeName:         'h1.DUwDvf, h1.fontHeadlineLarge, h1',

    // Rating
    ratingEl:          'div.F7beT, span.MW450e, div.fontBodyMedium > span[aria-label*="star"]',

    // Info row texts (address, phone, website text are all .Io6YTe)
    infoRowText:       '.Io6YTe',

    // Feed: left side result list
    feed:              'div[role="feed"]',

    // Individual cards
    cards:             'div[role="feed"] > div',

    // Card link (clicking this opens the middle detail pane)
    cardLink:          'a.hfpxzc',

    // Card name label
    cardName:          '.qBF1Pd, .fontHeadlineSmall',

    // Card category / description text
    cardMeta:          '.W4Efsd',

    // Card rating
    cardRating:        '.MW450e',

    // Search box
    searchBox:         '#searchboxinput, input[aria-label*="Search"]',

    // Detail pane container
    detailPane:        'div[role="main"]',
  }

  // ─── Email regex ───────────────────────────────────────────────────────────
  const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/

  // ─── Duplicate guard ───────────────────────────────────────────────────────
  const seenKeys = new Set()

  function makeDedupKey(name, phone) {
    const n = (name || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim()
    const p = (phone || '').replace(/[^0-9]/g, '').slice(-10)
    return `${n}::${p}`
  }

  // ─── Phone Extractor ───────────────────────────────────────────────────────
  /**
   * Extracts a raw phone string from the detail pane using VERIFIED selectors.
   * Priority: data-item-id > tel: href > aria-label > .Io6YTe text > fulltext regex
   */
  function extractPhoneFromPane(container) {
    // 1. button[data-item-id^="phone:tel:"]  ← MOST RELIABLE
    const byDataItemId = (container || document).querySelector(SEL.phoneByDataItemId)
    if (byDataItemId) {
      const raw = byDataItemId.getAttribute('data-item-id') || byDataItemId.innerText || ''
      // data-item-id = "phone:tel:09095190555"
      const fromAttr = raw.replace('phone:tel:', '').replace('tel:', '').trim()
      if (fromAttr) return formatIndianPhone(fromAttr)
      const fromText = byDataItemId.innerText?.trim()
      if (fromText) return formatIndianPhone(fromText)
    }

    // 2. a[href^="tel:"]
    const telLink = (container || document).querySelector(SEL.phoneByTelHref)
    if (telLink) {
      const raw = (telLink.getAttribute('href') || '').replace('tel:', '').trim()
      if (raw) return formatIndianPhone(raw)
    }

    // 3. button[aria-label^="Phone:"]
    const ariaPhoneEl = (container || document).querySelector(SEL.phoneByAriaLabel)
    if (ariaPhoneEl) {
      const label = ariaPhoneEl.getAttribute('aria-label') || ''
      // "Phone: 090951 90555 " → extract number after "Phone: "
      const match = label.match(/(?:Phone|Call):\s*([\d\s\+\-\.]+)/i)
      if (match && match[1]) return formatIndianPhone(match[1])
      // Try innerText of the button
      const btnText = ariaPhoneEl.innerText?.trim()
      if (btnText) return formatIndianPhone(btnText)
    }

    // 4. .Io6YTe rows (address, website, phone all appear here)
    const infoRows = (container || document).querySelectorAll(SEL.infoRowText)
    for (const row of infoRows) {
      const text = row.innerText?.trim() || ''
      const phone = parseIndianPhoneFromText(text)
      if (phone) return phone
    }

    // 5. Full detail pane text fallback
    const pane = document.querySelector(SEL.detailPane)
    if (pane) {
      const phone = parseIndianPhoneFromText(pane.innerText || '')
      if (phone) return phone
    }

    return null
  }

  /**
   * Parse Indian phone number from arbitrary text using regex.
   * Handles: "090951 90555", "98659 55225", "+91 98948 05812", "04252 220 123"
   */
  function parseIndianPhoneFromText(text) {
    if (!text) return null
    // Normalize unicode spaces
    const str = text.replace(/[\u00a0\u202f\u2009\u2002\u2003]/g, ' ')

    const patterns = [
      // +91 XXXXX XXXXX or +91XXXXXXXXXX
      /\+91[\s\-.]?[6-9]\d{4}[\s\-.]?\d{5}/,
      // 0XXXXX XXXXX (10-11 digits starting with 0)
      /0[6-9]\d{4}[\s\-.]?\d{5}/,
      /0\d{2,4}[\s\-.]?\d{3,4}[\s\-.]?\d{3,4}/,
      // XXXXX XXXXX (10 digits, mobile)
      /[6-9]\d{4}[\s\-.]?\d{5}/,
    ]

    for (const re of patterns) {
      const m = str.match(re)
      if (m) {
        const raw = m[0]
        return formatIndianPhone(raw)
      }
    }
    return null
  }

  /**
   * Formats a raw phone string to +91 XXXXX XXXXX canonical form.
   */
  function formatIndianPhone(raw) {
    if (!raw) return null
    const digits = raw.replace(/[^0-9]/g, '')

    if (digits.length === 12 && digits.startsWith('91')) {
      return '+91 ' + digits.slice(2, 7) + ' ' + digits.slice(7)
    }
    if (digits.length === 11 && digits.startsWith('0')) {
      const mobile = digits.slice(1)
      if (/^[6-9]/.test(mobile)) {
        return '+91 ' + mobile.slice(0, 5) + ' ' + mobile.slice(5)
      }
      // Landline: 0AAAA XXXXXX
      return '+91 ' + digits.slice(1, 5) + ' ' + digits.slice(5)
    }
    if (digits.length === 10 && /^[6-9]/.test(digits)) {
      return '+91 ' + digits.slice(0, 5) + ' ' + digits.slice(5)
    }
    if (digits.length >= 8) {
      return raw.trim()
    }
    return null
  }

  // ─── Website Extractor ────────────────────────────────────────────────────
  function extractWebsiteFromPane(container) {
    // Try data-item-id="authority" (Google Maps website button)
    const authorityEl = (container || document).querySelector('a[data-item-id="authority"]')
    if (authorityEl) {
      return cleanGoogleRedirectUrl(authorityEl.getAttribute('href') || '')
    }

    // Try aria-label with "Website"
    const websiteEl = (container || document).querySelector('a[aria-label*="website" i], a[aria-label*="Website"]')
    if (websiteEl) {
      return cleanGoogleRedirectUrl(websiteEl.getAttribute('href') || '')
    }

    // Try any external http link that's not Google
    const links = (container || document).querySelectorAll('a[href^="http"]')
    for (const link of links) {
      const href = link.getAttribute('href') || ''
      if (!href.includes('google.com') && !href.includes('goo.gl') && href.startsWith('http')) {
        return cleanGoogleRedirectUrl(href)
      }
    }
    return null
  }

  function cleanGoogleRedirectUrl(href) {
    if (!href) return null
    if (href.includes('google.com/url?q=') || href.includes('google.com/url?sa=')) {
      try {
        const url = new URL(href)
        return url.searchParams.get('q') || url.searchParams.get('url') || href
      } catch {}
    }
    return href
  }

  // ─── Address Extractor ────────────────────────────────────────────────────
  function extractAddressFromPane(container) {
    const addrBtn = (container || document).querySelector(SEL.addressBtn)
    if (addrBtn) {
      const label = addrBtn.getAttribute('aria-label') || addrBtn.innerText || ''
      return label.replace(/^Address:\s*/i, '').trim()
    }

    // Fallback: .Io6YTe that looks like an address (contains a number and street)
    const infoRows = (container || document).querySelectorAll(SEL.infoRowText)
    for (const row of infoRows) {
      const text = row.innerText?.trim() || ''
      // Indian address: typically has district or state name, or numeric door number
      if (text.length > 10 && !text.match(/^[+0-9\s\-\.]{7,}$/) && !text.startsWith('http')) {
        if (
          /\d/.test(text) ||
          /(Street|Road|Nagar|Colony|Layout|Salai|Road|District|Tamil Nadu|Karnataka|Kerala|Andhra)/i.test(text)
        ) {
          return text
        }
      }
    }
    return ''
  }

  // ─── Category Extractor ──────────────────────────────────────────────────
  function extractCategoryFromPane(container) {
    const catEl = (container || document).querySelector('button[jsaction*="category"], .DkEaL')
    if (catEl) return catEl.innerText?.trim() || ''

    // Fallback: first meta line in .W4Efsd
    const metaEls = (container || document).querySelectorAll('.W4Efsd')
    for (const el of metaEls) {
      const text = el.innerText?.split('·')[0].trim()
      if (text && text.length < 40) return text
    }
    return 'Business'
  }

  // ─── Location Context from Search Box ────────────────────────────────────
  function inferLocationFromSearch() {
    const searchEl = document.querySelector(SEL.searchBox)
    const searchText = (searchEl?.value || document.title || '').toLowerCase()

    const cityMap = [
      { keys: ['udumalpet', 'udumalaipettai'], city: 'Udumalpet', district: 'Tiruppur', state: 'Tamil Nadu' },
      { keys: ['tiruppur', 'tirupur'], city: 'Tiruppur', district: 'Tiruppur', state: 'Tamil Nadu' },
      { keys: ['coimbatore', 'kovai'], city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
      { keys: ['chennai', 'madras'], city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
      { keys: ['madurai'], city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu' },
      { keys: ['bengaluru', 'bangalore'], city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka' },
      { keys: ['hyderabad'], city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana' },
      { keys: ['mumbai', 'bombay'], city: 'Mumbai', district: 'Mumbai', state: 'Maharashtra' },
      { keys: ['delhi', 'new delhi'], city: 'New Delhi', district: 'New Delhi', state: 'Delhi' },
    ]

    for (const entry of cityMap) {
      if (entry.keys.some(k => searchText.includes(k))) {
        return { city: entry.city, district: entry.district, state: entry.state, country: 'India' }
      }
    }
    return { city: 'Udumalpet', district: 'Tiruppur', state: 'Tamil Nadu', country: 'India' }
  }

  // ─── Extract Name from Detail Pane ───────────────────────────────────────
  function extractNameFromPane(container) {
    const h1 = (container || document).querySelector('h1')
    return h1?.innerText?.trim() || h1?.textContent?.trim() || ''
  }

  // ─── Extract Rating ───────────────────────────────────────────────────────
  function extractRatingFromPane(container) {
    // Try the rating display element
    const ratingEls = [
      '.F7beT',
      'div.fontDisplayLarge',
      'span[aria-label*="star" i]',
      '.MW450e',
    ]
    for (const sel of ratingEls) {
      const el = (container || document).querySelector(sel)
      if (el) {
        const text = el.innerText?.trim() || el.getAttribute('aria-label') || ''
        const num = parseFloat(text)
        if (!isNaN(num) && num >= 1 && num <= 5) return num
      }
    }
    return null
  }

  // ─── Full Detail Pane Extraction ─────────────────────────────────────────
  function extractCurrentDetailPane() {
    const name = extractNameFromPane()
    if (!name || name.length < 2) return null

    const phone    = extractPhoneFromPane()
    const website  = extractWebsiteFromPane()
    const address  = extractAddressFromPane()
    const category = extractCategoryFromPane()
    const rating   = extractRatingFromPane()
    const loc      = inferLocationFromSearch()

    // Email: scan full detail pane text
    const paneText = document.querySelector(SEL.detailPane)?.innerText || ''
    const emailMatch = paneText.match(EMAIL_RE)
    const email = emailMatch ? emailMatch[0] : null

    const key = makeDedupKey(name, phone)
    if (seenKeys.has(key)) return null
    seenKeys.add(key)

    return {
      id: `ext-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      owner_name: null,
      category: category || 'Business',
      phone: phone || null,
      email,
      website: website || null,
      address: address || `${loc.city}, ${loc.state}`,
      city: loc.city,
      district: loc.district,
      state: loc.state,
      country: loc.country,
      rating: rating || null,
      reviews_count: null,
      source: 'SpringWeb Maps Scraper v2',
    }
  }

  // ─── Wait Helper ──────────────────────────────────────────────────────────
  function wait(ms) {
    return new Promise(res => setTimeout(res, ms))
  }

  // ─── Wait for Detail Pane to Load Business (name must change) ─────────────
  async function waitForDetailPaneToLoad(expectedName, timeout = 3000) {
    const start = Date.now()
    while (Date.now() - start < timeout) {
      const name = extractNameFromPane()
      if (name && name.trim().toLowerCase() === expectedName.toLowerCase()) return true
      await wait(100)
    }
    return false
  }

  // ─── Feed Card Scraper with Click-Through ────────────────────────────────
  async function scrapeAllLeadsFromFeed(progressCallback) {
    const leads = []
    const loc   = inferLocationFromSearch()

    // If single place page (/maps/place/...)
    if (window.location.href.includes('/maps/place/')) {
      await wait(1000)
      const lead = extractCurrentDetailPane()
      if (lead) leads.push(lead)
      return leads
    }

    const cards = document.querySelectorAll(SEL.cards)
    if (cards.length === 0) {
      // No feed, try extracting current pane
      const lead = extractCurrentDetailPane()
      if (lead) leads.push(lead)
      return leads
    }

    let processed = 0
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]

      // Get the card name to verify detail pane loaded
      const nameEl  = card.querySelector(SEL.cardName)
      const cardName = nameEl?.innerText?.trim() || nameEl?.textContent?.trim() || ''
      if (!cardName || cardName.length < 2) continue

      // Get rating & reviews from card (faster than clicking for these)
      const ratingEl   = card.querySelector(SEL.cardRating)
      const ratingText = ratingEl?.innerText?.trim() || ''
      const ratingNum  = parseFloat(ratingText) || null

      // Get category from card meta
      let cardCategory = 'Business'
      const metaEls = card.querySelectorAll(SEL.cardMeta)
      for (const el of metaEls) {
        const txt = el.innerText?.split('·')[0].trim()
        if (txt && txt.length < 40 && txt.length > 2) {
          cardCategory = txt
          break
        }
      }

      // Click the card to open middle detail pane
      const clickTarget = card.querySelector(SEL.cardLink) || card.querySelector('a[href*="/maps/place"]')
      if (!clickTarget) continue

      try {
        clickTarget.click()

        // Wait 1500ms for detail pane to load (Google Maps SPA navigation)
        await wait(1500)

        // Also wait for the h1 to show the business name
        await waitForDetailPaneToLoad(cardName, 2500)

        const phone   = extractPhoneFromPane()
        const website = extractWebsiteFromPane()
        const address = extractAddressFromPane()
        const rating  = extractRatingFromPane() || ratingNum

        // Email from pane text
        const paneText  = document.querySelector(SEL.detailPane)?.innerText || ''
        const emailMatch = paneText.match(EMAIL_RE)
        const email = emailMatch ? emailMatch[0] : null

        const key = makeDedupKey(cardName, phone)
        if (seenKeys.has(key)) continue
        seenKeys.add(key)

        const lead = {
          id:           `ext-${Date.now()}-${i}`,
          name:         cardName,
          owner_name:   null,
          category:     cardCategory,
          phone:        phone || null,
          email:        email || null,
          website:      website || null,
          address:      address || `${loc.city}, ${loc.state}`,
          city:         loc.city,
          district:     loc.district,
          state:        loc.state,
          country:      loc.country,
          rating:       rating || null,
          reviews_count: null,
          source:       'SpringWeb Maps Scraper v2',
        }

        leads.push(lead)
        processed++

        if (progressCallback) {
          progressCallback({ processed, total: cards.length, latest: lead })
        }
      } catch (err) {
        console.warn('[SpringWeb] Error processing card:', cardName, err)
      }
    }

    return leads
  }

  // ─── Auto-Scroll Feed ─────────────────────────────────────────────────────
  async function autoScrollAndScrape(maxScrolls, progressCallback) {
    const feed = document.querySelector(SEL.feed)
    if (!feed) {
      throw new Error('Google Maps search results feed not found. Please search for something first.')
    }

    // Scroll down to load more results
    for (let s = 0; s < maxScrolls; s++) {
      feed.scrollBy({ top: 800, behavior: 'smooth' })
      await wait(800)

      // Check if end-of-results reached
      const endMsg = document.querySelector('.PbZDve')
      if (endMsg && endMsg.innerText?.includes("end")) break
    }

    // Now scrape all loaded cards
    return await scrapeAllLeadsFromFeed(progressCallback)
  }

  // ─── Message Listener ─────────────────────────────────────────────────────
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'SCRAPE_MAPS_LEADS') {
      // Reset dedup for fresh scrape
      seenKeys.clear()
      scrapeAllLeadsFromFeed((progress) => {
        // Send progress updates
        chrome.runtime.sendMessage({
          action: 'SCRAPE_PROGRESS',
          processed: progress.processed,
          total: progress.total,
          latest: progress.latest,
        }).catch(() => {}) // ignore if popup is closed
      })
        .then(leads => sendResponse({ status: 'success', count: leads.length, data: leads }))
        .catch(err  => sendResponse({ status: 'error', message: err.message }))
      return true // async

    } else if (request.action === 'AUTO_SCROLL_FEED') {
      seenKeys.clear()
      const maxScrolls = request.maxScrolls || 10
      autoScrollAndScrape(maxScrolls, (progress) => {
        chrome.runtime.sendMessage({
          action: 'SCRAPE_PROGRESS',
          processed: progress.processed,
          total: progress.total,
          latest: progress.latest,
        }).catch(() => {})
      })
        .then(leads => sendResponse({ status: 'success', count: leads.length, data: leads }))
        .catch(err  => sendResponse({ status: 'error', message: err.message }))
      return true // async

    } else if (request.action === 'SCRAPE_DETAIL_PANE') {
      // Scrape only the currently open detail pane (single place)
      const lead = extractCurrentDetailPane()
      sendResponse(lead
        ? { status: 'success', data: lead }
        : { status: 'error', message: 'No business detail pane found on this page.' }
      )
    } else if (request.action === 'PING') {
      sendResponse({ status: 'ok' })
    }
  })

  console.log('[SpringWeb Scraper v2.0] Content script loaded on:', window.location.href)
})()
