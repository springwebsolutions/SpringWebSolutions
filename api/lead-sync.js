import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { leads, lead } = req.body || {};
  const leadsToSync = Array.isArray(leads) ? leads : lead ? [lead] : [];

  if (leadsToSync.length === 0) {
    return res.status(400).json({ error: 'No leads provided in payload.' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Supabase credentials not configured on server.' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    let synced = 0;
    let errors = 0;

    for (const item of leadsToSync) {
      const normPhone = (item.phone || '').replace(/[^0-9]/g, '');

      const payload = {
        name: item.name || 'Unnamed Business',
        owner_name: item.owner_name || null,
        category: item.category || 'General',
        phone: item.phone || null,
        normalized_phone: normPhone || null,
        email: item.email || null,
        whatsapp: item.whatsapp || item.phone || null,
        website: item.website || null,
        address: item.address || null,
        city: item.city || 'Udumalpet',
        district: item.district || 'Tiruppur',
        state: item.state || 'Tamil Nadu',
        country: item.country || 'India',
        rating: item.rating || 4.5,
        reviews_count: item.reviews_count || 15,
        lead_score: item.lead_score || 50,
        priority: item.priority || 'High',
        source: item.source || 'Chrome Extension Scraper',
        dnc_flag: false,
        duplicate_flag: false,
        recommended_services: item.recommended_services || ['Website Development', 'WhatsApp API'],
        estimated_value_band: item.estimated_value_band || '₹50K - ₹100K',
        status: 'New'
      };

      const { error } = await supabase.from('businesses').insert(payload);
      if (!error) synced++;
      else errors++;
    }

    return res.status(200).json({ status: 'success', synced, errors, total: leadsToSync.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
