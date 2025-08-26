"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageCircle, Send, Users } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: string
  status: 'approved' | 'pending' | 'rejected'
  type?: 'message' | 'prayer_request' | 'song_request'
}

interface LiveChatWidgetProps {
  className?: string
}

// LiveChatWidget: Display recent moderated chat messages
export function LiveChatWidget({ className }: LiveChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [onlineCount, setOnlineCount] = useState(0)

  // Fetch recent chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Mock data - replace with actual WebSocket connection
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate loading
        
        const mockMessages: ChatMessage[] = [
          {
            id: "1",
            username: "Maria",
            message: "Terima kasih untuk renungan pagi ini, sangat menyentuh hati 🙏",
            timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
            status: "approved",
            type: "message"
          },
          {
            id: "2",
            username: "Budi",
            message: "Mohon doakan kesembuhan ibu saya yang sedang sakit",
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
            status: "approved",
            type: "prayer_request"
          },
          {
            id: "3",
            username: "Sarah",
            message: "Request lagu 'Kasih Setia' dong 🎵",
            timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
            status: "approved",
            type: "song_request"
          },
          {
            id: "4",
            username: "David",
            message: "Selamat pagi semua! Tuhan memberkati hari ini",
            timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 minutes ago
            status: "approved",
            type: "message"
          },
          {
            id: "5",
            username: "Lisa",
            message: "Puji Tuhan untuk program yang luar biasa ini!",
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
            status: "approved",
            type: "message"
          }
        ]
        
        setMessages(mockMessages)
        setOnlineCount(Math.floor(Math.random() * 50) + 20) // Random online count
      } catch (err) {
        setError("Gagal memuat pesan chat")
        console.error("Error fetching chat messages:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.max(10, prev + Math.floor(Math.random() * 10) - 5))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: id 
      })
    } catch {
      return "Baru saja"
    }
  }

  // Get message type badge
  const getMessageTypeBadge = (type?: string) => {
    switch (type) {
      case 'prayer_request':
        return <Badge variant="outline" className="text-xs">Doa</Badge>
      case 'song_request':
        return <Badge variant="outline" className="text-xs">Lagu</Badge>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Live Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Live Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Live Chat
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <Users className="w-4 h-4" />
            <span>{onlineCount}</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Belum ada pesan
            </p>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex gap-3 text-sm">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-primary">
                    {message.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">
                      {message.username}
                    </span>
                    {getMessageTypeBadge(message.type)}
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(message.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground break-words">
                    {message.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button asChild className="w-full">
            <Link href="/dengarkan-live">
              <Send className="mr-2 w-4 h-4" />
              Bergabung dalam Chat
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}