import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Save,
  Eye,
  Settings,
  BookOpen,
  BarChart3,
  Users,
  FileText,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentEditorLayout } from '@/features/courses/components/content-editor'
import { CourseAnalytics } from '@/features/courses/components/course-analytics'
import { CourseBasicInfo } from '@/features/courses/components/course-basic-info'
import { CourseSettings } from '@/features/courses/components/course-settings'
import { CourseStudents } from '@/features/courses/components/course-students'

interface CourseBuilderProps {
  courseId?: string
}

export function CourseBuilder({ courseId }: CourseBuilderProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [isLoading, setIsLoading] = useState(false)

  // Mock course data - replace with actual API call
  const course = {
    id: parseInt(courseId || '0'),
    title: 'Advanced React Development',
    description:
      'Master advanced React concepts including hooks, context, performance optimization, and modern patterns.',
    category: 'Programming',
    difficulty: 'Advanced',
    price: 199.99,
    estimatedDuration: '40 hours',
    status: 'published',
    thumbnail: null,
    studentsCount: 1247,
    lessonsCount: 20,
    rating: 4.6,
    enrollments: 1247,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-18',
  }

  const settings = {
    isPublished: course.status === 'published',
    visibility: 'public' as const,
    enrollmentType: 'open' as const,
    maxStudents: null,
    allowDiscussions: true,
    allowRatings: true,
    allowCertificates: true,
    dripContent: false,
    prerequisites: 'Basic React knowledge required',
    language: 'en',
    autoPublishLessons: false,
    emailNotifications: true,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    // TODO: Implement save functionality
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className='min-h-screen bg-gray-50/30'>
      {/* Header */}
      <div className='border-b bg-white'>
        <div className='flex h-16 items-center justify-between px-6'>
          <div className='flex items-center gap-4'>
            <Link to='/courses'>
              <Button variant='ghost' size='sm' className='gap-2'>
                <ArrowLeft className='h-4 w-4' />
                Back to Courses
              </Button>
            </Link>
            <div className='flex items-center gap-3'>
              <div>
                <h1 className='text-xl font-semibold'>{course.title}</h1>
                <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                  <span>{course.studentsCount} students</span>
                  <span>•</span>
                  <span>{course.lessonsCount} lessons</span>
                  <span>•</span>
                  <Badge className={getStatusColor(course.status)}>
                    {course.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' className='gap-2'>
              <Eye className='h-4 w-4' />
              Preview
            </Button>
            <Button
              size='sm'
              className='gap-2'
              onClick={handleSave}
              disabled={isLoading}
            >
              <Save className='h-4 w-4' />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-6'>
        {/* Course Overview Cards */}
        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Students Enrolled
              </CardTitle>
              <Users className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{course.studentsCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Lessons
              </CardTitle>
              <BookOpen className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{course.lessonsCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Course Price
              </CardTitle>
              <BarChart3 className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>${course.price}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Duration</CardTitle>
              <BookOpen className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {course.estimatedDuration}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-5 lg:w-fit'>
            <TabsTrigger value='basic' className='gap-2'>
              <FileText className='h-4 w-4' />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value='content' className='gap-2'>
              <BookOpen className='h-4 w-4' />
              Content & Structure
            </TabsTrigger>
            <TabsTrigger value='settings' className='gap-2'>
              <Settings className='h-4 w-4' />
              Settings
            </TabsTrigger>
            <TabsTrigger value='students' className='gap-2'>
              <Users className='h-4 w-4' />
              Students
            </TabsTrigger>
            <TabsTrigger value='analytics' className='gap-2'>
              <BarChart3 className='h-4 w-4' />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value='basic' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Course Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <CourseBasicInfo courseId={courseId || ''} course={course} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='content' className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Course Content & Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <ContentEditorLayout courseId={courseId || ''} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='settings' className='space-y-6'>
            <CourseSettings courseId={courseId || ''} settings={settings} />
          </TabsContent>

          <TabsContent value='students' className='space-y-6'>
            <CourseStudents courseId={courseId || ''} />
          </TabsContent>

          <TabsContent value='analytics' className='space-y-6'>
            <CourseAnalytics courseId={courseId || ''} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
