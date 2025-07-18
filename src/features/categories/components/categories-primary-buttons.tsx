import { useState } from 'react'
import {
  Plus,
  Download,
  Upload,
  TreePine,
  Table,
  Filter,
  MoreHorizontal,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCategoriesContext } from '../hooks/use-categories-context'

export function CategoriesPrimaryButtons() {
  const {
    viewMode,
    setViewMode,
    selectedCategories,
    handleCreateCategory,
    handleBulkDelete,
    clearSelection,
  } = useCategoriesContext()

  const [showFilters, setShowFilters] = useState(false)

  const handleExportCategories = () => {
    // TODO: Implement export functionality
    toast.info('Export functionality coming soon')
  }

  const handleImportCategories = () => {
    // TODO: Implement import functionality
    toast.info('Import functionality coming soon')
  }

  return (
    <div className='flex items-center gap-2'>
      {/* View Mode Toggle */}
      <div className='flex items-center rounded-lg border p-1'>
        <Button
          variant={viewMode === 'table' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => setViewMode('table')}
          className='h-8 px-2'
        >
          <Table className='h-4 w-4' />
        </Button>
        <Button
          variant={viewMode === 'tree' ? 'default' : 'ghost'}
          size='sm'
          onClick={() => setViewMode('tree')}
          className='h-8 px-2'
        >
          <TreePine className='h-4 w-4' />
        </Button>
      </div>

      {/* Filters Toggle */}
      <Button
        variant={showFilters ? 'default' : 'outline'}
        size='sm'
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter className='h-4 w-4' />
        Filters
      </Button>

      {/* Bulk Actions */}
      {selectedCategories.length > 0 && (
        <div className='flex items-center gap-2'>
          <Badge variant='secondary'>
            {selectedCategories.length} selected
          </Badge>
          <Button variant='outline' size='sm' onClick={clearSelection}>
            Clear
          </Button>
          <Button variant='destructive' size='sm' onClick={handleBulkDelete}>
            Delete Selected
          </Button>
        </div>
      )}

      {/* More Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={handleExportCategories}>
            <Download className='mr-2 h-4 w-4' />
            Export Categories
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleImportCategories}>
            <Upload className='mr-2 h-4 w-4' />
            Import Categories
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <TreePine className='mr-2 h-4 w-4' />
            View Hierarchy
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Category Button */}
      <Button onClick={handleCreateCategory} className='gap-2'>
        <Plus className='h-4 w-4' />
        Add Category
      </Button>
    </div>
  )
}
