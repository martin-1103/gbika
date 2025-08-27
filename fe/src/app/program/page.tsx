"use client"

import { useState, useEffect } from "react"
import { PublicLayout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar, 
  Clock, 
  Radio, 
  AlertCircle, 
  Loader2,
  Play
} from "lucide-react"

interface ScheduleItem {
  programName: string
  startTime: string
  endTime: string
}

interface WeeklySchedule {
  sunday: ScheduleItem[]
  monday: ScheduleItem[]
  tuesday: ScheduleItem[]
  wednesday: ScheduleItem[]
  thursday: ScheduleItem[]
  friday: ScheduleItem[]
  saturday: ScheduleItem[]
}

interface ProgramState {
  schedule: WeeklySchedule | null
  isLoading: boolean
  error: string | null
}

// Program & Schedule page: Display weekly radio program schedule
export default function ProgramPage() {
  const [state, setState] = useState<ProgramState>({
    schedule: null,
    isLoading: true,
    error: null
  })

  // Day names in Indonesian
  const dayNames = {
    sunday: 'Minggu',
    monday: 'Senin', 
    tuesday: 'Selasa',
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
    saturday: 'Sabtu'
  }

  // Fetch weekly schedule
  const fetchSchedule = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const response = await fetch('/api/programs/schedule')
      
      if (!response.ok) {
        throw new Error('Gagal memuat jadwal program')
      }
      
      const data = await response.json()
      setState({
        schedule: data.data,
        isLoading: false,
        error: null
      })
    } catch (error) {
      setState({
        schedule: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan'
      })
    }
  }

  // Format time for display
  const formatTime = (time: string) => {
    try {
      return new Date(`1970-01-01T${time}`).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return time
    }
  }

  // Get current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
  }

  // Check if program is currently on air
  const isProgramOnAir = (startTime: string, endTime: string) => {
    const now = getCurrentTime()
    return now >= startTime && now <= endTime
  }

  // Get current day in lowercase
  const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[new Date().getDay()]
  }

  // Program card component
  const ProgramCard = ({ 
    program,
    isCurrentDay = false
  }: { 
    program: ScheduleItem
    isCurrentDay?: boolean
  }) => {
    const isLive = isCurrentDay && isProgramOnAir(program.startTime, program.endTime)
    
    return (
      <Card className={`${isLive ? 'border-red-500 shadow-lg' : ''} transition-all duration-300`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">{program.programName}</h3>
                {isLive && (
                  <Badge variant="destructive" className="animate-pulse">
                    <Play className="h-3 w-3 mr-1" />
                    LIVE
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {formatTime(program.startTime)} - {formatTime(program.endTime)}
                </span>
              </div>
            </div>
            <Radio className={`h-6 w-6 ${isLive ? 'text-red-500' : 'text-muted-foreground'}`} />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Day schedule component
  const DaySchedule = ({ 
    dayKey, 
    programs 
  }: { 
    dayKey: keyof WeeklySchedule
    programs: ScheduleItem[] 
  }) => {
    const isCurrentDay = getCurrentDay() === dayKey
    
    return (
      <Card className={`${isCurrentDay ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{dayNames[dayKey]}</span>
            {isCurrentDay && (
              <Badge variant="default">Hari Ini</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {programs.length > 0 ? (
            programs.map((program, index) => (
              <ProgramCard 
                key={`${dayKey}-${index}`}
                program={program}
                isCurrentDay={isCurrentDay}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Radio className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada program yang dijadwalkan</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Load schedule on component mount
  useEffect(() => {
    fetchSchedule()
  }, [])

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Program & Jadwal</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Temukan jadwal lengkap program-program siaran El Shaddai FM. 
            Jangan lewatkan program favorit Anda setiap harinya!
          </p>
        </div>

        {/* Live Notice */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Radio className="h-6 w-6 text-red-600" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="font-medium text-red-800">
                Program yang sedang mengudara akan ditandai dengan badge LIVE
              </p>
              <p className="text-sm text-red-600">
                Jadwal dapat berubah sewaktu-waktu. Pantau terus untuk update terbaru!
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {state.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {state.error}
              <button 
                className="ml-2 underline"
                onClick={fetchSchedule}
              >
                Coba lagi
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {state.isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-3" />
            <span className="text-lg">Memuat jadwal program...</span>
          </div>
        )}

        {/* Weekly Schedule Grid */}
        {state.schedule && !state.isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {(Object.keys(dayNames) as Array<keyof WeeklySchedule>).map(dayKey => (
              <DaySchedule
                key={dayKey}
                dayKey={dayKey}
                programs={state.schedule![dayKey] || []}
              />
            ))}
          </div>
        )}

        {/* Additional Info */}
        {state.schedule && !state.isLoading && (
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-center space-x-2 text-primary">
                <Radio className="h-6 w-6" />
                <h3 className="text-xl font-semibold">El Shaddai FM</h3>
              </div>
              <p className="text-muted-foreground">
                Radio Kristen yang menyiarkan program-program berkualitas untuk membangun iman 
                dan karakter Kristen. Dengarkan kami setiap hari untuk mendapatkan berkat dan 
                inspirasi rohani.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>24 Jam Siaran</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Radio className="h-4 w-4" />
                  <span>Program Berkualitas</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}