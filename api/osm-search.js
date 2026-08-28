// Vercel Serverless Function: OpenStreetMap & Overpass Discovery Engine
// Zero-cost, high-speed POI search with backend User-Agent headers and multi-mirror failover

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const keyword = req.query.keyword || req.body?.keyword || 'Business'
  const location = req.query.location || req.body?.location || 'Udumalpet'
  const state = req.query.state || req.body?.state || 'Tamil Nadu'

  try {
    // Step 1: Geocode location to get coordinates using Photon (OSM)
    let lat = 10.5839
    let lon = 77.25

    try {
      const geoUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(location + ', ' + state)}&limit=1`
      const geoRes = await fetch(geoUrl, {
        headers: { 'User-Agent': 'SpringWebSolutions/1.0 (contact@springwebsolutions.in)' }
      })
      if (geoRes.ok) {
        const geoData = await geoRes.json()
        if (geoData.features && geoData.features.length > 0) {
          const coords = geoData.features[0].geometry.coordinates
          lon = coords[0]
          lat = coords[1]
        }
      }
    } catch (geoErr) {
      console.warn('[OSM Backend] Photon geocoding error:', geoErr)
    }

    // Step 2: Query Overpass with multi-mirror failover
    const kw = keyword.replace(/[^a-zA-Z0-9 ]/g, '').trim()
    const query = `[out:json][timeout:20];(
      nwr["amenity"~"${kw}",i](around:15000,${lat},${lon});
      nwr["shop"~"${kw}",i](around:15000,${lat},${lon});
      nwr["office"~"${kw}",i](around:15000,${lat},${lon});
      nwr["healthcare"~"${kw}",i](around:15000,${lat},${lon});
      nwr["name"~"${kw}",i](around:15000,${lat},${lon});
      nwr["craft"~"${kw}",i](around:15000,${lat},${lon});
    );out center tags 30;`

    const overpassMirrors = [
      'https://overpass-api.de/api/interpreter',
      'https://lz4.overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter'
    ]

    let elements = []

    for (const mirror of overpassMirrors) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3500)

        const opRes = await fetch(mirror, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'SpringWebSolutions-LeadEngine/1.0 (contact@springwebsolutions.in)'
          },
          body: 'data=' + encodeURIComponent(query),
          signal: controller.signal
        })
        clearTimeout(timeoutId)

        if (opRes.ok) {
          const opData = await opRes.json()
          if (opData.elements && opData.elements.length > 0) {
            elements = opData.elements
            break
          }
        }
      } catch (err) {
        console.warn(`[OSM Backend] Mirror ${mirror} failed:`, err.message)
      }
    }

    // Step 3: Format discovered elements
    let leads = elements.map(el => {
      const tags = el.tags || {}
      const name = tags.name || `${keyword} Specialist (${location})`
      const phone = tags.phone || tags['contact:phone'] || tags.mobile || tags['contact:mobile'] || ''
      const website = tags.website || tags['contact:website'] || tags.url || ''
      const email = tags.email || tags['contact:email'] || ''
      const street = tags['addr:street'] || ''
      const city = tags['addr:city'] || location
      const postcode = tags['addr:postcode'] || ''
      const address = [street, city, state, postcode].filter(Boolean).join(', ')

      return {
        name,
        phone: phone || null,
        email: email || null,
        website: website || null,
        address: address || `${location}, ${state}`,
        city: city,
        state: state,
        category: tags.amenity || tags.shop || tags.office || tags.healthcare || keyword
      }
    })

    // End formatting leads

    return res.status(200).json({
      success: true,
      count: leads.length,
      coordinates: { lat, lon },
      leads
    })
  } catch (error) {
    console.error('[OSM Search API Fatal Error]:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to query OpenStreetMap'
    })
  }
}
