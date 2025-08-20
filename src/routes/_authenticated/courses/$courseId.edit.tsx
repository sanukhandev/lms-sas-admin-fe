import { createFileRoute } from '@tanstack/react-router'
import { CourseBuilder } from '@/features/courses/builder/CourseBuilder'

export const Route = createFileRoute('/_authenticated/courses/$courseId/edit')({
  component: CourseEditPage,
})

function CourseEditPage() {
  const { courseId } = Route.useParams()
  return <CourseBuilder courseId={courseId} />
}
