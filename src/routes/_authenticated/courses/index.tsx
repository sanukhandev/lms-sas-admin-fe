import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/courses/')({
  beforeLoad: () => {
    throw redirect({ to: '/course-builder' })
  },
})
