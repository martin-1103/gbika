"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layout"
import { ArticleForm } from "@/components/forms"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  FileText, 
  ArrowLeft, 
  AlertCircle,
  Loader2
} from "lucide-react"
import { apiClient } from "@/lib/api/client"

interface ArticleData {
  id: string
  title: string
  slug: string
  content: string
  status: "draft" | "published"
}

interface EditArticleState {
  article: ArticleData | null
  isLoading: boolean
  error: string | null
  mode: "create" | "edit"
}

// Admin Article Edit/Create page
export default function AdminArticleEditPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug?.[0] // Optional catch-all route
  
  const [state, setState] = useState<EditArticleState>({
    article: null,
    isLoading: !!slug, // Only load if editing
    error: null,
    mode: slug ? "edit" : "create"
  })

  // Fetch article data for editing
  const fetchArticle = async (articleSlug: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const article = await apiClient.get(`/api/articles/${articleSlug}`)
      
      setState(prev => ({
        ...prev,
        article: article.data,
        isLoading: false,
        error: null
      }))
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { status?: number; data?: { message?: string } } }).response?.status === 404
            ? 'Artikel tidak ditemukan'
            : (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Gagal memuat artikel'
          : 'Gagal memuat artikel'
      
      setState(prev => ({
        ...prev,
        article: null,
        isLoading: false,
        error: errorMessage
      }))
    }
  }

  // Handle successful form submission
  const handleSuccess = () => {
    router.push('/admin/articles')
  }

  // Load article data if editing
  useEffect(() => {
    if (slug && state.mode === "edit") {
      fetchArticle(slug)
    }
  }, [slug, state.mode])

  // Loading skeleton for edit mode
  const FormSkeleton = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali</span>
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold flex items-center space-x-2">
                <FileText className="h-6 w-6" />
                <span>
                  {state.mode === "create" ? "Buat Artikel Baru" : "Edit Artikel"}
                </span>
              </h1>
              <p className="text-muted-foreground">
                {state.mode === "create" 
                  ? "Tulis dan publikasikan artikel atau renungan baru"
                  : `Edit artikel: ${state.article?.title || slug}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {state.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {state.error}
              {slug && (
                <button 
                  className="ml-2 underline"
                  onClick={() => fetchArticle(slug)}
                >
                  Coba lagi
                </button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State for Edit Mode */}
        {state.isLoading && state.mode === "edit" && (
          <div className="space-y-6">
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Memuat artikel...</span>
            </div>
            <FormSkeleton />
          </div>
        )}

        {/* Article Form */}
        {!state.isLoading && (state.mode === "create" || state.article) && (
          <div className="max-w-none">
            <ArticleForm
              mode={state.mode}
              slug={slug}
              initialData={state.article || undefined}
              onSuccess={handleSuccess}
            />
          </div>
        )}

        {/* Not Found State */}
        {!state.isLoading && state.mode === "edit" && !state.article && !state.error && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Artikel Tidak Ditemukan</h3>
            <p className="text-muted-foreground mb-6">
              Artikel dengan slug &quot;{slug}&quot; tidak dapat ditemukan.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/admin/articles')}
              >
                Kembali ke Daftar Artikel
              </Button>
              <Button onClick={() => router.push('/admin/articles/edit')}>
                Buat Artikel Baru
              </Button>
            </div>
          </div>
        )}

        {/* Tips for Writing */}
        {(state.mode === "create" || state.article) && !state.isLoading && (
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold mb-3">💡 Tips Menulis Artikel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• Gunakan judul yang menarik dan deskriptif</li>
                <li>• Mulai dengan paragraf pembuka yang kuat</li>
                <li>• Gunakan sub-heading untuk struktur yang jelas</li>
                <li>• Sertakan ayat Alkitab yang relevan</li>
              </ul>
              <ul className="space-y-1">
                <li>• Gunakan bahasa yang mudah dipahami</li>
                <li>• Berikan contoh praktis dalam kehidupan</li>
                <li>• Akhiri dengan doa atau refleksi</li>
                <li>• Periksa tata bahasa sebelum menyimpan</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}