import { useState } from 'react'
import { Plus, BookOpen, Users, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CourseCreationWizard } from './components/course-creation-wizard'
import { CourseFilters } from './components/course-filters'
import { CourseHierarchyTree } from './components/course-hierarchy-tree'
import { CourseStatsCards } from './components/course-stats-cards'
import { useCourses } from './hooks/use-course-hierarchy'
import type { HierarchyNode } from './types'

export default function Courses() {
  const [showCreationWizard, setShowCreationWizard] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<HierarchyNode | null>(
    null
  )
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category_id: 'all',
    content_type: 'course',
  })

  const {
    data: coursesResponse,
    isLoading,
    error,
  } = useCourses({
    search: filters.search,
    status: filters.status === 'all' ? undefined : filters.status,
    category_id:
      filters.category_id === 'all' ? undefined : filters.category_id,
    content_type:
      filters.content_type === 'all' ? undefined : filters.content_type,
  })

  const courses = coursesResponse?.data || []

  const handleCreateCourse = () => {
    setShowCreationWizard(true)
  }

  const handleCourseSelect = (course: HierarchyNode) => {
    setSelectedCourse(course)
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Header className='shrink-0 border-b'>
        <div className='flex flex-1 items-center gap-4'>
          <div className='flex items-center gap-2'>
            <BookOpen className='text-primary h-6 w-6' />
            <h1 className='text-xl font-semibold'>Course Management</h1>
          </div>
          <Badge variant='secondary' className='font-normal'>
            {courses.length}{' '}
            {filters.content_type === 'course'
              ? 'root courses'
              : filters.content_type === 'all'
                ? 'items'
                : filters.content_type + 's'}
          </Badge>
        </div>

        <div className='flex items-center gap-4'>
          <Search placeholder='Search courses...' />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex-1'>
        <div className='container mx-auto p-6'>
          {/* Header Actions */}
          <div className='mb-6 flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                {filters.content_type === 'course'
                  ? 'Courses'
                  : filters.content_type === 'all'
                    ? 'Course Content'
                    : filters.content_type.charAt(0).toUpperCase() +
                      filters.content_type.slice(1) +
                      's'}
              </h2>
              <p className='text-muted-foreground'>
                Manage your course hierarchy and content structure
              </p>
            </div>
            <Button onClick={handleCreateCourse} size='lg'>
              <Plus className='mr-2 h-4 w-4' />
              Create Course
            </Button>
          </div>

          {/* Stats Cards */}
          <CourseStatsCards className='mb-6' />

          {/* Filters */}
          <CourseFilters
            filters={filters}
            onFiltersChange={setFilters}
            className='mb-6'
          />

          {/* Main Content */}
          <div className='grid min-h-[600px] grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Course List */}
            <div className='lg:col-span-1'>
              <Card className='flex h-[600px] flex-col'>
                <CardHeader className='shrink-0'>
                  <CardTitle className='flex items-center gap-2'>
                    <BookOpen className='h-5 w-5' />
                    {filters.content_type === 'course'
                      ? 'Courses'
                      : filters.content_type === 'all'
                        ? 'Content'
                        : filters.content_type.charAt(0).toUpperCase() +
                          filters.content_type.slice(1) +
                          's'}
                  </CardTitle>
                  <CardDescription>
                    {filters.content_type === 'course'
                      ? 'Select a course to view its hierarchy'
                      : `Browse ${filters.content_type === 'all' ? 'all content' : filters.content_type + 's'} in the system`}
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex-1 overflow-hidden p-0'>
                  <div className='h-full overflow-y-auto'>
                    {isLoading ? (
                      <CourseListSkeleton />
                    ) : error ? (
                      <div className='text-muted-foreground p-4 text-center'>
                        Failed to load courses
                      </div>
                    ) : courses.length === 0 ? (
                      <div className='p-8 text-center'>
                        <BookOpen className='text-muted-foreground/50 mx-auto h-12 w-12' />
                        <h3 className='mt-4 text-lg font-medium'>
                          No courses yet
                        </h3>
                        <p className='text-muted-foreground mt-2 text-sm'>
                          Create your first course to get started
                        </p>
                        <Button
                          className='mt-4'
                          onClick={handleCreateCourse}
                          variant='outline'
                        >
                          <Plus className='mr-2 h-4 w-4' />
                          Create Course
                        </Button>
                      </div>
                    ) : (
                      <div className='space-y-1 p-2'>
                        {courses.map((course: HierarchyNode) => (
                          <CourseListItem
                            key={course.id}
                            course={course}
                            isSelected={selectedCourse?.id === course.id}
                            onClick={() => handleCourseSelect(course)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Hierarchy */}
            <div className='lg:col-span-2'>
              {selectedCourse ? (
                <CourseHierarchyTree courseId={selectedCourse.id} />
              ) : (
                <Card className='flex h-[600px] flex-col'>
                  <CardContent className='flex h-full items-center justify-center'>
                    <div className='text-center'>
                      <BookOpen className='text-muted-foreground/30 mx-auto h-16 w-16' />
                      <h3 className='text-muted-foreground mt-4 text-xl font-medium'>
                        Select a course
                      </h3>
                      <p className='text-muted-foreground mt-2 text-sm'>
                        Choose a course from the list to view and manage its
                        hierarchy
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Main>

      {/* Course Creation Wizard */}
      <CourseCreationWizard
        open={showCreationWizard}
        onOpenChange={setShowCreationWizard}
        onSuccess={(course) => {
          setSelectedCourse(course)
          setShowCreationWizard(false)
        }}
      />
    </div>
  )
}

// Course List Skeleton Component
function CourseListSkeleton() {
  return (
    <div className='space-y-1 p-2'>
      {[...Array(6)].map((_, i) => (
        <div key={i} className='rounded-lg border p-3'>
          <div className='flex items-start justify-between'>
            <div className='min-w-0 flex-1 space-y-2'>
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-3 w-full' />
              <Skeleton className='h-3 w-2/3' />
              <div className='flex items-center gap-4'>
                <Skeleton className='h-3 w-16' />
                <Skeleton className='h-3 w-12' />
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <Skeleton className='h-5 w-16' />
              <Skeleton className='h-4 w-12' />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Course List Item Component
interface CourseListItemProps {
  course: HierarchyNode
  isSelected: boolean
  onClick: () => void
}

function CourseListItem({ course, isSelected, onClick }: CourseListItemProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    }
  }

  const getContentTypeColor = (contentType?: string) => {
    switch (contentType) {
      case 'course':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'module':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'chapter':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'class':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div
      onClick={onClick}
      className={`group hover:bg-accent cursor-pointer rounded-lg border p-3 transition-all ${
        isSelected ? 'border-primary bg-accent' : 'border-border'
      }`}
    >
      <div className='flex items-start justify-between'>
        <div className='min-w-0 flex-1'>
          <h4 className='truncate font-medium'>{course.title}</h4>
          {course.description && (
            <p className='text-muted-foreground mt-1 line-clamp-2 text-sm'>
              {course.description}
            </p>
          )}

          <div className='text-muted-foreground mt-2 flex items-center gap-2 text-xs'>
            {course.class_count !== undefined && (
              <span className='flex items-center gap-1'>
                <Users className='h-3 w-3' />
                {course.class_count} classes
              </span>
            )}
            {course.total_duration && (
              <span className='flex items-center gap-1'>
                <Clock className='h-3 w-3' />
                {Math.round(course.total_duration / 60)}h
              </span>
            )}
          </div>
        </div>

        <div className='flex flex-col items-end gap-1'>
          {course.content_type && (
            <Badge
              variant='secondary'
              className={`text-xs ${getContentTypeColor(course.content_type)}`}
            >
              {course.content_type}
            </Badge>
          )}
          {course.status && (
            <Badge
              variant='secondary'
              className={`text-xs ${getStatusColor(course.status)}`}
            >
              {course.status}
            </Badge>
          )}
          {course.level && (
            <Badge variant='outline' className='text-xs'>
              {course.level}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
