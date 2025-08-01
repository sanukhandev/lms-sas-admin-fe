import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Users, Wrench, Settings } from 'lucide-react'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { type Course } from '@/services/courses'
import { useNavigate } from '@tanstack/react-router';

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Course Details' />
    ),
    cell: ({ row }) => {
      const course = row.original
      const shortDescription = course.short_description || course.description || ''
      const truncatedDescription = shortDescription.length > 50 
        ? shortDescription.substring(0, 50) + '...' 
        : shortDescription

      return (
        <div className='space-y-1 max-w-[300px]'>
          <div className='flex items-center space-x-2'>
            <BookOpen className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>{course.title}</span>
          </div>
          <p className='text-sm text-muted-foreground line-clamp-2'>
            {truncatedDescription}
            {shortDescription.length > 50 && (
              <Button 
                variant="link" 
                size="sm" 
                className='h-auto p-0 ml-1 text-xs'
                onClick={() => {
                  // This will be handled by a dialog in the parent component
                  const event = new CustomEvent('showCourseDetails', { 
                    detail: { course } 
                  })
                  window.dispatchEvent(event)
                }}
              >
                read more
              </Button>
            )}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: 'instructorName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tutor' />
    ),
    cell: ({ row }) => {
      const instructor = row.original.instructorName
      return (
        <div className='flex items-center space-x-2'>
          <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
            <span className='text-xs font-medium'>
              {instructor ? instructor.charAt(0).toUpperCase() : 'N/A'}
            </span>
          </div>
          <span className='font-medium'>{instructor || 'Unassigned'}</span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'categoryName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => {
      const category = row.original.categoryName
      return (
        <Badge variant="outline" className='bg-blue-50 text-blue-700 border-blue-200'>
          {category || 'Uncategorized'}
        </Badge>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'enrollmentCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Active Students' />
    ),
    cell: ({ row }) => {
      const count = row.original.enrollmentCount || 0
      return (
        <div className='flex items-center space-x-2'>
          <Users className='h-4 w-4 text-muted-foreground' />
          <span className='font-medium'>{count.toLocaleString()}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'completionRate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Completion Rate' />
    ),
    cell: ({ row }) => {
      const rate = row.original.completionRate || 0
      return (
        <div className='flex items-center space-x-3 min-w-[120px]'>
          <Progress value={rate} className='flex-1 h-2' />
          <span className='text-sm font-medium text-muted-foreground w-10 text-right'>
            {rate.toFixed(1)}%
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const variant = status === 'published' ? 'default' : 'secondary'
      const color = status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      
      return (
        <Badge variant={variant} className={color}>
          {status === 'published' ? 'Published' : 'Draft'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const navigate = useNavigate();
      const course = row.original;
      return (
        <Button size="sm" variant="outline" onClick={() => navigate({ to: `/courses/${course.id}/edit` })}>
          Edit
        </Button>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
]
