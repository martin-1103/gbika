import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { ChatMessage } from "./types"
import { getStatusVariant, getStatusLabel } from "./utils"

interface MessageCardProps {
  message: ChatMessage
  showActions?: boolean
  onModerate?: (messageId: string, action: 'approve' | 'reject') => Promise<void>
}

export function MessageCard({ 
  message, 
  showActions = false,
  onModerate
}: MessageCardProps) {
  return (
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
            {getStatusLabel(message.status)}
          </Badge>
        </div>
        
        <p className="text-sm mb-3 leading-relaxed">
          {message.text}
        </p>
        
        {showActions && onModerate && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onModerate(message.id, 'approve')}
              className="flex items-center space-x-1"
            >
              <CheckCircle className="h-3 w-3" />
              <span>Setujui</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onModerate(message.id, 'reject')}
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
}