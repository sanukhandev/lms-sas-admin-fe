import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Save,
  Eye,
  Settings,
  BookOpen,
  BarChart3,
  Users,
  AlertCircle,
  FileX,
} from 'lucide-react'
import { toast } from 'sonner'
import { useCourse, useCourseStructure } from '@/hooks/use-courses'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseContentManager } from '@/components/course-content-manager'
import {
  CourseBasicInfo,
  CourseSettings,
  CourseAnalytics,
  CourseStudents,
} from '@/features/courses/components'

function RouteComponent() {
  const { courseId } = Route.useParams()
  const [activeTab, setActiveTab] = useState('basic')
  const [isLoading, setIsLoading] = useState(false)

  // Fetch real course data
  const {
    data: courseData,
    isLoading: _courseLoading,
    error: _courseError,
  } = useCourse(parseInt(courseId))
  const {
    data: structureData,
    isLoading: structureLoading,
    error: _structureError,
  } = useCourseStructure(courseId)

  const course = courseData?.data
  const structure = structureData?.data

  // If course doesn't exist but structure does, create a basic course object from structure
  const effectiveCourse =
    course ||
    (structure
      ? {
          id: parseInt(courseId),
          title: structure.title || 'Untitled Course',
          description: structure.description || '',
          status: (structure.status || 'draft') as
            | 'draft'
            | 'published'
            | 'archived',
          enrollmentCount: 0,
          contentCount: structure.total_chapters || 0,
          completionRate: 0,
          price: 0,
          currency: '$',
          level: '',
          durationHours: Math.round((structure.total_duration || 0) / 60),
          thumbnailUrl: '',
          categoryName: '',
          requirements: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
        }
      : null)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement actual course update API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Course saved successfully!')
    } catch (_error) {
      toast.error('Failed to save course. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    // Open course preview in new tab
    window.open(`/courses/${courseId}/preview`, '_blank')
  }

  if (structureLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2'></div>
          <p className='text-muted-foreground'>Loading course...</p>
        </div>
      </div>
    )
  }

  if (_structureError && !structure) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 text-red-500'>
            <AlertCircle className='mx-auto h-12 w-12' />
          </div>
          <h2 className='mb-2 text-xl font-semibold'>Error Loading Course</h2>
          <p className='text-muted-foreground mb-4'>
            {typeof _structureError === 'string'
              ? _structureError
              : 'Failed to load course data'}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!effectiveCourse) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <div className='text-center'>
          <div className='text-muted-foreground mb-4'>
            <FileX className='mx-auto h-12 w-12' />
          </div>
          <h2 className='mb-2 text-xl font-semibold'>Course Not Found</h2>
          <p className='text-muted-foreground'>
            The course you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Link
            to='/courses'
            className='text-muted-foreground hover:text-foreground flex items-center space-x-2'
          >
            <ArrowLeft className='h-4 w-4' />
            <span>Back to Courses</span>
          </Link>
          <div>
            <h1 className='text-3xl font-bold'>Edit Course</h1>
            <p className='text-muted-foreground'>
              Make changes to your course content and settings
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <Badge
            variant={
              effectiveCourse.status === 'published' ? 'default' : 'secondary'
            }
          >
            {effectiveCourse.status}
          </Badge>
          <Button variant='outline' onClick={handlePreview}>
            <Eye className='mr-2 h-4 w-4' />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className='mr-2 h-4 w-4' />
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Course Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <BookOpen className='h-5 w-5' />
            <span>{effectiveCourse.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-6 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {effectiveCourse.enrollmentCount || 0}
              </div>
              <div className='text-muted-foreground text-sm'>Students</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {effectiveCourse.contentCount || 0}
              </div>
              <div className='text-muted-foreground text-sm'>Lessons</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-indigo-600'>
                {structure?.modules?.length || 0}
              </div>
              <div className='text-muted-foreground text-sm'>Modules</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-cyan-600'>
                {structure?.modules?.reduce(
                  (total, module) => total + (module.chapters?.length || 0),
                  0
                ) || 0}
              </div>
              <div className='text-muted-foreground text-sm'>Chapters</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-purple-600'>
                {Math.round(effectiveCourse.completionRate || 0)}%
              </div>
              <div className='text-muted-foreground text-sm'>Completion</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-orange-600'>
                {effectiveCourse.currency || '$'}
                {effectiveCourse.price || 0}
              </div>
              <div className='text-muted-foreground text-sm'>Price</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='space-y-6'
      >
        <TabsList className='grid w-full grid-cols-5'>
          <TabsTrigger value='basic' className='flex items-center space-x-2'>
            <BookOpen className='h-4 w-4' />
            <span>Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value='content' className='flex items-center space-x-2'>
            <Settings className='h-4 w-4' />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value='settings' className='flex items-center space-x-2'>
            <Settings className='h-4 w-4' />
            <span>Settings</span>
          </TabsTrigger>
          <TabsTrigger value='students' className='flex items-center space-x-2'>
            <Users className='h-4 w-4' />
            <span>Students</span>
          </TabsTrigger>
          <TabsTrigger
            value='analytics'
            className='flex items-center space-x-2'
          >
            <BarChart3 className='h-4 w-4' />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='basic' className='space-y-6'>
          <CourseBasicInfo
            courseId={courseId}
            course={{
              title: effectiveCourse.title,
              description: effectiveCourse.description || '',
              category: effectiveCourse.categoryName || '',
              difficulty: effectiveCourse.level || '',
              price: effectiveCourse.price || 0,
              estimatedDuration: effectiveCourse.durationHours
                ? `${effectiveCourse.durationHours} hours`
                : '',
              thumbnail: effectiveCourse.thumbnailUrl || null,
            }}
          />
        </TabsContent>

        <TabsContent value='content' className='space-y-6'>
          {structureLoading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-center'>
                <div className='border-primary mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2'></div>
                <p className='text-muted-foreground text-sm'>
                  Loading course structure...
                </p>
              </div>
            </div>
          ) : (
            <CourseContentManager
              courseId={courseId}
              initialData={{
                modules:
                  structure?.modules?.map((module) => ({
                    id: module.id,
                    title: module.title,
                    description: module.description || '',
                    order: module.position,
                    isPublished: true,
                    chapters:
                      module.chapters?.map((chapter) => ({
                        id: chapter.id,
                        title: chapter.title,
                        description: chapter.description || '',
                        order: chapter.position,
                        isPublished: true,
                        classes: [], // Chapters are the lowest level in the API structure
                      })) || [],
                  })) || [],
              }}
              onContentUpdate={() => {
                toast.success('Course content updated')
              }}
            />
          )}
        </TabsContent>

        <TabsContent value='settings' className='space-y-6'>
          <CourseSettings
            courseId={courseId}
            settings={{
              isPublished: effectiveCourse.status === 'published',
              visibility: 'public',
              enrollmentType: 'open',
              maxStudents: null,
              allowDiscussions: true,
              allowRatings: true,
              allowCertificates: true,
              dripContent: false,
              prerequisites: effectiveCourse.requirements || '',
              language: 'English',
              autoPublishLessons: false,
              emailNotifications: true,
            }}
          />
        </TabsContent>

        <TabsContent value='students' className='space-y-6'>
          <CourseStudents courseId={courseId} />
        </TabsContent>

        <TabsContent value='analytics' className='space-y-6'>
          <CourseAnalytics courseId={courseId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/courses/$courseId/edit')({
  component: RouteComponent,
})
