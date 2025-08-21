import { createFileRoute } from '@tanstack/react-router'
import { ContentEditorLayout } from '@/features/courses/components/content-editor/index'

export const Route = createFileRoute(
  '/_authenticated/courses/$courseId/content'
)({
  component: CourseContentEditor,
})

function CourseContentEditor() {
  const { courseId } = Route.useParams()

  return (
    <div className='container mx-auto p-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold'>Course Content Editor</h1>
        <p className='text-muted-foreground'>
          Manage and organize your course content
        </p>
      </div>

      <ContentEditorLayout courseId={courseId} />
    </div>
  )
}
