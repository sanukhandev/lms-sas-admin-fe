import { api } from '@/lib/api'

export interface Category {
  id: number
  name: string
  slug: string
  tenant_id: number
  parent_id: number | null
  created_at: string
  updated_at: string
  parent?: Category | null
  children?: Category[]
  courses_count?: number
  active_courses_count?: number
  total_students?: number
  subcategories_count?: number
}

export interface CategoryStats {
  data: {
    totalCategories: number
    rootCategories: number
    subcategories: number
    totalCourses: number
    activeCourses: number
    totalStudents: number
    averageCoursesPerCategory: number
    mostPopularCategories: Array<{
      id: number
      name: string
      courses_count: number
      students_count: number
    }>
  }
}

export interface CategoriesResponse {
  data: Category[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export interface CategoryTreeResponse {
  data: Category[]
}

export interface CategoryDropdownResponse {
  data: Array<{
    id: number
    name: string
    slug: string
    level: number
    parent_id: number | null
    full_path: string
  }>
}

export interface CreateCategoryRequest {
  name: string
  parent_id?: number | null
  slug?: string
}

export interface UpdateCategoryRequest {
  name?: string
  parent_id?: number | null
  slug?: string
}

export const categoriesService = {
  /**
   * Get categories with pagination and filtering
   */
  async getCategories(
    page: number = 1,
    perPage: number = 15,
    search?: string,
    parentId?: number | null,
    rootOnly: boolean = false
  ): Promise<CategoriesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })

    if (search) params.append('search', search)
    if (parentId !== undefined)
      params.append('parent_id', parentId?.toString() || '')
    if (rootOnly) params.append('root_only', 'true')

    const response = await api.get<CategoriesResponse>(
      `/v1/categories?${params.toString()}`
    )
    return response.data
  },

  /**
   * Get category statistics
   */
  async getCategoryStats(): Promise<CategoryStats> {
    const response = await api.get<CategoryStats>('/v1/categories/statistics')
    return response.data
  },

  /**
   * Get category tree structure
   */
  async getCategoryTree(): Promise<CategoryTreeResponse> {
    const response = await api.get<CategoryTreeResponse>('/v1/categories/tree')
    return response.data
  },

  /**
   * Get categories for dropdown (flat structure with full paths)
   */
  async getCategoryDropdown(): Promise<CategoryDropdownResponse> {
    const response = await api.get<CategoryDropdownResponse>(
      '/v1/categories/dropdown'
    )
    return response.data
  },

  /**
   * Get a single category
   */
  async getCategory(id: number): Promise<Category> {
    const response = await api.get<Category>(`/v1/categories/${id}`)
    return response.data
  },

  /**
   * Create a new category
   */
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await api.post<Category>('/v1/categories', data)
    return response.data
  },

  /**
   * Update a category
   */
  async updateCategory(
    id: number,
    data: UpdateCategoryRequest
  ): Promise<Category> {
    const response = await api.put<Category>(`/v1/categories/${id}`, data)
    return response.data
  },

  /**
   * Delete a category
   */
  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/v1/categories/${id}`)
  },
}
