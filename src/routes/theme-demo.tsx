import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/theme-demo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/theme-demo"!</div>
}
