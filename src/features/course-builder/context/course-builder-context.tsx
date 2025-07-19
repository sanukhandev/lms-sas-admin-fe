import { createContext, useContext, useState, type ReactNode } from 'react'

// CourseBuilder type definition for context
interface CourseBuilder {
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
}

interface CourseBuilderContextType {
  selectedCourse: CourseBuilder | null
  setSelectedCourse: (course: CourseBuilder | null) => void
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
  isViewDialogOpen: boolean
  setIsViewDialogOpen: (open: boolean) => void
  isStructureDialogOpen: boolean
  setIsStructureDialogOpen: (open: boolean) => void
  isPricingDialogOpen: boolean
  setIsPricingDialogOpen: (open: boolean) => void
}

const CourseBuilderContext = createContext<CourseBuilderContextType | undefined>(undefined)

export function useCourseBuilderContext() {
  const context = useContext(CourseBuilderContext)
  if (!context) {
    throw new Error('useCourseBuilderContext must be used within a CourseBuilderProvider')
  }
  return context
}

interface CourseBuilderProviderProps {
  children: ReactNode
}

export default function CourseBuilderProvider({ children }: CourseBuilderProviderProps) {
  const [selectedCourse, setSelectedCourse] = useState<CourseBuilder | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isStructureDialogOpen, setIsStructureDialogOpen] = useState(false)
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false)

  return (
    <CourseBuilderContext.Provider
      value={{
        selectedCourse,
        setSelectedCourse,
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        isViewDialogOpen,
        setIsViewDialogOpen,
        isStructureDialogOpen,
        setIsStructureDialogOpen,
        isPricingDialogOpen,
        setIsPricingDialogOpen,
      }}
    >
      {children}
    </CourseBuilderContext.Provider>
  )
}
