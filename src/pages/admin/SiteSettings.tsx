import React, { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { 
  Settings, Save, Download, ShieldCheck, 
  Loader2, CheckCircle, AlertCircle, FileSpreadsheet, FileJson 
} from 'lucide-react'

export const SiteSettings: React.FC = () => {
  const { siteConfig, fetchSettings } = usePageBuilderStore()
  
  // General details
  const [companyName, setCompanyName] = useState('')
  const [tagline, setTagline] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [address, setAddress] = useState('')

  // Social Media Links
  const [github, setGithub] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [twitter, setTwitter] = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [youtube, setYoutube] = useState('')

  const [saving, setSaving] = useState(false)
  const [exportLoading, setExportLoading] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    if (siteConfig) {
      setCompanyName(siteConfig.company_name || '')
      setTagline(siteConfig.tagline || '')
      setEmail(siteConfig.contact_email || '')
      setPhone(siteConfig.contact_phone || '')
      setWhatsapp(siteConfig.whatsapp_number || '')
      setAddress(siteConfig.address || '')

      const socials = siteConfig.social_links || {}
      setGithub(socials.github || '')
      setLinkedin(socials.linkedin || '')
      setTwitter(socials.twitter || '')
      setInstagram(socials.instagram || '')
      setFacebook(socials.facebook || '')
      setYoutube(socials.youtube || '')
    }
  }, [siteConfig])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSupabaseConfigured) return
    setSaving(true)
    setNotification(null)

    try {
      const socialLinks: Record<string, string> = {}
      if (github.trim()) socialLinks.github = github.trim()
      if (linkedin.trim()) socialLinks.linkedin = linkedin.trim()
      if (twitter.trim()) socialLinks.twitter = twitter.trim()
      if (instagram.trim()) socialLinks.instagram = instagram.trim()
      if (facebook.trim()) socialLinks.facebook = facebook.trim()
      if (youtube.trim()) socialLinks.youtube = youtube.trim()

      const value = {
        company_name: companyName,
        tagline,
        contact_email: email,
        contact_phone: phone,
        whatsapp_number: whatsapp,
        address,
        social_links: socialLinks
      }

      const { error } = await supabase
        .from('settings')
        .update({ value })
        .eq('key', 'site_config')

      if (error) throw error

      setNotification({ type: 'success', msg: 'System & social media configurations saved to database.' })
      fetchSettings()
    } catch (err: any) {
      console.error(err)
      setNotification({ type: 'error', msg: err.message || 'Error saving settings.' })
    } finally {
      setSaving(false)
    }
  }

  // File exporter utility function
  const triggerDataExport = async (tableName: string, fileName: string) => {
    if (!isSupabaseConfigured) return
    setExportLoading(tableName)

    try {
      const { data, error } = await supabase.from(tableName).select('*')
      if (error) throw error

      // Stringify data
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`
      
      // Trigger download anchor
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute('href', jsonString)
      downloadAnchor.setAttribute('download', `${fileName}-${Date.now()}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()

    } catch (err) {
      console.error(`Export failed for table ${tableName}:`, err)
      alert('Backup extraction failed. Review database status.')
    } finally {
      setExportLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      
      {notification && (
        <div className={`p-4 rounded-xl flex items-start gap-2.5 text-sm ${
          notification.type === 'success' ? 'bg-brand-emerald/15 border border-brand-emerald/20 text-brand-emerald' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="shrink-0 mt-0.5" size={16} /> : <AlertCircle className="shrink-0 mt-0.5" size={16} />}
          <span>{notification.msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Core settings (Col: 8) */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-8 glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="font-display font-bold text-white text-base border-b border-white/5 pb-2">HQ Contact Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company/Agency Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Agency Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Tagline</label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">WhatsApp Contact Number</label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Physical Address</label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
            />
          </div>

          {/* Social Media Links Section */}
          <div className="border-t border-white/5 pt-6 space-y-4">
            <h4 className="font-display font-bold text-white text-sm">Social Media Handles & Profiles</h4>
            <p className="text-xs text-slate-400">Add or remove your company social media URLs. Empty fields will automatically hide that platform's icon across the site.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">GitHub URL</label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/youragency"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">LinkedIn URL</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/company/youragency"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Twitter / X URL</label>
                <input
                  type="url"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://x.com/youragency"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Instagram URL</label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/youragency"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Facebook URL</label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/youragency"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">YouTube URL</label>
                <input
                  type="url"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/@youragency"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full btn-primary py-2.5 flex items-center justify-center gap-1.5 font-semibold cursor-pointer"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>Save Settings configurations</span>
          </button>
        </form>

        {/* Exports panel (Col: 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-5">
            <h4 className="font-display font-semibold text-xs text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-1.5">
              <ShieldCheck className="text-brand-emerald" size={16} />
              <span>Backups & Exports</span>
            </h4>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Export database records immediately as JSON files to migrate or backup configurations.
            </p>

            <div className="space-y-3 pt-2">
              {/* Leads */}
              <button
                onClick={() => triggerDataExport('leads', 'leads-export')}
                disabled={exportLoading !== null}
                className="w-full btn-secondary text-xs flex items-center justify-between py-2 px-3 disabled:opacity-40"
              >
                <span className="flex items-center gap-2">
                  <FileSpreadsheet size={14} className="text-brand-emerald" />
                  <span>Export Lead CRM Entries</span>
                </span>
                {exportLoading === 'leads' ? <Loader2 className="animate-spin" size={12} /> : <Download size={12} />}
              </button>

              {/* Blog */}
              <button
                onClick={() => triggerDataExport('blog_posts', 'blog-export')}
                disabled={exportLoading !== null}
                className="w-full btn-secondary text-xs flex items-center justify-between py-2 px-3 disabled:opacity-40"
              >
                <span className="flex items-center gap-2">
                  <FileJson size={14} className="text-brand-indigo" />
                  <span>Export Blog Posts</span>
                </span>
                {exportLoading === 'blog_posts' ? <Loader2 className="animate-spin" size={12} /> : <Download size={12} />}
              </button>

              {/* Products */}
              <button
                onClick={() => triggerDataExport('products', 'marketplace-export')}
                disabled={exportLoading !== null}
                className="w-full btn-secondary text-xs flex items-center justify-between py-2 px-3 disabled:opacity-40"
              >
                <span className="flex items-center gap-2">
                  <FileJson size={14} className="text-emerald-400" />
                  <span>Export Products Catalog</span>
                </span>
                {exportLoading === 'products' ? <Loader2 className="animate-spin" size={12} /> : <Download size={12} />}
              </button>

              {/* Settings */}
              <button
                onClick={() => triggerDataExport('settings', 'settings-backup')}
                disabled={exportLoading !== null}
                className="w-full btn-secondary text-xs flex items-center justify-between py-2 px-3 disabled:opacity-40"
              >
                <span className="flex items-center gap-2">
                  <Settings size={14} className="text-slate-400" />
                  <span>Backup Configurations Settings</span>
                </span>
                {exportLoading === 'settings' ? <Loader2 className="animate-spin" size={12} /> : <Download size={12} />}
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
export default SiteSettings
