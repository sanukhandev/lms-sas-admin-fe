import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Loader2 } from 'lucide-react'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

const courseStatuses = [
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archived', value: 'archived' },
]

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  isLoading?: boolean
  filters?: {
    search?: string
    status?: string
    instructor?: string
    onSearchChange: (search?: string) => void
    onStatusChange: (status?: string) => void
    onInstructorChange: (instructor?: string) => void
  }
}

export function DataTableToolbar<TData>({
  table,
  filters,
  isLoading = false,
}: DataTableToolbarProps<TData>) {
  const isFiltered = filters
    ? !!(filters.search || filters.status || filters.instructor)
    : table.getState().columnFilters.length > 0

  const handleSearchChange = (value: string) => {
    if (filters) {
      filters.onSearchChange(value || undefined)
    } else {
      table.getColumn('title')?.setFilterValue(value)
    }
  }

  const handleClearFilters = () => {
    if (filters) {
      filters.onSearchChange(undefined)
      filters.onStatusChange(undefined)
      filters.onInstructorChange(undefined)
    } else {
      table.resetColumnFilters()
    }
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <div className='relative'>
          <Search className='absolute left-2 top-2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Filter courses...'
            value={
              filters 
                ? filters.search || '' 
                : (table.getColumn('title')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) => handleSearchChange(event.target.value)}
            className='h-8 w-[150px] pl-8 lg:w-[250px]'
          />
          {isLoading && (
            <Loader2 className='absolute right-2 top-2 h-4 w-4 animate-spin text-muted-foreground' />
          )}
        </div>
        <div className='flex gap-x-2'>
          {(filters || table.getColumn('status')) && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Status'
              options={courseStatuses}
              serverSideValue={filters?.status}
              onServerSideChange={filters?.onStatusChange}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={handleClearFilters}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
