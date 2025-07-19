import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/course-builder')({
  beforeLoad: async () => {
    // Redirect to the authenticated course-builder route
    throw redirect({
      to: '/_authenticated/course-builder' as any,
    })
  },
})
