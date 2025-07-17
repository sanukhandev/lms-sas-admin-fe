import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

interface EnrollmentTrendsChartProps {
  data: Array<{
    period: string
    enrollments: number
    completions: number
  }>
}

export function EnrollmentTrendsChart({ data }: EnrollmentTrendsChartProps) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart
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
        <Bar
          dataKey='enrollments'
          fill='hsl(var(--primary))'
          radius={[4, 4, 0, 0]}
          name='Enrollments'
        />
        <Bar
          dataKey='completions'
          fill='hsl(var(--chart-2))'
          radius={[4, 4, 0, 0]}
          name='Completions'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
