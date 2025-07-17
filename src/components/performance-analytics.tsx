import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Target, TrendingUp, Clock, AlertCircle, Trophy, User } from 'lucide-react'
import { usePerformanceMetrics } from '@/hooks/use-analytics'

const TIME_RANGES = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
] as const

interface TopCourseCardProps {
  title: string
  completionRate: number
  enrollments: number
  avgScore: number
  isLoading?: boolean
}

function TopCourseCard({ title, completionRate, enrollments, avgScore, isLoading }: TopCourseCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="h-8 w-8 rounded" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
            <Trophy className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm truncate">{title}</h4>
            <p className="text-xs text-muted-foreground">{enrollments} students</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Completion</span>
            <span className="font-medium">{completionRate.toFixed(1)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
          <div className="text-xs text-muted-foreground">
            Avg Score: {avgScore.toFixed(1)}%
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface StrugglingStudentCardProps {
  name: string
  email: string
  coursesStarted: number
  completionRate: number
  isLoading?: boolean
}

function StrugglingStudentCard({ name, email, coursesStarted, completionRate, isLoading }: StrugglingStudentCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-32 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{name}</h4>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {coursesStarted} courses
              </Badge>
              <Badge variant={completionRate < 20 ? 'destructive' : 'secondary'} className="text-xs">
                {completionRate.toFixed(0)}% done
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PerformanceAnalytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const { data: performance, isLoading, error } = usePerformanceMetrics(timeRange)

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load performance metrics. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Analytics</h2>
          <p className="text-muted-foreground">
            Course completion rates, student performance, and learning outcomes
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

      {/* Key Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {performance?.completion_rates?.length 
                  ? (performance.completion_rates.reduce((acc: number, rate: any) => acc + rate.completion_rate, 0) / performance.completion_rates.length).toFixed(1)
                  : 0}%
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Average across all courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {performance?.average_completion_time && performance.average_completion_time > 0 
                  ? Math.round(performance.average_completion_time / 24) 
                  : 0}d
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Days to complete courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performing</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {performance?.top_performing_courses?.length ?? 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              High-performing courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk Students</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {performance?.struggling_students?.length ?? 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Need support
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Courses */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Top Performing Courses</h3>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <TopCourseCard
                key={i}
                title=""
                completionRate={0}
                enrollments={0}
                avgScore={0}
                isLoading={true}
              />
            ))}
          </div>
        ) : performance?.top_performing_courses?.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {performance.top_performing_courses.slice(0, 6).map((course: any, index: number) => (
              <TopCourseCard
                key={index}
                title={course.title || `Course ${index + 1}`}
                completionRate={parseFloat(course.student_progress_avg_completion_percentage) || 0}
                enrollments={course.enrollments || 0}
                avgScore={parseFloat(course.student_progress_avg_completion_percentage) || 0}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Performance Data</h3>
              <p className="text-muted-foreground text-sm">
                No course performance data available for the selected time period.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Students Needing Support */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Students Needing Support</h3>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StrugglingStudentCard
                key={i}
                name=""
                email=""
                coursesStarted={0}
                completionRate={0}
                isLoading={true}
              />
            ))}
          </div>
        ) : performance?.struggling_students?.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {performance.struggling_students.slice(0, 6).map((student: any, index: number) => {
              const coursesStarted = student.student_progress?.length || 0;
              const avgCompletionRate = student.student_progress?.length 
                ? student.student_progress.reduce((acc: number, progress: any) => acc + parseFloat(progress.completion_percentage || 0), 0) / student.student_progress.length
                : 0;
              
              return (
                <StrugglingStudentCard
                  key={index}
                  name={student.name || `Student ${index + 1}`}
                  email={student.email || 'student@example.com'}
                  coursesStarted={coursesStarted}
                  completionRate={avgCompletionRate}
                />
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Students On Track</h3>
              <p className="text-muted-foreground text-sm">
                No students currently need additional support.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Performance Distribution Chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Performance Distribution</h3>
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate Distribution</CardTitle>
            <CardDescription>
              How completion rates are distributed across all courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <Skeleton className="h-[180px] w-full" />
              </div>
            ) : performance?.performance_distribution ? (
              <div className="space-y-4">
                {Object.entries(performance.performance_distribution).map(([key, data]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${
                        key === 'excellent' ? 'bg-green-500' :
                        key === 'good' ? 'bg-blue-500' :
                        key === 'average' ? 'bg-yellow-500' :
                        key === 'below_average' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium capitalize">{key.replace('_', ' ')}</span>
                      <span className="text-xs text-muted-foreground">
                        ({data.min}-{data.max}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{data.count} students</span>
                      <Badge variant="outline" className="text-xs">
                        {data.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No performance distribution data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
