import { useCareersStore } from '@/stores/careersStore'
import type { AdConfig } from '@/stores/careersStore'
import { ExternalLink, Megaphone } from 'lucide-react'

interface AdBannerProps {
  zoneId: AdConfig['zone_id']
  className?: string
}

export const AdBanner: React.FC<AdBannerProps> = ({ zoneId, className = '' }) => {
  const { adConfigs, fetchAdConfigs } = useCareersStore()

  useEffect(() => {
    fetchAdConfigs()
  }, [])

  const ad = adConfigs.find(a => a.zone_id === zoneId)

  // If ad slot is not configured or disabled, don't render
  if (!ad || !ad.is_active) {
    return null
  }

  return (
    <div className={`my-6 rounded-2xl overflow-hidden glass-panel border border-brand-emerald/20 p-4 relative group transition-all ${className}`}>
      {/* Sponsor badge */}
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-white/10 text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 z-10">
        <Megaphone size={9} />
        <span>Sponsored</span>
      </div>

      {ad.ad_type === 'custom_banner' && ad.image_url ? (
        <a
          href={ad.target_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative rounded-xl overflow-hidden group-hover:scale-[1.01] transition-transform"
        >
          <img
            src={ad.image_url}
            alt={ad.title || 'Sponsor Advertisement'}
            className="w-full h-auto max-h-48 object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-white font-semibold flex items-center gap-1">
              <span>Learn More</span>
              <ExternalLink size={12} />
            </span>
          </div>
        </a>
      ) : ad.ad_type === 'html_code' && ad.html_code ? (
        <div
          className="w-full overflow-hidden"
          dangerouslySetInnerHTML={{ __html: ad.html_code }}
        />
      ) : ad.ad_type === 'google_adsense' && ad.adsense_slot_id ? (
        <div className="w-full text-center py-6 bg-white/5 rounded-xl border border-dashed border-white/10">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={ad.adsense_client_id || 'ca-pub-XXXXXXXXXX'}
            data-ad-slot={ad.adsense_slot_id}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <p className="text-[10px] text-slate-500 mt-2 font-mono">Google AdSense Unit ({zoneId})</p>
        </div>
      ) : (
        /* Fallback subtle promo slot when ad activated without image */
        <a
          href={ad.target_url || 'https://www.springwebsolutions.in/contact'}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-400 font-display">
                {ad.title || 'Promote Your Opening Here'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-light">
                Reach thousands of active professionals and job seekers across Tamil Nadu &amp; India.
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold whitespace-nowrap flex items-center gap-1">
              <span>Post Job</span>
              <ExternalLink size={12} />
            </span>
          </div>
        </a>
      )}
    </div>
  )
}
