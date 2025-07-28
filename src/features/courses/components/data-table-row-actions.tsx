import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconEdit, IconTrash, IconEye, IconSettings } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCoursesContext } from '../context/courses-context'
import { useNavigate } from '@tanstack/react-router'
import { type Course } from '@/services/courses'

interface DataTableRowActionsProps {
  row: Row<Course>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const navigate = useNavigate()
  const {
    setSelectedCourse,
    setIsViewDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
  } = useCoursesContext()

  const handleEditCourse = () => {
    navigate({ 
      to: '/courses/$courseId/edit', 
      params: { courseId: row.original.id.toString() } 
    })
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[200px]'>
          <DropdownMenuItem
            onClick={() => {
              setSelectedCourse(row.original)
              setIsViewDialogOpen(true)
            }}
          >
            <IconEye className='mr-2 h-4 w-4' />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditCourse}>
            <IconSettings className='mr-2 h-4 w-4' />
            Edit Course
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelectedCourse(row.original)
              setIsEditDialogOpen(true)
            }}
          >
            <IconEdit className='mr-2 h-4 w-4' />
            Quick Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setSelectedCourse(row.original)
              setIsDeleteDialogOpen(true)
            }}
            className='text-red-500!'
          >
            <IconTrash className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
