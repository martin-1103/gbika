"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageCircle, Send, Minimize2, Maximize2, Clock, Heart, Share2, Eye, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

// Format relative time for chat messages
function formatRelativeTime(timestamp: Date): string {
  return formatDistanceToNow(timestamp, { addSuffix: true })
}
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

// LiveChatWidget: Interactive chat widget with enhanced user engagement features
export function LiveChatWidget({ className }: LiveChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null)
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set())
  const [isMinimized, setIsMinimized] = useState(false)

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

      } catch (err) {
        setError("Gagal memuat pesan chat")
        console.error("Error fetching chat messages:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
    

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
        return <Badge className="text-xs bg-green-100 text-green-700 px-2 py-1">🙏 Doa</Badge>
      case 'song_request':
        return <Badge className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1">🎵 Lagu</Badge>
      default:
        return <Badge className="text-xs bg-blue-100 text-blue-700 px-2 py-1">💬 Chat</Badge>
    }
  }

  if (loading) {
    return (
      <div className={`${className} p-6`}>
        {/* Enhanced Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 transform">
            <MessageCircle className="w-5 h-5 text-primary group-hover:animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Chat Langsung</h2>
            <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Percakapan komunitas</p>
          </div>
        </div>
        <Skeleton className="w-16 h-6 rounded-full animate-pulse" />
        </div>



        {/* Loading Messages */}
        <div className="space-y-3 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Loading Input */}
        <div className="p-3 rounded-lg border border-border bg-card">
          <div className="flex gap-2">
            <Skeleton className="flex-1 h-9" />
            <Skeleton className="w-16 h-9" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className} p-6`}>
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Chat Langsung</h2>
              <p className="text-sm text-muted-foreground">Percakapan komunitas</p>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }


  
  return (
    <div className={`${className} p-6`}>
      {/* Enhanced Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 transform">
            <MessageCircle className="w-5 h-5 text-primary group-hover:animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Chat Langsung</h2>
            <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Percakapan komunitas</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Minimize/Maximize Button */}
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
            ) : (
              <Minimize2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
            )}
          </button>
          
          {/* Enhanced Live Status */}
          <Badge className="bg-green-500 text-white animate-pulse hover:bg-green-600 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
            LIVE
          </Badge>
        </div>
      </div>



      {/* Enhanced Recent Messages */}
      {!isMinimized && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Pesan Terbaru</h3>
            <Badge variant="outline" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
              {messages.length} pesan
            </Badge>
          </div>
          
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2 animate-pulse" />
                <p className="text-muted-foreground">Belum ada pesan</p>
              </div>
            ) : (
              messages.slice(-3).map((message, index) => (
                <div 
                  key={message.id} 
                  className={`
                    flex items-start gap-3 p-3 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer group relative overflow-hidden
                    ${
                      index === 0 
                        ? 'bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 hover:border-primary/40' 
                        : 'bg-muted/30 hover:bg-muted/50'
                    }
                  `}
                  onMouseEnter={() => setHoveredMessage(message.id)}
                  onMouseLeave={() => setHoveredMessage(null)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
                    <span className="text-xs font-medium text-primary group-hover:scale-110 transition-transform duration-200">
                      {message.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">{message.username}</span>
                       <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                         <Clock className="w-3 h-3" />
                         {formatRelativeTime(message.timestamp)}
                       </div>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                          Terbaru
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground break-words leading-relaxed group-hover:text-foreground transition-colors duration-200">
                       {message.message}
                     </p>
                     
                     {/* Interactive Actions */}
                     {hoveredMessage === message.id && (
                       <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <button 
                           className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors duration-200"
                           onClick={() => {
                             const newLiked = new Set(likedMessages)
                             if (newLiked.has(message.id)) {
                               newLiked.delete(message.id)
                             } else {
                               newLiked.add(message.id)
                             }
                             setLikedMessages(newLiked)
                           }}
                         >
                           <Heart className={`w-3 h-3 ${likedMessages.has(message.id) ? 'fill-red-500 text-red-500' : ''}`} />
                           <span>{likedMessages.has(message.id) ? 'Disukai' : 'Suka'}</span>
                         </button>
                         <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-500 transition-colors duration-200">
                           <Share2 className="w-3 h-3" />
                           <span>Bagikan</span>
                         </button>
                         <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-green-500 transition-colors duration-200">
                           <Eye className="w-3 h-3" />
                           <span>Lihat</span>
                         </button>
                       </div>
                     )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Enhanced Action Buttons */}
      <div className={`grid ${isMinimized ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
        {!isMinimized ? (
          <>
            <Link href="/dengarkan-live">
              <Button className="w-full hover:scale-105 transition-all duration-200 hover:shadow-lg" size="sm" variant="default">
                <MessageCircle className="w-4 h-4 mr-2" />
                Bergabung
              </Button>
            </Link>
           
          </>
        ) : (
          <Link href="/dengarkan-live">
            <Button className="w-full hover:scale-105 transition-all duration-200 hover:shadow-lg" size="sm" variant="default">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat Live
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}