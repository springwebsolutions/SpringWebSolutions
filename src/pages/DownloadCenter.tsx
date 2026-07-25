import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Download, Search, Terminal, Eye, FileArchive, Loader2, ArrowRight } from 'lucide-react'

interface FreeProduct {
  id: string
  name: string
  slug: string
  short_description: string
  type: string
  version: string
  download_url: string | null
  documentation_url: string | null
}

export const DownloadCenter: React.FC = () => {
  const [items, setItems] = useState<FreeProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchFreeProducts = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'active')
          .eq('is_free', true)
          .order('name', { ascending: true })

        if (error) throw error
        setItems(data || [])
      } catch (err) {
        console.error('Error loading downloads list:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFreeProducts()
  }, [])

  const handleDownload = async (item: FreeProduct) => {
    if (!item.download_url || !isSupabaseConfigured) return

    try {
      // 1. Insert logging record
      await supabase.from('downloads').insert({
        product_id: item.id,
        user_id: user?.id || null
      })

      // 2. Open the file download URL
      window.open(item.download_url, '_blank')
    } catch (err) {
      console.error('Failed to log download counts:', err)
    }
  }

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.short_description.toLowerCase().includes(search.toLowerCase())
  )

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
            <h1 className="text-4xl font-extrabold text-white tracking-tight light:text-slate-900 flex items-center justify-center gap-2">
              <Terminal size={32} className="text-brand-emerald" />
              <span>Software Download Center</span>
            </h1>
            <p className="text-slate-400 light:text-slate-600">
              Access free browser utilities, desktop programs, UI boilerplates, and automation routines directly from our engineering vault.
            </p>
          </div>

          {/* Filtering row */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-y border-white/5 py-6 dark:border-white/5 light:border-slate-200">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Available Packages ({filteredItems.length})
            </div>

            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-emerald light:bg-slate-950/5 light:border-slate-200 light:text-slate-800"
                placeholder="Search download files..."
              />
            </div>
          </div>

          {/* Grid listings */}
          {loading ? (
            <div className="h-64 flex items-center justify-center text-brand-emerald">
              <Loader2 className="animate-spin" size={36} />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl space-y-4 max-w-md mx-auto">
              <FileArchive size={48} className="mx-auto text-slate-500" />
              <h2 className="text-lg font-bold text-white light:text-slate-800">No Packages Available</h2>
              <p className="text-sm text-slate-400 light:text-slate-600">
                No free packages match your search filter. Explore other digital tools on the main marketplace store.
              </p>
              <div className="pt-2">
                <Link to="/marketplace" className="btn-secondary text-xs">Explore Marketplace</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 hover:border-brand-emerald/10 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-brand-emerald/10 text-brand-emerald text-[10px] font-bold uppercase tracking-wider">
                        {formatType(item.type)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Version {item.version}</span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-white light:text-slate-900">
                      {item.name}
                    </h3>
                    
                    <p className="text-sm text-slate-400 light:text-slate-600 leading-relaxed">
                      {item.short_description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6 light:border-slate-200">
                    <Link
                      to={`/marketplace/${item.slug}`}
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      <Eye size={14} />
                      <span>Review Details</span>
                    </Link>

                    <button
                      onClick={() => handleDownload(item)}
                      className="btn-primary py-2 px-4 flex items-center gap-1.5 text-xs font-semibold shadow shadow-brand-emerald/10 cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Fetch Installer</span>
                    </button>
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
export default DownloadCenter
