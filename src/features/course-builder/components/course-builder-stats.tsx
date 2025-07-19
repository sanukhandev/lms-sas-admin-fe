import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, Clock, TrendingUp } from 'lucide-react'

interface CourseBuilderStatsProps {
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  totalDuration: number
}

export function CourseBuilderStats({
  totalCourses,
  publishedCourses,
  draftCourses,
  totalDuration,
}: CourseBuilderStatsProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Courses</CardTitle>
          <BookOpen className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{totalCourses.toLocaleString()}</div>
          <p className='text-xs text-muted-foreground'>
            All courses in the system
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Published</CardTitle>
          <TrendingUp className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{publishedCourses.toLocaleString()}</div>
          <p className='text-xs text-muted-foreground'>
            Live courses available to students
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Drafts</CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{draftCourses.toLocaleString()}</div>
          <p className='text-xs text-muted-foreground'>
            Courses in development
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Duration</CardTitle>
          <Clock className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{formatDuration(totalDuration)}</div>
          <p className='text-xs text-muted-foreground'>
            Combined content duration
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
