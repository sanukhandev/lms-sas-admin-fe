// Re-export course hooks from centralized location
export {
  useCourses,
  useCourse,
  useCourseStats,
  useCourseStructure,
  useCoursePricing,
  useSupportedAccessModels,
  useCreateModule,
  useUpdateModule,
  useDeleteModule,
  useCreateChapter,
  useUpdateChapter,
  useDeleteChapter,
  useUpdateCoursePricing,
  usePublishCourse,
} from '../../../hooks/use-courses'

// Course Builder specific types
export interface CourseFilters {
  page?: number
  perPage?: number
  search?: string
  status?: string
  category?: string
  instructor?: string
}
