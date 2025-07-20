import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

interface CategoryDistributionChartProps {
  data: Array<{
    category: string
    count: number
    percentage: number
  }>
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export function CategoryDistributionChart({
  data,
}: CategoryDistributionChartProps) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <PieChart>
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          labelLine={false}
          label={({ category, percentage }) => `${category} (${percentage}%)`}
          outerRadius={80}
          fill='#8884d8'
          dataKey='count'
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload
              return (
                <div className='bg-background rounded-lg border p-3 shadow-sm'>
                  <p className='text-sm font-medium'>{data.category}</p>
                  <p className='text-muted-foreground text-sm'>
                    Count: {data.count}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    Percentage: {data.percentage}%
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
