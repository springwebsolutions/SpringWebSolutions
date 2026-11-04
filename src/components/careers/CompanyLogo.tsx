import React, { useState } from 'react'

interface CompanyLogoProps {
  logoUrl?: string
  companyName: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

// Map company name substrings to reliable domain for favicon fallback
const getCompanyDomain = (name: string): string => {
  const lower = name.toLowerCase()
  if (lower.includes('cisco')) return 'cisco.com'
  if (lower.includes('hackerrank')) return 'hackerrank.com'
  if (lower.includes('swiggy')) return 'swiggy.com'
  if (lower.includes('zoho')) return 'zohocorp.com'
  if (lower.includes('hexaware')) return 'hexaware.com'
  if (lower.includes('freshworks')) return 'freshworks.com'
  if (lower.includes('postman')) return 'postman.com'
  if (lower.includes('phonepe')) return 'phonepe.com'
  if (lower.includes('cred')) return 'cred.club'
  if (lower.includes('atlassian')) return 'atlassian.com'
  if (lower.includes('canonical') || lower.includes('ubuntu')) return 'canonical.com'
  if (lower.includes('gitlab')) return 'gitlab.com'
  if (lower.includes('automattic')) return 'automattic.com'
  if (lower.includes('razorpay')) return 'razorpay.com'
  return `${name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com`
}

// Brand gradient colors for monogram fallbacks
const getBrandGradient = (name: string): string => {
  const lower = name.toLowerCase()
  if (lower.includes('cisco')) return 'from-cyan-600 to-blue-700'
  if (lower.includes('hackerrank')) return 'from-emerald-600 to-teal-800'
  if (lower.includes('swiggy')) return 'from-orange-500 to-amber-600'
  if (lower.includes('zoho')) return 'from-red-500 via-amber-500 to-emerald-600'
  if (lower.includes('hexaware')) return 'from-blue-600 to-indigo-800'
  if (lower.includes('freshworks')) return 'from-amber-500 to-orange-600'
  if (lower.includes('postman')) return 'from-orange-500 to-red-600'
  if (lower.includes('phonepe')) return 'from-indigo-600 to-purple-800'
  if (lower.includes('cred')) return 'from-slate-800 to-zinc-950 border-white/20'
  if (lower.includes('atlassian')) return 'from-blue-500 to-cyan-600'
  if (lower.includes('canonical')) return 'from-orange-600 to-purple-900'
  if (lower.includes('gitlab')) return 'from-amber-600 to-orange-700'
  if (lower.includes('automattic')) return 'from-blue-600 to-slate-800'
  if (lower.includes('razorpay')) return 'from-blue-600 to-cyan-700'
  return 'from-emerald-600 to-teal-700'
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoUrl,
  companyName,
  className = '',
  size = 'md'
}) => {
  const [loadStage, setLoadStage] = useState<'primary' | 'domain' | 'initials'>('primary')
  const domain = getCompanyDomain(companyName)
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

  const sizeClass =
    size === 'sm' ? 'h-9 w-9 text-xs' :
    size === 'lg' ? 'h-14 w-14 text-lg' :
    'h-11 w-11 text-sm'

  // First 2 letters monogram
  const initials = companyName
    .split(' ')
    .slice(0, 2)
    .map(w => w.charAt(0).toUpperCase())
    .join('')

  return (
    <div
      className={`${sizeClass} rounded-2xl bg-white/[0.06] border border-white/10 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:border-emerald-500/40 transition-all ${className}`}
    >
      {loadStage === 'primary' && logoUrl ? (
        <img
          src={logoUrl}
          alt={`${companyName} Logo`}
          className="h-full w-full object-contain filter drop-shadow-sm"
          loading="lazy"
          onError={() => setLoadStage('domain')}
        />
      ) : loadStage === 'domain' || (loadStage === 'primary' && !logoUrl) ? (
        <img
          src={faviconUrl}
          alt={`${companyName} Icon`}
          className="h-full w-full object-contain filter drop-shadow-sm"
          loading="lazy"
          onError={() => setLoadStage('initials')}
        />
      ) : (
        <div
          className={`h-full w-full rounded-xl bg-gradient-to-br ${getBrandGradient(companyName)} flex items-center justify-center font-black text-white font-display uppercase tracking-wider text-[11px]`}
        >
          {initials}
        </div>
      )}
    </div>
  )
}
