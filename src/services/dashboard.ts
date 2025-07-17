import { api } from '@/lib/api'

export interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  totalRevenue: number
  userGrowthRate: number
  courseCompletionRate: number
  activeUsers: number
  pendingEnrollments: number
}

export interface RecentActivity {
  id: number
  type: 'enrollment' | 'completion' | 'payment' | 'user_registration'
  message: string
  timestamp: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  metadata?: Record<string, unknown>
}

export interface CourseProgress {
  id: number
  title: string
  enrollments: number
  completions: number
  completionRate: number
  averageProgress: number
  instructor: string
  status: 'active' | 'inactive' | 'draft'
}

export interface UserProgress {
  id: number
  name: string
  email: string
  avatar?: string
  enrolledCourses: number
  completedCourses: number
  totalProgress: number
  lastActivity: string
  role: 'student' | 'tutor' | 'admin'
}

export interface PaymentStats {
  totalRevenue: number
  monthlyRevenue: number
  pendingPayments: number
  successfulPayments: number
  failedPayments: number
  averageOrderValue: number
  revenueGrowth: number
}

export interface ChartData {
  enrollment_trends: Array<{
    period: string
    enrollments: number
    completions: number
  }>
  completion_trends: Array<{
    period: string
    completions: number
    rate: number
  }>
  revenue_trends: Array<{
    period: string
    revenue: number
    growth: number
  }>
  category_distribution: Array<{
    category: string
    count: number
    percentage: number
  }>
  user_activity_trends: Array<{
    period: string
    logins: number
    registrations: number
    active_users: number
  }>
  monthly_stats: Array<{
    month: string
    total_enrollments: number
    total_completions: number
    total_revenue: number
    active_users: number
  }>
}

export interface DashboardOverview {
  cards: {
    main_stats: Array<{
      title: string
      value: string | number
      description: string
      icon: string
      trend?: {
        value: number
        isPositive: boolean
      }
    }>
    quick_stats: {
      completion_rate: number
      active_users: number
      pending_enrollments: number
      revenue_growth: number
    }
  }
  charts: ChartData
  recent_activities: RecentActivity[]
  layout: {
    grid: {
      main_stats: { span: string; cols: number }
      charts: { span: number; priority: number }
      recent_activities: { span: number; priority: number }
      quick_stats: { span: number; priority: number }
    }
  }
}

export interface TenantSettings {
  id: number
  name: string
  domain: string
  status: 'active' | 'inactive' | 'suspended'
  features: {
    courses: boolean
    certificates: boolean
    payments: boolean
    notifications: boolean
    analytics: boolean
  }
  branding: {
    logo?: string
    primaryColor: string
    secondaryColor: string
    companyName: string
  }
  subscription: {
    plan: 'free' | 'basic' | 'pro' | 'enterprise'
    status: 'active' | 'cancelled' | 'expired'
    expiresAt?: string
  }
}

