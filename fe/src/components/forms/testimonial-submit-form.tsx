"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Heart, CheckCircle, AlertCircle } from "lucide-react"

interface TestimonialSubmitFormProps {
  className?: string
}

interface FormData {
  name: string
  email: string
  city: string
  title: string
  content: string
}

interface FormErrors {
  name?: string
  email?: string
  city?: string
  title?: string
  content?: string
  general?: string
}

// TestimonialSubmitForm: Form component for submitting testimonials
export function TestimonialSubmitForm({ className }: TestimonialSubmitFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    city: "",
    title: "",
    content: ""
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

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid"
    } else if (formData.email.length > 200) {
      newErrors.email = "Email maksimal 200 karakter"
    }

    if (formData.city && formData.city.length > 100) {
      newErrors.city = "Kota maksimal 100 karakter"
    }

    if (!formData.title.trim()) {
      newErrors.title = "Judul kesaksian wajib diisi"
    } else if (formData.title.length > 200) {
      newErrors.title = "Judul maksimal 200 karakter"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Isi kesaksian wajib diisi"
    } else if (formData.content.length < 20) {
      newErrors.content = "Isi kesaksian minimal 20 karakter"
    } else if (formData.content.length > 2000) {
      newErrors.content = "Isi kesaksian maksimal 2000 karakter"
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
      const response = await fetch('/api/testimonials', {
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
          setErrors({ general: errorData.message || "Terjadi kesalahan saat mengirim kesaksian" })
        }
        return
      }

      // Success
      setIsSuccess(true)
      setFormData({
        name: "",
        email: "",
        city: "",
        title: "",
        content: ""
      })
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)

    } catch (error) {
      console.error('Error submitting testimonial:', error)
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
          <Heart className="h-5 w-5 text-primary" />
          Bagikan Kesaksian Anda
        </CardTitle>
        <CardDescription>
          Ceritakan bagaimana Tuhan bekerja dalam hidup Anda. Kesaksian Anda akan menguatkan iman saudara-saudara lainnya.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Success Message */}
        {isSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Kesaksian Anda telah berhasil dikirim! Tim kami akan meninjau dan menerbitkannya segera. 
              Terima kasih telah berbagi berkat Tuhan.
            </AlertDescription>
          </Alert>
        )}

        {/* Rate Limit Message */}
        {isRateLimited && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Anda telah mencapai batas pengiriman kesaksian. 
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
              disabled={isSubmitting}
              className={errors.name ? "border-red-500" : ""}
              required
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isSubmitting}
              className={errors.email ? "border-red-500" : ""}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* City Field */}
          <div className="space-y-2">
            <Label htmlFor="city">Kota</Label>
            <Input
              id="city"
              type="text"
              placeholder="Kota asal Anda (opsional)"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              disabled={isSubmitting}
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p className="text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul Kesaksian *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Berikan judul untuk kesaksian Anda"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={isSubmitting}
              className={errors.title ? "border-red-500" : ""}
              required
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <Label htmlFor="content">Isi Kesaksian *</Label>
            <Textarea
              id="content"
              placeholder="Ceritakan bagaimana Tuhan bekerja dalam hidup Anda..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              disabled={isSubmitting}
              className={`min-h-[120px] ${errors.content ? "border-red-500" : ""}`}
              required
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{errors.content && <span className="text-red-600">{errors.content}</span>}</span>
              <span>{formData.content.length}/2000</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              'Kirim Kesaksian'
            )}
          </Button>
        </form>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Kesaksian Anda akan ditinjau terlebih dahulu sebelum dipublikasikan.</p>
          <p className="mt-1">
            Dengan mengirim kesaksian, Anda menyetujui untuk berbagi cerita Anda dengan komunitas Radio Gbika.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}