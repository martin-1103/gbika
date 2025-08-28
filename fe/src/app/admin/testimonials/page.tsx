"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layout"
import { DataTable, DataTableColumn } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MessageSquare,
  Search,
  Check,
  X,
  Eye,
  Calendar,
  AlertCircle,
  Loader2,
  MoreHorizontal,
  Filter
} from "lucide-react"
import { apiClient, getErrorMessage } from "@/lib/api/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

interface Testimonial {
  id: string
  name: string
  email: string
  city?: string
  title: string
  content: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

interface TestimonialsState {
  testimonials: Testimonial[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  statusFilter: string
  currentPage: number
  totalPages: number
  totalItems: number
}

// Admin Testimonials Management page
export default function AdminTestimonialsPage() {
  const [state, setState] = useState<TestimonialsState>({
    testimonials: [],
    isLoading: true,
    error: null,
    searchQuery: "",
    statusFilter: "all",
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  })

  // Fetch testimonials with admin privileges
  const fetchTestimonials = async (page: number = 1, search: string = "", status: string = "all") => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: page === 1,
        error: null
      }))

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        admin: "true" // Include all statuses
      })

      if (search) {
        params.append('search', search)
      }

      if (status !== "all") {
        params.append('status', status)
      }

      const data = await apiClient.get(`/testimonials?${params}`)

      setState(prev => ({
        ...prev,
        testimonials: data.data || [],
        currentPage: page,
        totalPages: data.data?.meta?.totalPages || 1,
        totalItems: data.data?.meta?.total || 0,
        searchQuery: search,
        statusFilter: status,
        isLoading: false
      }))
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        testimonials: [],
        isLoading: false,
        error: getErrorMessage(error, 'Gagal memuat daftar kesaksian')
      }))
    }
  }

  // Moderate testimonial (approve/reject)
  const moderateTestimonial = async (id: string, action: "approve" | "reject") => {
    try {
      await apiClient.post(`/testimonials/${id}/moderate`, {
        status: action === "approve" ? "approved" : "rejected"
      })

      // Refresh testimonials list
      fetchTestimonials(state.currentPage, state.searchQuery, state.statusFilter)
    } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        error: getErrorMessage(error, `Gagal ${action === "approve" ? "menyetujui" : "menolak"} kesaksian`)
      }))
    }
  }

  // Handle search
  const handleSearch = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }))
    fetchTestimonials(1, query, state.statusFilter)
  }

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setState(prev => ({ ...prev, statusFilter: status }))
    fetchTestimonials(1, state.searchQuery, status)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchTestimonials(page, state.searchQuery, state.statusFilter)
  }

  // Get status badge variant
  const getStatusVariant = (status: Testimonial['status']) => {
    switch (status) {
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      default: return 'secondary'
    }
  }

  // Get status label
  const getStatusLabel = (status: Testimonial['status']) => {
    switch (status) {
      case 'approved': return 'Disetujui'
      case 'rejected': return 'Ditolak'
      default: return 'Menunggu'
    }
  }

  // Table columns
  const columns: DataTableColumn<Testimonial>[] = [
    {
      key: "title",
      title: "Judul & Pengirim",
      render: (_, record) => (
        <div className="max-w-[300px]">
          <p className="font-medium truncate">{record.title}</p>
          <p className="text-sm text-muted-foreground">
            {record.name}
            {record.city && ` • ${record.city}`}
          </p>
        </div>
      ),
    },
    {
      key: "content",
      title: "Isi Kesaksian",
      render: (_, record) => (
        <div className="max-w-[400px]">
          <p className="text-sm line-clamp-3">
            {record.content}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (_, record) => (
        <Badge variant={getStatusVariant(record.status)}>
          {getStatusLabel(record.status)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      title: "Tanggal Kirim",
      render: (_, record) => {
        const date = new Date(record.createdAt)
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
      render: (_, record) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => {
                alert(`Judul: ${record.title}\n\nIsi: ${record.content}\n\nPengirim: ${record.name}\nEmail: ${record.email}${record.city ? `\nKota: ${record.city}` : ''}`)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Lihat Detail
            </DropdownMenuItem>
            
            {record.status === "pending" && (
              <>
                <DropdownMenuItem 
                  className="cursor-pointer text-green-600 focus:text-green-600"
                  onClick={() => moderateTestimonial(record.id, "approve")}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Setujui
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => moderateTestimonial(record.id, "reject")}
                >
                  <X className="mr-2 h-4 w-4" />
                  Tolak
                </DropdownMenuItem>
              </>
            )}
            
            {record.status === "approved" && (
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => moderateTestimonial(record.id, "reject")}
              >
                <X className="mr-2 h-4 w-4" />
                Batalkan Persetujuan
              </DropdownMenuItem>
            )}
            
            {record.status === "rejected" && (
              <DropdownMenuItem 
                className="cursor-pointer text-green-600 focus:text-green-600"
                onClick={() => moderateTestimonial(record.id, "approve")}
              >
                <Check className="mr-2 h-4 w-4" />
                Setujui
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  // Load testimonials on mount
  useEffect(() => {
    fetchTestimonials()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <MessageSquare className="h-6 w-6" />
            <span>Manajemen Kesaksian</span>
          </h1>
          <p className="text-muted-foreground">
            Moderasi dan kelola kesaksian dari pendengar
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Kesaksian</span>
            </div>
            <p className="text-2xl font-bold mt-2">{state.totalItems}</p>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Disetujui</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {state.testimonials.filter(t => t.status === 'approved').length}
            </p>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Menunggu</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {state.testimonials.filter(t => t.status === 'pending').length}
            </p>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <X className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Ditolak</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {state.testimonials.filter(t => t.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kesaksian..."
              value={state.searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={state.statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Error Alert */}
        {state.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {state.error}
              <button 
                className="ml-2 underline"
                onClick={() => fetchTestimonials(state.currentPage, state.searchQuery, state.statusFilter)}
              >
                Coba lagi
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Testimonials Table */}
        <div className="border rounded-lg">
          {state.isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Memuat kesaksian...</span>
            </div>
          ) : state.testimonials.length > 0 ? (
            <DataTable
              columns={columns}
              data={state.testimonials}
              pagination={{
                current: state.currentPage,
                pageSize: 20,
                total: state.totalItems
              }}
              onPaginationChange={(newPagination) => {
                handlePageChange(newPagination.current)
              }}
            />
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                {state.searchQuery || state.statusFilter !== "all" 
                  ? 'Kesaksian tidak ditemukan' 
                  : 'Belum ada kesaksian'
                }
              </h3>
              <p className="text-muted-foreground">
                {state.searchQuery 
                  ? `Tidak ada kesaksian yang cocok dengan "${state.searchQuery}"`
                  : 'Kesaksian dari pendengar akan muncul di sini untuk dimoderasi.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions for Pending */}
        {state.testimonials.some(t => t.status === 'pending') && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-yellow-800">
                  Ada {state.testimonials.filter(t => t.status === 'pending').length} kesaksian menunggu moderasi
                </h3>
                <p className="text-sm text-yellow-700">
                  Kesaksian yang disetujui akan ditampilkan di halaman publik website.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
