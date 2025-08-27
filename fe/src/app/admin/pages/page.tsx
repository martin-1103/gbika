"use client"

import { AdminLayout } from "@/components/layout"
import { DataTable } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter
} from "lucide-react"
import Link from "next/link"

// Admin Static Pages Management page
export default function AdminPagesPage() {
  // Mock data
  const pages = [
    {
      id: "1",
      title: "Tentang Kami",
      slug: "tentang-kami",
      status: "published",
      updatedAt: "2024-12-20T10:00:00Z"
    }
  ]

  const columns = [
    {
      accessorKey: "title",
      header: "Judul Halaman",
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-sm text-muted-foreground">/{row.original.slug}</p>
        </div>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={row.original.status === "published" ? "default" : "secondary"}>
          {row.original.status === "published" ? "Dipublikasi" : "Draft"}
        </Badge>
      )
    },
    {
      accessorKey: "updatedAt",
      header: "Terakhir Diupdate",
      cell: ({ row }: any) => (
        new Date(row.original.updatedAt).toLocaleDateString('id-ID')
      )
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${row.original.slug}`} target="_blank">
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/pages/edit/${row.original.id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
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
              <FileText className="h-6 w-6" />
              Manajemen Halaman Statis
            </h1>
            <p className="text-muted-foreground">
              Kelola halaman statis website
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/pages/create">
              <Plus className="mr-2 h-4 w-4" />
              Buat Halaman
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari halaman..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <DataTable columns={columns} data={pages} />
      </div>
    </AdminLayout>
  )
}