/**
 * SpringWeb Instant Lead Scraper - Service Worker (Background)
 * Manages background tasks, cross-origin Supabase REST sync, and storage state.
 */

importScripts('cleaner.js')

const DEFAULT_SUPABASE_URL = 'https://tdnvitjncffhjxspvpeb.supabase.co'
const DEFAULT_SUPABASE_KEY = 'sb_publishable_8VjQZkKACmqT2P9B1C92mg_5aqGp6uX'

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    supabaseUrl: DEFAULT_SUPABASE_URL,
    supabaseKey: DEFAULT_SUPABASE_KEY,
    scrapedLeads: [],
    syncedCount: 0
  })
  console.log('[SpringWeb Extension Installed]: Initialized storage.')
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SYNC_LEADS_TO_ADMIN') {
    syncLeadsToSupabase(request.leads)
      .then(res => sendResponse({ status: 'success', synced: res.synced, errors: res.errors }))
      .catch(err => sendResponse({ status: 'error', message: err.message }))
    return true // Async response
  }
})

async function syncLeadsToSupabase(leads) {
  const store = await chrome.storage.local.get(['supabaseUrl', 'supabaseKey'])
  const url = (store.supabaseUrl || DEFAULT_SUPABASE_URL).trim()
  const key = (store.supabaseKey || DEFAULT_SUPABASE_KEY).trim()

  if (!url || !key) {
    throw new Error('Supabase URL or Anon Key missing in extension settings.')
  }

  let synced = 0
  let errors = 0

  for (const rawItem of leads) {
    try {
      const cleanedPayload = cleanAndScoreLead(rawItem)

      // Post directly to Supabase REST API businesses endpoint
      const response = await fetch(`${url}/rest/v1/businesses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(cleanedPayload)
      })

      if (response.ok) {
        synced++
      } else {
        errors++
      }
    } catch (e) {
      errors++
    }
  }

  // Update synced counter in local storage
  const current = await chrome.storage.local.get(['syncedCount'])
  await chrome.storage.local.set({ syncedCount: (current.syncedCount || 0) + synced })

  return { synced, errors }
}
