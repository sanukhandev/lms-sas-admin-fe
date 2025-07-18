import { createContext } from 'react'
import { type Category } from '@/services/categories'

interface CategoriesContextType {
  // Data
  categories: Category[]
  isLoading: boolean
  error: Error | null

  // Dialog states
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void

  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void

  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void

  // Selected category for edit/delete operations
  selectedCategory: Category | null
  setSelectedCategory: (category: Category | null) => void

  // Bulk selection
  selectedCategories: number[]
  setSelectedCategories: (ids: number[]) => void

  // Bulk actions
  isBulkDeleteDialogOpen: boolean
  setIsBulkDeleteDialogOpen: (open: boolean) => void

  // View mode
  viewMode: 'table' | 'tree'
  setViewMode: (mode: 'table' | 'tree') => void

  // Filters
  parentFilter: number | null
  setParentFilter: (parentId: number | null) => void

  rootOnlyFilter: boolean
  setRootOnlyFilter: (rootOnly: boolean) => void

  // Actions
  handleCreateCategory: () => void
  handleViewCategory: (category: Category) => void
  handleEditCategory: (category: Category) => void
  handleDeleteCategory: (category: Category) => void
  handleBulkDelete: () => void
  clearSelection: () => void
}

export const CategoriesContext = createContext<
  CategoriesContextType | undefined
>(undefined)
export type { CategoriesContextType }
