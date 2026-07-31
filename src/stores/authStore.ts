import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  full_name: string
  avatar_url: string | null
  company: string | null
  phone: string | null
  created_at: string
}

interface AuthState {
  user: User | null
  profile: Profile | null
  roles: string[]
  permissions: string[]
  loading: boolean
  initialized: boolean
  initialize: () => Promise<() => void>
  signOut: () => Promise<void>
  hasPermission: (permissionName: string) => boolean
  hasRole: (roleName: string) => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  roles: [],
  permissions: [],
  loading: true,
  initialized: false,

  initialize: async () => {
    if (get().initialized) {
      return () => {}
    }

    if (!isSupabaseConfigured) {
      set({ loading: false, initialized: true })
      return () => {}
    }

    // Get initial session
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const user = session.user
      set({ user, loading: true })
      
      // Load profile & roles
      try {
        const [profileRes, rolesRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.rpc('check_user_roles_and_permissions', { check_user_id: user.id })
        ])

        if (profileRes.data) {
          set({ profile: profileRes.data })
        }

        // RPC helper can return json or roles list
        // Let's fallback to querying tables if check_user_roles_and_permissions isn't deployed yet
        if (rolesRes.data) {
          set({
            roles: rolesRes.data.roles || [],
            permissions: rolesRes.data.permissions || []
          })
        } else {
          // Fallback manual query
          const { data: userRolesData } = await supabase
            .from('user_roles')
            .select('role_id, roles(name)')
            .eq('user_id', user.id) as { data: any[] | null }

          const roles = userRolesData ? userRolesData.map((ur: any) => ur.roles?.name || '') : []
          
          let permissions: string[] = []
          if (roles.length > 0) {
            // Retrieve permissions for these roles
            const { data: permData } = await supabase
              .from('role_permissions')
              .select('permissions(name)')
              .eq('role_id', userRolesData?.[0]?.role_id) // simplified fallback
            permissions = permData ? permData.map((p: any) => p.permissions?.name || '') : []
          }
          
          set({ roles, permissions })
        }
      } catch (err) {
        console.error('Error fetching RBAC details:', err)
      }
    }

    set({ loading: false, initialized: true })

    // Listen to Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      set({ loading: true })
      if (session) {
        const user = session.user
        set({ user })

        try {
          const [profileRes, rolesRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', user.id).single(),
            supabase.rpc('check_user_roles_and_permissions', { check_user_id: user.id })
          ])

          if (profileRes.data) {
            set({ profile: profileRes.data })
          }

          if (rolesRes.data) {
            set({
              roles: rolesRes.data.roles || [],
              permissions: rolesRes.data.permissions || []
            })
          } else {
            // Fallback manual query
            const { data: userRolesData } = await supabase
              .from('user_roles')
              .select('roles(name)')
              .eq('user_id', user.id)

            const roles = userRolesData ? userRolesData.map((ur: any) => ur.roles?.name || '').filter(Boolean) : []
            set({ roles })
          }
        } catch (err) {
          console.error(err)
        }
      } else {
        set({ user: null, profile: null, roles: [], permissions: [] })
      }
      set({ loading: false })
    })

    return () => {
      subscription.unsubscribe()
    }
  },

  signOut: async () => {
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
    set({ user: null, profile: null, roles: [], permissions: [] })
  },

  hasPermission: (permissionName: string) => {
    const { roles, permissions } = get()
    if (roles.includes('super_admin')) return true
    return permissions.includes(permissionName)
  },

  hasRole: (roleName: string) => {
    const { roles } = get()
    if (roles.includes('super_admin') && roleName !== 'client') return true
    return roles.includes(roleName)
  }
}))
