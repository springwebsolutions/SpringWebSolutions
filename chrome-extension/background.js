/**
 * SpringWeb Instant Lead Scraper v2.1 - Service Worker (Background)
 * - Uses Supabase REST UPSERT with deduplication on normalized_phone
 * - Handles CORS for cross-origin Supabase calls from extension
 */

importScripts('cleaner.js')

const DEFAULT_SUPABASE_URL = 'https://tdnvitjncffhjxspvpeb.supabase.co'
const DEFAULT_SUPABASE_KEY = 'sb_publishable_8VjQZkKACmqT2P9B1C92mg_5aqGp6uX'

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
