import { useState } from 'react'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  CalendarDays,
  Clock,
  Users,
  Target,
  TrendingUp,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  BookOpen,
  Video,
  FileText,
  MessageSquare,
  Award,
  Bell,
  Download,
  Plus,
  Eye,
  Edit,
} from 'lucide-react'

import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

// Types
interface CourseEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: {
    type: 'class' | 'assignment' | 'quiz' | 'live_session' | 'deadline'
    course_id: string
    module_id?: string
    chapter_id?: string
    class_id?: string
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
    participants?: number
    max_participants?: number
    instructor?: string
    description?: string
    color?: string
  }
}

interface CourseMetrics {
  total_students: number
  active_students: number
  completion_rate: number
  average_progress: number
  engagement_score: number
  total_content_hours: number
  consumed_hours: number
  upcoming_deadlines: number
  overdue_assignments: number
}

interface StudentProgress {
  student_id: string
  student_name: string
  student_email: string
  enrollment_date: Date
  last_activity: Date
  overall_progress: number
  current_module: string
  completed_classes: number
  total_classes: number
  quiz_scores: number[]
  assignment_scores: number[]
  discussion_posts: number
  certificates_earned: number
  status: 'active' | 'inactive' | 'completed' | 'dropped'
}

interface CoursePlannerProps {
  courseId: string
}

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  type: z.enum(['class', 'assignment', 'quiz', 'live_session', 'deadline']),
  start_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  description: z.string().optional(),
  max_participants: z.number().optional(),
  instructor: z.string().optional(),
})

const eventTypes = {
  class: { label: 'Class Session', color: '#3b82f6', icon: Video },
  assignment: { label: 'Assignment Due', color: '#f59e0b', icon: FileText },
  quiz: { label: 'Quiz/Test', color: '#ef4444', icon: BookOpen },
  live_session: { label: 'Live Session', color: '#10b981', icon: Users },
  deadline: { label: 'Deadline', color: '#8b5cf6', icon: AlertCircle },
}

// Mock data
const mockEvents: CourseEvent[] = [
  {
    id: '1',
    title: 'Module 1: Introduction',
    start: new Date(2024, 11, 20, 10, 0),
    end: new Date(2024, 11, 20, 11, 0),
    resource: {
      type: 'class',
      course_id: 'course-1',
      status: 'scheduled',
      participants: 25,
      max_participants: 30,
      instructor: 'John Doe',
      color: '#3b82f6'
    }
  },
  {
    id: '2',
    title: 'Assignment 1 Due',
    start: new Date(2024, 11, 22, 23, 59),
    end: new Date(2024, 11, 22, 23, 59),
    resource: {
      type: 'assignment',
      course_id: 'course-1',
      status: 'scheduled',
      color: '#f59e0b'
    }
  },
  {
    id: '3',
    title: 'Live Q&A Session',
    start: new Date(2024, 11, 25, 14, 0),
    end: new Date(2024, 11, 25, 15, 0),
    resource: {
      type: 'live_session',
      course_id: 'course-1',
      status: 'scheduled',
      participants: 15,
      max_participants: 50,
      instructor: 'Jane Smith',
      color: '#10b981'
    }
  },
]

const mockMetrics: CourseMetrics = {
  total_students: 127,
  active_students: 98,
  completion_rate: 73,
  average_progress: 67,
  engagement_score: 82,
  total_content_hours: 40,
  consumed_hours: 28,
  upcoming_deadlines: 3,
  overdue_assignments: 2,
}

const mockStudentProgress: StudentProgress[] = [
  {
    student_id: '1',
    student_name: 'Alice Johnson',
    student_email: 'alice@example.com',
    enrollment_date: new Date(2024, 10, 1),
    last_activity: new Date(2024, 11, 18),
    overall_progress: 85,
    current_module: 'Module 3: Advanced Concepts',
    completed_classes: 17,
    total_classes: 20,
    quiz_scores: [88, 92, 76, 94],
    assignment_scores: [85, 90, 88],
    discussion_posts: 12,
    certificates_earned: 1,
    status: 'active',
  },
  {
    student_id: '2',
    student_name: 'Bob Smith',
    student_email: 'bob@example.com',
    enrollment_date: new Date(2024, 10, 5),
    last_activity: new Date(2024, 11, 15),
    overall_progress: 45,
    current_module: 'Module 2: Fundamentals',
    completed_classes: 9,
    total_classes: 20,
    quiz_scores: [72, 68, 85],
    assignment_scores: [75, 82],
    discussion_posts: 6,
    certificates_earned: 0,
    status: 'active',
  },
  {
    student_id: '3',
    student_name: 'Carol Davis',
    student_email: 'carol@example.com',
    enrollment_date: new Date(2024, 9, 15),
    last_activity: new Date(2024, 11, 19),
    overall_progress: 100,
    current_module: 'Course Completed',
    completed_classes: 20,
    total_classes: 20,
    quiz_scores: [95, 88, 92, 96, 90],
    assignment_scores: [92, 88, 95, 90],
    discussion_posts: 18,
    certificates_earned: 2,
    status: 'completed',
  },
]

