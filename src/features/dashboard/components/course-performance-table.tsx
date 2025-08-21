import { useQuery } from '@tanstack/react-query'
import { coursesService, type Course } from '@/services/courses'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function CoursePerformanceTable() {
  const {
    data: coursesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard-courses'],
    queryFn: () => coursesService.getCourses(1, 15),
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
          <CardDescription>
            Track course enrollment and completion rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[...Array(5)].map((_, index) => (
              <div key={index} className='flex items-center space-x-4'>
                <Skeleton className='h-12 w-12 rounded-full' />
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-[200px]' />
                  <Skeleton className='h-4 w-[150px]' />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Performance</CardTitle>
          <CardDescription>
            Track course enrollment and completion rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='py-8 text-center'>
            <p className='text-muted-foreground'>Failed to load course data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const courses = coursesData?.data || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Performance</CardTitle>
        <CardDescription>
          Track course enrollment and completion rates (
          {coursesData?.meta.total || 0} courses total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Completion Rate</TableHead>
              <TableHead>Avg Progress</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course: Course) => (
              <TableRow key={course.id}>
                <TableCell className='font-medium'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium'>{course.title}</p>
                    <p className='text-muted-foreground text-xs'>
                      {course.content_count}/{course.enrollment_count} completed
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className='text-sm'>{course.instructor_name || 'No instructor'}</p>
                </TableCell>
                <TableCell>
                  <p className='text-sm font-medium'>{course.enrollment_count}</p>
                </TableCell>
                <TableCell>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Progress
                        value={course.completion_rate}
                        className='h-2 w-16'
                      />
                      <span className='text-muted-foreground text-xs'>
                        {course.completion_rate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Progress
                      value={course.average_rating ? course.average_rating * 20 : 0}
                      className='h-2 w-16'
                    />
                    <span className='text-muted-foreground text-xs'>
                      {course.average_rating ? course.average_rating.toFixed(1) : '0.0'}/5
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      course.status === 'published' ? 'default' : 'secondary'
                    }
                  >
                    {course.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
