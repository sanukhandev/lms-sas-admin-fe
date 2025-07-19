import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filters: {
    search?: string
    parentId?: number | null
    rootOnly?: boolean
    onSearchChange: (search: string) => void
    onParentIdChange: (parentId: number | null) => void
    onRootOnlyChange: (rootOnly: boolean) => void
  }
}

export function DataTableToolbar<TData>({
  table,
  filters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || 
                    filters.search || 
                    filters.parentId !== null || 
                    filters.rootOnly

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Filter categories...'
          value={filters.search || ''}
          onChange={(event) => filters.onSearchChange(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />

        <div className='flex items-center space-x-2'>
          <Switch
            id='root-only'
            checked={filters.rootOnly || false}
            onCheckedChange={filters.onRootOnlyChange}
          />
          <Label htmlFor='root-only' className='text-sm'>
            Root categories only
          </Label>
        </div>

        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
              filters.onSearchChange('')
              filters.onParentIdChange(null)
              filters.onRootOnlyChange(false)
            }}
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
