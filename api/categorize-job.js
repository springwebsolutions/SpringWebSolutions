/**
 * Job Categorization Engine — Zero-Cost Classification
 * 
 * Uses keyword-matching rules to categorize discovered jobs.
 * Optionally uses Gemini API for richer summaries when GEMINI_API_KEY is set.
 * 
 * Endpoint: POST /api/categorize-job
 * Auth: Requires JOB_DISCOVERY_API_SECRET header
 */

import { createClient } from '@supabase/supabase-js'

// ─── Category Rules ─────────────────────────────────────────────────────────

const CATEGORY_RULES = [
  { keywords: ['react', 'angular', 'vue', 'frontend', 'front-end', 'javascript', 'typescript', 'web developer', 'node', 'python', 'java', 'backend', 'back-end', 'golang', 'rust', 'c++', 'c#', '.net', 'full stack', 'fullstack', 'mern', 'software engineer', 'sde'], category: 'Software Engineering' },
  { keywords: ['android', 'ios', 'flutter', 'react native', 'mobile', 'kotlin', 'swift'], category: 'Mobile App Development' },
  { keywords: ['devops', 'sre', 'cloud', 'aws', 'azure', 'kubernetes', 'docker', 'terraform'], category: 'Cloud & Infrastructure' },
  { keywords: ['data scientist', 'machine learning', 'ml', 'ai', 'deep learning', 'nlp', 'data analyst'], category: 'Data Science & AI' },
  { keywords: ['product manager', 'product owner', 'scrum master', 'project manager'], category: 'Product & Project Management' },
  { keywords: ['ui/ux', 'ux', 'ui', 'design', 'graphic design', 'figma'], category: 'Design & Creative' },
  { keywords: ['seo', 'digital marketing', 'content marketing', 'social media', 'google ads'], category: 'Digital Marketing & SEO' },
  { keywords: ['qa', 'quality assurance', 'testing', 'selenium'], category: 'Quality Assurance' },
  { keywords: ['sales', 'business development', 'bde', 'account manager'], category: 'Sales & Business Development' },
  { keywords: ['hr', 'human resources', 'recruiter', 'recruitment'], category: 'Human Resources' },
  { keywords: ['content writer', 'copywriter', 'technical writer'], category: 'Content & Writing' },
  { keywords: ['data engineer', 'etl', 'spark', 'hadoop', 'data pipeline'], category: 'Data Engineering' },
  { keywords: ['customer support', 'customer service', 'support engineer'], category: 'Customer Support' },
  { keywords: ['cybersecurity', 'security analyst', 'penetration', 'ethical hacking'], category: 'Cybersecurity' },
  { keywords: ['blockchain', 'web3', 'solidity', 'smart contract'], category: 'Blockchain & Web3' },
  { keywords: ['embedded', 'firmware', 'iot', 'hardware', 'vlsi'], category: 'Embedded & IoT' },
]

function classifyCategory(title, description) {
  const combined = `${title} ${description || ''}`.toLowerCase()
  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      if (combined.includes(kw)) return rule.category
    }
  }
  return 'General / Other'
}

function extractExperienceLevel(text) {
  if (!text) return 'Mid Level'
  const lower = text.toLowerCase()
  if (/\b(lead|director|head|vp|chief|cto|principal)\b/.test(lower)) return 'Lead / Executive'
  if (/\b(senior|sr\.?|staff|architect)\b/.test(lower)) return 'Senior Level'
  if (/\b(fresher|entry[\s-]?level|graduate|intern|trainee|junior|jr\.?)\b/.test(lower)) return 'Entry Level / Fresher'
  const yearsMatch = lower.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i)
  if (yearsMatch) {
    const years = parseInt(yearsMatch[1], 10)
    if (years >= 8) return 'Lead / Executive'
    if (years >= 4) return 'Senior Level'
    if (years >= 2) return 'Mid Level'
    return 'Entry Level / Fresher'
  }
  return 'Mid Level'
}

function generateTemplateSummary(title, company, location, category) {
  const loc = location || 'India'
  return `${company} is hiring for the position of ${title} in ${loc}. This role falls under the ${category} domain. Candidates meeting the requirements are encouraged to apply through the provided application link.`
}

// ─── Optional Gemini AI Enhancement ─────────────────────────────────────────

async function generateAISummary(title, company, description, category) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null
  
  try {
    const prompt = `You are a professional job listing editor. Write a concise 2-3 sentence summary for this job posting. Be factual and professional. Do not fabricate any data.

Job Title: ${title}
Company: ${company}
Category: ${category}
Description excerpt: ${(description || '').substring(0, 500)}

Write a brief, SEO-friendly summary (max 200 characters):`

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 150, temperature: 0.3 }
      })
    })
    
    if (!res.ok) return null
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null
  } catch {
    return null
  }
}

// ─── Main Handler ───────────────────────────────────────────────────────────

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
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase not configured' })
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  const { job_ids, batch } = req.body || {}
  
  // If batch=true, categorize all uncategorized discovered jobs
  let targetIds = job_ids || []
  if (batch) {
    const { data } = await supabase
      .from('discovered_jobs')
      .select('id')
      .is('ai_category', null)
      .eq('status', 'discovered')
      .limit(100)
    targetIds = (data || []).map(j => j.id)
  }
  
  if (targetIds.length === 0) {
    return res.status(200).json({ success: true, processed: 0, message: 'No jobs to categorize' })
  }
  
  let processed = 0
  let errors = 0
  
  for (const id of targetIds) {
    try {
      const { data: job, error } = await supabase
        .from('discovered_jobs')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error || !job) continue
      
      const category = classifyCategory(job.raw_title, job.raw_description)
      const experienceLevel = extractExperienceLevel(`${job.raw_title} ${job.raw_description}`)
      
      // Try AI summary first, fall back to template
      let summary = await generateAISummary(job.raw_title, job.raw_company, job.raw_description, category)
      if (!summary) {
        summary = generateTemplateSummary(job.raw_title, job.raw_company, job.raw_location, category)
      } else {
        summary = `[AI SUMMARY] ${summary}`
      }
      
      await supabase
        .from('discovered_jobs')
        .update({
          ai_category: category,
          ai_experience_level: experienceLevel,
          ai_summary: summary,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
      
      processed++
    } catch (err) {
      console.error(`Categorize error for ${id}:`, err.message)
      errors++
    }
  }
  
  return res.status(200).json({
    success: true,
    processed,
    errors,
    total: targetIds.length,
    ai_enabled: !!process.env.GEMINI_API_KEY
  })
}
