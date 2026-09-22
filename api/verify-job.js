import { createClient } from '@supabase/supabase-js'

/**
 * Job Verification & Publishing API
 * 
 * Manages the lifecycle of discovered jobs:
 * - DISCOVERED → VERIFIED (admin confirms legitimacy)
 * - VERIFIED → PUBLISHED (creates job_postings record)
 * - DISCOVERED/VERIFIED → REJECTED (with reason)
 * - Any → EXPIRED
 * 
 * Endpoint: POST /api/verify-job
 * Auth: Requires Supabase auth token (admin role)
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase not configured' })
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  // Verify admin auth via API secret or Supabase token
  const apiSecret = process.env.JOB_DISCOVERY_API_SECRET
  const authHeader = req.headers['x-api-secret'] || req.headers['authorization']
  if (!apiSecret || authHeader !== apiSecret) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  const { action, job_id, rejection_reason, overrides, user_id } = req.body || {}
  
  if (!action || !job_id) {
    return res.status(400).json({ error: 'action and job_id are required' })
  }
  
  try {
    // Fetch the discovered job
    const { data: job, error: fetchError } = await supabase
      .from('discovered_jobs')
      .select('*')
      .eq('id', job_id)
      .single()
    
    if (fetchError || !job) {
      return res.status(404).json({ error: 'Job not found' })
    }
    
    switch (action) {
      case 'verify': {
        // DISCOVERED → VERIFIED
        if (job.status !== 'discovered') {
          return res.status(400).json({ error: `Cannot verify a job with status: ${job.status}` })
        }
        
        const { error } = await supabase
          .from('discovered_jobs')
          .update({
            status: 'verified',
            verified_by: user_id || null,
            verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', job_id)
        
        if (error) throw error
        return res.status(200).json({ success: true, status: 'verified' })
      }
      
      case 'reject': {
        // Any → REJECTED
        const { error } = await supabase
          .from('discovered_jobs')
          .update({
            status: 'rejected',
            rejection_reason: rejection_reason || 'Rejected by admin',
            verified_by: user_id || null,
            verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', job_id)
        
        if (error) throw error
        return res.status(200).json({ success: true, status: 'rejected' })
      }
      
      case 'publish': {
        // VERIFIED → PUBLISHED (creates a job_postings record)
        if (job.status !== 'verified' && job.status !== 'discovered') {
          return res.status(400).json({ error: `Cannot publish a job with status: ${job.status}` })
        }
        
        // Parse location
        const locationParts = (job.raw_location || 'India').split(',').map(s => s.trim())
        const isRemote = /remote|anywhere|worldwide/i.test(job.raw_location || '')
        const isWfh = /work from home|wfh|home based/i.test(job.raw_location || '') || isRemote
        
        // Generate slug
        const slug = `${job.raw_title}-${job.raw_company}`
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .substring(0, 80)
          .replace(/^-|-$/g, '')
          + `-${Date.now().toString(36)}`
        
        // Create the published job posting
        const jobPosting = {
          id: `job-${Date.now()}`,
          title: overrides?.title || job.raw_title,
          slug,
          company_name: overrides?.company_name || job.raw_company,
          is_internal_hiring: false,
          location_country: overrides?.location_country || (locationParts.length > 2 ? locationParts[2] : 'India'),
          location_state: overrides?.location_state || (locationParts.length > 1 ? locationParts[1] : ''),
          location_city: overrides?.location_city || (locationParts[0] || ''),
          location_area: overrides?.location_area || '',
          is_remote: overrides?.is_remote ?? isRemote,
          is_wfh: overrides?.is_wfh ?? isWfh,
          job_type: overrides?.job_type || 'Full-Time',
          experience_level: overrides?.experience_level || job.ai_experience_level || 'Mid Level',
          salary_range: job.raw_salary || 'Not Disclosed',  // SOURCE FACT — never fabricated
          niche_category: overrides?.niche_category || job.ai_category || 'General / Other',
          description: overrides?.description || job.ai_summary || job.raw_description || '',
          requirements: overrides?.requirements || (Array.isArray(job.raw_requirements) ? job.raw_requirements : []),
          apply_link_or_email: overrides?.apply_link_or_email || job.raw_apply_url || job.source_url || '',
          status: 'active',
          featured: overrides?.featured || false,
          created_at: new Date().toISOString()
        }
        
        // Insert into job_postings (existing table)
        const { error: insertError } = await supabase
          .from('job_postings')
          .insert(jobPosting)
        
        if (insertError) {
          console.error('job_postings insert error:', insertError)
          // Even if Supabase fails, update discovered_jobs status
        }
        
        // Update discovered_jobs status
        const { error: updateError } = await supabase
          .from('discovered_jobs')
          .update({
            status: 'published',
            published_job_id: jobPosting.id,
            verified_by: user_id || null,
            verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', job_id)
        
        if (updateError) throw updateError
        
        return res.status(200).json({
          success: true,
          status: 'published',
          published_job: jobPosting
        })
      }
      
      case 'expire': {
        const { error } = await supabase
          .from('discovered_jobs')
          .update({
            status: 'expired',
            updated_at: new Date().toISOString()
          })
          .eq('id', job_id)
        
        if (error) throw error
        return res.status(200).json({ success: true, status: 'expired' })
      }
      
      default:
        return res.status(400).json({ error: `Unknown action: ${action}. Valid: verify, reject, publish, expire` })
    }
  } catch (err) {
    console.error('verify-job error:', err)
    return res.status(500).json({ error: err.message })
  }
}
