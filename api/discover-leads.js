// Vercel Serverless Function: Multi-Provider Real-Time Business Discovery Engine
// Supports: OpenStreetMap (Multi-term Parallel Photon + Nominatim), Google Maps Places API, Mapbox, Geoapify, LocationIQ

export default async function handler(req, res) {
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
  const country = req.query.country || req.body?.country || 'India'
  const source = req.query.source || req.body?.source || 'openstreetmap'
  const apiKey = req.query.apiKey || req.body?.apiKey || ''

  try {
    let rawLeads = []

    // =========================================================================
    // PROVIDER 1: GOOGLE MAPS PLACES API (Official Text Search)
    // =========================================================================
    if (source === 'google') {
      const googleKey = apiKey || process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY
      if (!googleKey) {
        return res.status(400).json({
          success: false,
          error: 'Google Maps API Key is missing. Please provide your key in the API Keys settings drawer.'
        })
      }

      const searchQuery = `${keyword} in ${location}, ${state}, ${country}`
      const googleUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${googleKey}`
      
      const gRes = await fetch(googleUrl)
      if (!gRes.ok) throw new Error(`Google Maps API returned HTTP ${gRes.status}`)
      const gData = await gRes.json()

      if (gData.status === 'REQUEST_DENIED' || gData.status === 'INVALID_REQUEST') {
        throw new Error(`Google Maps API error: ${gData.error_message || gData.status}`)
      }

      const results = gData.results || []
      rawLeads = results.map(place => ({
        name: place.name || keyword,
        phone: null,
        email: null,
        website: null,
        address: place.formatted_address || `${location}, ${state}`,
        city: location,
        state: state,
        category: (place.types && place.types[0]) ? place.types[0].replace(/_/g, ' ') : keyword,
        rating: place.rating || 4.5,
        reviews_count: place.user_ratings_total || 10,
        source: 'Google Maps API'
      }))
    }

    // =========================================================================
    // PROVIDER 2: MAPBOX SEARCH BOX API
    // =========================================================================
    else if (source === 'mapbox') {
      const mapboxKey = apiKey || process.env.MAPBOX_ACCESS_TOKEN
      if (!mapboxKey) {
        return res.status(400).json({
          success: false,
          error: 'Mapbox Access Token is missing. Please enter your token in settings.'
        })
      }

      const queryUrl = `https://api.mapbox.com/search/searchbox/v1/forward?q=${encodeURIComponent(keyword + ' ' + location)}&types=poi&limit=25&access_token=${mapboxKey}`
      const mbRes = await fetch(queryUrl)
      if (!mbRes.ok) throw new Error(`Mapbox API returned HTTP ${mbRes.status}`)
      const mbData = await mbRes.json()

      rawLeads = (mbData.features || []).map(feat => {
        const p = feat.properties || {}
        return {
          name: p.name || keyword,
          phone: p.telephone || p.phone || null,
          email: null,
          website: p.website || null,
          address: p.full_address || p.address || `${location}, ${state}`,
          city: location,
          state: state,
          category: p.category?.[0] || p.poi_category?.[0] || keyword,
          rating: 4.5,
          reviews_count: 12,
          source: 'Mapbox Search API'
        }
      })
    }

    // =========================================================================
    // PROVIDER 3: GEOAPIFY PLACES API
    // =========================================================================
    else if (source === 'geoapify') {
      const geoapifyKey = apiKey || process.env.GEOAPIFY_API_KEY
      if (!geoapifyKey) {
        return res.status(400).json({
          success: false,
          error: 'Geoapify API Key is missing. Please enter your key in settings.'
        })
      }

      const geoRes = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location + ', ' + state)}&apiKey=${geoapifyKey}`)
      const geoData = await geoRes.json()
      let lat = 10.5839, lon = 77.25
      if (geoData.features && geoData.features.length > 0) {
        const coords = geoData.features[0].geometry.coordinates
        lon = coords[0]
        lat = coords[1]
      }

      const placesUrl = `https://api.geoapify.com/v2/places?categories=commercial,catering,education,healthcare,leisure,service,tourism&filter=circle:${lon},${lat},15000&name=${encodeURIComponent(keyword)}&limit=25&apiKey=${geoapifyKey}`
      const pRes = await fetch(placesUrl)
      const pData = await pRes.json()

      rawLeads = (pData.features || []).map(feat => {
        const p = feat.properties || {}
        return {
          name: p.name || keyword,
          phone: p.datasource?.raw?.phone || p.phone || null,
          email: p.datasource?.raw?.email || p.email || null,
          website: p.datasource?.raw?.website || p.website || null,
          address: p.formatted || p.address_line2 || `${location}, ${state}`,
          city: location,
          state: state,
          category: p.categories?.[0] || keyword,
          rating: 4.5,
          reviews_count: 12,
          source: 'Geoapify Places API'
        }
      })
    }

    // =========================================================================
    // PROVIDER 4: LOCATIONIQ SEARCH API
    // =========================================================================
    else if (source === 'locationiq') {
      const locKey = apiKey || process.env.LOCATIONIQ_ACCESS_TOKEN
      if (!locKey) {
        return res.status(400).json({
          success: false,
          error: 'LocationIQ Access Token is missing. Please enter your token in settings.'
        })
      }

      const liqUrl = `https://us1.locationiq.com/v1/search?key=${locKey}&q=${encodeURIComponent(keyword + ', ' + location + ', ' + state)}&format=json&addressdetails=1&limit=25`
      const liqRes = await fetch(liqUrl)
      const liqData = await liqRes.json()

      const list = Array.isArray(liqData) ? liqData : []
      rawLeads = list.map(item => {
        const addr = item.address || {}
        return {
          name: item.display_name?.split(',')?.[0] || keyword,
          phone: addr.phone || null,
          email: addr.email || null,
          website: addr.website || null,
          address: item.display_name || `${location}, ${state}`,
          city: addr.city || addr.town || addr.village || location,
          state: addr.state || state,
          category: item.type || item.class || keyword,
          rating: 4.5,
          reviews_count: 12,
          source: 'LocationIQ API'
        }
      })
    }

    // =========================================================================
    // PROVIDER 5 (DEFAULT): MULTI-TERM PARALLEL OPENSTREETMAP DISCOVERY
    // =========================================================================
    else {
      const synonyms = {
        clinic: ['clinic', 'hospital', 'doctor', 'healthcare', 'medical', 'pharmacy', 'dental', 'nursing', 'eye care', 'scan', 'lab'],
        hospital: ['hospital', 'clinic', 'healthcare', 'medical', 'emergency', 'maternity', 'care'],
        doctor: ['doctor', 'clinic', 'hospital', 'physician', 'specialist', 'dental', 'medical'],
        textile: ['textile', 'spinning', 'cotton', 'garment', 'mills', 'fabrics', 'handloom', 'weaving', 'yarn'],
        hotel: ['hotel', 'restaurant', 'lodging', 'resort', 'motel', 'dhaba', 'inn', 'cafe'],
        restaurant: ['restaurant', 'hotel', 'cafe', 'bakery', 'sweets', 'bhojanalaya', 'fast food', 'eatery'],
        school: ['school', 'college', 'academy', 'institute', 'polytechnic', 'university', 'vidyalaya', 'matriculation'],
        college: ['college', 'polytechnic', 'engineering', 'arts science', 'university', 'institute', 'academy'],
        software: ['software', 'it services', 'tech', 'computer', 'digital', 'developer', 'web', 'solutions'],
        manufacturer: ['manufacturing', 'factory', 'industry', 'engineering', 'works', 'enterprise', 'packaging'],
        jeweller: ['jewellers', 'jewellery', 'gold', 'silver', 'diamonds', 'ornaments'],
        auto: ['automobiles', 'motors', 'garage', 'service centre', 'spares', 'tyres', 'mechanic', 'honda', 'hero']
      }

      const kwLower = keyword.toLowerCase()
      let searchTerms = [keyword]
      for (const [key, list] of Object.entries(synonyms)) {
        if (kwLower.includes(key) || list.some(s => kwLower.includes(s))) {
          searchTerms = Array.from(new Set([keyword, ...list]))
          break
        }
      }

      const roadTags = [
        'highway', 'secondary', 'primary', 'trunk', 'tertiary', 'residential', 
        'service', 'track', 'footway', 'path', 'cycleway', 'motorway', 'unclassified', 
        'bus_stop', 'administrative', 'boundary', 'place', 'waterway'
      ]

      // Query Photon in parallel across expanded terms
      const photonPromises = searchTerms.slice(0, 7).map(async term => {
        try {
          const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(term + ' in ' + location)}&limit=30`
          const pRes = await fetch(photonUrl, {
            headers: { 'User-Agent': 'SpringWebSolutions-Discovery/1.2' }
          })
          if (pRes.ok) {
            const pData = await pRes.json()
            return (pData.features || []).map(f => {
              const p = f.properties || {}
              const isRoad = p.osm_key === 'highway' || roadTags.includes(p.osm_value) || roadTags.includes(p.osm_key) || p.osm_key === 'boundary' || p.osm_key === 'place'
              if (p.name && !isRoad) {
                return {
                  name: p.name,
                  phone: p.phone || p['contact:phone'] || p.mobile || null,
                  email: p.email || p['contact:email'] || null,
                  website: p.website || p['contact:website'] || null,
                  address: [p.street, p.city || location, state, p.postcode].filter(Boolean).join(', ') || `${location}, ${state}`,
                  city: p.city || p.district || location,
                  state: state,
                  category: p.osm_value || p.osm_key || term,
                  rating: 4.6,
                  reviews_count: 15,
                  source: 'OpenStreetMap API'
                }
              }
              return null
            }).filter(Boolean)
          }
        } catch (err) {
          return []
        }
        return []
      })

      // Query Nominatim in parallel
      const nominatimPromise = (async () => {
        try {
          const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(keyword + ' ' + location + ' ' + state)}&format=json&addressdetails=1&extratags=1&limit=25`
          const nomRes = await fetch(nomUrl, {
            headers: {
              'User-Agent': 'SpringWebSolutions-Engine/1.2 (contact@springwebsolutions.in)',
              'Accept': 'application/json'
            }
          })
          if (nomRes.ok) {
            const nomData = await nomRes.json()
            if (Array.isArray(nomData)) {
              return nomData.map(item => {
                const tags = item.extratags || {}
                const addr = item.address || {}
                const name = item.name || item.display_name?.split(',')?.[0] || keyword
                const isRoad = item.class === 'highway' || item.class === 'boundary' || item.class === 'place' || roadTags.includes(item.type)
                if (!isRoad && name) {
                  return {
                    name,
                    phone: tags.phone || tags['contact:phone'] || tags.mobile || null,
                    email: tags.email || tags['contact:email'] || null,
                    website: tags.website || tags['contact:website'] || tags.url || null,
                    address: item.display_name || `${location}, ${state}`,
                    city: addr.city || addr.town || addr.suburb || location,
                    state: addr.state || state,
                    category: item.type || item.class || keyword,
                    rating: 4.7,
                    reviews_count: 18,
                    source: 'OpenStreetMap API'
                  }
                }
                return null
              }).filter(Boolean)
            }
          }
        } catch (err) {
          return []
        }
        return []
      })()

      const [photonResults, nomResults] = await Promise.all([
        Promise.all(photonPromises),
        nominatimPromise
      ])

      photonResults.flat().forEach(l => rawLeads.push(l))
      nomResults.forEach(l => rawLeads.push(l))
    }

    // Deduplicate leads by name
    const seenNames = new Set()
    const uniqueLeads = rawLeads.filter(lead => {
      const lower = (lead.name || '').trim().toLowerCase()
      if (!lower || seenNames.has(lower)) return false
      seenNames.add(lower)
      return true
    })

    return res.status(200).json({
      success: true,
      source,
      count: uniqueLeads.length,
      leads: uniqueLeads
    })
  } catch (error) {
    console.error('[Discover Leads API Fatal Error]:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal discovery engine error'
    })
  }
}
