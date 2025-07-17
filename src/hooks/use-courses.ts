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
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCourse(id: number) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesService.getCourse(id),
    enabled: !!id,
  })
}
