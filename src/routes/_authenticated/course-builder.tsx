import { createFileRoute } from '@tanstack/react-router'
import { CourseBuilder } from '@/features/course-builder/index'

export const Route = createFileRoute('/_authenticated/course-builder')({
  component: () => <CourseBuilder />,
})
