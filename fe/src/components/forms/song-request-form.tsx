"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Music, CheckCircle, AlertCircle } from "lucide-react"

interface SongRequestFormProps {
  className?: string
}

interface FormData {
  name: string
  city: string
  song_title: string
  message: string
}

interface FormErrors {
  name?: string
  city?: string
  song_title?: string
  message?: string
  general?: string
}

// SongRequestForm: Form component for submitting song requests
export function SongRequestForm({ className }: SongRequestFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    city: "",
    song_title: "",
    message: ""
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nama wajib diisi"
    } else if (formData.name.length < 2) {
      newErrors.name = "Nama minimal 2 karakter"
    } else if (formData.name.length > 100) {
      newErrors.name = "Nama maksimal 100 karakter"
    }

    if (formData.city.trim() && formData.city.length > 100) {
      newErrors.city = "Nama kota maksimal 100 karakter"
    }

    if (!formData.song_title.trim()) {
      newErrors.song_title = "Judul lagu wajib diisi"
    } else if (formData.song_title.length > 200) {
      newErrors.song_title = "Judul lagu maksimal 200 karakter"
    }

    if (formData.message.trim() && formData.message.length > 500) {
      newErrors.message = "Pesan maksimal 500 karakter"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})
    setIsRateLimited(false)

    try {
      const response = await fetch('/api/services/song-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.status === 429) {
        setIsRateLimited(true)
        setErrors({ general: "Anda telah mencapai batas pengiriman. Silakan coba lagi nanti." })
        return
      }

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const fieldErrors: FormErrors = {}
          errorData.errors.forEach((error: any) => {
            if (error.path) {
              fieldErrors[error.path as keyof FormErrors] = error.msg
            }
          })
          setErrors(fieldErrors)
        } else {
          setErrors({ general: errorData.message || "Terjadi kesalahan saat mengirim request lagu" })
        }
        return
      }

      // Success
      setIsSuccess(true)
      setFormData({
        name: "",
        city: "",
        song_title: "",
        message: ""
      })
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)

    } catch (error) {
      console.error('Error submitting song request:', error)
      setErrors({ general: "Terjadi kesalahan jaringan. Silakan coba lagi." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          Request Lagu
        </CardTitle>
        <CardDescription>
          Kirimkan request lagu favorit Anda kepada penyiar Radio Gbika. 
          Lagu Anda mungkin akan diputar dalam siaran berikutnya!
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Success Message */}
        {isSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Request lagu Anda telah berhasil dikirim! Penyiar akan menerima notifikasi 
              dan lagu Anda mungkin akan diputar dalam siaran berikutnya.
            </AlertDescription>
          </Alert>
        )}

        {/* Rate Limit Message */}
        {isRateLimited && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Anda telah mencapai batas pengiriman request lagu. 
              Silakan tunggu beberapa saat sebelum mengirim lagi.
            </AlertDescription>
          </Alert>
        )}

        {/* General Error Message */}
        {errors.general && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errors.general}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Masukkan nama Anda"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? "border-red-500" : ""}
              disabled={isSubmitting}
              maxLength={100}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* City Field */}
          <div className="space-y-2">
            <Label htmlFor="city">Kota</Label>
            <Input
              id="city"
              type="text"
              placeholder="Masukkan kota Anda (opsional)"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={errors.city ? "border-red-500" : ""}
              disabled={isSubmitting}
              maxLength={100}
            />
            {errors.city && (
              <p className="text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          {/* Song Title Field */}
          <div className="space-y-2">
            <Label htmlFor="song_title">Judul Lagu *</Label>
            <Input
              id="song_title"
              type="text"
              placeholder="Masukkan judul lagu yang ingin di-request"
              value={formData.song_title}
              onChange={(e) => handleInputChange('song_title', e.target.value)}
              className={errors.song_title ? "border-red-500" : ""}
              disabled={isSubmitting}
              maxLength={200}
            />
            {errors.song_title && (
              <p className="text-sm text-red-600">{errors.song_title}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message">Pesan (Opsional)</Label>
            <Textarea
              id="message"
              placeholder="Tuliskan pesan atau dedikasi untuk lagu ini..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className={`min-h-[100px] ${errors.message ? "border-red-500" : ""}`}
              disabled={isSubmitting}
              maxLength={500}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {errors.message && (
                  <span className="text-red-600">{errors.message}</span>
                )}
              </span>
              <span>{formData.message.length}/500</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Music className="mr-2 h-4 w-4" />
                Kirim Request Lagu
              </>
            )}
          </Button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Catatan:</strong> Request lagu akan diterima oleh penyiar yang sedang siaran. 
            Tidak semua request dapat diputar karena keterbatasan waktu siaran dan ketersediaan lagu.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}