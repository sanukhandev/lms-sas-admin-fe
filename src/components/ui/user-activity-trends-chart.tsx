import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

interface UserActivityTrendsChartProps {
  data: Array<{
    period: string
    logins: number
    registrations: number
    active_users: number
  }>
}

export function UserActivityTrendsChart({
  data,
}: UserActivityTrendsChartProps) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
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
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className='bg-background rounded-lg border p-3 shadow-sm'>
                  <p className='text-sm font-medium'>{label}</p>
                  <p className='text-sm text-blue-600'>
                    Logins: {payload[0]?.value}
                  </p>
                  <p className='text-sm text-green-600'>
                    Registrations: {payload[1]?.value}
                  </p>
                  <p className='text-sm text-purple-600'>
                    Active Users: {payload[2]?.value}
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type='monotone'
          dataKey='logins'
          stroke='hsl(var(--chart-1))'
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2 }}
        />
        <Line
          type='monotone'
          dataKey='registrations'
          stroke='hsl(var(--chart-2))'
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2 }}
        />
        <Line
          type='monotone'
          dataKey='active_users'
          stroke='hsl(var(--chart-3))'
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
