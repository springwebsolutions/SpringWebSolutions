/**
 * Job Normalizer — Deduplication & Data Normalization Utilities
 * 
 * Provides client-side and shared utilities for:
 * - Title/company name normalization for fingerprint-based deduplication
 * - SHA256 fingerprint generation
 * - Salary string parsing (₹ LPA, $/hr, monthly, yearly formats)
 * - Location normalization (Indian city aliases → canonical names)
 * - Experience level extraction from description text
 * - Job category auto-classification via keyword rules
 */

// ─── Title & Company Normalization ──────────────────────────────────────────

const COMPANY_SUFFIXES = [
  'pvt ltd', 'pvt. ltd.', 'pvt. ltd', 'private limited', 'private ltd',
  'limited', 'ltd', 'ltd.', 'inc', 'inc.', 'incorporated',
  'llp', 'l.l.p.', 'llc', 'l.l.c.',
  'corp', 'corp.', 'corporation',
  'co.', 'company', '& co',
  'solutions', 'technologies', 'tech', 'services', 'consultancy',
  'india', '(india)', '- india'
]

const TITLE_STOPWORDS = [
  'urgent', 'hiring', 'immediately', 'asap', 'walk-in', 'walkin',
  'work from home', 'wfh', 'remote', 'hybrid', 'on-site', 'onsite',
  'full time', 'full-time', 'part time', 'part-time', 'contract',
  'freshers', 'fresher', 'experienced',
  'apply now', 'openings', 'opening', 'vacancy', 'vacancies',
  'required', 'wanted', 'needed', 'looking for'
]

/**
 * Normalizes a job title for deduplication fingerprinting.
 * Strips stopwords, extra whitespace, special characters, and lowercases.
 */
