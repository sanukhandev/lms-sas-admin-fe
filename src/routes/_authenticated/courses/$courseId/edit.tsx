import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Save, Eye, Settings, BookOpen, BarChart3, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  CourseBasicInfo,
  CourseSettings,
  CourseAnalytics,
  CourseStudents,
} from '@/features/courses/components'
import { CourseContentManager } from '@/components/course-content-manager'
import { useCourse, useCourseStructure } from '@/hooks/use-courses'

function RouteComponent() {
  const { courseId } = Route.useParams()
  const [activeTab, setActiveTab] = useState('basic')
  const [isLoading, setIsLoading] = useState(false)

  // Fetch real course data
  const { data: courseData, isLoading: courseLoading, error: courseError } = useCourse(parseInt(courseId))
  const { data: structureData, isLoading: structureLoading } = useCourseStructure(courseId)

  const course = courseData?.data
  const structure = structureData?.data

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement actual course update API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Course saved successfully!")
    } catch (_error) {
      toast.error("Failed to save course. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    // Open course preview in new tab
    window.open(`/courses/${courseId}/preview`, '_blank')
  }

  if (courseLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading course data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (courseError || !course) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Course Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The course with ID {courseId} could not be found.
          </p>
          <Link to="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/courses" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Courses</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Course</h1>
            <p className="text-muted-foreground">
              Make changes to your course content and settings
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
            {course.status}
          </Badge>
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Course Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>{course.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{course.enrollmentCount || 0}</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{course.content_count || 0}</div>
              <div className="text-sm text-muted-foreground">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{structure?.modules?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600">
                {structure?.modules?.reduce((total, module) => total + (module.chapters?.length || 0), 0) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Chapters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(course.completionRate || 0)}%</div>
              <div className="text-sm text-muted-foreground">Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {course.currency || '$'}{course.price || 0}
              </div>
              <div className="text-sm text-muted-foreground">Price</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Students</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <CourseBasicInfo 
            courseId={courseId} 
            course={{
              title: course.title,
              description: course.description || '',
              category: course.categoryName || '',
              difficulty: course.level || '',
              price: course.price || 0,
              estimatedDuration: course.duration_hours ? `${course.duration_hours} hours` : '',
              thumbnail: course.thumbnail_url || null
            }} 
          />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {structureLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading course structure...</p>
              </div>
            </div>
          ) : (
            <CourseContentManager 
              courseId={courseId} 
              initialData={{
                modules: structure?.modules?.map(module => ({
                  id: module.id,
                  title: module.title,
                  description: module.description || '',
                  order: module.position,
                  isPublished: true,
                  chapters: module.chapters?.map(chapter => ({
                    id: chapter.id,
                    title: chapter.title,
                    description: chapter.description || '',
                    order: chapter.position,
                    isPublished: true,
                    classes: [] // Chapters are the lowest level in the API structure
                  })) || []
                })) || []
              }}
              onContentUpdate={() => {
                toast.success('Course content updated')
              }} 
            />
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <CourseSettings 
            courseId={courseId} 
            settings={{
              isPublished: course.status === 'published',
              visibility: 'public',
              enrollmentType: 'open',
              maxStudents: null,
              allowDiscussions: true,
              allowRatings: true,
              allowCertificates: true,
              dripContent: false,
              prerequisites: course.requirements || '',
              language: 'English',
              autoPublishLessons: false,
              emailNotifications: true,
            }}
          />
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <CourseStudents courseId={courseId} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <CourseAnalytics courseId={courseId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/courses/$courseId/edit')({
  component: RouteComponent,
})
