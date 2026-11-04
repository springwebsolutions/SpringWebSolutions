import React, { useState } from 'react'

interface CompanyLogoProps {
  logoUrl?: string
  companyName: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

// ─── Inline High-Precision Vector Brand Logos (Zero External CDN Dependency, Zero 403s) ───
const BrandVectors: Record<string, (size: number) => React.ReactNode> = {
  // Cisco Systems - Iconic 9-bar bridge in cyan
  cisco: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#0b1b36" />
      <g fill="#00bceb">
        <rect x="7" y="22" width="2.2" height="6" rx="1.1" />
        <rect x="10.5" y="17" width="2.2" height="11" rx="1.1" />
        <rect x="14" y="20" width="2.2" height="8" rx="1.1" />
        <rect x="17.5" y="14" width="2.2" height="14" rx="1.1" />
        <rect x="21" y="14" width="2.2" height="14" rx="1.1" />
        <rect x="24.5" y="20" width="2.2" height="8" rx="1.1" />
        <rect x="28" y="17" width="2.2" height="11" rx="1.1" />
        <rect x="31.5" y="22" width="2.2" height="6" rx="1.1" />
      </g>
    </svg>
  ),

  // HackerRank - Distinctive green cube mark with white bracket H
  hackerrank: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#00ea64" />
      <path d="M14 11v18h3.8v-6.6h4.4V29H26V11h-3.8v6.4h-4.4V11H14z" fill="#091b1f" />
    </svg>
  ),

  // Swiggy - Signature orange delivery emblem
  swiggy: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#fc8019" />
      <path
        d="M20 9c-4.4 0-8 3.5-8 7.8 0 5.7 6.6 12.3 7.5 13.2.3.3.7.3 1 0 .9-.9 7.5-7.5 7.5-13.2 0-4.3-3.6-7.8-8-7.8zm0 10.5c-1.7 0-3.1-1.3-3.1-3s1.4-3 3.1-3 3.1 1.3 3.1 3-1.4 3-3.1 3z"
        fill="#ffffff"
      />
    </svg>
  ),

  // Zoho Corporation - 4 colorful toy blocks
  zoho: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#0b1329" />
      <rect x="10" y="10" width="9" height="9" rx="2" fill="#e42527" />
      <rect x="21" y="10" width="9" height="9" rx="2" fill="#22b24c" />
      <rect x="10" y="21" width="9" height="9" rx="2" fill="#008bd2" />
      <rect x="21" y="21" width="9" height="9" rx="2" fill="#ffb900" />
    </svg>
  ),

  // Hexaware Technologies - Deep blue tech prism
  hexaware: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#0a1d37" />
      <polygon points="20,10 29,15 29,25 20,30 11,25 11,15" fill="none" stroke="#0077ff" strokeWidth="2.5" />
      <polygon points="20,15 25,18 25,22 20,25 15,22 15,18" fill="#00b4d8" />
    </svg>
  ),

  // Freshworks - Vibrant orange / yellow tech icon
  freshworks: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#fff5ec" />
      <circle cx="16" cy="16" r="4.5" fill="#ff5a00" />
      <circle cx="24" cy="16" r="4.5" fill="#f89c1e" />
      <circle cx="16" cy="24" r="4.5" fill="#f25f22" />
      <circle cx="24" cy="24" r="4.5" fill="#ff8c00" />
    </svg>
  ),

  // Postman - Orange astronaut space badge
  postman: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#ff6c37" />
      <circle cx="20" cy="18" r="6" fill="#ffffff" />
      <path d="M12 28c0-4.4 3.6-8 8-8s8 3.6 8 8v2H12v-2z" fill="#ffffff" />
      <circle cx="20" cy="18" r="3.5" fill="#ff6c37" />
    </svg>
  ),

  // PhonePe - Indigo & purple payment emblem
  phonepe: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#5f259f" />
      <text x="20" y="27" fontSize="20" fontWeight="bold" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">
        पे
      </text>
    </svg>
  ),

  // CRED - Monochromatic black & white badge
  cred: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#121212" stroke="#333333" strokeWidth="1" />
      <path d="M14 13h12v14H14z" fill="none" stroke="#ffffff" strokeWidth="2" />
      <path d="M18 17h4v6h-4z" fill="#ffffff" />
    </svg>
  ),

  // Atlassian - Blue converging sails
  atlassian: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#0052cc" />
      <path
        d="M19.7 12.8c-.4.5-.4 1.2 0 1.7l4.3 5.4c.5.6 1.4.6 1.9 0l2.3-2.9c.4-.5.4-1.2 0-1.7l-6.6-8.2c-.5-.6-1.4-.6-1.9 0l-5.7 7.1c-.4.5-.4 1.2 0 1.7l4.3 5.4c.5.6 1.4.6 1.9 0l1.4-1.8"
        fill="#ffffff"
      />
    </svg>
  ),

  // Canonical (Ubuntu) - Circle of friends in aubergine/orange
  canonical: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#e95420" />
      <circle cx="20" cy="20" r="11" fill="none" stroke="#ffffff" strokeWidth="2.5" />
      <circle cx="20" cy="11.5" r="2.2" fill="#ffffff" />
      <circle cx="12.6" cy="24.2" r="2.2" fill="#ffffff" />
      <circle cx="27.4" cy="24.2" r="2.2" fill="#ffffff" />
    </svg>
  ),

  // GitLab - Iconic orange/red origami fox
  gitlab: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#1b122c" />
      <polygon points="20,29 13,15 27,15" fill="#e24329" />
      <polygon points="13,15 10,23 20,29" fill="#fc6d26" />
      <polygon points="27,15 30,23 20,29" fill="#fc6d26" />
      <polygon points="10,23 8,17 13,15" fill="#fca326" />
      <polygon points="30,23 32,17 27,15" fill="#fca326" />
    </svg>
  ),

  // Automattic - WordPress blue W badge
  automattic: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#0087be" />
      <circle cx="20" cy="20" r="10" fill="none" stroke="#ffffff" strokeWidth="1.8" />
      <path
        d="M13 19.5l4.8 10 2.2-6.5-1.5-3.5h-5.5zm11.2.2c0-1.2-.4-2-1-2.8-.7-.9-1.3-1.6-1.3-2.5 0-1 .8-1.9 1.9-1.9.1 0 .2 0 .3 0l-3.3-1.5c-4.4 0-8 3.6-8 8 0 1.8.6 3.4 1.6 4.7l4.4-12.8 3.5 10.3 1.9-1.5z"
        fill="#ffffff"
      />
    </svg>
  ),

  // Razorpay - Royal blue lightning bolt
  razorpay: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#0c2340" />
      <polygon points="23,9 12,23 18,23 15,31 28,17 21,17" fill="#3395ff" />
    </svg>
  ),

  // Thoughtworks - Coral red & violet tech mark
  thoughtworks: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#1b0028" />
      <path d="M12 14h16v4h-6v12h-4V18h-6v-4z" fill="#f2617a" />
      <circle cx="28" cy="26" r="3" fill="#ffb400" />
    </svg>
  ),

  // Red Hat - Fedora red shadowman badge
  redhat: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#111111" />
      <path d="M10 24c3-1 8-2 10-2s7 1 10 2c-1 3-5 5-10 5s-9-2-10-5z" fill="#e00" />
      <path d="M16 22c0-3 2-6 4-6s4 3 4 6h-8z" fill="#e00" />
      <path d="M14 23c2.5-.5 4-.8 6-.8s3.5.3 6 .8c-2 1.5-4 2-6 2s-4-.5-6-2z" fill="#ffffff" />
    </svg>
  ),

  // BrowserStack - Blue testing cloud nodes
  browserstack: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#0b1b36" />
      <circle cx="16" cy="20" r="6" fill="#0080ff" />
      <circle cx="24" cy="20" r="6" fill="#00c853" fillOpacity="0.85" />
    </svg>
  ),

  // Fractal Analytics - AI geometric neural node
  fractal: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#04202c" />
      <polygon points="20,10 28,16 28,26 20,32 12,26 12,16" fill="none" stroke="#00e676" strokeWidth="2" />
      <circle cx="20" cy="21" r="3.5" fill="#00e676" />
    </svg>
  ),

  // CrowdStrike - Falcon red threat hunter badge
  crowdstrike: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#1a0505" />
      <path d="M12 28l16-16-4 16-6-6-6 6z" fill="#ff2a2a" />
    </svg>
  ),

  // Jio Platforms - Vibrant blue & red digital telecom mark
  jio: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#0a2885" />
      <circle cx="20" cy="20" r="11" fill="#e11b22" />
      <text x="20" y="24" fontSize="12" fontWeight="900" fill="#ffffff" textAnchor="middle" fontFamily="sans-serif">
        Jio
      </text>
    </svg>
  ),

  // TCS / Tata - Signature blue global mark
  tcs: (s: number) => (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <rect width="40" height="40" rx="8" fill="#001d4a" />
      <text x="20" y="25" fontSize="11" fontWeight="bold" fill="#00a8e8" textAnchor="middle" fontFamily="sans-serif">
        TCS
      </text>
    </svg>
  )
}

