/**
 * SpringWeb Instant Lead Scraper v2.0 - Popup Script
 * - Real-time progress updates during scraping
 * - Deduplication: merges new leads with existing session leads
 * - Sync to Admin Panel via Supabase REST API (background.js)
 * - CSV + JSON export
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── Element refs ────────────────────────────────────────────────────────
  const btnScrapePage  = document.getElementById('btnScrapePage')
  const btnAutoScroll  = document.getElementById('btnAutoScroll')
  const btnSyncAdmin   = document.getElementById('btnSyncAdmin')
  const btnExportCsv   = document.getElementById('btnExportCsv')
  const btnExportJson  = document.getElementById('btnExportJson')
  const btnClear       = document.getElementById('btnClear')

  const valFound       = document.getElementById('valFound')
  const valCleaned     = document.getElementById('valCleaned')
  const valSynced      = document.getElementById('valSynced')
  const valWithPhone   = document.getElementById('valWithPhone')
  const leadCountBadge = document.getElementById('leadCountBadge')
  const previewList    = document.getElementById('previewList')
  const statusBar      = document.getElementById('statusBar')
  const progressBar    = document.getElementById('progressBar')
  const progressFill   = document.getElementById('progressFill')

  let currentLeads = []
  let isScraping   = false

  // ── Load existing session ──────────────────────────────────────────────
  chrome.storage.local.get(['scrapedLeads', 'syncedCount'], (data) => {
    if (data.scrapedLeads && data.scrapedLeads.length > 0) {
      currentLeads = data.scrapedLeads
      renderLeads(currentLeads)
    }
    if (data.syncedCount !== undefined && valSynced) {
      valSynced.textContent = data.syncedCount
    }
  })

  // ── Listen for real-time progress from content.js ─────────────────────
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'SCRAPE_PROGRESS') {
      const { processed, total, latest } = msg
      setStatus(`⏳ Scraping card ${processed} / ${total}: ${latest?.name || ''}`)
      if (total > 0 && progressBar) {
        progressBar.style.display = 'block'
        progressFill.style.width  = Math.round((processed / total) * 100) + '%'
      }
    }
  })

  // ── 1. Scrape Current Page ────────────────────────────────────────────
  btnScrapePage?.addEventListener('click', async () => {
    if (isScraping) return
    isScraping = true
    btnScrapePage.disabled = true
    btnAutoScroll.disabled = true
    setStatus('⏳ Starting scrape...')
    showProgress(true)

    const tabs = await getActiveTab()
    if (!tabs) {
      setStatus('❌ No active Google Maps tab found.')
      resetScrapeButtons()
      return
    }

    // Inject content script if not already present (handles fresh navigations)
    await ensureContentScript(tabs.id)

    chrome.tabs.sendMessage(tabs.id, { action: 'SCRAPE_MAPS_LEADS' }, (response) => {
      resetScrapeButtons()
      showProgress(false)

      if (chrome.runtime.lastError) {
        setStatus('❌ Cannot connect to Google Maps page. Navigate to maps.google.com and search first.')
        return
      }
      if (!response) {
        setStatus('❌ No response from content script. Please reload the Google Maps page.')
        return
      }
      if (response.status === 'success' && response.data) {
        const fresh = response.data
        mergeLeads(fresh)
        setStatus(`✅ Scraped ${fresh.length} leads (${countWithPhone(currentLeads)} with phone).`)
      } else {
        setStatus(`❌ Error: ${response.message || 'Unknown error'}`)
      }
    })
  })

  // ── 2. Auto-Scroll & Scrape ───────────────────────────────────────────
  btnAutoScroll?.addEventListener('click', async () => {
    if (isScraping) return
    isScraping = true
    btnScrapePage.disabled = true
    btnAutoScroll.disabled = true
    btnAutoScroll.innerHTML = '<span class="icon">🔄</span><span>Auto-Scrolling...</span>'
    setStatus('⏳ Auto-scrolling to load more results...')
    showProgress(true)

    const tabs = await getActiveTab()
    if (!tabs) {
      setStatus('❌ No active Google Maps tab found.')
      resetScrapeButtons()
      return
    }

    await ensureContentScript(tabs.id)

    chrome.tabs.sendMessage(tabs.id, { action: 'AUTO_SCROLL_FEED', maxScrolls: 20 }, (response) => {
      resetScrapeButtons()
      showProgress(false)

      if (chrome.runtime.lastError) {
        setStatus('❌ Cannot connect to Google Maps page.')
        return
      }
      if (!response) {
        setStatus('❌ No response. Reload the page and try again.')
        return
      }
      if (response.status === 'success' && response.data) {
        mergeLeads(response.data)
        setStatus(`✅ Auto-scrolled. ${currentLeads.length} total leads (${countWithPhone(currentLeads)} with phone).`)
      } else {
        setStatus(`❌ ${response.message || 'Unknown error'}`)
      }
    })
  })

  // ── 3. Sync to Admin Panel ───────────────────────────────────────────
  btnSyncAdmin?.addEventListener('click', () => {
    if (currentLeads.length === 0) return
    btnSyncAdmin.disabled = true
    btnSyncAdmin.innerHTML = '<span>🚀 Syncing...</span>'
    setStatus('🔄 Syncing leads to SpringWeb Admin Panel...')

    chrome.runtime.sendMessage({ action: 'SYNC_LEADS_TO_ADMIN', leads: currentLeads }, (res) => {
      btnSyncAdmin.disabled = false
      btnSyncAdmin.innerHTML = '<span class="icon">☁️</span><span>Sync to Admin Panel</span>'

      if (res && res.status === 'success') {
        const newTotal = parseInt(valSynced?.textContent || '0', 10) + (res.synced || 0)
        if (valSynced) valSynced.textContent = newTotal
        setStatus(`✅ Synced ${res.synced} leads to admin! ${res.errors ? res.errors + ' errors.' : ''}`)
      } else {
        setStatus(`❌ Sync failed: ${res?.message || 'Check extension settings.'}`)
      }
    })
  })

  // ── 4. Export CSV ───────────────────────────────────────────────────
  btnExportCsv?.addEventListener('click', () => {
    if (currentLeads.length === 0) return setStatus('⚠️ No leads to export.')
    const rows = ['Name,Category,Phone,Email,Website,City,State,Rating,Score,Priority']
    currentLeads.forEach(l => {
      const cleaned = cleanAndScoreLead(l)
      rows.push([
        `"${esc(l.name)}"`,
        `"${esc(l.category)}"`,
        `"${esc(l.phone || '')}"`,
        `"${esc(l.email || '')}"`,
        `"${esc(l.website || '')}"`,
        `"${esc(l.city)}"`,
        `"${esc(l.state)}"`,
        l.rating || '',
        cleaned.lead_score,
        cleaned.priority,
      ].join(','))
    })
    downloadFile(rows.join('\n'), `springweb_leads_${Date.now()}.csv`, 'text/csv')
    setStatus(`✅ Exported ${currentLeads.length} leads as CSV.`)
  })

  // ── 5. Export JSON ──────────────────────────────────────────────────
  btnExportJson?.addEventListener('click', () => {
    if (currentLeads.length === 0) return setStatus('⚠️ No leads to export.')
    downloadFile(
      JSON.stringify(currentLeads, null, 2),
      `springweb_leads_${Date.now()}.json`,
      'application/json'
    )
    setStatus(`✅ Exported ${currentLeads.length} leads as JSON.`)
  })

  // ── 6. Clear ──────────────────────────────────────────────────────
  btnClear?.addEventListener('click', () => {
    currentLeads = []
    chrome.storage.local.set({ scrapedLeads: [] })
    renderLeads([])
    setStatus('🗑️ Leads cleared.')
  })

  // ── Helpers ──────────────────────────────────────────────────────────

  function mergeLeads(fresh) {
    const seen = new Map()
    // Index existing leads
    currentLeads.forEach(l => {
      const key = dedupKey(l.name, l.phone)
      seen.set(key, l)
    })
    // Merge new
    let added = 0
    fresh.forEach(l => {
      const key = dedupKey(l.name, l.phone)
      if (!seen.has(key)) {
        seen.set(key, l)
        added++
      }
    })
    currentLeads = Array.from(seen.values())
    chrome.storage.local.set({ scrapedLeads: currentLeads })
    renderLeads(currentLeads)
    return added
  }

  function dedupKey(name, phone) {
    const n = (name || '').toLowerCase().replace(/[^a-z0-9]/g, '')
    const p = (phone || '').replace(/[^0-9]/g, '').slice(-10)
    return `${n}::${p}`
  }

  function countWithPhone(leads) {
    return leads.filter(l => l.phone && l.phone.length > 6).length
  }

  function esc(str) {
    return (str || '').replace(/"/g, '""')
  }

  function renderLeads(leads) {
    if (valFound)     valFound.textContent    = leads.length
    if (valCleaned)   valCleaned.textContent  = leads.length
    if (leadCountBadge) leadCountBadge.textContent = leads.length + ' leads'

    const withPhone = countWithPhone(leads)
    if (valWithPhone) valWithPhone.textContent = withPhone

    if (!previewList) return

    if (leads.length === 0) {
      previewList.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📍</span>
          <p>Open <strong>Google Maps</strong>, search for businesses<br>and click <strong>Scrape Current Page</strong>.</p>
        </div>`
      if (btnSyncAdmin) btnSyncAdmin.disabled = true
      return
    }

    if (btnSyncAdmin) btnSyncAdmin.disabled = false
    previewList.innerHTML = ''

    leads.forEach((item) => {
      const cleaned = cleanAndScoreLead(item)
      const phone   = cleaned.phone || item.phone
      const row = document.createElement('div')
      row.className = 'lead-item'
      row.innerHTML = `
        <div class="lead-info">
          <span class="lead-title">${escHtml(item.name)}</span>
          <span class="lead-cat">${escHtml(item.category || '')}</span>
          <span class="lead-meta">
            ${phone ? `<span class="tag phone">📞 ${escHtml(phone)}</span>` : '<span class="tag nophone">❌ No Phone</span>'}
            ${item.email ? `<span class="tag email">✉️ ${escHtml(item.email)}</span>` : ''}
            ${item.website ? `<span class="tag web">🌐 Web</span>` : ''}
            ${item.city ? `<span class="tag city">📍 ${escHtml(item.city)}</span>` : ''}
          </span>
        </div>
        <div class="score-badge ${cleaned.priority.toLowerCase()}">
          ${cleaned.lead_score}<small>pts</small>
        </div>`
      previewList.appendChild(row)
    })
  }

  function escHtml(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  }

  function setStatus(msg) {
    if (statusBar) statusBar.textContent = msg
  }

  function showProgress(show) {
    if (progressBar) progressBar.style.display = show ? 'block' : 'none'
    if (progressFill) progressFill.style.width = '0%'
  }

  function resetScrapeButtons() {
    isScraping = false
    if (btnScrapePage) {
      btnScrapePage.disabled = false
      btnScrapePage.innerHTML = '<span class="icon">⚡</span><span>Scrape Current Page</span>'
    }
    if (btnAutoScroll) {
      btnAutoScroll.disabled = false
      btnAutoScroll.innerHTML = '<span class="icon">🔄</span><span>Auto-Scroll & Scrape More</span>'
    }
  }

  async function getActiveTab() {
    return new Promise(resolve => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0] || null)
      })
    })
  }

  async function ensureContentScript(tabId) {
    // Ping content script to check if it's loaded
    return new Promise(resolve => {
      chrome.tabs.sendMessage(tabId, { action: 'PING' }, (res) => {
        if (chrome.runtime.lastError || !res) {
          // Not loaded — inject it
          chrome.scripting.executeScript(
            { target: { tabId }, files: ['content.js'] },
            () => resolve()
          )
        } else {
          resolve()
        }
      })
    })
  }

  function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }
})
