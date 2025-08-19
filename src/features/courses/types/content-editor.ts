export type ContentEditorType =
  | 'module'
  | 'chapter'
  | 'lesson'
  | 'video'
  | 'document'
  | 'quiz'
  | 'assignment'
  | 'text'
  | 'live_session'

export type ContentStatus = 'draft' | 'published' | 'archived'

export interface ContentTypeDefinition {
  label: string
  description: string
  icon: string
  can_have_children: boolean
}

export interface CourseContent {
  id: number
  course_id: number
  parent_id?: number
  type: ContentEditorType
  title: string
  description?: string
  content?: string
  content_data?: Record<string, any>
  video_url?: string
  file_path?: string
  file_url?: string
  file_type?: string
  file_size?: number
  formatted_file_size?: string
  learning_objectives?: string[]
  status: ContentStatus
  is_required: boolean
  is_free: boolean
  position: number
  sort_order: number
  duration_mins?: number
  estimated_duration?: number
  formatted_duration?: string
  published_at?: string
  content_type_icon: string
  hierarchy_level: number
  created_at: string
  updated_at: string
  children?: CourseContent[]
  parent?: {
    id: number
    title: string
    type: ContentEditorType
  }
}

export interface ContentStatistics {
  total_content: number
  published_content: number
  draft_content: number
  total_duration: number
  content_by_type: Record<ContentEditorType, number>
  required_content: number
  free_content: number
}

export interface CreateContentRequest {
  title: string
  description?: string
  type: ContentEditorType
  parent_id?: number
  content?: string
  content_data?: Record<string, any>
  video_url?: string
  file?: File
  learning_objectives?: string[]
  estimated_duration?: number
  is_required?: boolean
  is_free?: boolean
  status?: ContentStatus
  auto_publish?: boolean
}

export interface UpdateContentRequest extends Partial<CreateContentRequest> {
  id: number
}

export interface ReorderContentItem {
  id: number
  sort_order: number
  position?: number
  parent_id?: number
}

export interface FileUploadResponse {
  file_path: string
  file_url: string
  file_name: string
  file_type: string
  file_size: number
  formatted_size: string
}

export interface ContentEditorFilters {
  type?: ContentEditorType
  status?: ContentStatus
  parent_id?: number
  search?: string
}

export interface ContentTreeNode extends CourseContent {
  level: number
  isExpanded?: boolean
  isSelected?: boolean
  isDragging?: boolean
  canDrop?: boolean
}

// Drag and drop types
export interface DragItem {
  id: number
  type: 'content'
  contentType: ContentEditorType
  title: string
  parentId?: number
}

export interface DropResult {
  dropEffect: string
  targetId?: number
  position?: 'before' | 'after' | 'inside'
}

// Content Editor State
export interface ContentEditorState {
  contents: CourseContent[]
  selectedContent?: CourseContent
  isLoading: boolean
  error?: string
  filters: ContentEditorFilters
  expandedNodes: Set<number>
  draggedItem?: DragItem
  statistics?: ContentStatistics
}

// API Response types
export interface ContentApiResponse {
  success: boolean
  data: CourseContent[]
  course?: any
  message?: string
}

export interface ContentStatsApiResponse {
  success: boolean
  data: ContentStatistics
  message?: string
}

export interface ContentTypesApiResponse {
  success: boolean
  data: Record<ContentEditorType, ContentTypeDefinition>
  message?: string
}

// Form types
export interface ContentFormData {
  title: string
  description: string
  type: ContentEditorType
  parent_id: number | null
  content: string
  video_url: string
  learning_objectives: string[]
  estimated_duration: number | null
  is_required: boolean
  is_free: boolean
  status: ContentStatus
}

export interface ContentFormErrors {
  title?: string
  description?: string
  type?: string
  content?: string
  video_url?: string
  learning_objectives?: string
  estimated_duration?: string
  file?: string
}

// Content Editor Context
export interface ContentEditorContextType {
  state: ContentEditorState
  actions: {
    loadContent: (
      courseId: number,
      filters?: ContentEditorFilters
    ) => Promise<void>
    createContent: (
      courseId: number,
      data: CreateContentRequest
    ) => Promise<CourseContent>
    updateContent: (
      courseId: number,
      contentId: number,
      data: UpdateContentRequest
    ) => Promise<CourseContent>
    deleteContent: (courseId: number, contentId: number) => Promise<void>
    duplicateContent: (
      courseId: number,
      contentId: number
    ) => Promise<CourseContent>
    reorderContent: (
      courseId: number,
      items: ReorderContentItem[]
    ) => Promise<void>
    publishContent: (
      courseId: number,
      contentId: number,
      status: ContentStatus
    ) => Promise<void>
    uploadFile: (courseId: number, file: File) => Promise<FileUploadResponse>
    loadStatistics: (courseId: number) => Promise<void>
    selectContent: (content?: CourseContent) => void
    setFilters: (filters: ContentEditorFilters) => void
    toggleExpanded: (nodeId: number) => void
    setDraggedItem: (item?: DragItem) => void
  }
}
