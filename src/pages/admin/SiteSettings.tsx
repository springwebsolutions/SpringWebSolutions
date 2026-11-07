import React, { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { usePageBuilderStore } from '@/stores/pageBuilderStore'
import { sendResendEmail, buildTestEmailHTML } from '@/lib/emailService'
import { Link } from 'react-router-dom'
import { 
  Settings, Save, Download, ShieldCheck, Mail, Send,
  Loader2, CheckCircle, AlertCircle, FileSpreadsheet, FileJson, Menu, Plus, Trash2, 
  MessageSquare, Bot, ToggleLeft, ToggleRight, ExternalLink, Shield, Smartphone, ChevronRight,
  Zap, Volume2, VolumeX, Sparkles, Activity
} from 'lucide-react'
import { DEFAULT_SWARM_CONFIG, type SwarmAdminConfig, AGENT_PERSONAS } from '@/lib/swarm/types'

export const SiteSettings: React.FC = () => {
  const { siteConfig, navigation, fetchSettings, saveNavigation } = usePageBuilderStore()
  
  // Header Menu Items State
  const [headerMenu, setHeaderMenu] = useState<Array<{ label: string; href: string }>>([])
  const [navSaving, setNavSaving] = useState(false)
  const [navSuccess, setNavSuccess] = useState(false)

  // Autonomous Swarm Simulation Governance State
  const [swarmConfig, setSwarmConfig] = useState<SwarmAdminConfig>(() => {
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('springweb_swarm_config')
        if (cached) return JSON.parse(cached)
      }
    } catch (e) {}
    return DEFAULT_SWARM_CONFIG
  })

  // General details
  const [companyName, setCompanyName] = useState('')
  const [tagline, setTagline] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [address, setAddress] = useState('')

  // Resend Email Settings
  const [resendApiKey, setResendApiKey] = useState('')
  const [resendFromEmail, setResendFromEmail] = useState('')
  const [resendNotifyEmail, setResendNotifyEmail] = useState('')
  const [testEmailLoading, setTestEmailLoading] = useState(false)
  const [testEmailStatus, setTestEmailStatus] = useState<{ success: boolean; msg: string } | null>(null)

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

  const [whatsappWidgetEnabled, setWhatsappWidgetEnabled] = useState(true)
  const [aiChatEnabled, setAiChatEnabled] = useState(true)
  const [footerCtaLabel, setFooterCtaLabel] = useState('Get in Touch')

  const isSuiteDomain = typeof window !== 'undefined' && window.location.hostname.toLowerCase().startsWith('suite.')

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

      const resend = (siteConfig as any).resend_config || {}
      setResendApiKey(resend.api_key || '')
      setResendFromEmail(resend.from_email || 'hello@springwebsolutions.in')
      setResendNotifyEmail(resend.notify_email || 'sales@springwebsolutions.in')

      const swarm = (siteConfig as any).swarm_config
      if (swarm) {
        setSwarmConfig(swarm)
      }
    }
    if (navigation && navigation.header_menu) {
      setHeaderMenu(JSON.parse(JSON.stringify(navigation.header_menu)))
    }
  }, [siteConfig, navigation])

  const handleHeaderMenuItemChange = (index: number, key: 'label' | 'href', value: string) => {
    const updated = [...headerMenu]
    updated[index][key] = value
    setHeaderMenu(updated)
  }

  const handleAddMenuItem = () => {
    setHeaderMenu(prev => [...prev, { label: 'New Link', href: '/' }])
  }

  const handleRemoveMenuItem = (index: number) => {
    setHeaderMenu(prev => prev.filter((_, i) => i !== index))
  }

  const handleSaveNavigation = async () => {
    setNavSaving(true)
    setNavSuccess(false)
    try {
      const navPayload = {
        ...(navigation || {}),
        header_menu: headerMenu
      }
      await saveNavigation(navPayload)
      setNavSuccess(true)
      setTimeout(() => setNavSuccess(false), 3000)
    } catch (err) {
      console.error('Save navigation error:', err)
    } finally {
      setNavSaving(false)
    }
  }

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

      const resendConfig = {
        api_key: resendApiKey.trim(),
        from_email: resendFromEmail.trim() || 'hello@springwebsolutions.in',
        notify_email: resendNotifyEmail.trim() || 'sales@springwebsolutions.in'
      }

      const value = {
        company_name: companyName,
        tagline,
        contact_email: email,
        contact_phone: phone,
        whatsapp_number: whatsapp,
        address,
        social_links: socialLinks,
        resend_config: resendConfig,
        swarm_config: swarmConfig
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('springweb_swarm_config', JSON.stringify(swarmConfig))
      }

      const { error } = await supabase
        .from('settings')
        .update({ value })
        .eq('key', 'site_config')

      if (error) throw error

      setNotification({ type: 'success', msg: 'System, social media & Resend email settings saved to database.' })
      fetchSettings()
      // Auto-dismiss success toast after 4 seconds
      setTimeout(() => setNotification(null), 4000)
    } catch (err: any) {
      console.error(err)
      setNotification({ type: 'error', msg: err.message || 'Error saving settings.' })
    } finally {
      setSaving(false)
    }
  }

  const handleTestResendEmail = async () => {
    setTestEmailLoading(true)
    setTestEmailStatus(null)

    const targetRecipient = resendNotifyEmail || email || 'hello@springwebsolutions.in'
    const sender = resendFromEmail || 'hello@springwebsolutions.in'
    const keyToUse = resendApiKey || undefined

    const result = await sendResendEmail(
      {
        from: sender.includes('<') ? sender : `Spring Web Solutions <${sender}>`,
        to: targetRecipient,
        subject: `[Test] Resend Email Integration Verified - ${new Date().toLocaleTimeString()}`,
        html: buildTestEmailHTML(sender)
      },
      keyToUse
    )

    if (result.success) {
      setTestEmailStatus({
        success: true,
        msg: `Test email successfully dispatched to ${targetRecipient} via Resend!`
      })
    } else {
      setTestEmailStatus({
        success: false,
        msg: result.error || 'Failed to dispatch test email.'
      })
    }
    setTestEmailLoading(false)
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

  const prefix = isSuiteDomain ? '' : '/admin'

  return (
    <div className="space-y-6">
      
      {/* Sub-Navigation Header Bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3 flex-wrap">
        <Link
          to={`${prefix}/settings`}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all"
        >
          Site Settings &amp; Configuration
        </Link>
        <Link
          to={`${prefix}/security/2fa`}
          className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] text-slate-400 hover:text-white text-xs font-medium transition-all"
        >
          2FA Security Assurance
        </Link>
        <Link
          to={`${prefix}/health`}
          className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] text-slate-400 hover:text-white text-xs font-medium transition-all"
        >
          System Telemetry &amp; Health
        </Link>
      </div>

      {/* Animated fixed-position toast notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium animate-fade-in-up transition-all ${
          notification.type === 'success'
            ? 'bg-[#06080f] border-emerald-500/30 text-emerald-400 shadow-emerald-500/20'
            : 'bg-[#06080f] border-rose-500/30 text-rose-400 shadow-rose-500/20'
        }`}>
          {notification.type === 'success'
            ? <CheckCircle size={16} className="shrink-0" />
            : <AlertCircle size={16} className="shrink-0" />}
          <span>{notification.msg}</span>
          <button onClick={() => setNotification(null)} className="ml-2 text-slate-500 hover:text-white transition-colors">&times;</button>
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

          {/* Resend Email Integration Section */}
          <div className="border-t border-white/5 pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="font-display font-bold text-white text-sm flex items-center gap-2">
                <Mail size={16} className="text-brand-emerald" />
                <span>Resend Email Dispatcher Integration</span>
              </h4>
              <span className="px-2.5 py-1 rounded-full bg-brand-emerald/15 border border-brand-emerald/30 text-brand-emerald text-[11px] font-semibold flex items-center gap-1 w-max">
                <CheckCircle size={12} />
                <span>Vercel RESEND_API_KEY Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Configure Resend API credentials for automated lead notifications, ticket alerts, and transactional client communications.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resend API Key (`re_...`)</label>
                <input
                  type="password"
                  value={resendApiKey}
                  onChange={(e) => setResendApiKey(e.target.value)}
                  placeholder="re_123456789_abcdefg..."
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white font-mono focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sender Address (From Email)</label>
                <input
                  type="email"
                  value={resendFromEmail}
                  onChange={(e) => setResendFromEmail(e.target.value)}
                  placeholder="hello@springwebsolutions.in"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lead Recipient Email (To Email)</label>
                <input
                  type="email"
                  value={resendNotifyEmail}
                  onChange={(e) => setResendNotifyEmail(e.target.value)}
                  placeholder="sales@springwebsolutions.in"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>
            </div>

            {testEmailStatus && (
              <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2 ${
                testEmailStatus.success ? 'bg-brand-emerald/15 border border-brand-emerald/20 text-brand-emerald' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
              }`}>
                {testEmailStatus.success ? <CheckCircle className="shrink-0 mt-0.5" size={14} /> : <AlertCircle className="shrink-0 mt-0.5" size={14} />}
                <span>{testEmailStatus.msg}</span>
              </div>
            )}

            <div className="pt-1">
              <button
                type="button"
                onClick={handleTestResendEmail}
                disabled={testEmailLoading}
                className="btn-secondary text-xs py-2 px-4 flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {testEmailLoading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} className="text-brand-emerald" />}
                <span>Send Test Resend Email</span>
              </button>
            </div>
          </div>

          {/* Full-Page Swarm Rebuild Governance Card */}
          <div className="border-t border-white/5 pt-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-display font-bold text-white text-sm flex items-center gap-2">
                  <Zap size={16} className="text-cyan-400" />
                  <span>Full-Page "Swarm Rebuild" Animation</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Multiplayer cursor swarm that reconstructs the entire website piece-by-piece in front of visitors.
                </p>
              </div>

              {/* Master Toggle */}
              <button
                type="button"
                onClick={() => setSwarmConfig(prev => ({ ...prev, is_enabled: !prev.is_enabled }))}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                  swarmConfig.is_enabled
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {swarmConfig.is_enabled ? (
                  <>
                    <ToggleRight size={18} className="text-emerald-400" />
                    <span>Swarm Active</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft size={18} className="text-slate-500" />
                    <span>Disabled</span>
                  </>
                )}
              </button>
            </div>

            {/* Sub-controls grid (Active only if master toggle is on) */}
            <div className={`space-y-4 transition-opacity duration-200 ${swarmConfig.is_enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              
              {/* Trigger Frequency Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={13} className="text-emerald-400" />
                  <span>Trigger Frequency &amp; Visitor Experience</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'first_visit_session', label: 'First Visit in Session', desc: 'Runs on initial visit; subsequent page navs are instant (Recommended)' },
                    { id: 'every_visit', label: 'Always Rebuild (Demo Mode)', desc: 'Rebuilds on every visit & page refresh for presentations' },
                    { id: 'manual_only', label: 'Manual Trigger Only', desc: 'Site loads normally; users trigger via Alt+S or bottom pill' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSwarmConfig(prev => ({ ...prev, trigger_frequency: mode.id as any }))}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        swarmConfig.trigger_frequency === mode.id
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                          : 'bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs">{mode.label}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Switches Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Floating Badge Switch */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-white">Floating Trigger Pill</div>
                    <div className="text-[11px] text-slate-400">Shows "[⚡ Swarm Build]" badge on bottom corner</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSwarmConfig(prev => ({ ...prev, show_floating_badge: !prev.show_floating_badge }))}
                    className="cursor-pointer"
                  >
                    {swarmConfig.show_floating_badge ? (
                      <ToggleRight size={22} className="text-emerald-400" />
                    ) : (
                      <ToggleLeft size={22} className="text-slate-500" />
                    )}
                  </button>
                </div>

                {/* Hotkey Switch */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-white">Keyboard Hotkey</div>
                    <div className="text-[11px] text-slate-400">Press <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">Alt + S</kbd> to assemble DOM</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSwarmConfig(prev => ({ ...prev, hotkey_enabled: !prev.hotkey_enabled }))}
                    className="cursor-pointer"
                  >
                    {swarmConfig.hotkey_enabled ? (
                      <ToggleRight size={22} className="text-emerald-400" />
                    ) : (
                      <ToggleLeft size={22} className="text-slate-500" />
                    )}
                  </button>
                </div>

                {/* Sound Synthesizer Switch */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Volume2 size={13} className="text-amber-400" />
                      <span>Procedural Web Audio Engine</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Synthesized typewriter clicks and component snap pops</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSwarmConfig(prev => ({ ...prev, sound_enabled: !prev.sound_enabled }))}
                    className="cursor-pointer"
                  >
                    {swarmConfig.sound_enabled ? (
                      <ToggleRight size={22} className="text-emerald-400" />
                    ) : (
                      <ToggleLeft size={22} className="text-slate-500" />
                    )}
                  </button>
                </div>

                {/* Default Speed Selector */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-white">Default Execution Speed</div>
                    <div className="text-[11px] text-slate-400">Pace for crosshairs, typing &amp; snapping</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {(['1x', '2x', '3x'] as const).map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setSwarmConfig(prev => ({ ...prev, default_speed: spd }))}
                        className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          swarmConfig.default_speed === spd
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {spd}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Persona Roster Preview */}
              <div className="p-3.5 rounded-xl bg-[#030610] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Sparkles size={13} className="text-emerald-400" />
                    <span>Active Multi-Agent Swarm (6 Concurrent Design-Tool Cursors)</span>
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400">60 FPS Boids Physics</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {Object.values(AGENT_PERSONAS).map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-lg border flex items-center gap-2"
                      style={{ borderColor: `${p.color}35`, backgroundColor: `${p.color}10` }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.avatarChar}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-white truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{p.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
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

          {/* Navigation Links Manager Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h4 className="font-display font-semibold text-xs text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Menu className="text-brand-emerald" size={16} />
                <span>Header Navbar Links</span>
              </h4>
              <button
                onClick={handleAddMenuItem}
                className="btn-secondary text-[11px] py-1 px-2 flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Link</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Add, edit, or remove top navigation bar menu links.
            </p>

            <div className="space-y-3 pt-1">
              {headerMenu.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleHeaderMenuItemChange(idx, 'label', e.target.value)}
                    placeholder="Label"
                    className="w-1/2 px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald"
                  />
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) => handleHeaderMenuItemChange(idx, 'href', e.target.value)}
                    placeholder="/path"
                    className="w-1/2 px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-slate-300 focus:outline-none focus:border-brand-emerald"
                  />
                  <button
                    onClick={() => handleRemoveMenuItem(idx)}
                    className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 shrink-0 cursor-pointer"
                    title="Remove link"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {navSuccess && (
              <div className="p-2 rounded bg-brand-emerald/15 text-brand-emerald text-xs flex items-center gap-1">
                <CheckCircle size={14} />
                <span>Navbar links updated!</span>
              </div>
            )}

            <button
              onClick={handleSaveNavigation}
              disabled={navSaving}
              className="w-full btn-primary text-xs py-2 flex items-center justify-center gap-1.5 font-semibold cursor-pointer"
            >
              {navSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              <span>Save Navigation Links</span>
            </button>
          </div>
        </div>

      </div>

      {/* ─── Floating Widgets & Footer CTA Controls ─────────────────────── */}
      <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
        <div className="border-b border-white/5 pb-3">
          <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
            <MessageSquare size={16} className="text-emerald-500" />
            Floating Widgets & Footer Controls
          </h3>
          <p className="text-xs text-slate-500 mt-1">Manage the visibility of floating contact buttons and footer CTA labels.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* WhatsApp Widget Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/8">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <MessageSquare size={16} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">WhatsApp Widget</div>
                <div className="text-xs text-slate-500">Floating WhatsApp Us button</div>
              </div>
            </div>
            <button
              onClick={() => setWhatsappWidgetEnabled(!whatsappWidgetEnabled)}
              className="cursor-pointer transition-colors"
              title="Toggle WhatsApp Widget"
            >
              {whatsappWidgetEnabled
                ? <ToggleRight size={32} className="text-emerald-400" />
                : <ToggleLeft size={32} className="text-slate-600" />
              }
            </button>
          </div>

          {/* AI Chat Widget Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/8">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Bot size={16} className="text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">AI Assistant Widget</div>
                <div className="text-xs text-slate-500">Floating AI chat assistant</div>
              </div>
            </div>
            <button
              onClick={() => setAiChatEnabled(!aiChatEnabled)}
              className="cursor-pointer transition-colors"
              title="Toggle AI Chat Widget"
            >
              {aiChatEnabled
                ? <ToggleRight size={32} className="text-indigo-400" />
                : <ToggleLeft size={32} className="text-slate-600" />
              }
            </button>
          </div>
        </div>

        {/* Footer CTA Label */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Footer CTA Button Label</label>
          <input
            type="text"
            value={footerCtaLabel}
            onChange={(e) => setFooterCtaLabel(e.target.value)}
            className="w-full sm:w-80 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
            placeholder="Get in Touch"
          />
          <p className="text-[11px] text-slate-600">This controls the label of the primary CTA button in the footer section.</p>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <p className="text-xs text-slate-500">Widget toggle persistence is coming in the next release. Changes here are visual previews only.</p>
        </div>
      </div>

      {/* Account Security & 2FA */}
      <div className="bg-[#06080f] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-white/5">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Shield size={18} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Account Security &amp; 2FA</h2>
            <p className="text-xs text-slate-500">Manage Two-Factor Authenticator security for your admin user</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Smartphone size={16} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Two-Factor Authentication (TOTP)</div>
              <div className="text-xs text-slate-500">Protect your login with Google Authenticator or Authy</div>
            </div>
          </div>
          <Link
            to={isSuiteDomain ? '/security/2fa' : '/admin/security/2fa'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-semibold transition-all"
          >
            <span>Configure 2FA</span>
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>

    </div>
  )
}
export default SiteSettings

