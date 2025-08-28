"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { HeroLayout } from "@/components/layout"
import { HeroSection } from "@/components/homepage/hero-section"
import { ArticleCard } from "@/components/cards"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  BookOpen, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Loader2
} from "lucide-react"
import { apiClient, isAxiosError } from "@/lib/api/client"

interface Article {
  id: string
  title: string
  slug: string
  published_at: string
  content: string
  status: 'draft' | 'published'
  createdAt: string
  excerpt?: string
  category?: string
  tags?: string[]
  author?: string
  image?: string
}

interface ArticleListState {
  articles: Article[]
  isLoading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  totalItems: number
  searchQuery: string
  isSearching: boolean
}

// Renungan List page: Display paginated list of articles
function RenunganContent() {
  const searchParams = useSearchParams()
  const [state, setState] = useState<ArticleListState>({
    articles: [],
    isLoading: true,
    error: null,
    currentPage: parseInt(searchParams.get('page') || '1'),
    totalPages: 1,
    totalItems: 0,
    searchQuery: searchParams.get('search') || '',
    isSearching: false
  })

  // Fetch articles from API
  const fetchArticles = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setState(prev => ({ 
        ...prev, 
        isLoading: page === 1,
        isSearching: search !== '',
        error: null 
      }))
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sort_by: 'published_at',
        sort_order: 'desc'
      })
      
      if (search) {
        params.append('search', search)
      }
      
      const data = await apiClient.get(`/articles?${params}`)
      
      setState(prev => ({
        ...prev,
        articles: data.data || [],
        currentPage: page,
        totalPages: data.data?.meta?.totalPages || 1,
        totalItems: data.data?.meta?.total || 0,
        searchQuery: search,
        isLoading: false,
        isSearching: false
      }))
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        articles: [],
        isLoading: false,
        isSearching: false,
        error: isAxiosError(error) ? error.response?.data?.message : 'Gagal memuat daftar renungan'
      }))
    }
  }, [])

  // Handle search
  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim()
    setState(prev => ({ ...prev, searchQuery: trimmedQuery }))
    
    // Update URL without causing page refresh
    const newUrl = new URL(window.location.href)
    if (trimmedQuery) {
      newUrl.searchParams.set('search', trimmedQuery)
    } else {
      newUrl.searchParams.delete('search')
    }
    newUrl.searchParams.set('page', '1')
    window.history.replaceState({}, '', newUrl)
    
    fetchArticles(1, trimmedQuery)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > state.totalPages) return
    
    // Update URL
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('page', page.toString())
    window.history.replaceState({}, '', newUrl)
    
    fetchArticles(page, state.searchQuery)
    
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
    fetchArticles(state.currentPage, state.searchQuery)
  }, [fetchArticles, state.currentPage, state.searchQuery])

  // Article skeleton for loading state
  const ArticleSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )

  return (
    <HeroLayout
      heroContent={
        <HeroSection 
          title="Renungan Harian"
          subtitle="Firman yang Membangun"
          description="Perkuat iman Anda dengan renungan-renungan yang membangun dan menginspirasi. Temukan makna mendalam dalam setiap artikel rohani kami."
          showPlayer={false}
          showThemeToggle={false}
          backgroundImage="/devotion-bg.webp"
        />
      }
    >
      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari renungan..."
              value={state.searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              disabled={state.isSearching}
            />
            {state.isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Search Results Info */}
        {state.searchQuery && !state.isLoading && (
          <div className="text-center text-muted-foreground">
            {state.totalItems > 0 ? (
              <p>
                Ditemukan {state.totalItems} renungan untuk &quot;{state.searchQuery}&quot;
              </p>
            ) : (
              <p>
                Tidak ada renungan yang ditemukan untuk &quot;{state.searchQuery}&quot;
              </p>
            )}
          </div>
        )}

        {/* Error State */}
        {state.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {state.error}
              <button 
                className="ml-2 underline"
                onClick={() => fetchArticles(state.currentPage, state.searchQuery)}
              >
                Coba lagi
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {state.isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ArticleSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Articles Grid */}
        {!state.isLoading && state.articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {state.articles.map((article) => (
              <Link key={article.id} href={`/renungan/${article.slug}`}>
                <ArticleCard
                  article={article}
                  className="h-full transition-transform hover:scale-105"
                />
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!state.isLoading && state.articles.length === 0 && !state.error && !state.searchQuery && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Belum Ada Renungan</h3>
            <p className="text-muted-foreground">
              Renungan harian akan segera hadir. Pantau terus untuk update terbaru!
            </p>
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
            ({state.totalItems} total renungan)
          </div>
        )}

        {/* Call to Action */}
        {!state.isLoading && state.articles.length > 0 && (
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-semibold mb-2">Mulai Hari Dengan Renungan</h3>
              <p className="text-muted-foreground mb-4">
                Jadikan renungan harian sebagai bagian dari rutinitas rohani Anda. 
                Setiap artikel ditulis untuk membangun dan menguatkan iman.
              </p>
              <Link href="/live">
                <Button size="lg">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Dengarkan Juga Siaran Live
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </HeroLayout>
  )
}

// Loading component for Suspense boundary
function RenunganLoading() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Renungan Harian</h1>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full max-w-md mx-auto" />
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}

// Main component with Suspense boundary
export default function RenunganPage() {
  return (
    <Suspense fallback={<RenunganLoading />}>
      <RenunganContent />
    </Suspense>
  )
}