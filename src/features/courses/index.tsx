import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useCourses } from '@/hooks/use-courses'
import { columns } from './components/courses-columns'
import { CoursesDialogs } from './components/courses-dialogs'
import { CoursesPrimaryButtons } from './components/courses-primary-buttons'
import { CoursesTable } from './components/courses-table'
import { CourseStats } from './components/course-stats'
import CoursesProvider from './context/courses-context'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function Courses() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState<string>()
  const [status, setStatus] = useState<string>()
  const [instructor, setInstructor] = useState<string>()

  const { data: coursesResponse, isLoading, error } = useCourses({
    page,
    perPage,
    search,
    status,
    instructor,
  })

  const courseList = coursesResponse?.data || []

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
          {isLoading ? (
            <Card>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className='flex items-center space-x-4'>
                      <Skeleton className='h-4 w-4' />
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='h-4 w-48' />
                      <Skeleton className='h-4 w-24' />
                      <Skeleton className='h-4 w-16' />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : error ? (
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
              pagination={{
                page,
                perPage,
                total: coursesResponse?.meta.total || 0,
                lastPage: coursesResponse?.meta.last_page || 1,
                onPageChange: setPage,
                onPerPageChange: setPerPage,
              }}
              filters={{
                search,
                status,
                instructor,
                onSearchChange: setSearch,
                onStatusChange: setStatus,
                onInstructorChange: setInstructor,
              }}
            />
          )}
        </div>
      </Main>

      <CoursesDialogs />
    </CoursesProvider>
  )
}
