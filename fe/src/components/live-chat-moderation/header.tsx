import { Badge } from "@/components/ui/badge"
import { Shield, Wifi, WifiOff } from "lucide-react"

interface HeaderProps {
  wsStatus: 'disconnected' | 'connecting' | 'connected'
}

export function Header({ wsStatus }: HeaderProps) {
  return (
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
        {wsStatus === 'connected' ? (
          <Wifi className="h-5 w-5 text-green-500" />
        ) : (
          <WifiOff className="h-5 w-5 text-red-500" />
        )}
        <Badge variant={wsStatus === 'connected' ? 'default' : 'secondary'}>
          {wsStatus === 'connected' && 'Terhubung'}
          {wsStatus === 'connecting' && 'Menghubungkan...'}
          {wsStatus === 'disconnected' && 'Terputus'}
        </Badge>
      </div>
    </div>
  )
}