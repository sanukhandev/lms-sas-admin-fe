import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FolderTree, Folders, Target, TrendingUp } from 'lucide-react'
import { useCategoryStats } from '@/hooks/use-categories'

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

  // Provide fallback data for error or missing data
  const statsData = stats?.data || {
    totalCategories: 0,
    rootCategories: 0,
    activeCourses: 0,
    averageCoursesPerCategory: 0
  }

  const fallbackStats = {
    data: statsData
  }

  return <CategoryStatsDisplay stats={fallbackStats} showError={!!error || !stats} />
}

function CategoryStatsDisplay({ stats, showError }: { 
  stats: { data: { totalCategories: number; rootCategories: number; activeCourses: number; averageCoursesPerCategory: number } }; 
  showError: boolean 
}) {
  const metrics = [
    {
      title: 'Total Categories',
      value: stats?.data?.totalCategories || 0,
      description: showError ? 'API Error - showing defaults' : 'All categories',
      icon: Folders,
    },
    {
      title: 'Root Categories',
      value: stats?.data?.rootCategories || 0,
      description: showError ? 'API Error - showing defaults' : 'Top-level categories',
      icon: FolderTree,
    },
    {
      title: 'Active Courses',
      value: stats?.data?.activeCourses || 0,
      description: showError ? 'API Error - showing defaults' : 'Courses in categories',
      icon: Target,
    },
    {
      title: 'Avg Courses/Category',
      value: (stats?.data?.averageCoursesPerCategory || 0).toFixed(1),
      description: showError ? 'API Error - showing defaults' : 'Course distribution',
      icon: TrendingUp,
    },
  ]

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.title} className={showError ? 'border-yellow-200' : ''}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${showError ? 'text-yellow-500' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{metric.value}</div>
              <p className={`text-xs ${showError ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                {metric.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
