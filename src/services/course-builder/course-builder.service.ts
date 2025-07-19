import { api } from '@/lib/api'

export interface Module {
  id: string
  title: string
  description: string | null
  position: number
  duration_hours: number | null
  chapters_count: number
  chapters: Chapter[]
  created_at: string
  updated_at: string
}

export interface Chapter {
  id: string
  module_id: string
  title: string
  description: string | null
  position: number
  duration_minutes: number | null
  video_url: string | null
  content: string | null
  learning_objectives: string[]
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface CourseStructure {
  course_id: string
  title: string
  description: string | null
  status: 'draft' | 'published' | 'archived'
  is_active: boolean
  modules: Module[]
  total_duration: number
  total_chapters: number
  created_at: string
  updated_at: string
}

export interface CoursePricing {
  course_id: string
  access_model: 'one_time' | 'monthly_subscription' | 'full_curriculum'
  base_price: number
  base_currency: string
  discount_percentage: number
  discounted_price: number | null
  subscription_price: number | null
  trial_period_days: number | null
  is_active: boolean
  enabled_access_models: string[]
  created_at: string
  updated_at: string
}

export interface ReorderItem {
  id: string
  position: number
  parent_id: string | null
}

export interface CreateModuleRequest {
  title: string
  description?: string
  duration_hours?: number
  position?: number
}

export interface CreateChapterRequest {
  title: string
  description?: string
  duration_minutes?: number
  position?: number
}

export interface UpdatePricingRequest {
  access_model: 'one_time' | 'monthly_subscription' | 'full_curriculum'
  base_price?: number
  discount_percentage?: number
  subscription_price?: number
  trial_period_days?: number
  is_active: boolean
}

export class CourseBuilderService {
  /**
   * Get course structure
   */
  static async getCourseStructure(courseId: string): Promise<CourseStructure> {
    const response = await api.get(`/course-builder/${courseId}/structure`)
    return response.data.data
  }

  /**
   * Create module
   */
  static async createModule(courseId: string, data: CreateModuleRequest): Promise<Module> {
    const response = await api.post(`/course-builder/${courseId}/modules`, data)
    return response.data.data
  }

  /**
   * Update module
   */
  static async updateModule(
    courseId: string, 
    moduleId: string, 
    data: Partial<CreateModuleRequest>
  ): Promise<Module> {
    const response = await api.put(`/course-builder/${courseId}/modules/${moduleId}`, data)
    return response.data.data
  }

  /**
   * Delete module
   */
  static async deleteModule(courseId: string, moduleId: string): Promise<void> {
    await api.delete(`/course-builder/${courseId}/modules/${moduleId}`)
  }

  /**
   * Create chapter
   */
  static async createChapter(
    courseId: string, 
    moduleId: string, 
    data: CreateChapterRequest
  ): Promise<Chapter> {
    const response = await api.post(`/course-builder/${courseId}/modules/${moduleId}/chapters`, data)
    return response.data.data
  }

  /**
   * Update chapter
   */
  static async updateChapter(
    courseId: string, 
    moduleId: string, 
    chapterId: string, 
    data: Partial<CreateChapterRequest>
  ): Promise<Chapter> {
    const response = await api.put(`/course-builder/${courseId}/modules/${moduleId}/chapters/${chapterId}`, data)
    return response.data.data
  }

  /**
   * Delete chapter
   */
  static async deleteChapter(courseId: string, moduleId: string, chapterId: string): Promise<void> {
    await api.delete(`/course-builder/${courseId}/modules/${moduleId}/chapters/${chapterId}`)
  }

  /**
   * Reorder content
   */
  static async reorderContent(courseId: string, items: ReorderItem[]): Promise<void> {
    await api.post(`/course-builder/${courseId}/reorder`, { items })
  }

  /**
   * Get course pricing
   */
  static async getCoursePricing(courseId: string): Promise<CoursePricing> {
    const response = await api.get(`/course-builder/${courseId}/pricing`)
    return response.data.data
  }

  /**
   * Update course pricing
   */
  static async updateCoursePricing(courseId: string, data: UpdatePricingRequest): Promise<CoursePricing> {
    const response = await api.put(`/course-builder/${courseId}/pricing`, data)
    return response.data.data
  }

  /**
   * Get supported access models
   */
  static async getSupportedAccessModels(): Promise<string[]> {
    const response = await api.get('/course-builder/access-models')
    return response.data.data
  }

  /**
   * Publish course
   */
  static async publishCourse(courseId: string): Promise<void> {
    await api.post(`/course-builder/${courseId}/publish`)
  }

  /**
   * Unpublish course
   */
  static async unpublishCourse(courseId: string): Promise<void> {
    await api.post(`/course-builder/${courseId}/unpublish`)
  }
}
