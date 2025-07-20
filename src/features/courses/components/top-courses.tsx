import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Trophy, BookOpen, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Course } from '@/services/courses'

interface TopCoursesProps {
  courses: Course[]
  title?: string
  showCount?: number
}

export function TopCourses({ 
  courses, 
  title = "Top Performing Courses", 
  showCount = 5 
}: TopCoursesProps) {
  if (!courses || courses.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Trophy className='h-5 w-5 text-yellow-500' />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {courses.slice(0, showCount).map((course, index) => (
            <div
              key={course.id}
              className='flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors'
            >
              <div className='flex items-center space-x-3'>
                <div className='bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold'>
                  #{index + 1}
                </div>
                <Avatar className='h-10 w-10'>
                  <AvatarFallback className='bg-blue-100 text-blue-700'>
                    <BookOpen className='h-4 w-4' />
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium truncate'>{course.title}</p>
                  <p className='text-muted-foreground text-xs'>
                    {course.categoryName} • {course.instructorName}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-3 text-right'>
                <div>
                  <div className='flex items-center space-x-1 mb-1'>
                    <Users className='h-3 w-3 text-muted-foreground' />
                    <span className='text-sm font-medium'>{course.enrollmentCount}</span>
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {(course.completionRate || 0).toFixed(1)}% completion
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
        
        {courses.length > showCount && (
          <div className='mt-4 text-center'>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                // Navigate to full courses list
                const event = new CustomEvent('navigateToCourses')
                window.dispatchEvent(event)
              }}
            >
              View All {courses.length} Courses
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
