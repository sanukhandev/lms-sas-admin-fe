import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { type Category } from '@/services/categories'
import { FolderOpen, Folder } from 'lucide-react'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category Name' />
    ),
    cell: ({ row }) => {
      const category = row.original
      const hasSubcategories = (category.subcategories_count || 0) > 0
      const Icon = hasSubcategories ? FolderOpen : Folder
      
      return (
        <div className='flex items-center space-x-2'>
          <Icon className='h-4 w-4 text-muted-foreground' />
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {category.name}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'slug',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Slug' />
    ),
    cell: ({ row }) => {
      const slug = row.getValue('slug') as string
      return (
        <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm'>
          {slug}
        </code>
      )
    },
  },
  {
    accessorKey: 'parent',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Parent Category' />
    ),
    cell: ({ row }) => {
      const parent = row.original.parent
      return parent ? (
        <span className='text-sm text-muted-foreground'>{parent.name}</span>
      ) : (
        <Badge variant='outline'>Root</Badge>
      )
    },
  },
  {
    accessorKey: 'courses_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Courses' />
    ),
    cell: ({ row }) => {
      const coursesCount = row.original.courses_count || 0
      const activeCoursesCount = row.original.active_courses_count || 0
      
      return (
        <div className='text-center'>
          <div className='text-sm font-medium'>{coursesCount}</div>
          <div className='text-xs text-muted-foreground'>
            {activeCoursesCount} active
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'subcategories_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Subcategories' />
    ),
    cell: ({ row }) => {
      const subcategoriesCount = row.original.subcategories_count || 0
      return (
        <div className='text-center'>
          <Badge variant={subcategoriesCount > 0 ? 'default' : 'outline'}>
            {subcategoriesCount}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'total_students',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Students' />
    ),
    cell: ({ row }) => {
      const studentsCount = row.original.total_students || 0
      return (
        <div className='text-center'>
          <span className='text-sm font-medium'>{studentsCount}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return (
        <div className='text-sm text-muted-foreground'>
          {date.toLocaleDateString()}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
