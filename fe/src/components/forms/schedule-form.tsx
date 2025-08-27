"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Save, Clock, Calendar, Loader2, AlertCircle, CheckCircle } from "lucide-react"

interface ScheduleFormData {
  title: string
  description?: string
  day: string
  startTime: string
  endTime: string
  presenter?: string
  category: string
  isActive: boolean
}

interface ScheduleFormProps {
  scheduleId?: string
  initialData?: Partial<ScheduleFormData>
  mode?: "create" | "edit"
  onSuccess?: () => void
  onCancel?: () => void
}

// ScheduleForm: Create/edit program schedule form
export function ScheduleForm({ 
  scheduleId,
  initialData,
  mode = "create",
  onSuccess,
  onCancel
}: ScheduleFormProps) {
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    day: initialData?.day || "",
    startTime: initialData?.startTime || "",
    endTime: initialData?.endTime || "",
    presenter: initialData?.presenter || "",
    category: initialData?.category || "",
    isActive: initialData?.isActive ?? true
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(!!scheduleId && mode === "edit")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Days of week options
  const daysOfWeek = [
    { value: "monday", label: "Senin" },
    { value: "tuesday", label: "Selasa" },
    { value: "wednesday", label: "Rabu" },
    { value: "thursday", label: "Kamis" },
    { value: "friday", label: "Jumat" },
    { value: "saturday", label: "Sabtu" },
    { value: "sunday", label: "Minggu" }
  ]

  // Program categories
  const categories = [
    { value: "renungan", label: "Renungan Harian" },
    { value: "musik", label: "Musik Rohani" },
    { value: "talk-show", label: "Talk Show" },
    { value: "doa", label: "Doa Bersama" },
    { value: "berita", label: "Berita Rohani" },
    { value: "anak", label: "Program Anak" },
    { value: "remaja", label: "Program Remaja" },
    { value: "keluarga", label: "Program Keluarga" },
    { value: "lainnya", label: "Lainnya" }
  ]

  // Load schedule data if in edit mode
  useEffect(() => {
    if (scheduleId && mode === "edit" && !initialData) {
      loadSchedule()
    }
  }, [scheduleId, mode])

  const loadSchedule = async () => {
    try {
      setIsLoadingData(true)
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Gagal memuat data jadwal')
      }

      const data = await response.json()
      setFormData({
        title: data.title || "",
        description: data.description || "",
        day: data.day || "",
        startTime: data.startTime || "",
        endTime: data.endTime || "",
        presenter: data.presenter || "",
        category: data.category || "",
        isActive: data.isActive ?? true
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan')
    } finally {
      setIsLoadingData(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (field: keyof ScheduleFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  // Validate time format and logic
  const validateTimes = () => {
    const { startTime, endTime } = formData
    
    if (!startTime || !endTime) return true // Let required validation handle empty fields
    
    const start = new Date(`2000-01-01 ${startTime}`)
    const end = new Date(`2000-01-01 ${endTime}`)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError("Format waktu tidak valid")
      return false
    }
    
    if (start >= end) {
      setError("Waktu mulai harus lebih awal dari waktu selesai")
      return false
    }
    
    return true
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateTimes()) return
    
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const token = localStorage.getItem('auth_token')
      const endpoint = mode === 'create' 
        ? '/api/schedules' 
        : `/api/schedules/${scheduleId}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Gagal ${mode === 'create' ? 'membuat' : 'memperbarui'} jadwal`)
      }

      setSuccess(true)
      
      if (onSuccess) {
        onSuccess()
      } else {
        // Reset form if creating new
        if (mode === 'create') {
          setFormData({
            title: "",
            description: "",
            day: "",
            startTime: "",
            endTime: "",
            presenter: "",
            category: "",
            isActive: true
          })
        }
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  // Format day label
  const getDayLabel = (day: string) => {
    const dayObj = daysOfWeek.find(d => d.value === day)
    return dayObj?.label || day
  }

  // Format category label
  const getCategoryLabel = (category: string) => {
    const catObj = categories.find(c => c.value === category)
    return catObj?.label || category
  }

  if (isLoadingData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat data jadwal...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {mode === 'create' ? 'Buat Jadwal Baru' : 'Edit Jadwal'}
        </CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'Tambahkan program baru ke jadwal siaran radio'
            : 'Ubah informasi jadwal program yang ada'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Success Message */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Jadwal berhasil {mode === 'create' ? 'dibuat' : 'diperbarui'}!
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-4">
            <Label>Status Program:</Label>
            <div className="flex items-center gap-3">
              <Badge variant={formData.isActive ? "default" : "secondary"}>
                {formData.isActive ? "Aktif" : "Tidak Aktif"}
              </Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange('isActive', !formData.isActive)}
                disabled={isLoading}
              >
                {formData.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </Button>
            </div>
          </div>

          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Nama Program *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Contoh: Renungan Pagi Berkat"
              disabled={isLoading}
              maxLength={200}
              required
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Program</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Deskripsi singkat tentang program ini..."
              disabled={isLoading}
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Day Field */}
            <div className="space-y-2">
              <Label>Hari Siaran *</Label>
              <Select
                value={formData.day}
                onValueChange={(value) => handleInputChange('day', value)}
                disabled={isLoading}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <Label>Kategori Program *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
                disabled={isLoading}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Time Field */}
            <div className="space-y-2">
              <Label htmlFor="startTime">Waktu Mulai *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  disabled={isLoading}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* End Time Field */}
            <div className="space-y-2">
              <Label htmlFor="endTime">Waktu Selesai *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  disabled={isLoading}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Presenter Field */}
          <div className="space-y-2">
            <Label htmlFor="presenter">Nama Penyiar/Presenter</Label>
            <Input
              id="presenter"
              value={formData.presenter}
              onChange={(e) => handleInputChange('presenter', e.target.value)}
              placeholder="Nama penyiar yang memandu program"
              disabled={isLoading}
              maxLength={100}
            />
          </div>

          {/* Preview */}
          {formData.title && formData.day && formData.startTime && formData.endTime && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Preview Jadwal:</h4>
              <div className="text-sm space-y-1">
                <p><strong>{formData.title}</strong></p>
                <p>{getDayLabel(formData.day)} • {formData.startTime} - {formData.endTime}</p>
                {formData.category && <p>Kategori: {getCategoryLabel(formData.category)}</p>}
                {formData.presenter && <p>Presenter: {formData.presenter}</p>}
                {formData.description && <p className="text-muted-foreground mt-2">{formData.description}</p>}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Membuat...' : 'Menyimpan...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === 'create' ? 'Buat Jadwal' : 'Simpan Perubahan'}
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Batal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}