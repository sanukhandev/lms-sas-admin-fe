import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

interface RevenueTrendsChartProps {
  data: Array<{
    period: string
    revenue: number
    growth: number
  }>
}

export function RevenueTrendsChart({ data }: RevenueTrendsChartProps) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <AreaChart
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
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className='bg-background rounded-lg border p-3 shadow-sm'>
                  <p className='text-sm font-medium'>{label}</p>
                  <p className='text-sm text-emerald-600'>
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
        <Area
          type='monotone'
          dataKey='revenue'
          stroke='hsl(var(--chart-1))'
          fill='hsl(var(--chart-1))'
          fillOpacity={0.1}
          strokeWidth={2}
        />
        <Area
          type='monotone'
          dataKey='growth'
          stroke='hsl(var(--chart-2))'
          fill='hsl(var(--chart-2))'
          fillOpacity={0.1}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
