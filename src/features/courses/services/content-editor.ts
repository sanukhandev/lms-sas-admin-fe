import { api } from '@/lib/api'
import type {
  CourseContent,
  CreateContentRequest,
  UpdateContentRequest,
  ReorderContentItem,
  ContentEditorFilters,
  ContentStatistics,
  ContentTypeDefinition,
  FileUploadResponse,
  ContentApiResponse,
  ContentStatsApiResponse,
  ContentTypesApiResponse,
  ContentEditorType,
  ContentStatus,
} from '../types/content-editor'

class ContentEditorService {
  private basePath = (courseId: number) => `/v1/courses/${courseId}/editor`

  /**
   * Get all content for a course
   */
  async getContent(
    courseId: number,
    filters?: ContentEditorFilters
  ): Promise<CourseContent[]> {
    const params = new URLSearchParams()

    if (filters?.type) params.append('type', filters.type)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.parent_id !== undefined)
      params.append('parent_id', filters.parent_id.toString())
    if (filters?.search) params.append('search', filters.search)

    const queryString = params.toString()
    const url = `${this.basePath(courseId)}${queryString ? `?${queryString}` : ''}`

    const response = await api.get<ContentApiResponse>(url)
    return response.data.data
  }

  /**
   * Get specific content item
   */
  async getContentById(
    courseId: number,
    contentId: number
  ): Promise<CourseContent> {
    const response = await api.get<{ success: boolean; data: CourseContent }>(
      `${this.basePath(courseId)}/${contentId}`
    )
    return response.data.data
  }

  /**
   * Create new content
   */
  async createContent(
    courseId: number,
    data: CreateContentRequest
  ): Promise<CourseContent> {
    const formData = new FormData()

    // Add text fields
    formData.append('title', data.title)
    if (data.description) formData.append('description', data.description)
    formData.append('type', data.type)
    if (data.parent_id !== undefined)
      formData.append('parent_id', data.parent_id.toString())
    if (data.content) formData.append('content', data.content)
    if (data.content_data)
      formData.append('content_data', JSON.stringify(data.content_data))
    if (data.video_url) formData.append('video_url', data.video_url)
    if (data.learning_objectives) {
      data.learning_objectives.forEach((objective, index) => {
        formData.append(`learning_objectives[${index}]`, objective)
      })
    }
    if (data.estimated_duration !== undefined) {
      formData.append('estimated_duration', data.estimated_duration.toString())
    }
    if (data.is_required !== undefined) {
      formData.append('is_required', data.is_required.toString())
    }
    if (data.is_free !== undefined) {
      formData.append('is_free', data.is_free.toString())
    }
    if (data.status) formData.append('status', data.status)
    if (data.auto_publish !== undefined) {
      formData.append('auto_publish', data.auto_publish.toString())
    }

    // Add file if present
    if (data.file) {
      formData.append('file', data.file)
    }

    const response = await api.post<{
      success: boolean
      data: CourseContent
      message: string
    }>(this.basePath(courseId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  }

  /**
   * Update existing content
   */
  async updateContent(
    courseId: number,
    contentId: number,
    data: UpdateContentRequest
  ): Promise<CourseContent> {
    const formData = new FormData()

    // Add text fields
    if (data.title) formData.append('title', data.title)
    if (data.description !== undefined)
      formData.append('description', data.description)
    if (data.type) formData.append('type', data.type)
    if (data.parent_id !== undefined)
      formData.append('parent_id', data.parent_id.toString())
    if (data.content !== undefined) formData.append('content', data.content)
    if (data.content_data !== undefined)
      formData.append('content_data', JSON.stringify(data.content_data))
    if (data.video_url !== undefined)
      formData.append('video_url', data.video_url)
    if (data.learning_objectives !== undefined) {
      data.learning_objectives.forEach((objective, index) => {
        formData.append(`learning_objectives[${index}]`, objective)
      })
    }
    if (data.estimated_duration !== undefined) {
      formData.append('estimated_duration', data.estimated_duration.toString())
    }
    if (data.is_required !== undefined) {
      formData.append('is_required', data.is_required.toString())
    }
    if (data.is_free !== undefined) {
      formData.append('is_free', data.is_free.toString())
    }
    if (data.status) formData.append('status', data.status)

    // Add file if present
    if (data.file) {
      formData.append('file', data.file)
    }

    const response = await api.put<{
      success: boolean
      data: CourseContent
      message: string
    }>(`${this.basePath(courseId)}/${contentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  }

  /**
   * Delete content
   */
  async deleteContent(courseId: number, contentId: number): Promise<void> {
    await api.delete(`${this.basePath(courseId)}/${contentId}`)
  }

  /**
   * Duplicate content
   */
  async duplicateContent(
    courseId: number,
    contentId: number
  ): Promise<CourseContent> {
    const response = await api.post<{
      success: boolean
      data: CourseContent
      message: string
    }>(`${this.basePath(courseId)}/${contentId}/duplicate`)
    return response.data.data
  }

  /**
   * Reorder content items
   */
  async reorderContent(
    courseId: number,
    items: ReorderContentItem[]
  ): Promise<void> {
    await api.post(`${this.basePath(courseId)}/reorder`, { items })
  }

  /**
   * Publish or unpublish content
   */
  async publishContent(
    courseId: number,
    contentId: number,
    status: ContentStatus
  ): Promise<void> {
    await api.put(`${this.basePath(courseId)}/${contentId}/publish`, { status })
  }

  /**
   * Upload file
   */
  async uploadFile(courseId: number, file: File): Promise<FileUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<{
      success: boolean
      data: FileUploadResponse
    }>(`${this.basePath(courseId)}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  }

  /**
   * Get content statistics
   */
  async getStatistics(courseId: number): Promise<ContentStatistics> {
    const response = await api.get<ContentStatsApiResponse>(
      `${this.basePath(courseId)}/stats`
    )
    return response.data.data
  }

  /**
   * Get available content types
   */
  async getContentTypes(
    courseId: number
  ): Promise<Record<ContentEditorType, ContentTypeDefinition>> {
    const response = await api.get<ContentTypesApiResponse>(
      `${this.basePath(courseId)}/content-types`
    )
    return response.data.data
  }
}

export const contentEditorService = new ContentEditorService()
