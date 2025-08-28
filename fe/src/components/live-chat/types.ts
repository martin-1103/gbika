// LiveChat: Type definitions for live chat functionality

export interface ChatMessage {
  id: string
  name: string
  city: string
  message: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'pending'
}

export interface UserData {
  name: string
  city: string
}

export interface ChatState {
  status: 'disconnected' | 'connecting' | 'connected'
  error: string | null
  rateLimitError: string | null
  retryAfter: number | null
  isSubmitting: boolean
  onlineCount: number
}

export interface SessionData {
  sessionToken: string
  sessionId: string
  userData: UserData
  expiresAt: Date
}

export interface WebSocketMessage {
  type: string
  id?: string
  name?: string
  city?: string
  message?: string
  timestamp?: string
  count?: number
  retryAfter?: number
  payload?: unknown
}

export interface LiveChatProps {
  className?: string
}