import React, { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { 
  ShoppingBag, Plus, Edit, Trash2, Save, 
  Key, History, Loader2, CheckCircle, AlertCircle, ArrowLeft 
} from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  short_description: string
  description: string
  price: number
  is_free: boolean
  download_url: string | null
  demo_url: string | null
  documentation_url: string | null
  version: string
  type: string
  status: 'active' | 'inactive' | 'archived'
  changelog: Array<{ version: string; date: string; changes: string[] }>
}

interface License {
  id: string
  license_key: string
  max_activations: number
  current_activations: number
  status: string
  expires_at: string | null
  profiles?: {
    full_name: string
  } | null
  products?: {
    name: string
  } | null
}

export const MarketplaceCMS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  
  // View states
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [cmsTab, setCmsTab] = useState<'products' | 'licenses'>('products')

  // Product Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [isFree, setIsFree] = useState(true)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [docUrl, setDocUrl] = useState('')
  const [version, setVersion] = useState('1.0.0')
  const [type, setType] = useState('saas')
  const [status, setStatus] = useState<'active' | 'inactive' | 'archived'>('active')
  
  // Changelog logs state
  const [changelogsList, setChangelogsList] = useState<any[]>([])
  
  const [actionLoading, setActionLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

  const fetchCMSData = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    try {
      const [prodRes, licRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('licenses').select('*, profiles(full_name), products(name)').order('created_at', { ascending: false })
      ])

      if (prodRes.error) throw prodRes.error
      setProducts(prodRes.data || [])
      setLicenses(licRes.data || [])
    } catch (err) {
      console.error('Error fetching marketplace records:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCMSData()
  }, [])

  // Auto-generate slug from name
  useEffect(() => {
    if (!currentProduct && name) {
      setSlug(
        name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      )
    }
  }, [name, currentProduct])

  const handleCreateNewClick = () => {
    setCurrentProduct(null)
    setName('')
    setSlug('')
    setShortDesc('')
    setDescription('')
    setPrice(0)
    setIsFree(true)
    setDownloadUrl('')
    setDemoUrl('')
    setDocUrl('')
    setVersion('1.0.0')
    setType('saas')
    setStatus('active')
    setChangelogsList([])
    setIsEditing(true)
    setNotification(null)
  }

  const handleEditClick = (prod: Product) => {
    setCurrentProduct(prod)
    setName(prod.name)
    setSlug(prod.slug)
    setShortDesc(prod.short_description)
    setDescription(prod.description)
    setPrice(Number(prod.price))
    setIsFree(prod.is_free)
    setDownloadUrl(prod.download_url || '')
    setDemoUrl(prod.demo_url || '')
    setDocUrl(prod.documentation_url || '')
    setVersion(prod.version)
    setType(prod.type)
    setStatus(prod.status)
    setChangelogsList(prod.changelog || [])
    setIsEditing(true)
    setNotification(null)
  }

  const handleDelete = async (prodId: string) => {
    if (!window.confirm('Are you sure you want to delete this product? All links, licenses and downloads histories will be affected.')) return
    try {
      const { error } = await supabase.from('products').delete().eq('id', prodId)
      if (error) throw error
      setProducts(products.filter(p => p.id !== prodId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddChangelog = () => {
    setChangelogsList(prev => [
      { version: '1.0.0', date: new Date().toISOString().split('T')[0], changes: ['Initial release'] },
      ...prev
    ])
  }

  const handleRemoveChangelog = (index: number) => {
    setChangelogsList(prev => prev.filter((_, idx) => idx !== index))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    setNotification(null)

    try {
      const payload: any = {
        name,
        slug,
        short_description: shortDesc,
        description,
        price: isFree ? 0 : price,
        is_free: isFree,
        download_url: downloadUrl || null,
        demo_url: demoUrl || null,
        documentation_url: docUrl || null,
        version,
        type,
        status,
        changelog: changelogsList,
        updated_at: new Date().toISOString()
      }

      if (currentProduct) {
        // Update product
        const { error } = await supabase.from('products').update(payload).eq('id', currentProduct.id)
        if (error) throw error
      } else {
        // Create product
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
      }

      setNotification({ type: 'success', msg: 'Product listings saved successfully to database.' })
      setTimeout(() => {
        setIsEditing(false)
        fetchCMSData()
      }, 1000)

    } catch (err: any) {
      console.error(err)
      setNotification({ type: 'error', msg: err.message || 'Error occurred while saving.' })
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-brand-emerald">
        <Loader2 className="animate-spin" size={36} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {isEditing ? (
        // PRODUCT EDIT / CREATE FORM VIEW
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsEditing(false)}
              className="btn-secondary flex items-center gap-1 text-xs cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Listing</span>
            </button>
            <h3 className="font-display font-bold text-white text-base">
              {currentProduct ? 'Edit Digital Product' : 'Register Digital Product'}
            </h3>
          </div>

          {notification && (
            <div className={`p-4 rounded-xl flex items-start gap-2.5 text-sm ${
              notification.type === 'success' ? 'bg-brand-emerald/15 border border-brand-emerald/20 text-brand-emerald' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}>
              {notification.type === 'success' ? <CheckCircle className="shrink-0 mt-0.5" size={16} /> : <AlertCircle className="shrink-0 mt-0.5" size={16} />}
              <span>{notification.msg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Form Settings (Col: 8) */}
            <div className="lg:col-span-8 glass-panel p-8 rounded-3xl border border-white/5 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                    placeholder="E.g., PriceIQ Browser Extension"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Slug URL (Auto-Generated)</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#070a13] border border-white/5 text-xs font-mono text-emerald-400 focus:outline-none"
                    placeholder="price-iq"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Short Summary Description</label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                  placeholder="Short 1-sentence description detailing features."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Capabilities Overview</label>
                <textarea
                  rows={6}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald"
                  placeholder="Describe detailed specifications, onboarding tutorials and tech stack details."
                />
              </div>

              {/* Versioning & Changelogs list */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                    <History size={16} className="text-brand-emerald" />
                    <span>Product Changelog Releases</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddChangelog}
                    className="btn-secondary py-1 px-3 text-[11px]"
                  >
                    Add Version
                  </button>
                </div>

                <div className="space-y-4">
                  {changelogsList.map((log, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => handleRemoveChangelog(idx)}
                        className="absolute top-4 right-4 text-xs text-rose-400 hover:underline"
                      >
                        Remove
                      </button>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-slate-400">Version Number</label>
                          <input
                            type="text"
                            value={log.version}
                            onChange={(e) => {
                              const list = [...changelogsList]
                              list[idx].version = e.target.value
                              setChangelogsList(list)
                            }}
                            className="w-full px-3 py-1.5 rounded bg-[#070a13] border border-white/10 text-xs text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-slate-400">Release Date</label>
                          <input
                            type="text"
                            value={log.date}
                            onChange={(e) => {
                              const list = [...changelogsList]
                              list[idx].date = e.target.value
                              setChangelogsList(list)
                            }}
                            className="w-full px-3 py-1.5 rounded bg-[#070a13] border border-white/10 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-slate-400">Change Bullet Log (Stringified array lines)</label>
                        <textarea
                          rows={2}
                          value={log.changes.join('\n')}
                          onChange={(e) => {
                            const list = [...changelogsList]
                            list[idx].changes = e.target.value.split('\n')
                            setChangelogsList(list)
                          }}
                          className="w-full px-3 py-1.5 rounded bg-[#070a13] border border-white/10 text-xs font-mono text-slate-300"
                          placeholder="Line 1: Added Stripe integration\nLine 2: Fixed API sync delay"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Pricing & Type panel (Col: 4) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h4 className="font-display font-semibold text-xs text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">Market Settings</h4>
                
                {/* Type dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Product Category Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141b2b] border border-white/10 text-xs text-white focus:outline-none"
                  >
                    <option value="saas">SaaS Product</option>
                    <option value="desktop_app">Desktop Application</option>
                    <option value="chrome_extension">Chrome Extension</option>
                    <option value="browser_extension">Browser Extension</option>
                    <option value="template">Website Template</option>
                    <option value="ui_kit">UI Kit Template</option>
                    <option value="script">Automation Script</option>
                    <option value="ai_tool">AI Tool Node</option>
                    <option value="ebook">E-Book Guide</option>
                  </select>
                </div>

                {/* Status selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Visibility Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#141b2b] border border-white/10 text-xs text-white focus:outline-none"
                  >
                    <option value="active">Active (Public)</option>
                    <option value="inactive">Inactive (Staff Only)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Semantic Version */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Semantic Version</label>
                  <input
                    type="text"
                    required
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                    placeholder="1.0.0"
                  />
                </div>

                {/* Free vs Premium selectors */}
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none py-1">
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="rounded border-white/10 text-brand-emerald focus:ring-brand-emerald"
                  />
                  <span>Mark as Free Package</span>
                </label>

                {!isFree && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">License Cost ($ USD)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                      placeholder="49.00"
                    />
                  </div>
                )}
              </div>

              {/* Links Storage panel */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h4 className="font-display font-semibold text-xs text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">Distribution Handles</h4>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Download Path / File Installer</label>
                  <input
                    type="text"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                    placeholder="https://supabase-storage-url.com/installer.zip"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Live Demo Link</label>
                  <input
                    type="text"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                    placeholder="https://priceiq.springwebsolutions.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Documentation URL</label>
                  <input
                    type="text"
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none"
                    placeholder="https://docs.springwebsolutions.com/priceiq"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full btn-primary py-3 px-6 font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                <span>Save Product Details</span>
              </button>

            </div>

          </form>
        </div>
      ) : (
        // PRODUCT LISTING AND LICENSES TABLE VIEWS
        <div className="space-y-6">
          {/* Tabs header selector */}
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setCmsTab('products')}
              className={`py-3 px-6 text-sm font-semibold border-b-2 cursor-pointer ${
                cmsTab === 'products' ? 'border-brand-emerald text-white' : 'border-transparent text-slate-400'
              }`}
            >
              Registered Products ({products.length})
            </button>
            <button
              onClick={() => setCmsTab('licenses')}
              className={`py-3 px-6 text-sm font-semibold border-b-2 cursor-pointer ${
                cmsTab === 'licenses' ? 'border-brand-emerald text-white' : 'border-transparent text-slate-400'
              }`}
            >
              Issued Client Licenses ({licenses.length})
            </button>
          </div>

          {cmsTab === 'products' ? (
            <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-white tracking-tight">Ecosystem Product Catalog</h3>
                  <p className="text-xs text-slate-500 mt-1">Configure pricing packages, update installers, and link documentation repositories.</p>
                </div>
                <button
                  onClick={handleCreateNewClick}
                  className="btn-primary flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                  <thead className="text-xs uppercase bg-white/2 text-slate-400 tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Name</th>
                      <th className="px-6 py-3.5">Category Type</th>
                      <th className="px-6 py-3.5">Version</th>
                      <th className="px-6 py-3.5">License Cost</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4 font-bold text-white max-w-xs truncate">{prod.name}</td>
                        <td className="px-6 py-4 text-xs capitalize">{prod.type.replace('_', ' ')}</td>
                        <td className="px-6 py-4 text-xs">{prod.version}</td>
                        <td className="px-6 py-4 text-xs">
                          {prod.is_free ? (
                            <span className="text-brand-emerald font-semibold">Free</span>
                          ) : (
                            <span>${prod.price}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            prod.status === 'active' ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-white/5 text-slate-500'
                          }`}>
                            {prod.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex space-x-2">
                            <button
                              onClick={() => handleEditClick(prod)}
                              className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id)}
                              className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-500 text-xs">
                          No digital products registered. Click "Add Product" to declare your first entry.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold text-white tracking-tight">Active Client Licenses</h3>
                <p className="text-xs text-slate-500 mt-1">Review active product licenses issued through purchase transactions.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                  <thead className="text-xs uppercase bg-white/2 text-slate-400 tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Client Owner</th>
                      <th className="px-6 py-3.5">Product</th>
                      <th className="px-6 py-3.5">License Activation Key</th>
                      <th className="px-6 py-3.5">Activations</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Expires</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-xs">
                    {licenses.map(lic => (
                      <tr key={lic.id} className="hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4 font-sans text-slate-200">{lic.profiles?.full_name || 'Client'}</td>
                        <td className="px-6 py-4 font-sans text-slate-400">{lic.products?.name}</td>
                        <td className="px-6 py-4 text-brand-emerald font-bold tracking-wide select-all">{lic.license_key}</td>
                        <td className="px-6 py-4">{lic.current_activations} / {lic.max_activations}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            lic.status === 'active' ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-white/5 text-slate-500'
                          }`}>
                            {lic.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-sans text-slate-500">
                          {lic.expires_at ? new Date(lic.expires_at).toLocaleDateString() : 'Permanent'}
                        </td>
                      </tr>
                    ))}
                    {licenses.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-500 font-sans text-xs">
                          No keys or subscriptions licenses issued yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  )
}
export default MarketplaceCMS