export class DashboardService {
  /**
   * Get dashboard overview with optimized structure
   */
  static async getDashboardOverview(): Promise<DashboardOverview> {
    try {
      const response = await api.get('/v1/dashboard/overview')
      return response.data.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching dashboard overview:', error)
      throw error
    }
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/v1/dashboard/stats')
      return response.data.data
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching dashboard stats:', error)
      // Return mock data for now
      return {
        totalUsers: 1247,
        totalCourses: 86,
        totalEnrollments: 3492,
        totalRevenue: 45780,
        userGrowthRate: 12.5,
        courseCompletionRate: 78.3,
        activeUsers: 324,
        pendingEnrollments: 45,
      }
    }
  }

  /**
   * Get recent activity
   */
  static async getRecentActivity(): Promise<RecentActivity[]> {
    try {
      const response = await api.get('/v1/dashboard/activity')
      return response.data.data
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      // Return mock data for now
      return [
        {
          id: 1,
          type: 'enrollment',
          message: 'Sarah Johnson enrolled in Advanced React Development',
          timestamp: '2 hours ago',
          user: {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            avatar: '/avatars/01.png',
          },
        },
        {
          id: 2,
          type: 'completion',
          message: 'Michael Chen completed Python for Data Science',
          timestamp: '4 hours ago',
          user: {
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            avatar: '/avatars/02.png',
          },
        },
        {
          id: 3,
          type: 'payment',
          message: 'Emma Rodriguez made a payment of $299',
          timestamp: '6 hours ago',
          user: {
            name: 'Emma Rodriguez',
            email: 'emma.rodriguez@email.com',
            avatar: '/avatars/03.png',
          },
        },
        {
          id: 4,
          type: 'enrollment',
          message: 'John Smith enrolled in UI/UX Design Fundamentals',
          timestamp: '8 hours ago',
          user: {
            name: 'John Smith',
            email: 'john.smith@email.com',
            avatar: '/avatars/04.png',
          },
        },
        {
          id: 5,
          type: 'completion',
          message: 'Lisa Brown completed JavaScript Fundamentals',
          timestamp: '12 hours ago',
          user: {
            name: 'Lisa Brown',
            email: 'lisa.brown@email.com',
            avatar: '/avatars/05.png',
          },
        },
      ]
    }
  }

  /**
   * Get course progress data
   */
  static async getCourseProgress(): Promise<CourseProgress[]> {
    try {
      const response = await api.get('/v1/dashboard/courses')
      return response.data.data
    } catch (error) {
      console.error('Error fetching course progress:', error)
      // Return mock data for now
      return [
        {
          id: 1,
          title: 'Advanced React Development',
          enrollments: 156,
          completions: 89,
          completionRate: 57,
          averageProgress: 73,
          instructor: 'Dr. Sarah Wilson',
          status: 'active',
        },
        {
          id: 2,
          title: 'Python for Data Science',
          enrollments: 203,
          completions: 167,
          completionRate: 82,
          averageProgress: 85,
          instructor: 'Prof. Michael Chen',
          status: 'active',
        },
        {
          id: 3,
          title: 'UI/UX Design Fundamentals',
          enrollments: 134,
          completions: 98,
          completionRate: 73,
          averageProgress: 68,
          instructor: 'Emma Rodriguez',
          status: 'active',
        },
      ]
    }
  }

  /**
   * Get user progress data
   */
  static async getUserProgress(): Promise<UserProgress[]> {
    try {
      const response = await api.get('/v1/dashboard/users')
      return response.data.data
    } catch (error) {
      console.error('Error fetching user progress:', error)
      // Return mock data for now
      return [
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          avatar: '/avatars/01.png',
          enrolledCourses: 3,
          completedCourses: 1,
          totalProgress: 65,
          lastActivity: '2 hours ago',
          role: 'student',
        },
        {
          id: 2,
          name: 'Michael Chen',
          email: 'michael.chen@email.com',
          avatar: '/avatars/02.png',
          enrolledCourses: 2,
          completedCourses: 2,
          totalProgress: 100,
          lastActivity: '4 hours ago',
          role: 'student',
        },
        {
          id: 3,
          name: 'Emma Rodriguez',
          email: 'emma.rodriguez@email.com',
          avatar: '/avatars/03.png',
          enrolledCourses: 4,
          completedCourses: 3,
          totalProgress: 85,
          lastActivity: '1 day ago',
          role: 'tutor',
        },
      ]
    }
  }

  /**
   * Get payment statistics
   */
  static async getPaymentStats(): Promise<PaymentStats> {
    try {
      const response = await api.get('/v1/dashboard/payments')
      return response.data.data
    } catch (error) {
      console.error('Error fetching payment stats:', error)
      // Return mock data for now
      return {
        totalRevenue: 45780,
        monthlyRevenue: 12456,
        pendingPayments: 8,
        successfulPayments: 1247,
        failedPayments: 23,
        averageOrderValue: 189.5,
        revenueGrowth: 15.3,
      }
    }
  }

  /**
   * Get tenant settings
   */
  static async getTenantSettings(): Promise<TenantSettings> {
    try {
      const response = await api.get('/v1/tenant/settings')
      return response.data.data
    } catch (error) {
      console.error('Error fetching tenant settings:', error)
      // Return mock data for now
      return {
        id: 1,
        name: 'Acme University',
        domain: 'acme-university',
        status: 'active',
        features: {
          courses: true,
          certificates: true,
          payments: true,
          notifications: true,
          analytics: true,
        },
        branding: {
          logo: '/logos/acme-logo.png',
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b',
          companyName: 'Acme University',
        },
        subscription: {
          plan: 'pro',
          status: 'active',
          expiresAt: '2025-12-31',
        },
      }
    }
  }
}

export default DashboardService
