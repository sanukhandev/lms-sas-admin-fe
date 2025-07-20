import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCoursesContext } from '../context/courses-context'
import { type Course } from '@/services/courses'

interface DataTableRowActionsProps {
  row: Row<Course>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const {
    setSelectedCourse,
    setIsViewDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
  } = useCoursesContext()

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
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem
            onClick={() => {
              setSelectedCourse(row.original)
              setIsViewDialogOpen(true)
            }}
          >
            <IconEye className='mr-2 h-4 w-4' />
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelectedCourse(row.original)
              setIsEditDialogOpen(true)
            }}
          >
            <IconEdit className='mr-2 h-4 w-4' />
            Edit
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
