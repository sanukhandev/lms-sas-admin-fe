import type { ChartData } from '@/services/dashboard'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DashboardChartsProps {
  data: ChartData
  className?: string
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export function DashboardCharts({ data, className }: DashboardChartsProps) {
  // Handle empty or undefined data
  if (!data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex h-[350px] items-center justify-center'>
            <p className='text-muted-foreground'>No chart data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='enrollment' className='w-full'>
          <TabsList className='grid w-full grid-cols-6'>
            <TabsTrigger value='enrollment'>Enrollment</TabsTrigger>
            <TabsTrigger value='completion'>Completion</TabsTrigger>
            <TabsTrigger value='revenue'>Revenue</TabsTrigger>
            <TabsTrigger value='category'>Categories</TabsTrigger>
            <TabsTrigger value='activity'>Activity</TabsTrigger>
            <TabsTrigger value='monthly'>Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value='enrollment' className='space-y-4'>
            <div className='h-[350px]'>
              {data.enrollment_trends && data.enrollment_trends.length > 0 ? (
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={data.enrollment_trends}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='date'
                      stroke='hsl(var(--muted-foreground))'
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke='hsl(var(--muted-foreground))'
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className='bg-background rounded-lg border p-3 shadow-md'>
                              <p className='font-medium'>{label}</p>
                              <p className='text-sm text-blue-600'>
                                Enrollments: {payload[0]?.value}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type='monotone'
                      dataKey='count'
                      stackId='1'
                      stroke='hsl(var(--chart-1))'
                      fill='hsl(var(--chart-1))'
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className='flex h-full items-center justify-center'>
                  <div className='text-center'>
                    <p className='text-muted-foreground text-lg'>
                      No enrollment data available
                    </p>
                    <p className='text-muted-foreground mt-2 text-sm'>
                      Enrollment trends will appear here once you have
                      enrollment data
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value='completion' className='space-y-4'>
            <div className='h-[350px]'>
              {data.completion_trends && data.completion_trends.length > 0 ? (
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={data.completion_trends}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='date'
                      stroke='hsl(var(--muted-foreground))'
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke='hsl(var(--muted-foreground))'
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className='bg-background rounded-lg border p-3 shadow-md'>
                              <p className='font-medium'>{label}</p>
                              <p className='text-sm text-green-600'>
                                Completions: {payload[0]?.value}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type='monotone'
                      dataKey='count'
                      stroke='hsl(var(--chart-2))'
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--chart-2))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className='flex h-full items-center justify-center'>
                  <div className='text-center'>
                    <p className='text-muted-foreground text-lg'>
                      No completion data available
                    </p>
                    <p className='text-muted-foreground mt-2 text-sm'>
                      Completion trends will appear here once you have
                      completion data
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value='revenue' className='space-y-4'>
            <div className='h-[350px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={data.revenue_trends}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='date'
                    stroke='hsl(var(--muted-foreground))'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke='hsl(var(--muted-foreground))'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className='bg-background rounded-lg border p-3 shadow-md'>
                            <p className='font-medium'>{label}</p>
                            <p className='text-sm text-green-600'>
                              Revenue: ${payload[0]?.value?.toLocaleString()}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey='total'
                    fill='hsl(var(--chart-1))'
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value='category' className='space-y-4'>
            <div className='h-[350px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={data.category_distribution}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ category, percent }) => {
                      const percentage = (percent * 100).toFixed(1)
                      return `${category}: ${percentage}%`
                    }}
                    outerRadius={120}
                    fill='#8884d8'
                    dataKey='count'
                  >
                    {data.category_distribution.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const itemData = payload[0]?.payload
                        const total =
                          data.category_distribution?.reduce(
                            (sum: number, item: { count: number }) =>
                              sum + item.count,
                            0
                          ) || 0
                        const percentage =
                          total > 0
                            ? ((itemData.count / total) * 100).toFixed(1)
                            : '0'
                        return (
                          <div className='bg-background rounded-lg border p-3 shadow-md'>
                            <p className='font-medium'>{itemData.category}</p>
                            <p className='text-sm text-blue-600'>
                              Count: {itemData.count}
                            </p>
                            <p className='text-sm text-green-600'>
                              Percentage: {percentage}%
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value='activity' className='space-y-4'>
            <div className='h-[350px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={data.user_activity_trends}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='date'
                    stroke='hsl(var(--muted-foreground))'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke='hsl(var(--muted-foreground))'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className='bg-background rounded-lg border p-3 shadow-md'>
                            <p className='font-medium'>{label}</p>
                            <p className='text-sm text-blue-600'>
                              Active Users: {payload[0]?.value}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type='monotone'
                    dataKey='count'
                    stackId='1'
                    stroke='hsl(var(--chart-1))'
                    fill='hsl(var(--chart-1))'
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value='monthly' className='space-y-4'>
            <div className='h-[350px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={[data.monthly_stats]}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='month'
                    stroke='hsl(var(--muted-foreground))'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke='hsl(var(--muted-foreground))'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className='bg-background rounded-lg border p-3 shadow-md'>
                            <p className='font-medium'>{label}</p>
                            <p className='text-sm text-blue-600'>
                              Enrollments: {payload[0]?.value}
                            </p>
                            <p className='text-sm text-green-600'>
                              Completions: {payload[1]?.value}
                            </p>
                            <p className='text-sm text-purple-600'>
                              Revenue: ${payload[2]?.value?.toLocaleString()}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey='enrollments'
                    fill='hsl(var(--chart-1))'
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey='completions'
                    fill='hsl(var(--chart-2))'
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey='revenue'
                    fill='hsl(var(--chart-3))'
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
