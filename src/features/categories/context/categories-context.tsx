import { useState, type ReactNode } from 'react'
import { type Category } from '@/services/categories'
import { toast } from 'sonner'
import { useCategories } from '../hooks/use-categories'
import {
  CategoriesContext,
  type CategoriesContextType,
} from './categories-context-types'

interface CategoriesProviderProps {
  children: ReactNode
}

export default function CategoriesProvider({
  children,
}: CategoriesProviderProps) {
  // Data fetching
  const [page] = useState(1)
  const [perPage] = useState(15)
  const [search] = useState<string>()
  const [parentFilter, setParentFilter] = useState<number | null>(null)
  const [rootOnlyFilter, setRootOnlyFilter] = useState(false)

  const {
    data: categoriesData,
    isLoading,
    error,
  } = useCategories(page, perPage, search, parentFilter, rootOnlyFilter)

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)

  // Selected category for operations
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )

  // Bulk selection
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  // View mode
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table')

  // Actions
  const handleCreateCategory = () => {
    setSelectedCategory(null)
    setIsCreateDialogOpen(true)
  }

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category)
    // TODO: Implement view category functionality
    // For now, let's just show the category details in a toast
    toast.info(`Viewing category: ${category.name}`)
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsEditDialogOpen(true)
  }

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleBulkDelete = () => {
    if (selectedCategories.length === 0) return
    setIsBulkDeleteDialogOpen(true)
  }

  const clearSelection = () => {
    setSelectedCategories([])
  }

  const value: CategoriesContextType = {
    // Data
    categories: categoriesData?.data || [],
    isLoading,
    error,

    // Dialog states
    isCreateDialogOpen,
    setIsCreateDialogOpen,

    isEditDialogOpen,
    setIsEditDialogOpen,

    isDeleteDialogOpen,
    setIsDeleteDialogOpen,

    isBulkDeleteDialogOpen,
    setIsBulkDeleteDialogOpen,

    // Selected category
    selectedCategory,
    setSelectedCategory,

    // Bulk selection
    selectedCategories,
    setSelectedCategories,

    // View mode
    viewMode,
    setViewMode,

    // Filters
    parentFilter,
    setParentFilter,

    rootOnlyFilter,
    setRootOnlyFilter,

    // Actions
    handleCreateCategory,
    handleViewCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleBulkDelete,
    clearSelection,
  }

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  )
}
