import { useQuery } from '@tanstack/react-query'
import { coursesService } from '@/services/courses'
import { BookOpen, Users, TrendingUp, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function CoursesOverview() {
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['dashboard-courses'],
    queryFn: () => coursesService.getCourses(1, 100), // Get more courses for overview
  })

  const courses = coursesData?.data || []

  const totalCourses = courses.length
  const activeCourses = courses.filter((c) => c.status === 'active').length
  const totalEnrollments = courses.reduce(
    (sum, course) => sum + course.enrollments,
    0
  )
  const totalCompletions = courses.reduce(
    (sum, course) => sum + course.completions,
    0
  )
  const averageCompletionRate =
    totalEnrollments > 0 ? (totalCompletions / totalEnrollments) * 100 : 0

  const metrics = [
    {
      title: 'Total Courses',
      value: totalCourses,
      description: `${activeCourses} active courses`,
      icon: BookOpen,
    },
    {
      title: 'Total Enrollments',
      value: totalEnrollments,
      description: 'Students enrolled',
      icon: Users,
    },
    {
      title: 'Completions',
      value: totalCompletions,
      description: 'Courses completed',
      icon: Target,
    },
    {
      title: 'Completion Rate',
      value: `${averageCompletionRate.toFixed(1)}%`,
      description: 'Average completion rate',
      icon: TrendingUp,
    },
  ]

  if (isLoading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                <Skeleton className='h-4 w-[100px]' />
              </CardTitle>
              <Skeleton className='h-4 w-4' />
            </CardHeader>
            <CardContent>
              <Skeleton className='mb-1 h-7 w-[60px]' />
              <Skeleton className='h-4 w-[120px]' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {metric.title}
              </CardTitle>
              <Icon className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{metric.value}</div>
              <p className='text-muted-foreground text-xs'>
                {metric.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
