import type { DiscoveredJob, JobPosting } from '@/stores/careersStore'

export type SocialPlatform = 'instagram' | 'linkedin' | 'twitter' | 'whatsapp' | 'telegram'

interface JobCaptionData {
  title: string
  company: string
  location?: string
  salary?: string
  category?: string
  experienceLevel?: string
  applyUrl?: string
  sourceFact?: boolean
}

export function extractJobCaptionData(job: DiscoveredJob | JobPosting): JobCaptionData {
  if ('raw_title' in job) {
    return {
      title: job.raw_title,
      company: job.raw_company,
      location: job.raw_location || undefined,
      salary: job.raw_salary || undefined,
      category: job.ai_category || undefined,
      experienceLevel: job.ai_experience_level || undefined,
      applyUrl: job.source_url || 'https://careers.springwebsolutions.in/jobs',
      sourceFact: !!job.raw_salary,
    }
  }

  return {
    title: job.title,
    company: job.company_name,
    location: `${job.location_city}, ${job.location_state}`,
    salary: job.salary_range,
    category: job.niche_category,
    experienceLevel: job.experience_level,
    applyUrl: `https://careers.springwebsolutions.in/jobs/${job.slug}`,
    sourceFact: true,
  }
}

export function generateJobCaption(
  job: DiscoveredJob | JobPosting,
  platform: SocialPlatform = 'linkedin'
): string {
  const data = extractJobCaptionData(job)
  const salaryLine = data.salary ? `💰 Compensation: ${data.salary} (Verified Source Fact)` : ''
  const locationLine = data.location ? `📍 Location: ${data.location}` : '📍 Location: Remote / India'
  const expLine = data.experienceLevel ? `🎯 Experience: ${data.experienceLevel}` : ''
  const catLine = data.category ? `🏷️ Role Domain: ${data.category}` : ''

  switch (platform) {
    case 'instagram':
      return `🚀 WE'RE HIRING! New Opportunity Alert 🔥

📌 Role: ${data.title}
🏢 Company: ${data.company}
${locationLine}
${salaryLine}
${expLine}
${catLine}

✨ Verified by SpringWeb AI Career Engine. 100% verified authentic job listings.

👉 Apply via link in bio or visit:
🔗 ${data.applyUrl}

Save this post & share with someone who needs to see this! 💼

#Hiring #JobAlert #CareerOpportunity #TechJobs #IndiaJobs #RemoteJobs #DeveloperJobs #SpringWebCareers #JobSearch #FreshersHiring #NowHiring`

    case 'linkedin':
      return `📢 New Job Opening Alert | ${data.title} at ${data.company}

We are highlighting an open job opportunity discovered and verified via the SpringWeb Career Intelligence Network:

🔹 Position: ${data.title}
🔹 Organization: ${data.company}
🔹 ${locationLine}
${salaryLine ? `🔹 ${salaryLine}\n` : ''}${expLine ? `🔹 ${expLine}\n` : ''}${catLine ? `🔹 ${catLine}\n` : ''}
🔗 Application & Details:
${data.applyUrl}

Stay connected with SpringWeb Solutions for weekly curated Indian tech and remote job vacancies.

#Hiring #Careers #JobOpening #Recruitment #IndiaTech #RemoteWork #TalentAcquisition #JobSeekers`

    case 'twitter':
      return `🔥 We're Hiring: ${data.title} at ${data.company}!

${locationLine}
${data.salary ? `💰 ${data.salary}\n` : ''}
Apply now & view full details 👇
🔗 ${data.applyUrl}

#JobAlert #TechJobs #Hiring #IndiaJobs`

    case 'whatsapp':
      return `*📢 NEW JOB VACANCY ALERT*
━━━━━━━━━━━━━━━━━━━━
*Role:* ${data.title}
*Company:* ${data.company}
*Location:* ${data.location || 'Remote / India'}
${data.salary ? `*Salary:* ${data.salary} (Verified)\n` : ''}${data.experienceLevel ? `*Experience:* ${data.experienceLevel}\n` : ''}
*Apply Link:* ${data.applyUrl}
━━━━━━━━━━━━━━━━━━━━
_Verified by SpringWeb Careers Portal_
_Share with friends & job seekers!_`

    case 'telegram':
      return `🚀 *NEW JOB ALERT* | *${data.title}*

🏢 *Company:* ${data.company}
📍 *Location:* ${data.location || 'Remote / India'}
${data.salary ? `💰 *Compensation:* \`${data.salary}\` (Verified)\n` : ''}${data.experienceLevel ? `🎯 *Level:* ${data.experienceLevel}\n` : ''}${data.category ? `🏷️ *Category:* ${data.category}\n` : ''}
🔗 *Direct Apply Link:*
${data.applyUrl}

⚡️ *Verified by SpringWeb AI Careers Engine*
Join our channel for daily verified job drops!`

    default:
      return `${data.title} at ${data.company} - ${data.applyUrl}`
  }
}
