/**
 * SpringWeb Instant Lead Scraper v2.1 - Service Worker (Background)
 * - Uses Supabase REST UPSERT with deduplication on normalized_phone
 * - Handles CORS for cross-origin Supabase calls from extension
 */

importScripts('cleaner.js')

const DEFAULT_SUPABASE_URL = ''
const DEFAULT_SUPABASE_KEY = ''

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    supabaseUrl:  DEFAULT_SUPABASE_URL,
    supabaseKey:  DEFAULT_SUPABASE_KEY,
    scrapedLeads: [],
    syncedCount:  0,
  })
  console.log('[SpringWeb v2.0 Extension Installed]')
})

// Runtime settings cache (updated by popup Settings tab)
let runtimeSupabaseUrl = ''
let runtimeSupabaseKey = ''

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SYNC_LEADS_TO_ADMIN') {
    syncLeadsToSupabase(request.leads)
      .then(res => sendResponse({ status: 'success', synced: res.synced, errors: res.errors }))
      .catch(err => sendResponse({ status: 'error', message: err.message }))
    return true // async

  } else if (request.action === 'ENRICH_LEADS') {
    enrichMultipleLeads(request.leads)
      .then(res => sendResponse({ status: 'success', data: res }))
      .catch(err => sendResponse({ status: 'error', message: err.message }))
    return true // async

  } else if (request.action === 'SYNC_TO_GOOGLE_SHEETS') {
    syncLeadsToGoogleSheets(request.leads, request.webAppUrl)
      .then(res => sendResponse({ status: 'success', ...res }))
      .catch(err => sendResponse({ status: 'error', message: err.message }))
    return true // async

  } else if (request.action === 'UPDATE_SETTINGS') {
    // Live-update Supabase credentials without reloading extension
    if (request.supabaseUrl) runtimeSupabaseUrl = request.supabaseUrl
    if (request.supabaseKey) runtimeSupabaseKey = request.supabaseKey
    sendResponse({ status: 'ok' })
  }
})

async function syncLeadsToSupabase(leads) {
  const store = await chrome.storage.local.get(['supabaseUrl', 'supabaseKey'])
  const url   = (runtimeSupabaseUrl || store.supabaseUrl || DEFAULT_SUPABASE_URL).trim().replace(/\/$/, '')
  const key   = (runtimeSupabaseKey || store.supabaseKey || DEFAULT_SUPABASE_KEY).trim()

  if (!url || !key) {
    throw new Error('Supabase URL or Key missing. Check extension settings.')
  }

  // Clean and score all leads first
  const payloads = leads
    .map(rawItem => {
      try { return cleanAndScoreLead(rawItem) } catch { return null }
    })
    .filter(Boolean)

  if (payloads.length === 0) return { synced: 0, errors: 0 }

  // Batch upsert (Supabase supports batch insert in one request)
  // Use "on conflict" upsert on normalized_phone for deduplication
  try {
    const response = await fetch(`${url}/rest/v1/businesses`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        key,
        'Authorization': `Bearer ${key}`,
        // UPSERT: if row with same normalized_phone exists, update it instead of inserting duplicate
        'Prefer':        'return=minimal,resolution=merge-duplicates',
      },
      body: JSON.stringify(payloads),
    })

    if (response.ok) {
      const synced = payloads.length
      // Update total synced counter
      const current = await chrome.storage.local.get(['syncedCount'])
      await chrome.storage.local.set({ syncedCount: (current.syncedCount || 0) + synced })
      return { synced, errors: 0 }
    } else {
      // Try individual inserts as fallback
      return await syncIndividually(payloads, url, key)
    }
  } catch (e) {
    // Network error — try individually
    return await syncIndividually(payloads, url, key)
  }
}

async function syncIndividually(payloads, url, key) {
  let synced = 0
  let errors = 0

  for (const payload of payloads) {
    try {
      const res = await fetch(`${url}/rest/v1/businesses`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'apikey':        key,
          'Authorization': `Bearer ${key}`,
          'Prefer':        'return=minimal,resolution=merge-duplicates',
        },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        synced++
      } else {
        const errText = await res.text().catch(() => '')
        console.warn('[SpringWeb Sync Error]', res.status, errText)
        errors++
      }
    } catch (e) {
      console.warn('[SpringWeb Sync Network Error]', e)
      errors++
    }
  }

  const current = await chrome.storage.local.get(['syncedCount'])
  await chrome.storage.local.set({ syncedCount: (current.syncedCount || 0) + synced })

  return { synced, errors }
}

// ─── Lead website crawl email and social handles enrichment ───────────────
async function enrichLead(lead) {
  if (!lead.website || lead.website.length < 5) return lead

  try {
    const url = lead.website.startsWith('http') ? lead.website : `http://${lead.website}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000) // 4 second timeout per site

    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    clearTimeout(timeoutId)

    if (resp.ok) {
      const html = await resp.text()

      // 1. Email extraction (if lead doesn't already have one)
      if (!lead.email) {
        const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
        if (emailMatch) {
          const matched = emailMatch[0]
          if (!/\.(png|jpg|jpeg|gif|webp|svg|css|js)$/i.test(matched)) {
            lead.email = matched
          }
        }
      }

      // 2. Social handles extraction
      const fbMatch = html.match(/https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._%+-]+/i)
      if (fbMatch && !lead.social_facebook) lead.social_facebook = fbMatch[0]

      const igMatch = html.match(/https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._%+-]+/i)
      if (igMatch && !lead.social_instagram) lead.social_instagram = igMatch[0]

      const liMatch = html.match(/https?:\/\/(www\.)?linkedin\.com\/(company|in)\/[a-zA-Z0-9._%+-]+/i)
      if (liMatch && !lead.social_linkedin) lead.social_linkedin = liMatch[0]

      const twMatch = html.match(/https?:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9._%+-]+/i)
      if (twMatch && !lead.social_twitter) lead.social_twitter = twMatch[0]
    }
  } catch (err) {
    console.warn('[SpringWeb Enrichment Error]', lead.website, err)
  }
  return lead
}

async function enrichMultipleLeads(leads) {
  // Enrich up to 5 leads concurrently to prevent browser rate-limiting or network blockages
  const enriched = []
  const limit = 5
  for (let i = 0; i < leads.length; i += limit) {
    const chunk = leads.slice(i, i + limit)
    const results = await Promise.all(chunk.map(lead => enrichLead(lead)))
    enriched.push(...results)
  }
  return enriched
}

// ─── Google Sheets export sync via Google Apps Script Web App URL ─────────
async function syncLeadsToGoogleSheets(leads, webAppUrl) {
  if (!webAppUrl) {
    throw new Error('Google Sheets Web App URL missing. Check settings.')
  }

  // Use cleanAndScoreLead to format items matching standard layout before sending
  const cleanPayloads = leads.map(l => {
    try {
      // Cleaner might need to be imported or referenced
      return cleanAndScoreLead(l)
    } catch (e) {
      return l
    }
  })

  await fetch(webAppUrl.trim(), {
    method: 'POST',
    mode: 'no-cors', // standard way to bypass GAS webapp redirects CORS block
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cleanPayloads),
  })

  return { success: true, count: cleanPayloads.length }
}
