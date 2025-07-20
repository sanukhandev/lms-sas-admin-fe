import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, Users, Target, TrendingUp } from 'lucide-react'
import { useCourseStats } from '@/hooks/use-courses'

export function CourseStats() {
  const { data: statsResponse, isLoading } = useCourseStats()

  const stats = statsResponse?.data || {
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalEnrollments: 0,
    averageRating: 0,
    totalRevenue: 0,
    categoriesCount: 0,
    instructorsCount: 0,
  }

  if (isLoading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                <Skeleton className='h-4 w-24' />
              </CardTitle>
              <Skeleton className='h-4 w-4' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-16 mb-2' />
              <Skeleton className='h-3 w-32' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Courses</CardTitle>
          <BookOpen className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.totalCourses}</div>
          <p className='text-xs text-muted-foreground'>
            {stats.publishedCourses} published
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Enrollments</CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.totalEnrollments.toLocaleString()}</div>
          <p className='text-xs text-muted-foreground'>
            Across all courses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Average Rating</CardTitle>
          <Target className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.averageRating.toFixed(1)}</div>
          <p className='text-xs text-muted-foreground'>
            Platform average
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Published Courses</CardTitle>
          <TrendingUp className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.publishedCourses}</div>
          <p className='text-xs text-muted-foreground'>
            Currently available
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
