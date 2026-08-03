/**
 * SpringWeb Instant Lead Scraper - Popup Script
 * Coordinates DOM scraping, UI state updates, real-time Supabase sync, and CSV/JSON export.
 */

document.addEventListener('DOMContentLoaded', () => {
  const btnScrapePage = document.getElementById('btnScrapePage')
  const btnAutoScroll = document.getElementById('btnAutoScroll')
  const btnSyncAdmin = document.getElementById('btnSyncAdmin')
  const btnExportCsv = document.getElementById('btnExportCsv')
  const btnExportJson = document.getElementById('btnExportJson')

  const valFound = document.getElementById('valFound')
  const valCleaned = document.getElementById('valCleaned')
  const valSynced = document.getElementById('valSynced')
  const leadCountBadge = document.getElementById('leadCountBadge')
  const previewList = document.getElementById('previewList')

  let currentLeads = []

  // Load existing session state
  chrome.storage.local.get(['scrapedLeads', 'syncedCount'], (data) => {
    if (data.scrapedLeads && data.scrapedLeads.length > 0) {
      currentLeads = data.scrapedLeads
      renderLeads(currentLeads)
    }
    if (data.syncedCount !== undefined) {
      valSynced.textContent = data.syncedCount
    }
  })

  // 1. Scrape Current Page
  btnScrapePage.addEventListener('click', () => {
    btnScrapePage.disabled = true
    btnScrapePage.innerHTML = '<span>⏳ Scraping...</span>'

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0] || !tabs[0].id) {
        alert('No active tab found.')
        resetBtnScrape()
        return
      }

      chrome.tabs.sendMessage(tabs[0].id, { action: 'SCRAPE_MAPS_LEADS' }, (response) => {
        resetBtnScrape()
        if (chrome.runtime.lastError || !response) {
          alert('Could not communicate with Google Maps page. Please make sure you are on maps.google.com with active search results.')
          return
        }

        if (response.status === 'success' && response.data) {
          currentLeads = response.data
          chrome.storage.local.set({ scrapedLeads: currentLeads })
          renderLeads(currentLeads)
        }
      })
    })
  })

  // 2. Auto-Scroll & Scrape Next 50
  btnAutoScroll.addEventListener('click', () => {
    btnAutoScroll.disabled = true
    btnAutoScroll.innerHTML = '<span>🔄 Auto-Scrolling...</span>'

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0] || !tabs[0].id) {
        alert('No active tab found.')
        resetBtnAutoScroll()
        return
      }

      chrome.tabs.sendMessage(tabs[0].id, { action: 'AUTO_SCROLL_FEED', maxScrolls: 15 }, (response) => {
        resetBtnAutoScroll()
        if (chrome.runtime.lastError || !response) {
          alert('Failed to auto-scroll feed. Ensure Google Maps feed list is focused.')
          return
        }

        if (response.status === 'success' && response.data) {
          currentLeads = response.data
          chrome.storage.local.set({ scrapedLeads: currentLeads })
          renderLeads(currentLeads)
        }
      })
    })
  })

  // 3. Real-Time Sync to Admin Panel
  btnSyncAdmin.addEventListener('click', () => {
    if (currentLeads.length === 0) return
    btnSyncAdmin.disabled = true
    btnSyncAdmin.innerHTML = '<span>🚀 Syncing to Admin...</span>'

    chrome.runtime.sendMessage({ action: 'SYNC_LEADS_TO_ADMIN', leads: currentLeads }, (res) => {
      btnSyncAdmin.disabled = false
      btnSyncAdmin.innerHTML = '<span>🚀 Sync All Cleaned Leads to Admin Panel</span>'

      if (res && res.status === 'success') {
        alert(`✅ Successfully synced ${res.synced} leads directly into SpringWeb Admin Panel!`)
        valSynced.textContent = parseInt(valSynced.textContent || '0', 10) + res.synced
      } else {
        alert(`⚠️ Sync error: ${res?.message || 'Check extension configuration.'}`)
      }
    })
  })

  // 4. Export CSV
  btnExportCsv.addEventListener('click', () => {
    if (currentLeads.length === 0) return alert('No leads to export.')
    let csv = "Name,Category,Phone,Website,City,State,Rating,Reviews\n"
    currentLeads.forEach(l => {
      csv += `"${l.name}","${l.category}","${l.phone || ''}","${l.website || ''}","${l.city}","${l.state}",${l.rating},${l.reviews_count}\n`
    })
    downloadFile(csv, `springweb_maps_leads_${Date.now()}.csv`, 'text/csv')
  })

  // 5. Export JSON
  btnExportJson.addEventListener('click', () => {
    if (currentLeads.length === 0) return alert('No leads to export.')
    const jsonStr = JSON.stringify(currentLeads, null, 2)
    downloadFile(jsonStr, `springweb_maps_leads_${Date.now()}.json`, 'application/json')
  })

  function renderLeads(leads) {
    valFound.textContent = leads.length
    valCleaned.textContent = leads.length
    leadCountBadge.textContent = `${leads.length} leads`

    if (leads.length > 0) {
      btnSyncAdmin.disabled = false
      previewList.innerHTML = ''

      leads.forEach((item) => {
        const cleaned = cleanAndScoreLead(item)
        const row = document.createElement('div')
        row.className = 'lead-item'
        row.innerHTML = `
          <div class="lead-info">
            <span class="lead-title">${cleaned.name}</span>
            <span class="lead-meta">📍 ${cleaned.city}, ${cleaned.state} &bull; 📞 ${cleaned.phone || 'No Phone'}</span>
          </div>
          <div class="score-badge">
            ${cleaned.lead_score} pts
          </div>
        `
        previewList.appendChild(row)
      })
    } else {
      btnSyncAdmin.disabled = true
      previewList.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📍</span>
          <p>Open Google Maps search results and click Scrape Current Page.</p>
        </div>
      `
    }
  }

  function resetBtnScrape() {
    btnScrapePage.disabled = false
    btnScrapePage.innerHTML = '<span class="icon">⚡</span><span>Scrape Current Maps Page</span>'
  }

  function resetBtnAutoScroll() {
    btnAutoScroll.disabled = false
    btnAutoScroll.innerHTML = '<span class="icon">🔄</span><span>Auto-Scroll &amp; Scrape Next 50</span>'
  }

  function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }
})
