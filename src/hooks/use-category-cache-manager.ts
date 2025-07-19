import { useQueryClient } from '@tanstack/react-query'

/**
 * Hook to manage category cache invalidation
 * Provides utilities to invalidate specific or all category-related queries
 */
export function useCategoryCacheManager() {
  const queryClient = useQueryClient()

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] })
  }

  const invalidateCategoryStats = () => {
    queryClient.invalidateQueries({ queryKey: ['categoryStats'] })
  }

  const invalidateCategoryTree = () => {
    queryClient.invalidateQueries({ queryKey: ['categoryTree'] })
  }

  const invalidateCategoryDropdown = () => {
    queryClient.invalidateQueries({ queryKey: ['categoryDropdown'] })
  }

  const invalidateCategory = (categoryId: number) => {
    queryClient.invalidateQueries({ queryKey: ['category', categoryId] })
  }

  const invalidateAllCategoryData = () => {
    invalidateCategories()
    invalidateCategoryStats()
    invalidateCategoryTree()
    invalidateCategoryDropdown()
  }

  const removeCategory = (categoryId: number) => {
    queryClient.removeQueries({ queryKey: ['category', categoryId] })
  }

  const setCategoryData = (categoryId: number, data: any) => {
    queryClient.setQueryData(['category', categoryId], data)
  }

  return {
    invalidateCategories,
    invalidateCategoryStats,
    invalidateCategoryTree,
    invalidateCategoryDropdown,
    invalidateCategory,
    invalidateAllCategoryData,
    removeCategory,
    setCategoryData,
  }
}
