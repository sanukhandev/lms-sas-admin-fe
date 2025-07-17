import { useUserStats } from '@/hooks/use-users'
import { Users, UserCheck, UserPlus, DollarSign, TrendingUp, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export function UserStats() {
  const { data: userStats, isLoading, error } = useUserStats()
  if (isLoading) {
    return (
      <div className='mb-8 space-y-6'>
        {/* Stats Cards */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }, (_, i) => (
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
          ))}
        </div>
        
        {/* Top Performers Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-32' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <Skeleton className='h-8 w-8 rounded-full' />
                    <Skeleton className='h-8 w-8 rounded-full' />
                    <div>
                      <Skeleton className='mb-1 h-4 w-24' />
                      <Skeleton className='h-3 w-32' />
                    </div>
                  </div>
                  <div className='text-right'>
                    <Skeleton className='mb-1 h-4 w-16' />
                    <Skeleton className='h-5 w-20' />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className='mb-8'>
        <CardContent className='pt-6'>
          <div className='text-center text-red-500'>
            Failed to load user statistics
          </div>
        </CardContent>
      </Card>
    )
  }

  const metrics = [
    {
      title: 'Total Users',
      value: userStats?.data?.totalUsers || 0,
      description: 'All registered users',
      icon: Users,
      trend: '+12% from last month',
    },
    {
      title: 'Active Users',
      value: userStats?.data?.activeUsers || 0,
      description: 'Currently active users',
      icon: UserCheck,
      trend: `${(((userStats?.data?.activeUsers || 0) / (userStats?.data?.totalUsers || 1)) * 100).toFixed(1)}% of total`,
    },
    {
      title: 'New This Month',
      value: userStats?.data?.newUsersThisMonth || 0,
      description: 'New registrations',
      icon: UserPlus,
      trend: '+23% from last month',
    },
    {
      title: 'Total Revenue',
      value: `$${(userStats?.data?.totalRevenue || 0).toLocaleString()}`,
      description: 'From all users',
      icon: DollarSign,
      trend: '+15% from last month',
    },
  ]

  return (
    <div className='mb-8 space-y-6'>
      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  {metric.title}
                </CardTitle>
                <Icon className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{metric.value}</div>
                <p className='text-muted-foreground text-xs'>
                  {metric.description}
                </p>
                <div className='mt-2 flex items-center text-xs text-green-600'>
                  <TrendingUp className='mr-1 h-3 w-3' />
                  {metric.trend}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Top Performers Section */}
      {userStats?.data?.topPerformers && userStats?.data?.topPerformers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Trophy className='h-5 w-5 text-yellow-500' />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {userStats?.data?.topPerformers.slice(0, 5).map((user, index) => (
                <div
                  key={user.id}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold'>
                      #{index + 1}
                    </div>
                    <Avatar className='h-8 w-8'>
                      <AvatarFallback>
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className='text-sm font-medium'>{user.name}</p>
                      <p className='text-muted-foreground text-xs'>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-medium'>
                      {user.completedCourses}/{user.enrolledCourses} courses
                    </div>
                    <Badge variant='secondary' className='text-xs'>
                      {user.progressPercentage}% avg progress
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
