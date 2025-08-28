"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Radio, 
  Pin, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  MapPin, 
  Wifi, 
  WifiOff,
  Volume2,
  Loader2,
  AlertCircle,
  Users
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { useAuthStore } from "@/stores/auth-store"

interface ChatMessage {
  id: string
  sessionId: string
  text: string
  senderName?: string
  createdAt: Date
  guestName: string
  guestCity?: string
  isPinned?: boolean
  isRead?: boolean
  status: 'pending' | 'approved' | 'rejected' | 'blocked'
}

interface OnAirState {
  wsStatus: 'disconnected' | 'connecting' | 'connected'
  messages: ChatMessage[]
  pinnedMessages: ChatMessage[]
  onlineCount: number
  isLoading: boolean
  error: string | null
  showReadMessages: boolean
}

interface OnAirPanelProps {
  className?: string
  broadcasterName?: string
}

// OnAirPanel: Focused dashboard for broadcasters during live shows
export function OnAirPanel({ 
  className,
  broadcasterName = "Penyiar" 
}: OnAirPanelProps) {
  const [state, setState] = useState<OnAirState>({
    wsStatus: 'disconnected',
    messages: [],
    pinnedMessages: [],
    onlineCount: 0,
    isLoading: true,
    error: null,
    showReadMessages: false
  })

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to latest messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = useCallback((data: { type: string; message: ChatMessage; messages: ChatMessage[]; count: number }) => {
    switch (data.type) {
      case 'new_approved_message':
        // Add new approved message
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, data.message].slice(-50) // Keep last 50
        }))
        // Auto-scroll to new message
        setTimeout(scrollToBottom, 100)
        break
        
      case 'approved_messages_history':
        // Load initial approved messages
        setState(prev => ({
          ...prev,
          messages: data.messages.map((msg: ChatMessage) => ({
            ...msg,
            isRead: false,
            isPinned: false
          })),
          isLoading: false
        }))
        setTimeout(scrollToBottom, 100)
        break
        
      case 'listener_count':
        // Update online listener count
        setState(prev => ({
          ...prev,
          onlineCount: data.count
        }))
        break
    }
  }, [])

  // Get auth state
  const { token, isAuthenticated } = useAuthStore()

  // Connect to WebSocket for approved messages
  const connectWebSocket = useCallback(() => {
    try {
      setState(prev => ({ ...prev, wsStatus: 'connecting', error: null }))
      
      // Check if user is authenticated
      if (!isAuthenticated || !token) {
        setState(prev => ({ 
          ...prev, 
          wsStatus: 'disconnected',
          error: 'Tidak ada token autentikasi. Silakan login kembali.',
          isLoading: false
        }))
        return
      }
      
      const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000'
      const wsUrl = `${wsBaseUrl}/livechat/ws?token=${encodeURIComponent(token)}&role=broadcaster`
      
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        setState(prev => ({ ...prev, wsStatus: 'connected', isLoading: false }))
        // Request approved messages only
        wsRef.current?.send(JSON.stringify({ 
          type: 'get_messages', 
          status: 'approved',
          limit: 50 
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
    } catch {
      setState(prev => ({ 
        ...prev, 
        wsStatus: 'disconnected',
        error: 'Gagal menghubungkan ke server'
      }))
    }
  }, [handleWebSocketMessage, isAuthenticated, token])

  // Toggle pin message
  const togglePin = (messageId: string) => {
    setState(prev => {
      const message = prev.messages.find(m => m.id === messageId)
      if (!message) return prev

      const updatedMessage = { ...message, isPinned: !message.isPinned }
      
      let newPinnedMessages = [...prev.pinnedMessages]
      
      if (updatedMessage.isPinned) {
        // Add to pinned (max 5)
        newPinnedMessages = [updatedMessage, ...newPinnedMessages].slice(0, 5)
      } else {
        // Remove from pinned
        newPinnedMessages = newPinnedMessages.filter(m => m.id !== messageId)
      }

      return {
        ...prev,
        messages: prev.messages.map(m => 
          m.id === messageId ? updatedMessage : m
        ),
        pinnedMessages: newPinnedMessages
      }
    })
  }

  // Toggle read status
  const toggleRead = (messageId: string) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg =>
        msg.id === messageId 
          ? { ...msg, isRead: !msg.isRead }
          : msg
      ),
      pinnedMessages: prev.pinnedMessages.map(msg =>
        msg.id === messageId 
          ? { ...msg, isRead: !msg.isRead }
          : msg
      )
    }))
  }

  // Mark all as read
  const markAllAsRead = () => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => ({ ...msg, isRead: true })),
      pinnedMessages: prev.pinnedMessages.map(msg => ({ ...msg, isRead: true }))
    }))
  }

  // Get unread count
  const getUnreadCount = () => {
    return state.messages.filter(msg => !msg.isRead).length
  }

  // Connect on component mount and when auth state changes
  useEffect(() => {
    connectWebSocket()
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      wsRef.current?.close()
    }
  }, [connectWebSocket, isAuthenticated, token])

  // Message component
  const MessageCard = ({ 
    message, 
    isPinned = false,
    showActions = true 
  }: { 
    message: ChatMessage
    isPinned?: boolean
    showActions?: boolean
  }) => (
    <Card className={`${message.isRead ? 'opacity-75' : ''} ${isPinned ? 'border-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-lg">{message.guestName}</span>
              {message.guestCity && (
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {message.guestCity}
                </Badge>
              )}
              {isPinned && (
                <Pin className="h-4 w-4 text-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(message.createdAt, { 
                addSuffix: true,
                locale: id 
              })}
            </p>
          </div>
          {!message.isRead && (
            <div className="h-3 w-3 bg-primary rounded-full"></div>
          )}
        </div>
        
        <p className={`${isPinned ? 'text-lg' : 'text-base'} mb-3 leading-relaxed font-medium`}>
          {message.text}
        </p>
        
        {showActions && (
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={message.isPinned ? "default" : "outline"}
                onClick={() => togglePin(message.id)}
                className="flex items-center space-x-1"
              >
                <Pin className="h-3 w-3" />
                <span>{message.isPinned ? 'Lepas Pin' : 'Pin'}</span>
              </Button>
              <Button
                size="sm"
                variant={message.isRead ? "outline" : "secondary"}
                onClick={() => toggleRead(message.id)}
                className="flex items-center space-x-1"
              >
                {message.isRead ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
                <span>{message.isRead ? 'Tandai Belum Dibaca' : 'Tandai Dibaca'}</span>
              </Button>
            </div>
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
          <div className="relative">
            <Radio className="h-8 w-8 text-primary" />
            {state.wsStatus === 'connected' && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse">
                <div className="absolute inset-1 bg-white rounded-full"></div>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Dashboard Penyiar</h1>
            <p className="text-muted-foreground">
              Selamat siaran, {broadcasterName}!
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <Users className="h-4 w-4" />
            <span className="font-medium">{state.onlineCount} pendengar</span>
          </div>
          <div className="flex items-center space-x-2">
            {state.wsStatus === 'connected' ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <Badge variant={state.wsStatus === 'connected' ? 'default' : 'secondary'}>
              {state.wsStatus === 'connected' && 'LIVE'}
              {state.wsStatus === 'connecting' && 'Menghubungkan...'}
              {state.wsStatus === 'disconnected' && 'Offline'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{state.messages.length}</p>
            <p className="text-sm text-muted-foreground">Total Pesan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Pin className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{state.pinnedMessages.length}</p>
            <p className="text-sm text-muted-foreground">Pesan Dipinkan</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{getUnreadCount()}</p>
            <p className="text-sm text-muted-foreground">Belum Dibaca</p>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setState(prev => ({ 
              ...prev, 
              showReadMessages: !prev.showReadMessages 
            }))}
          >
            {state.showReadMessages ? 'Sembunyikan' : 'Tampilkan'} Pesan Dibaca
          </Button>
          {getUnreadCount() > 0 && (
            <Button
              variant="secondary" 
              size="sm"
              onClick={markAllAsRead}
            >
              Tandai Semua Dibaca
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Volume2 className="h-4 w-4" />
          <span>Pesan akan diperbarui secara real-time</span>
        </div>
      </div>

      {/* Loading State */}
      {state.isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Memuat pesan...</span>
        </div>
      )}

      {/* Content Layout */}
      {!state.isLoading && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Pinned Messages */}
          <div className="xl:col-span-1">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Pin className="h-5 w-5 text-primary" />
                <span>Pesan Penting</span>
                <Badge variant="secondary">{state.pinnedMessages.length}/5</Badge>
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {state.pinnedMessages.map(message => (
                <MessageCard 
                  key={`pinned-${message.id}`} 
                  message={message} 
                  isPinned={true}
                />
              ))}
              {state.pinnedMessages.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                  <Pin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Pin pesan penting untuk akses cepat
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="xl:col-span-2">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <span>Pesan Terbaru</span>
                <Badge variant="secondary">
                  {state.showReadMessages ? state.messages.length : getUnreadCount()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <div className="max-h-[700px] overflow-y-auto space-y-4">
              {state.messages
                .filter(msg => state.showReadMessages || !msg.isRead)
                .slice(-20) // Show last 20 messages
                .map(message => (
                  <MessageCard 
                    key={message.id} 
                    message={message}
                  />
                ))}
              <div ref={messagesEndRef} />
              
              {state.messages.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Belum ada pesan dari pendengar
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pesan akan muncul setelah disetujui oleh moderator
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}