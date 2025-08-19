import { useState } from 'react'
import {
  Search,
  Filter,
  UserPlus,
  Mail,
  MoreHorizontal,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { useCourseStudents } from '@/hooks/use-courses'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface CourseStudentsProps {
  courseId: string
}

interface Student {
  id: string
  name: string
  email: string
  avatar?: string
  enrolledAt: string
  lastActivity: string
  progress: number
  status: 'active' | 'completed' | 'inactive'
  lessonsCompleted: number
  totalLessons: number
  timeSpent: string
  certificateIssued: boolean
}

export function CourseStudents({ courseId }: CourseStudentsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('enrolledAt')

  // Fetch real course students data
  const { data: studentsData, isLoading, error } = useCourseStudents(courseId)
  const students = studentsData?.data || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load students data</p>
        </div>
      </div>
    )
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || student.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant='default' className='bg-blue-100 text-blue-800'>
            Active
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant='default' className='bg-green-100 text-green-800'>
            Completed
          </Badge>
        )
      case 'inactive':
        return <Badge variant='secondary'>Inactive</Badge>
      default:
        return <Badge variant='secondary'>{status}</Badge>
    }
  }

  const getStatusIcon = (status: Student['status']) => {
    switch (status) {
      case 'active':
        return <Clock className='h-4 w-4 text-blue-600' />
      case 'completed':
        return <CheckCircle className='h-4 w-4 text-green-600' />
      case 'inactive':
        return <AlertCircle className='h-4 w-4 text-gray-400' />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const totalStudents = students.length
  const activeStudents = students.filter((s) => s.status === 'active').length
  const completedStudents = students.filter(
    (s) => s.status === 'completed'
  ).length
  const averageProgress = Math.round(
    students.reduce((acc, s) => acc + s.progress, 0) / students.length
  )

  return (
    <div className='space-y-6'>
      {/* Stats Overview */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  Total Students
                </p>
                <p className='text-2xl font-bold'>{totalStudents}</p>
              </div>
              <UserPlus className='text-muted-foreground h-8 w-8' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  Active Students
                </p>
                <p className='text-2xl font-bold'>{activeStudents}</p>
              </div>
              <Clock className='h-8 w-8 text-blue-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  Completed
                </p>
                <p className='text-2xl font-bold'>{completedStudents}</p>
              </div>
              <CheckCircle className='h-8 w-8 text-green-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  Avg. Progress
                </p>
                <p className='text-2xl font-bold'>{averageProgress}%</p>
              </div>
              <div className='relative h-8 w-8'>
                <Progress value={averageProgress} className='h-2 w-8' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <CardTitle>Students</CardTitle>
            <div className='flex flex-col gap-2 md:flex-row'>
              <div className='relative'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                <Input
                  placeholder='Search students...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 md:w-[300px]'
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-full md:w-[140px]'>
                  <Filter className='mr-2 h-4 w-4' />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  <SelectItem value='active'>Active</SelectItem>
                  <SelectItem value='completed'>Completed</SelectItem>
                  <SelectItem value='inactive'>Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='w-full md:w-[160px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='enrolledAt'>Enrollment Date</SelectItem>
                  <SelectItem value='lastActivity'>Last Activity</SelectItem>
                  <SelectItem value='progress'>Progress</SelectItem>
                  <SelectItem value='name'>Name</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' size='sm'>
                <Download className='mr-2 h-4 w-4' />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Time Spent</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>
                          {student.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-medium'>{student.name}</p>
                        <p className='text-muted-foreground text-sm'>
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='space-y-1'>
                      <div className='flex items-center justify-between text-sm'>
                        <span>{student.progress}%</span>
                        <span className='text-muted-foreground'>
                          {student.lessonsCompleted}/{student.totalLessons}
                        </span>
                      </div>
                      <Progress value={student.progress} className='h-1' />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      {getStatusIcon(student.status)}
                      {getStatusBadge(student.status)}
                    </div>
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {formatDate(student.lastActivity)}
                  </TableCell>
                  <TableCell className='text-sm'>{student.timeSpent}</TableCell>
                  <TableCell className='text-muted-foreground text-sm'>
                    {formatDate(student.enrolledAt)}
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='sm'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem>
                          <Mail className='mr-2 h-4 w-4' />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Progress</DropdownMenuItem>
                        <DropdownMenuItem>Reset Progress</DropdownMenuItem>
                        {student.status === 'completed' &&
                          !student.certificateIssued && (
                            <DropdownMenuItem>
                              Issue Certificate
                            </DropdownMenuItem>
                          )}
                        <DropdownMenuItem className='text-red-600'>
                          Remove Student
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
