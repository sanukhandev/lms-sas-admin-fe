import { useQuery } from '@tanstack/react-query'
import { coursesService } from '@/services/courses'
import { BookOpen } from 'lucide-react'

interface CourseStructureTabProps {
  courseId: string
}

export function CourseStructureTab({ courseId }: CourseStructureTabProps) {
  // Fetch course structure from API
  const { data: courseStructure } = useQuery({
    queryKey: ['course-builder', 'structure', courseId],
    queryFn: () => coursesService.getCourseStructure(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Course Structure Builder</h3>
        <p className="text-gray-500 mb-4">
          Build and organize your course modules and chapters
        </p>
        <p className="text-sm text-gray-400">
          This feature is currently under development and will be available soon.
        </p>
        {courseStructure?.data && (
          <div className="mt-4 text-sm text-gray-600">
            <p>Found {courseStructure.data.modules?.length || 0} modules</p>
          </div>
        )}
      </div>
    </div>
  )
}
