"use client"

import { DataTable, createColumn, createActionColumn, type DataTableColumn } from "./data-table"
import { Badge } from "./badge"
import { Button } from "./button"
import { useState } from "react"

// Example data interface
interface ExampleData {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "pending"
  createdAt: string
  role: string
}

// Example usage of DataTable component
export function DataTableExample() {
  const [data] = useState<ExampleData[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      createdAt: "2024-01-15",
      role: "Admin"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      status: "pending",
      createdAt: "2024-01-16",
      role: "Editor"
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      status: "inactive",
      createdAt: "2024-01-17",
      role: "User"
    }
  ])

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: data.length
  })

  const [sorting, setSorting] = useState<{ field: string; order: "asc" | "desc" } | null>(null)
  const [filtering, setFiltering] = useState({})

  // Define columns
  const columns: DataTableColumn<ExampleData>[] = [
    createColumn({
      key: "name",
      title: "Nama",
      dataIndex: "name",
      sortable: true,
      filterable: true
    }),
    createColumn({
      key: "email",
      title: "Email",
      dataIndex: "email",
      sortable: true,
      filterable: true
    }),
    createColumn({
      key: "status",
      title: "Status",
      dataIndex: "status",
      sortable: true,
      render: (value: string) => {
        const variants = {
          active: "default",
          inactive: "secondary",
          pending: "outline"
        } as const
        
        return (
          <Badge variant={variants[value as keyof typeof variants]}>
            {value === "active" ? "Aktif" : value === "inactive" ? "Tidak Aktif" : "Pending"}
          </Badge>
        )
      }
    }),
    createColumn({
      key: "role",
      title: "Role",
      dataIndex: "role",
      sortable: true
    }),
    createColumn({
      key: "createdAt",
      title: "Tanggal Dibuat",
      dataIndex: "createdAt",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('id-ID')
    }),
    createActionColumn([
      {
        label: "Edit",
        onClick: (record) => console.log("Edit", record),
        variant: "outline"
      },
      {
        label: "Hapus",
        onClick: (record) => console.log("Delete", record),
        variant: "destructive",
        disabled: (record) => record.status === "active"
      }
    ])
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Contoh DataTable</h2>
        <p className="text-muted-foreground">
          Komponen tabel reusable dengan fitur pagination, sorting, dan filtering
        </p>
      </div>
      
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        filtering={filtering}
        onFilteringChange={setFiltering}
        rowKey="id"
      />
    </div>
  )
}