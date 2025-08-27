"use client"

import { useState } from "react"
import { PublicLayout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  Radio,
  MessageCircle,
  Users,
  AlertCircle,
  CheckCircle,
  Loader2,
  Facebook,
  Instagram,
  Youtube,
  Globe
} from "lucide-react"

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  category: string
  message: string
}

// Contact Us page: Contact information and contact form
export default function KontakPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Contact categories
  const categories = [
    { value: "general", label: "Informasi Umum" },
    { value: "program", label: "Program Siaran" },
    { value: "partnership", label: "Kerjasama" },
    { value: "advertising", label: "Iklan" },
    { value: "technical", label: "Teknis/IT" },
    { value: "complaint", label: "Keluhan" },
    { value: "suggestion", label: "Saran" },
    { value: "other", label: "Lainnya" }
  ]

  // Handle form input changes
  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Gagal mengirim pesan')
      }

      setIsSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        category: "",
        message: ""
      })

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)

    } catch (error) {
      setError('Gagal mengirim pesan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-primary">
            <MessageCircle className="w-4 h-4 mr-2" />
            Hubungi Kami
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold">
            Mari
            <span className="block text-primary">Terhubung</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Kami senang mendengar dari Anda. Hubungi kami untuk pertanyaan, saran, 
            atau kerjasama yang dapat membangun pelayanan Radio Gbika.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            {/* Main Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-primary" />
                  Informasi Kontak
                </CardTitle>
                <CardDescription>
                  Cara terbaik untuk menghubungi Radio Gbika
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Alamat</h3>
                    <p className="text-sm text-muted-foreground">
                      Jl. Radio Gbika No. 123<br />
                      Jakarta Selatan, 12345<br />
                      Indonesia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Telepon</h3>
                    <p className="text-sm text-muted-foreground">
                      Utama: +62 21 1234 5678<br />
                      Studio: +62 21 8765 4321<br />
                      WhatsApp: +62 812 3456 7890
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      info@radiogbika.com<br />
                      program@radiogbika.com<br />
                      partnership@radiogbika.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Jam Operasional</h3>
                    <p className="text-sm text-muted-foreground">
                      Senin - Jumat: 08:00 - 17:00<br />
                      Sabtu: 08:00 - 12:00<br />
                      Minggu: Tutup<br />
                      <span className="text-primary font-medium">Siaran: 24/7</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Media Sosial</CardTitle>
                <CardDescription>
                  Ikuti kami di platform media sosial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start" asChild>
                    <a href="https://facebook.com/radiogbika" target="_blank" rel="noopener noreferrer">
                      <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                      Facebook
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <a href="https://instagram.com/radiogbika" target="_blank" rel="noopener noreferrer">
                      <Instagram className="mr-2 h-4 w-4 text-pink-600" />
                      Instagram
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <a href="https://youtube.com/radiogbika" target="_blank" rel="noopener noreferrer">
                      <Youtube className="mr-2 h-4 w-4 text-red-600" />
                      YouTube
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <a href="https://radiogbika.com" target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4 text-green-600" />
                      Website
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Tautan Cepat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/live">
                      <Radio className="mr-2 h-4 w-4" />
                      Dengarkan Live
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/program">
                      <Clock className="mr-2 h-4 w-4" />
                      Jadwal Program
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/penyiar">
                      <Users className="mr-2 h-4 w-4" />
                      Profil Penyiar
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Kirim Pesan</CardTitle>
                <CardDescription>
                  Isi formulir di bawah ini dan kami akan segera menghubungi Anda kembali
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Success Message */}
                {isSuccess && (
                  <Alert className="mb-6 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Pesan Anda telah berhasil dikirim! Tim kami akan menghubungi Anda dalam 1-2 hari kerja.
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Masukkan nama lengkap Anda"
                        disabled={isSubmitting}
                        required
                        maxLength={100}
                      />
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
                        disabled={isSubmitting}
                        required
                        maxLength={200}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone Field */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+62812345678"
                        disabled={isSubmitting}
                        maxLength={20}
                      />
                    </div>

                    {/* Category Field */}
                    <div className="space-y-2">
                      <Label>Kategori *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange('category', value)}
                        disabled={isSubmitting}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori pesan" />
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

                  {/* Subject Field */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subjek *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Ringkasan singkat topik pesan Anda"
                      disabled={isSubmitting}
                      required
                      maxLength={200}
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tuliskan pesan Anda dengan detail..."
                      disabled={isSubmitting}
                      required
                      rows={6}
                      maxLength={1000}
                    />
                    <div className="text-right text-sm text-muted-foreground">
                      {formData.message.length}/1000 karakter
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
                        Mengirim Pesan...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map/Location Info */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Lokasi Kami</CardTitle>
                <CardDescription>
                  Kunjungi studio Radio Gbika
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Peta lokasi akan ditampilkan di sini<br />
                      <small>(Google Maps Integration)</small>
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>
                    Studio kami berlokasi strategis di Jakarta Selatan, mudah diakses dengan 
                    transportasi umum maupun kendaraan pribadi. Tersedia area parkir yang luas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pertanyaan Umum</CardTitle>
            <CardDescription>
              Jawaban untuk pertanyaan yang sering diajukan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Bagaimana cara request lagu?</h3>
                <p className="text-sm text-muted-foreground">
                  Anda dapat request lagu melalui halaman layanan kami atau menghubungi 
                  WhatsApp studio saat program sedang berlangsung.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Bisakah berkunjung ke studio?</h3>
                <p className="text-sm text-muted-foreground">
                  Ya, kami menerima kunjungan dengan perjanjian terlebih dahulu. 
                  Silakan hubungi kami untuk mengatur jadwal kunjungan.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Bagaimana cara menjadi partner?</h3>
                <p className="text-sm text-muted-foreground">
                  Kunjungi halaman partnership kami atau hubungi tim partnership 
                  untuk informasi lengkap tentang program kerjasama.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Kapan jadwal siaran?</h3>
                <p className="text-sm text-muted-foreground">
                  Radio Gbika mengudara 24/7. Lihat jadwal program lengkap di 
                  halaman "Program & Jadwal" untuk program-program spesial.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}