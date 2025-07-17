import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, Users, BookOpen, DollarSign, Target } from 'lucide-react'
import { useAnalyticsOverview } from '@/hooks/use-analytics'
import EngagementAnalytics from './engagement-analytics'
import PerformanceAnalytics from './performance-analytics'
import { cn } from '@/lib/utils'

const TIME_RANGES = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y', label: '1 Year' },
] as const

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ElementType
  trend?: {
    value: number
    isPositive: boolean
  }
  isLoading?: boolean
}

function MetricCard({ title, value, description, icon: Icon, trend, isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <Badge
              variant={trend.isPositive ? 'default' : 'destructive'}
              className={cn(
                'gap-1 text-xs',
                trend.isPositive
                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                  : 'bg-red-100 text-red-800 hover:bg-red-100'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface GrowthCardProps {
  title: string
  currentPeriod: number
  previousPeriod: number
  growthRate: number
  icon: React.ElementType
  isLoading?: boolean
}

function GrowthCard({ title, currentPeriod, previousPeriod, growthRate, icon: Icon, isLoading }: GrowthCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isPositive = growthRate >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{currentPeriod.toLocaleString()}</div>
        <div className="flex items-center gap-2 mt-1">
          <Badge
            variant={isPositive ? 'default' : 'destructive'}
            className={cn(
              'gap-1 text-xs',
              isPositive
                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                : 'bg-red-100 text-red-800 hover:bg-red-100'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(growthRate).toFixed(1)}%
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="text-sm font-medium">{currentPeriod.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Previous</p>
            <p className="text-sm font-medium">{previousPeriod.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsOverview() {
  const [timeRange, setTimeRange] = useState('30d')
  const { data: analytics, isLoading, error } = useAnalyticsOverview(timeRange)

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load analytics data. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Overview</h2>
          <p className="text-muted-foreground">
            Key performance metrics and insights for your learning platform
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Users"
              value={analytics?.key_metrics?.total_users?.toLocaleString() ?? '0'}
              description="Registered users"
              icon={Users}
              isLoading={isLoading}
            />
            <MetricCard
              title="Active Users"
              value={analytics?.key_metrics?.active_users?.toLocaleString() ?? '0'}
              description="Active in selected period"
              icon={Users}
              isLoading={isLoading}
            />
            <MetricCard
              title="Total Courses"
              value={analytics?.key_metrics?.total_courses?.toLocaleString() ?? '0'}
              description="Available courses"
              icon={BookOpen}
              isLoading={isLoading}
            />
            <MetricCard
              title="Total Revenue"
              value={analytics?.key_metrics?.total_revenue ? `$${analytics.key_metrics.total_revenue.toLocaleString()}` : '$0'}
              description="Total earnings"
              icon={DollarSign}
              isLoading={isLoading}
            />
          </div>

          {/* Performance Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Total Enrollments"
              value={analytics?.key_metrics?.total_enrollments?.toLocaleString() ?? '0'}
              description="Course enrollments"
              icon={BookOpen}
              isLoading={isLoading}
            />
            <MetricCard
              title="Completion Rate"
              value={analytics?.key_metrics?.completion_rate ? `${analytics.key_metrics.completion_rate.toFixed(1)}%` : '0%'}
              description="Course completion rate"
              icon={Target}
              isLoading={isLoading}
            />
            <MetricCard
              title="Average Progress"
              value={analytics?.key_metrics?.average_progress ? `${analytics.key_metrics.average_progress.toFixed(1)}%` : '0%'}
              description="Overall progress"
              icon={Target}
              isLoading={isLoading}
            />
          </div>

          {/* Growth Metrics */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Growth Analysis</h3>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
              <GrowthCard
                title="User Growth"
                currentPeriod={analytics?.growth_metrics?.user_growth?.current_period ?? 0}
                previousPeriod={analytics?.growth_metrics?.user_growth?.previous_period ?? 0}
                growthRate={analytics?.growth_metrics?.user_growth?.growth_rate ?? 0}
                icon={Users}
                isLoading={isLoading}
              />
              <GrowthCard
                title="Enrollment Growth"
                currentPeriod={analytics?.growth_metrics?.enrollment_growth?.current_period ?? 0}
                previousPeriod={analytics?.growth_metrics?.enrollment_growth?.previous_period ?? 0}
                growthRate={analytics?.growth_metrics?.enrollment_growth?.growth_rate ?? 0}
                icon={BookOpen}
                isLoading={isLoading}
              />
              <GrowthCard
                title="Completion Growth"
                currentPeriod={analytics?.growth_metrics?.completion_growth?.current_period ?? 0}
                previousPeriod={analytics?.growth_metrics?.completion_growth?.previous_period ?? 0}
                growthRate={analytics?.growth_metrics?.completion_growth?.growth_rate ?? 0}
                icon={Target}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Last Updated */}
          {analytics?.last_updated && (
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date(analytics.last_updated).toLocaleString()}
            </div>
          )}
        </TabsContent>

        <TabsContent value="engagement">
          <EngagementAnalytics />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
