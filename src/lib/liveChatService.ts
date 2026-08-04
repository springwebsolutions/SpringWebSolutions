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

  // Save & Broadcast user/bot/agent message
  async sendMessage(sessionId: string, sender: 'user' | 'bot' | 'agent', text: string, senderName?: string): Promise<LiveChatMessage> {
    const newMsg: LiveChatMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      session_id: sessionId,
      sender,
      sender_name: senderName || (sender === 'user' ? 'Visitor' : sender === 'agent' ? 'Admin Engineer' : 'AI Assistant'),
      text,
      created_at: new Date().toISOString()
    }

    // 1. Save to Local Storage Cache
    try {
      const msgKey = `sw_chat_messages_${sessionId}`
      const existingMsgsStr = localStorage.getItem(msgKey)
      const existingMsgs: LiveChatMessage[] = existingMsgsStr ? JSON.parse(existingMsgsStr) : []
      existingMsgs.push(newMsg)
      localStorage.setItem(msgKey, JSON.stringify(existingMsgs))

      // Update sessions cache
      const sessionsStr = localStorage.getItem('sw_chat_sessions')
      let sessions: LiveChatSession[] = sessionsStr ? JSON.parse(sessionsStr) : []
      const existingIdx = sessions.findIndex(s => s.session_id === sessionId)
      
      const sessionObj: LiveChatSession = {
        session_id: sessionId,
        user_name: sender === 'user' ? (senderName || 'Visitor') : (existingIdx >= 0 ? sessions[existingIdx].user_name : 'Visitor'),
        status: sender === 'user' ? 'waiting_admin' : 'active',
        last_message: text,
        updated_at: newMsg.created_at
      }

      if (existingIdx >= 0) {
        sessions[existingIdx] = { ...sessions[existingIdx], ...sessionObj }
      } else {
        sessions.unshift(sessionObj)
      }
      localStorage.setItem('sw_chat_sessions', JSON.stringify(sessions))
    } catch (err) {
      console.error('Local chat storage error:', err)
    }

    // 2. Try Supabase insert & session upsert
    if (isSupabaseConfigured) {
      try {
        await supabase.from('live_chat_messages').insert([{
          session_id: sessionId,
          sender,
          sender_name: newMsg.sender_name,
          text,
          created_at: newMsg.created_at
        }])

        await supabase.from('live_chat_sessions').upsert([{
          session_id: sessionId,
          user_name: newMsg.sender_name,
          status: sender === 'user' ? 'waiting_admin' : 'active',
          last_message: text,
          updated_at: newMsg.created_at
        }], { onConflict: 'session_id' })
      } catch (e) {
        // Fallback gracefully to local storage broadcast
      }
    }

    // 3. Broadcast across windows & memory listeners
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
    let localSessions: LiveChatSession[] = []
    try {
      const saved = localStorage.getItem('sw_chat_sessions')
      if (saved) localSessions = JSON.parse(saved)
    } catch {}

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('live_chat_sessions')
          .select('*')
          .order('updated_at', { ascending: false })
        if (!error && data && data.length > 0) {
          const map = new Map<string, LiveChatSession>()
          data.forEach(s => map.set(s.session_id, s))
          localSessions.forEach(s => {
            if (!map.has(s.session_id)) map.set(s.session_id, s)
          })
          return Array.from(map.values()).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        }
      } catch (e) {}
    }
    return localSessions.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  },

  // Admin: Fetch history for a session
  async fetchSessionMessages(sessionId: string): Promise<LiveChatMessage[]> {
    let localMsgs: LiveChatMessage[] = []
    try {
      const saved = localStorage.getItem(`sw_chat_messages_${sessionId}`)
      if (saved) localMsgs = JSON.parse(saved)
    } catch {}

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('live_chat_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })
        if (!error && data && data.length > 0) {
          const map = new Map<string, LiveChatMessage>()
          data.forEach(m => map.set(m.id, m))
          localMsgs.forEach(m => {
            if (!map.has(m.id)) map.set(m.id, m)
          })
          return Array.from(map.values()).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        }
      } catch (e) {}
    }
    return localMsgs
  }
}
