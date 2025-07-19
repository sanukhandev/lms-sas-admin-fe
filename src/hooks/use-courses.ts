import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesService, type CoursesResponse, type CourseStats, type CourseStructure, type CoursePricing } from '@/services/courses'
import { toast } from 'sonner'

interface UseCoursesParams {
  page?: number
  perPage?: number
  search?: string
  status?: string
  category?: string
  instructor?: string
}

export function useCourses(params: UseCoursesParams = {}, options?: { enabled?: boolean; staleTime?: number }) {
  return useQuery<CoursesResponse>({
    queryKey: ['courses', params],
    queryFn: () => coursesService.getCourses(
      params.page || 1,
      params.perPage || 15,
      params.search,
      params.status,
      params.category,
      params.instructor
    ),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    ...options,
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
  return useQuery<{ data: CourseStats }>({
    queryKey: ['courseStats'],
    queryFn: () => coursesService.getCourseStats(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
    retryDelay: 1000,
  })
}

export function useCourseStructure(courseId: string, enabled = true) {
  return useQuery<{ data: CourseStructure }>({
    queryKey: ['courseStructure', courseId],
    queryFn: () => coursesService.getCourseStructure(courseId),
    enabled: enabled && !!courseId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}

export function useCoursePricing(courseId: string, enabled = true) {
  return useQuery<{ data: CoursePricing }>({
    queryKey: ['coursePricing', courseId],
    queryFn: () => coursesService.getCoursePricing(courseId),
    enabled: enabled && !!courseId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}

export function useSupportedAccessModels() {
  return useQuery<{ data: string[] }>({
    queryKey: ['supportedAccessModels'],
    queryFn: () => coursesService.getSupportedAccessModels(),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  })
}

// Mutations
export function useCreateModule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: any }) =>
      coursesService.createModule(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courseStructure', variables.courseId] })
      toast.success('Module created successfully')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create module')
    },
  })
}

export function useUpdateModule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, moduleId, data }: { courseId: string; moduleId: string; data: any }) =>
      coursesService.updateModule(courseId, moduleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courseStructure', variables.courseId] })
      toast.success('Module updated successfully')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update module')
    },
  })
}

export function useDeleteModule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, moduleId }: { courseId: string; moduleId: string }) =>
      coursesService.deleteModule(courseId, moduleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courseStructure', variables.courseId] })
      toast.success('Module deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete module')
    },
  })
}

export function useCreateChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, moduleId, data }: { courseId: string; moduleId: string; data: any }) =>
      coursesService.createChapter(courseId, moduleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courseStructure', variables.courseId] })
      toast.success('Chapter created successfully')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create chapter')
    },
  })
}

export function useUpdateChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, moduleId, chapterId, data }: { courseId: string; moduleId: string; chapterId: string; data: any }) =>
      coursesService.updateChapter(courseId, moduleId, chapterId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courseStructure', variables.courseId] })
      toast.success('Chapter updated successfully')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update chapter')
    },
  })
}

export function useDeleteChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, moduleId, chapterId }: { courseId: string; moduleId: string; chapterId: string }) =>
      coursesService.deleteChapter(courseId, moduleId, chapterId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courseStructure', variables.courseId] })
      toast.success('Chapter deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete chapter')
    },
  })
}

export function useUpdateCoursePricing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: any }) =>
      coursesService.updateCoursePricing(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coursePricing', variables.courseId] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Course pricing updated successfully')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update course pricing')
    },
  })
}

export function usePublishCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, action }: { courseId: string; action: 'publish' | 'unpublish' }) => {
      return action === 'publish' 
        ? coursesService.publishCourse(courseId)
        : coursesService.unpublishCourse(courseId)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['courseStats'] })
      queryClient.invalidateQueries({ queryKey: ['courseStructure', variables.courseId] })
      
      toast.success(
        variables.action === 'publish' 
          ? 'Course published successfully' 
          : 'Course unpublished successfully'
      )
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update course status')
    },
  })
}
