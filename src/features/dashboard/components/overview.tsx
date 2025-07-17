import { useQuery } from '@tanstack/react-query'
import {
  IconUsers,
  IconBook,
  IconClipboardList,
  IconCurrencyDollar,
  IconTrendingUp,
  IconTrendingDown,
  IconClock,
  IconCheck,
} from '@tabler/icons-react'
import { DashboardService } from '@/services/dashboard'
import type { DashboardOverview as DashboardOverviewType, RecentActivity } from '@/services/dashboard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { DashboardCharts } from '@/components/dashboard-charts'

const getIcon = (iconName: string) => {
  const icons = {
    users: IconUsers,
    book: IconBook,
    'clipboard-list': IconClipboardList,
    'currency-dollar': IconCurrencyDollar,
  }
  return icons[iconName as keyof typeof icons] || IconUsers
}

export function Overview() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: DashboardService.getDashboardOverview,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const { data: recentActivities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: DashboardService.getRecentActivity,
    refetchInterval: 15000, // Refresh every 15 seconds
  })

  const StatCard = ({
    title,
    value,
    description,
    icon: iconName,
    trend,
    isLoading,
  }: {
    title: string
    value: string | number
    description: string
    icon: string
    trend?: { value: number; isPositive: boolean }
    isLoading?: boolean
  }) => {
    const Icon = getIcon(iconName)

    return (
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>{title}</CardTitle>
          <Icon className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className='mb-2 h-8 w-24' />
          ) : (
            <div className='text-2xl font-bold'>{value}</div>
          )}
          <p className='text-muted-foreground text-xs'>
            {description}
            {trend && (
              <span
                className={`ml-2 inline-flex items-center ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? (
                  <IconTrendingUp className='mr-1 h-3 w-3' />
                ) : (
                  <IconTrendingDown className='mr-1 h-3 w-3' />
                )}
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    )
  }

  const ActivityItem = ({
    activity,
  }: {
    activity: DashboardOverviewType['recent_activities'][0]
  }) => (
    <div className='flex items-center space-x-4'>
      <Avatar className='h-8 w-8'>
        <AvatarImage src={activity.user.avatar} />
        <AvatarFallback>
          {activity.user.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')}
        </AvatarFallback>
      </Avatar>
      <div className='flex-1 space-y-1'>
        <p className='text-sm leading-none font-medium'>{activity.message}</p>
        <p className='text-muted-foreground text-xs'>{activity.timestamp}</p>
      </div>
      <Badge variant={activity.type === 'completion' ? 'default' : 'secondary'}>
        {activity.type}
      </Badge>
    </div>
  )

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {/* Stats Cards Skeleton */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-4' />
              </CardHeader>
              <CardContent>
                <Skeleton className='mb-2 h-8 w-24' />
                <Skeleton className='h-3 w-32' />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts and Activities Skeleton */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <Card className='col-span-4'>
            <CardHeader>
              <Skeleton className='h-5 w-32' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-[350px] w-full' />
            </CardContent>
          </Card>
          <Card className='col-span-3'>
            <CardHeader>
              <Skeleton className='h-5 w-32' />
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className='flex items-center space-x-4'>
                    <Skeleton className='h-8 w-8 rounded-full' />
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-[250px]' />
                      <Skeleton className='h-3 w-[150px]' />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <p className='text-muted-foreground'>No data available</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Main Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {dashboardData.cards.main_stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Charts and Activities Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        {/* Charts Section */}
        <div className='col-span-4'>
          <DashboardCharts data={dashboardData.charts} />
        </div>

        {/* Right Side Panel */}
        <div className='col-span-3 space-y-4'>
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {dashboardData.recent_activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>
                    Course Completion Rate
                  </span>
                  <span className='text-sm'>
                    {dashboardData.cards.quick_stats.completion_rate}%
                  </span>
                </div>
                <Progress
                  value={dashboardData.cards.quick_stats.completion_rate}
                  className='w-full'
                />
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Active Users</span>
                  <span className='text-sm'>
                    {dashboardData.cards.quick_stats.active_users}
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <IconUsers className='h-4 w-4 text-green-500' />
                  <span className='text-muted-foreground text-xs'>
                    Currently online
                  </span>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>
                    Pending Enrollments
                  </span>
                  <span className='text-sm'>
                    {dashboardData.cards.quick_stats.pending_enrollments}
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <IconClock className='h-4 w-4 text-yellow-500' />
                  <span className='text-muted-foreground text-xs'>
                    Awaiting approval
                  </span>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Revenue Growth</span>
                  <span
                    className={`text-sm ${
                      dashboardData.cards.quick_stats.revenue_growth > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {dashboardData.cards.quick_stats.revenue_growth > 0
                      ? '+'
                      : ''}
                    {dashboardData.cards.quick_stats.revenue_growth}%
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <IconCheck className='h-4 w-4 text-green-500' />
                  <span className='text-muted-foreground text-xs'>
                    Monthly growth
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
