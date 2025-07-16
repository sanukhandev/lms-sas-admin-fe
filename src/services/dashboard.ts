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
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/v1/dashboard/stats')
      return response.data.data
    } catch (error) {
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
        pendingEnrollments: 45
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
            avatar: '/avatars/01.png'
          }
        },
        {
          id: 2,
          type: 'completion',
          message: 'Michael Chen completed Python for Data Science',
          timestamp: '4 hours ago',
          user: {
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            avatar: '/avatars/02.png'
          }
        },
        {
          id: 3,
          type: 'payment',
          message: 'Emma Rodriguez made a payment of $299',
          timestamp: '6 hours ago',
          user: {
            name: 'Emma Rodriguez',
            email: 'emma.rodriguez@email.com',
            avatar: '/avatars/03.png'
          }
        }
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
          status: 'active'
        },
        {
          id: 2,
          title: 'Python for Data Science',
          enrollments: 203,
          completions: 167,
          completionRate: 82,
          averageProgress: 85,
          instructor: 'Prof. Michael Chen',
          status: 'active'
        },
        {
          id: 3,
          title: 'UI/UX Design Fundamentals',
          enrollments: 134,
          completions: 98,
          completionRate: 73,
          averageProgress: 68,
          instructor: 'Emma Rodriguez',
          status: 'active'
        }
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
          role: 'student'
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
          role: 'student'
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
          role: 'tutor'
        }
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
        averageOrderValue: 189.50,
        revenueGrowth: 15.3
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
          analytics: true
        },
        branding: {
          logo: '/logos/acme-logo.png',
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b',
          companyName: 'Acme University'
        },
        subscription: {
          plan: 'pro',
          status: 'active',
          expiresAt: '2025-12-31'
        }
      }
    }
  }
}

export default DashboardService
