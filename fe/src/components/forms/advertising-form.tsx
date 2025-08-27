'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, AlertCircle, Loader2, Megaphone } from 'lucide-react'

// AdvertisingForm: Form for advertising placement requests
interface FormData {
  companyName: string
  contactName: string
  email: string
  phone: string
  adType: string
  duration: string
  budget: string
  message: string
  targetAudience?: string
}

interface FormErrors {
  companyName?: string
  contactName?: string
  email?: string
  phone?: string
  adType?: string
  duration?: string
  budget?: string
  message?: string
  targetAudience?: string
  general?: string
}

interface AdvertisingFormProps {
  className?: string
}

export function AdvertisingForm({ className }: AdvertisingFormProps) {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    adType: '',
    duration: '',
    budget: '',
    message: '',
    targetAudience: ''
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
      const response = await fetch('/api/advertising/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      // Handle rate limiting
      if (response.status === 429) {
        setIsRateLimited(true)
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
          setErrors({ general: errorData.message || "Terjadi kesalahan saat mengirim permintaan iklan" })
        }
        return
      }

      // Success
      setIsSuccess(true)
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        adType: '',
        duration: '',
        budget: '',
        message: '',
        targetAudience: ''
      })
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)

    } catch (error) {
      console.error('Error submitting advertising request:', error)
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
          <Megaphone className="h-5 w-5 text-primary" />
          Ajukan Pemasangan Iklan
        </CardTitle>
        <CardDescription>
          Promosikan bisnis atau acara Anda melalui Radio Gbika dan jangkau 
          ribuan pendengar setiap harinya dengan nilai-nilai Kristiani.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Success Message */}
        {isSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Permintaan iklan Anda telah berhasil dikirim. Tim kami akan menghubungi Anda 
              dalam 1-2 hari kerja untuk membahas detail dan paket iklan. Terima kasih!
            </AlertDescription>
          </Alert>
        )}

        {/* Rate Limit Message */}
        {isRateLimited && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Anda telah mencapai batas pengiriman permintaan. 
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
          {/* Company Name Field */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Nama Perusahaan/Organisasi *</Label>
            <Input
              id="companyName"
              type="text"
              placeholder="Masukkan nama perusahaan atau organisasi"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className={errors.companyName ? "border-red-500" : ""}
              disabled={isSubmitting}
              maxLength={100}
            />
            {errors.companyName && (
              <p className="text-sm text-red-600">{errors.companyName}</p>
            )}
          </div>

          {/* Contact Name Field */}
          <div className="space-y-2">
            <Label htmlFor="contactName">Nama Kontak Person *</Label>
            <Input
              id="contactName"
              type="text"
              placeholder="Masukkan nama kontak person"
              value={formData.contactName}
              onChange={(e) => handleInputChange('contactName', e.target.value)}
              className={errors.contactName ? "border-red-500" : ""}
              disabled={isSubmitting}
              maxLength={100}
            />
            {errors.contactName && (
              <p className="text-sm text-red-600">{errors.contactName}</p>
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

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon/WhatsApp *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+62812345678"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={errors.phone ? "border-red-500" : ""}
              disabled={isSubmitting}
              maxLength={20}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ad Type Field */}
            <div className="space-y-2">
              <Label htmlFor="adType">Jenis Iklan *</Label>
              <Select
                value={formData.adType}
                onValueChange={(value: string) => handleInputChange('adType', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.adType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Pilih jenis iklan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spot-radio">Spot Radio (Audio)</SelectItem>
                  <SelectItem value="sponsorship">Sponsorship Program</SelectItem>
                  <SelectItem value="live-mention">Live Mention</SelectItem>
                  <SelectItem value="banner-website">Banner Website</SelectItem>
                  <SelectItem value="social-media">Posting Social Media</SelectItem>
                  <SelectItem value="package-combo">Paket Kombo</SelectItem>
                </SelectContent>
              </Select>
              {errors.adType && (
                <p className="text-sm text-red-600">{errors.adType}</p>
              )}
            </div>

            {/* Duration Field */}
            <div className="space-y-2">
              <Label htmlFor="duration">Durasi Iklan *</Label>
              <Select
                value={formData.duration}
                onValueChange={(value: string) => handleInputChange('duration', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.duration ? "border-red-500" : ""}>
                  <SelectValue placeholder="Pilih durasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-week">1 Minggu</SelectItem>
                  <SelectItem value="2-weeks">2 Minggu</SelectItem>
                  <SelectItem value="1-month">1 Bulan</SelectItem>
                  <SelectItem value="3-months">3 Bulan</SelectItem>
                  <SelectItem value="6-months">6 Bulan</SelectItem>
                  <SelectItem value="1-year">1 Tahun</SelectItem>
                  <SelectItem value="custom">Kustom</SelectItem>
                </SelectContent>
              </Select>
              {errors.duration && (
                <p className="text-sm text-red-600">{errors.duration}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Budget Field */}
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (Opsional)</Label>
              <Select
                value={formData.budget}
                onValueChange={(value: string) => handleInputChange('budget', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.budget ? "border-red-500" : ""}>
                  <SelectValue placeholder="Pilih range budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1m">Di bawah Rp 1 juta</SelectItem>
                  <SelectItem value="1-5m">Rp 1 - 5 juta</SelectItem>
                  <SelectItem value="5-10m">Rp 5 - 10 juta</SelectItem>
                  <SelectItem value="10-25m">Rp 10 - 25 juta</SelectItem>
                  <SelectItem value="above-25m">Di atas Rp 25 juta</SelectItem>
                  <SelectItem value="flexible">Fleksibel</SelectItem>
                </SelectContent>
              </Select>
              {errors.budget && (
                <p className="text-sm text-red-600">{errors.budget}</p>
              )}
            </div>

            {/* Target Audience Field */}
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audiens (Opsional)</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value: string) => handleInputChange('targetAudience', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih target audiens" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-ages">Semua Umur</SelectItem>
                  <SelectItem value="teens">Remaja (13-19 tahun)</SelectItem>
                  <SelectItem value="young-adults">Dewasa Muda (20-35 tahun)</SelectItem>
                  <SelectItem value="adults">Dewasa (36-55 tahun)</SelectItem>
                  <SelectItem value="seniors">Senior (55+ tahun)</SelectItem>
                  <SelectItem value="families">Keluarga</SelectItem>
                  <SelectItem value="professionals">Profesional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message">Pesan/Deskripsi Iklan *</Label>
            <Textarea
              id="message"
              placeholder="Deskripsikan produk/layanan yang ingin diiklankan, target audiens, dan pesan khusus yang ingin disampaikan..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className={errors.message ? "border-red-500" : ""}
              disabled={isSubmitting}
              maxLength={1000}
              rows={4}
            />
            <div className="flex justify-between items-center">
              {errors.message && (
                <p className="text-sm text-red-600">{errors.message}</p>
              )}
              <p className="text-sm text-muted-foreground ml-auto">
                {formData.message.length}/1000 karakter
              </p>
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
                Mengirim Permintaan...
              </>
            ) : (
              <>
                <Megaphone className="mr-2 h-4 w-4" />
                Kirim Permintaan Iklan
              </>
            )}
          </Button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Catatan Penting:</strong> Semua iklan akan ditinjau terlebih dahulu 
            untuk memastikan sesuai dengan nilai-nilai dan standar Radio Gbika. Kami 
            berhak menolak iklan yang tidak sesuai dengan visi misi kami. Tim marketing 
            akan menghubungi Anda untuk pembahasan detail paket, harga, dan jadwal tayang.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}