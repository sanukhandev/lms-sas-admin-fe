import { useState, useEffect } from 'react'
import { coursesService, type ClassSession, type CourseStructure } from '@/services/courses'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Clock, 
  User, 
  Video, 
  Plus, 
  Edit, 
  Trash2, 
  Play,
  Users,
  MoreHorizontal,
  Filter
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format, isAfter, isBefore, isToday } from 'date-fns'
import { toast } from 'sonner'
import { ScheduleClassDialog } from './schedule-class-dialog'
import { EditScheduleDialog } from './edit-schedule-dialog'

interface ClassSchedulerProps {
  courseId: string
}

export function ClassScheduler({ courseId }: ClassSchedulerProps) {
  const [classes, setClasses] = useState<ClassSession[]>([])
  const [courseStructure, setCourseStructure] = useState<CourseStructure | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [filterContent, setFilterContent] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  
  // Dialog states
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassSession | null>(null)

  useEffect(() => {
    loadData()
  }, [courseId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [classesResponse, structureResponse] = await Promise.all([
        coursesService.getCourseClasses(courseId),
        coursesService.getCourseStructure(courseId)
      ])
      setClasses(classesResponse.data)
      setCourseStructure(structureResponse.data)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load class schedule')
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleClass = () => {
    setShowScheduleDialog(true)
  }

  const handleEditClass = (classSession: ClassSession) => {
    setEditingClass(classSession)
  }

  const handleDeleteClass = async (classId: string) => {
    if (!confirm('Are you sure you want to cancel this class?')) {
      return
    }

    try {
      await coursesService.cancelClass(courseId, classId)
      toast.success('Class cancelled successfully')
      loadData()
    } catch (error) {
      console.error('Error cancelling class:', error)
      toast.error('Failed to cancel class')
    }
  }

  const getFilteredClasses = () => {
    let filtered = classes

    // Filter by tab
    const now = new Date()
    switch (activeTab) {
      case 'upcoming':
        filtered = filtered.filter(cls => isAfter(new Date(cls.scheduledAt), now))
        break
      case 'today':
        filtered = filtered.filter(cls => isToday(new Date(cls.scheduledAt)))
        break
      case 'past':
        filtered = filtered.filter(cls => isBefore(new Date(cls.scheduledAt), now))
        break
    }

    // Filter by content
    if (filterContent !== 'all') {
      filtered = filtered.filter(cls => cls.contentId === filterContent)
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(cls => cls.status === filterStatus)
    }

    return filtered.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>
      case 'in_progress':
        return <Badge variant="default">Live</Badge>
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getContentOptions = () => {
    if (!courseStructure) return []
    
    const options = [{ value: 'all', label: 'All Content' }]
    
    courseStructure.modules.forEach(module => {
      options.push({ value: module.id, label: `Module: ${module.title}` })
      module.chapters.forEach(chapter => {
        options.push({ value: chapter.id, label: `  Chapter: ${chapter.title}` })
      })
    })
    
    return options
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading class schedule...</p>
        </div>
      </div>
    )
  }

  const filteredClasses = getFilteredClasses()

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Class Schedule</CardTitle>
              <CardDescription>
                Manage scheduled classes for your course
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {classes.length} total classes
              </Badge>
              <Button onClick={handleScheduleClass}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Class
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={filterContent} onValueChange={setFilterContent}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by content" />
              </SelectTrigger>
              <SelectContent>
                {getContentOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">Live</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Class List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Classes</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredClasses.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No Classes Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === 'all' 
                      ? 'No classes have been scheduled yet.'
                      : `No classes match the current filter: ${activeTab}.`
                    }
                  </p>
                  <Button onClick={handleScheduleClass}>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule First Class
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredClasses.map((classSession) => (
                <Card key={classSession.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {classSession.contentTitle || 'General Class'}
                            </h3>
                            {getStatusBadge(classSession.status)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {format(new Date(classSession.scheduledAt), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {format(new Date(classSession.scheduledAt), 'HH:mm')} 
                                ({classSession.durationMins}min)
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>{classSession.tutorName || 'TBD'}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center space-x-2 text-sm">
                              <Users className="h-4 w-4" />
                              <span>{classSession.studentsCount} students</span>
                            </div>
                            
                            {classSession.isRecorded && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Video className="h-4 w-4" />
                                <span>Recording enabled</span>
                              </div>
                            )}
                            
                            {classSession.meetingUrl && (
                              <div className="flex items-center space-x-2 text-sm">
                                <Play className="h-4 w-4" />
                                <span>Meeting link available</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {classSession.status === 'scheduled' && isToday(new Date(classSession.scheduledAt)) && (
                          <Button size="sm">
                            <Play className="mr-2 h-4 w-4" />
                            Start Class
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClass(classSession)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Class
                            </DropdownMenuItem>
                            {classSession.meetingUrl && (
                              <DropdownMenuItem onClick={() => window.open(classSession.meetingUrl, '_blank')}>
                                <Video className="mr-2 h-4 w-4" />
                                Join Meeting
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClass(classSession.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Cancel Class
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ScheduleClassDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        courseId={courseId}
        courseStructure={courseStructure}
        onSuccess={loadData}
      />

      {editingClass && (
        <EditScheduleDialog
          open={!!editingClass}
          onOpenChange={(open) => !open && setEditingClass(null)}
          courseId={courseId}
          classSession={editingClass}
          courseStructure={courseStructure}
          onSuccess={loadData}
        />
      )}
    </div>
  )
}
