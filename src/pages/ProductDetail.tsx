import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { 
  ArrowLeft, Download, ShoppingBag, Eye, ExternalLink, 
  BookOpen, History, Loader2, AlertCircle, CheckCircle 
} from 'lucide-react'

interface Screenshot {
  id: string
  image_url: string
  display_order: number
}

interface ProductDetailData {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  price: number
  is_free: boolean
  download_url: string | null
  demo_url: string | null
  documentation_url: string | null
  version: string
  type: string
  status: string
  changelog: Array<{ version: string; date: string; changes: string[] }>
  seo_title: string | null
  seo_description: string | null
}

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [product, setProduct] = useState<ProductDetailData | null>(null)
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'changelog' | 'documentation'>('details')
  
  // Checkout flow states
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)
  const [licensedKey, setLicensedKey] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!slug || !isSupabaseConfigured) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_screenshots(*)')
          .eq('slug', slug)
          .single()

        if (error) throw error

        if (data) {
          setProduct({
            ...data,
            changelog: data.changelog || []
          })
          setScreenshots(data.product_screenshots || [])

          // Set metadata
          document.title = data.seo_title || `${data.name} | Spring Web Solutions`
          const metaDesc = document.querySelector('meta[name="description"]')
          if (metaDesc) {
            metaDesc.setAttribute('content', data.seo_description || data.short_description)
          }
        }
      } catch (err) {
        console.error('Error fetching product logs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [slug])

  const handleFreeDownload = async () => {
    if (!product || !isSupabaseConfigured) return
    
    try {
      // 1. Log download event in DB
      await supabase.from('downloads').insert({
        product_id: product.id,
        user_id: user?.id || null
      })

      // 2. Open download link
      if (product.download_url) {
        window.open(product.download_url, '_blank')
      } else {
        alert('This free utility does not have an active download installer linked. Contact administrator.')
      }
    } catch (err) {
      console.error('Download tracking failed:', err)
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      // Prompt login
      navigate('/login')
      return
    }

    setCheckoutLoading(true)
    try {
      // Secure DDL Order & license key simulator (Simulates Stripe webhook callback database changes)
      // 1. Create Order
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'completed',
          subtotal: product?.price || 0,
          total: product?.price || 0,
          gateway: 'stripe',
          gateway_order_id: `ch_${Math.random().toString(36).substring(2, 12)}`
        })
        .select()
        .single()

      if (orderErr) throw orderErr

      // 2. Generate License Key
      const key = `SWS-${product?.slug.toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      
      const { error: licErr } = await supabase
        .from('licenses')
        .insert({
          product_id: product?.id,
          order_id: order.id,
          user_id: user.id,
          license_key: key,
          max_activations: 3
        })

      if (licErr) throw licErr

      setLicensedKey(key)
      setCheckoutSuccess(true)
    } catch (err) {
      console.error('Order creation failed:', err)
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a13] flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center text-brand-emerald">
          <Loader2 className="animate-spin" size={48} />
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#070a13] flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow flex items-center justify-center text-slate-200">
          <div className="p-8 rounded-3xl glass-panel text-center max-w-sm space-y-4">
            <AlertCircle size={48} className="mx-auto text-brand-indigo" />
            <h1 className="text-xl font-bold">Product Not Found</h1>
            <p className="text-xs text-slate-400">The product you are trying to view does not exist in our catalog.</p>
            <div className="pt-2">
              <Link to="/marketplace" className="btn-primary flex items-center gap-1 text-xs">
                <ArrowLeft size={14} />
                <span>Return to Store</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col dark:bg-[#070a13] light:bg-[#f8fafc]">
      <Navbar />

      <main className="flex-grow py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Back link */}
          <Link to="/marketplace" className="inline-flex items-center gap-1 text-xs text-slate-450 hover:text-white transition-colors light:text-slate-500">
            <ArrowLeft size={13} />
            <span>Return to digital catalog</span>
          </Link>

          {/* Product Hero block */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/5 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <span className="px-2.5 py-1 rounded bg-brand-emerald/10 text-brand-emerald text-xs font-semibold uppercase tracking-wider">
                {product.type.replace('_', ' ')}
              </span>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight light:text-slate-900">
                {product.name}
              </h1>
              
              <p className="text-base text-slate-400 light:text-slate-600 leading-relaxed">
                {product.short_description}
              </p>
            </div>

            {/* Price Buy trigger card */}
            <div className="md:col-span-4 glass-panel bg-white/2 p-6 rounded-2xl border border-white/10 text-center space-y-4">
              <div className="space-y-1">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Standard License</div>
                <div className="text-3xl font-extrabold text-white light:text-slate-900">
                  {product.is_free ? 'Free' : `$${product.price}`}
                </div>
              </div>

              {checkoutSuccess ? (
                <div className="p-3 rounded-lg bg-brand-emerald/15 border border-brand-emerald/20 text-brand-emerald text-xs space-y-2">
                  <CheckCircle className="mx-auto" size={20} />
                  <div>Purchase complete! Your license key:</div>
                  <code className="block bg-black/40 p-1.5 rounded font-mono text-white text-[11px] font-bold tracking-wider">{licensedKey}</code>
                </div>
              ) : product.is_free ? (
                <button
                  onClick={handleFreeDownload}
                  className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 font-semibold cursor-pointer shadow shadow-brand-emerald/20"
                >
                  <Download size={16} />
                  <span>Download Now</span>
                </button>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={checkoutLoading}
                  className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 font-semibold cursor-pointer bg-brand-indigo hover:bg-brand-indigo-hover shadow shadow-brand-indigo/20"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>Buy Premium Key</span>
                    </>
                  )}
                </button>
              )}

              {/* Demo link */}
              {product.demo_url && (
                <a
                  href={product.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full py-2 flex items-center justify-center gap-1.5 text-xs font-semibold"
                >
                  <ExternalLink size={14} />
                  <span>Open Live Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Screenshots gallery */}
          {screenshots.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display font-semibold text-xs text-slate-400 uppercase tracking-widest">Product Screen Showcase</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {screenshots.map(screen => (
                  <div key={screen.id} className="aspect-video rounded-xl overflow-hidden bg-white/2 border border-white/5 shadow-md">
                    <img src={screen.image_url} alt="screenshot" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs bar details */}
          <div className="space-y-6">
            {/* Tabs Selector headers */}
            <div className="flex border-b border-white/5 dark:border-white/5 light:border-slate-200">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 px-6 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-brand-emerald text-white light:text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab('changelog')}
                className={`py-3 px-6 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
                  activeTab === 'changelog'
                    ? 'border-brand-emerald text-white light:text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Version Log & Release Notes
              </button>
              {product.documentation_url && (
                <button
                  onClick={() => setActiveTab('documentation')}
                  className={`py-3 px-6 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
                    activeTab === 'documentation'
                      ? 'border-brand-emerald text-white light:text-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Documentation
                </button>
              )}
            </div>

            {/* Dynamic tabs render panels */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 text-slate-300 light:text-slate-700">
              {activeTab === 'details' && (
                <div className="space-y-4 leading-relaxed">
                  <h3 className="font-display text-lg font-bold text-white mb-2 light:text-slate-900">Product Capabilities</h3>
                  <div className="prose max-w-none text-sm">
                    {product.description}
                  </div>
                </div>
              )}

              {activeTab === 'changelog' && (
                <div className="space-y-6">
                  <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2 light:text-slate-900">
                    <History size={20} className="text-brand-emerald" />
                    <span>Version Releases</span>
                  </h3>
                  
                  {product.changelog.length === 0 ? (
                    <p className="text-xs text-slate-500">No release histories recorded yet for Version {product.version}.</p>
                  ) : (
                    <div className="space-y-6">
                      {product.changelog.map((log, idx) => (
                        <div key={idx} className="border-l-2 border-brand-emerald pl-4 space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-extrabold text-white light:text-slate-900">Version {log.version}</span>
                            <span className="text-xs text-slate-500">({new Date(log.date).toLocaleDateString()})</span>
                          </div>
                          <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1">
                            {log.changes.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'documentation' && (
                <div className="space-y-4 text-center py-6">
                  <BookOpen size={48} className="mx-auto text-brand-emerald" />
                  <h3 className="font-display text-lg font-bold text-white light:text-slate-900">Developer Integration Documentation</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    Full specifications, configurations, API definitions, and tutorials are host in the resource guides repository.
                  </p>
                  <div className="pt-2">
                    <a
                      href={product.documentation_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary py-2 flex items-center gap-1.5 text-xs font-semibold mx-auto w-max"
                    >
                      <ExternalLink size={14} />
                      <span>Launch Documentation Portal</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
export default ProductDetail
