import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { userTypes } from '../data/data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filters?: {
    search?: string
    role?: string
    status?: string
    onSearchChange: (search?: string) => void
    onRoleChange: (role?: string) => void
    onStatusChange: (status?: string) => void
  }
}

export function DataTableToolbar<TData>({
  table,
  filters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = filters
    ? !!(filters.search || filters.role || filters.status)
    : table.getState().columnFilters.length > 0

  const handleSearchChange = (value: string) => {
    if (filters) {
      filters.onSearchChange(value || undefined)
    } else {
      table.getColumn('name')?.setFilterValue(value)
    }
  }

  const handleClearFilters = () => {
    if (filters) {
      filters.onSearchChange(undefined)
      filters.onRoleChange(undefined)
      filters.onStatusChange(undefined)
    } else {
      table.resetColumnFilters()
    }
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter users...'
          value={
            filters 
              ? filters.search || '' 
              : (table.getColumn('name')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) => handleSearchChange(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {(filters || table.getColumn('status')) && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Status'
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Suspended', value: 'suspended' },
              ]}
              serverSideValue={filters?.status}
              onServerSideChange={filters?.onStatusChange}
            />
          )}
          {(filters || table.getColumn('role')) && (
            <DataTableFacetedFilter
              column={table.getColumn('role')}
              title='Role'
              options={userTypes.map((t) => ({ ...t }))}
              serverSideValue={filters?.role}
              onServerSideChange={filters?.onRoleChange}
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
