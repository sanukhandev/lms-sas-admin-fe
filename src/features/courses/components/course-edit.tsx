import { useState, useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { coursesService, type Course } from '@/services/courses'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, BookOpen, Calendar, Users, Settings, PlayCircle } from 'lucide-react'
import { toast } from 'sonner'

// Course Edit Components
import { BasicCourseForm } from './basic-course-form'
import { CourseContentManager } from './course-content-manager'
import { ClassScheduler } from './class-scheduler'
import { TeachingPlanManager } from './teaching-plan-manager'
import { SessionManager } from './session-manager'

export default function CourseEdit() {
  const { courseId } = useParams({ from: '/_authenticated/courses/$courseId/edit' })
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    if (courseId) {
      loadCourse()
    }
  }, [courseId])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const response = await coursesService.getCourse(Number(courseId))
      setCourse(response.data)
    } catch (error) {
      console.error('Error loading course:', error)
      toast.error('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const handleCourseUpdate = (updatedCourse: Course) => {
    setCourse(updatedCourse)
    toast.success('Course updated successfully')
  }

  const handleGoBack = () => {
    navigate({ to: '/courses' })
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col">
        <Header>
          <Search />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading course...</p>
          </div>
        </Main>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex h-screen w-full flex-col">
        <Header>
          <Search />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive">Course Not Found</h1>
            <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
            <Button onClick={handleGoBack} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </div>
        </Main>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <Header>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <h1 className="font-semibold truncate max-w-[300px]" title={course.title}>
              {course.title}
            </h1>
            <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
              {course.status}
            </Badge>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex-1 overflow-hidden">
        <div className="container mx-auto py-6 h-full">
          <div className="mb-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {course.description || 'No description available'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.enrollmentCount} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.content_count} content items</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{course.duration_hours}h duration</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Basic Info</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="planning" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Planning</span>
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center space-x-2">
                <PlayCircle className="h-4 w-4" />
                <span>Sessions</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-6 overflow-hidden">
              <TabsContent value="basic" className="h-full overflow-auto">
                <BasicCourseForm 
                  course={course} 
                  onUpdate={handleCourseUpdate}
                />
              </TabsContent>

              <TabsContent value="content" className="h-full overflow-auto">
                <CourseContentManager 
                  courseId={course.id.toString()} 
                />
              </TabsContent>

              <TabsContent value="schedule" className="h-full overflow-auto">
                <ClassScheduler 
                  courseId={course.id.toString()} 
                />
              </TabsContent>

              <TabsContent value="planning" className="h-full overflow-auto">
                <TeachingPlanManager 
                  courseId={course.id.toString()} 
                />
              </TabsContent>

              <TabsContent value="sessions" className="h-full overflow-auto">
                <SessionManager 
                  courseId={course.id.toString()} 
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Main>
    </div>
  )
}
