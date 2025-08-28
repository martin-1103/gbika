"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TestimonialCard } from "@/components/cards"
import { Heart } from "lucide-react"
import Link from "next/link"

interface Testimonial {
  id: string
  title: string
  content: string
  author_name: string
  author_location?: string
  submitted_at: string
  status: string
  category?: string
}

interface LatestTestimonialsProps {
  className?: string
}

// LatestTestimonials: Display recent approved testimonials
export function LatestTestimonials({ className }: LatestTestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch latest testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 600)) // Simulate loading
        
        const mockTestimonials: Testimonial[] = [
          {
            id: "1",
            title: "Tuhan Menyembuhkan Keluarga Kami",
            content: "Melalui Radio Gbika, kami belajar untuk saling mengampuni dan membangun kembali hubungan yang rusak. Sekarang keluarga kami hidup dalam damai dan kasih Kristus.",
            author_name: "Sarah M.",
            author_location: "Jakarta",
            submitted_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
            status: "approved",
            category: "keluarga"
          },
          {
            id: "2",
            title: "Mukjizat Penyembuhan",
            content: "Setelah mendengarkan doa syafaat di Radio Gbika, kondisi kesehatan saya berangsur membaik. Dokter pun heran dengan kemajuan yang pesat. Puji Tuhan!",
            author_name: "Budi S.",
            author_location: "Bandung",
            submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            status: "approved",
            category: "kesehatan"
          },
          {
            id: "3",
            title: "Pekerjaan Baru di Masa Sulit",
            content: "Di tengah pandemi, saya kehilangan pekerjaan. Namun setelah bergabung dalam doa bersama Radio Gbika, Tuhan membuka pintu pekerjaan yang lebih baik.",
            author_name: "Maria L.",
            author_location: "Surabaya",
            submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            status: "approved",
            category: "pekerjaan"
          }
        ]
        
        setTestimonials(mockTestimonials)
      } catch (err) {
        setError("Gagal memuat kesaksian terbaru")
        console.error("Error fetching testimonials:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  if (loading) {
    return (
      <div className={className}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Heart className="w-6 h-6" />
            Kesaksian Terbaru
          </h2>
          <p className="text-muted-foreground">
            Bagaimana Tuhan bekerja dalam hidup pendengar kami
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full mb-4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Heart className="w-6 h-6" />
            Kesaksian Terbaru
          </h2>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-muted-foreground text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (testimonials.length === 0) {
    return (
      <div className={className}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Heart className="w-6 h-6" />
            Kesaksian Terbaru
          </h2>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-muted-foreground text-center">
              Belum ada kesaksian tersedia
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Heart className="w-6 h-6" />
          Kesaksian Terbaru
        </h2>
        <p className="text-muted-foreground">
          Bagaimana Tuhan bekerja dalam hidup pendengar kami
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={{
              id: testimonial.id,
              title: testimonial.title,
              name: testimonial.author_name,
              city: testimonial.author_location,
              content: testimonial.content,
              category: testimonial.category,
              createdAt: testimonial.submitted_at
            }}
            showDate
          />
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link 
          href="/kesaksian" 
          className="text-primary hover:underline font-medium"
        >
          Lihat Semua Kesaksian →
        </Link>
      </div>
    </div>
  )
}