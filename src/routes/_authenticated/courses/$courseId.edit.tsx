import { createFileRoute } from '@tanstack/react-router'
import CourseEdit from '@/features/courses/components/course-edit'

export const Route = createFileRoute('/_authenticated/courses/$courseId/edit')({
  component: CourseEdit,
})
