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
import type {
  RecentActivity,
} from '@/services/dashboard'
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

  const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'completion':
          return <IconCheck className='h-4 w-4 text-green-500' />
        case 'payment':
          return <IconCurrencyDollar className='h-4 w-4 text-blue-500' />
        default:
          return <IconUsers className='h-4 w-4 text-gray-500' />
      }
    }

    const getBadgeVariant = (type: string) => {
      switch (type) {
        case 'completion':
          return 'default'
        case 'payment':
          return 'secondary'
        default:
          return 'outline'
      }
    }

    return (
      <div className='flex items-start space-x-4 rounded-lg p-3 transition-colors hover:bg-gray-50'>
        <div className='relative'>
          <Avatar className='h-10 w-10'>
            <AvatarImage src={activity.user.avatar} />
            <AvatarFallback className='bg-primary/10 text-primary font-medium'>
              {activity.user.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className='absolute -right-1 -bottom-1 rounded-full bg-white p-1 shadow-sm'>
            {getActivityIcon(activity.type)}
          </div>
        </div>
        <div className='min-w-0 flex-1'>
          <div className='mb-1 flex items-center justify-between'>
            <p className='truncate text-sm font-medium text-gray-900'>
              {activity.user.name}
            </p>
            <Badge variant={getBadgeVariant(activity.type)} className='text-xs'>
              {activity.type}
            </Badge>
          </div>
          <p className='mb-1 text-sm leading-relaxed text-gray-600'>
            {activity.message}
          </p>
          <p className='flex items-center text-xs text-gray-500'>
            <IconClock className='mr-1 h-3 w-3' />
            {activity.timestamp}
          </p>
        </div>
      </div>
    )
  }

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

      {/* Charts and Quick Stats Grid - Analytics Overview with Quick Stats */}
      <div className='grid gap-4 lg:grid-cols-10'>
        {/* Charts Section - 70% width */}
        <div className='col-span-7'>
          <DashboardCharts data={dashboardData.charts} />
        </div>

        {/* Quick Stats Panel - 30% width */}
        <div className='col-span-3'>
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

      {/* Recent Activity - Full Width at Bottom */}
      <Card>
        <CardHeader className='pb-4'>
          <CardTitle className='text-lg font-semibold'>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingActivities ? (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className='flex items-start space-x-4 p-3'>
                  <Skeleton className='h-10 w-10 rounded-full' />
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-3 w-full' />
                    <Skeleton className='h-3 w-20' />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {recentActivities && recentActivities.length > 0 ? (
                recentActivities
                  .slice(0, 8)
                  .map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))
              ) : (
                <div className='col-span-full py-12 text-center'>
                  <div className='mx-auto mb-4 h-12 w-12 text-gray-400'>
                    <IconUsers className='h-full w-full' />
                  </div>
                  <p className='text-sm font-medium text-gray-500'>
                    No recent activities
                  </p>
                  <p className='mt-1 text-xs text-gray-400'>
                    Activity will appear here once users start interacting
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
