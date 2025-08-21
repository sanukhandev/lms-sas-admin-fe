import { useState } from 'react'
import {
  TrendingUp,
  Users,
  Clock,
  Star,
  Award,
  Eye,
  Download,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { useCourseAnalytics } from '@/hooks/use-courses'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CourseAnalyticsProps {
  courseId: string
}

// Mock Analytics Display Component
function MockAnalyticsDisplay({
  courseId: _courseId,
  timeRange,
  onTimeRangeChange,
}: {
  courseId: string
  timeRange: string
  onTimeRangeChange: (value: string) => void
}) {
  // Mock analytics data
  const mockAnalytics = {
    overview: {
      totalEnrollments: 247,
      activeStudents: 189,
      completionRate: 76,
      avgTimeToComplete: 18.5,
      enrollmentChange: 12,
      activeChange: -3,
      completionChange: 8,
      timeChange: -5,
    },
    performance: {
      averageRating: 4.6,
      totalViews: 1524,
      discussionPosts: 89,
      ratingChange: 2,
      viewsChange: 15,
      discussionChange: 23,
    },
    engagement: {
      timeline: [
        { date: 'Jan 15', activeUsers: 45, completions: 8 },
        { date: 'Jan 16', activeUsers: 52, completions: 12 },
        { date: 'Jan 17', activeUsers: 48, completions: 6 },
        { date: 'Jan 18', activeUsers: 67, completions: 15 },
        { date: 'Jan 19', activeUsers: 71, completions: 18 },
        { date: 'Jan 20', activeUsers: 58, completions: 11 },
        { date: 'Jan 21', activeUsers: 43, completions: 9 },
      ],
      lessonCompletions: [
        { lesson: 'Introduction to Basics', completions: 235 },
        { lesson: 'Core Concepts', completions: 198 },
        { lesson: 'Practical Applications', completions: 167 },
        { lesson: 'Advanced Techniques', completions: 134 },
        { lesson: 'Final Project', completions: 89 },
      ],
    },
  }

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    format = 'number',
  }: {
    title: string
    value: number | string
    change?: number
    icon: React.ComponentType<{ className?: string }>
    format?: 'number' | 'currency' | 'percentage' | 'time'
  }) => {
    const formatValue = (val: number | string) => {
      if (typeof val === 'string') return val
      switch (format) {
        case 'currency':
          return `$${val.toLocaleString()}`
        case 'percentage':
          return `${val}%`
        case 'time':
          return `${val}h`
        default:
          return val.toLocaleString()
      }
    }

    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                {title}
              </p>
              <p className='text-2xl font-bold'>{formatValue(value)}</p>
              {change !== undefined && (
                <p
                  className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {change >= 0 ? '↗' : '↘'} {Math.abs(change)}% from last
                  period
                </p>
              )}
            </div>
            <Icon className='text-muted-foreground h-8 w-8' />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Controls */}
      <div className='flex items-center justify-end'>
        <div className='flex items-center gap-4'>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className='w-[180px]'>
              <Calendar className='mr-2 h-4 w-4' />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='7d'>Last 7 days</SelectItem>
              <SelectItem value='30d'>Last 30 days</SelectItem>
              <SelectItem value='90d'>Last 90 days</SelectItem>
              <SelectItem value='1y'>Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant='outline' size='sm'>
            <Download className='mr-2 h-4 w-4' />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <StatCard
          title='Total Enrollments'
          value={mockAnalytics.overview.totalEnrollments}
          change={mockAnalytics.overview.enrollmentChange}
          icon={Users}
        />
        <StatCard
          title='Active Students'
          value={mockAnalytics.overview.activeStudents}
          change={mockAnalytics.overview.activeChange}
          icon={TrendingUp}
        />
        <StatCard
          title='Completion Rate'
          value={mockAnalytics.overview.completionRate}
          change={mockAnalytics.overview.completionChange}
          icon={Award}
          format='percentage'
        />
        <StatCard
          title='Avg. Time to Complete'
          value={mockAnalytics.overview.avgTimeToComplete}
          change={mockAnalytics.overview.timeChange}
          icon={Clock}
          format='time'
        />
      </div>

      {/* Performance Metrics */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <StatCard
          title='Course Rating'
          value={mockAnalytics.performance.averageRating}
          change={mockAnalytics.performance.ratingChange}
          icon={Star}
        />
        <StatCard
          title='Total Video Views'
          value={mockAnalytics.performance.totalViews}
          change={mockAnalytics.performance.viewsChange}
          icon={Eye}
        />
        <StatCard
          title='Discussion Posts'
          value={mockAnalytics.performance.discussionPosts}
          change={mockAnalytics.performance.discussionChange}
          icon={TrendingUp}
        />
      </div>

      {/* Engagement Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {mockAnalytics.engagement.timeline.map((point, index) => (
              <div key={index} className='flex items-center justify-between'>
                <span className='text-muted-foreground text-sm'>
                  {point.date}
                </span>
                <div className='flex items-center gap-4'>
                  <span className='text-sm'>Active: {point.activeUsers}</span>
                  <span className='text-sm'>
                    Completions: {point.completions}
                  </span>
                  <Progress
                    value={(point.activeUsers / 100) * 100}
                    className='h-2 w-20'
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lesson Completion Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Completion Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {mockAnalytics.engagement.lessonCompletions.map((lesson, index) => (
              <div key={index} className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>{lesson.lesson}</span>
                  <span className='text-muted-foreground text-sm'>
                    {lesson.completions} /{' '}
                    {mockAnalytics.overview.totalEnrollments} (
                    {Math.round(
                      (lesson.completions /
                        mockAnalytics.overview.totalEnrollments) *
                        100
                    )}
                    %)
                  </span>
                </div>
                <Progress
                  value={
                    (lesson.completions /
                      mockAnalytics.overview.totalEnrollments) *
                    100
                  }
                  className='h-2'
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function CourseAnalytics({ courseId }: CourseAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d')

  // Fetch real analytics data
  const {
    data: analyticsData,
    isLoading,
    error,
  } = useCourseAnalytics(courseId, timeRange)
  const analytics = analyticsData?.data

  // Show mock data with notice if API is not available
  const showMockData = error && !analytics

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2'></div>
          <p className='text-muted-foreground'>Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (showMockData) {
    return (
      <div className='space-y-4'>
        <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
          <div className='flex items-center space-x-2'>
            <AlertCircle className='h-5 w-5 text-yellow-600' />
            <div>
              <h4 className='text-sm font-semibold text-yellow-800'>
                Demo Mode
              </h4>
              <p className='text-sm text-yellow-700'>
                Analytics data endpoint is not implemented yet. Showing sample
                data for demonstration.
              </p>
            </div>
          </div>
        </div>
        <MockAnalyticsDisplay
          courseId={courseId}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      </div>
    )
  }

  // If we have real data, render it (this would be the real implementation)
  return (
    <div className='flex items-center justify-center py-8'>
      <div className='text-center'>
        <TrendingUp className='text-muted-foreground mx-auto mb-4 h-8 w-8' />
        <h3 className='mb-2 text-lg font-semibold'>Analytics Data Available</h3>
        <p className='text-muted-foreground'>
          Analytics data loaded successfully. Real data implementation goes
          here.
        </p>
      </div>
    </div>
  )
}
