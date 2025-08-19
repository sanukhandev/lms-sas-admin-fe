import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/courses/$courseId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/courses/$courseId/edit"!</div>
}
