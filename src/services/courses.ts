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
    perPage: number = 15,
    search?: string,
    status?: string,
    instructor?: string
  ): Promise<CoursesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...(search && { search }),
      ...(status && { status }),
      ...(instructor && { instructor }),
    })
    
    const response = await api.get<CoursesResponse>(
      `/v1/dashboard/courses?${params.toString()}`
    )
    return response.data
  },

  async getCourse(id: number): Promise<Course> {
    const response = await api.get<Course>(`/v1/dashboard/courses/${id}`)
    return response.data
  },

  async createCourse(course: Partial<Course>): Promise<Course> {
    const response = await api.post<Course>('/v1/dashboard/courses', course)
    return response.data
  },

  async updateCourse(id: number, course: Partial<Course>): Promise<Course> {
    const response = await api.put<Course>(`/v1/dashboard/courses/${id}`, course)
    return response.data
  },

  async deleteCourse(id: number): Promise<void> {
    await api.delete(`/v1/dashboard/courses/${id}`)
  },
}
