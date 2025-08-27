"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { PublicLayout } from "@/components/layout"
import { TestimonialCard } from "@/components/cards"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Loader2,
  Heart,
  Plus
} from "lucide-react"

interface Testimonial {
  id: string
  name: string
  city?: string
  title: string
  content: string
}

interface TestimonialListState {
  testimonials: Testimonial[]
  isLoading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalItems: number
}

// Testimonials List page: Display approved testimonials with pagination
export default function TestimonialsPage() {
  const searchParams = useSearchParams()
  const [state, setState] = useState<TestimonialListState>({
    testimonials: [],
    isLoading: true,
    error: null,
    currentPage: parseInt(searchParams.get('page') || '1'),
    totalPages: 1,
    totalItems: 0
  })

  // Fetch testimonials from API
  const fetchTestimonials = async (page: number = 1) => {
    try {
      setState(prev => ({ 
        ...prev, 
        isLoading: page === 1,
        error: null 
      }))
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9' // 3x3 grid
      })
      
      const response = await fetch(`/api/testimonials?${params}`)
      
      if (!response.ok) {
        throw new Error('Gagal memuat daftar kesaksian')
      }
      
      const data = await response.json()
      
      setState(prev => ({
        ...prev,
        testimonials: data.data || [],
        currentPage: page,
        totalPages: data.meta?.totalPages || 1,
        totalItems: data.meta?.total || 0,
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        testimonials: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan'
      }))
    }
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > state.totalPages) return
    
    // Update URL
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('page', page.toString())
    window.history.replaceState({}, '', newUrl)
    
    fetchTestimonials(page)
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const delta = 2 // Show 2 pages on each side of current page
    const start = Math.max(1, state.currentPage - delta)
    const end = Math.min(state.totalPages, state.currentPage + delta)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }

  // Load initial data
  useEffect(() => {
    fetchTestimonials(state.currentPage)
  }, [])

  // Testimonial skeleton for loading state
  const TestimonialSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Kesaksian</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Baca kisah-kisah luar biasa tentang bagaimana Tuhan bekerja dalam 
            kehidupan para pendengar Radio Gbika. Mari bersama bersyukur 
            atas kasih dan mujizat-Nya.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 text-center">
          <div className="max-w-2xl mx-auto">
            <Heart className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Punya Kesaksian?</h3>
            <p className="text-muted-foreground mb-4">
              Bagikan pengalaman luar biasa Anda dengan Tuhan untuk menguatkan iman saudara seiman lainnya.
            </p>
            <Link href="/kesaksian/kirim">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Kirim Kesaksian
              </Button>
            </Link>
          </div>
        </div>

        {/* Error State */}
        {state.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {state.error}
              <button 
                className="ml-2 underline"
                onClick={() => fetchTestimonials(state.currentPage)}
              >
                Coba lagi
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {state.isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <TestimonialSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Testimonials Grid */}
        {!state.isLoading && state.testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                name={testimonial.name}
                city={testimonial.city}
                title={testimonial.title}
                content={testimonial.content}
                className="h-full"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!state.isLoading && state.testimonials.length === 0 && !state.error && (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Belum Ada Kesaksian</h3>
            <p className="text-muted-foreground mb-6">
              Jadilah yang pertama membagikan kesaksian Anda tentang kebaikan Tuhan.
            </p>
            <Link href="/kesaksian/kirim">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Kirim Kesaksian Pertama
              </Button>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {!state.isLoading && state.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(state.currentPage - 1)}
              disabled={state.currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </Button>
            
            {getPageNumbers().map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === state.currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(state.currentPage + 1)}
              disabled={state.currentPage >= state.totalPages}
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Pagination Info */}
        {!state.isLoading && state.totalItems > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Menampilkan halaman {state.currentPage} dari {state.totalPages} 
            ({state.totalItems} total kesaksian)
          </div>
        )}

        {/* Bottom Inspiration */}
        {!state.isLoading && state.testimonials.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-2xl font-semibold mb-2">Kuasa Kesaksian</h3>
              <p className="text-muted-foreground mb-4">
                "Dan mereka mengalahkan dia oleh darah Anak Domba dan oleh perkataan kesaksian mereka..." 
                - Wahyu 12:11
              </p>
              <p className="text-sm text-muted-foreground">
                Setiap kesaksian adalah kemenangan atas kegelapan dan bukti nyata kasih Tuhan yang tak berujung.
              </p>
            </div>
          </div>
        )}

        {/* Additional Call to Action */}
        {!state.isLoading && state.testimonials.length > 0 && (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Terinspirasi oleh kesaksian-kesaksian di atas?
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/kesaksian/kirim">
                <Button variant="default">
                  <Plus className="mr-2 h-4 w-4" />
                  Bagikan Kesaksian Anda
                </Button>
              </Link>
              <Link href="/layanan/doa">
                <Button variant="outline">
                  <Heart className="mr-2 h-4 w-4" />
                  Kirim Permintaan Doa
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}