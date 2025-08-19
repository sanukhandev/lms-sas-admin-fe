import React, { createContext, useReducer, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { contentEditorService } from '../../services/content-editor'
import type {
  ContentEditorState,
  ContentEditorContextType,
  CourseContent,
  CreateContentRequest,
  UpdateContentRequest,
  ReorderContentItem,
  ContentEditorFilters,
  ContentStatus,
  ContentStatistics,
  DragItem,
  FileUploadResponse,
} from '../../types/content-editor'

// Action types
type ContentEditorAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_CONTENTS'; payload: CourseContent[] }
  | { type: 'ADD_CONTENT'; payload: CourseContent }
  | { type: 'UPDATE_CONTENT'; payload: CourseContent }
  | { type: 'REMOVE_CONTENT'; payload: number }
  | { type: 'SELECT_CONTENT'; payload: CourseContent | undefined }
  | { type: 'SET_FILTERS'; payload: ContentEditorFilters }
  | { type: 'TOGGLE_EXPANDED'; payload: number }
  | { type: 'SET_DRAGGED_ITEM'; payload: DragItem | undefined }
  | { type: 'SET_STATISTICS'; payload: ContentStatistics }

// Initial state
const initialState: ContentEditorState = {
  contents: [],
  selectedContent: undefined,
  isLoading: false,
  error: undefined,
  filters: {},
  expandedNodes: new Set(),
  draggedItem: undefined,
  statistics: undefined,
}

// Reducer
function contentEditorReducer(
  state: ContentEditorState,
  action: ContentEditorAction
): ContentEditorState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }

    case 'SET_CONTENTS':
      return {
        ...state,
        contents: action.payload,
        isLoading: false,
        error: undefined,
      }

    case 'ADD_CONTENT':
      return { ...state, contents: [...state.contents, action.payload] }

    case 'UPDATE_CONTENT': {
      const updatedContents = state.contents.map((content) =>
        content.id === action.payload.id ? action.payload : content
      )
      return {
        ...state,
        contents: updatedContents,
        selectedContent:
          state.selectedContent?.id === action.payload.id
            ? action.payload
            : state.selectedContent,
      }
    }

    case 'REMOVE_CONTENT': {
      const filteredContents = state.contents.filter(
        (content) => content.id !== action.payload
      )
      return {
        ...state,
        contents: filteredContents,
        selectedContent:
          state.selectedContent?.id === action.payload
            ? undefined
            : state.selectedContent,
      }
    }

    case 'SELECT_CONTENT':
      return { ...state, selectedContent: action.payload }

    case 'SET_FILTERS':
      return { ...state, filters: action.payload }

    case 'TOGGLE_EXPANDED': {
      const newExpanded = new Set(state.expandedNodes)
      if (newExpanded.has(action.payload)) {
        newExpanded.delete(action.payload)
      } else {
        newExpanded.add(action.payload)
      }
      return { ...state, expandedNodes: newExpanded }
    }

    case 'SET_DRAGGED_ITEM':
      return { ...state, draggedItem: action.payload }

    case 'SET_STATISTICS':
      return { ...state, statistics: action.payload }

    default:
      return state
  }
}

// Context
const ContentEditorContext = createContext<
  ContentEditorContextType | undefined
>(undefined)

// Provider component
interface ContentEditorProviderProps {
  children: React.ReactNode
}

