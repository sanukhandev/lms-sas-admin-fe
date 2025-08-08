export type ContentType = 'course' | 'module' | 'chapter' | 'class'

export type HierarchyLevel = {
  level: number
  name: string
  description: string
}

export const HIERARCHY_LEVELS: Record<ContentType, HierarchyLevel> = {
  course: { level: 1, name: 'Course', description: 'Main course container' },
  module: { level: 2, name: 'Module', description: 'Course section or unit' },
  chapter: { level: 3, name: 'Chapter', description: 'Module subsection' },
  class: {
    level: 4,
    name: 'Class',
    description: 'Individual lesson or session',
  },
}

export interface HierarchyNode {
  id: string
  title: string
  description?: string
  content_type: ContentType
  parent_id?: string
  position: number
  duration_minutes?: number
  video_url?: string
  learning_objectives?: string[]
  content?: string
  children?: HierarchyNode[]

  // Course-specific fields (only for content_type = 'course')
  category_id?: string
  instructor_id?: string
  schedule_level?: 'course' | 'module' | 'chapter'
  status?: 'draft' | 'published' | 'archived'
  access_model?: 'free' | 'paid' | 'subscription'
  level?: 'beginner' | 'intermediate' | 'advanced'
  price?: number
  currency?: string
  thumbnail_url?: string
  preview_video_url?: string
  requirements?: string[]
  what_you_will_learn?: string[]
  tags?: string[]

  // Computed fields
  hierarchy_path?: HierarchyPathItem[]
  class_count?: number
  total_duration?: number
}

export interface HierarchyPathItem {
  id: string
  title: string
  content_type: ContentType
  position: number
}

export interface CreateHierarchyNodeRequest {
  title: string
  description?: string
  content_type: ContentType
  parent_id?: string
  position?: number
  content?: string
  learning_objectives?: string[]
  video_url?: string
  duration_minutes?: number

  // Course-specific fields
  category_id?: string
  instructor_id?: string
  schedule_level?: 'course' | 'module' | 'chapter'
  status?: 'draft' | 'published' | 'archived'
  access_model?: 'free' | 'paid' | 'subscription'
  level?: 'beginner' | 'intermediate' | 'advanced'
  price?: number
  currency?: string
  thumbnail_url?: string
  preview_video_url?: string
  requirements?: string[]
  what_you_will_learn?: string[]
  tags?: string[]
}

export interface MoveNodeRequest {
  parent_id?: string
  position?: number
}

export interface CourseClass extends HierarchyNode {
  content_type: 'class'
  hierarchy_path: HierarchyPathItem[]
  parent: {
    id: string
    title: string
    content_type: ContentType
  } | null
}

export interface CourseHierarchyTree extends HierarchyNode {
  content_type: 'course'
  children: HierarchyNode[]
}

// Form types
export interface CourseFormData {
  title: string
  description?: string
  short_description?: string
  category_id: string
  instructor_id?: string
  schedule_level?: 'course' | 'module' | 'chapter'
  status?: 'draft' | 'published' | 'archived'
  access_model?: 'free' | 'paid' | 'subscription'
  level?: 'beginner' | 'intermediate' | 'advanced'
  price?: number
  currency?: string
  thumbnail_url?: string
  preview_video_url?: string
  requirements?: string[]
  what_you_will_learn?: string[]
  tags?: string[]
}

export interface ModuleFormData {
  title: string
  description?: string
  parent_id: string
  position?: number
  learning_objectives?: string[]
  duration_minutes?: number
}

export interface ChapterFormData {
  title: string
  description?: string
  parent_id: string
  position?: number
  learning_objectives?: string[]
  duration_minutes?: number
}

export interface ClassFormData {
  title: string
  description?: string
  parent_id: string
  position?: number
  content?: string
  learning_objectives?: string[]
  video_url?: string
  duration_minutes?: number
}

// Drag and drop types
export interface DragItem {
  id: string
  type: ContentType
  title: string
  parent_id?: string
  position: number
}

export interface DropTarget {
  id: string
  type: ContentType
  canAcceptType: (dragType: ContentType) => boolean
}

// Validation helpers
export const ALLOWED_CHILDREN: Record<ContentType, ContentType[]> = {
  course: ['module', 'chapter', 'class'],
  module: ['chapter', 'class'],
  chapter: ['class'],
  class: [], // Classes cannot have children
}

export const canHaveChild = (
  parentType: ContentType,
  childType: ContentType
): boolean => {
  return ALLOWED_CHILDREN[parentType].includes(childType)
}

export const getMaxDepth = (): number => 4 // Course -> Module -> Chapter -> Class
