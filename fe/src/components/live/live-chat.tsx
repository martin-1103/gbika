"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  MessageCircle, 
  Users, 
  Wifi, 
  WifiOff, 
  Loader2, 
  AlertCircle, 
  Send,
  CheckCircle,
  Clock
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { useWebSocket } from "../live-chat/useWebSocket"
import { UserData } from "../live-chat/types"

interface LiveChatProps {
  className?: string
}

// LiveChat: Real-time chat component with WebSocket integration
export function LiveChat({ className }: LiveChatProps) {
  const [userData, setUserData] = useState<UserData>({ name: "", city: "" })
  const [message, setMessage] = useState("")
  const [showUserForm, setShowUserForm] = useState(true)
  
  const {
    chatState,
    messages,
    approvedMessages,
    historyLoading,
    connectWebSocket,
    sendMessage,
    closeConnection
  } = useWebSocket()
  
  // Check for existing session on component mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData')
    const sessionToken = localStorage.getItem('sessionToken')
    
    if (savedUserData && sessionToken) {
      try {
        const parsedUserData = JSON.parse(savedUserData)
        setUserData(parsedUserData)
        setShowUserForm(false)
        connectWebSocket()
      } catch (error) {
        console.error('Error loading saved session:', error)
        localStorage.removeItem('userData')
        localStorage.removeItem('sessionToken')
      }
    }
  }, [connectWebSocket])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeConnection()
    }
  }, [closeConnection])

  // Handle user form submission
  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userData.name.trim() && userData.city.trim()) {
      setUserData(userData)
      setShowUserForm(false)
      connectWebSocket(userData)
    }
  }

  // Handle message form submission
  const handleMessageFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && message.trim().length >= 50) {
      sendMessage(message.trim())
      setMessage("")
    }
  }

  // Handle textarea keydown for Ctrl+Enter submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault()
      handleMessageFormSubmit(e as React.FormEvent)
    }
  }

  // Format timestamp for display
  const formatTime = (timestamp: Date | string | number) => {
    try {
      let date: Date
      
      if (timestamp instanceof Date) {
        date = timestamp
      } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        date = new Date(timestamp)
      } else {
        console.warn('Invalid timestamp format:', timestamp)
        return 'Baru saja'
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date created from:', timestamp)
        return 'Baru saja'
      }
      
      return formatDistanceToNow(date, { 
        addSuffix: true,
        locale: id 
      })
    } catch (error) {
      console.error('Error formatting time:', error, timestamp)
      return 'Baru saja'
    }
  }

  const isDisabled = chatState.status !== 'connected' || chatState.isSubmitting
  const characterCount = message.trim().length
  const minCharacters = 50
  const isValidLength = characterCount >= minCharacters

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      {/* Header */}
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
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

        <CardDescription>
          Berinteraksi langsung dengan penyiar dan pendengar lainnya
        </CardDescription>
        
        {/* Error Alerts */}
        {chatState.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{chatState.error}</AlertDescription>
          </Alert>
        )}
        
        {chatState.rateLimitError && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {chatState.rateLimitError}
              {chatState.retryAfter && (
                <span className="block mt-1 text-xs">
                  Silakan tunggu {chatState.retryAfter} detik sebelum mengirim pesan lagi.
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      {showUserForm ? (
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <form onSubmit={handleUserFormSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="font-semibold text-lg mb-2">Mulai Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Masukkan nama dan kota Anda untuk memulai percakapan
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Masukkan nama lengkap Anda"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">Kota *</Label>
                <Input
                  id="city"
                  value={userData.city}
                  onChange={(e) => setUserData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Masukkan kota Anda"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={chatState.status === 'connecting'}
              >
                {chatState.status === 'connecting' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menghubungkan...
                  </>
                ) : (
                  'Mulai Chat'
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      ) : (
        <>
          {/* Messages */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {/* History Messages */}
                {historyLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span className="text-sm text-muted-foreground">Memuat history pesan...</span>
                  </div>
                ) : (
                  approvedMessages.length > 0 && (
                    <>
                      <div className="text-center">
                        <span className="text-xs text-muted-foreground bg-background px-2">
                          Pesan Sebelumnya
                        </span>
                      </div>
                      {approvedMessages.map((msg) => (
                        <div key={msg.id} className="space-y-2">
                          <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{msg.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {msg.city}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed opacity-75">
                              {msg.message}
                            </p>
                          </div>
                        </div>
                      ))}
                      <Separator className="my-4" />
                    </>
                  )
                )}

                {/* Current Session Messages */}
                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    <div className="bg-background rounded-lg p-3 border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{msg.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {msg.city}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(msg.timestamp)}
                          </span>
                          <Badge 
                            variant={
                              msg.status === 'sent' ? 'secondary' :
                              msg.status === 'delivered' ? 'default' : 'outline'
                            }
                            className="text-xs"
                          >
                            {msg.status === 'sent' && <Clock className="w-3 h-3 mr-1" />}
                            {msg.status === 'delivered' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {msg.status === 'sent' ? 'Terkirim' :
                             msg.status === 'delivered' ? 'Diterima' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
                
                {messages.length === 0 && approvedMessages.length === 0 && !historyLoading && (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Belum ada pesan. Mulai percakapan dengan mengirim pesan pertama Anda!
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          
          {/* Message Input */}
          <div className="p-4 border-t">
            <form onSubmit={handleMessageFormSubmit} className="space-y-3">
              <div className="relative">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={chatState.status === 'connected' 
                    ? "Ketik pesan Anda di sini (minimal 50 karakter)..." 
                    : "Menunggu koneksi..."}
                  className="min-h-[80px] pr-12 resize-none"
                  disabled={isDisabled}
                />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  {characterCount}/{minCharacters}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {!isValidLength && characterCount > 0 && (
                    <span className="text-orange-600">
                      Pesan harus minimal {minCharacters} karakter
                    </span>
                  )}
                  {chatState.status !== 'connected' && (
                    <span className="text-red-600">
                      Tidak terhubung ke server
                    </span>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={isDisabled || !message.trim() || !isValidLength}
                >
                  {chatState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Kirim
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </Card>
  )
}