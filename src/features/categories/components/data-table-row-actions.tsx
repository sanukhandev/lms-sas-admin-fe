import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { useCategoriesContext } from '../context/categories-context'
import { type Category } from '@/services/categories'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const category = row.original as Category
  const {
    setSelectedCategory,
    setIsViewDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
  } = useCategoriesContext()

  const handleView = () => {
    setSelectedCategory(category)
    setIsViewDialogOpen(true)
  }

  const handleEdit = () => {
    setSelectedCategory(category)
    setIsEditDialogOpen(true)
  }

  const handleDelete = () => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleView}>
          <Eye className='mr-2 h-4 w-4' />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className='mr-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className='text-red-600'>
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
