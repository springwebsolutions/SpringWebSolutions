import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Search, ShoppingBag, Eye, Download, Loader2, Sparkles, Filter, CheckCircle2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  short_description: string
  price: number
  is_free: boolean
  type: string
  status: string
  version: string
  download_url: string | null
  documentation_url: string | null
}

export const Marketplace: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuthStore()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filtering states
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  
  // Filter by pricing: 'all' | 'free' | 'paid'
  const filterParam = searchParams.get('filter')
  const [pricingFilter, setPricingFilter] = useState<'all' | 'free' | 'paid'>(
    filterParam === 'free' ? 'free' : filterParam === 'paid' ? 'paid' : 'all'
  )

  useEffect(() => {
    if (filterParam === 'free') setPricingFilter('free')
    else if (filterParam === 'paid') setPricingFilter('paid')
    else if (!filterParam) setPricingFilter('all')
  }, [filterParam])

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })

        if (error) throw error
        
        // Filter out placeholder products
        const placeholderSlugs = ['price-iq', 'spring-ui-kit', 'whatsapp-dispatcher']
        const activeRealProducts = (data || []).filter(p => !placeholderSlugs.includes(p.slug))
        
        setProducts(activeRealProducts)
      } catch (err) {
        console.error('Error fetching marketplace catalog:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleDownload = async (item: Product) => {
    if (!item.download_url) {
      alert('Download link currently unavailable for this item.')
      return
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('downloads').insert({
          product_id: item.id,
          user_id: user?.id || null
        })
      } catch (err) {
        console.error('Failed to log download counts:', err)
      }
    }

    window.open(item.download_url, '_blank')
  }

  const handlePricingFilterChange = (val: 'all' | 'free' | 'paid') => {
    setPricingFilter(val)
    if (val === 'all') {
      searchParams.delete('filter')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), filter: val })
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.short_description.toLowerCase().includes(search.toLowerCase())
    
    const matchesType = !selectedType || p.type === selectedType

    const matchesPricing = 
      pricingFilter === 'all' ? true :
      pricingFilter === 'free' ? p.is_free :
      !p.is_free

    return matchesSearch && matchesType && matchesPricing
  })

  const productTypes = [
    { value: 'saas', label: 'SaaS Products' },
    { value: 'chrome_extension', label: 'Chrome Extensions' },
    { value: 'template', label: 'Website Templates' },
    { value: 'ui_kit', label: 'UI Kits' },
    { value: 'script', label: 'Automation Scripts' },
    { value: 'ai_tool', label: 'AI Tools' },
    { value: 'ebook', label: 'E-books' }
  ]

  const formatType = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  const freeCount = products.filter(p => p.is_free).length
  const paidCount = products.filter(p => !p.is_free).length

  return (
    <div className="min-h-screen page-bg flex flex-col">
      <Navbar />

      <main className="flex-grow py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Digital Products &amp; Software Vault</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight light:text-slate-900">
              Marketplace &amp; Download Center
            </h1>
            <p className="text-slate-400 light:text-slate-600 text-base leading-relaxed">
              Explore premium digital assets, SaaS tools, website templates, and free open-source installers directly engineered by Spring Web.
            </p>
          </div>

          {/* Combined Filter Controls */}
          <div className="glass-panel p-6 rounded-3xl space-y-6">
            
            {/* Top Tier: Pricing Mode Switcher & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Pricing Filter Tabs */}
              <div className="flex items-center p-1.5 rounded-xl bg-white/5 border border-white/10 dark:bg-white/5 light:bg-slate-200/60 light:border-slate-300 w-full md:w-auto">
                <button
                  onClick={() => handlePricingFilterChange('all')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    pricingFilter === 'all'
                      ? 'bg-brand-emerald text-white shadow-md'
                      : 'text-slate-400 hover:text-white light:text-slate-600 light:hover:text-slate-900'
                  }`}
                >
                  All Catalog ({products.length})
                </button>
                <button
                  onClick={() => handlePricingFilterChange('free')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    pricingFilter === 'free'
                      ? 'bg-brand-emerald text-white shadow-md'
                      : 'text-slate-400 hover:text-white light:text-slate-600 light:hover:text-slate-900'
                  }`}
                >
                  <Download size={13} />
                  <span>Free Downloads ({freeCount})</span>
                </button>
                <button
                  onClick={() => handlePricingFilterChange('paid')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    pricingFilter === 'paid'
                      ? 'bg-brand-emerald text-white shadow-md'
                      : 'text-slate-400 hover:text-white light:text-slate-600 light:hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag size={13} />
                  <span>Premium Assets ({paidCount})</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <Search size={15} />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-emerald light:bg-white light:border-slate-300 light:text-slate-800"
                  placeholder="Search products or downloads..."
                />
              </div>
            </div>

            {/* Bottom Tier: Category Type Chips */}
            <div className="flex items-center gap-2 flex-wrap border-t border-white/5 pt-4 light:border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter size={11} />
                Category:
              </span>
              <button
                onClick={() => setSelectedType(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  !selectedType 
                    ? 'bg-white/15 text-white border border-white/20 light:bg-slate-900 light:text-white' 
                    : 'bg-white/5 text-slate-400 hover:text-white light:bg-slate-100 light:text-slate-600'
                }`}
              >
                All Types
              </button>
              {productTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedType === type.value
                      ? 'bg-white/15 text-white border border-white/20 light:bg-slate-900 light:text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white light:bg-slate-100 light:text-slate-600'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Listing Grid */}
          {loading ? (
            <div className="h-64 flex items-center justify-center text-brand-emerald">
              <Loader2 className="animate-spin" size={36} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl space-y-4 max-w-md mx-auto">
              <ShoppingBag size={48} className="mx-auto text-slate-500" />
              <h2 className="text-lg font-bold text-white light:text-slate-800">No Digital Items Found</h2>
              <p className="text-sm text-slate-400 light:text-slate-600">
                No items match your selected filters. Try adjusting your search query or filter mode.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => { setSelectedType(null); setPricingFilter('all'); setSearch('') }}
                  className="btn-secondary text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="group rounded-2xl glass-panel border border-white/5 hover:-translate-y-2 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Card Banner */}
                  <div className="card-banner h-40 p-6 flex flex-col justify-between relative">
                    <div className="flex items-center justify-between">
                      <div className="card-type-badge px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider w-max">
                        {formatType(prod.type)}
                      </div>
                      {prod.is_free ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          Free Software
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                          Premium
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-white line-clamp-1 light:text-slate-900">
                        {prod.name}
                      </h3>
                      <div className="text-xs text-slate-500 mt-0.5">Version {prod.version}</div>
                    </div>
                  </div>

                  {/* Body Description */}
                  <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                    <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 leading-relaxed line-clamp-3">
                      {prod.short_description}
                    </p>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4 light:border-slate-200">
                      {/* Price box */}
                      <div>
                        {prod.is_free ? (
                          <span className="font-display font-extrabold text-lg text-emerald-400 light:text-emerald-600">
                            Free
                          </span>
                        ) : (
                          <span className="font-display font-extrabold text-lg text-white light:text-slate-900">
                            ${prod.price}
                          </span>
                        )}
                      </div>

                      {/* Action triggers */}
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/marketplace/${prod.slug}`}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-all light:bg-slate-100 light:border-slate-200 light:text-slate-600 light:hover:text-slate-900"
                          title="View Details & Docs"
                        >
                          <Eye size={15} />
                        </Link>

                        {prod.is_free ? (
                          <button
                            onClick={() => handleDownload(prod)}
                            className="btn-primary py-1.5 px-3 flex items-center gap-1.5 text-xs font-semibold shadow-sm cursor-pointer"
                            title="Direct Software Download"
                          >
                            <Download size={14} />
                            <span>Download</span>
                          </button>
                        ) : (
                          <Link
                            to={`/marketplace/${prod.slug}`}
                            className="p-2 rounded-lg bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo hover:bg-brand-indigo hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
                            title="Purchase Product"
                          >
                            <ShoppingBag size={14} />
                            <span>Buy</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
export default Marketplace
