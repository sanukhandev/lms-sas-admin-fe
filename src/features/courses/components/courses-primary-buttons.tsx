import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useCoursesContext } from '../context/courses-context'

export function CoursesPrimaryButtons() {
  const { setIsCreateDialogOpen } = useCoursesContext()

  return (
    <div className='flex items-center space-x-2'>
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <Plus className='mr-2 h-4 w-4' />
        Add Course
      </Button>
    </div>
  )
}
