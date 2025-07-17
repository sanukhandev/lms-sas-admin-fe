import { api } from '@/lib/api'

export interface Course {
  id: number
  title: string
  enrollments: number
  completions: number
  completionRate: number
  averageProgress: number
  instructor: string
  status: 'active' | 'inactive'
}

export interface CoursesResponse {
  data: Course[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export const coursesService = {
  async getCourses(
    page: number = 1,
    perPage: number = 15
  ): Promise<CoursesResponse> {
    const response = await api.get<CoursesResponse>(
      `/v1/dashboard/courses?page=${page}&per_page=${perPage}`
    )
    return response.data
  },
}
