import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  type: 'contact' | 'consultation' | 'seo_audit' | 'website_audit' | 'automation_assessment'
  status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost'
  budget: string | null
  timeline: string | null
  description: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
}

export interface LeadNote {
  id: string
  lead_id: string
  author_id: string | null
  content: string
  created_at: string
  profiles?: {
    full_name: string
  } | null
}

export interface LeadActivity {
  id: string
  lead_id: string
  performed_by: string | null
  activity_type: string
  description: string
  created_at: string
}

export interface LeadTask {
  id: string
  lead_id: string
  assigned_to: string | null
  title: string
  description: string | null
  due_date: string | null
  is_completed: boolean
  created_at: string
  updated_at: string
}

interface CRMState {
  leads: Lead[]
  selectedLead: Lead | null
  notes: LeadNote[]
  activities: LeadActivity[]
  tasks: LeadTask[]
  metrics: {
    total: number
    newCount: number
    qualified: number
    proposal: number
    won: number
    lost: number
  }
  loading: boolean
  fetchLeads: () => Promise<void>
  selectLead: (lead: Lead | null) => Promise<void>
  updateLeadStatus: (leadId: string, status: Lead['status']) => Promise<void>
  addLeadNote: (leadId: string, content: string) => Promise<void>
  addLeadTask: (leadId: string, task: { title: string; description?: string; due_date?: string; assigned_to?: string }) => Promise<void>
  toggleTaskCompleted: (taskId: string, isCompleted: boolean) => Promise<void>
  createLead: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => Promise<Lead | null>
}

export const useCRMStore = create<CRMState>((set, get) => ({
  leads: [],
  selectedLead: null,
  notes: [],
  activities: [],
  tasks: [],
  metrics: {
    total: 0,
    newCount: 0,
    qualified: 0,
    proposal: 0,
    won: 0,
    lost: 0
  },
  loading: false,

  fetchLeads: async () => {
    if (!isSupabaseConfigured) return
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      const leads = data || []
      
      const metrics = leads.reduce((acc, lead) => {
        acc.total++
        if (lead.status === 'new') acc.newCount++
        if (lead.status === 'qualified') acc.qualified++
        if (lead.status === 'proposal_sent' || lead.status === 'negotiation') acc.proposal++
        if (lead.status === 'won') acc.won++
        if (lead.status === 'lost') acc.lost++
        return acc
      }, { total: 0, newCount: 0, qualified: 0, proposal: 0, won: 0, lost: 0 })

      set({ leads, metrics })
    } catch (err) {
      console.error('Error fetching leads:', err)
    } finally {
      set({ loading: false })
    }
  },

  selectLead: async (lead) => {
    set({ selectedLead: lead })
    if (!lead || !isSupabaseConfigured) {
      set({ notes: [], activities: [], tasks: [] })
      return
    }

    try {
      const [notesRes, activitiesRes, tasksRes] = await Promise.all([
        supabase
          .from('lead_notes')
          .select('*, profiles(full_name)')
          .eq('lead_id', lead.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('lead_activities')
          .select('*')
          .eq('lead_id', lead.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('lead_tasks')
          .select('*')
          .eq('lead_id', lead.id)
          .order('created_at', { ascending: false })
      ])

      set({
        notes: notesRes.data || [],
        activities: activitiesRes.data || [],
        tasks: tasksRes.data || []
      })
    } catch (err) {
      console.error('Error loading lead detail associations:', err)
    }
  },

  updateLeadStatus: async (leadId, status) => {
    if (!isSupabaseConfigured) return
    try {
      const { data: oldLead } = await supabase.from('leads').select('status').eq('id', leadId).single()
      
      const { error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', leadId)
      
      if (error) throw error

      // Log activity
      const { data: authSession } = await supabase.auth.getSession()
      const userId = authSession?.session?.user?.id || null
      
      await supabase.from('lead_activities').insert({
        lead_id: leadId,
        performed_by: userId,
        activity_type: 'status_change',
        description: `Status changed from '${oldLead?.status}' to '${status}'`
      })

      // Refresh data
      await get().fetchLeads()
      const activeSelected = get().selectedLead
      if (activeSelected && activeSelected.id === leadId) {
        set({ selectedLead: { ...activeSelected, status } })
        // Reload activities
        const { data: acts } = await supabase
          .from('lead_activities')
          .select('*')
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false })
        set({ activities: acts || [] })
      }
    } catch (err) {
      console.error('Error updating status:', err)
    }
  },

  addLeadNote: async (leadId, content) => {
    if (!isSupabaseConfigured) return
    try {
      const { data: authSession } = await supabase.auth.getSession()
      const userId = authSession?.session?.user?.id || null
      
      const { error } = await supabase.from('lead_notes').insert({
        lead_id: leadId,
        author_id: userId,
        content
      })
      if (error) throw error

      // Log Activity
      await supabase.from('lead_activities').insert({
        lead_id: leadId,
        performed_by: userId,
        activity_type: 'note_added',
        description: 'New CRM note added.'
      })

      // Reload notes/activities
      const activeSelected = get().selectedLead
      if (activeSelected && activeSelected.id === leadId) {
        get().selectLead(activeSelected)
      }
    } catch (err) {
      console.error('Error adding note:', err)
    }
  },

  addLeadTask: async (leadId, task) => {
    if (!isSupabaseConfigured) return
    try {
      const { data: authSession } = await supabase.auth.getSession()
      const userId = authSession?.session?.user?.id || null

      const { error } = await supabase.from('lead_tasks').insert({
        lead_id: leadId,
        title: task.title,
        description: task.description || null,
        due_date: task.due_date || null,
        assigned_to: task.assigned_to || null
      })
      if (error) throw error

      // Log activity
      await supabase.from('lead_activities').insert({
        lead_id: leadId,
        performed_by: userId,
        activity_type: 'task_created',
        description: `New CRM subtask created: "${task.title}"`
      })

      const activeSelected = get().selectedLead
      if (activeSelected && activeSelected.id === leadId) {
        get().selectLead(activeSelected)
      }
    } catch (err) {
      console.error('Error adding task:', err)
    }
  },

  toggleTaskCompleted: async (taskId, isCompleted) => {
    if (!isSupabaseConfigured) return
    try {
      const { data: oldTask } = await supabase.from('lead_tasks').select('lead_id, title').eq('id', taskId).single()
      
      const { error } = await supabase
        .from('lead_tasks')
        .update({ is_completed: isCompleted, updated_at: new Date().toISOString() })
        .eq('id', taskId)

      if (error) throw error

      if (oldTask) {
        const { data: authSession } = await supabase.auth.getSession()
        const userId = authSession?.session?.user?.id || null

        // Log Activity
        await supabase.from('lead_activities').insert({
          lead_id: oldTask.lead_id,
          performed_by: userId,
          activity_type: isCompleted ? 'task_completed' : 'task_reopened',
          description: `Task "${oldTask.title}" marked as ${isCompleted ? 'completed' : 'pending'}`
        })

        const activeSelected = get().selectedLead
        if (activeSelected && activeSelected.id === oldTask.lead_id) {
          get().selectLead(activeSelected)
        }
      }
    } catch (err) {
      console.error('Error toggling task:', err)
    }
  },

  createLead: async (newLeadData) => {
    if (!isSupabaseConfigured) return null
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          ...newLeadData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single()

      if (error) throw error

      if (data) {
        await get().fetchLeads()
        return data as Lead
      }
      return null
    } catch (err) {
      console.error('Error creating lead:', err)
      throw err
    }
  }
}))
