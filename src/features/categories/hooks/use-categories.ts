import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesService } from '@/services/categories'
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/services/categories'
import { toast } from 'sonner'

export function useCategories(
  page: number = 1,
  perPage: number = 15,
  search?: string,
  parentId?: number | null,
  rootOnly: boolean = false
) {
  return useQuery({
    queryKey: ['categories', page, perPage, search, parentId, rootOnly],
    queryFn: () =>
      categoriesService.getCategories(
        page,
        perPage,
        search,
        parentId,
        rootOnly
      ),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCategoryStats() {
  return useQuery({
    queryKey: ['category-stats'],
    queryFn: () => categoriesService.getCategoryStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ['category-tree'],
    queryFn: () => categoriesService.getCategoryTree(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCategoryDropdown() {
  return useQuery({
    queryKey: ['category-dropdown'],
    queryFn: () => categoriesService.getCategoryDropdown(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCategory(id: number | null) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesService.getCategory(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      categoriesService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-stats'] })
      queryClient.invalidateQueries({ queryKey: ['category-tree'] })
      queryClient.invalidateQueries({ queryKey: ['category-dropdown'] })
      toast.success('Category created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create category')
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryRequest }) =>
      categoriesService.updateCategory(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-stats'] })
      queryClient.invalidateQueries({ queryKey: ['category-tree'] })
      queryClient.invalidateQueries({ queryKey: ['category-dropdown'] })
      queryClient.invalidateQueries({ queryKey: ['category', data.id] })
      toast.success('Category updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update category')
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-stats'] })
      queryClient.invalidateQueries({ queryKey: ['category-tree'] })
      queryClient.invalidateQueries({ queryKey: ['category-dropdown'] })
      toast.success('Category deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete category')
    },
  })
}

export function useBulkDeleteCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(ids.map((id) => categoriesService.deleteCategory(id)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-stats'] })
      queryClient.invalidateQueries({ queryKey: ['category-tree'] })
      queryClient.invalidateQueries({ queryKey: ['category-dropdown'] })
      toast.success('Categories deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete categories')
    },
  })
}
