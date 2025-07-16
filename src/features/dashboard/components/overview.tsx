import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

// LMS-specific data for student enrollments over time
const enrollmentData = [
  {
    name: 'Jan',
    enrollments: 245,
    completions: 189,
  },
  {
    name: 'Feb',
    enrollments: 312,
    completions: 267,
  },
  {
    name: 'Mar',
    enrollments: 378,
    completions: 298,
  },
  {
    name: 'Apr',
    enrollments: 456,
    completions: 345,
  },
  {
    name: 'May',
    enrollments: 523,
    completions: 412,
  },
  {
    name: 'Jun',
    enrollments: 634,
    completions: 498,
  },
  {
    name: 'Jul',
    enrollments: 712,
    completions: 578,
  },
  {
    name: 'Aug',
    enrollments: 789,
    completions: 634,
  },
  {
    name: 'Sep',
    enrollments: 856,
    completions: 712,
  },
  {
    name: 'Oct',
    enrollments: 923,
    completions: 789,
  },
  {
    name: 'Nov',
    enrollments: 1045,
    completions: 856,
  },
  {
    name: 'Dec',
    enrollments: 1156,
    completions: 923,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={enrollmentData}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className='bg-background rounded-lg border p-2 shadow-sm'>
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
        <Bar
          dataKey='enrollments'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
        <Bar
          dataKey='completions'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-green-500'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
