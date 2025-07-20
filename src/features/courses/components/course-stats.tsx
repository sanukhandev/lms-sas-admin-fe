import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, Users, TrendingUp, BarChart3, FileText } from 'lucide-react'
import { useCourseStats } from '@/hooks/use-courses'
import { TopCourses } from './top-courses'

export function CourseStats() {
  const { data: statsResponse, isLoading, error } = useCourseStats()

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
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
      </div>
    )
  }

  const stats = statsResponse?.data || {
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalActiveStudents: 0,
    averageCompletionRate: 0,
    topPerformingCourses: []
  }

  return (
    <div className='space-y-6'>
      {/* Main Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Courses</CardTitle>
            <BookOpen className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalCourses}</div>
            <p className='text-xs text-muted-foreground'>
              {stats.publishedCourses} published, {stats.draftCourses} draft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Students</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{(stats.totalActiveStudents || 0).toLocaleString()}</div>
            <p className='text-xs text-muted-foreground'>
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Avg Completion Rate</CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{(stats.averageCompletionRate || 0).toFixed(1)}%</div>
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

      {/* Top Performing Courses */}
      <TopCourses courses={stats.topPerformingCourses || []} />

      {error && (
        <Card className='border-destructive'>
          <CardContent className='pt-6'>
            <div className='flex items-center space-x-2 text-destructive'>
              <FileText className='h-4 w-4' />
              <span className='text-sm'>Failed to load course statistics</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
