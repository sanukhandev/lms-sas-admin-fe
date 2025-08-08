import { Search, Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CourseFiltersProps {
  filters: {
    search: string
    status: string
    category_id: string
    content_type: string
  }
  onFiltersChange: (filters: {
    search: string
    status: string
    category_id: string
    content_type: string
  }) => void
  className?: string
}

export function CourseFilters({
  filters,
  onFiltersChange,
  className,
}: CourseFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value })
  }

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ ...filters, category_id: value })
  }

  const handleContentTypeChange = (value: string) => {
    onFiltersChange({ ...filters, content_type: value })
  }

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      category_id: 'all',
      content_type: 'course',
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.status !== 'all' ||
    filters.category_id !== 'all' ||
    filters.content_type !== 'course'

  const activeFilterCount = [
    filters.search,
    filters.status !== 'all' ? filters.status : null,
    filters.category_id !== 'all' ? filters.category_id : null,
    filters.content_type !== 'course' ? filters.content_type : null,
  ].filter(Boolean).length

  return (
    <div className={cn('space-y-4', className)}>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-1 items-center gap-2'>
          <div className='relative max-w-sm flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder='Search courses...'
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className='pl-9'
            />
          </div>

          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger className='w-[130px]'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='draft'>Draft</SelectItem>
              <SelectItem value='published'>Published</SelectItem>
              <SelectItem value='archived'>Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.category_id}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className='w-[150px]'>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              <SelectItem value='1'>Web Development</SelectItem>
              <SelectItem value='2'>Data Science</SelectItem>
              <SelectItem value='3'>Mobile Development</SelectItem>
              <SelectItem value='4'>Design</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.content_type}
            onValueChange={handleContentTypeChange}
          >
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Content Type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='course'>Courses</SelectItem>
              <SelectItem value='module'>Modules</SelectItem>
              <SelectItem value='chapter'>Chapters</SelectItem>
              <SelectItem value='class'>Classes</SelectItem>
              <SelectItem value='all'>All Types</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2'>
          {hasActiveFilters && (
            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='gap-1'>
                <Filter className='h-3 w-3' />
                {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
              </Badge>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleClearFilters}
                className='h-8 px-2'
              >
                <X className='h-4 w-4' />
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-2'>
          {filters.search && (
            <Badge variant='outline' className='gap-1'>
              Search: "{filters.search}"
              <button
                onClick={() => handleSearchChange('')}
                className='ml-1 rounded-sm opacity-70 hover:opacity-100'
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}
          {filters.status !== 'all' && (
            <Badge variant='outline' className='gap-1'>
              Status: {filters.status}
              <button
                onClick={() => handleStatusChange('all')}
                className='ml-1 rounded-sm opacity-70 hover:opacity-100'
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}
          {filters.category_id !== 'all' && (
            <Badge variant='outline' className='gap-1'>
              Category: {getCategoryName(filters.category_id)}
              <button
                onClick={() => handleCategoryChange('all')}
                className='ml-1 rounded-sm opacity-70 hover:opacity-100'
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}
          {filters.content_type !== 'course' && (
            <Badge variant='outline' className='gap-1'>
              Type: {getContentTypeName(filters.content_type)}
              <button
                onClick={() => handleContentTypeChange('course')}
                className='ml-1 rounded-sm opacity-70 hover:opacity-100'
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

// Helper function to get category name
function getCategoryName(categoryId: string): string {
  const categories: Record<string, string> = {
    '1': 'Web Development',
    '2': 'Data Science',
    '3': 'Mobile Development',
    '4': 'Design',
  }
  return categories[categoryId] || categoryId
}

// Helper function to get content type name
function getContentTypeName(contentType: string): string {
  const contentTypes: Record<string, string> = {
    course: 'Courses',
    module: 'Modules',
    chapter: 'Chapters',
    class: 'Classes',
    all: 'All Types',
  }
  return contentTypes[contentType] || contentType
}
