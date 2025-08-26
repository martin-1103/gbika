"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Column definition interface
export interface DataTableColumn<T = any> {
  key: string
  title: string
  dataIndex?: keyof T
  render?: (value: any, record: T, index: number) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: string | number
  align?: "left" | "center" | "right"
  className?: string
}

// Pagination configuration
export interface DataTablePagination {
  current: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
  showQuickJumper?: boolean
}

// Sort configuration
export interface DataTableSort {
  field: string
  order: "asc" | "desc"
}

// Filter configuration
export interface DataTableFilter {
  [key: string]: any
}

// DataTable component props
export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[]
  data: T[]
  loading?: boolean
  pagination?: DataTablePagination
  onPaginationChange?: (pagination: DataTablePagination) => void
  sorting?: DataTableSort | null
  onSortingChange?: (sorting: DataTableSort | null) => void
  filtering?: DataTableFilter
  onFilteringChange?: (filtering: DataTableFilter) => void
  rowKey?: keyof T | ((record: T) => string) | string
  className?: string
  emptyText?: string
  showHeader?: boolean
  size?: "sm" | "md" | "lg"
}

// DataTable: Reusable table component with pagination, sorting, and filtering
export function DataTable<T = any>({
  columns,
  data,
  loading = false,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  filtering = {},
  onFilteringChange,
  rowKey = "id" as keyof T | ((record: T) => string) | string,
  className,
  emptyText = "Tidak ada data",
  showHeader = true,
  size = "md",
}: DataTableProps<T>) {
  const [localFiltering, setLocalFiltering] = React.useState<DataTableFilter>(filtering)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Get row key for a record
  const getRowKey = React.useCallback(
    (record: T, index: number): string => {
      if (typeof rowKey === "function") {
        return rowKey(record)
      }
      return String(record[rowKey as keyof T] || index)
    },
    [rowKey]
  )

  // Handle column sorting
  const handleSort = React.useCallback(
    (column: DataTableColumn<T>) => {
      if (!column.sortable || !onSortingChange) return

      const field = column.dataIndex ? String(column.dataIndex) : column.key
      let newSorting: DataTableSort | null = null

      if (!sorting || sorting.field !== field) {
        newSorting = { field, order: "asc" }
      } else if (sorting.order === "asc") {
        newSorting = { field, order: "desc" }
      } else {
        newSorting = null
      }

      onSortingChange(newSorting)
    },
    [sorting, onSortingChange]
  )

  // Handle search/filter
  const handleSearch = React.useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (onFilteringChange) {
        const newFiltering = { ...localFiltering, search: query }
        setLocalFiltering(newFiltering)
        onFilteringChange(newFiltering)
      }
    },
    [localFiltering, onFilteringChange]
  )

  // Handle pagination
  const handlePaginationChange = React.useCallback(
    (newPagination: Partial<DataTablePagination>) => {
      if (!pagination || !onPaginationChange) return
      onPaginationChange({ ...pagination, ...newPagination })
    },
    [pagination, onPaginationChange]
  )

  // Get sort icon for column
  const getSortIcon = React.useCallback(
    (column: DataTableColumn<T>) => {
      if (!column.sortable) return null

      const field = column.dataIndex ? String(column.dataIndex) : column.key
      const isActive = sorting?.field === field

      if (!isActive) {
        return <ArrowUpDown className="ml-2 h-4 w-4" />
      }

      return sorting.order === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowDown className="ml-2 h-4 w-4" />
      )
    },
    [sorting]
  )

  // Calculate pagination info
  const paginationInfo = React.useMemo(() => {
    if (!pagination) return null

    const { current, pageSize, total } = pagination
    const start = (current - 1) * pageSize + 1
    const end = Math.min(current * pageSize, total)
    const totalPages = Math.ceil(total / pageSize)

    return {
      start,
      end,
      total,
      totalPages,
      hasPrev: current > 1,
      hasNext: current < totalPages,
    }
  }, [pagination])

  // Size classes
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search/Filter Bar */}
      {(onFilteringChange || columns.some(col => col.filterable)) && (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari data..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table className={sizeClasses[size]}>
          {showHeader && (
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      column.className,
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.sortable && "cursor-pointer select-none hover:bg-muted/50"
                    )}
                    style={{ width: column.width }}
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center">
                      {column.title}
                      {getSortIcon(column)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: pagination?.pageSize || 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              data.map((record, index) => (
                <TableRow key={getRowKey(record, index)}>
                  {columns.map((column) => {
                    const value = column.dataIndex ? record[column.dataIndex] : undefined
                    const content = column.render
                      ? column.render(value, record, index)
                      : String(value || "")

                    return (
                      <TableCell
                        key={column.key}
                        className={cn(
                          column.className,
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right"
                        )}
                      >
                        {content}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && paginationInfo && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {paginationInfo.start} - {paginationInfo.end} dari{" "}
            {paginationInfo.total} data
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePaginationChange({ current: 1 })}
              disabled={!paginationInfo.hasPrev}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePaginationChange({ current: pagination.current - 1 })}
              disabled={!paginationInfo.hasPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-1">
              <span className="text-sm">Halaman</span>
              <Badge variant="outline">
                {pagination.current} dari {paginationInfo.totalPages}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePaginationChange({ current: pagination.current + 1 })}
              disabled={!paginationInfo.hasNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePaginationChange({ current: paginationInfo.totalPages })}
              disabled={!paginationInfo.hasNext}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Export column helper for easier column definition
export const createColumn = <T = any>(
  column: DataTableColumn<T>
): DataTableColumn<T> => column

// Export action column helper
export const createActionColumn = <T = any>(
  actions: {
    label: string
    onClick: (record: T) => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    disabled?: (record: T) => boolean
  }[]
): DataTableColumn<T> => ({
  key: "actions",
  title: "Aksi",
  align: "center",
  render: (_, record) => (
    <div className="flex items-center justify-center space-x-2">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || "outline"}
          size={action.size || "sm"}
          onClick={() => action.onClick(record)}
          disabled={action.disabled ? action.disabled(record) : false}
        >
          {action.label}
        </Button>
      ))}
    </div>
  ),
})