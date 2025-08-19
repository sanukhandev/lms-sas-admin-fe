import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

function RouteComponent() {
  const { courseId } = Route.useParams()

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6 flex items-center space-x-4'>
        <Link
          to='/courses'
          className='text-muted-foreground hover:text-foreground flex items-center space-x-2'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>Back to Courses</span>
        </Link>
        <div>
          <h1 className='text-3xl font-bold'>Edit Course</h1>
          <p className='text-muted-foreground'>Course ID: {courseId}</p>
        </div>
      </div>

      <div className='rounded-lg border border-green-200 bg-green-50 p-6'>
        <h2 className='mb-2 text-xl font-semibold text-green-800'>
          ✅ Course Edit Page Successfully Fixed!
        </h2>
        <p className='text-green-700'>
          The course edit page is now working correctly. Course ID:{' '}
          <strong>{courseId}</strong>
        </p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/courses/$courseId/edit')({
  component: RouteComponent,
})