export function ContentEditorProvider({
  children,
}: ContentEditorProviderProps) {
  const [state, dispatch] = useReducer(contentEditorReducer, initialState)

  // Load content
  const loadContent = useCallback(
    async (courseId: number, filters?: ContentEditorFilters) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'SET_FILTERS', payload: filters || {} })

        const contents = await contentEditorService.getContent(
          courseId,
          filters
        )
        dispatch({ type: 'SET_CONTENTS', payload: contents })
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load content'
        dispatch({ type: 'SET_ERROR', payload: message })
        toast.error('Failed to load course content')
      }
    },
    []
  )

  // Create content
  const createContent = useCallback(
    async (
      courseId: number,
      data: CreateContentRequest
    ): Promise<CourseContent> => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })

        const newContent = await contentEditorService.createContent(
          courseId,
          data
        )
        dispatch({ type: 'ADD_CONTENT', payload: newContent })
        dispatch({ type: 'SET_LOADING', payload: false })

        toast.success('Content created successfully')
        return newContent
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to create content'
        dispatch({ type: 'SET_ERROR', payload: message })
        toast.error('Failed to create content')
        throw error
      }
    },
    []
  )

  // Update content
  const updateContent = useCallback(
    async (
      courseId: number,
      contentId: number,
      data: UpdateContentRequest
    ): Promise<CourseContent> => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })

        const updatedContent = await contentEditorService.updateContent(
          courseId,
          contentId,
          data
        )
        dispatch({ type: 'UPDATE_CONTENT', payload: updatedContent })
        dispatch({ type: 'SET_LOADING', payload: false })

        toast.success('Content updated successfully')
        return updatedContent
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to update content'
        dispatch({ type: 'SET_ERROR', payload: message })
        toast.error('Failed to update content')
        throw error
      }
    },
    []
  )

  // Delete content
  const deleteContent = useCallback(
    async (courseId: number, contentId: number) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })

        await contentEditorService.deleteContent(courseId, contentId)
        dispatch({ type: 'REMOVE_CONTENT', payload: contentId })
        dispatch({ type: 'SET_LOADING', payload: false })

        toast.success('Content deleted successfully')
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to delete content'
        dispatch({ type: 'SET_ERROR', payload: message })
        toast.error('Failed to delete content')
      }
    },
    []
  )

  // Duplicate content
  const duplicateContent = useCallback(
    async (courseId: number, contentId: number): Promise<CourseContent> => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })

        const duplicatedContent = await contentEditorService.duplicateContent(
          courseId,
          contentId
        )
        dispatch({ type: 'ADD_CONTENT', payload: duplicatedContent })
        dispatch({ type: 'SET_LOADING', payload: false })

        toast.success('Content duplicated successfully')
        return duplicatedContent
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to duplicate content'
        dispatch({ type: 'SET_ERROR', payload: message })
        toast.error('Failed to duplicate content')
        throw error
      }
    },
    []
  )

  // Reorder content
  const reorderContent = useCallback(
    async (courseId: number, items: ReorderContentItem[]) => {
      try {
        await contentEditorService.reorderContent(courseId, items)

        // Reload content to get updated order - simple reload without filters to avoid dependencies
        const contents = await contentEditorService.getContent(courseId)
        dispatch({ type: 'SET_CONTENTS', payload: contents })

        toast.success('Content reordered successfully')
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to reorder content'
        dispatch({ type: 'SET_ERROR', payload: message })
        toast.error('Failed to reorder content')
      }
    },
    []
  )

  // Publish content
  const publishContent = useCallback(
    async (courseId: number, contentId: number, status: ContentStatus) => {
      try {
        await contentEditorService.publishContent(courseId, contentId, status)

        // Create the updated content object and dispatch it
        const updatedContent: Partial<CourseContent> = {
          id: contentId,
          status,
          published_at:
            status === 'published' ? new Date().toISOString() : undefined,
        }
        dispatch({
          type: 'UPDATE_CONTENT',
          payload: updatedContent as CourseContent,
        })

        toast.success(
          `Content ${status === 'published' ? 'published' : 'unpublished'} successfully`
        )
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to publish content'
        dispatch({ type: 'SET_ERROR', payload: message })
        toast.error('Failed to publish content')
      }
    },
    []
  )

  // Upload file
  const uploadFile = useCallback(
    async (courseId: number, file: File): Promise<FileUploadResponse> => {
      try {
        const response = await contentEditorService.uploadFile(courseId, file)
        toast.success('File uploaded successfully')
        return response
      } catch (error) {
        toast.error('Failed to upload file')
        throw error
      }
    },
    []
  )

  // Load statistics
  const loadStatistics = useCallback(async (courseId: number) => {
    try {
      const statistics = await contentEditorService.getStatistics(courseId)
      dispatch({ type: 'SET_STATISTICS', payload: statistics })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load statistics'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error('Failed to load statistics')
    }
  }, [])

  // Select content
  const selectContent = useCallback((content?: CourseContent) => {
    dispatch({ type: 'SELECT_CONTENT', payload: content })
  }, [])

  // Set filters
  const setFilters = useCallback((filters: ContentEditorFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }, [])

  // Toggle expanded
  const toggleExpanded = useCallback((nodeId: number) => {
    dispatch({ type: 'TOGGLE_EXPANDED', payload: nodeId })
  }, [])

  // Set dragged item
  const setDraggedItem = useCallback((item?: DragItem) => {
    dispatch({ type: 'SET_DRAGGED_ITEM', payload: item })
  }, [])

  // Memoize actions to prevent infinite re-renders
  const actions = useMemo(
    () => ({
      loadContent,
      createContent,
      updateContent,
      deleteContent,
      duplicateContent,
      reorderContent,
      publishContent,
      uploadFile,
      loadStatistics,
      selectContent,
      setFilters,
      toggleExpanded,
      setDraggedItem,
    }),
    [
      loadContent,
      createContent,
      updateContent,
      deleteContent,
      duplicateContent,
      reorderContent,
      publishContent,
      uploadFile,
      loadStatistics,
      selectContent,
      setFilters,
      toggleExpanded,
      setDraggedItem,
    ]
  )

  const contextValue: ContentEditorContextType = useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions]
  )

  return (
    <ContentEditorContext.Provider value={contextValue}>
      {children}
    </ContentEditorContext.Provider>
  )
}

export { ContentEditorContext }
