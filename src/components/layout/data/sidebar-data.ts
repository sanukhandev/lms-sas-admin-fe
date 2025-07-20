import {
  IconBrowserCheck,
  IconLayoutDashboard,
  IconMessages,
  IconSettings,
  IconUsers,
  IconBook,
  IconBookmark,
  IconSchool,
  IconCertificate,
  IconUserPlus,
  IconCreditCard,
  IconProgress,
  IconClipboardList,
  IconChartBar,
  IconReport,
  IconFileText,
  IconCalendar,
  IconMail,
  IconBell,
  IconShield,
  IconDatabase,
  IconWorld,
  IconPackages,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'

/**
 * LMS Tenant Admin Sidebar Configuration
 *
 * NOTE: URLs are currently set to placeholder values ('/home', '/users', '/settings')
 * Update these URLs when creating the actual routes:
 *
 * Dashboard: /dashboard
 * Analytics: /analytics
 * Reports: /reports
 * Courses: /courses, /courses/categories, /courses/builder, etc.
 * Users: /users, /users/students, /users/tutors, /users/administrators
 * Enrollments: /enrollments, /enrollments/onboarding, etc.
 * Progress: /progress/students, /progress/completion, etc.
 * Payments: /payments, /payments/subscriptions, etc.
 * And so on...
 */

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: '/home',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Analytics',
          url: '/analytics',
          icon: IconChartBar,
        },
        {
          title: 'Reports',
          url: '/home',
          icon: IconReport,
        },
      ],
    },
    {
      title: 'Course Management',
      items: [
        {
          title: 'Courses',
          icon: IconBook,
          items: [
            {
              title: 'Categories',
              url: '/categories',
            },
            {
              title: 'Curriculum',
              url: '/home',
            },
            {
              title: 'Assignments',
              url: '/home',
            },
            {
              title: 'Quizzes',
              url: '/home',
            },
          ],
        },
        {
          title: 'Content Library',
          url: '/home',
          icon: IconBookmark,
        },
        {
          title: 'Certificates',
          url: '/home',
          icon: IconCertificate,
        },
      ],
    },
    {
      title: 'User Management',
      items: [
        {
          title: 'Users',
          icon: IconUsers,
          items: [
            {
              title: 'All Users',
              url: '/users',
            },
            {
              title: 'Students',
              url: '/users',
            },
            {
              title: 'Tutors',
              url: '/users',
            },
            {
              title: 'Administrators',
              url: '/users',
            },
          ],
        },
        {
          title: 'Roles & Permissions',
          url: '/home',
          icon: IconShield,
        },
        {
          title: 'Bulk Operations',
          url: '/home',
          icon: IconUserPlus,
        },
      ],
    },
    {
      title: 'Enrollment & Progress',
      items: [
        {
          title: 'Enrollments',
          icon: IconSchool,
          items: [
            {
              title: 'All Enrollments',
              url: '/home',
            },
            {
              title: 'Onboarding',
              url: '/home',
            },
            {
              title: 'Bulk Enrollment',
              url: '/home',
            },
            {
              title: 'Enrollment Reports',
              url: '/home',
            },
          ],
        },
        {
          title: 'Progress Tracking',
          icon: IconProgress,
          items: [
            {
              title: 'Student Progress',
              url: '/home',
            },
            {
              title: 'Course Completion',
              url: '/home',
            },
            {
              title: 'Learning Paths',
              url: '/home',
            },
            {
              title: 'Grades & Scores',
              url: '/home',
            },
          ],
        },
        {
          title: 'Assessments',
          url: '/home',
          icon: IconClipboardList,
        },
      ],
    },
    {
      title: 'Financial Management',
      items: [
        {
          title: 'Payments',
          icon: IconCreditCard,
          items: [
            {
              title: 'All Payments',
              url: '/home',
            },
            {
              title: 'Subscriptions',
              url: '/home',
            },
            {
              title: 'Refunds',
              url: '/home',
            },
            {
              title: 'Payment Plans',
              url: '/home',
            },
          ],
        },
        {
          title: 'Billing',
          url: '/home',
          icon: IconFileText,
        },
        {
          title: 'Discounts & Coupons',
          url: '/home',
          icon: IconPackages,
        },
      ],
    },
    {
      title: 'Communication',
      items: [
        {
          title: 'Messages',
          url: '/home',
          icon: IconMessages,
          badge: '3',
        },
        {
          title: 'Notifications',
          url: '/home',
          icon: IconBell,
        },
        {
          title: 'Announcements',
          url: '/home',
          icon: IconMail,
        },
        {
          title: 'Discussion Forums',
          url: '/home',
          icon: IconUsers,
        },
      ],
    },
    {
      title: 'Tools & Resources',
      items: [
        {
          title: 'Calendar',
          url: '/home',
          icon: IconCalendar,
        },
        {
          title: 'File Manager',
          url: '/home',
          icon: IconDatabase,
        },
        {
          title: 'Integrations',
          url: '/home',
          icon: IconWorld,
        },
      ],
    },
    {
      title: 'Administration',
      items: [
        {
          title: 'Tenant Settings',
          icon: IconSettings,
          items: [
            {
              title: 'General',
              url: '/settings/general',
            },
            {
              title: 'Branding',
              url: '/settings/branding',
            },
            {
              title: 'Features',
              url: '/settings/features',
            },
            {
              title: 'Security',
              url: '/settings/security',
            },
            {
              title: 'Theme',
              url: '/settings/theme',
            },
          ],
        },
        {
          title: 'System Health',
          url: '/home',
          icon: IconBrowserCheck,
        },
        {
          title: 'Backup & Restore',
          url: '/home',
          icon: IconDatabase,
        },
      ],
    },
  ],
}
