"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Loader2, AlertCircle } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { 
  ChatMessage,
  ModerationState, 
  LiveChatModerationProps,
  WebSocketMessage
} from "./types"
import { 
  calculateStats, 
  filterMessages
} from "./utils"
import { useWebSocketConnection } from "./use-websocket-connection"
import { Header } from "./header"
import { StatsCards } from "./stats-cards"
import { MessageColumns } from "./message-columns"

export function LiveChatModeration({ className }: LiveChatModerationProps) {
  const { isAuthenticated, token, user } = useAuthStore()
  const [state, setState] = useState<ModerationState>({
    wsStatus: 'disconnected',
    messages: {
      pending: [],
      approved: [],
      rejected: []
    },
    stats: { pending: 0, approved: 0, rejected: 0, total: 0 },
    searchQuery: '',
    isLoading: true,
    error: null
  })

  const moveMessage = useCallback((messageId: string, newStatus: string) => {
    setState(prev => {
      const allMessages = [
        ...prev.messages.pending,
        ...prev.messages.approved,
        ...prev.messages.rejected
      ]
      
      const message = allMessages.find(m => m.id === messageId)
      if (!message) return prev

      const updatedMessage = { 
        ...message, 
        status: newStatus as ChatMessage['status'],
        moderatedAt: new Date()
      }

      const pending = prev.messages.pending.filter(m => m.id !== messageId)
      const approved = prev.messages.approved.filter(m => m.id !== messageId)
      const rejected = prev.messages.rejected.filter(m => m.id !== messageId)

      const newMessages = { pending, approved, rejected }
      if (newStatus === 'approved') {
        newMessages.approved.push(updatedMessage)
      } else if (newStatus === 'rejected' || newStatus === 'blocked') {
        newMessages.rejected.push(updatedMessage)
      } else {
        newMessages.pending.push(updatedMessage)
      }

      return {
        ...prev,
        messages: newMessages,
        stats: calculateStats([
          ...newMessages.pending,
          ...newMessages.approved,
          ...newMessages.rejected
        ])
      }
    })
  }, [])

  const handleWebSocketMessage = useCallback((data: WebSocketMessage) => {
    switch (data.type) {
      case 'new_message':
        if (data.message) {
          setState(prev => ({
            ...prev,
            messages: {
              ...prev.messages,
              pending: [...prev.messages.pending, data.message!]
            },
            stats: {
              ...prev.stats,
              pending: prev.stats.pending + 1,
              total: prev.stats.total + 1
            }
          }))
        }
        break
        
      case 'message_moderated':
        if (data.message) {
          moveMessage(data.message.id, data.message.status)
        }
        break
        
      case 'messages_history':
        if (data.messages) {
          const grouped = {
            pending: data.messages.filter(m => m.status === 'pending'),
            approved: data.messages.filter(m => m.status === 'approved'),
            rejected: data.messages.filter(m => m.status === 'rejected' || m.status === 'blocked')
          }
          setState(prev => ({
            ...prev,
            messages: grouped,
            stats: calculateStats(data.messages!),
            isLoading: false
          }))
        }
        break
    }
  }, [moveMessage])

  const {
    connectWebSocket,
    closeWebSocket,
    scheduleReconnect,
    shouldAutoReconnect
  } = useWebSocketConnection({
    state,
    setState,
    handleWebSocketMessage
  })

  const moderateMessage = async (messageId: string, action: 'approve' | 'reject') => {
    try {
      if (!isAuthenticated || !token) {
        setState(prev => ({
          ...prev,
          error: 'Tidak terautentikasi. Silakan login terlebih dahulu.'
        }))
        return
      }

      const response = await fetch(`/api/livechat/messages/${messageId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: action
        })
      })

      if (!response.ok) {
        throw new Error('Gagal memproses moderasi')
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan'
      }))
    }
  }

  useEffect(() => {
    if (isAuthenticated && token && user && (user.role === 'admin' || user.role === 'penyiar')) {
      connectWebSocket()
    }
    
    return closeWebSocket
  }, [])

  useEffect(() => {
    if (shouldAutoReconnect()) {
      scheduleReconnect()
    }
  }, [state.wsStatus, state.error, shouldAutoReconnect, scheduleReconnect])

  const filteredMessages = {
    pending: filterMessages(state.messages.pending, state.searchQuery),
    approved: filterMessages(state.messages.approved, state.searchQuery),
    rejected: filterMessages(state.messages.rejected, state.searchQuery)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Header wsStatus={state.wsStatus} />

      <StatsCards stats={state.stats} />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari pesan atau nama pengirim..."
          value={state.searchQuery}
          onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
          className="pl-10"
        />
      </div>

      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Memuat pesan...</span>
        </div>
      )}

      {!state.isLoading && (
        <MessageColumns
          pendingMessages={filteredMessages.pending}
          approvedMessages={filteredMessages.approved}
          rejectedMessages={filteredMessages.rejected}
          onModerate={moderateMessage}
        />
      )}
    </div>
  )
}