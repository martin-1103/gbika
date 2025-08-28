export interface ChatMessage {
  id: string
  sessionId: string
  text: string
  sender: string
  senderName?: string
  status: 'pending' | 'approved' | 'rejected' | 'blocked'
  moderatedBy?: string
  moderatedAt?: Date
  createdAt: Date
  updatedAt: Date
  guestName: string
  guestCity?: string
}

export interface ModerationStats {
  pending: number
  approved: number
  rejected: number
  total: number
}

export interface ModerationState {
  wsStatus: 'disconnected' | 'connecting' | 'connected'
  messages: {
    pending: ChatMessage[]
    approved: ChatMessage[]
    rejected: ChatMessage[]
  }
  stats: ModerationStats
  searchQuery: string
  isLoading: boolean
  error: string | null
}

export interface WebSocketMessage {
  type: string
  message?: ChatMessage
  messages?: ChatMessage[]
}

export interface WebSocketEvent {
  event: string
  payload: unknown
}

export interface LiveChatModerationProps {
  className?: string
}