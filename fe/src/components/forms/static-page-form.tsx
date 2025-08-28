"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Save, Eye, FileText, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { apiClient, getErrorMessage } from "@/lib/api/client"

interface StaticPageFormData {
  title: string
  slug: string
  content: string
  metaDescription?: string
  status: "draft" | "published"
}

interface StaticPageFormProps {
  pageId?: string
  initialData?: Partial<StaticPageFormData>
  mode?: "create" | "edit"
  onSuccess?: () => void
  onCancel?: () => void
}

// StaticPageForm: Create/edit static page form for admin
export function StaticPageForm({ 
  pageId,
  initialData,
  mode = "create",
  onSuccess,
  onCancel
}: StaticPageFormProps) {
  const [formData, setFormData] = useState<StaticPageFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    metaDescription: initialData?.metaDescription || "",
    status: initialData?.status || "draft"
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(!!pageId && mode === "edit")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isAutoGeneratingSlug, setIsAutoGeneratingSlug] = useState(mode === "create")

  const loadStaticPage = useCallback(async () => {
    try {
      setIsLoadingData(true)
      const data = await apiClient.get(`/pages/${pageId}`)
      setFormData({
        title: data.data?.title || "",
        slug: data.data?.slug || "",
        content: data.data?.content || "",
        metaDescription: data.data?.metaDescription || "",
        status: data.data?.status || "draft"
      })
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Terjadi kesalahan'))
    } finally {
      setIsLoadingData(false)
    }
  }, [pageId])

  // Load page data if in edit mode
  useEffect(() => {
    if (pageId && mode === "edit" && !initialData) {
      loadStaticPage()
    }
  }, [pageId, mode, initialData, loadStaticPage])

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
  const handleInputChange = (field: keyof StaticPageFormData, value: string) => {
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
    setSuccess(false)

    try {
      if (mode === 'create') {
        await apiClient.post('/pages', formData)
      } else {
        await apiClient.put(`/pages/${pageId}`, formData)
      }

      setSuccess(true)
      
      if (onSuccess) {
        onSuccess()
      } else if (mode === 'create') {
        // Reset form if creating new
        setFormData({
          title: "",
          slug: "",
          content: "",
          metaDescription: "",
          status: "draft"
        })
        setIsAutoGeneratingSlug(true)
      }

    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Terjadi kesalahan'))
    } finally {
      setIsLoading(false)
    }
  }

  // Get status variant for badge
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default'
      case 'draft': return 'secondary'
      default: return 'secondary'
    }
  }

  if (isLoadingData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat data halaman...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {mode === 'create' ? 'Buat Halaman Baru' : 'Edit Halaman Statis'}
        </CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'Tambahkan halaman statis baru ke website'
            : 'Edit konten dan informasi halaman statis'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Success Message */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Halaman berhasil {mode === 'create' ? 'dibuat' : 'diperbarui'}!
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
          {/* Status Section */}
          <div className="flex items-center gap-4">
            <Label>Status:</Label>
            <div className="flex items-center gap-3">
              <Badge variant={getStatusVariant(formData.status)}>
                {formData.status === 'published' ? 'Dipublikasi' : 'Draft'}
              </Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(formData.status === 'draft' ? 'published' : 'draft')}
                disabled={isLoading}
              >
                {formData.status === 'draft' ? (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Publikasikan
                  </>
                ) : (
                  'Ubah ke Draft'
                )}
              </Button>
            </div>
          </div>

          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul Halaman *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Contoh: Tentang Kami"
              disabled={isLoading}
              maxLength={200}
              required
            />
          </div>

          {/* Slug Field */}
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">
                /
              </div>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="tentang-kami"
                disabled={isLoading || mode === 'edit'}
                className="rounded-l-none"
                maxLength={100}
                required
              />
            </div>
            {isAutoGeneratingSlug && mode === 'create' && (
              <p className="text-xs text-muted-foreground">
                Slug akan dibuat otomatis dari judul. Klik untuk mengedit manual.
              </p>
            )}
            {mode === 'edit' && (
              <p className="text-xs text-muted-foreground">
                Slug tidak dapat diubah untuk halaman yang sudah ada.
              </p>
            )}
          </div>

          {/* Meta Description Field */}
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              placeholder="Deskripsi singkat untuk mesin pencari (160 karakter maksimal)"
              disabled={isLoading}
              maxLength={160}
              rows={2}
            />
            <div className="text-right text-sm text-muted-foreground">
              {formData.metaDescription?.length || 0}/160 karakter
            </div>
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <Label htmlFor="content">Konten Halaman *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Tuliskan konten halaman di sini..."
              disabled={isLoading}
              rows={12}
              required
              className="min-h-[300px]"
            />
            <div className="text-right text-sm text-muted-foreground">
              {formData.content.length} karakter
            </div>
          </div>

          {/* Preview URL */}
          {formData.slug && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">URL Preview:</h4>
              <code className="text-sm bg-background px-2 py-1 rounded">
                {typeof window !== 'undefined' ? window.location.origin : 'https://example.com'}/{formData.slug}
              </code>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Membuat...' : 'Menyimpan...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === 'create' ? 'Buat Halaman' : 'Simpan Perubahan'}
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Batal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}