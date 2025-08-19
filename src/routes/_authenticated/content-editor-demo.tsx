import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContentEditorLayout } from '@/features/courses/components/content-editor'

export const Route = createFileRoute('/_authenticated/content-editor-demo')({
  component: ContentEditorDemo,
})

function ContentEditorDemo() {
  // Demo course ID - you can change this to any existing course ID in your system
  const demoCreatedCourseId = '1'

  return (
    <div className='container mx-auto space-y-6 p-4'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='sm' asChild>
          <Link to='/courses'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Courses
          </Link>
        </Button>
        <div>
          <h1 className='text-3xl font-bold'>Content Editor Demo</h1>
          <p className='text-muted-foreground'>
            Demo of the Course Content Editor feature
          </p>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <h4 className='font-medium'>Backend Requirements:</h4>
            <ul className='text-muted-foreground list-inside list-disc space-y-1 text-sm'>
              <li>Make sure your Laravel backend is running</li>
              <li>Ensure the course content API endpoints are available</li>
              <li>
                The demo uses course ID:{' '}
                <code className='rounded bg-gray-100 px-1'>
                  {demoCreatedCourseId}
                </code>
              </li>
            </ul>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>Features to Test:</h4>
            <ul className='text-muted-foreground list-inside list-disc space-y-1 text-sm'>
              <li>Create new content items using the "Add Content" button</li>
              <li>Search and filter content by type</li>
              <li>Click on content items to select and edit them</li>
              <li>Use the right panel to edit content details</li>
              <li>Try different content types (module, lesson, video, etc.)</li>
              <li>Test the publishing workflow (draft → published)</li>
            </ul>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium'>API Endpoints:</h4>
            <ul className='text-muted-foreground list-inside list-disc space-y-1 text-sm'>
              <li>
                <code className='rounded bg-gray-100 px-1'>
                  GET /api/courses/{demoCreatedCourseId}/contents
                </code>
              </li>
              <li>
                <code className='rounded bg-gray-100 px-1'>
                  POST /api/courses/{demoCreatedCourseId}/contents
                </code>
              </li>
              <li>
                <code className='rounded bg-gray-100 px-1'>
                  PUT /api/courses/{demoCreatedCourseId}/contents/{{ id }}
                </code>
              </li>
              <li>
                <code className='rounded bg-gray-100 px-1'>
                  DELETE /api/courses/{demoCreatedCourseId}/contents/{{ id }}
                </code>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Content Editor */}
      <ContentEditorLayout courseId={demoCreatedCourseId} />
    </div>
  )
}
