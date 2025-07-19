import { useState, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseBuilderStats } from './components/course-builder-stats'
import { CourseBuilderPrimaryButtons } from './components/course-builder-primary-buttons'
import { CourseBuilderTable } from './components/course-builder-table'
import { CourseDetailsTab } from './tabs/course-details-tab'
import { CourseStructureTab } from './tabs/course-structure-tab'
import { CoursePricingTab } from './tabs/course-pricing-tab'
import { CoursePublishingTab } from './tabs/course-publishing-tab'
import CourseBuilderProvider from './context/course-builder-context'
import { CoursePlannerTab } from './tabs/course-planner-tab'

export function CourseBuilder() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalCourses: 12,
    publishedCourses: 8,
    draftCourses: 4,
    totalDuration: 2640, // in minutes
  })

  const handleStatsUpdate = useCallback((newStats: typeof stats) => {
    setStats(newStats)
  }, [])

  const handleCourseSelect = useCallback((courseId: string) => {
    setSelectedCourseId(courseId)
    setActiveTab('details')
  }, [])

  const handleBackToOverview = useCallback(() => {
    setSelectedCourseId(null)
    setActiveTab('overview')
  }, [])

  return (
    <CourseBuilderProvider>
      <Header>
        <Search placeholder='Search courses, modules, chapters...' />
        <ProfileDropdown />
      </Header>
      <Main>
        <div className='space-y-6'>
          <CourseBuilderStats
            totalCourses={stats.totalCourses}
            publishedCourses={stats.publishedCourses}
            draftCourses={stats.draftCourses}
            totalDuration={stats.totalDuration}
          />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div>
                <h1 className='text-2xl font-semibold tracking-tight'>
                  {selectedCourseId ? 'Course Editor' : 'Course Builder'}
                </h1>
                <p className='text-muted-foreground'>
                  {selectedCourseId 
                    ? 'Design and structure your course content'
                    : 'Create, plan, and manage your courses with advanced tools'
                  }
                </p>
              </div>
              <CourseBuilderPrimaryButtons selectedCourseId={selectedCourseId} onBackToOverview={handleBackToOverview} />
            </div>

            <TabsList className='grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6'>
              <TabsTrigger value='overview' disabled={!!selectedCourseId}>Overview</TabsTrigger>
              <TabsTrigger value='planner' disabled={!!selectedCourseId}>Planner</TabsTrigger>
              <TabsTrigger value='details' disabled={!selectedCourseId}>Details</TabsTrigger>
              <TabsTrigger value='structure' disabled={!selectedCourseId}>Structure</TabsTrigger>
              <TabsTrigger value='pricing' disabled={!selectedCourseId}>Pricing</TabsTrigger>
              <TabsTrigger value='publishing' disabled={!selectedCourseId}>Publishing</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-6'>
              <CourseBuilderTable onStatsUpdate={handleStatsUpdate} onCourseSelect={handleCourseSelect} />
            </TabsContent>

            <TabsContent value='planner' className='space-y-6'>
              <CoursePlannerTab />
            </TabsContent>

            <TabsContent value='details' className='space-y-6'>
              {selectedCourseId ? (
                <CourseDetailsTab courseId={selectedCourseId} />
              ) : (
                <div className='text-center text-muted-foreground py-8'>
                  Please select a course to view details
                </div>
              )}
            </TabsContent>

            <TabsContent value='structure' className='space-y-6'>
              {selectedCourseId ? (
                <CourseStructureTab courseId={selectedCourseId} />
              ) : (
                <div className='text-center text-muted-foreground py-8'>
                  Please select a course to edit structure
                </div>
              )}
            </TabsContent>

            <TabsContent value='pricing' className='space-y-6'>
              {selectedCourseId ? (
                <CoursePricingTab courseId={selectedCourseId} />
              ) : (
                <div className='text-center text-muted-foreground py-8'>
                  Please select a course to manage pricing
                </div>
              )}
            </TabsContent>

            <TabsContent value='publishing' className='space-y-6'>
              {selectedCourseId ? (
                <CoursePublishingTab courseId={selectedCourseId} />
              ) : (
                <div className='text-center text-muted-foreground py-8'>
                  Please select a course to manage publishing
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Main>
    </CourseBuilderProvider>
  )
}
