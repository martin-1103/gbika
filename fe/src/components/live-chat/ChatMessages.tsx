// ChatMessages: Component for displaying chat messages and history

import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'
import { ChatMessage } from './types'

interface ChatMessagesProps {
  messages: ChatMessage[]
  approvedMessages: ChatMessage[]
  historyLoading: boolean
}

export const ChatMessages = ({ messages, approvedMessages, historyLoading }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Force scroll to bottom on initial load
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [messages.length])

  // Format timestamp for display
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {/* History Messages */}
        {historyLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Memuat history pesan...</span>
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
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{msg.name}</span>
                        <span className="text-xs text-muted-foreground">{msg.city}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <div className="bg-muted p-3 rounded-lg text-sm opacity-75">
                        {msg.message}
                      </div>
                    </div>
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
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{msg.name}</span>
                  <span className="text-xs text-muted-foreground">{msg.city}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(msg.timestamp)}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    msg.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                    msg.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {msg.status === 'sent' ? 'Terkirim' :
                     msg.status === 'delivered' ? 'Diterima' : 'Pending'}
                  </span>
                </div>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  {msg.message}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}