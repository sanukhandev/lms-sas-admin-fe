import { ColumnDef } from '@tanstack/react-table'
import { Category } from '@/services/categories'
import { ArrowUpDown, Edit, Trash2, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ActionsProps {
  onView: (category: Category) => void
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export const createColumns = (
  actions?: ActionsProps
): ColumnDef<Category>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const category = row.original
      return (
        <div className='flex items-center space-x-2'>
          <span className='font-medium'>{category.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => {
      const slug = row.getValue('slug') as string
      return <code className='bg-muted rounded px-2 py-1 text-xs'>{slug}</code>
    },
  },
  {
    accessorKey: 'parent',
    header: 'Parent',
    cell: ({ row }) => {
      const parent = row.original.parent
      return (
        <div className='text-muted-foreground text-sm'>
          {parent ? parent.name : 'Root Category'}
        </div>
      )
    },
  },
  {
    accessorKey: 'courses_count',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Courses
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const count = row.getValue('courses_count') as number
      return (
        <Badge variant='outline' className='text-xs'>
          {count || 0} courses
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return <div className='text-sm'>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const category = row.original

      return (
        <div className='flex items-center space-x-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              actions?.onView(category)
            }}
          >
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              actions?.onEdit(category)
            }}
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              actions?.onDelete(category)
            }}
          >
            <Trash2 className='text-destructive h-4 w-4' />
          </Button>
        </div>
      )
    },
  },
]

// Export default columns without actions
export const columns: ColumnDef<Category>[] = createColumns()
