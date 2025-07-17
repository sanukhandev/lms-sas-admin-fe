import { createContext, useContext, useState, type ReactNode } from 'react'
import { type Course } from '@/services/courses'

interface CoursesContextType {
  selectedCourse: Course | null
  setSelectedCourse: (course: Course | null) => void
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
  isViewDialogOpen: boolean
  setIsViewDialogOpen: (open: boolean) => void
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined)

export function useCoursesContext() {
  const context = useContext(CoursesContext)
  if (!context) {
    throw new Error('useCoursesContext must be used within a CoursesProvider')
  }
  return context
}

interface CoursesProviderProps {
  children: ReactNode
}

export default function CoursesProvider({ children }: CoursesProviderProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  return (
    <CoursesContext.Provider
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
      }}
    >
      {children}
    </CoursesContext.Provider>
  )
}
