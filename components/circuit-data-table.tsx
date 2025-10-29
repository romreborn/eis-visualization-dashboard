"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconDotsVertical } from "@tabler/icons-react"
import { CircuitData } from "@/lib/api-client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CircuitDataTableProps {
  data: CircuitData[]
  currentPage: number
  pageSize: number
  totalRecords: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  filters: {
    status?: string
    servicetype?: string
    partner?: string
  }
  onFiltersChange: (filters: Partial<typeof filters>) => void
  onClearFilters: () => void
  isLoading: boolean
  onRefresh: () => void
}

export function CircuitDataTable({
  data,
  currentPage,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading,
  onRefresh,
}: CircuitDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Define columns for circuit data
  const columns: ColumnDef<CircuitData>[] = [
    {
      accessorKey: "circuitID",
      header: "Circuit ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("circuitID")}</div>
      ),
    },
    {
      accessorKey: "circuitDesc",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-64 truncate" title={row.getValue("circuitDesc")}>
          {row.getValue("circuitDesc")}
        </div>
      ),
    },
    {
      accessorKey: "custDesc",
      header: "Customer",
      cell: ({ row }) => (
        <div className="max-w-48 truncate" title={row.getValue("custDesc")}>
          {row.getValue("custDesc")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant={
              status === 'Active' ? 'default' :
              status === 'Inactive' ? 'destructive' :
              status === 'Pending' ? 'secondary' :
              'outline'
            }
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "servicetype",
      header: "Service Type",
      cell: ({ row }) => {
        const serviceType = row.getValue("servicetype") as string
        return (
          <Badge variant="outline" className="capitalize">
            {serviceType}
          </Badge>
        )
      },
    },
    {
      accessorKey: "partnerName",
      header: "Partner",
      cell: ({ row }) => {
        const partner = row.getValue("partnerName") as string || row.original.partner
        return (
          <div className="max-w-40 truncate" title={partner}>
            {partner || 'N/A'}
          </div>
        )
      },
    },
    {
      accessorKey: "remRegion1",
      header: "Region",
      cell: ({ row }) => {
        const region = row.getValue("remRegion1") as string || row.original.remRegion2
        return (
          <div className="max-w-32 truncate" title={region}>
            {region || 'N/A'}
          </div>
        )
      },
    },
    {
      accessorKey: "wanIp1",
      header: "Primary IP",
      cell: ({ row }) => {
        const ip = row.getValue("wanIp1") as string
        return (
          <code className="text-sm bg-muted px-2 py-1 rounded">
            {ip || 'N/A'}
          </code>
        )
      },
    },
    {
      accessorKey: "mrc",
      header: "MRC",
      cell: ({ row }) => {
        const mrc = row.getValue("mrc") as string
        const numericMrc = parseFloat(mrc) || 0
        return (
          <div className="font-medium">
            ${numericMrc.toFixed(2)}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Circuit</DropdownMenuItem>
            <DropdownMenuItem>View Logs</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete Circuit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
    getRowId: (row) => row.circuitNdx.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    pageCount: Math.ceil(totalRecords / pageSize),
  })

  // Get unique values for filters
  const uniqueStatuses = React.useMemo(() => {
    const statuses = [...new Set(data.map(circuit => circuit.status).filter(Boolean))]
    return statuses.sort()
  }, [data])

  const uniqueServiceTypes = React.useMemo(() => {
    const serviceTypes = [...new Set(data.map(circuit => circuit.servicetype).filter(Boolean))]
    return serviceTypes.sort()
  }, [data])

  const uniquePartners = React.useMemo(() => {
    const partners = [...new Set(data.map(circuit => circuit.partnerName || circuit.partner).filter(Boolean))]
    return partners.sort()
  }, [data])

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-1 items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Label htmlFor="status-filter">Status:</Label>
            <Select
              value={filters.status || ""}
              onValueChange={(value) => onFiltersChange({ status: value || undefined })}
            >
              <SelectTrigger className="w-32" id="status-filter">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="service-filter">Service:</Label>
            <Select
              value={filters.servicetype || ""}
              onValueChange={(value) => onFiltersChange({ servicetype: value || undefined })}
            >
              <SelectTrigger className="w-32" id="service-filter">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Services</SelectItem>
                {uniqueServiceTypes.map((serviceType) => (
                  <SelectItem key={serviceType} value={serviceType}>
                    {serviceType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="partner-filter">Partner:</Label>
            <Select
              value={filters.partner || ""}
              onValueChange={(value) => onFiltersChange({ partner: value || undefined })}
            >
              <SelectTrigger className="w-32" id="partner-filter">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Partners</SelectItem>
                {uniquePartners.map((partner) => (
                  <SelectItem key={partner} value={partner}>
                    {partner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(filters.status || filters.servicetype || filters.partner) && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns
                <IconChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.replace(/([A-Z])/g, ' $1').trim()}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {isLoading ? "Loading..." : "No circuits found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {totalRecords} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                onPageSizeChange(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage} of {Math.ceil(totalRecords / pageSize)}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalRecords / pageSize)}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => onPageChange(Math.ceil(totalRecords / pageSize))}
              disabled={currentPage >= Math.ceil(totalRecords / pageSize)}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}