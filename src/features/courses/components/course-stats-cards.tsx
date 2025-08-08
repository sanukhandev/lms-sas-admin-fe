import { BookOpen, Users, Clock, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCourses } from '../hooks/use-course-hierarchy'
import type { HierarchyNode } from '../types'

interface CourseStatsCardsProps {
  className?: string
}

export function CourseStatsCards({ className }: CourseStatsCardsProps) {
  const { data: coursesResponse, isLoading } = useCourses()
  const courses: HierarchyNode[] = coursesResponse?.data || []

  // Show skeleton loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4',
          className
        )}
      >
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-8 w-8 rounded-lg' />
            </CardHeader>
            <CardContent>
              <Skeleton className='mb-1 h-8 w-16' />
              <Skeleton className='h-3 w-20' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Calculate statistics
  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter(
      (course: HierarchyNode) => course.status === 'published'
    ).length,
    totalClasses: courses.reduce(
      (total: number, course: HierarchyNode) =>
        total + (course.class_count || 0),
      0
    ),
    averageDuration:
      courses.length > 0
        ? Math.round(
            courses.reduce(
              (total: number, course: HierarchyNode) =>
                total + (course.total_duration || 0),
              0
            ) /
              courses.length /
              60
          )
        : 0,
  }

  const statCards = [
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      description: `${stats.publishedCourses} published`,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: 'Published Courses',
      value: stats.publishedCourses,
      description: `${Math.round((stats.publishedCourses / (stats.totalCourses || 1)) * 100)}% of total`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      title: 'Total Classes',
      value: stats.totalClasses,
      description: 'Across all courses',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      title: 'Avg Duration',
      value: `${stats.averageDuration}h`,
      description: 'Per course',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
  ]

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-muted-foreground text-sm font-medium'>
                {stat.title}
              </CardTitle>
              <div className={cn('rounded-lg p-2', stat.bgColor)}>
                <Icon className={cn('h-4 w-4', stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
              <p className='text-muted-foreground text-xs'>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
