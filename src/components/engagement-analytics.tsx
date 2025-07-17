import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Activity, Clock, BookOpen, Users } from 'lucide-react'
import { useEngagementMetrics } from '@/hooks/use-analytics'

const TIME_RANGES = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
] as const

interface PopularCourseCardProps {
  title: string
  enrollments: number
  completionRate: number
  avgTimeSpent: number
  isLoading?: boolean
}

function PopularCourseCard({ title, enrollments, completionRate, avgTimeSpent, isLoading }: PopularCourseCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between text-xs">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-semibold text-sm mb-2 truncate">{title}</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Completion Rate</span>
            <span className="font-medium">{completionRate.toFixed(1)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{enrollments} enrolled</span>
            <span>{avgTimeSpent}h avg</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function EngagementAnalytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const { data: engagement, isLoading, error } = useEngagementMetrics(timeRange)

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load engagement metrics. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Engagement Analytics</h2>
          <p className="text-muted-foreground">
            User activity, course interactions, and learning engagement insights
          </p>
        </div>
        <div className="flex gap-2">
          {TIME_RANGES.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Engagement Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {engagement?.daily_active_users?.length 
                  ? engagement.daily_active_users[engagement.daily_active_users.length - 1]?.active_users ?? 0
                  : 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Active in past 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {engagement?.session_duration ? Math.round(engagement.session_duration) : 0}m
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Average time per session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Interaction</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {engagement?.course_interaction_rate ? engagement.course_interaction_rate.toFixed(1) : 0}%
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Users interacting with content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {engagement?.popular_courses?.length ?? 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Trending this period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Courses Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Most Popular Courses</h3>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PopularCourseCard
                key={i}
                title=""
                enrollments={0}
                completionRate={0}
                avgTimeSpent={0}
                isLoading={true}
              />
            ))}
          </div>
        ) : engagement?.popular_courses?.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {engagement.popular_courses.slice(0, 6).map((course: any, index: number) => (
              <PopularCourseCard
                key={index}
                title={course.title || `Course ${index + 1}`}
                enrollments={course.enrollments || 0}
                completionRate={course.completion_rate || 0}
                avgTimeSpent={course.avg_time_spent || 0}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Course Data</h3>
              <p className="text-muted-foreground text-sm">
                No popular courses data available for the selected time period.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Engagement Summary */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Engagement Summary</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {engagement?.engagement_trends?.reduce((acc: number, trend: any) => acc + trend.total_interactions, 0) ?? 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Course interactions in period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Peak Activity Day</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {engagement?.daily_active_users?.length 
                    ? new Date(engagement.daily_active_users.reduce((max: any, day: any) => 
                        day.active_users > max.active_users ? day : max
                      ).date).toLocaleDateString('en-US', { weekday: 'short' })
                    : 'N/A'}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Most active day of week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Avg Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {engagement?.popular_courses?.length 
                    ? (engagement.popular_courses.reduce((acc: number, course: any) => acc + course.completion_rate, 0) / engagement.popular_courses.length).toFixed(1)
                    : 0}%
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Average across all courses
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Engagement Trends */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Engagement Trends</h3>
        <Card>
          <CardHeader>
            <CardTitle>Learning Activity Over Time</CardTitle>
            <CardDescription>
              Daily engagement trends for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <Skeleton className="h-[180px] w-full" />
              </div>
            ) : engagement?.engagement_trends?.length ? (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground mb-2">
                  <span>Date</span>
                  <span>Active Users</span>
                  <span>Interactions</span>
                  <span>Avg Progress</span>
                </div>
                {engagement.engagement_trends.slice(-7).map((trend: any, index: number) => (
                  <div key={index} className="grid grid-cols-4 gap-2 text-sm">
                    <span className="text-muted-foreground">
                      {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="font-medium">{trend.active_users}</span>
                    <span className="text-muted-foreground">{trend.total_interactions}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={trend.avg_progress} className="h-1.5 flex-1" />
                      <span className="text-xs">{trend.avg_progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No engagement trend data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
