"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ArrowLeft, MessageSquare, Loader2, AlertCircle, CheckCircle } from "lucide-react"

interface TestimonialFormData {
  title: string
  name: string
  email: string
  city?: string
  content: string
  status: "pending" | "approved" | "rejected"
}

interface TestimonialEditFormProps {
  testimonialId?: string
  initialData?: Partial<TestimonialFormData>
  onSuccess?: () => void
}

// TestimonialEditForm: Edit testimonial form for admin use
export function TestimonialEditForm({ 
  testimonialId,
  initialData,
  onSuccess 
}: TestimonialEditFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<TestimonialFormData>({
    title: initialData?.title || "",
    name: initialData?.name || "",
    email: initialData?.email || "",
    city: initialData?.city || "",
    content: initialData?.content || "",
    status: initialData?.status || "pending"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(!!testimonialId)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Load testimonial data if ID provided
  useEffect(() => {
    if (testimonialId && !initialData) {
      loadTestimonial()
    }
  }, [testimonialId])

  const loadTestimonial = async () => {
    try {
      setIsLoadingData(true)
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/testimonials/${testimonialId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Gagal memuat data kesaksian')
      }

      const data = await response.json()
      setFormData({
        title: data.title || "",
        name: data.name || "",
        email: data.email || "",
        city: data.city || "",
        content: data.content || "",
        status: data.status || "pending"
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan')
    } finally {
      setIsLoadingData(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (field: keyof TestimonialFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  // Handle status change
  const handleStatusChange = (status: "pending" | "approved" | "rejected") => {
    setFormData(prev => ({ ...prev, status }))
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Gagal menyimpan perubahan kesaksian')
      }

      setSuccess(true)
      if (onSuccess) {
        onSuccess()
      }

      // Show success for 2 seconds then redirect
      setTimeout(() => {
        router.push('/admin/testimonials')
      }, 2000)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  // Get status variant for badge
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      default: return 'secondary'
    }
  }

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Disetujui'
      case 'rejected': return 'Ditolak'
      default: return 'Menunggu'
    }
  }

  if (isLoadingData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat data kesaksian...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Edit Kesaksian
          </h1>
          <p className="text-muted-foreground">
            Ubah dan moderasi kesaksian dari pendengar
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => router.push('/admin/testimonials')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Edit Kesaksian</CardTitle>
          <CardDescription>
            Edit informasi kesaksian dan atur status moderasi
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Success Message */}
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Kesaksian berhasil diperbarui! Mengalihkan ke daftar kesaksian...
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
            {/* Status Field */}
            <div className="space-y-2">
              <Label>Status Moderasi</Label>
              <div className="flex items-center gap-4">
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant={getStatusVariant(formData.status)}>
                  {getStatusLabel(formData.status)}
                </Badge>
              </div>
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title">Judul Kesaksian *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Masukkan judul kesaksian"
                disabled={isLoading}
                maxLength={200}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Pengirim *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nama lengkap"
                  disabled={isLoading}
                  maxLength={100}
                  required
                />
              </div>

              {/* City Field */}
              <div className="space-y-2">
                <Label htmlFor="city">Kota/Daerah</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Jakarta, Surabaya, dll."
                  disabled={isLoading}
                  maxLength={100}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@contoh.com"
                disabled={isLoading}
                maxLength={200}
                required
              />
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <Label htmlFor="content">Isi Kesaksian *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Tuliskan kesaksian..."
                disabled={isLoading}
                maxLength={2000}
                rows={8}
                required
              />
              <div className="text-right text-sm text-muted-foreground">
                {formData.content.length}/2000 karakter
              </div>
            </div>

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
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/testimonials')}
                disabled={isLoading}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}