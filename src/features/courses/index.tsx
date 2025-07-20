import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useCourses } from '@/hooks/use-courses'
import { useOptimizedTableFilters } from '@/hooks/use-optimized-table-filters'
import { columns } from './components/courses-columns'
import { CoursesDialogs } from './components/courses-dialogs'
import { CoursesPrimaryButtons } from './components/courses-primary-buttons'
import { CoursesTable } from './components/courses-table'
import { CourseStats } from './components/course-stats'
import { CourseDetailsDialog } from './components/course-details-dialog'
import CoursesProvider from './context/courses-context'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { type Course } from '@/services/courses'
import { useNavigate } from '@tanstack/react-router'

interface CourseFilters {
  status: string | undefined
  instructor: string | undefined
}

export default function Courses() {
  const navigate = useNavigate()
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const tableFilters = useOptimizedTableFilters<CourseFilters>({
    searchDelay: 300,
    initialSearch: '',
    initialFilters: {
      status: undefined,
      instructor: undefined,
    },
  })

  const { data: coursesResponse, isLoading, error } = useCourses({
    page: tableFilters.page,
    perPage: tableFilters.perPage,
    search: tableFilters.debouncedSearch,
    status: tableFilters.filters.status,
    instructor: tableFilters.filters.instructor,
  })

  const courseList = coursesResponse?.data || []

  // Handle course action events
  useEffect(() => {
    const handleShowCourseDetails = (event: CustomEvent) => {
      setSelectedCourse(event.detail.course)
      setShowDetailsDialog(true)
    }

    const handleBuildCourse = (event: CustomEvent) => {
      const courseId = event.detail.courseId
      // Navigate to course builder
      navigate({ to: `/course-builder/${courseId}` })
    }

    const handleModifyCourse = (event: CustomEvent) => {
      const courseId = event.detail.courseId
      // Navigate to course editor
      navigate({ to: `/courses/${courseId}/edit` })
    }

    window.addEventListener('showCourseDetails', handleShowCourseDetails as EventListener)
    window.addEventListener('buildCourse', handleBuildCourse as EventListener)
    window.addEventListener('modifyCourse', handleModifyCourse as EventListener)

    return () => {
      window.removeEventListener('showCourseDetails', handleShowCourseDetails as EventListener)
      window.removeEventListener('buildCourse', handleBuildCourse as EventListener)
      window.removeEventListener('modifyCourse', handleModifyCourse as EventListener)
    }
  }, [navigate])

  return (
    <CoursesProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        {/* Course Statistics */}
        <CourseStats />

        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Course Management</h2>
            <p className='text-muted-foreground'>
              Manage your courses, track performance, and monitor enrollments.
            </p>
          </div>
          <CoursesPrimaryButtons />
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {error ? (
            <Card>
              <CardContent className='pt-6'>
                <div className='text-center text-red-500'>
                  Failed to load courses. Please try again.
                </div>
              </CardContent>
            </Card>
          ) : (
            <CoursesTable 
              data={courseList} 
              columns={columns}
              isLoading={isLoading}
              pagination={{
                page: tableFilters.page,
                perPage: tableFilters.perPage,
                total: coursesResponse?.meta.total || 0,
                lastPage: coursesResponse?.meta.last_page || 1,
                onPageChange: tableFilters.setPage,
                onPerPageChange: tableFilters.setPerPage,
              }}
              filters={{
                search: tableFilters.search,
                status: tableFilters.filters.status,
                instructor: tableFilters.filters.instructor,
                onSearchChange: (search) => tableFilters.handleSearchChange(search || ''),
                onStatusChange: (value) => tableFilters.handleFilterChange('status', value),
                onInstructorChange: (value) => tableFilters.handleFilterChange('instructor', value),
              }}
            />
          )}
        </div>
      </Main>

      <CoursesDialogs />
      
      {/* Course Details Dialog */}
      <CourseDetailsDialog
        course={selectedCourse}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </CoursesProvider>
  )
}
