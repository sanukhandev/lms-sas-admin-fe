import { useState, useEffect } from 'react'
import { coursesService, type ClassSession, type SessionDetails } from '@/services/courses'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Square, 
  Users, 
  Clock, 
  Calendar,
  Video,
  Star,
  MessageSquare,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format, isToday } from 'date-fns'
import { toast } from 'sonner'

interface SessionManagerProps {
  courseId: string
}

export function SessionManager({ courseId }: SessionManagerProps) {
  const [sessions, setSessions] = useState<ClassSession[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadSessions()
  }, [courseId])

  const loadSessions = async () => {
    try {
      setLoading(true)
      const response = await coursesService.getCourseClasses(courseId)
      setSessions(response.data)
    } catch (error) {
      console.error('Error loading sessions:', error)
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleStartSession = async (sessionId: string) => {
    try {
      await coursesService.startSession(courseId, sessionId)
      toast.success('Session started successfully')
      loadSessions()
    } catch (error) {
      console.error('Error starting session:', error)
      toast.error('Failed to start session')
    }
  }

  const handleEndSession = async (sessionId: string) => {
    try {
      await coursesService.endSession(courseId, sessionId, {
        summary: 'Session completed' // This would come from a form
      })
      toast.success('Session ended successfully')
      loadSessions()
    } catch (error) {
      console.error('Error ending session:', error)
      toast.error('Failed to end session')
    }
  }

  const handleViewSession = (sessionId: string) => {
    toast.info(`View session details: ${sessionId}`)
  }

  const handleManageAttendance = (sessionId: string) => {
    toast.info(`Manage attendance for session: ${sessionId}`)
  }

  const getFilteredSessions = () => {
    switch (activeTab) {
      case 'live':
        return sessions.filter(s => s.status === 'in_progress')
      case 'completed':
        return sessions.filter(s => s.status === 'completed')
      case 'scheduled':
        return sessions.filter(s => s.status === 'scheduled')
      default:
        return sessions
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Play className="h-4 w-4 text-green-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading sessions...</p>
        </div>
      </div>
    )
  }

  const filteredSessions = getFilteredSessions()

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Sessions</CardTitle>
              <CardDescription>
                Manage live class sessions and track attendance
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {sessions.filter(s => s.status === 'in_progress').length} live
              </Badge>
              <Badge variant="outline">
                {sessions.filter(s => s.status === 'completed').length} completed
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sessions List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Sessions</TabsTrigger>
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredSessions.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No Sessions Found</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'all' 
                      ? 'No sessions have been created yet.'
                      : `No sessions match the current filter: ${activeTab}.`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <Card key={session.id} className={session.status === 'in_progress' ? 'border-green-200 bg-green-50/50' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            {getStatusIcon(session.status)}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {session.contentTitle || 'General Session'}
                            </h3>
                            {getStatusBadge(session.status)}
                            {session.status === 'in_progress' && isToday(new Date(session.scheduledAt)) && (
                              <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {format(new Date(session.scheduledAt), 'MMM dd, yyyy HH:mm')}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>{session.durationMins} minutes</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{session.studentsCount} students</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            {session.isRecorded && (
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Video className="h-4 w-4" />
                                <span>Recording</span>
                              </div>
                            )}
                            
                            {session.status === 'completed' && session.recordingUrl && (
                              <Button variant="outline" size="sm" onClick={() => window.open(session.recordingUrl, '_blank')}>
                                <Video className="mr-2 h-4 w-4" />
                                View Recording
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {session.status === 'scheduled' && isToday(new Date(session.scheduledAt)) && (
                          <Button onClick={() => handleStartSession(session.id)}>
                            <Play className="mr-2 h-4 w-4" />
                            Start Session
                          </Button>
                        )}
                        
                        {session.status === 'in_progress' && (
                          <Button variant="destructive" onClick={() => handleEndSession(session.id)}>
                            <Square className="mr-2 h-4 w-4" />
                            End Session
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewSession(session.id)}>
                              <Video className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleManageAttendance(session.id)}>
                              <Users className="mr-2 h-4 w-4" />
                              Manage Attendance
                            </DropdownMenuItem>
                            {session.meetingUrl && (
                              <DropdownMenuItem onClick={() => window.open(session.meetingUrl, '_blank')}>
                                <Play className="mr-2 h-4 w-4" />
                                Join Meeting
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {session.status === 'completed' && (
                              <DropdownMenuItem>
                                <Star className="mr-2 h-4 w-4" />
                                Rate Session
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Add Feedback
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
    </div>
  )
}
