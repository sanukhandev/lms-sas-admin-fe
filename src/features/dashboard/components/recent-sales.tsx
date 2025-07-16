import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

// Mock data for recent course enrollments
const recentEnrollments = [
  {
    id: 1,
    student: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      avatar: '/avatars/01.png',
      initials: 'SJ',
    },
    course: 'Advanced React Development',
    enrolledAt: '2 hours ago',
    status: 'active',
    progress: 15,
  },
  {
    id: 2,
    student: {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      avatar: '/avatars/02.png',
      initials: 'MC',
    },
    course: 'Python for Data Science',
    enrolledAt: '4 hours ago',
    status: 'active',
    progress: 32,
  },
  {
    id: 3,
    student: {
      name: 'Emma Rodriguez',
      email: 'emma.rodriguez@email.com',
      avatar: '/avatars/03.png',
      initials: 'ER',
    },
    course: 'UI/UX Design Fundamentals',
    enrolledAt: '6 hours ago',
    status: 'completed',
    progress: 100,
  },
  {
    id: 4,
    student: {
      name: 'David Kim',
      email: 'david.kim@email.com',
      avatar: '/avatars/04.png',
      initials: 'DK',
    },
    course: 'JavaScript Masterclass',
    enrolledAt: '8 hours ago',
    status: 'active',
    progress: 67,
  },
  {
    id: 5,
    student: {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      avatar: '/avatars/05.png',
      initials: 'LA',
    },
    course: 'Mobile App Development',
    enrolledAt: '1 day ago',
    status: 'active',
    progress: 8,
  },
]

export function RecentSales() {
  return (
    <div className='space-y-8'>
      {recentEnrollments.map((enrollment) => (
        <div key={enrollment.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={enrollment.student.avatar} alt='Avatar' />
            <AvatarFallback>{enrollment.student.initials}</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-col space-y-1'>
            <div className='flex items-center justify-between'>
              <p className='text-sm leading-none font-medium'>
                {enrollment.student.name}
              </p>
              <Badge
                variant={
                  enrollment.status === 'completed' ? 'default' : 'secondary'
                }
                className='text-xs'
              >
                {enrollment.progress}% Complete
              </Badge>
            </div>
            <p className='text-muted-foreground text-xs'>{enrollment.course}</p>
            <p className='text-muted-foreground text-xs'>
              Enrolled {enrollment.enrolledAt}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
