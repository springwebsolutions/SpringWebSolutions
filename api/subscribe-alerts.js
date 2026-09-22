import { createClient } from '@supabase/supabase-js'

/**
 * Job Alert Subscription API
 * 
 * Allows users to register email alerts for newly verified and published job vacancies.
 * 
 * Endpoint: POST /api/subscribe-alerts
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase configuration missing' })
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { email, keywords = [], locations = [], job_types = [] } = req.body || {}

  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Valid email address is required' })
  }

  const cleanEmail = email.trim().toLowerCase()

  try {
    // Check if subscription already exists for this email
    const { data: existing } = await supabase
      .from('job_alerts')
      .select('id, is_active')
      .eq('email', cleanEmail)
      .single()

    if (existing) {
      // Update existing alert preferences
      const { error: updateError } = await supabase
        .from('job_alerts')
        .update({
          keywords: Array.isArray(keywords) ? keywords : [keywords],
          locations: Array.isArray(locations) ? locations : [locations],
          job_types: Array.isArray(job_types) ? job_types : [job_types],
          is_active: true,
        })
        .eq('id', existing.id)

      if (updateError) throw updateError
      return res.status(200).json({ success: true, message: 'Job alert preferences updated successfully!' })
    }

    // Insert new subscription
    const { error: insertError } = await supabase
      .from('job_alerts')
      .insert({
        email: cleanEmail,
        keywords: Array.isArray(keywords) ? keywords : [keywords],
        locations: Array.isArray(locations) ? locations : [locations],
        job_types: Array.isArray(job_types) ? job_types : [job_types],
        is_active: true,
      })

    if (insertError) throw insertError

    return res.status(201).json({ success: true, message: 'Subscribed to job alerts successfully!' })
  } catch (err) {
    console.error('Job Alert Subscription Error:', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
