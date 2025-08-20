import { createFileRoute } from '@tanstack/react-router'
import { CourseBuilder } from '@/features/courses/builder'

export const Route = createFileRoute('/_authenticated/courses/[courseId]/edit')({
  component: EditCoursePage,
})

function EditCoursePage() {
  const { courseId } = Route.useParams()
  return <CourseBuilder courseId={courseId} />
}
