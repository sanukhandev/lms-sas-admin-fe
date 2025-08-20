import { AlertCircle, Users } from 'lucide-react'
import { useCourseStudents } from '@/hooks/use-courses'

interface CourseStudentsProps {
  courseId: string
}

// Mock Students Display Component (with all necessary imports)
function MockStudentsDisplay({ courseId: _courseId }: { courseId: string }) {
  return (
    <div className='space-y-6'>
      {/* Stats Overview */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg border bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Total Students
              </p>
              <p className='text-2xl font-bold'>127</p>
            </div>
            <Users className='text-muted-foreground h-8 w-8' />
          </div>
        </div>

        <div className='rounded-lg border bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Active Students
              </p>
              <p className='text-2xl font-bold'>89</p>
            </div>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
              <span className='text-xs font-bold text-blue-600'>89</span>
            </div>
          </div>
        </div>

        <div className='rounded-lg border bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Completed
              </p>
              <p className='text-2xl font-bold'>34</p>
            </div>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-100'>
              <span className='text-xs font-bold text-green-600'>34</span>
            </div>
          </div>
        </div>

        <div className='rounded-lg border bg-white p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Avg. Progress
              </p>
              <p className='text-2xl font-bold'>73%</p>
            </div>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-purple-100'>
              <span className='text-xs font-bold text-purple-600'>73</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Student List */}
      <div className='rounded-lg border bg-white shadow-sm'>
        <div className='border-b p-6'>
          <h3 className='text-lg font-semibold'>Students</h3>
          <p className='text-muted-foreground text-sm'>
            Sample student data for demonstration
          </p>
        </div>
        <div className='p-6'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between rounded-lg bg-gray-50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white'>
                  JS
                </div>
                <div>
                  <p className='font-medium'>John Smith</p>
                  <p className='text-muted-foreground text-sm'>
                    john@example.com
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium'>85% Complete</p>
                <p className='text-muted-foreground text-xs'>Active</p>
              </div>
            </div>

            <div className='flex items-center justify-between rounded-lg bg-gray-50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-medium text-white'>
                  SJ
                </div>
                <div>
                  <p className='font-medium'>Sarah Johnson</p>
                  <p className='text-muted-foreground text-sm'>
                    sarah@example.com
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium'>100% Complete</p>
                <p className='text-muted-foreground text-xs'>Completed</p>
              </div>
            </div>

            <div className='flex items-center justify-between rounded-lg bg-gray-50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-medium text-white'>
                  MB
                </div>
                <div>
                  <p className='font-medium'>Mike Brown</p>
                  <p className='text-muted-foreground text-sm'>
                    mike@example.com
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium'>67% Complete</p>
                <p className='text-muted-foreground text-xs'>Active</p>
              </div>
            </div>

            <div className='flex items-center justify-between rounded-lg bg-gray-50 p-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-medium text-white'>
                  ED
                </div>
                <div>
                  <p className='font-medium'>Emily Davis</p>
                  <p className='text-muted-foreground text-sm'>
                    emily@example.com
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium'>43% Complete</p>
                <p className='text-muted-foreground text-xs'>Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CourseStudents({ courseId }: CourseStudentsProps) {
  // Fetch real course students data
  const { data: studentsData, isLoading, error } = useCourseStudents(courseId)
  const students = studentsData?.data || []

  // Show mock data with notice if API is not available
  const showMockData = error && students.length === 0

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2'></div>
          <p className='text-muted-foreground'>Loading students...</p>
        </div>
      </div>
    )
  }

  if (showMockData) {
    return (
      <div className='space-y-4'>
        <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
          <div className='flex items-center space-x-2'>
            <AlertCircle className='h-5 w-5 text-yellow-600' />
            <div>
              <h4 className='text-sm font-semibold text-yellow-800'>
                Demo Mode
              </h4>
              <p className='text-sm text-yellow-700'>
                Students data endpoint is not implemented yet. Showing sample
                data for demonstration.
              </p>
            </div>
          </div>
        </div>
        <MockStudentsDisplay courseId={courseId} />
      </div>
    )
  }

  // If we have real data, render it (this would be the real implementation)
  return (
    <div className='flex items-center justify-center py-8'>
      <div className='text-center'>
        <Users className='text-muted-foreground mx-auto mb-4 h-8 w-8' />
        <h3 className='mb-2 text-lg font-semibold'>Students Data Available</h3>
        <p className='text-muted-foreground'>
          Found {students.length} students. Real data implementation goes here.
        </p>
      </div>
    </div>
  )
}
