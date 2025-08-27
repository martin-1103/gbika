"use client"

import { AdminLayout } from "@/components/layout"
import { DataTable } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Shield,
  Filter
} from "lucide-react"
import Link from "next/link"

// Admin Users Management page
export default function AdminUsersPage() {
  // Mock data
  const users = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@radiogbika.com",
      role: "admin",
      isActive: true,
      lastLogin: "2024-12-20T10:00:00Z"
    }
  ]

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'editor': return 'default'
      case 'broadcaster': return 'secondary'
      default: return 'outline'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator'
      case 'editor': return 'Editor'
      case 'broadcaster': return 'Penyiar'
      default: return role
    }
  }

  const columns = [
    {
      accessorKey: "name",
      header: "Nama & Email",
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">{row.original.email}</p>
        </div>
      )
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }: any) => (
        <Badge variant={getRoleVariant(row.original.role)}>
          {getRoleLabel(row.original.role)}
        </Badge>
      )
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      )
    },
    {
      accessorKey: "lastLogin",
      header: "Login Terakhir",
      cell: ({ row }: any) => (
        row.original.lastLogin 
          ? new Date(row.original.lastLogin).toLocaleDateString('id-ID')
          : 'Belum pernah'
      )
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/users/edit/${row.original.id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Shield className="h-4 w-4" />
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
              <Users className="h-6 w-6" />
              Manajemen User
            </h1>
            <p className="text-muted-foreground">
              Kelola user dan permission sistem
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/users/create">
              <Plus className="mr-2 h-4 w-4" />
              Tambah User
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari user..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter Role
          </Button>
        </div>

        <DataTable columns={columns} data={users} />
      </div>
    </AdminLayout>
  )
}