import { useQuery } from '@tanstack/react-query'
import {
  IconUsers,
  IconBook,
  IconClipboardList,
  IconCurrencyDollar,
  IconClock,
  IconCheck,
  IconTrendingUp,
  IconTrendingDown,
} from '@tabler/icons-react'
import DashboardService from '@/services/dashboard'
import type { RecentActivity } from '@/services/dashboard'
import { toast } from 'sonner'
import { useTenantStore } from '@/stores/tenant-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'

const topNav = [
  { title: 'Dashboard', href: '/home', isActive: true },
  { title: 'Users', href: '/users', isActive: false },
  { title: 'Courses', href: '/courses', isActive: false },
  { title: 'Analytics', href: '/analytics', isActive: false },
]

// Icon mapping for dashboard cards
const iconMap = {
  users: IconUsers,
  book: IconBook,
  'clipboard-list': IconClipboardList,
  'currency-dollar': IconCurrencyDollar,
}

export default function Dashboard() {
  const { tenant } = useTenantStore()

  // Query for dashboard overview with new structured data
  const { data: dashboardOverview, isLoading: overviewLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: DashboardService.getDashboardOverview,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  // Query for course progress
  const { data: courseProgress, isLoading: coursesLoading } = useQuery({
    queryKey: ['course-progress'],
    queryFn: DashboardService.getCourseProgress,
    refetchInterval: 60000, // Refresh every minute
  })

  // Query for user progress
  const { data: userProgress, isLoading: usersLoading } = useQuery({
    queryKey: ['user-progress'],
    queryFn: DashboardService.getUserProgress,
    refetchInterval: 60000, // Refresh every minute
  })

  // Query for payment stats
  const { data: paymentStats, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payment-stats'],
    queryFn: DashboardService.getPaymentStats,
    refetchInterval: 120000, // Refresh every 2 minutes
  })

  const StatCard = ({
    title,
    value,
    description,
    icon,
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
    const Icon = iconMap[icon as keyof typeof iconMap] || IconUsers
    const TrendIcon = trend?.isPositive ? IconTrendingUp : IconTrendingDown

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
          <p className='text-muted-foreground flex items-center gap-1 text-xs'>
            {description}
            {trend && (
              <span
                className={`flex items-center gap-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
              >
                <TrendIcon className='h-3 w-3' />
                {Math.abs(trend.value)}%
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    )
  }

  const ActivityItem = ({ activity }: { activity: RecentActivity }) => (
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

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-6 flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {tenant?.name || 'LMS'} Dashboard
            </h1>
            <p className='text-muted-foreground'>
              Welcome back! Here's what's happening with your learning platform.
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              onClick={() => toast.success('Export feature coming soon!')}
            >
              Export Report
            </Button>
            <Button
              onClick={() =>
                toast.success('Create course feature coming soon!')
              }
            >
              Create Course
            </Button>
          </div>
        </div>

        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='courses'>Courses</TabsTrigger>
            <TabsTrigger value='users'>Users</TabsTrigger>
            <TabsTrigger value='analytics'>Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            {/* Stats Cards */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {overviewLoading
                ? // Loading skeleton for stats cards
                  Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-4 w-4' />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className='mb-2 h-8 w-20' />
                        <Skeleton className='h-3 w-32' />
                      </CardContent>
                    </Card>
                  ))
                : dashboardOverview?.cards.main_stats.map((stat, index) => (
                    <StatCard
                      key={index}
                      title={stat.title}
                      value={stat.value}
                      description={stat.description}
                      icon={stat.icon}
                      trend={stat.trend}
                      isLoading={overviewLoading}
                    />
                  ))}
            </div>

            {/* Main Content Grid */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
              {/* Charts Section */}
              <div className='col-span-4'>
                <Overview
                  chartData={
                    dashboardOverview?.charts || {
                      enrollment_trends: [],
                      completion_trends: [],
                      revenue_trends: [],
                      category_distribution: [],
                      user_activity_trends: [],
                      monthly_stats: [],
                    }
                  }
                  isLoading={overviewLoading}
                />
              </div>

              {/* Sidebar with Recent Activity and Quick Stats */}
              <div className='col-span-3 space-y-4'>
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest activities from your learning platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {overviewLoading ? (
                      <div className='space-y-4'>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className='flex items-center space-x-4'>
                            <Skeleton className='h-8 w-8 rounded-full' />
                            <div className='space-y-2'>
                              <Skeleton className='h-4 w-[200px]' />
                              <Skeleton className='h-3 w-[120px]' />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        {dashboardOverview?.recent_activities?.map(
                          (activity) => (
                            <ActivityItem
                              key={activity.id}
                              activity={activity}
                            />
                          )
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                    <CardDescription>Key metrics at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {overviewLoading ? (
                      <div className='space-y-4'>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className='space-y-2'>
                            <div className='flex items-center justify-between'>
                              <Skeleton className='h-4 w-32' />
                              <Skeleton className='h-4 w-12' />
                            </div>
                            <Skeleton className='h-2 w-full' />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className='space-y-2'>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium'>
                              Course Completion Rate
                            </span>
                            <span className='text-sm'>
                              {dashboardOverview?.cards.quick_stats
                                .completion_rate || 0}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              dashboardOverview?.cards.quick_stats
                                .completion_rate || 0
                            }
                            className='w-full'
                          />
                        </div>

                        <div className='space-y-2'>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium'>
                              Active Users
                            </span>
                            <span className='text-sm'>
                              {dashboardOverview?.cards.quick_stats
                                .active_users || 0}
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
                              {dashboardOverview?.cards.quick_stats
                                .pending_enrollments || 0}
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
                            <span className='text-sm font-medium'>
                              Revenue Growth
                            </span>
                            <span
                              className={`text-sm ${
                                (dashboardOverview?.cards.quick_stats
                                  .revenue_growth || 0) >= 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {(dashboardOverview?.cards.quick_stats
                                .revenue_growth || 0) >= 0
                                ? '+'
                                : ''}
                              {dashboardOverview?.cards.quick_stats
                                .revenue_growth || 0}
                              %
                            </span>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <IconCurrencyDollar className='h-4 w-4 text-blue-500' />
                            <span className='text-muted-foreground text-xs'>
                              Monthly growth
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='courses' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Course Performance</CardTitle>
                <CardDescription>
                  Track the performance of your courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {coursesLoading ? (
                  <div className='space-y-4'>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className='flex items-center space-x-4'>
                        <Skeleton className='h-12 w-12 rounded' />
                        <div className='space-y-2'>
                          <Skeleton className='h-4 w-[250px]' />
                          <Skeleton className='h-3 w-[150px]' />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='space-y-6'>
                    {courseProgress?.map((course) => (
                      <div
                        key={course.id}
                        className='flex items-center justify-between rounded-lg border p-4'
                      >
                        <div className='space-y-1'>
                          <h4 className='font-medium'>{course.title}</h4>
                          <p className='text-muted-foreground text-sm'>
                            Instructor: {course.instructor}
                          </p>
                          <div className='flex items-center space-x-4 text-sm'>
                            <span>{course.enrollments} enrollments</span>
                            <span>{course.completions} completions</span>
                            <Badge
                              variant={
                                course.status === 'active'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {course.status}
                            </Badge>
                          </div>
                        </div>
                        <div className='space-y-2 text-right'>
                          <div className='text-2xl font-bold'>
                            {course.completionRate}%
                          </div>
                          <Progress
                            value={course.completionRate}
                            className='w-24'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='users' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>User Progress</CardTitle>
                <CardDescription>
                  Monitor your learners' progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className='space-y-4'>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className='flex items-center space-x-4'>
                        <Skeleton className='h-10 w-10 rounded-full' />
                        <div className='space-y-2'>
                          <Skeleton className='h-4 w-[200px]' />
                          <Skeleton className='h-3 w-[150px]' />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {userProgress?.map((user) => (
                      <div
                        key={user.id}
                        className='flex items-center justify-between rounded-lg border p-4'
                      >
                        <div className='flex items-center space-x-4'>
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className='space-y-1'>
                            <h4 className='font-medium'>{user.name}</h4>
                            <p className='text-muted-foreground text-sm'>
                              {user.email}
                            </p>
                            <div className='flex items-center space-x-4 text-sm'>
                              <span>{user.enrolledCourses} enrolled</span>
                              <span>{user.completedCourses} completed</span>
                              <Badge
                                variant={
                                  user.role === 'admin'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {user.role}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className='space-y-2 text-right'>
                          <div className='text-lg font-semibold'>
                            {user.totalProgress}%
                          </div>
                          <Progress
                            value={user.totalProgress}
                            className='w-24'
                          />
                          <p className='text-muted-foreground text-xs'>
                            Last active: {user.lastActivity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='analytics' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Statistics</CardTitle>
                  <CardDescription>
                    Revenue and payment insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentsLoading ? (
                    <div className='space-y-4'>
                      <Skeleton className='h-8 w-full' />
                      <Skeleton className='h-8 w-full' />
                      <Skeleton className='h-8 w-full' />
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>
                          Monthly Revenue
                        </span>
                        <span className='text-lg font-semibold'>
                          ${paymentStats?.monthlyRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>
                          Average Order Value
                        </span>
                        <span className='text-lg font-semibold'>
                          ${paymentStats?.averageOrderValue.toFixed(2)}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>
                          Revenue Growth
                        </span>
                        <span
                          className={`text-lg font-semibold ${
                            (paymentStats?.revenueGrowth || 0) > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {paymentStats?.revenueGrowth > 0 ? '+' : ''}
                          {paymentStats?.revenueGrowth}%
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>
                    Platform performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        API Response Time
                      </span>
                      <div className='flex items-center space-x-2'>
                        <IconCheck className='h-4 w-4 text-green-500' />
                        <span className='text-sm'>125ms</span>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        Database Status
                      </span>
                      <div className='flex items-center space-x-2'>
                        <IconCheck className='h-4 w-4 text-green-500' />
                        <span className='text-sm'>Healthy</span>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Uptime</span>
                      <div className='flex items-center space-x-2'>
                        <IconCheck className='h-4 w-4 text-green-500' />
                        <span className='text-sm'>99.9%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
