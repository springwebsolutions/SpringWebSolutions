/**
 * SpringWeb Instant Lead Scraper - Content Script
 * Scrapes Google Maps DOM business cards, extracts phone numbers, address, rating, website,
 * and passes scraped raw items to the extension popup & background worker.
 */

(() => {
  // Listen for extraction commands from popup or background worker
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'SCRAPE_MAPS_LEADS') {
      const results = extractGoogleMapsLeads()
      sendResponse({ status: 'success', count: results.length, data: results })
    } else if (request.action === 'AUTO_SCROLL_FEED') {
      autoScrollFeedContainer(request.maxScrolls || 10, sendResponse)
      return true // Async response
    }
  })

  function extractGoogleMapsLeads() {
    const leads = []
    const seenNames = new Set()

    // Query selector strategies for Google Maps feed items
    const feedItems = document.querySelectorAll('div[role="feed"] > div, .Nv2pk, .hfjdbl, div[data-result-index]')

    feedItems.forEach((item, idx) => {
      try {
        // Extract Title / Business Name
        const nameEl = item.querySelector('.qBF1Pd, .fontHeadlineSmall, .section-result-title, h3, a[href*="/maps/place"]')
        const name = nameEl ? nameEl.textContent.trim() : ''

        if (!name || name.length < 2 || seenNames.has(name.toLowerCase())) return
        seenNames.add(name.toLowerCase())

        // Extract Rating & Reviews
        const ratingEl = item.querySelector('.MW450e, .fontBodyMedium span[role="img"], .cards-rating-score')
        const ratingText = ratingEl ? ratingEl.textContent.trim() : ''
        const rating = parseFloat(ratingText) || 4.5

        const reviewsEl = item.querySelector('.UY7F9, .fontBodyMedium span:nth-child(2), .section-result-num-ratings')
        const reviewsText = reviewsEl ? reviewsEl.textContent.replace(/[^0-9]/g, '') : ''
        const reviews_count = parseInt(reviewsText, 10) || 15

        // Extract Category & Address details
        const detailsContainer = item.querySelectorAll('.W4Efsd, .fontBodyMedium')
        let category = 'General Business'
        let address = ''
        let phone = ''

        detailsContainer.forEach(detail => {
          const text = detail.textContent.trim()
          
          // Match Phone Number pattern (+91 xxxxx xxxxx or 0xxxx xxxxxx or 10-12 digits)
          const phoneMatch = text.match(/(?:\+91[\s-]?)?[0-9]{3,5}[\s-]?[0-9]{4,6}/)
          if (phoneMatch && !phone) {
            phone = phoneMatch[0].trim()
          }

          // Category detection
          if (text.includes('·')) {
            const parts = text.split('·')
            if (parts[0] && parts[0].length < 35) {
              category = parts[0].trim()
            }
            if (parts[1] && !address) {
              address = parts[1].trim()
            }
          }
        })

        // Extract Website Link
        const websiteEl = item.querySelector('a[data-value="Website"], a[href^="http"]:not([href*="google.com"])')
        let website = websiteEl ? websiteEl.getAttribute('href') : null
        if (website && website.includes('google.com/url?q=')) {
          const urlParams = new URLSearchParams(website.split('?')[1])
          website = urlParams.get('q') || website
        }

        // Infer City/Location from Search Input or Page Title
        const searchInput = document.querySelector('#searchboxinput, input[name="q"]')
        const searchVal = searchInput ? searchInput.value : document.title

        let city = 'Udumalpet'
        let state = 'Tamil Nadu'
        if (searchVal.toLowerCase().includes('tiruppur')) city = 'Tiruppur'
        if (searchVal.toLowerCase().includes('coimbatore')) city = 'Coimbatore'
        if (searchVal.toLowerCase().includes('chennai')) city = 'Chennai'
        if (searchVal.toLowerCase().includes('bengaluru') || searchVal.toLowerCase().includes('bangalore')) {
          city = 'Bengaluru'
          state = 'Karnataka'
        }

        leads.push({
          id: `ext-lead-${Date.now()}-${idx}`,
          name,
          category,
          phone: phone || null,
          website: website || null,
          address: address || `${city}, ${state}`,
          city,
          district: city === 'Udumalpet' ? 'Tiruppur' : city,
          state,
          country: 'India',
          rating,
          reviews_count,
          source: 'Google Maps Extension Scraper'
        })
      } catch (err) {
        // Continue loop on minor parse anomaly
      }
    })

    return leads
  }

  function autoScrollFeedContainer(maxScrolls, sendResponse) {
    const feed = document.querySelector('div[role="feed"]')
    if (!feed) {
      sendResponse({ status: 'error', message: 'Google Maps feed container not found. Open a search result on maps.google.com.' })
      return
    }

    let scrollsDone = 0
    const interval = setInterval(() => {
      feed.scrollTop += 800
      scrollsDone++

      if (scrollsDone >= maxScrolls) {
        clearInterval(interval)
        const leads = extractGoogleMapsLeads()
        sendResponse({ status: 'success', count: leads.length, data: leads })
      }
    }, 600)
  }
})()
