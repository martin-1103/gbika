"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Calendar, Radio, Play, Pause, MoreHorizontal } from "lucide-react"
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

// TodaySchedule: Modern dashboard widget displaying today's program schedule with enhanced interactivity
export function TodaySchedule({ className }: TodayScheduleProps) {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [playingProgram, setPlayingProgram] = useState<string | null>(null)

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
      <div className={`${className} p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Radio className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Jadwal Siaran</h2>
              <p className="text-sm text-muted-foreground">Program hari ini</p>
            </div>
          </div>
          <Skeleton className="w-20 h-8 rounded-full" />
        </div>
        
        {/* Loading Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Radio className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Jadwal Siaran</h2>
              <p className="text-sm text-muted-foreground">Program hari ini</p>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Radio className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (schedule.length === 0) {
    return (
      <div className={`${className} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
              <Radio className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Jadwal Siaran</h2>
              <p className="text-sm text-muted-foreground">Program hari ini</p>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Tidak ada jadwal untuk hari ini</p>
        </div>
      </div>
    )
  }

  // Get current date for display
  const currentDate = new Date()
  const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const liveProgram = schedule.find(item => item.isLive)


  return (
    <div className={`${className} p-6`}>
      {/* Enhanced Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform">
            <Radio className="w-5 h-5 text-primary group-hover:animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">Jadwal Siaran</h2>
            <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {currentDate.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                day: 'numeric',
                month: 'short'
              })}
            </p>
          </div>
        </div>
        
        {/* Enhanced Live Status */}
        {liveProgram ? (
          <Badge className="bg-red-500 text-white animate-pulse hover:bg-red-600 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
            ON AIR
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground hover:text-foreground hover:border-primary transition-all duration-300 hover:scale-105">
            <Clock className="w-3 h-3 mr-1" />
            {currentTime}
          </Badge>
        )}
      </div>



      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedule.map((item, index) => {
          const isCurrentTime = item.isLive
          const currentHour = new Date().getHours()
          const currentMinute = new Date().getMinutes()
          const [itemHour, itemMinute] = item.endTime.split(':').map(Number)
          const isPast = currentHour > itemHour || (currentHour === itemHour && currentMinute > itemMinute)
          
          
          return (
            <Link 
              key={`${item.program_id}-${index}`}
              href={`/program/${item.program_id}`}
              className="group block"
              onMouseEnter={() => setHoveredCard(item.program_id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`
                p-4 rounded-lg border transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:scale-105 relative overflow-hidden
                ${
                  isCurrentTime 
                    ? 'border-red-200 bg-gradient-to-r from-red-50 to-red-100 shadow-md hover:shadow-red-200/50' 
                    : isPast 
                    ? 'border-muted bg-muted/30 opacity-75 hover:opacity-90'
                    : 'border-border bg-card hover:border-primary/30 hover:bg-primary/5'
                }
              `}>
                
                {/* Enhanced Time Badge */}
                <div className="flex items-center justify-between mb-3">
                  <Badge 
                    variant={isCurrentTime ? 'destructive' : isPast ? 'secondary' : 'outline'}
                    className={`text-xs transition-all duration-200 group-hover:scale-105 ${
                      isCurrentTime ? 'animate-pulse hover:animate-bounce' : 'group-hover:bg-primary group-hover:text-primary-foreground'
                    }`}
                  >
                    {isCurrentTime && <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />}
                    {item.time} - {item.endTime}
                  </Badge>
                  
                  <div className="flex items-center gap-2">
                    {isCurrentTime && (
                      <div className="flex items-center gap-1 text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium">LIVE</span>
                      </div>
                    )}
                    
                    {/* Interactive Controls */}
                    {hoveredCard === item.program_id && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          className="p-1 rounded-full hover:bg-primary/20 transition-colors duration-200"
                          onClick={(e) => {
                            e.preventDefault()
                            setPlayingProgram(playingProgram === item.program_id ? null : item.program_id)
                          }}
                        >
                          {playingProgram === item.program_id ? (
                            <Pause className="w-3 h-3 text-primary" />
                          ) : (
                            <Play className="w-3 h-3 text-primary" />
                          )}
                        </button>
                        <button className="p-1 rounded-full hover:bg-primary/20 transition-colors duration-200">
                          <MoreHorizontal className="w-3 h-3 text-primary" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Enhanced Program Info */}
                <div className="space-y-2">
                  <h3 className={`font-semibold text-sm group-hover:text-primary transition-all duration-300 group-hover:scale-105 ${
                    isCurrentTime ? 'text-red-700' : 'text-foreground'
                  }`}>
                    {item.program_name}
                  </h3>
                  
                  {item.description && (
                    <p className={`text-xs leading-relaxed transition-colors duration-300 group-hover:text-foreground ${
                      isCurrentTime ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                      {item.description}
                    </p>
                  )}
                  
                  {/* Hover Effect Indicator */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 text-xs text-primary">
                      <span>Klik untuk detail program</span>
                      <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar for Current Program */}
                {isCurrentTime && (
                  <div className="mt-3">
                    <div className="w-full bg-red-200 rounded-full h-1.5">
                      <div 
                        className="bg-red-500 h-1.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.random() * 60 + 20}%` }}
                      />
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      Sedang berlangsung...
                    </div>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}