const findBrandKey = (name: string): string | null => {
  const lower = (name || '').toLowerCase()
  if (lower.includes('cisco')) return 'cisco'
  if (lower.includes('hackerrank')) return 'hackerrank'
  if (lower.includes('swiggy')) return 'swiggy'
  if (lower.includes('zoho')) return 'zoho'
  if (lower.includes('hexaware')) return 'hexaware'
  if (lower.includes('freshworks')) return 'freshworks'
  if (lower.includes('postman')) return 'postman'
  if (lower.includes('phonepe')) return 'phonepe'
  if (lower.includes('cred')) return 'cred'
  if (lower.includes('atlassian')) return 'atlassian'
  if (lower.includes('canonical') || lower.includes('ubuntu')) return 'canonical'
  if (lower.includes('gitlab')) return 'gitlab'
  if (lower.includes('automattic')) return 'automattic'
  if (lower.includes('razorpay')) return 'razorpay'
  if (lower.includes('thoughtworks')) return 'thoughtworks'
  if (lower.includes('red hat') || lower.includes('redhat') || lower.includes('ibm')) return 'redhat'
  if (lower.includes('browserstack')) return 'browserstack'
  if (lower.includes('fractal')) return 'fractal'
  if (lower.includes('crowdstrike') || lower.includes('quick heal')) return 'crowdstrike'
  if (lower.includes('jio')) return 'jio'
  if (lower.includes('tcs') || lower.includes('tata')) return 'tcs'
  return null
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoUrl,
  companyName,
  className = '',
  size = 'md'
}) => {
  const [loadError, setLoadError] = useState(false)

  const pxSize = size === 'sm' ? 32 : size === 'lg' ? 48 : 40
  const sizeClass =
    size === 'sm' ? 'h-8 w-8' :
    size === 'lg' ? 'h-12 w-12' :
    'h-10 w-10'

  const brandKey = findBrandKey(companyName)

  // 1. If we have an exact built-in SVG vector, use it immediately (100% reliable, zero 403s)
  if (brandKey && BrandVectors[brandKey]) {
    return (
      <div className={`${sizeClass} rounded-xl overflow-hidden shrink-0 shadow-md group-hover:scale-105 transition-transform ${className}`}>
        {BrandVectors[brandKey](pxSize)}
      </div>
    )
  }

  // 2. Fallback to external logoUrl if available and not erroring
  if (logoUrl && !loadError) {
    return (
      <div
        className={`${sizeClass} rounded-xl bg-white/[0.08] border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:border-emerald-500/40 transition-all ${className}`}
      >
        <img
          src={logoUrl}
          alt={`${companyName} Logo`}
          className="h-full w-full object-contain filter drop-shadow-sm"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setLoadError(true)}
        />
      </div>
    )
  }

  // 3. Fallback to clean 2-letter company monogram
  const initials = companyName
    .split(' ')
    .slice(0, 2)
    .map(w => w.charAt(0).toUpperCase())
    .join('')

  return (
    <div
      className={`${sizeClass} rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center font-black text-white font-display uppercase tracking-wider text-xs shadow-md shrink-0 ${className}`}
    >
      {initials}
    </div>
  )
}
