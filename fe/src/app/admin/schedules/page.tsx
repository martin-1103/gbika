"use client"

import { AdminLayout } from "@/components/layout"
import { DataTable } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Search, 
  Plus,
  Clock,
  Edit,
  Trash2,
  Filter
} from "lucide-react"
import Link from "next/link"

// Admin Schedules Management page
export default function AdminSchedulesPage() {
  // Mock data - would be fetched from API
  const schedules = [
    {
      id: "1",
      title: "Renungan Fajar",
      day: "monday",
      startTime: "06:00",
      endTime: "08:00",
      presenter: "Pdt. Sarah Johnson",
      category: "renungan",
      isActive: true
    }
  ]

  const columns = [
    {
      accessorKey: "title",
      header: "Program",
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-sm text-muted-foreground">{row.original.category}</p>
        </div>
      )
    },
    {
      accessorKey: "schedule",
      header: "Jadwal",
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.day}</p>
          <p className="text-sm text-muted-foreground">
            {row.original.startTime} - {row.original.endTime}
          </p>
        </div>
      )
    },
    {
      accessorKey: "presenter",
      header: "Penyiar"
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
      id: "actions",
      header: "Aksi",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/schedules/edit/${row.original.id}`}>
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
              <Calendar className="h-6 w-6" />
              Manajemen Jadwal
            </h1>
            <p className="text-muted-foreground">
              Kelola jadwal program siaran radio
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/schedules/create">
              <Plus className="mr-2 h-4 w-4" />
              Buat Jadwal
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari jadwal..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <DataTable columns={columns} data={schedules} />
      </div>
    </AdminLayout>
  )
}