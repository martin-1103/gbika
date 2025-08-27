"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  MessageSquare, 
  Shield, 
  Wifi, 
  WifiOff,
  Loader2,
  AlertCircle
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

interface ChatMessage {
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
  // Guest user info
  guestName: string
  guestCity?: string
}

interface ModerationStats {
  pending: number
  approved: number
  rejected: number
  total: number
}

interface ModerationState {
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

interface LiveChatModerationProps {
  className?: string
}

// LiveChatModeration: Real-time chat moderation interface for admins
export function LiveChatModeration({ className }: LiveChatModerationProps) {
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

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  // Connect to WebSocket
  const connectWebSocket = () => {
    try {
      setState(prev => ({ ...prev, wsStatus: 'connecting', error: null }))
      
      const token = localStorage.getItem('auth_token')
      const wsUrl = `ws://localhost:3001/livechat/ws?token=${token}&role=moderator`
      
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        setState(prev => ({ ...prev, wsStatus: 'connected', isLoading: false }))
        // Request initial message history
        wsRef.current?.send(JSON.stringify({ 
          type: 'get_messages', 
          status: 'all' 
        }))
      }

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        handleWebSocketMessage(data)
      }

      wsRef.current.onclose = () => {
        setState(prev => ({ ...prev, wsStatus: 'disconnected' }))
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket()
        }, 3000)
      }

      wsRef.current.onerror = () => {
        setState(prev => ({ 
          ...prev, 
          wsStatus: 'disconnected',
          error: 'Koneksi WebSocket gagal'
        }))
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        wsStatus: 'disconnected',
        error: 'Gagal menghubungkan ke server'
      }))
    }
  }

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'new_message':
        // Add new message to pending
        setState(prev => ({
          ...prev,
          messages: {
            ...prev.messages,
            pending: [...prev.messages.pending, data.message]
          },
          stats: {
            ...prev.stats,
            pending: prev.stats.pending + 1,
            total: prev.stats.total + 1
          }
        }))
        break
        
      case 'message_moderated':
        // Move message between columns based on new status
        moveMessage(data.message.id, data.message.status)
        break
        
      case 'messages_history':
        // Load initial message history
        const grouped = groupMessagesByStatus(data.messages)
        setState(prev => ({
          ...prev,
          messages: grouped,
          stats: calculateStats(data.messages),
          isLoading: false
        }))
        break
    }
  }

  // Group messages by status
  const groupMessagesByStatus = (messages: ChatMessage[]) => {
    return {
      pending: messages.filter(m => m.status === 'pending'),
      approved: messages.filter(m => m.status === 'approved'),
      rejected: messages.filter(m => m.status === 'rejected' || m.status === 'blocked')
    }
  }

  // Calculate statistics
  const calculateStats = (messages: ChatMessage[]): ModerationStats => {
    return {
      pending: messages.filter(m => m.status === 'pending').length,
      approved: messages.filter(m => m.status === 'approved').length,
      rejected: messages.filter(m => m.status === 'rejected' || m.status === 'blocked').length,
      total: messages.length
    }
  }

  // Move message between columns
  const moveMessage = (messageId: string, newStatus: string) => {
    setState(prev => {
      const allMessages = [
        ...prev.messages.pending,
        ...prev.messages.approved,
        ...prev.messages.rejected
      ]
      
      const message = allMessages.find(m => m.id === messageId)
      if (!message) return prev

      // Update message status
      const updatedMessage = { 
        ...message, 
        status: newStatus as any,
        moderatedAt: new Date()
      }

      // Remove from all columns
      const pending = prev.messages.pending.filter(m => m.id !== messageId)
      const approved = prev.messages.approved.filter(m => m.id !== messageId)
      const rejected = prev.messages.rejected.filter(m => m.id !== messageId)

      // Add to appropriate column
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
  }

  // Moderate message
  const moderateMessage = async (messageId: string, action: 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/livechat/messages/${messageId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: action === 'approve' ? 'approved' : 'rejected'
        })
      })

      if (!response.ok) {
        throw new Error('Gagal memproses moderasi')
      }

      // WebSocket will handle the UI update
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan'
      }))
    }
  }

  // Filter messages by search query
  const filterMessages = (messages: ChatMessage[]) => {
    if (!state.searchQuery) return messages
    
    const query = state.searchQuery.toLowerCase()
    return messages.filter(msg => 
      msg.text.toLowerCase().includes(query) ||
      msg.guestName.toLowerCase().includes(query) ||
      msg.guestCity?.toLowerCase().includes(query)
    )
  }

  // Connect on component mount
  useEffect(() => {
    connectWebSocket()
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      wsRef.current?.close()
    }
  }, [])

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'rejected': 
      case 'blocked': return 'destructive'
      default: return 'secondary'
    }
  }

  // Message card component
  const MessageCard = ({ 
    message, 
    showActions = false 
  }: { 
    message: ChatMessage
    showActions?: boolean
  }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{message.guestName}</span>
              {message.guestCity && (
                <Badge variant="outline" className="text-xs">
                  {message.guestCity}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDistanceToNow(message.createdAt, { 
                addSuffix: true,
                locale: id 
              })}
            </p>
          </div>
          <Badge variant={getStatusVariant(message.status)}>
            {message.status === 'pending' && 'Menunggu'}
            {message.status === 'approved' && 'Disetujui'}
            {message.status === 'rejected' && 'Ditolak'}
            {message.status === 'blocked' && 'Diblokir'}
          </Badge>
        </div>
        
        <p className="text-sm mb-3 leading-relaxed">
          {message.text}
        </p>
        
        {showActions && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => moderateMessage(message.id, 'approve')}
              className="flex items-center space-x-1"
            >
              <CheckCircle className="h-3 w-3" />
              <span>Setujui</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => moderateMessage(message.id, 'reject')}
              className="flex items-center space-x-1"
            >
              <XCircle className="h-3 w-3" />
              <span>Tolak</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Moderasi Live Chat</h1>
            <p className="text-muted-foreground">
              Kelola pesan dari pendengar secara real-time
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {state.wsStatus === 'connected' ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          <Badge variant={state.wsStatus === 'connected' ? 'default' : 'secondary'}>
            {state.wsStatus === 'connected' && 'Terhubung'}
            {state.wsStatus === 'connecting' && 'Menghubungkan...'}
            {state.wsStatus === 'disconnected' && 'Terputus'}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{state.stats.pending}</p>
            <p className="text-sm text-muted-foreground">Menunggu</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{state.stats.approved}</p>
            <p className="text-sm text-muted-foreground">Disetujui</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-bold">{state.stats.rejected}</p>
            <p className="text-sm text-muted-foreground">Ditolak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{state.stats.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari pesan atau nama pengirim..."
          value={state.searchQuery}
          onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
          className="pl-10"
        />
      </div>

      {/* Error Alert */}
      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {state.isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Memuat pesan...</span>
        </div>
      )}

      {/* Message Columns */}
      {!state.isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Messages */}
          <div>
            <CardHeader className="px-0 pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span>Menunggu Moderasi</span>
                <Badge variant="secondary">{filterMessages(state.messages.pending).length}</Badge>
              </CardTitle>
            </CardHeader>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filterMessages(state.messages.pending).map(message => (
                <MessageCard 
                  key={message.id} 
                  message={message} 
                  showActions={true}
                />
              ))}
              {filterMessages(state.messages.pending).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Tidak ada pesan yang menunggu moderasi
                </p>
              )}
            </div>
          </div>

          {/* Approved Messages */}
          <div>
            <CardHeader className="px-0 pb-4">
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Disetujui</span>
                <Badge variant="secondary">{filterMessages(state.messages.approved).length}</Badge>
              </CardTitle>
            </CardHeader>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filterMessages(state.messages.approved).map(message => (
                <MessageCard key={message.id} message={message} />
              ))}
              {filterMessages(state.messages.approved).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Belum ada pesan yang disetujui
                </p>
              )}
            </div>
          </div>

          {/* Rejected Messages */}
          <div>
            <CardHeader className="px-0 pb-4">
              <CardTitle className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span>Ditolak</span>
                <Badge variant="secondary">{filterMessages(state.messages.rejected).length}</Badge>
              </CardTitle>
            </CardHeader>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filterMessages(state.messages.rejected).map(message => (
                <MessageCard key={message.id} message={message} />
              ))}
              {filterMessages(state.messages.rejected).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Belum ada pesan yang ditolak
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}