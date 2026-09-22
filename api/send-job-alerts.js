import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

/**
 * Job Alert Dispatcher API
 * 
 * Scans active subscriptions in `job_alerts`, matches them against newly published jobs,
 * and sends formatted email digests via Resend.
 * 
 * Endpoint: POST /api/send-job-alerts
 * Auth: Requires x-api-secret header
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiSecret = process.env.JOB_DISCOVERY_API_SECRET
  const authHeader = req.headers['x-api-secret'] || req.headers['authorization']
  if (!apiSecret || authHeader !== apiSecret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase configuration missing' })
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const resendApiKey = process.env.RESEND_API_KEY
  const resend = resendApiKey ? new Resend(resendApiKey) : null

  try {
    // 1. Fetch active job alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('job_alerts')
      .select('*')
      .eq('is_active', true)

    if (alertsError) throw alertsError
    if (!alerts || alerts.length === 0) {
      return res.status(200).json({ message: 'No active job alerts found', sentCount: 0 })
    }

    // 2. Fetch recently published jobs (last 48 hours)
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    const { data: recentJobs, error: jobsError } = await supabase
      .from('job_postings')
      .select('*')
      .eq('status', 'active')
      .gte('created_at', twoDaysAgo)
      .order('created_at', { ascending: false })

    if (jobsError) throw jobsError
    if (!recentJobs || recentJobs.length === 0) {
      return res.status(200).json({ message: 'No new jobs published in the last 48 hours', sentCount: 0 })
    }

    let sentCount = 0
    const now = new Date().toISOString()

    for (const alert of alerts) {
      // Filter jobs matching user's keywords / locations
      const keywords = (alert.keywords || []).map((k) => k.toLowerCase())
      const locations = (alert.locations || []).map((l) => l.toLowerCase())

      const matchingJobs = recentJobs.filter((job) => {
        if (keywords.length > 0) {
          const text = `${job.title} ${job.description} ${job.niche_category}`.toLowerCase()
          const matchesKeyword = keywords.some((k) => text.includes(k))
          if (!matchesKeyword) return false
        }
        if (locations.length > 0) {
          const locText = `${job.location_city} ${job.location_state} ${job.location_country}`.toLowerCase()
          const matchesLoc = locations.some((l) => locText.includes(l) || (l === 'remote' && (job.is_remote || job.is_wfh)))
          if (!matchesLoc) return false
        }
        return true
      })

      if (matchingJobs.length === 0) continue

      const jobListHtml = matchingJobs
        .slice(0, 5)
        .map(
          (j) => `
        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 12px; color: #f8fafc;">
          <h3 style="margin: 0 0 6px 0; font-size: 16px; color: #38bdf8;">${j.title}</h3>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #94a3b8;">🏢 <strong>${j.company_name}</strong> • 📍 ${j.location_city}, ${j.location_state}</p>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #34d399;">💰 <strong>${j.salary_range}</strong></p>
          <a href="https://careers.springwebsolutions.in/jobs/${j.slug}" style="display: inline-block; background: #10b981; color: #022c22; font-weight: bold; font-size: 12px; padding: 6px 12px; border-radius: 6px; text-decoration: none;">View Job & Apply →</a>
        </div>
      `
        )
        .join('')

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #020617; color: #f8fafc; padding: 24px;">
          <div style="max-width: 600px; margin: 0 auto; background: #090e1a; border: 1px solid #1e293b; border-radius: 16px; padding: 28px;">
            <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
              <span style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 6px;">⚡ SPRINGWEB CAREERS</span>
              <h1 style="font-size: 20px; font-weight: bold; color: #ffffff; margin: 12px 0 4px 0;">New Job Vacancies Matching Your Alert</h1>
              <p style="font-size: 13px; color: #94a3b8; margin: 0;">We found ${matchingJobs.length} verified open positions matching your preferences.</p>
            </div>

            ${jobListHtml}

            <div style="border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px; text-align: center;">
              <a href="https://careers.springwebsolutions.in/jobs" style="color: #38bdf8; font-size: 13px; text-decoration: none;">Browse all active job vacancies on SpringWeb Careers →</a>
              <p style="font-size: 11px; color: #64748b; margin-top: 12px;">You received this because you subscribed to job alerts on careers.springwebsolutions.in.</p>
            </div>
          </div>
        </body>
        </html>
      `

      if (resend) {
        await resend.emails.send({
          from: 'SpringWeb Careers <careers@springwebsolutions.in>',
          to: alert.email,
          subject: `⚡ ${matchingJobs.length} New Verified Job Matches for You | SpringWeb Careers`,
          html: emailHtml,
        })
      }

      await supabase.from('job_alerts').update({ last_sent_at: now }).eq('id', alert.id)
      sentCount++
    }

    return res.status(200).json({ success: true, sentCount })
  } catch (err) {
    console.error('Send Job Alerts Error:', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
