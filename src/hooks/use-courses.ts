import { useQuery } from '@tanstack/react-query'
import { coursesService, type CoursesResponse } from '@/services/courses'

interface UseCoursesParams {
  page: number
  perPage: number
  search?: string
  status?: string
  instructor?: string
}

export function useCourses(params: UseCoursesParams) {
  return useQuery<CoursesResponse>({
    queryKey: ['courses', params],
    queryFn: () => coursesService.getCourses(
      params.page,
      params.perPage,
      params.search,
      params.status,
      params.instructor
    ),
    staleTime: 1000 * 60 * 2, // 2 minutes - shorter for more responsive updates
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  })
}

export function useCourse(id: number) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesService.getCourse(id),
    enabled: !!id,
  })
}

export function useCourseStats() {
  return useQuery<CoursesResponse>({
    queryKey: ['courseStats'],
    queryFn: () => coursesService.getCourses(1, 1000), // Get all courses for stats
    staleTime: 1000 * 60 * 10, // 10 minutes for stats
    gcTime: 1000 * 60 * 15, // 15 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  })
}