export function normalizeTitle(title: string): string {
  if (!title) return ''
  let normalized = title.toLowerCase().trim()
  
  // Remove content in parentheses/brackets (usually metadata)
  normalized = normalized.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '')
  
  // Remove stopwords
  for (const sw of TITLE_STOPWORDS) {
    normalized = normalized.replace(new RegExp(`\\b${sw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), '')
  }
  
  // Remove special characters except hyphens and ampersands
  normalized = normalized.replace(/[^a-z0-9\s\-&]/g, '')
  
  // Collapse whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim()
  
  return normalized
}

/**
 * Normalizes a company name for deduplication fingerprinting.
 * Strips suffixes like "Pvt Ltd", "Inc", etc.
 */
export function normalizeCompany(company: string): string {
  if (!company) return ''
  let normalized = company.toLowerCase().trim()
  
  // Remove content in parentheses
  normalized = normalized.replace(/\([^)]*\)/g, '')
  
  // Remove company suffixes
  for (const suffix of COMPANY_SUFFIXES) {
    const escapedSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    normalized = normalized.replace(new RegExp(`\\b${escapedSuffix}\\b`, 'gi'), '')
  }
  
  // Remove special characters
  normalized = normalized.replace(/[^a-z0-9\s]/g, '')
  
  // Collapse whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim()
  
  return normalized
}

/**
 * Generates a SHA256 fingerprint for deduplication.
 * Uses title + company + source_url as the composite key.
 */
export async function generateFingerprint(
  title: string, 
  company: string, 
  sourceUrl?: string
): Promise<string> {
  const normalizedTitle = normalizeTitle(title)
  const normalizedCompany = normalizeCompany(company)
  const input = `${normalizedTitle}|${normalizedCompany}|${sourceUrl || ''}`
  
  // Use Web Crypto API for SHA256
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// ─── Salary Parsing ─────────────────────────────────────────────────────────

export interface ParsedSalary {
  min: number | null
  max: number | null
  currency: string
  period: 'yearly' | 'monthly' | 'hourly' | 'daily'
  original: string
  isEstimate: boolean
}

/**
 * Parses a salary string into structured data.
 * Handles formats like:
 * - "₹8,00,000 - ₹14,00,000 / year"
 * - "₹8 LPA - ₹14 LPA"
 * - "$45,000 - $65,000 / year"
 * - "$25/hr"
 * - "₹50,000/month"
 * - "Not disclosed"
 */
export function parseSalary(salaryStr: string): ParsedSalary {
  const result: ParsedSalary = {
    min: null,
    max: null,
    currency: 'INR',
    period: 'yearly',
    original: salaryStr,
    isEstimate: false
  }
  
  if (!salaryStr || salaryStr.toLowerCase().includes('not disclosed') || salaryStr.toLowerCase().includes('confidential')) {
    return result
  }
  
  // Detect currency
  if (salaryStr.includes('$') || salaryStr.toLowerCase().includes('usd')) {
    result.currency = 'USD'
  } else if (salaryStr.includes('€') || salaryStr.toLowerCase().includes('eur')) {
    result.currency = 'EUR'
  } else if (salaryStr.includes('£') || salaryStr.toLowerCase().includes('gbp')) {
    result.currency = 'GBP'
  }
  
  // Detect period
  if (/\/\s*h(ou)?r|per\s*hour|hourly/i.test(salaryStr)) {
    result.period = 'hourly'
  } else if (/\/\s*month|monthly|p\.?m\.?/i.test(salaryStr)) {
    result.period = 'monthly'
  } else if (/\/\s*day|daily|per\s*day/i.test(salaryStr)) {
    result.period = 'daily'
  }
  
  // Handle LPA format (Indian Lakhs Per Annum)
  const lpaMatch = salaryStr.match(/(\d+(?:\.\d+)?)\s*(?:lpa|lakhs?\s*(?:per\s*annum|p\.?a\.?)?)/gi)
  if (lpaMatch) {
    const numbers = salaryStr.match(/(\d+(?:\.\d+)?)\s*(?:lpa|lakh)/gi)
    if (numbers) {
      const vals = numbers.map(n => parseFloat(n.replace(/[^0-9.]/g, '')) * 100000)
      result.min = vals[0] || null
      result.max = vals.length > 1 ? vals[1] : vals[0]
      result.currency = 'INR'
      result.period = 'yearly'
      return result
    }
  }
  
  // Handle Indian number format: ₹8,00,000
  const indianNumbers = salaryStr.match(/₹?\s*(\d{1,2},?\d{2},?\d{3})/g)
  if (indianNumbers && indianNumbers.length > 0) {
    const vals = indianNumbers.map(n => parseInt(n.replace(/[₹,\s]/g, ''), 10))
    result.min = vals[0] || null
    result.max = vals.length > 1 ? vals[1] : vals[0]
    result.currency = 'INR'
    return result
  }
  
  // Handle standard format: $45,000 - $65,000
  const standardNumbers = salaryStr.match(/[\d,]+(?:\.\d+)?/g)
  if (standardNumbers && standardNumbers.length > 0) {
    const vals = standardNumbers.map(n => parseFloat(n.replace(/,/g, '')))
    result.min = vals[0] || null
    result.max = vals.length > 1 ? vals[1] : vals[0]
    return result
  }
  
  return result
}

// ─── Location Normalization ─────────────────────────────────────────────────

const INDIA_CITY_ALIASES: Record<string, string> = {
  'bengaluru': 'Bengaluru',
  'bangalore': 'Bengaluru',
  'blr': 'Bengaluru',
  'mumbai': 'Mumbai',
  'bombay': 'Mumbai',
  'delhi': 'Delhi',
  'new delhi': 'Delhi',
  'ncr': 'Delhi NCR',
  'delhi ncr': 'Delhi NCR',
  'gurgaon': 'Gurugram',
  'gurugram': 'Gurugram',
  'noida': 'Noida',
  'greater noida': 'Greater Noida',
  'chennai': 'Chennai',
  'madras': 'Chennai',
  'hyderabad': 'Hyderabad',
  'secunderabad': 'Hyderabad',
  'pune': 'Pune',
  'poona': 'Pune',
  'kolkata': 'Kolkata',
  'calcutta': 'Kolkata',
  'ahmedabad': 'Ahmedabad',
  'coimbatore': 'Coimbatore',
  'kovai': 'Coimbatore',
  'udumalpet': 'Udumalpet',
  'tiruppur': 'Tiruppur',
  'tirupur': 'Tiruppur',
  'erode': 'Erode',
  'salem': 'Salem',
  'madurai': 'Madurai',
  'trichy': 'Tiruchirappalli',
  'tiruchirappalli': 'Tiruchirappalli',
  'thiruvananthapuram': 'Thiruvananthapuram',
  'trivandrum': 'Thiruvananthapuram',
  'kochi': 'Kochi',
  'cochin': 'Kochi',
  'indore': 'Indore',
  'jaipur': 'Jaipur',
  'lucknow': 'Lucknow',
  'chandigarh': 'Chandigarh',
  'bhubaneswar': 'Bhubaneswar',
  'visakhapatnam': 'Visakhapatnam',
  'vizag': 'Visakhapatnam',
  'nagpur': 'Nagpur',
  'surat': 'Surat',
  'vadodara': 'Vadodara',
  'baroda': 'Vadodara',
  'mysore': 'Mysuru',
  'mysuru': 'Mysuru',
  'mangalore': 'Mangaluru',
  'mangaluru': 'Mangaluru',
}

const INDIA_STATE_MAP: Record<string, string> = {
  'tamil nadu': 'Tamil Nadu',
  'tn': 'Tamil Nadu',
  'karnataka': 'Karnataka',
  'ka': 'Karnataka',
  'maharashtra': 'Maharashtra',
  'mh': 'Maharashtra',
  'telangana': 'Telangana',
  'ts': 'Telangana',
  'andhra pradesh': 'Andhra Pradesh',
  'ap': 'Andhra Pradesh',
  'kerala': 'Kerala',
  'kl': 'Kerala',
  'delhi': 'Delhi',
  'dl': 'Delhi',
  'haryana': 'Haryana',
  'hr': 'Haryana',
  'uttar pradesh': 'Uttar Pradesh',
  'up': 'Uttar Pradesh',
  'west bengal': 'West Bengal',
  'wb': 'West Bengal',
  'gujarat': 'Gujarat',
  'gj': 'Gujarat',
  'rajasthan': 'Rajasthan',
  'rj': 'Rajasthan',
  'madhya pradesh': 'Madhya Pradesh',
  'mp': 'Madhya Pradesh',
  'punjab': 'Punjab',
  'pb': 'Punjab',
}

export interface ParsedLocation {
  country: string
  state: string
  city: string
  area: string
  isRemote: boolean
  isWfh: boolean
  original: string
}

/**
 * Parses a location string into structured data.
 */
export function parseLocation(locationStr: string): ParsedLocation {
  const result: ParsedLocation = {
    country: 'India',
    state: '',
    city: '',
    area: '',
    isRemote: false,
    isWfh: false,
    original: locationStr || ''
  }
  
  if (!locationStr) return result
  
  const lower = locationStr.toLowerCase().trim()
  
  // Detect remote/WFH
  result.isRemote = /remote|anywhere|worldwide|global/i.test(lower)
  result.isWfh = /work\s*from\s*home|wfh|home\s*based/i.test(lower) || result.isRemote
  
  // Detect country
  if (/united states|usa|u\.s\.a|america/i.test(lower)) {
    result.country = 'United States'
  } else if (/united kingdom|uk|u\.k\.|britain/i.test(lower)) {
    result.country = 'United Kingdom'
  } else if (/canada/i.test(lower)) {
    result.country = 'Canada'
  } else if (/australia/i.test(lower)) {
    result.country = 'Australia'
  } else if (/germany|deutschland/i.test(lower)) {
    result.country = 'Germany'
  }
  
  // Try to match Indian cities
  for (const [alias, canonical] of Object.entries(INDIA_CITY_ALIASES)) {
    if (lower.includes(alias)) {
      result.city = canonical
      break
    }
  }
  
  // Try to match Indian states
  for (const [alias, canonical] of Object.entries(INDIA_STATE_MAP)) {
    if (lower.includes(alias)) {
      result.state = canonical
      break
    }
  }
  
  // Auto-fill state from city if not detected
  if (result.city && !result.state) {
    const cityStateMap: Record<string, string> = {
      'Bengaluru': 'Karnataka', 'Mumbai': 'Maharashtra', 'Chennai': 'Tamil Nadu',
      'Hyderabad': 'Telangana', 'Pune': 'Maharashtra', 'Kolkata': 'West Bengal',
      'Delhi': 'Delhi', 'Delhi NCR': 'Delhi', 'Gurugram': 'Haryana',
      'Noida': 'Uttar Pradesh', 'Ahmedabad': 'Gujarat', 'Coimbatore': 'Tamil Nadu',
      'Udumalpet': 'Tamil Nadu', 'Tiruppur': 'Tamil Nadu', 'Jaipur': 'Rajasthan',
      'Lucknow': 'Uttar Pradesh', 'Kochi': 'Kerala', 'Indore': 'Madhya Pradesh',
      'Surat': 'Gujarat', 'Nagpur': 'Maharashtra', 'Mysuru': 'Karnataka',
      'Mangaluru': 'Karnataka', 'Madurai': 'Tamil Nadu', 'Salem': 'Tamil Nadu',
      'Erode': 'Tamil Nadu', 'Greater Noida': 'Uttar Pradesh',
      'Visakhapatnam': 'Andhra Pradesh', 'Bhubaneswar': 'Odisha',
      'Chandigarh': 'Chandigarh', 'Vadodara': 'Gujarat',
      'Thiruvananthapuram': 'Kerala', 'Tiruchirappalli': 'Tamil Nadu',
    }
    result.state = cityStateMap[result.city] || ''
  }
  
  return result
}

// ─── Experience Level Extraction ────────────────────────────────────────────

/**
 * Extracts experience level from job description or title.
 */
export function extractExperienceLevel(text: string): string {
  if (!text) return 'Mid Level'
  const lower = text.toLowerCase()
  
  // Check for explicit levels
  if (/\b(lead|director|head|vp|vice president|chief|cto|ceo|executive|principal)\b/i.test(lower)) {
    return 'Lead / Executive'
  }
  if (/\b(senior|sr\.?|staff|architect)\b/i.test(lower)) {
    return 'Senior Level'
  }
  if (/\b(fresher|entry[\s-]?level|graduate|intern|trainee|junior|jr\.?)\b/i.test(lower)) {
    return 'Entry Level / Fresher'
  }
  
  // Check for years of experience
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

// ─── Job Category Classification ────────────────────────────────────────────

const CATEGORY_RULES: Array<{ keywords: string[]; category: string }> = [
  { keywords: ['react', 'angular', 'vue', 'frontend', 'front-end', 'front end', 'javascript', 'typescript', 'css', 'html', 'ui developer', 'web developer'], category: 'Software Engineering' },
  { keywords: ['node', 'python', 'java', 'backend', 'back-end', 'back end', 'golang', 'rust', 'c++', 'c#', '.net', 'api', 'microservices'], category: 'Software Engineering' },
  { keywords: ['full stack', 'fullstack', 'full-stack', 'mern', 'mean', 'software engineer', 'software developer', 'sde', 'swe'], category: 'Software Engineering' },
  { keywords: ['android', 'ios', 'flutter', 'react native', 'mobile', 'kotlin', 'swift', 'dart'], category: 'Mobile App Development' },
  { keywords: ['devops', 'sre', 'cloud', 'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'terraform', 'infrastructure', 'ci/cd'], category: 'Cloud & Infrastructure' },
  { keywords: ['data scientist', 'machine learning', 'ml', 'ai', 'artificial intelligence', 'deep learning', 'nlp', 'computer vision', 'data analyst'], category: 'Data Science & AI' },
  { keywords: ['product manager', 'product owner', 'scrum master', 'agile', 'project manager', 'program manager'], category: 'Product & Project Management' },
  { keywords: ['ui/ux', 'ux', 'ui', 'design', 'graphic design', 'figma', 'sketch', 'adobe', 'illustrator', 'photoshop', 'creative'], category: 'Design & Creative' },
  { keywords: ['seo', 'digital marketing', 'content marketing', 'social media', 'google ads', 'sem', 'ppc', 'marketing manager', 'growth'], category: 'Digital Marketing & SEO' },
  { keywords: ['qa', 'quality assurance', 'testing', 'automation testing', 'selenium', 'test engineer', 'sdet'], category: 'Quality Assurance' },
  { keywords: ['cybersecurity', 'security', 'penetration', 'ethical hacking', 'soc', 'security analyst', 'infosec'], category: 'Cybersecurity' },
  { keywords: ['blockchain', 'web3', 'solidity', 'smart contract', 'ethereum', 'crypto', 'defi'], category: 'Blockchain & Web3' },
  { keywords: ['sales', 'business development', 'bde', 'bdm', 'account manager', 'account executive', 'client relations'], category: 'Sales & Business Development' },
  { keywords: ['hr', 'human resources', 'recruiter', 'recruitment', 'talent acquisition', 'hiring manager', 'people ops'], category: 'Human Resources' },
  { keywords: ['content writer', 'copywriter', 'technical writer', 'editor', 'journalist', 'blog', 'writing'], category: 'Content & Writing' },
  { keywords: ['customer support', 'customer service', 'helpdesk', 'support engineer', 'technical support', 'customer success'], category: 'Customer Support' },
  { keywords: ['finance', 'accounting', 'chartered accountant', 'ca', 'cpa', 'financial analyst', 'auditor', 'bookkeeper'], category: 'Finance & Accounting' },
  { keywords: ['data engineer', 'etl', 'data pipeline', 'spark', 'hadoop', 'bigdata', 'data warehouse', 'databricks'], category: 'Data Engineering' },
  { keywords: ['network', 'system admin', 'sysadmin', 'it support', 'helpdesk', 'it manager', 'it admin'], category: 'IT Administration' },
  { keywords: ['embedded', 'firmware', 'iot', 'hardware', 'vlsi', 'fpga', 'pcb', 'circuit'], category: 'Embedded & IoT' },
]

/**
 * Classifies a job into a niche category based on title and description keywords.
 */
export function classifyJobCategory(title: string, description?: string): string {
  const combined = `${title} ${description || ''}`.toLowerCase()
  
  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      if (combined.includes(kw)) {
        return rule.category
      }
    }
  }
  
  return 'General / Other'
}

/**
 * Generates a brief template-based summary for a job (zero-cost, no AI).
 */
export function generateTemplateSummary(
  title: string,
  company: string,
  location: string,
  salary: string,
  category: string
): string {
  const locationStr = location || 'India'
  const salaryStr = salary ? ` with a compensation of ${salary}` : ''
  return `${company} is hiring for the position of ${title} in ${locationStr}${salaryStr}. This role falls under the ${category} domain. Candidates meeting the requirements can apply through the provided application link.`
}

/**
 * Generates a URL-safe slug from a title.
 */
export function generateSlug(title: string, company: string): string {
  const combined = `${title} ${company}`
  return combined
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
    .replace(/^-|-$/g, '')
}
