import { createContext, useContext, useState, type ReactNode } from 'react'
import { type Category } from '@/services/categories'

interface CategoriesContextType {
  selectedCategory: Category | null
  setSelectedCategory: (category: Category | null) => void
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
  isViewDialogOpen: boolean
  setIsViewDialogOpen: (open: boolean) => void
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined)

export function useCategoriesContext() {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error('useCategoriesContext must be used within a CategoriesProvider')
  }
  return context
}

interface CategoriesProviderProps {
  children: ReactNode
}

export default function CategoriesProvider({ children }: CategoriesProviderProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  return (
    <CategoriesContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        isViewDialogOpen,
        setIsViewDialogOpen,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}
