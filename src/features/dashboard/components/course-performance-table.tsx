import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Mock data for course performance
const coursePerformance = [
  {
    id: 1,
    courseName: 'Advanced React Development',
    instructor: 'Dr. Sarah Wilson',
    totalStudents: 156,
    completedStudents: 89,
    completionRate: 57,
    averageRating: 4.8,
    status: 'active',
  },
  {
    id: 2,
    courseName: 'Python for Data Science',
    instructor: 'Prof. Michael Chen',
    totalStudents: 203,
    completedStudents: 167,
    completionRate: 82,
    averageRating: 4.9,
    status: 'active',
  },
  {
    id: 3,
    courseName: 'UI/UX Design Fundamentals',
    instructor: 'Emma Rodriguez',
    totalStudents: 134,
    completedStudents: 98,
    completionRate: 73,
    averageRating: 4.7,
    status: 'active',
  },
  {
    id: 4,
    courseName: 'JavaScript Masterclass',
    instructor: 'David Kim',
    totalStudents: 189,
    completedStudents: 145,
    completionRate: 77,
    averageRating: 4.6,
    status: 'active',
  },
  {
    id: 5,
    courseName: 'Mobile App Development',
    instructor: 'Lisa Anderson',
    totalStudents: 92,
    completedStudents: 34,
    completionRate: 37,
    averageRating: 4.4,
    status: 'draft',
  },
]

export function CoursePerformanceTable() {
  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Completion Rate</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coursePerformance.map((course) => (
            <TableRow key={course.id}>
              <TableCell className='font-medium'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium'>{course.courseName}</p>
                  <p className='text-muted-foreground text-xs'>
                    {course.completedStudents}/{course.totalStudents} completed
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <p className='text-sm'>{course.instructor}</p>
              </TableCell>
              <TableCell>
                <p className='text-sm font-medium'>{course.totalStudents}</p>
              </TableCell>
              <TableCell>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Progress
                      value={course.completionRate}
                      className='h-2 w-16'
                    />
                    <span className='text-muted-foreground text-xs'>
                      {course.completionRate}%
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-1'>
                  <span className='text-sm font-medium'>
                    {course.averageRating}
                  </span>
                  <svg
                    className='h-4 w-4 text-yellow-400'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={course.status === 'active' ? 'default' : 'secondary'}
                >
                  {course.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
