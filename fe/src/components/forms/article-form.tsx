"use client"

import { useState, useEffect } from "react"
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

interface ArticleFormData {
  title: string
  slug: string
  content: string
  status: "draft" | "published"
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
    status: initialData?.status || "draft"
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

  // Handle status change
  const handleStatusChange = (status: "draft" | "published") => {
    setFormData(prev => ({ ...prev, status }))
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const endpoint = mode === 'create' 
        ? '/api/articles' 
        : `/api/articles/${slug}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to ${mode} article`)
      }

      const data = await response.json()
      
      // Call success callback or redirect
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/admin/articles')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `An error occurred while ${mode === 'create' ? 'creating' : 'updating'} the article`)
    } finally {
      setIsLoading(false)
    }
  }

  // Check if form is valid
  const isFormValid = formData.title.trim() !== '' && 
                     formData.slug.trim() !== '' && 
                     formData.content.trim() !== ''

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    return status === 'published' ? 'default' : 'secondary'
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
          <Badge variant={getStatusVariant(formData.status)}>
            {formData.status === 'published' ? 'Dipublikasikan' : 'Draft'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Textarea
              id="content"
              placeholder="Tulis konten artikel di sini..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              disabled={isLoading}
              required
              className="min-h-[400px] resize-y"
            />
            <p className="text-sm text-muted-foreground">
              Mendukung format teks biasa. Rich text editor akan ditambahkan di versi mendatang.
            </p>
          </div>

          <Separator />

          {/* Status Selection */}
          <div className="space-y-3">
            <Label>Status Publikasi</Label>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={formData.status === 'draft' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('draft')}
                disabled={isLoading}
              >
                <Eye className="mr-2 h-4 w-4" />
                Simpan sebagai Draft
              </Button>
              <Button
                type="button"
                variant={formData.status === 'published' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange('published')}
                disabled={isLoading}
              >
                <FileText className="mr-2 h-4 w-4" />
                Publikasikan
              </Button>
            </div>
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
            
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Membuat...' : 'Memperbarui...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === 'create' ? 'Buat Artikel' : 'Perbarui Artikel'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}