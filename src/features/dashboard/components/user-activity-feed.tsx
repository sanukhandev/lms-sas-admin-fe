import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/services/users'
import {
  Activity,
  BookOpen,
  Clock,
  Play,
  CheckCircle,
  FileText,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function UserActivityFeed() {
  const [page, setPage] = useState(1)

  const {
    data: activityData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userActivity', page],
    queryFn: () => usersService.getUserActivity(page, 10),
  })

  const getActivityIcon = (activity: string) => {
    if (activity.includes('enrolled'))
      return <BookOpen className='h-4 w-4 text-blue-500' />
    if (activity.includes('completed'))
      return <CheckCircle className='h-4 w-4 text-green-500' />
    if (activity.includes('started'))
      return <Play className='h-4 w-4 text-orange-500' />
    if (activity.includes('submitted'))
      return <FileText className='h-4 w-4 text-purple-500' />
    return <Activity className='h-4 w-4 text-gray-500' />
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60)
    )

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='h-5 w-5' />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className='flex items-start space-x-3'>
                <Skeleton className='h-8 w-8 rounded-full' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-3 w-1/2' />
                </div>
                <Skeleton className='h-3 w-12' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='text-center text-red-500'>
            Failed to load user activity
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Activity className='h-5 w-5' />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {activityData?.data.map((activity) => (
            <div
              key={activity.id}
              className='hover:bg-muted/50 flex items-start space-x-3 rounded-lg p-3 transition-colors'
            >
              <div className='flex-shrink-0'>
                {getActivityIcon(activity.activity)}
              </div>
              <div className='min-w-0 flex-1'>
                <div className='mb-1 flex items-center gap-2'>
                  <Avatar className='h-6 w-6'>
                    <AvatarFallback className='text-xs'>
                      U{activity.userId}
                    </AvatarFallback>
                  </Avatar>
                  <span className='text-sm font-medium'>
                    User {activity.userId}
                  </span>
                </div>
                <p className='text-foreground text-sm'>{activity.activity}</p>
                {activity.courseName && (
                  <div className='mt-1 flex items-center gap-1'>
                    <BookOpen className='text-muted-foreground h-3 w-3' />
                    <span className='text-muted-foreground text-xs'>
                      {activity.courseName}
                    </span>
                  </div>
                )}
              </div>
              <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                <Clock className='h-3 w-3' />
                {formatTimeAgo(activity.timestamp)}
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {activityData?.meta && page < activityData.meta.last_page && (
          <div className='mt-4 flex justify-center'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setPage(page + 1)}
            >
              Load More Activity
            </Button>
          </div>
        )}

        {/* Empty State */}
        {activityData?.data.length === 0 && (
          <div className='py-8 text-center'>
            <Activity className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <p className='text-muted-foreground'>
              No recent activity to display
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
