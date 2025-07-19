import { useQuery } from '@tanstack/react-query'
import { categoriesService, type CategoriesResponse, type CategoryStats } from '@/services/categories'

interface UseCategoriesParams {
  page: number
  perPage: number
  search?: string
  parentId?: number | null
  rootOnly?: boolean
}

export function useCategories(params: UseCategoriesParams, options?: { enabled?: boolean; staleTime?: number }) {
  return useQuery<CategoriesResponse>({
    queryKey: ['categories', params],
    queryFn: () => categoriesService.getCategories(
      params.page,
      params.perPage,
      params.search,
      params.parentId,
      params.rootOnly
    ),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesService.getCategory(id),
    enabled: !!id,
  })
}

export function useCategoryStats() {
  return useQuery<CategoryStats>({
    queryKey: ['categoryStats'],
    queryFn: () => categoriesService.getCategoryStats(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
  })
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ['categoryTree'],
    queryFn: () => categoriesService.getCategoryTree(),
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: 1,
    retryDelay: 1000,
  })
}

export function useCategoryDropdown() {
  return useQuery({
    queryKey: ['categoryDropdown'],
    queryFn: () => categoriesService.getCategoryDropdown(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
    retryDelay: 1000,
  })
}
