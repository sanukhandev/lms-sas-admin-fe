import * as React from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Search, Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SkeletonTableRows } from '@/components/ui/skeleton-table-row'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/features/tasks/components/data-table-view-options'
import { DataTablePagination } from '@/features/tasks/components/data-table-pagination'

interface OptimizedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  pagination?: {
    page: number
    perPage: number
    total: number
    lastPage: number
    onPageChange: (page: number) => void
    onPerPageChange: (perPage: number) => void
  }
  search?: {
    value: string
    onChange: (value: string) => void
  }
  toolbar?: {
    leftContent?: React.ReactNode
    rightContent?: React.ReactNode
  }
  onResetFilters?: () => void
  className?: string
}

export function OptimizedDataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results.',
  pagination,
  search,
  toolbar,
  onResetFilters,
  className,
}: OptimizedDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
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
  })

  const hasFilters = table.getState().columnFilters.length > 0 || (search?.value && search.value.length > 0)

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Toolbar */}
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 items-center space-x-2'>
          {/* Search Input */}
          {search && (
            <div className='relative'>
              <Search className='absolute left-2 top-2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder={searchPlaceholder}
                value={search.value}
                onChange={(event) => search.onChange(event.target.value)}
                className='h-8 w-[150px] pl-8 lg:w-[250px]'
                disabled={isLoading}
              />
              {isLoading && (
                <Loader2 className='absolute right-2 top-2 h-4 w-4 animate-spin text-muted-foreground' />
              )}
            </div>
          )}
          
          {/* Custom left toolbar content */}
          {toolbar?.leftContent}

          {/* Reset filters button */}
          {hasFilters && onResetFilters && (
            <Button
              variant='ghost'
              onClick={() => {
                table.resetColumnFilters()
                onResetFilters()
              }}
              className='h-8 px-2 lg:px-3'
              disabled={isLoading}
            >
              Reset
              <Cross2Icon className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>

        <div className='flex items-center space-x-2'>
          {/* Custom right toolbar content */}
          {toolbar?.rightContent}
          
          {/* Column visibility toggle */}
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Data Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={isLoading ? 'opacity-50' : ''}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? (
              // Show skeleton rows while loading
              <SkeletonTableRows columns={columns.length} />
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <DataTablePagination
          table={table}
        />
      )}
    </div>
  )
}
