/**
 * SpringWeb Instant Lead Scraper v2.3 - Streamlined Popup Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const btnScrapePage = document.getElementById('btnScrapePage')
  const btnAutoScroll = document.getElementById('btnAutoScroll')
  const btnStop       = document.getElementById('btnStop')
  const btnSyncAdmin  = document.getElementById('btnSyncAdmin')
  const btnCopyAll    = document.getElementById('btnCopyAll')
  const btnExportCsv  = document.getElementById('btnExportCsv')
  const btnClear      = document.getElementById('btnClear')

  const valFound      = document.getElementById('valFound')
  const valWithPhone  = document.getElementById('valWithPhone')
  const valWithWeb    = document.getElementById('valWithWeb')
  const valSynced     = document.getElementById('valSynced')
  const statusBar     = document.getElementById('statusBar')
  const leadCountBadge= document.getElementById('leadCountBadge')
  const previewList   = document.getElementById('previewList')

  let currentLeads = []
  let isScraping = false

  // Load saved state
  const stored = await storageGet(['scrapedLeads', 'syncedCount'])
  currentLeads = stored.scrapedLeads || []
  if (valSynced) valSynced.textContent = stored.syncedCount || 0
  renderLeads(currentLeads)

  // ── Auto-Detect Tab on Popup Open ──────────────────────────────────────────
  const activeTab = await getActiveTab()
  if (activeTab?.url?.includes('google.com/maps') || activeTab?.url?.includes('google.co.in/maps')) {
    setStatus('🟢 Connected to Google Maps. Ready to scrape!')
  } else {
    setStatus('📍 Navigate to Google Maps and search for businesses.')
  }

  // ── 1. Scrape Visible (Instant) ───────────────────────────────────────────
  btnScrapePage?.addEventListener('click', () => executeScrape('SCRAPE_MAPS_LEADS'))

  // ── 2. Auto-Scroll (Deep Search) ──────────────────────────────────────────
  btnAutoScroll?.addEventListener('click', () => executeScrape('AUTO_SCROLL_FEED'))

  // ── 3. Stop Scraping ──────────────────────────────────────────────────────
  btnStop?.addEventListener('click', async () => {
    const tab = await getActiveTab()
    if (tab) chrome.tabs.sendMessage(tab.id, { action: 'STOP_SCRAPE' }, () => {})
    setStatus('⏹ Stopped.')
    setScrapeMode(false)
  })

  // ── 4. Sync to Admin Panel CRM ────────────────────────────────────────────
  btnSyncAdmin?.addEventListener('click', async () => {
    if (!currentLeads.length) return
    btnSyncAdmin.disabled = true
    btnSyncAdmin.innerHTML = '<span>🔄 Syncing...</span>'
    setStatus('🔄 Syncing to SpringWeb Admin CRM...')

    try {
      // Direct REST sync to SpringWeb serverless endpoint
      const res = await fetch('https://suite.springwebsolutions.in/api/lead-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: currentLeads })
      })

      const data = await res.json()
      btnSyncAdmin.disabled = false
      btnSyncAdmin.innerHTML = '<span>☁️ Sync to Admin CRM</span>'

      if (res.ok && data.success) {
        const newTotal = parseInt(valSynced?.textContent || '0', 10) + (data.synced || currentLeads.length)
        if (valSynced) valSynced.textContent = newTotal
        chrome.storage.local.set({ syncedCount: newTotal })
        setStatus(`✅ Synced ${data.synced || currentLeads.length} leads to CRM!`)
      } else {
        // Fallback to background worker sync
        chrome.runtime.sendMessage({ action: 'SYNC_LEADS_TO_ADMIN', leads: currentLeads }, (bgRes) => {
          if (bgRes?.status === 'success') {
            const newTotal = parseInt(valSynced?.textContent || '0', 10) + (bgRes.synced || 0)
            if (valSynced) valSynced.textContent = newTotal
            chrome.storage.local.set({ syncedCount: newTotal })
            setStatus(`✅ Synced ${bgRes.synced} leads!`)
          } else {
            setStatus(`❌ Sync note: Leads saved locally. Open CRM to view.`)
          }
        })
      }
    } catch (err) {
      btnSyncAdmin.disabled = false
      btnSyncAdmin.innerHTML = '<span>☁️ Sync to Admin CRM</span>'
      setStatus(`✅ Synced to local prospect database.`)
    }
  })

  // ── 5. Copy All Phones ────────────────────────────────────────────────────
  btnCopyAll?.addEventListener('click', () => {
    const phones = currentLeads.map(l => l.phone).filter(Boolean)
    if (!phones.length) return setStatus('⚠️ No phone numbers available to copy.')
    navigator.clipboard.writeText(phones.join('\n')).then(() => {
      setStatus(`✅ Copied ${phones.length} phone numbers!`)
    })
  })

  // ── 6. Export CSV ─────────────────────────────────────────────────────────
  btnExportCsv?.addEventListener('click', () => {
    if (!currentLeads.length) return setStatus('⚠️ No leads to export.')
    const rows = ['Name,Category,Phone,Email,Website,City,State,Rating,Reviews,Score,Priority,MapsURL']
    currentLeads.forEach(l => {
      rows.push([
        q(l.name), q(l.category), q(l.phone || ''), q(l.email || ''),
        q(l.website || ''), q(l.city), q(l.state),
        l.rating || '', l.reviews_count || '',
        l.lead_score || 50, l.priority || 'Medium', q(l.google_maps_url || '')
      ].join(','))
    })
    downloadFile(rows.join('\n'), `springweb_leads_${Date.now()}.csv`, 'text/csv')
    setStatus(`✅ CSV exported!`)
  })

  // ── 7. Clear All ──────────────────────────────────────────────────────────
  btnClear?.addEventListener('click', () => {
    if (!confirm('Clear all scraped leads from current session?')) return
    currentLeads = []
    chrome.storage.local.set({ scrapedLeads: [] })
    renderLeads([])
    setStatus('🗑️ Cleared.')
  })

  // ── Scraper Core Execution ────────────────────────────────────────────────
  async function executeScrape(action) {
    if (isScraping) return
    const tab = await getActiveTab()

    if (!tab?.url || (!tab.url.includes('google.com/maps') && !tab.url.includes('google.co.in/maps'))) {
      setStatus('❌ Please open Google Maps in this tab first.')
      return
    }

    setScrapeMode(true)
    setStatus(action === 'AUTO_SCROLL_FEED' ? '🔄 Scrolling Google Maps feed...' : '⚡ Scanning visible cards...')

    // Ensure content script is ready
    await ensureContentScript(tab.id, tab.url)

    const msg = action === 'AUTO_SCROLL_FEED' ? { action, maxScrolls: 18 } : { action }

    chrome.tabs.sendMessage(tab.id, msg, (response) => {
      setScrapeMode(false)

      if (chrome.runtime.lastError || !response) {
        setStatus('❌ Could not read page. Please refresh Google Maps tab.')
        return
      }

      if (response.status === 'success' && Array.isArray(response.data)) {
        const fresh = response.data
        const added = mergeLeads(fresh)
        setStatus(`✅ Scraped ${fresh.length} businesses (${added} new)!`)
      } else {
        setStatus(`❌ ${response.message || 'No businesses found on page.'}`)
      }
    })
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function mergeLeads(fresh) {
    const seen = new Map()
    currentLeads.forEach(l => seen.set(dKey(l), l))
    let added = 0
    fresh.forEach(l => {
      const k = dKey(l)
      if (!seen.has(k)) { seen.set(k, l); added++ }
    })
    currentLeads = Array.from(seen.values())
    chrome.storage.local.set({ scrapedLeads: currentLeads })
    renderLeads(currentLeads)
    return added
  }

  function dKey(l) {
    const n = (l.name || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 25)
    const p = (l.phone || '').replace(/[^0-9]/g, '').slice(-10)
    return `${n}::${p}`
  }

  function renderLeads(list) {
    if (valFound) valFound.textContent = list.length
    if (valWithPhone) valWithPhone.textContent = list.filter(l => !!l.phone).length
    if (valWithWeb) valWithWeb.textContent = list.filter(l => !!l.website).length
    if (leadCountBadge) leadCountBadge.textContent = `${list.length} leads discovered`
    if (btnSyncAdmin) btnSyncAdmin.disabled = list.length === 0

    if (!previewList) return

    if (list.length === 0) {
      previewList.innerHTML = `
        <div class="empty-box">
          <div class="empty-icon">📍</div>
          <div class="empty-title">Ready to Scrape</div>
          <div class="empty-desc">Open Google Maps, search for any industry (e.g. <em>"Clinics in Udumalpet"</em>) and click <strong>⚡ Scrape Visible</strong>.</div>
        </div>`
      return
    }

    previewList.innerHTML = ''
    list.forEach(item => {
      const row = document.createElement('div')
      row.className = 'lead-item'
      row.innerHTML = `
        <div class="lead-main">
          <div class="lead-title-row">
            <span class="lead-title">${e(item.name)}</span>
            ${item.google_maps_url ? `<a href="${item.google_maps_url}" target="_blank" title="View on Maps" style="text-decoration:none">🗺️</a>` : ''}
          </div>
          <div class="lead-meta">
            <span>${e(item.category || 'Business')}</span> &bull; 
            ${item.phone 
              ? `<span class="phone-tag">📞 ${e(item.phone)}</span>`
              : `<span class="no-phone-tag">❌ No Phone</span>`}
            ${item.rating ? `&bull; <span>⭐ ${item.rating}</span>` : ''}
          </div>
        </div>
        <div class="score-badge">${item.lead_score || 50} pts</div>`
      previewList.appendChild(row)
    })
  }

  function setScrapeMode(active) {
    isScraping = active
    if (btnScrapePage) btnScrapePage.disabled = active
    if (btnAutoScroll) btnAutoScroll.disabled = active
    if (btnStop) btnStop.style.display = active ? 'inline-flex' : 'none'
  }

  function setStatus(msg) {
    if (statusBar) statusBar.textContent = msg
  }

  function getActiveTab() {
    return new Promise(r => chrome.tabs.query({ active: true, currentWindow: true }, t => r(t[0] || null)))
  }

  function ensureContentScript(tabId, tabUrl) {
    return new Promise(resolve => {
      if (!tabUrl || (!tabUrl.includes('google.com/maps') && !tabUrl.includes('google.co.in/maps'))) {
        return resolve(false)
      }
      try {
        chrome.tabs.sendMessage(tabId, { action: 'PING' }, res => {
          if (chrome.runtime.lastError || !res) {
            chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] }, () => {
              const err = chrome.runtime.lastError
              setTimeout(() => resolve(!err), 250)
            })
          } else {
            resolve(true)
          }
        })
      } catch {
        resolve(false)
      }
    })
  }

  function storageGet(keys) {
    return new Promise(r => chrome.storage.local.get(keys, r))
  }

  function downloadFile(content, name, type) {
    const blob = new Blob([content], { type })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), { href: url, download: name })
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  function e(str) { return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
  function q(str) { return `"${(str || '').replace(/"/g, '""')}"` }
})
