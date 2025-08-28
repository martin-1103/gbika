import { Card, CardContent } from "@/components/ui/card"
import { Clock, CheckCircle, XCircle, MessageSquare } from "lucide-react"
import { ModerationStats } from "./types"

interface StatsCardsProps {
  stats: ModerationStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
          <p className="text-2xl font-bold">{stats.pending}</p>
          <p className="text-sm text-muted-foreground">Menunggu</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold">{stats.approved}</p>
          <p className="text-sm text-muted-foreground">Disetujui</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <XCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
          <p className="text-2xl font-bold">{stats.rejected}</p>
          <p className="text-sm text-muted-foreground">Ditolak</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </CardContent>
      </Card>
    </div>
  )
}