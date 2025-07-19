import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useCallback, useMemo, useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Eye, Edit, Trash2, Play, Pause, Search, BookOpen } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCourseBuilderContext } from '../context/course-builder-context'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useCourses,
  usePublishCourse,
} from '../hooks/use-course-builder'
import { Course } from '@/services/courses'

// CourseBuilder type definition (legacy interface for compatibility)
interface CourseBuilder {
  id: number
  title: string
  description: string
  instructor: string
  status: 'draft' | 'published' | 'archived'
  modules_count: number
  chapters_count: number
  total_duration: number
  created_at: string
  updated_at: string
}

// Helper function to convert Course to CourseBuilder format
const mapCourseToBuilder = (course: Course): CourseBuilder => ({
  id: course.id,
  title: course.title,
  description: course.description || '',
  instructor: course.instructor_name || 'Unknown',
  status: course.status,
  modules_count: course.content_count || 0,
  chapters_count: course.content_count || 0, // placeholder
  total_duration: (course.duration_hours || 0) * 60,
  created_at: course.created_at,
  updated_at: course.updated_at,
})

// Get mock data for fallback
const mockCourses: CourseBuilder[] = [
  {
    id: 1,
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React development',
    instructor: 'John Doe',
    status: 'published',
    modules_count: 3,
    chapters_count: 12,
    total_duration: 180,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-02-01T14:20:00Z',
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    description: 'Master advanced JavaScript concepts and patterns',
    instructor: 'Jane Smith',
    status: 'draft',
    modules_count: 5,
    chapters_count: 20,
    total_duration: 300,
    created_at: '2024-02-01T09:15:00Z',
    updated_at: '2024-02-10T16:45:00Z',
  },
  {
    id: 3,
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js',
    instructor: 'Mike Johnson',
    status: 'published',
    modules_count: 4,
    chapters_count: 16,
    total_duration: 240,
    created_at: '2024-01-20T11:00:00Z',
    updated_at: '2024-02-05T13:30:00Z',
  },
]

interface CourseBuilderTableProps {
  onStatsUpdate: (stats: {
    totalCourses: number
    publishedCourses: number
    draftCourses: number
    totalDuration: number
  }) => void
  onCourseSelect?: (courseId: string) => void
}

export function CourseBuilderTable({ onStatsUpdate, onCourseSelect }: CourseBuilderTableProps) {
  const {
    setSelectedCourse,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewDialogOpen,
  } = useCourseBuilderContext()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Fetch courses from API using our custom hook
  const { data: coursesResponse, isLoading } = useCourses()
  const courses: CourseBuilder[] = coursesResponse?.data?.map(mapCourseToBuilder) || mockCourses
  
  // Get publish mutation
  const { mutateAsync: publishCourse } = usePublishCourse()

  // Filter data based on search and status
  const filteredData = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = !searchQuery || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = !statusFilter || course.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [courses, searchQuery, statusFilter])

  // Update stats when data changes
  useEffect(() => {
    const totalCourses = courses.length
    const publishedCourses = courses.filter(course => course.status === 'published').length
    const draftCourses = courses.filter(course => course.status === 'draft').length
    const totalDuration = courses.reduce((sum, course) => sum + course.total_duration, 0)
    
    onStatsUpdate({
      totalCourses,
      publishedCourses,
      draftCourses,
      totalDuration,
    })
  }, [courses, onStatsUpdate])

  const handlePublishToggle = useCallback(async (course: CourseBuilder) => {
    try {
      const action = course.status === 'published' ? 'unpublish' : 'publish'
      await publishCourse({ courseId: course.id.toString(), action })
    } catch (error) {
      console.error('Failed to toggle course status:', error)
    }
  }, [publishCourse])

  const columns: ColumnDef<CourseBuilder>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Course Title',
        cell: ({ row }) => (
          <div className='space-y-1'>
            <div className='font-medium'>{row.getValue('title')}</div>
            <div className='text-sm text-muted-foreground truncate max-w-[200px]'>
              {row.original.description}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'instructor',
        header: 'Instructor',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as string
          return (
            <Badge
              variant={
                status === 'published'
                  ? 'default'
                  : status === 'draft'
                  ? 'secondary'
                  : 'outline'
              }
            >
              {status}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'modules_count',
        header: 'Modules',
        cell: ({ row }) => (
          <div className='text-center'>{row.getValue('modules_count')}</div>
        ),
      },
      {
        accessorKey: 'chapters_count',
        header: 'Chapters',
        cell: ({ row }) => (
          <div className='text-center'>{row.getValue('chapters_count')}</div>
        ),
      },
      {
        accessorKey: 'total_duration',
        header: 'Duration',
        cell: ({ row }) => {
          const minutes = row.getValue('total_duration') as number
          const hours = Math.floor(minutes / 60)
          const mins = minutes % 60
          return (
            <div className='text-center'>
              {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
            </div>
          )
        },
      },
      {
        accessorKey: 'updated_at',
        header: 'Last Modified',
        cell: ({ row }) => {
          const date = new Date(row.getValue('updated_at'))
          return (
            <div className='text-sm text-muted-foreground'>
              {date.toLocaleDateString()}
            </div>
          )
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const course = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  onClick={() => {
                    onCourseSelect?.(course.id.toString())
                  }}
                >
                  <BookOpen className='mr-2 h-4 w-4' />
                  Edit Course
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCourse(course)
                    setIsViewDialogOpen(true)
                  }}
                >
                  <Eye className='mr-2 h-4 w-4' />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCourse(course)
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Edit className='mr-2 h-4 w-4' />
                  Quick Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handlePublishToggle(course)}>
                  {course.status === 'published' ? (
                    <>
                      <Pause className='mr-2 h-4 w-4' />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Play className='mr-2 h-4 w-4' />
                      Publish
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCourse(course)
                    setIsDeleteDialogOpen(true)
                  }}
                  className='text-destructive'
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [setSelectedCourse, setIsEditDialogOpen, setIsDeleteDialogOpen, setIsViewDialogOpen, handlePublishToggle]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: false,
    manualSorting: false,
    manualFiltering: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  })

  return (
    <div className='space-y-4'>
      {/* Simple Toolbar */}
      <div className='flex items-center space-x-2'>
        <div className='relative'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search courses...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-8'
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className='h-10 px-3 py-2 border border-input bg-background rounded-md text-sm'
        >
          <option value=''>All Status</option>
          <option value='published'>Published</option>
          <option value='draft'>Draft</option>
          <option value='archived'>Archived</option>
        </select>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className='h-4 w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
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
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Simple Pagination */}
      <div className='flex items-center justify-between px-2'>
        <div className='flex-1 text-sm text-muted-foreground'>
          Showing {table.getRowModel().rows.length} of {filteredData.length} results
        </div>
        <div className='flex items-center space-x-6 lg:space-x-8'>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
