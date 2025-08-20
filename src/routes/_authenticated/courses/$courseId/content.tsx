import { createFileRoute } from '@tanstack/react-router'
import { ContentEditorLayout } from '@/features/courses/components/content-editor/index'

export const Route = createFileRoute('/_authenticated/courses/$courseId/content')({
  component: CourseContentPage,
})

function CourseContentPage() {
  const { courseId } = Route.useParams()

  return (
    <div className='container mx-auto p-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Course Content Management</h1>
        <p className='text-muted-foreground'>
          Manage course content - lessons, videos, documents, and more
        </p>
      </div>

      <ContentEditorLayout courseId={courseId} />
    </div>
  )
}
