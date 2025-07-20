import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Target, TrendingUp, FileText, BarChart3 } from 'lucide-react'
import { useCourseStats } from '@/hooks/use-courses'

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

  // Provide fallback data for error or missing data
  const stats = statsResponse?.data || {
    total_courses: 0,
    published_courses: 0,
    draft_courses: 0,
    total_active_students: 0,
    average_completion_rate: 0,
    top_performing_courses: []
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
            <div className='text-2xl font-bold'>{stats.total_courses}</div>
            <p className='text-xs text-muted-foreground'>
              {stats.published_courses} published, {stats.draft_courses} draft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Students</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.total_active_students.toLocaleString()}</div>
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
            <div className='text-2xl font-bold'>{stats.average_completion_rate.toFixed(1)}%</div>
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
            <div className='text-2xl font-bold'>{stats.published_courses}</div>
            <p className='text-xs text-muted-foreground'>
              Currently available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Courses */}
      {stats.top_performing_courses && stats.top_performing_courses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Target className='h-5 w-5' />
              <span>Top Performing Courses</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {stats.top_performing_courses.slice(0, 5).map((course, index) => (
                <div key={course.id} className='flex items-center justify-between p-3 border rounded-lg'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm'>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className='font-medium text-sm'>{course.title}</h4>
                      <p className='text-xs text-muted-foreground'>
                        {course.category_name} • {course.instructor_name}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-3 text-right'>
                    <div>
                      <div className='flex items-center space-x-1'>
                        <Users className='h-3 w-3 text-muted-foreground' />
                        <span className='text-sm font-medium'>{course.enrollment_count}</span>
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {course.completion_rate.toFixed(1)}% completion
                      </div>
                    </div>
                    <Badge 
                      variant={course.status === 'published' ? 'default' : 'secondary'}
                      className='text-xs'
                    >
                      {course.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
