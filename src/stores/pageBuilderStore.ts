import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface PageData {
  id: string
  title: string
  slug: string
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  is_published: boolean
}

export interface SectionData {
  id: string
  page_id: string
  type: string
  content: any
  styling: any
  display_order: number
  is_active: boolean
}

interface PageBuilderState {
  currentPage: PageData | null
  currentSections: SectionData[]
  pages: PageData[]
  siteConfig: any
  navigation: any
  theme: 'dark' | 'light'
  loading: boolean
  fetchPageData: (slug: string) => Promise<void>
  fetchPages: () => Promise<void>
  fetchSettings: () => Promise<void>
  toggleTheme: (forcedTheme?: 'dark' | 'light') => void
  saveSectionContent: (sectionId: string, content: any, styling?: any) => Promise<void>
  toggleSectionActive: (sectionId: string, isActive: boolean) => Promise<void>
  updateSectionsOrder: (reorderedSections: SectionData[]) => Promise<void>
}

export const usePageBuilderStore = create<PageBuilderState>((set, get) => ({
  currentPage: null,
  currentSections: [],
  pages: [],
  siteConfig: null,
  navigation: null,
  theme: 'dark',
  loading: false,

  fetchPageData: async (slug: string) => {
    if (!isSupabaseConfigured) return
    set({ loading: true })
    try {
      // Fetch Page
      const { data: page, error: pageErr } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single()

      if (pageErr) throw pageErr

      if (page) {
        // Fetch active sections
        const { data: sections, error: secErr } = await supabase
          .from('sections')
          .select('*')
          .eq('page_id', page.id)
          .order('display_order', { ascending: true })

        if (secErr) throw secErr

        set({
          currentPage: page,
          currentSections: sections || []
        })
      }
    } catch (err) {
      console.error(`Error loading page data for slug "${slug}":`, err)
    } finally {
      set({ loading: false })
    }
  },

  fetchPages: async () => {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase.from('pages').select('*')
      if (error) throw error
      set({ pages: data || [] })
    } catch (err) {
      console.error('Error fetching pages:', err)
    }
  },

  fetchSettings: async () => {
    if (!isSupabaseConfigured) return
    try {
      const { data, error } = await supabase.from('settings').select('*')
      if (error) throw error
      
      const config = data?.find(s => s.key === 'site_config')?.value || null
      const nav = data?.find(s => s.key === 'navigation')?.value || null
      
      set({
        siteConfig: config,
        navigation: nav
      })
    } catch (err) {
      console.error('Error loading settings:', err)
    }
  },

  toggleTheme: (forcedTheme) => {
    const currentTheme = get().theme
    const nextTheme = forcedTheme || (currentTheme === 'dark' ? 'light' : 'dark')
    
    // Apply styling hook to document element
    const root = window.document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(nextTheme)
    
    set({ theme: nextTheme })
  },

  saveSectionContent: async (sectionId, content, styling) => {
    if (!isSupabaseConfigured) return
    try {
      const updatePayload: any = { content, updated_at: new Date().toISOString() }
      if (styling) updatePayload.styling = styling

      const { error } = await supabase
        .from('sections')
        .update(updatePayload)
        .eq('id', sectionId)

      if (error) throw error

      // Update local state
      const sections = get().currentSections.map(s => 
        s.id === sectionId ? { ...s, content, styling: styling || s.styling } : s
      )
      set({ currentSections: sections })
    } catch (err) {
      console.error('Error saving section content:', err)
      throw err
    }
  },

  toggleSectionActive: async (sectionId, isActive) => {
    if (!isSupabaseConfigured) return
    try {
      const { error } = await supabase
        .from('sections')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', sectionId)

      if (error) throw error

      // Update local state
      const sections = get().currentSections.map(s => 
        s.id === sectionId ? { ...s, is_active: isActive } : s
      )
      set({ currentSections: sections })
    } catch (err) {
      console.error('Error toggling section:', err)
      throw err
    }
  },

  updateSectionsOrder: async (reorderedSections) => {
    if (!isSupabaseConfigured) return
    try {
      // Execute sequential updates or RPC to batch reorder
      // For local simplicity, we map updates. A backend RPC is cleaner but direct updates work fine.
      const promises = reorderedSections.map((sec, idx) => 
        supabase
          .from('sections')
          .update({ display_order: idx, updated_at: new Date().toISOString() })
          .eq('id', sec.id)
      )

      await Promise.all(promises)
      set({ currentSections: reorderedSections })
    } catch (err) {
      console.error('Error updating sections order:', err)
      throw err
    }
  }
}))
