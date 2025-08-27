"use client"

import { AdminLayout } from "@/components/layout"
import { DataTable } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Search, 
  Eye,
  Check,
  X,
  Filter,
  Mail
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

// Admin Partnership Management page
export default function AdminPartnershipPage() {
  // Mock data
  const partnerships = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      partnerType: "sponsor",
      status: "pending",
      createdAt: "2024-12-15T10:00:00Z",
      whatsapp: "+6281234567890"
    }
  ]

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      sponsor: "Sponsor",
      "content-creator": "Content Creator",
      "event-organizer": "Event Organizer",
      ministry: "Ministry Partner",
      business: "Business Partner",
      other: "Lainnya"
    }
    return types[type] || type
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Disetujui'
      case 'rejected': return 'Ditolak'
      default: return 'Menunggu'
    }
  }

  const columns = [
    {
      accessorKey: "name",
      header: "Nama & Kontak",
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">{row.original.email}</p>
          <p className="text-sm text-muted-foreground">{row.original.whatsapp}</p>
        </div>
      )
    },
    {
      accessorKey: "partnerType",
      header: "Jenis Kemitraan",
      cell: ({ row }: any) => (
        <Badge variant="outline">
          {getTypeLabel(row.original.partnerType)}
        </Badge>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {getStatusLabel(row.original.status)}
        </Badge>
      )
    },
    {
      accessorKey: "createdAt",
      header: "Tanggal Daftar",
      cell: ({ row }: any) => {
        const date = new Date(row.original.createdAt)
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
      }
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Mail className="h-4 w-4" />
          </Button>
          {row.original.status === 'pending' && (
            <>
              <Button variant="ghost" size="sm" className="text-green-600">
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive">
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Manajemen Partnership
            </h1>
            <p className="text-muted-foreground">
              Kelola pendaftaran dan kemitraan
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Pendaftar</span>
            </div>
            <p className="text-2xl font-bold mt-2">1</p>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Disetujui</span>
            </div>
            <p className="text-2xl font-bold mt-2">0</p>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <X className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Ditolak</span>
            </div>
            <p className="text-2xl font-bold mt-2">0</p>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Menunggu</span>
            </div>
            <p className="text-2xl font-bold mt-2">1</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari partnership..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter Status
          </Button>
        </div>

        <DataTable columns={columns} data={partnerships} />
      </div>
    </AdminLayout>
  )
}