export function CoursePlanner({ courseId }: CoursePlannerProps) {
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState<CourseEvent[]>(mockEvents)
  const [selectedEvent, setSelectedEvent] = useState<CourseEvent | null>(null)
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [studentFilter, setStudentFilter] = useState<'all' | 'active' | 'struggling' | 'completed'>('all')

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      type: 'class' as const,
      start_date: '',
      start_time: '',
      end_time: '',
      description: '',
      max_participants: undefined,
      instructor: '',
    }
  })

  const eventStyleGetter = (event: CourseEvent) => {
    const backgroundColor = event.resource.color || '#3b82f6'
    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        fontSize: '12px',
        padding: '2px 4px',
      }
    }
  }

  const handleSelectEvent = (event: CourseEvent) => {
    setSelectedEvent(event)
  }

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const startDate = moment(start).format('YYYY-MM-DD')
    const startTime = moment(start).format('HH:mm')
    const endTime = moment(end).format('HH:mm')
    
    form.setValue('start_date', startDate)
    form.setValue('start_time', startTime)
    form.setValue('end_time', endTime)
    setCreateEventOpen(true)
  }

  const createEvent = (data: z.infer<typeof eventSchema>) => {
    const startDateTime = moment(`${data.start_date} ${data.start_time}`).toDate()
    const endDateTime = moment(`${data.start_date} ${data.end_time}`).toDate()

    const newEvent: CourseEvent = {
      id: `event-${Date.now()}`,
      title: data.title,
      start: startDateTime,
      end: endDateTime,
      resource: {
        type: data.type,
        course_id: courseId,
        status: 'scheduled',
        max_participants: data.max_participants,
        instructor: data.instructor,
        description: data.description,
        color: eventTypes[data.type].color,
      }
    }

    setEvents([...events, newEvent])
    form.reset()
    setCreateEventOpen(false)
    toast.success('Event created successfully')
  }

  const getFilteredStudents = () => {
    switch (studentFilter) {
      case 'active':
        return mockStudentProgress.filter(s => s.status === 'active' && s.overall_progress < 100)
      case 'struggling':
        return mockStudentProgress.filter(s => s.overall_progress < 50 || 
          (s.quiz_scores.length > 0 && s.quiz_scores[s.quiz_scores.length - 1] < 70))
      case 'completed':
        return mockStudentProgress.filter(s => s.status === 'completed')
      default:
        return mockStudentProgress
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'dropped': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Course Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{mockMetrics.total_students}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
                <div className="text-xs text-green-600">+{mockMetrics.active_students} active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{mockMetrics.completion_rate}%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
                <div className="text-xs text-blue-600">Avg: {mockMetrics.average_progress}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{mockMetrics.engagement_score}%</div>
                <div className="text-sm text-muted-foreground">Engagement</div>
                <div className="text-xs text-purple-600">
                  {mockMetrics.consumed_hours}h/{mockMetrics.total_content_hours}h
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{mockMetrics.upcoming_deadlines}</div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
                <div className="text-xs text-red-600">{mockMetrics.overdue_assignments} overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Schedule</CardTitle>
                  <CardDescription>
                    Plan and manage your course timeline, classes, and deadlines
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" onClick={() => setCreateEventOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={view === Views.MONTH ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setView(Views.MONTH)}
                    >
                      Month
                    </Button>
                    <Button
                      variant={view === Views.WEEK ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setView(Views.WEEK)}
                    >
                      Week
                    </Button>
                    <Button
                      variant={view === Views.DAY ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setView(Views.DAY)}
                    >
                      Day
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDate(moment(date).subtract(1, view === Views.MONTH ? 'month' : view === Views.WEEK ? 'week' : 'day').toDate())}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDate(moment(date).add(1, view === Views.MONTH ? 'month' : view === Views.WEEK ? 'week' : 'day').toDate())}
                    >
                      Next
                    </Button>
                  </div>
                </div>

                <div style={{ height: '600px' }}>
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    view={view}
                    onView={setView}
                    date={date}
                    onNavigate={setDate}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    eventPropGetter={eventStyleGetter}
                    popup
                    tooltipAccessor="title"
                    showMultiDayTimes
                    step={15}
                    timeslots={4}
                  />
                </div>

                {/* Event Legend */}
                <div className="flex flex-wrap gap-4 pt-4 border-t">
                  {Object.entries(eventTypes).map(([type, config]) => {
                    const Icon = config.icon
                    return (
                      <div key={type} className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: config.color }}
                        />
                        <Icon className="h-4 w-4" style={{ color: config.color }} />
                        <span className="text-sm">{config.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progress Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Course Progress</span>
                      <span>{mockMetrics.average_progress}%</span>
                    </div>
                    <Progress value={mockMetrics.average_progress} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completion Rate</span>
                      <span>{mockMetrics.completion_rate}%</span>
                    </div>
                    <Progress value={mockMetrics.completion_rate} />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Engagement Score</span>
                      <span>{mockMetrics.engagement_score}%</span>
                    </div>
                    <Progress value={mockMetrics.engagement_score} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Student Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-sm">Completed</span>
                    </div>
                    <span className="text-sm font-medium">
                      {mockStudentProgress.filter(s => s.status === 'completed').length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-sm">Active</span>
                    </div>
                    <span className="text-sm font-medium">
                      {mockStudentProgress.filter(s => s.status === 'active').length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-sm">Struggling (&lt;50%)</span>
                    </div>
                    <span className="text-sm font-medium">
                      {mockStudentProgress.filter(s => s.overall_progress < 50).length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-sm">Inactive</span>
                    </div>
                    <span className="text-sm font-medium">
                      {mockStudentProgress.filter(s => s.status === 'inactive').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity Trends</CardTitle>
              <CardDescription>Student engagement and progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Chart visualization would go here (integrate with charts library)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Progress Tracking</CardTitle>
                  <CardDescription>Monitor individual student performance and engagement</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={studentFilter} onValueChange={(value: any) => setStudentFilter(value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="active">Active Students</SelectItem>
                      <SelectItem value="struggling">Struggling Students</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredStudents().map((student) => (
                  <Card key={student.student_id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {student.student_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{student.student_name}</h4>
                          <p className="text-sm text-muted-foreground">{student.student_email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(student.status)}>
                              {student.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Enrolled {moment(student.enrollment_date).format('MMM D, YYYY')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <div className="text-2xl font-bold text-primary">{student.overall_progress}%</div>
                        <Progress value={student.overall_progress} className="w-24" />
                        <div className="text-xs text-muted-foreground">
                          {student.completed_classes}/{student.total_classes} classes
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Current Module</div>
                        <div className="font-medium">{student.current_module}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Last Activity</div>
                        <div className="font-medium">{moment(student.last_activity).fromNow()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Quiz Score</div>
                        <div className="font-medium">
                          {student.quiz_scores.length > 0 
                            ? Math.round(student.quiz_scores.reduce((a, b) => a + b, 0) / student.quiz_scores.length)
                            : 'N/A'}%
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Engagement</div>
                        <div className="font-medium flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {student.discussion_posts}
                          <Award className="h-3 w-3 ml-2" />
                          {student.certificates_earned}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      {student.overall_progress < 50 && (
                        <Button variant="outline" size="sm" className="text-orange-600">
                          <Bell className="h-3 w-3 mr-1" />
                          Send Reminder
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Schedule
              </CardTitle>
              <CardDescription>Manage upcoming classes, deadlines, and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events
                  .filter(event => moment(event.start).isAfter(moment()))
                  .sort((a, b) => moment(a.start).diff(moment(b.start)))
                  .slice(0, 10)
                  .map((event) => {
                    const EventIcon = eventTypes[event.resource.type].icon
                    return (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${event.resource.color}20` }}
                          >
                            <EventIcon 
                              className="h-5 w-5" 
                              style={{ color: event.resource.color }}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {moment(event.start).format('MMM D, YYYY [at] h:mm A')}
                              {event.resource.instructor && ` • ${event.resource.instructor}`}
                            </p>
                            {event.resource.participants && event.resource.max_participants && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {event.resource.participants}/{event.resource.max_participants} participants
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline"
                            style={{ 
                              borderColor: event.resource.color,
                              color: event.resource.color 
                            }}
                          >
                            {eventTypes[event.resource.type].label}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Event Dialog */}
      <Dialog open={createEventOpen} onOpenChange={setCreateEventOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Schedule a new class, assignment, quiz, or deadline for your course
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(createEvent)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Module 2: Advanced JavaScript" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(eventTypes).map(([type, config]) => {
                            const Icon = config.icon
                            return (
                              <SelectItem key={type} value={type}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {config.label}
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instructor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructor (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_participants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Participants (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="50"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional details about this event..."
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateEventOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Event</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {(() => {
                  const Icon = eventTypes[selectedEvent.resource.type].icon
                  return <Icon className="h-5 w-5" style={{ color: selectedEvent.resource.color }} />
                })()}
                {selectedEvent.title}
              </DialogTitle>
              <DialogDescription>
                {eventTypes[selectedEvent.resource.type].label} • {moment(selectedEvent.start).format('MMM D, YYYY [at] h:mm A')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedEvent.resource.instructor && (
                <div>
                  <h4 className="font-medium">Instructor</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.resource.instructor}</p>
                </div>
              )}
              
              {selectedEvent.resource.participants && selectedEvent.resource.max_participants && (
                <div>
                  <h4 className="font-medium">Participants</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.resource.participants} / {selectedEvent.resource.max_participants} enrolled
                  </p>
                  <Progress 
                    value={(selectedEvent.resource.participants / selectedEvent.resource.max_participants) * 100} 
                    className="mt-2"
                  />
                </div>
              )}

              {selectedEvent.resource.description && (
                <div>
                  <h4 className="font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.resource.description}</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Badge 
                  variant="outline"
                  style={{ 
                    borderColor: selectedEvent.resource.color,
                    color: selectedEvent.resource.color 
                  }}
                >
                  {selectedEvent.resource.status}
                </Badge>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
