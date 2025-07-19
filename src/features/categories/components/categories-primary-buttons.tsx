import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useCategoriesContext } from '../context/categories-context'

export function CategoriesPrimaryButtons() {
  const { setIsCreateDialogOpen } = useCategoriesContext()

  return (
    <div className='flex items-center space-x-2'>
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <Plus className='mr-2 h-4 w-4' />
        Add Category
      </Button>
    </div>
  )
}
