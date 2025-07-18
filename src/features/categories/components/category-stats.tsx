import {
  BookOpen,
  FolderOpen,
  GitBranch,
  Users,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategoryStats } from '../hooks/use-categories'

export function CategoryStats() {
  const { data: stats, isLoading, error } = useCategoryStats()

  if (isLoading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-4' />
            </CardHeader>
            <CardContent>
              <Skeleton className='mb-2 h-8 w-20' />
              <Skeleton className='h-3 w-32' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='text-center text-red-500'>
            Failed to load category statistics
          </div>
        </CardContent>
      </Card>
    )
  }
  const metrics = [
    {
      title: 'Total Categories',
      value: stats?.data?.totalCategories || 0,
      description: 'All categories',
      icon: FolderOpen,
      trend:
        (stats?.data?.totalCategories || 0) > 0
          ? `${stats?.data.totalCategories} total`
          : 'No categories yet',
    },
    {
      title: 'Root Categories',
      value: stats?.data?.rootCategories || 0,
      description: 'Main categories',
      icon: GitBranch,
      trend: `${stats?.data?.subcategories || 0} subcategories`,
    },
    {
      title: 'Total Courses',
      value: stats?.data?.totalCourses || 0,
      description: 'Courses in categories',
      icon: BookOpen,
      trend: `${stats?.data?.activeCourses || 0} active courses`,
    },
    {
      title: 'Total Students',
      value: stats?.data?.totalStudents || 0,
      description: 'Enrolled students',
      icon: Users,
      trend: `${(stats?.data?.averageCoursesPerCategory || 0).toFixed(1)} avg courses per category`,
    },
  ]

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
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
                <div className='mt-2 flex items-center text-xs text-green-600'>
                  <TrendingUp className='mr-1 h-3 w-3' />
                  {metric.trend}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Most Popular Categories */}
      {stats?.data?.mostPopularCategories &&
        stats?.data?.mostPopularCategories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Trophy className='h-5 w-5 text-yellow-500' />
                Most Popular Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {stats.data.mostPopularCategories
                  .slice(0, 5)
                  .map((category, index) => (
                    <div
                      key={category.id}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center space-x-3'>
                        <div className='bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold'>
                          #{index + 1}
                        </div>
                        <div>
                          <p className='text-sm font-medium'>{category.name}</p>
                          <p className='text-muted-foreground text-xs'>
                            {category.courses_count} courses
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-sm font-medium'>
                          {category.students_count} students
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  )
}
