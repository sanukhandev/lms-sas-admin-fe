import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics'

const ANALYTICS_QUERY_KEYS = {
  overview: (timeRange: string) => ['analytics', 'overview', timeRange] as const,
  engagement: (timeRange: string) => ['analytics', 'engagement', timeRange] as const,
  performance: (timeRange: string) => ['analytics', 'performance', timeRange] as const,
  trends: (timeRange: string, metric: string) => ['analytics', 'trends', timeRange, metric] as const,
  userBehavior: (timeRange: string) => ['analytics', 'user-behavior', timeRange] as const,
  courseAnalytics: (timeRange: string) => ['analytics', 'course-analytics', timeRange] as const,
  revenueAnalytics: (timeRange: string) => ['analytics', 'revenue-analytics', timeRange] as const,
  retention: (timeRange: string) => ['analytics', 'retention', timeRange] as const,
}

export const useAnalyticsOverview = (timeRange: string = '30d') => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.overview(timeRange),
    queryFn: () => analyticsService.getOverview(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

export const useEngagementMetrics = (timeRange: string = '30d') => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.engagement(timeRange),
    queryFn: () => analyticsService.getEngagementMetrics(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

export const usePerformanceMetrics = (timeRange: string = '30d') => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.performance(timeRange),
    queryFn: () => analyticsService.getPerformanceMetrics(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

export const useTrendAnalysis = (timeRange: string = '30d', metric: string = 'all') => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.trends(timeRange, metric),
    queryFn: () => analyticsService.getTrendAnalysis(timeRange, metric),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

export const useUserBehaviorAnalytics = (timeRange: string = '30d') => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.userBehavior(timeRange),
    queryFn: () => analyticsService.getUserBehaviorAnalytics(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

export const useCourseAnalytics = (timeRange: string = '30d') => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.courseAnalytics(timeRange),
    queryFn: () => analyticsService.getCourseAnalytics(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

export const useRevenueAnalytics = (timeRange: string = '30d') => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.revenueAnalytics(timeRange),
    queryFn: () => analyticsService.getRevenueAnalytics(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

export const useRetentionMetrics = (timeRange: string = '30d') => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.retention(timeRange),
    queryFn: () => analyticsService.getRetentionMetrics(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
