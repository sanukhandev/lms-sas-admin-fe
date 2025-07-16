import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

// Mock data for student activities
const studentActivities = [
  {
    id: 1,
    student: {
      name: 'Alex Thompson',
      avatar: '/avatars/01.png',
      initials: 'AT',
    },
    activity: 'Completed assignment',
    course: 'Advanced React Development',
    timestamp: '5 minutes ago',
    type: 'assignment',
  },
  {
    id: 2,
    student: {
      name: 'Maria Garcia',
      avatar: '/avatars/02.png',
      initials: 'MG',
    },
    activity: 'Started new course',
    course: 'Python for Data Science',
    timestamp: '15 minutes ago',
    type: 'enrollment',
  },
  {
    id: 3,
    student: {
      name: 'James Wilson',
      avatar: '/avatars/03.png',
      initials: 'JW',
    },
    activity: 'Submitted quiz',
    course: 'JavaScript Masterclass',
    timestamp: '32 minutes ago',
    type: 'quiz',
  },
  {
    id: 4,
    student: {
      name: 'Sophie Chen',
      avatar: '/avatars/04.png',
      initials: 'SC',
    },
    activity: 'Completed course',
    course: 'UI/UX Design Fundamentals',
    timestamp: '1 hour ago',
    type: 'completion',
  },
  {
    id: 5,
    student: {
      name: 'Robert Johnson',
      avatar: '/avatars/05.png',
      initials: 'RJ',
    },
    activity: 'Posted in discussion',
    course: 'Mobile App Development',
    timestamp: '2 hours ago',
    type: 'discussion',
  },
]

const getActivityColor = (type: string) => {
  switch (type) {
    case 'assignment':
      return 'bg-blue-100 text-blue-800'
    case 'enrollment':
      return 'bg-green-100 text-green-800'
    case 'quiz':
      return 'bg-yellow-100 text-yellow-800'
    case 'completion':
      return 'bg-purple-100 text-purple-800'
    case 'discussion':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function StudentActivityFeed() {
  return (
    <div className='space-y-4'>
      {studentActivities.map((activity) => (
        <div
          key={activity.id}
          className='flex items-start gap-3 rounded-lg border p-3'
        >
          <Avatar className='h-8 w-8'>
            <AvatarImage src={activity.student.avatar} alt='Avatar' />
            <AvatarFallback className='text-xs'>
              {activity.student.initials}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1 space-y-1'>
            <div className='flex items-center gap-2'>
              <p className='text-sm font-medium'>{activity.student.name}</p>
              <Badge
                className={`text-xs ${getActivityColor(activity.type)}`}
                variant='secondary'
              >
                {activity.type}
              </Badge>
            </div>
            <p className='text-muted-foreground text-sm'>
              {activity.activity} in{' '}
              <span className='font-medium'>{activity.course}</span>
            </p>
            <p className='text-muted-foreground text-xs'>
              {activity.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
