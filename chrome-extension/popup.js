/**
 * SpringWeb Instant Lead Scraper v2.1 – Popup Script
 *
 * New in v2.1:
 * - Tab navigation: Leads / Settings
 * - Stop button: sends STOP_SCRAPE to content script
 * - Filter: phone-only / web-only checkboxes
 * - "Copy All Phones" button
 * - Per-lead: copy-phone, open-maps-url buttons
 * - Settings tab: Supabase URL/key form, scroll count, notify toggle
 * - Chrome badge count update during scraping
 * - Desktop notification on completion
 * - Reviews count, open_status shown in lead cards
 */

document.addEventListener('DOMContentLoaded', async () => {
  // ── Refs ──────────────────────────────────────────────────────────────────
  const btnScrapePage  = document.getElementById('btnScrapePage')
  const btnAutoScroll  = document.getElementById('btnAutoScroll')
  const btnStop        = document.getElementById('btnStop')
  const btnSyncAdmin   = document.getElementById('btnSyncAdmin')
  const btnExportCsv   = document.getElementById('btnExportCsv')
  const btnExportJson  = document.getElementById('btnExportJson')
  const btnClear       = document.getElementById('btnClear')
  const btnCopyAll     = document.getElementById('btnCopyAll')
  const btnSaveSettings = document.getElementById('btnSaveSettings')
  const btnToggleKey   = document.getElementById('btnToggleKey')

  const valFound       = document.getElementById('valFound')
  const valWithPhone   = document.getElementById('valWithPhone')
  const valWithWeb     = document.getElementById('valWithWeb')
  const valSynced      = document.getElementById('valSynced')
  const leadCountBadge = document.getElementById('leadCountBadge')
  const filteredBadge  = document.getElementById('filteredBadge')
  const previewList    = document.getElementById('previewList')
  const statusBar      = document.getElementById('statusBar')
  const progressBar    = document.getElementById('progressBar')
  const progressFill   = document.getElementById('progressFill')
  const progressLabel  = document.getElementById('progressLabel')

  const filterPhone    = document.getElementById('filterPhone')
  const filterWeb      = document.getElementById('filterWeb')

  const inputSupabaseUrl  = document.getElementById('inputSupabaseUrl')
  const inputSupabaseKey  = document.getElementById('inputSupabaseKey')
  const inputScrollCount  = document.getElementById('inputScrollCount')
  const chkNotify         = document.getElementById('chkNotify')
  const settingsSaveMsg   = document.getElementById('settingsSaveMsg')
  const statTotal         = document.getElementById('statTotal')
  const statSynced        = document.getElementById('statSynced')

  let currentLeads = []
  let isScraping   = false

  // ── Load saved settings + session ────────────────────────────────────────
  const stored = await storageGet(['scrapedLeads', 'syncedCount', 'supabaseUrl', 'supabaseKey', 'scrollCount', 'notifyOnDone'])

  currentLeads = stored.scrapedLeads || []
  if (currentLeads.length) renderLeads(currentLeads)
  if (valSynced) valSynced.textContent = stored.syncedCount || 0
  if (inputSupabaseUrl) inputSupabaseUrl.value = stored.supabaseUrl || ''
  if (inputSupabaseKey) inputSupabaseKey.value = stored.supabaseKey || ''
  if (inputScrollCount) inputScrollCount.value = stored.scrollCount || 20
  if (chkNotify) chkNotify.checked = stored.notifyOnDone !== false
  if (statTotal) statTotal.textContent = currentLeads.length
  if (statSynced) statSynced.textContent = stored.syncedCount || 0

  // ── Tab navigation ────────────────────────────────────────────────────────
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
      btn.classList.add('active')
      document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active')
    })
  })

  // ── Real-time progress listener ───────────────────────────────────────────
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'SCRAPE_PROGRESS') {
      const { processed, total, latest } = msg
      const pct = total > 0 ? Math.round((processed / total) * 100) : 0
      setStatus(`⏳ ${processed}/${total} — ${latest?.name || ''}${latest?.phone ? ' · ' + latest.phone : ''}`)
      if (progressBar) {
        progressBar.style.display = 'flex'
        progressFill.style.width  = pct + '%'
        if (progressLabel) progressLabel.textContent = `${processed} / ${total}`
      }
      // Update badge on icon
      chrome.action?.setBadgeText({ text: String(processed) })
      chrome.action?.setBadgeBackgroundColor({ color: '#63eb97' })
    }
  })

  // ── 1. Scrape Current Page ────────────────────────────────────────────────
  btnScrapePage?.addEventListener('click', () => startScrape('SCRAPE_MAPS_LEADS'))

  // ── 2. Auto-Scroll & Scrape ───────────────────────────────────────────────
  btnAutoScroll?.addEventListener('click', () => startScrape('AUTO_SCROLL_FEED'))

  // ── 3. Stop ───────────────────────────────────────────────────────────────
  btnStop?.addEventListener('click', async () => {
    const tab = await getActiveTab()
    if (tab) {
      chrome.tabs.sendMessage(tab.id, { action: 'STOP_SCRAPE' })
    }
    setStatus('⏹ Stopped.')
    resetScrapeButtons()
  })

  // ── 4. Sync to Admin ─────────────────────────────────────────────────────
  btnSyncAdmin?.addEventListener('click', () => {
    if (!currentLeads.length) return
    btnSyncAdmin.disabled = true
    btnSyncAdmin.innerHTML = '<span>🔄 Syncing...</span>'
    setStatus('🔄 Syncing to SpringWeb Admin Panel...')

    chrome.runtime.sendMessage({ action: 'SYNC_LEADS_TO_ADMIN', leads: currentLeads }, (res) => {
      btnSyncAdmin.disabled = false
      btnSyncAdmin.innerHTML = '<span class="icon">☁️</span><span>Sync to Admin</span>'
      if (res?.status === 'success') {
        const newTotal = parseInt(valSynced?.textContent || '0', 10) + (res.synced || 0)
        if (valSynced) valSynced.textContent = newTotal
        if (statSynced) statSynced.textContent = newTotal
        chrome.storage.local.set({ syncedCount: newTotal })
        setStatus(`✅ Synced ${res.synced} leads!${res.errors ? ` (${res.errors} errors)` : ''}`)
      } else {
        setStatus(`❌ Sync failed: ${res?.message || 'Check Settings → Supabase connection.'}`)
      }
    })
  })

  // ── 5. Export CSV ─────────────────────────────────────────────────────────
  btnExportCsv?.addEventListener('click', () => {
    const list = getFilteredLeads()
    if (!list.length) return setStatus('⚠️ No leads to export.')
    const rows = ['Name,Category,Phone,Email,Website,City,State,Rating,Reviews,Score,Priority,MapsURL']
    list.forEach(l => {
      const c = cleanAndScoreLead(l)
      rows.push([
        q(l.name), q(l.category), q(l.phone||''), q(l.email||''),
        q(l.website||''), q(l.city), q(l.state),
        l.rating||'', l.reviews_count||'',
        c.lead_score, c.priority, q(l.google_maps_url||''),
      ].join(','))
    })
    downloadFile(rows.join('\n'), `springweb_leads_${ts()}.csv`, 'text/csv')
    setStatus(`✅ Exported ${list.length} leads as CSV.`)
  })

  // ── 6. Export JSON ────────────────────────────────────────────────────────
  btnExportJson?.addEventListener('click', () => {
    const list = getFilteredLeads()
    if (!list.length) return setStatus('⚠️ No leads to export.')
    downloadFile(JSON.stringify(list, null, 2), `springweb_leads_${ts()}.json`, 'application/json')
    setStatus(`✅ Exported ${list.length} leads as JSON.`)
  })

  // ── 7. Clear ──────────────────────────────────────────────────────────────
  btnClear?.addEventListener('click', () => {
    currentLeads = []
    chrome.storage.local.set({ scrapedLeads: [] })
    renderLeads([])
    chrome.action?.setBadgeText({ text: '' })
    setStatus('🗑️ Leads cleared.')
  })

  // ── 8. Copy All Phones ────────────────────────────────────────────────────
  btnCopyAll?.addEventListener('click', () => {
    const phones = getFilteredLeads()
      .map(l => l.phone)
      .filter(Boolean)
    if (!phones.length) return setStatus('⚠️ No phone numbers to copy.')
    navigator.clipboard.writeText(phones.join('\n')).then(() => {
      setStatus(`✅ Copied ${phones.length} phone numbers to clipboard.`)
    })
  })

  // ── 9. Filter checkboxes ──────────────────────────────────────────────────
  filterPhone?.addEventListener('change', () => renderLeads(currentLeads))
  filterWeb?.addEventListener('change',   () => renderLeads(currentLeads))

  // ── 10. Settings: save ───────────────────────────────────────────────────
  btnSaveSettings?.addEventListener('click', () => {
    const url   = inputSupabaseUrl?.value?.trim() || ''
    const key   = inputSupabaseKey?.value?.trim() || ''
    const count = parseInt(inputScrollCount?.value, 10) || 20
    const notify = chkNotify?.checked !== false
    chrome.storage.local.set({ supabaseUrl: url, supabaseKey: key, scrollCount: count, notifyOnDone: notify })
    // Also tell background to update its cache
    chrome.runtime.sendMessage({ action: 'UPDATE_SETTINGS', supabaseUrl: url, supabaseKey: key })
    settingsSaveMsg.style.display = 'block'
    setTimeout(() => { settingsSaveMsg.style.display = 'none' }, 2000)
  })

  // ── 11. Toggle key visibility ────────────────────────────────────────────
  btnToggleKey?.addEventListener('click', () => {
    const isPassword = inputSupabaseKey?.type === 'password'
    inputSupabaseKey.type = isPassword ? 'text' : 'password'
    btnToggleKey.textContent = isPassword ? '🙈 Hide key' : '👁 Show key'
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // Core scrape launcher
  // ═══════════════════════════════════════════════════════════════════════════
  async function startScrape(action) {
    if (isScraping) return
    isScraping = true
    setScrapeMode(true)
    setStatus('⏳ Connecting to Google Maps page...')

    const tab = await getActiveTab()
    if (!tab) {
      setStatus('❌ No active Google Maps tab found.')
      setScrapeMode(false)
      return
    }

    if (!tab.url?.includes('google.com/maps')) {
      setStatus('❌ Please navigate to Google Maps first.')
      setScrapeMode(false)
      return
    }

    await ensureContentScript(tab.id)

    const scrollCount = parseInt(inputScrollCount?.value, 10) || 20
    const msg = action === 'AUTO_SCROLL_FEED'
      ? { action, maxScrolls: scrollCount }
      : { action }

    setStatus(action === 'AUTO_SCROLL_FEED'
      ? `⏳ Auto-scrolling ${scrollCount}x then scraping...`
      : '⏳ Scraping visible results...')

    chrome.tabs.sendMessage(tab.id, msg, (response) => {
      setScrapeMode(false)

      if (chrome.runtime.lastError || !response) {
        setStatus('❌ Could not connect. Reload the Google Maps tab and try again.')
        return
      }
      if (response.status === 'success' && response.data) {
        const added = mergeLeads(response.data)
        const wp = countWithPhone(currentLeads)
        setStatus(`✅ Done! ${response.data.length} scraped, ${added} new. ${wp} with phone numbers.`)

        // Completion notification
        if (stored.notifyOnDone !== false && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('SpringWeb Scraper ✅', {
            body: `Scraped ${response.data.length} leads (${wp} with phone)`,
            icon: 'icons/icon48.png',
          })
        }

        chrome.action?.setBadgeText({ text: String(currentLeads.length) })
        chrome.action?.setBadgeBackgroundColor({ color: '#63eb97' })
      } else {
        setStatus(`❌ ${response.message || 'Scraping failed. Check the page.'}`)
      }
    })
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function getFilteredLeads() {
    let list = currentLeads
    if (filterPhone?.checked) list = list.filter(l => l.phone && l.phone.length > 6)
    if (filterWeb?.checked)   list = list.filter(l => l.website)
    return list
  }

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
    if (statTotal) statTotal.textContent = currentLeads.length
    return added
  }

  function dKey(l) {
    const n = (l.name || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 25)
    const p = (l.phone || '').replace(/[^0-9]/g, '').slice(-10)
    return `${n}::${p}`
  }

  function countWithPhone(list) {
    return list.filter(l => l.phone && l.phone.length > 6).length
  }

  function countWithWeb(list) {
    return list.filter(l => l.website).length
  }

  function renderLeads(allLeads) {
    const list = getFilteredLeads()

    // Update metrics
    if (valFound)     valFound.textContent     = allLeads.length
    if (valWithPhone) valWithPhone.textContent  = countWithPhone(allLeads)
    if (valWithWeb)   valWithWeb.textContent    = countWithWeb(allLeads)
    if (leadCountBadge) leadCountBadge.textContent = `${allLeads.length} leads`

    const isFiltered = list.length !== allLeads.length
    if (filteredBadge) {
      filteredBadge.style.display = isFiltered ? 'inline-block' : 'none'
      filteredBadge.textContent   = `${list.length} shown`
    }

    if (btnSyncAdmin) btnSyncAdmin.disabled = allLeads.length === 0

    if (!previewList) return

    if (list.length === 0) {
      previewList.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">${allLeads.length > 0 ? '🔍' : '📍'}</span>
          <p>${allLeads.length > 0
            ? 'No leads match the current filter.'
            : 'Open <strong>Google Maps</strong>, search for local businesses<br>and click <strong>⚡ Scrape Page</strong>.'
          }</p>
        </div>`
      return
    }

    previewList.innerHTML = ''
    list.forEach(item => {
      const c     = cleanAndScoreLead(item)
      const phone = c.phone || item.phone
      const row   = document.createElement('div')
      row.className = 'lead-item'

      // Rating + reviews text
      const ratingText = item.rating
        ? `⭐ ${item.rating}${item.reviews_count ? ` (${item.reviews_count.toLocaleString()})` : ''}`
        : ''

      row.innerHTML = `
        <div class="lead-info">
          <div class="lead-title-row">
            <span class="lead-title">${e(item.name)}</span>
            ${item.google_maps_url
              ? `<a class="maps-link" href="${item.google_maps_url}" target="_blank" title="Open in Maps">🗺️</a>`
              : ''}
          </div>
          <span class="lead-cat">${e(item.category || '')}</span>
          <div class="lead-meta">
            ${phone
              ? `<span class="tag phone">📞 ${e(phone)}</span>
                 <button class="copy-btn" data-copy="${e(phone)}" title="Copy phone">⎘</button>`
              : '<span class="tag nophone">❌ No Phone</span>'}
            ${item.email    ? `<span class="tag email">✉️ ${e(item.email)}</span>` : ''}
            ${item.website  ? `<span class="tag web">🌐</span>` : ''}
            ${item.city     ? `<span class="tag city">📍 ${e(item.city)}</span>` : ''}
          </div>
          <div class="lead-sub">
            ${ratingText ? `<span class="rating-txt">${ratingText}</span>` : ''}
            ${item.open_status ? `<span class="open-status ${item.open_status === 'Open Now' ? 'open' : 'closed'}">${e(item.open_status)}</span>` : ''}
          </div>
        </div>
        <div class="score-badge ${c.priority.toLowerCase()}">
          ${c.lead_score}<small>pts</small>
        </div>`

      // Copy button handler
      row.querySelector('.copy-btn')?.addEventListener('click', (evt) => {
        evt.stopPropagation()
        const txt = evt.currentTarget.dataset.copy
        navigator.clipboard.writeText(txt).then(() => {
          const btn = evt.currentTarget
          btn.textContent = '✅'
          setTimeout(() => { btn.textContent = '⎘' }, 1500)
        })
      })

      previewList.appendChild(row)
    })
  }

  function setScrapeMode(active) {
    isScraping = active
    if (btnScrapePage) btnScrapePage.disabled = active
    if (btnAutoScroll) btnAutoScroll.disabled = active
    if (btnStop) btnStop.style.display = active ? 'flex' : 'none'
    if (!active) {
      if (progressBar) progressBar.style.display = 'none'
      if (btnScrapePage) btnScrapePage.innerHTML = '<span class="icon">⚡</span><span>Scrape Page</span>'
      if (btnAutoScroll) btnAutoScroll.innerHTML = '<span class="icon">🔄</span><span>Auto-Scroll</span>'
    }
  }

  function setStatus(msg) { if (statusBar) statusBar.textContent = msg }

  function getActiveTab() {
    return new Promise(r => chrome.tabs.query({ active: true, currentWindow: true }, t => r(t[0] || null)))
  }

  function ensureContentScript(tabId) {
    return new Promise(resolve => {
      chrome.tabs.sendMessage(tabId, { action: 'PING' }, res => {
        if (chrome.runtime.lastError || !res) {
          chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] }, () => {
            setTimeout(resolve, 200)
          })
        } else {
          resolve()
        }
      })
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

  function e(str)  { return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
  function q(str)  { return `"${(str || '').replace(/"/g, '""')}"` }
  function ts()    { return new Date().toISOString().slice(0,19).replace(/[T:]/g, '-') }

  // Request notification permission proactively
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
})
