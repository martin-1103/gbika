// ChatHeader: Header component for live chat with connection status and online count

import { MessageCircle, Users, Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { ChatState } from './types'

interface ChatHeaderProps {
  chatState: ChatState
}

export const ChatHeader = ({ chatState }: ChatHeaderProps) => {
  return (
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
      
      {/* Rate Limit Error Display */}
      {chatState.rateLimitError && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <div className="text-sm text-yellow-700">
            <p>{chatState.rateLimitError}</p>
            {chatState.retryAfter && (
              <p className="mt-1 text-xs">
                Silakan tunggu {chatState.retryAfter} detik sebelum mengirim pesan lagi.
              </p>
            )}
          </div>
        </div>
      )}
    </CardHeader>
  )
}