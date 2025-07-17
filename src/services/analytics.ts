import { api } from '@/lib/api'

export interface AnalyticsOverview {
  key_metrics: {
    total_users: number
    active_users: number
    total_courses: number
    total_enrollments: number
    completion_rate: number
    average_progress: number
    total_revenue: number
  }
  growth_metrics: {
    user_growth: {
      current_period: number
      previous_period: number
      growth_rate: number
    }
    enrollment_growth: {
      current_period: number
      previous_period: number
      growth_rate: number
    }
    completion_growth: {
      current_period: number
      previous_period: number
      growth_rate: number
    }
  }
  time_range: string
  last_updated: string
}

export interface EngagementMetrics {
  daily_active_users: any[]
  session_duration: number
  course_interaction_rate: number
  popular_courses: any[]
  engagement_trends: any[]
}

export interface PerformanceMetrics {
  completion_rates: any[]
  average_completion_time: number
  top_performing_courses: any[]
  struggling_students: any[]
  performance_distribution: any[]
}

export interface TrendAnalysis {
  user_trends?: any[]
  course_trends?: any[]
  engagement_trends?: any[]
  revenue_trends?: any[]
}

export interface UserBehaviorAnalytics {
  user_segments: any[]
  learning_patterns: any[]
  device_usage: any[]
  peak_learning_hours: any[]
  course_progression: any[]
}

export interface CourseAnalytics {
  course_performance: any[]
  enrollment_patterns: any[]
  completion_funnel: any[]
  content_effectiveness: any[]
  drop_off_points: any[]
}

export interface RevenueAnalytics {
  total_revenue: number
  revenue_trends: any[]
  revenue_by_course: any[]
  average_order_value: number
  conversion_rate: number
  refund_rate: number
}

export interface RetentionMetrics {
  user_retention: any[]
  course_retention: any[]
  churn_rate: number
  lifetime_value: number
}

export const analyticsService = {
  async getOverview(timeRange: string = '30d'): Promise<AnalyticsOverview> {
    const response = await api.get<{status: string, message: string, data: AnalyticsOverview}>(
      `/v1/analytics/overview?time_range=${timeRange}`
    )
    return response.data.data
  },

  async getEngagementMetrics(timeRange: string = '30d'): Promise<EngagementMetrics> {
    const response = await api.get<{status: string, message: string, data: EngagementMetrics}>(
      `/v1/analytics/engagement?time_range=${timeRange}`
    )
    return response.data.data
  },

  async getPerformanceMetrics(timeRange: string = '30d'): Promise<PerformanceMetrics> {
    const response = await api.get<{status: string, message: string, data: PerformanceMetrics}>(
      `/v1/analytics/performance?time_range=${timeRange}`
    )
    return response.data.data
  },

  async getTrendAnalysis(
    timeRange: string = '30d',
    metric: string = 'all'
  ): Promise<TrendAnalysis> {
    const response = await api.get<{status: string, message: string, data: TrendAnalysis}>(
      `/v1/analytics/trends?time_range=${timeRange}&metric=${metric}`
    )
    return response.data.data
  },

  async getUserBehaviorAnalytics(timeRange: string = '30d'): Promise<UserBehaviorAnalytics> {
    const response = await api.get<{status: string, message: string, data: UserBehaviorAnalytics}>(
      `/v1/analytics/user-behavior?time_range=${timeRange}`
    )
    return response.data.data
  },

  async getCourseAnalytics(timeRange: string = '30d'): Promise<CourseAnalytics> {
    const response = await api.get<{status: string, message: string, data: CourseAnalytics}>(
      `/v1/analytics/course-analytics?time_range=${timeRange}`
    )
    return response.data.data
  },

  async getRevenueAnalytics(timeRange: string = '30d'): Promise<RevenueAnalytics> {
    const response = await api.get<{status: string, message: string, data: RevenueAnalytics}>(
      `/v1/analytics/revenue-analytics?time_range=${timeRange}`
    )
    return response.data.data
  },

  async getRetentionMetrics(timeRange: string = '30d'): Promise<RetentionMetrics> {
    const response = await api.get<RetentionMetrics>(
      `/v1/analytics/retention?time_range=${timeRange}`
    )
    return response.data
  },
}
