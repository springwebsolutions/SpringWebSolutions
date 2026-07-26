import { supabase, isSupabaseConfigured } from './supabase'

export interface LiveChatMessage {
  id: string
  session_id: string
  sender: 'user' | 'bot' | 'agent'
  sender_name?: string
  text: string
  created_at: string
}

export interface LiveChatSession {
  session_id: string
  user_name: string
  user_email?: string
  user_phone?: string
  status: 'active' | 'waiting_admin' | 'resolved'
  last_message: string
  updated_at: string
}

// In-memory fallback broadcast bus for local demo / offline mode
type MessageListener = (msg: LiveChatMessage) => void
const globalListeners = new Set<MessageListener>()

export const liveChatService = {
  // Generate or retrieve persistent user session ID
  getSessionId(): string {
    let id = localStorage.getItem('sw_chat_session_id')
    if (!id) {
      id = 'chat_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now()
      localStorage.setItem('sw_chat_session_id', id)
    }
    return id
  },

  // Save & Broadcast user message
  async sendMessage(sessionId: string, sender: 'user' | 'bot' | 'agent', text: string, senderName?: string): Promise<LiveChatMessage> {
    const newMsg: LiveChatMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      session_id: sessionId,
      sender,
      sender_name: senderName || (sender === 'user' ? 'Visitor' : sender === 'agent' ? 'Admin Engineer' : 'AI Assistant'),
      text,
      created_at: new Date().toISOString()
    }

    // Try Supabase insert
    if (isSupabaseConfigured) {
      try {
        await supabase.from('live_chat_messages').insert([{
          session_id: sessionId,
          sender,
          sender_name: newMsg.sender_name,
          text,
          created_at: newMsg.created_at
        }])

        // Upsert session status
        await supabase.from('live_chat_sessions').upsert([{
          session_id: sessionId,
          user_name: senderName || 'Visitor',
          status: sender === 'user' ? 'waiting_admin' : 'active',
          last_message: text,
          updated_at: newMsg.created_at
        }], { onConflict: 'session_id' })
      } catch (e) {
        // Fallback gracefully
      }
    }

    // Broadcast in memory / custom event for immediate UI update across tabs
    globalListeners.forEach(fn => fn(newMsg))
    window.dispatchEvent(new CustomEvent('sw_live_chat_message', { detail: newMsg }))

    return newMsg
  },

  // Subscribe to realtime messages for a session
  subscribeToSession(sessionId: string, callback: (msg: LiveChatMessage) => void) {
    const listener = (msg: LiveChatMessage) => {
      if (msg.session_id === sessionId) {
        callback(msg)
      }
    }

    globalListeners.add(listener)

    const handleCustomEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail && detail.session_id === sessionId) {
        callback(detail)
      }
    }
    window.addEventListener('sw_live_chat_message', handleCustomEvent)

    // Supabase Realtime channel subscription if configured
    let channel: any = null
    if (isSupabaseConfigured) {
      channel = supabase
        .channel(`chat_${sessionId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'live_chat_messages',
          filter: `session_id=eq.${sessionId}`
        }, (payload) => {
          callback(payload.new as LiveChatMessage)
        })
        .subscribe()
    }

    return () => {
      globalListeners.delete(listener)
      window.removeEventListener('sw_live_chat_message', handleCustomEvent)
      if (channel) supabase.removeChannel(channel)
    }
  },

  // Admin: Fetch all active sessions
  async fetchActiveSessions(): Promise<LiveChatSession[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('live_chat_sessions')
          .select('*')
          .order('updated_at', { ascending: false })
        if (!error && data) return data
      } catch (e) {}
    }
    return []
  },

  // Admin: Fetch history for a session
  async fetchSessionMessages(sessionId: string): Promise<LiveChatMessage[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('live_chat_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })
        if (!error && data) return data
      } catch (e) {}
    }
    return []
  }
}
