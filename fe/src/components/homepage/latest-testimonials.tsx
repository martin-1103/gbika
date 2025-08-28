"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TestimonialCard } from "@/components/cards"
import { Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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

// LatestTestimonials: Display recent approved testimonials in carousel format
export function LatestTestimonials({ className }: LatestTestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

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
            content: "Melalui Radio El-Shaddai FM, kami belajar untuk saling mengampuni dan membangun kembali hubungan yang rusak. Sekarang keluarga kami hidup dalam damai dan kasih Kristus.",
            author_name: "Sarah M.",
            author_location: "Jakarta",
            submitted_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
            status: "approved",
            category: "keluarga"
          },
          {
            id: "2",
            title: "Mukjizat Penyembuhan",
            content: "Setelah mendengarkan doa syafaat di Radio El-Shaddai FM, kondisi kesehatan saya berangsur membaik. Dokter pun heran dengan kemajuan yang pesat. Puji Tuhan!",
            author_name: "Budi S.",
            author_location: "Bandung",
            submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            status: "approved",
            category: "kesehatan"
          },
          {
            id: "3",
            title: "Pekerjaan Baru di Masa Sulit",
            content: "Di tengah pandemi, saya kehilangan pekerjaan. Namun setelah bergabung dalam doa bersama Radio El-Shaddai FM, Tuhan membuka pintu pekerjaan yang lebih baik.",
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

  // Navigate to next testimonial
  const nextTestimonial = () => {
    if (isAnimating || testimonials.length === 0) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setTimeout(() => setIsAnimating(false), 5000)
  }

  // Navigate to previous testimonial
  const prevTestimonial = () => {
    if (isAnimating || testimonials.length === 0) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setTimeout(() => setIsAnimating(false), 5000)
  }

  // Auto-play carousel
  useEffect(() => {
    if (testimonials.length === 0) return
    
    const interval = setInterval(() => {
      nextTestimonial()
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [testimonials.length, isAnimating])

  if (loading) {
    return (
      <section className="w-full bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <Skeleton className="h-8 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-32 w-full mb-8" />
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600 text-lg">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section className="w-full bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600 text-lg">
              Belum ada kesaksian tersedia
            </p>
          </div>
        </div>
      </section>
    )
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="w-full bg-gradient-to-br from-slate-50 to-blue-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Testimonial Content - Simple Text Only */}
        <div className="text-center mb-12">
          <div 
            className={`transition-all duration-[5000ms] ease-in-out ${
              isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
            }`}
          >
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                {currentTestimonial?.title}
              </h3>
              <blockquote className="text-xl text-gray-700 leading-relaxed italic mb-8">
                "{currentTestimonial?.content}"
              </blockquote>
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="text-center">
                <p className="font-semibold text-gray-900 text-lg">
                  {currentTestimonial?.author_name}
                </p>
                {currentTestimonial?.author_location && (
                  <p className="text-gray-600">
                    {currentTestimonial.author_location}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>


        
        {/* Link to All Testimonials */}
        <div className="text-center">
          <Link 
            href="/kesaksian" 
            className="text-blue-600 hover:text-blue-800 text-sm hover:underline transition-colors"
          >
            Lihat Semua Kesaksian
          </Link>
        </div>
      </div>
    </section>
  )
}