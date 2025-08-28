"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Save, Eye, FileText, Loader2, AlertCircle } from "lucide-react"
import { apiClient, isAxiosError } from "@/lib/api/client"
import { DateTimeInput, RichTextEditor } from "@/components/ui"

interface ArticleFormData {
  title: string
  slug: string
  content: string
  published_at?: string // Publication datetime
}

interface ArticleFormProps {
  initialData?: Partial<ArticleFormData>
  mode?: "create" | "edit"
  slug?: string
  onSuccess?: () => void
}

// ArticleForm: Create/edit article form with rich text support
export function ArticleForm({ 
  initialData, 
  mode = "create", 
  slug,
  onSuccess 
}: ArticleFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<ArticleFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    published_at: initialData?.published_at ? new Date(initialData.published_at).toISOString().slice(0, 16) : ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAutoGeneratingSlug, setIsAutoGeneratingSlug] = useState(true)

  // Auto-generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  }

  // Handle form input changes
  const handleInputChange = (field: keyof ArticleFormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Auto-generate slug when title changes (only in create mode)
      if (field === 'title' && mode === 'create' && isAutoGeneratingSlug) {
        updated.slug = generateSlug(value)
      }
      
      return updated
    })
    
    // Clear error when user starts typing
    if (error) setError(null)
  }

  // Handle manual slug editing
  const handleSlugChange = (value: string) => {
    setIsAutoGeneratingSlug(false)
    handleInputChange('slug', value)
  }

  // Handle publication date change
  const handlePublishedAtChange = (value: string) => {
    setFormData(prev => ({ ...prev, published_at: value }))
    if (error) setError(null)
  }

  // Submit form with action (save as draft or publish)
  const handleSubmit = async (action: 'save' | 'publish') => {
    setIsLoading(true)
    setError(null)

    try {
      const submitData = {
        ...formData,
        status: action === 'publish' ? (formData.published_at ? 'scheduled' : 'published') : 'draft'
      }

      // If publishing without a date, set current time
      if (action === 'publish' && !formData.published_at) {
        submitData.published_at = new Date().toISOString()
      }
      
      if (mode === 'create') {
        await apiClient.post('/articles', submitData)
      } else {
        await apiClient.put(`/articles/${slug}`, submitData)
      }
      
      // Call success callback or redirect
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/admin/articles')
      }
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError(`An error occurred while ${mode === 'create' ? 'creating' : 'updating'} the article`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Check if form is valid
  const isFormValid = formData.title.trim() !== '' && 
                     formData.slug.trim() !== '' && 
                     formData.content.trim() !== ''

  // Get current article status for display
  const getArticleStatus = () => {
    if (!initialData) return 'Draft Baru'
    
    if (initialData.status === 'published') {
      return 'Dipublikasikan'
    } else if (initialData.status === 'scheduled') {
      return 'Terjadwal'
    }
    return 'Draft'
  }

  // Get badge variant for status
  const getStatusBadgeVariant = () => {
    if (!initialData) return 'secondary'
    
    if (initialData.status === 'published') return 'default'
    if (initialData.status === 'scheduled') return 'outline'
    return 'secondary'
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>
                {mode === 'create' ? 'Buat Artikel Baru' : 'Edit Artikel'}
              </CardTitle>
              <CardDescription>
                {mode === 'create' 
                  ? 'Tulis dan publikasikan artikel untuk pembaca' 
                  : 'Perbarui konten artikel yang sudah ada'
                }
              </CardDescription>
            </div>
          </div>
          <Badge variant={getStatusBadgeVariant()}>
            {getArticleStatus()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul Artikel *</Label>
            <Input
              id="title"
              placeholder="Masukkan judul artikel..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              disabled={isLoading}
              required
              className="text-lg"
            />
          </div>

          {/* Slug Field */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug URL *</Label>
            <Input
              id="slug"
              placeholder="artikel-slug-url"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              disabled={isLoading || (mode === 'edit')}
              required
              pattern="^[a-z0-9-]+$"
              title="Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung"
            />
            {mode === 'create' && isAutoGeneratingSlug && (
              <p className="text-sm text-muted-foreground">
                Slug akan dibuat otomatis dari judul. Anda bisa mengubahnya secara manual.
              </p>
            )}
            {mode === 'edit' && (
              <p className="text-sm text-muted-foreground">
                Slug tidak dapat diubah setelah artikel dibuat.
              </p>
            )}
          </div>

          <Separator />

          {/* Content Field */}
          <div className="space-y-2">
            <Label htmlFor="content">Konten Artikel *</Label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => handleInputChange('content', value)}
              disabled={isLoading}
              placeholder="Tulis konten artikel di sini..."
              height={500}
            />
          </div>

          <Separator />

          {/* Publication Time Setting */}
          <div className="space-y-2">
            <Label htmlFor="published_at">Waktu Publikasi (Opsional)</Label>
            <DateTimeInput
              id="published_at"
              value={formData.published_at}
              onChange={handlePublishedAtChange}
              disabled={isLoading}
              min={new Date(Date.now() + 5 * 60 * 1000).toISOString()}
            />
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Batal
            </Button>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit('save')}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Draft
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                onClick={() => handleSubmit('publish')}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memublikasikan...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    {formData.published_at ? 'Jadwalkan' : 'Publikasikan'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}