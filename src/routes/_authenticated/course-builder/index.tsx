import { createFileRoute } from '@tanstack/react-router'
import { CourseBuilder } from '@/features/course-builder/course-builder'

export const Route = createFileRoute('/_authenticated/course-builder/')({
  component: () => <CourseBuilder />,
})
