import { api } from '@/lib/api'

export interface CourseModule {
  id: number
  title: string
  description: string
  order: number
  chapters: CourseChapter[]
}

export interface CourseChapter {
  id: number
  module_id: number
  title: string
  description: string
  content: string
  order: number
  duration_minutes: number
}

export interface CourseBuilder {
  id: number
  title: string
  description: string
  instructor: string
  status: 'draft' | 'published' | 'archived'
  modules_count: number
  chapters_count: number
  total_duration: number
  created_at: string
  updated_at: string
  pricing?: CoursePricing
}

export interface CoursePricing {
  id: number
  course_id: number
  price: number
  currency: string
  discount_percentage?: number
  discount_expiry?: string
}

export interface CourseBuilderResponse {
  data: CourseBuilder[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export interface CreateCourseRequest {
  title: string
  description: string
  instructor?: string
}

export interface CreateModuleRequest {
  course_id: number
  title: string
  description: string
  order: number
}

export interface CreateChapterRequest {
  module_id: number
  title: string
  description: string
  content: string
  order: number
  duration_minutes: number
}

export interface UpdatePricingRequest {
  course_id: number
  price: number
  currency: string
  discount_percentage?: number
  discount_expiry?: string
}

export const courseBuilderService = {
  // Course operations
  async getCourses(
    page: number = 1,
    perPage: number = 15,
    search?: string,
    status?: string,
    instructor?: string
  ): Promise<CourseBuilderResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...(search && { search }),
      ...(status && { status }),
      ...(instructor && { instructor }),
    })
    
    const response = await api.get<CourseBuilderResponse>(
      `/v1/courses?${params.toString()}`
    )
    return response.data
  },

  async getCourse(id: number): Promise<CourseBuilder> {
    const response = await api.get<CourseBuilder>(`/v1/course-builder/${id}`)
    return response.data
  },

  async createCourse(data: CreateCourseRequest): Promise<CourseBuilder> {
    const response = await api.post<CourseBuilder>('/v1/course-builder', data)
    return response.data
  },

  async updateCourse(id: number, data: Partial<CreateCourseRequest>): Promise<CourseBuilder> {
    const response = await api.put<CourseBuilder>(`/v1/course-builder/${id}`, data)
    return response.data
  },

  async deleteCourse(id: number): Promise<void> {
    await api.delete(`/v1/course-builder/${id}`)
  },

  async publishCourse(id: number): Promise<CourseBuilder> {
    const response = await api.post<CourseBuilder>(`/v1/course-builder/${id}/publish`)
    return response.data
  },

  async unpublishCourse(id: number): Promise<CourseBuilder> {
    const response = await api.post<CourseBuilder>(`/v1/course-builder/${id}/unpublish`)
    return response.data
  },

  // Module operations
  async getModules(courseId: number): Promise<CourseModule[]> {
    const response = await api.get<CourseModule[]>(`/v1/course-builder/${courseId}/modules`)
    return response.data
  },

  async createModule(data: CreateModuleRequest): Promise<CourseModule> {
    const response = await api.post<CourseModule>('/v1/course-builder/modules', data)
    return response.data
  },

  async updateModule(id: number, data: Partial<CreateModuleRequest>): Promise<CourseModule> {
    const response = await api.put<CourseModule>(`/v1/course-builder/modules/${id}`, data)
    return response.data
  },

  async deleteModule(id: number): Promise<void> {
    await api.delete(`/v1/course-builder/modules/${id}`)
  },

  async reorderModules(courseId: number, moduleIds: number[]): Promise<void> {
    await api.post(`/v1/course-builder/${courseId}/modules/reorder`, {
      module_ids: moduleIds
    })
  },

  // Chapter operations
  async getChapters(moduleId: number): Promise<CourseChapter[]> {
    const response = await api.get<CourseChapter[]>(`/v1/course-builder/modules/${moduleId}/chapters`)
    return response.data
  },

  async createChapter(data: CreateChapterRequest): Promise<CourseChapter> {
    const response = await api.post<CourseChapter>('/v1/course-builder/chapters', data)
    return response.data
  },

  async updateChapter(id: number, data: Partial<CreateChapterRequest>): Promise<CourseChapter> {
    const response = await api.put<CourseChapter>(`/v1/course-builder/chapters/${id}`, data)
    return response.data
  },

  async deleteChapter(id: number): Promise<void> {
    await api.delete(`/v1/course-builder/chapters/${id}`)
  },

  async reorderChapters(moduleId: number, chapterIds: number[]): Promise<void> {
    await api.post(`/v1/course-builder/modules/${moduleId}/chapters/reorder`, {
      chapter_ids: chapterIds
    })
  },

  // Pricing operations
  async getPricing(courseId: number): Promise<CoursePricing | null> {
    try {
      const response = await api.get<CoursePricing>(`/v1/course-builder/${courseId}/pricing`)
      return response.data
    } catch {
      return null
    }
  },

  async updatePricing(data: UpdatePricingRequest): Promise<CoursePricing> {
    const response = await api.post<CoursePricing>('/v1/course-builder/pricing', data)
    return response.data
  },

  async deletePricing(courseId: number): Promise<void> {
    await api.delete(`/v1/course-builder/${courseId}/pricing`)
  }
}
