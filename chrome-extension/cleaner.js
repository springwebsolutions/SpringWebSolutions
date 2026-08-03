/**
 * SpringWeb Instant Lead Scraper - Lead Cleaning & Scoring Module
 * Cleans phone numbers, calculates lead scores, detects language, and formats payload for Admin Panel.
 */

function normalizePhone(phone) {
  if (!phone) return ''
  let cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.startsWith('91') && cleaned.length > 10) {
    cleaned = cleaned.substring(2)
  }
  if (cleaned.startsWith('0') && cleaned.length > 10) {
    cleaned = cleaned.substring(1)
  }
  return cleaned
}

function calculateLeadScore(item) {
  let score = 0
  const recommended = []
  const hasWebsite = !!item.website && item.website.length > 5

  if (!hasWebsite) {
    score += 40
    recommended.push('Website Development', 'High-Speed Responsive Site')
  } else {
    if (!item.website.startsWith('https')) {
      score += 15
      recommended.push('SSL Certificate Security', 'HTTPS Setup')
    }
    score += 10
    recommended.push('SEO Dominance & AEO Schema', 'Core Web Vitals Tuning')
  }

  if (!item.phone || item.phone.length < 8) {
    score += 10
  } else {
    score += 15
    recommended.push('WhatsApp API Automation', 'Instant Bot Lead Routing')
  }

  const priority = score >= 50 ? 'High' : score >= 25 ? 'Medium' : 'Low'
  
  let valueBand = '₹20K - ₹50K'
  if (score >= 60) valueBand = '₹100K - ₹250K+'
  else if (score >= 35) valueBand = '₹50K - ₹100K'

  return { score, priority, recommended, valueBand }
}

function determineLanguage(state) {
  if (!state) return 'English'
  const norm = state.trim().toLowerCase()
  return norm.includes('tamil') || norm.includes('tn') ? 'Tamil' : 'English'
}

function cleanAndScoreLead(item) {
  const normPhone = normalizePhone(item.phone)
  const { score, priority, recommended, valueBand } = calculateLeadScore(item)
  const language = determineLanguage(item.state)

  return {
    name: item.name || 'Unnamed Business',
    owner_name: item.owner_name || null,
    category: item.category || 'General Business',
    phone: item.phone || null,
    normalized_phone: normPhone || null,
    email: item.email || null,
    whatsapp: item.phone ? item.phone.replace(/[^0-9]/g, '') : null,
    website: item.website || null,
    address: item.address || null,
    city: item.city || 'Udumalpet',
    district: item.district || 'Tiruppur',
    state: item.state || 'Tamil Nadu',
    country: item.country || 'India',
    rating: item.rating || 4.5,
    reviews_count: item.reviews_count || 12,
    lead_score: score,
    priority: priority,
    source: 'Google Maps Extension Scraper',
    dnc_flag: false,
    duplicate_flag: false,
    recommended_services: recommended,
    estimated_value_band: valueBand,
    status: 'New',
    language: language,
    created_at: new Date().toISOString()
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { normalizePhone, calculateLeadScore, determineLanguage, cleanAndScoreLead }
}
