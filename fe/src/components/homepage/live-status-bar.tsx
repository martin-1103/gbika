"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Radio, Play, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"

interface ScheduleItem {
  time: string
  endTime: string
  program_name: string
  program_id: string
  description: string | null
}

interface LiveStatus {
  isLive: boolean
  currentProgram?: {
    name: string
    description: string
    startTime: string
    endTime: string
  }
}

// LiveStatusBar: Display live status and current program from schedule API
export function LiveStatusBar() {
  const [liveStatus, setLiveStatus] = useState<LiveStatus>({
    isLive: false
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if current time is within program schedule
  const isCurrentlyLive = (schedule: ScheduleItem[]): { isLive: boolean; currentProgram?: ScheduleItem } => {
    const now = new Date()
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
    
    for (const program of schedule) {
      if (currentTime >= program.time && currentTime <= program.endTime) {
        return {
          isLive: true,
          currentProgram: program
        }
      }
    }
    
    return { isLive: false }
  }

  // Fetch today's schedule and determine live status
  const fetchLiveStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/pages/homepage')
      if (!response.ok) {
        throw new Error('Failed to fetch schedule')
      }
      
      const data = await response.json()
      if (data.success && data.data.today_schedule) {
        const { isLive, currentProgram } = isCurrentlyLive(data.data.today_schedule)
        
        setLiveStatus({
          isLive,
          currentProgram: currentProgram ? {
            name: currentProgram.program_name,
            description: currentProgram.description || 'Program siaran',
            startTime: currentProgram.time,
            endTime: currentProgram.endTime
          } : undefined
        })
      } else {
        setLiveStatus({ isLive: false })
      }
    } catch (err) {
      console.error('Error fetching live status:', err)
      setError('Gagal memuat status siaran')
      setLiveStatus({ isLive: false })
    } finally {
      setLoading(false)
    }
  }

  // Fetch live status on mount and set up polling
  useEffect(() => {
    fetchLiveStatus()
    
    // Poll every 2 minutes to check for program changes
    const interval = setInterval(fetchLiveStatus, 120000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <section className="py-12 px-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto">
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />
                  <div className="h-6 bg-gray-300 rounded w-20 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-300 rounded w-48 mx-auto animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-64 mx-auto animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 px-4 bg-gradient-to-br from-red-50 via-background to-red-50">
        <div className="container mx-auto">
          <Card className="border-2 border-red-200 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3">
                  <Radio className="w-8 h-8 text-red-500" />
                  <Badge variant="destructive" className="text-sm font-semibold px-3 py-1">
                    ERROR
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-red-600">
                    {error}
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Silakan refresh halaman atau coba lagi nanti
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container mx-auto">
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Live Status Indicator */}
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <Radio className="w-8 h-8 text-primary" />
                  {liveStatus.isLive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
                <Badge 
                  variant={liveStatus.isLive ? "destructive" : "secondary"}
                  className="text-sm font-semibold px-3 py-1"
                >
                  {liveStatus.isLive ? "LIVE" : "OFFLINE"}
                </Badge>
              </div>

              {/* Current Program Info */}
              {liveStatus.isLive && liveStatus.currentProgram && (
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-primary">
                    {liveStatus.currentProgram.name}
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    {liveStatus.currentProgram.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {liveStatus.currentProgram.startTime} - {liveStatus.currentProgram.endTime}
                  </p>
                </div>
              )}

              {!liveStatus.isLive && (
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Radio Gbika
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Menyebarkan kasih Kristus melalui udara
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="group min-w-[200px]"
                  asChild
                >
                  <Link href="/dengarkan-live">
                    <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    {liveStatus.isLive ? "Dengarkan Live" : "Dengarkan Rekaman"}
                  </Link>
                </Button>
                
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/kontak">
                      <Heart className="mr-2 w-4 h-4" />
                      Doa Online
                    </Link>
                  </Button>
                  
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/kontak">
                      <MessageCircle className="mr-2 w-4 h-4" />
                      Request Lagu
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}