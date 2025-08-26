"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Heart, CheckCircle, AlertCircle } from "lucide-react"

interface PrayerRequestFormProps {
  className?: string
}

interface FormData {
  name: string
  contact: string
  content: string
  is_anonymous: boolean
}

interface FormErrors {
  name?: string
  contact?: string
  content?: string
  general?: string
}

// PrayerRequestForm: Form component for submitting prayer requests
export function PrayerRequestForm({ className }: PrayerRequestFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    contact: "",
    content: "",
    is_anonymous: false
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
    } else if (formData.name.length > 100) {
      newErrors.name = "Nama maksimal 100 karakter"
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Kontak wajib diisi"
    } else if (formData.contact.length > 200) {
      newErrors.contact = "Kontak maksimal 200 karakter"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Isi doa wajib diisi"
    } else if (formData.content.length < 10) {
      newErrors.content = "Isi doa minimal 10 karakter"
    } else if (formData.content.length > 2000) {
      newErrors.content = "Isi doa maksimal 2000 karakter"
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
      const response = await fetch('/api/services/prayer', {
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
          setErrors({ general: errorData.message || "Terjadi kesalahan saat mengirim permohonan doa" })
        }
        return
      }

      // Success
      setIsSuccess(true)
      setFormData({
        name: "",
        contact: "",
        content: "",
        is_anonymous: false
      })
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)

    } catch (error) {
      console.error('Error submitting prayer request:', error)
      setErrors({ general: "Terjadi kesalahan jaringan. Silakan coba lagi." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
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
          <Heart className="h-5 w-5 text-primary" />
          Permohonan Doa
        </CardTitle>
        <CardDescription>
          Kirimkan permohonan doa Anda kepada tim doa Radio Gbika. 
          Kami akan mendoakan Anda dengan sepenuh hati.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Success Message */}
        {isSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Permohonan doa Anda telah berhasil dikirim. Tim doa kami akan mendoakan Anda. 
              Tuhan memberkati!
            </AlertDescription>
          </Alert>
        )}

        {/* Rate Limit Message */}
        {isRateLimited && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Anda telah mencapai batas pengiriman permohonan doa. 
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

          {/* Contact Field */}
          <div className="space-y-2">
            <Label htmlFor="contact">Kontak (Email/No. Telepon) *</Label>
            <Input
              id="contact"
              type="text"
              placeholder="email@contoh.com atau +62812345678"
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              className={errors.contact ? "border-red-500" : ""}
              disabled={isSubmitting}
              maxLength={200}
            />
            {errors.contact && (
              <p className="text-sm text-red-600">{errors.contact}</p>
            )}
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <Label htmlFor="content">Isi Permohonan Doa *</Label>
            <Textarea
              id="content"
              placeholder="Tuliskan permohonan doa Anda di sini..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className={`min-h-[120px] ${errors.content ? "border-red-500" : ""}`}
              disabled={isSubmitting}
              maxLength={2000}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {errors.content && (
                  <span className="text-red-600">{errors.content}</span>
                )}
              </span>
              <span>{formData.content.length}/2000</span>
            </div>
          </div>

          {/* Anonymous Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_anonymous"
              checked={formData.is_anonymous}
              onCheckedChange={(checked) => handleInputChange('is_anonymous', checked === true)}
              disabled={isSubmitting}
            />
            <Label htmlFor="is_anonymous" className="text-sm">
              Kirim sebagai anonim
            </Label>
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
                <Heart className="mr-2 h-4 w-4" />
                Kirim Permohonan Doa
              </>
            )}
          </Button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Catatan:</strong> Semua permohonan doa akan ditangani dengan penuh kasih 
            dan kerahasiaan oleh tim doa Radio Gbika. Kami percaya Tuhan akan menjawab 
            setiap doa yang dinaikkan dengan iman.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}