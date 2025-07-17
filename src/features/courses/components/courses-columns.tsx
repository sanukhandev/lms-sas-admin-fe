import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { type Course } from '@/services/courses'

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Course Title' />
    ),
    cell: ({ row }) => {
      const course = row.original
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {course.title}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'instructor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Instructor' />
    ),
    cell: ({ row }) => (
      <div className='w-[120px]'>{row.getValue('instructor')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'enrollments',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Enrollments' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px] text-center'>{row.getValue('enrollments')}</div>
    ),
  },
  {
    accessorKey: 'completions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Completions' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px] text-center'>{row.getValue('completions')}</div>
    ),
  },
  {
    accessorKey: 'completionRate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Completion Rate' />
    ),
    cell: ({ row }) => {
      const rate = row.getValue('completionRate') as number
      return (
        <div className='w-[120px]'>
          <div className='flex items-center space-x-2'>
            <Progress value={rate} className='w-16 h-2' />
            <span className='text-sm text-muted-foreground'>{rate}%</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'averageProgress',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Avg Progress' />
    ),
    cell: ({ row }) => {
      const progress = row.getValue('averageProgress') as number
      return (
        <div className='w-[100px]'>
          <div className='flex items-center space-x-2'>
            <Progress value={progress} className='w-12 h-2' />
            <span className='text-sm text-muted-foreground'>{progress}%</span>
          </div>
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
      const status = row.getValue('status') as string
      return (
        <div className='w-[80px]'>
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
