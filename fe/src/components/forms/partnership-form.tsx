'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, AlertCircle, Loader2, Users } from 'lucide-react'
import { apiClient, isAxiosError } from '@/lib/api/client'

// PartnershipForm: Registration form for partnership program
interface FormData {
  name: string
  email: string
  whatsapp: string
  partnerType: string
}

interface FormErrors {
  name?: string
  email?: string
  whatsapp?: string
  partnerType?: string
  general?: string
}

interface PartnershipFormProps {
  className?: string
}

export function PartnershipForm({ className }: PartnershipFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    whatsapp: '',
    partnerType: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setIsRateLimited(false)

    try {
      await apiClient.post('/membership/register', formData)

      // Success
      setIsSuccess(true)
      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        partnerType: ''
      })
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)

    } catch (error: unknown) {
      console.error('Error submitting partnership registration:', error)
      
      // Handle rate limiting
      if (isAxiosError(error) && error.response?.status === 429) {
        setIsRateLimited(true)
        return
      }

      const errorData = isAxiosError(error) ? error.response?.data : null
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const fieldErrors: FormErrors = {}
        errorData.errors.forEach((err: { path: keyof FormErrors, msg: string }) => {
          if (err.path) {
            fieldErrors[err.path] = err.msg
          }
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ general: errorData?.message || (error instanceof Error ? error.message : "Terjadi kesalahan saat mendaftar sebagai partner") })
      }
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
          <Users className="h-5 w-5 text-primary" />
          Daftar Sebagai Partner
        </CardTitle>
        <CardDescription>
          Bergabunglah dengan program kemitraan Radio El-Shaddai FM dan jadilah bagian 
          dari pelayanan yang memberkati banyak orang.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Success Message */}
        {isSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Pendaftaran partner Anda telah berhasil dikirim. Tim kami akan menghubungi Anda 
              dalam 1-2 hari kerja. Terima kasih!
            </AlertDescription>
          </Alert>
        )}

        {/* Rate Limit Message */}
        {isRateLimited && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Anda telah mencapai batas pengiriman pendaftaran. 
              Silakan tunggu beberapa saat sebelum mencoba lagi.
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
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Masukkan nama lengkap Anda"
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

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@contoh.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? "border-red-500" : ""}
              disabled={isSubmitting}
              maxLength={200}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* WhatsApp Field */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp">Nomor WhatsApp *</Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="+62812345678"
              value={formData.whatsapp}
              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              className={errors.whatsapp ? "border-red-500" : ""}
              disabled={isSubmitting}
              maxLength={20}
            />
            {errors.whatsapp && (
              <p className="text-sm text-red-600">{errors.whatsapp}</p>
            )}
          </div>

          {/* Partner Type Field */}
          <div className="space-y-2">
            <Label htmlFor="partnerType">Jenis Kemitraan *</Label>
            <Select
              value={formData.partnerType}
              onValueChange={(value: string) => handleInputChange('partnerType', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className={errors.partnerType ? "border-red-500" : ""}>
                <SelectValue placeholder="Pilih jenis kemitraan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sponsor">Sponsor</SelectItem>
                <SelectItem value="content-creator">Content Creator</SelectItem>
                <SelectItem value="event-organizer">Event Organizer</SelectItem>
                <SelectItem value="ministry">Ministry Partner</SelectItem>
                <SelectItem value="business">Business Partner</SelectItem>
                <SelectItem value="other">Lainnya</SelectItem>
              </SelectContent>
            </Select>
            {errors.partnerType && (
              <p className="text-sm text-red-600">{errors.partnerType}</p>
            )}
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
                <Users className="mr-2 h-4 w-4" />
                Daftar Sebagai Partner
              </>
            )}
          </Button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Catatan:</strong> Dengan mendaftar sebagai partner, Anda menyetujui 
            untuk bekerja sama dalam menyebarkan pesan kasih Kristus melalui Radio El-Shaddai FM. 
            Tim kami akan menghubungi Anda untuk membahas detail kemitraan.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}