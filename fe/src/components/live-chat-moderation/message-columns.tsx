import { CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle } from "lucide-react"
import { ChatMessage } from "./types"
import { MessageCard } from "./message-card"

interface MessageColumnProps {
  title: string
  icon: React.ReactNode
  messages: ChatMessage[]
  showActions?: boolean
  onModerate?: (messageId: string, action: 'approve' | 'reject') => Promise<void>
  emptyMessage: string
}

function MessageColumn({ 
  title, 
  icon, 
  messages, 
  showActions = false, 
  onModerate,
  emptyMessage 
}: MessageColumnProps) {
  return (
    <div>
      <CardHeader className="px-0 pb-4">
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
          <Badge variant="secondary">{messages.length}</Badge>
        </CardTitle>
      </CardHeader>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {messages.map(message => (
          <MessageCard 
            key={message.id} 
            message={message} 
            showActions={showActions}
            onModerate={onModerate}
          />
        ))}
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  )
}

interface MessageColumnsProps {
  pendingMessages: ChatMessage[]
  approvedMessages: ChatMessage[]
  rejectedMessages: ChatMessage[]
  onModerate: (messageId: string, action: 'approve' | 'reject') => Promise<void>
}

export function MessageColumns({ 
  pendingMessages, 
  approvedMessages, 
  rejectedMessages, 
  onModerate 
}: MessageColumnsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <MessageColumn
        title="Menunggu Moderasi"
        icon={<Clock className="h-5 w-5 text-yellow-500" />}
        messages={pendingMessages}
        showActions={true}
        onModerate={onModerate}
        emptyMessage="Tidak ada pesan yang menunggu moderasi"
      />
      
      <MessageColumn
        title="Disetujui"
        icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        messages={approvedMessages}
        emptyMessage="Belum ada pesan yang disetujui"
      />
      
      <MessageColumn
        title="Ditolak"
        icon={<XCircle className="h-5 w-5 text-red-500" />}
        messages={rejectedMessages}
        emptyMessage="Belum ada pesan yang ditolak"
      />
    </div>
  )
}