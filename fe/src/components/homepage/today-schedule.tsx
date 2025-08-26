"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Calendar } from "lucide-react"
import Link from "next/link"

interface ScheduleItem {
  time: string
  endTime: string
  program_name: string
  program_id: string
  description?: string
  isLive?: boolean
}

interface TodayScheduleProps {
  className?: string
}

// TodaySchedule: Display today's program schedule
export function TodaySchedule({ className }: TodayScheduleProps) {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch today's schedule
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate loading
        
        const mockSchedule: ScheduleItem[] = [
          {
            time: "06:00",
            endTime: "07:00",
            program_name: "Renungan Pagi",
            program_id: "renungan-pagi",
            description: "Memulai hari dengan firman Tuhan",
            isLive: true
          },
          {
            time: "07:00",
            endTime: "09:00",
            program_name: "Musik Rohani",
            program_id: "musik-rohani",
            description: "Lagu-lagu pujian dan penyembahan"
          },
          {
            time: "09:00",
            endTime: "11:00",
            program_name: "Talk Show Keluarga",
            program_id: "talk-show-keluarga",
            description: "Membangun keluarga yang harmonis"
          },
          {
            time: "11:00",
            endTime: "12:00",
            program_name: "Doa Bersama",
            program_id: "doa-bersama",
            description: "Waktu doa dan syafaat"
          },
          {
            time: "19:00",
            endTime: "20:00",
            program_name: "Renungan Malam",
            program_id: "renungan-malam",
            description: "Menutup hari dengan damai"
          }
        ]
        
        setSchedule(mockSchedule)
      } catch (err) {
        setError("Gagal memuat jadwal siaran")
        console.error("Error fetching schedule:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [])

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Jadwal Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-16 h-8" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
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
            <Calendar className="w-5 h-5" />
            Jadwal Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (schedule.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Jadwal Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Tidak ada jadwal untuk hari ini
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Jadwal Hari Ini
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedule.map((item, index) => (
            <div 
              key={`${item.program_id}-${index}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-[80px]">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{item.time}</span>
                {item.isLive && (
                  <Badge variant="destructive" className="text-xs px-1 py-0">
                    LIVE
                  </Badge>
                )}
              </div>
              
              <div className="flex-1">
                <Link 
                  href={`/program/${item.program_id}`}
                  className="block hover:text-primary transition-colors"
                >
                  <h4 className="font-medium">{item.program_name}</h4>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </Link>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {item.endTime}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            href="/program" 
            className="text-sm text-primary hover:underline"
          >
            Lihat Jadwal Lengkap →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}