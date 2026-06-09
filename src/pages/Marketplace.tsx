import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Search, ShoppingBag, Eye, Download, Info, Loader2, ArrowRight } from 'lucide-react'

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
}

export const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filtering states
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)

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
        setProducts(data || [])
      } catch (err) {
        console.error('Error fetching marketplace catalog:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.short_description.toLowerCase().includes(search.toLowerCase())
    
    const matchesType = !selectedType || p.type === selectedType
    return matchesSearch && matchesType
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

  // Formatter helper for product type badges
  const formatType = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  return (
    <div className="min-h-screen bg-[#070a13] flex flex-col dark:bg-[#070a13] light:bg-[#f8fafc]">
      <Navbar />

      <main className="flex-grow py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h1 className="text-4xl font-extrabold text-white tracking-tight light:text-slate-900">
              Digital Product Marketplace
            </h1>
            <p className="text-slate-400 light:text-slate-600">
              Browse templates, SaaS offerings, automation scripts, and custom extensions engineered by our team.
            </p>
          </div>

          {/* Filtering bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-y border-white/5 py-6 dark:border-white/5 light:border-slate-200">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  !selectedType 
                    ? 'bg-brand-emerald text-white' 
                    : 'bg-white/5 text-slate-400 hover:text-white light:bg-slate-100 light:text-slate-600'
                }`}
              >
                All Products
              </button>
              {productTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedType === type.value
                      ? 'bg-brand-emerald text-white'
                      : 'bg-white/5 text-slate-440 hover:text-white light:bg-slate-100 light:text-slate-600'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Search inputs */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-955/5 light:border-slate-200 light:text-slate-800"
                placeholder="Search products..."
              />
            </div>
          </div>

          {/* Catalog Listing */}
          {loading ? (
            <div className="h-64 flex items-center justify-center text-brand-emerald">
              <Loader2 className="animate-spin" size={36} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl space-y-4 max-w-md mx-auto">
              <ShoppingBag size={48} className="mx-auto text-slate-500" />
              <h2 className="text-lg font-bold text-white light:text-slate-800">No Products Available</h2>
              <p className="text-sm text-slate-400 light:text-slate-600">
                There are no digital assets matching this type currently. Admins can register them from the Control Panel.
              </p>
              <div className="pt-2">
                <Link to="/admin/marketplace" className="btn-secondary text-xs">Add First Product</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="group rounded-2xl glass-panel border border-white/5 hover:-translate-y-1 transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Visual Header Banner */}
                  <div className="h-40 bg-gradient-to-tr from-[#141c2c] to-[#070a13] border-b border-white/5 p-6 flex flex-col justify-between relative light:border-slate-200">
                    <div className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-wider w-max">
                      {formatType(prod.type)}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-white line-clamp-1 light:text-slate-900">
                        {prod.name}
                      </h3>
                      <div className="text-xs text-slate-500 mt-0.5">Version {prod.version}</div>
                    </div>
                  </div>

                  {/* Body description */}
                  <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                    <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 leading-relaxed line-clamp-3">
                      {prod.short_description}
                    </p>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4 light:border-slate-200">
                      {/* Price box */}
                      <div>
                        {prod.is_free ? (
                          <span className="px-2 py-0.5 rounded bg-brand-emerald/10 text-brand-emerald text-xs font-bold uppercase tracking-wide">
                            Free Download
                          </span>
                        ) : (
                          <span className="font-display font-extrabold text-lg text-white light:text-slate-900">
                            ${prod.price}
                          </span>
                        )}
                      </div>

                      {/* Action trigger */}
                      <div className="flex space-x-2">
                        <Link
                          to={`/marketplace/${prod.slug}`}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition-all light:bg-slate-100 light:border-slate-200 light:text-slate-600 light:hover:text-slate-900"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                        {prod.is_free ? (
                          <Link
                            to="/downloads"
                            className="p-2 rounded-lg bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald hover:bg-brand-emerald hover:text-white transition-all"
                            title="Direct Download"
                          >
                            <Download size={16} />
                          </Link>
                        ) : (
                          <Link
                            to={`/marketplace/${prod.slug}`}
                            className="p-2 rounded-lg bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo hover:bg-brand-indigo hover:text-white transition-all"
                            title="Purchase Product"
                          >
                            <ShoppingBag size={16} />
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
