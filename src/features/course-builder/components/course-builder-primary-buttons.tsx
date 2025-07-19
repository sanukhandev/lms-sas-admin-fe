import { Button } from '@/components/ui/button'
import { Plus, Settings, BookOpen, ArrowLeft, BarChart3, Calendar, Users } from 'lucide-react'
import { useCourseBuilderContext } from '../context/course-builder-context'

interface CourseBuilderPrimaryButtonsProps {
  selectedCourseId?: string | null
  onBackToOverview?: () => void
}

export function CourseBuilderPrimaryButtons({ selectedCourseId, onBackToOverview }: CourseBuilderPrimaryButtonsProps) {
  const { setIsCreateDialogOpen, setIsStructureDialogOpen, setIsPricingDialogOpen } = useCourseBuilderContext()

  return (
    <div className='flex items-center space-x-2'>
      {selectedCourseId && onBackToOverview && (
        <Button variant='outline' onClick={onBackToOverview}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Overview
        </Button>
      )}
      
      {!selectedCourseId && (
        <>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            Create Course
          </Button>
          <Button variant='outline'>
            <Calendar className='mr-2 h-4 w-4' />
            Course Planner
          </Button>
          <Button variant='outline'>
            <BarChart3 className='mr-2 h-4 w-4' />
            Analytics
          </Button>
        </>
      )}
      
      {selectedCourseId && (
        <>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            Save Changes
          </Button>
          <Button variant='outline' onClick={() => setIsStructureDialogOpen(true)}>
            <BookOpen className='mr-2 h-4 w-4' />
            Preview Course
          </Button>
          <Button variant='outline' onClick={() => setIsPricingDialogOpen(true)}>
            <Settings className='mr-2 h-4 w-4' />
            Settings
          </Button>
          <Button variant='outline'>
            <Users className='mr-2 h-4 w-4' />
            Invite Reviewers
          </Button>
        </>
      )}
    </div>
  )
}
