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

export function CourseAnalytics({ courseId }: CourseAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d')

  // Fetch real analytics data
  const { data: analyticsData, isLoading, error } = useCourseAnalytics(courseId, timeRange)
  const analytics = analyticsData?.data

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load analytics data</p>
        </div>
      </div>
    )
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
                  {change >= 0 ? '+' : ''}
                  {change}% from last period
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
      {/* Header with Time Range Selector */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Course Analytics</h3>
          <p className='text-muted-foreground text-sm'>
            Track your course performance and student engagement
          </p>
        </div>
        <div className='flex gap-2'>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className='w-[140px]'>
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
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Total Enrollments'
          value={analytics.overview.totalEnrollments}
          change={13.2}
          icon={Users}
        />
        <StatCard
          title='Active Students'
          value={analytics.overview.activeStudents}
          change={8.7}
          icon={Eye}
        />
        <StatCard
          title='Completion Rate'
          value={analytics.overview.completionRate}
          change={-2.1}
          icon={Award}
          format='percentage'
        />
        <StatCard
          title='Average Rating'
          value={analytics.overview.averageRating}
          change={1.2}
          icon={Star}
        />
      </div>

      {/* Revenue & Time Stats */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <StatCard
          title='Total Revenue'
          value={analytics.overview.totalRevenue}
          change={15.8}
          icon={TrendingUp}
          format='currency'
        />
        <StatCard
          title='Avg. Time Spent'
          value={analytics.overview.averageTimeSpent}
          change={5.3}
          icon={Clock}
          format='time'
        />
      </div>

      {/* Detailed Analytics */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Enrollment Trends */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              Enrollment Trends
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>This Week</span>
              <span className='font-medium'>
                {analytics.enrollment.thisWeek}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>Last Week</span>
              <span className='font-medium'>
                {analytics.enrollment.lastWeek}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>This Month</span>
              <span className='font-medium'>
                {analytics.enrollment.thisMonth}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>Last Month</span>
              <span className='font-medium'>
                {analytics.enrollment.lastMonth}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Content */}
        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {analytics.engagement.mostViewedContent.map((content, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>{content.title}</p>
                    <p className='text-muted-foreground text-xs capitalize'>
                      {content.type}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium'>{content.views}</p>
                    <p className='text-muted-foreground text-xs'>views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lesson Completion Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Completion Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {analytics.engagement.lessonCompletions.map((lesson, index) => (
              <div key={index} className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>{lesson.lesson}</span>
                  <span className='text-muted-foreground text-sm'>
                    {lesson.completions} / {analytics.overview.totalEnrollments}
                    (
                    {Math.round(
                      (lesson.completions /
                        analytics.overview.totalEnrollments) *
                        100
                    )}
                    %)
                  </span>
                </div>
                <Progress
                  value={
                    (lesson.completions / analytics.overview.totalEnrollments) *
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
