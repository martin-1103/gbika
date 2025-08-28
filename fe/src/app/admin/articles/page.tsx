"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AdminLayout } from "@/components/layout"
import { DataTable } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  AlertCircle,
  Loader2,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { apiClient } from "@/lib/api/client"

interface Article {
  id: string
  title: string
  slug: string
  status: "draft" | "published" | "scheduled"
  published_at?: string
  createdAt: string
  updatedAt: string
}

interface ArticlesState {
  articles: Article[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  currentPage: number
  totalPages: number
  totalItems: number
}

// Admin Articles Management page
export default function AdminArticlesPage() {
  const [state, setState] = useState<ArticlesState>({
    articles: [],
    isLoading: true,
    error: null,
    searchQuery: "",
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  })

  // Fetch articles with admin privileges
  const fetchArticles = async (page: number = 1, search: string = "") => {
    try {
      setState(prev => ({ 
        ...prev, 
        isLoading: page === 1,
        error: null 
      }))
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        sort_by: "updatedAt",
        sort_order: "desc",
        admin: "true" // Include draft articles
      })
      
      if (search) {
        params.append('search', search)
      }
      
      const response = await apiClient.get(`/articles?${params}`)
      
      setState(prev => ({
        ...prev,
        articles: response.data.data || [],
        currentPage: page,
        totalPages: response.data.meta?.totalPages || 1,
        totalItems: response.data.meta?.total || 0,
        searchQuery: search,
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        articles: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan'
      }))
    }
  }

  // Delete article
  const deleteArticle = async (slug: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus renungan ini?')) {
      return
    }

    try {
      await apiClient.delete(`/articles/${slug}`)

      // Refresh articles list
      fetchArticles(state.currentPage, state.searchQuery)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Gagal menghapus renungan'
      }))
    }
  }

  // Handle search
  const handleSearch = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }))
    fetchArticles(1, query)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchArticles(page, state.searchQuery)
  }

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'published': return 'default'
      case 'scheduled': return 'outline'
      default: return 'secondary'
    }
  }

  // Get status label
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'published': return 'Dipublikasi'
      case 'scheduled': return 'Terjadwal'
      default: return 'Draft'
    }
  }

  // Table columns
  const columns = [
    {
      key: "title",
      title: "Judul",
      dataIndex: "title" as keyof Article,
      render: (_: unknown, record: Article) => (
        <div className="max-w-[300px]">
          <p className="font-medium truncate">{record.title}</p>
          <p className="text-sm text-muted-foreground">/{record.slug}</p>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status" as keyof Article,
      render: (_: unknown, record: Article) => (
        <Badge variant={getStatusVariant(record.status)}>
          {getStatusLabel(record.status)}
        </Badge>
      ),
    },
    {
      key: "published_at",
      title: "Tanggal Publikasi",
      dataIndex: "published_at" as keyof Article,
      render: (_: unknown, record: Article) => {
        if (!record.published_at) {
          return <span className="text-muted-foreground">-</span>
        }
        
        const date = new Date(record.published_at)
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          return <span className="text-muted-foreground">Invalid date</span>
        }
        
        return (
          <div>
            <p className="text-sm">
              {date.toLocaleDateString('id-ID')}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true, locale: id })}
            </p>
          </div>
        )
      },
    },
    {
      key: "updatedAt",
      title: "Terakhir Diubah",
      dataIndex: "updatedAt" as keyof Article,
      render: (_: unknown, record: Article) => {
        const date = new Date(record.updatedAt)
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          return <span className="text-muted-foreground">Invalid date</span>
        }
        
        return (
          <div>
            <p className="text-sm">
              {date.toLocaleDateString('id-ID')}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true, locale: id })}
            </p>
          </div>
        )
      },
    },
    {
      key: "actions",
      title: "Aksi",
      render: (_: unknown, record: Article) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/renungan/${record.slug}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                Lihat
              </DropdownMenuItem>
            </Link>
            <Link href={`/admin/articles/edit/${record.slug}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => deleteArticle(record.slug)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  // Load articles on mount
  useEffect(() => {
    fetchArticles()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <span>Manajemen Renungan</span>
            </h1>
            <p className="text-muted-foreground">
              Kelola renungan harian website
            </p>
          </div>
          
          <Link href="/admin/articles/edit">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Renungan Baru
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Renungan</span>
            </div>
            <p className="text-2xl font-bold mt-2">{state.totalItems}</p>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Dipublikasi</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {state.articles.filter(a => a.status === 'published').length}
            </p>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Draft</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {state.articles.filter(a => a.status === 'draft').length}
            </p>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Bulan Ini</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {state.articles.filter(a => {
                const date = new Date(a.createdAt)
                const now = new Date()
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
              }).length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari renungan..."
              value={state.searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Error Alert */}
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

        {/* Articles Table */}
        <div className="border rounded-lg">
          {state.isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Memuat renungan...</span>
            </div>
          ) : state.articles.length > 0 ? (
            <DataTable
              columns={columns}
              data={state.articles}
              pagination={{
                current: state.currentPage,
                pageSize: 10,
                total: state.totalItems
              }}
              onPaginationChange={(newPagination) => {
                handlePageChange(newPagination.current)
              }}
            />
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                {state.searchQuery ? 'Renungan tidak ditemukan' : 'Belum ada renungan'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {state.searchQuery 
                  ? `Tidak ada renungan yang cocok dengan "${state.searchQuery}"`
                  : 'Mulai dengan membuat renungan pertama Anda.'
                }
              </p>
              <Link href="/admin/articles/edit">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Renungan Pertama
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}