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
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={data.enrollment_trends}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='period'
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
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type='monotone'
                    dataKey='enrollments'
                    stackId='1'
                    stroke='hsl(var(--chart-1))'
                    fill='hsl(var(--chart-1))'
                    fillOpacity={0.8}
                  />
                  <Area
                    type='monotone'
                    dataKey='completions'
                    stackId='1'
                    stroke='hsl(var(--chart-2))'
                    fill='hsl(var(--chart-2))'
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value='completion' className='space-y-4'>
            <div className='h-[350px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={data.completion_trends}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='period'
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
                            <p className='text-sm text-blue-600'>
                              Rate: {payload[1]?.value}%
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type='monotone'
                    dataKey='completions'
                    stroke='hsl(var(--chart-2))'
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-2))' }}
                  />
                  <Line
                    type='monotone'
                    dataKey='rate'
                    stroke='hsl(var(--chart-3))'
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--chart-3))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value='revenue' className='space-y-4'>
            <div className='h-[350px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={data.revenue_trends}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='period'
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
                            <p className='text-sm text-blue-600'>
                              Growth: {payload[1]?.value}%
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey='revenue'
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
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={80}
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
                        return (
                          <div className='bg-background rounded-lg border p-3 shadow-md'>
                            <p className='font-medium'>
                              {payload[0]?.payload.category}
                            </p>
                            <p className='text-sm text-blue-600'>
                              Count: {payload[0]?.value}
                            </p>
                            <p className='text-sm text-green-600'>
                              Percentage: {payload[0]?.payload.percentage}%
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
                    dataKey='period'
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
                            <p className='text-sm text-green-600'>
                              Logins: {payload[1]?.value}
                            </p>
                            <p className='text-sm text-purple-600'>
                              Registrations: {payload[2]?.value}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type='monotone'
                    dataKey='active_users'
                    stackId='1'
                    stroke='hsl(var(--chart-1))'
                    fill='hsl(var(--chart-1))'
                    fillOpacity={0.8}
                  />
                  <Area
                    type='monotone'
                    dataKey='logins'
                    stackId='1'
                    stroke='hsl(var(--chart-2))'
                    fill='hsl(var(--chart-2))'
                    fillOpacity={0.8}
                  />
                  <Area
                    type='monotone'
                    dataKey='registrations'
                    stackId='1'
                    stroke='hsl(var(--chart-3))'
                    fill='hsl(var(--chart-3))'
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value='monthly' className='space-y-4'>
            <div className='h-[350px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={data.monthly_stats}>
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
                            <p className='text-sm text-orange-600'>
                              Active Users: {payload[3]?.value}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey='total_enrollments'
                    fill='hsl(var(--chart-1))'
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey='total_completions'
                    fill='hsl(var(--chart-2))'
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey='total_revenue'
                    fill='hsl(var(--chart-3))'
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey='active_users'
                    fill='hsl(var(--chart-4))'
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
