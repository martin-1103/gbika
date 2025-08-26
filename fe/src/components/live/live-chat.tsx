"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Send, MessageCircle, Users, Loader2, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

interface ChatMessage {
  id: string
  name: string
  city: string
  message: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'moderated'
}

interface UserData {
  name: string
  city: string
}

interface ChatState {
  status: 'disconnected' | 'connecting' | 'connected'
  messages: ChatMessage[]
  onlineCount: number
  isSubmitting: boolean
  error: string | null
}

interface LiveChatProps {
  className?: string
}

// LiveChat: Real-time chat component with WebSocket integration
export function LiveChat({ className }: LiveChatProps) {
  const [userData, setUserData] = useState<UserData>({ name: "", city: "" })
  const [message, setMessage] = useState("")
  const [showUserForm, setShowUserForm] = useState(true)
  const [chatState, setChatState] = useState<ChatState>({
    status: 'disconnected',
    messages: [],
    onlineCount: 0,
    isSubmitting: false,
    error: null
  })
  
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load user data from localStorage
  useEffect(() => {
    const savedUserData = localStorage.getItem('gbika-chat-user')
    if (savedUserData) {
      try {
        const parsed = JSON.parse(savedUserData)
        if (parsed.name && parsed.city) {
          setUserData(parsed)
          setShowUserForm(false)
        }
      } catch (error) {
        console.error('Failed to parse saved user data:', error)
      }
    }
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatState.messages])

  // Initialize WebSocket connection
  const connectWebSocket = async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setChatState(prev => ({ ...prev, status: 'connecting', error: null }))

    try {
      // Initialize session first
      const response = await fetch('/api/livechat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        throw new Error('Failed to initialize chat session')
      }

      const { sessionId } = await response.json()

      // Connect to WebSocket
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/livechat/ws?sessionId=${sessionId}`
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        setChatState(prev => ({ ...prev, status: 'connected', error: null }))
        wsRef.current = ws
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          switch (data.type) {
            case 'message':
              setChatState(prev => ({
                ...prev,
                messages: [...prev.messages, {
                  id: data.id,
                  name: data.name,
                  city: data.city,
                  message: data.message,
                  timestamp: new Date(data.timestamp),
                  status: 'delivered'
                }]
              }))
              break
              
            case 'online_count':
              setChatState(prev => ({ ...prev, onlineCount: data.count }))
              break
              
            case 'message_status':
              setChatState(prev => ({
                ...prev,
                messages: prev.messages.map(msg => 
                  msg.id === data.messageId 
                    ? { ...msg, status: data.status }
                    : msg
                )
              }))
              break
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onclose = () => {
        setChatState(prev => ({ ...prev, status: 'disconnected' }))
        wsRef.current = null
        
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          if (!showUserForm) {
            connectWebSocket()
          }
        }, 3000)
      }

      ws.onerror = () => {
        setChatState(prev => ({ 
          ...prev, 
          status: 'disconnected',
          error: 'Koneksi chat terputus. Mencoba menyambung ulang...'
        }))
      }

    } catch (error) {
      setChatState(prev => ({ 
        ...prev, 
        status: 'disconnected',
        error: 'Gagal terhubung ke chat. Silakan coba lagi.'
      }))
    }
  }

  // Handle user data submission
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userData.name.trim() || !userData.city.trim()) {
      setChatState(prev => ({ ...prev, error: 'Nama dan kota harus diisi' }))
      return
    }

    // Save to localStorage
    localStorage.setItem('gbika-chat-user', JSON.stringify(userData))
    setShowUserForm(false)
    connectWebSocket()
  }

  // Handle message submission
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || chatState.status !== 'connected' || !wsRef.current) {
      return
    }

    setChatState(prev => ({ ...prev, isSubmitting: true }))

    try {
      const messageData = {
        type: 'send_message',
        message: message.trim(),
        timestamp: new Date().toISOString()
      }

      wsRef.current.send(JSON.stringify(messageData))
      
      // Add message to local state immediately
      const tempMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        name: userData.name,
        city: userData.city,
        message: message.trim(),
        timestamp: new Date(),
        status: 'sent'
      }
      
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, tempMessage]
      }))
      
      setMessage("")
    } catch (error) {
      setChatState(prev => ({ 
        ...prev, 
        error: 'Gagal mengirim pesan. Silakan coba lagi.'
      }))
    } finally {
      setChatState(prev => ({ ...prev, isSubmitting: false }))
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return (
    <Card className={`w-full h-[600px] flex flex-col ${className}`}>
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <CardTitle className="text-lg">Chat Live</CardTitle>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{chatState.onlineCount}</span>
            </div>
            
            <Badge 
              variant={chatState.status === 'connected' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {chatState.status === 'connected' && <Wifi className="w-3 h-3 mr-1" />}
              {chatState.status === 'connecting' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              {chatState.status === 'disconnected' && <WifiOff className="w-3 h-3 mr-1" />}
              
              {chatState.status === 'connected' && 'Terhubung'}
              {chatState.status === 'connecting' && 'Menghubungkan...'}
              {chatState.status === 'disconnected' && 'Terputus'}
            </Badge>
          </div>
        </div>
        
        {chatState.error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{chatState.error}</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {showUserForm ? (
          <div className="p-6">
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Nama Lengkap *
                </label>
                <Input
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Masukkan nama lengkap Anda"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Kota *
                </label>
                <Input
                  value={userData.city}
                  onChange={(e) => setUserData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Masukkan kota Anda"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Mulai Chat
              </Button>
            </form>
          </div>
        ) : (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatState.messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada pesan. Mulai percakapan!</p>
                </div>
              ) : (
                chatState.messages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{msg.name}</span>
                      <span>•</span>
                      <span>{msg.city}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(msg.timestamp, { addSuffix: true, locale: id })}</span>
                      
                      {msg.status === 'sent' && (
                        <Badge variant="outline" className="text-xs py-0 px-1">
                          Terkirim
                        </Badge>
                      )}
                      {msg.status === 'moderated' && (
                        <Badge variant="secondary" className="text-xs py-0 px-1">
                          Dimoderasi
                        </Badge>
                      )}
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <Separator />

            {/* Message Input */}
            <div className="p-4">
              <form onSubmit={handleMessageSubmit} className="space-y-3">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  rows={3}
                  disabled={chatState.status !== 'connected' || chatState.isSubmitting}
                  className="resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Pesan akan dimoderasi sebelum ditampilkan
                  </p>
                  
                  <Button 
                    type="submit" 
                    size="sm"
                    disabled={!message.trim() || chatState.status !== 'connected' || chatState.isSubmitting}
                  >
                    {chatState.isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="ml-2">Kirim</span>
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}