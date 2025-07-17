import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryDistributionChart } from '@/components/ui/category-distribution-chart'
import { EnrollmentTrendsChart } from '@/components/ui/enrollment-trends-chart'
import { RevenueTrendsChart } from '@/components/ui/revenue-trends-chart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserActivityTrendsChart } from '@/components/ui/user-activity-trends-chart'

interface ChartData {
  enrollment_trends: Array<{
    period: string
    enrollments: number
    completions: number
  }>
  completion_trends: Array<{
    period: string
    completions: number
    rate: number
  }>
  revenue_trends: Array<{
    period: string
    revenue: number
    growth: number
  }>
  category_distribution: Array<{
    category: string
    count: number
    percentage: number
  }>
  user_activity_trends: Array<{
    period: string
    logins: number
    registrations: number
    active_users: number
  }>
  monthly_stats: Array<{
    month: string
    total_enrollments: number
    total_completions: number
    total_revenue: number
    active_users: number
  }>
}

interface DashboardChartsProps {
  data: ChartData
  isLoading?: boolean
}

export function DashboardCharts({ data, isLoading }: DashboardChartsProps) {
  if (isLoading) {
    return (
      <Card className='col-span-full'>
        <CardContent className='p-6'>
          <div className='flex h-[400px] items-center justify-center'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-b-2'></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='col-span-full'>
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='enrollment' className='w-full'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='enrollment'>Enrollment Trends</TabsTrigger>
            <TabsTrigger value='revenue'>Revenue Trends</TabsTrigger>
            <TabsTrigger value='categories'>Category Distribution</TabsTrigger>
            <TabsTrigger value='activity'>User Activity</TabsTrigger>
          </TabsList>

          <TabsContent value='enrollment' className='space-y-4'>
            <div className='text-muted-foreground text-sm'>
              Course enrollment and completion trends over time
            </div>
            <EnrollmentTrendsChart data={data.enrollment_trends} />
          </TabsContent>

          <TabsContent value='revenue' className='space-y-4'>
            <div className='text-muted-foreground text-sm'>
              Revenue trends and growth metrics
            </div>
            <RevenueTrendsChart data={data.revenue_trends} />
          </TabsContent>

          <TabsContent value='categories' className='space-y-4'>
            <div className='text-muted-foreground text-sm'>
              Course distribution across categories
            </div>
            <CategoryDistributionChart data={data.category_distribution} />
          </TabsContent>

          <TabsContent value='activity' className='space-y-4'>
            <div className='text-muted-foreground text-sm'>
              User activity and engagement metrics
            </div>
            <UserActivityTrendsChart data={data.user_activity_trends} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
