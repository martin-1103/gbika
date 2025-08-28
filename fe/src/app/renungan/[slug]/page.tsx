"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { PublicLayout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  BookOpen, 
  Calendar, 
  ArrowLeft, 
  Share2, 
  Heart, 
  MessageCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { apiClient, isAxiosError } from "@/lib/api/client"

interface Article {
  id: string
  title: string
  slug: string
  content: string
  status: string
  published_at: string
}

interface ArticleDetailState {
  article: Article | null
  isLoading: boolean
  error: string | null
  relatedArticles: Article[]
  isLoadingRelated: boolean
}

// Article Detail page: Display full article content
export default function RenunganDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [state, setState] = useState<ArticleDetailState>({
    article: null,
    isLoading: true,
    error: null,
    relatedArticles: [],
    isLoadingRelated: true
  })

  // Fetch related articles
  const fetchRelatedArticles = useCallback(async () => {
    try {
      const data = await apiClient.get('/articles?limit=4&sort_by=published_at&sort_order=desc')
      
      setState(prev => ({
        ...prev,
        relatedArticles: (data.data || []).filter((article: Article) => article.slug !== slug).slice(0, 3),
        isLoadingRelated: false
      }))
    } catch {
      setState(prev => ({ ...prev, isLoadingRelated: false }))
    }
  }, [slug])

  // Fetch article by slug
  const fetchArticle = useCallback(async (articleSlug: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const article = await apiClient.get(`/api/articles/${articleSlug}`)
      
      setState(prev => ({
        ...prev,
        article: article.data,
        isLoading: false,
        error: null
      }))
      
      // Load related articles
      fetchRelatedArticles()
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        article: null,
        isLoading: false,
        error: isAxiosError(error) && error.response?.status === 404 ? 'Renungan tidak ditemukan' : 
               isAxiosError(error) ? error.response?.data?.message : 'Gagal memuat renungan'
      }))
    }
  }, [fetchRelatedArticles])

  // Share article
  const shareArticle = async () => {
    const url = window.location.href
    const title = state.article?.title || 'Renungan Harian'
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
          text: `Baca renungan: ${title}`
        })
      } catch {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        // Could show a toast notification here
      } catch {
        // Fallback failed
      }
    }
  }

  // Format article content with basic styling
  const formatContent = (content: string) => {
    // Simple paragraph breaks
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed text-justify">
        {paragraph.trim()}
      </p>
    ))
  }

  // Format published date
  const formatPublishedDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return {
        full: date.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        relative: formatDistanceToNow(date, { 
          addSuffix: true,
          locale: id 
        })
      }
    } catch {
      return { full: 'Tanggal tidak valid', relative: '' }
    }
  }

  // Load article on component mount or slug change
  useEffect(() => {
    if (slug) {
      fetchArticle(slug)
    }
  }, [slug, fetchArticle])

  // Loading skeleton
  const ContentSkeleton = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Separator />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali</span>
          </Button>
        </div>

        {/* Error State */}
        {state.error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {state.error}
              <button 
                className="ml-2 underline"
                onClick={() => fetchArticle(slug)}
              >
                Coba lagi
              </button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {state.isLoading ? (
              <Card>
                <CardContent className="p-8">
                  <ContentSkeleton />
                </CardContent>
              </Card>
            ) : state.article ? (
              <Card>
                <CardContent className="p-8">
                  {/* Article Header */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <Badge variant="secondary">Renungan Harian</Badge>
                    </div>
                    
                    <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                      {state.article.title}
                    </h1>
                    
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {formatPublishedDate(state.article.published_at).full}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {formatPublishedDate(state.article.published_at).relative}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={shareArticle}
                        className="flex items-center space-x-1"
                      >
                        <Share2 className="h-3 w-3" />
                        <span>Bagikan</span>
                      </Button>
                    </div>
                  </div>

                  <Separator className="mb-8" />

                  {/* Article Content */}
                  <div className="prose prose-lg max-w-none">
                    <div className="text-lg leading-relaxed text-gray-800">
                      {formatContent(state.article.content)}
                    </div>
                  </div>

                  <Separator className="mt-8 mb-6" />

                  {/* Article Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost" 
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Sukai</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm" 
                        className="flex items-center space-x-1"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Komentar</span>
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={shareArticle}
                      className="flex items-center space-x-1"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Bagikan</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-4">
              {/* Related Articles */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Renungan Lainnya</span>
                  </h3>
                  
                  {state.isLoadingRelated ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {state.relatedArticles.map((article) => (
                        <Link 
                          key={article.id} 
                          href={`/renungan/${article.slug}`}
                          className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <h4 className="font-medium text-sm mb-1 line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatPublishedDate(article.published_at).relative}
                          </p>
                        </Link>
                      ))}
                      
                      {state.relatedArticles.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Belum ada renungan lainnya
                        </p>
                      )}
                    </div>
                  )}
                  
                  <Separator className="my-4" />
                  
                  <Link href="/renungan">
                    <Button variant="outline" size="sm" className="w-full">
                      Lihat Semua Renungan
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Navigation */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Navigasi Cepat</h3>
                  <div className="space-y-2">
                    <Link href="/live">
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Dengarkan Live
                      </Button>
                    </Link>
                    <Link href="/program">
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Jadwal Program
                      </Button>
                    </Link>
                    <Link href="/kesaksian">
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Kesaksian
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        {state.article && (
          <div className="mt-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={() => router.back()}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Kembali ke Daftar
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Link href="/renungan">
                      <Button variant="default">
                        Renungan Lainnya
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
