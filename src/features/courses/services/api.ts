import { api } from '@/lib/api'
import type {
  HierarchyNode,
  CreateHierarchyNodeRequest,
  MoveNodeRequest,
  CourseClass,
  CourseHierarchyTree,
} from '../types'

// API endpoints for the new hierarchy system
export const courseHierarchyApi = {
  // Create any hierarchy node (course, module, chapter, class)
  createNode: async (
    data: CreateHierarchyNodeRequest
  ): Promise<HierarchyNode> => {
    const response = await api.post('/v1/courses/hierarchy', data)
    return response.data.data
  },

  // Get complete course hierarchy tree
  getHierarchyTree: async (courseId: string): Promise<CourseHierarchyTree> => {
    const response = await api.get(`/v1/courses/${courseId}/hierarchy`)
    return response.data.data
  },

  // Move a node to a new parent or position
  moveNode: async (
    nodeId: string,
    data: MoveNodeRequest
  ): Promise<HierarchyNode> => {
    const response = await api.put(`/v1/courses/hierarchy/${nodeId}/move`, data)
    return response.data.data
  },

  // Get all classes for a course (flattened)
  getCourseClasses: async (courseId: string): Promise<CourseClass[]> => {
    const response = await api.get(`/v1/courses/${courseId}/classes`)
    return response.data.data
  },

  // Update a hierarchy node
  updateNode: async (
    nodeId: string,
    data: Partial<CreateHierarchyNodeRequest>
  ): Promise<HierarchyNode> => {
    const response = await api.put(`/v1/courses/${nodeId}`, data)
    return response.data.data
  },

  // Delete a hierarchy node
  deleteNode: async (nodeId: string): Promise<void> => {
    await api.delete(`/v1/courses/${nodeId}`)
  },

  // Get courses list with hierarchy support
  getCourses: async (params?: {
    page?: number
    per_page?: number
    search?: string
    status?: string
    category_id?: string
    content_type?: string
  }) => {
    // Only include content_type in params if explicitly provided
    const apiParams = { ...params }

    // If content_type is undefined, remove it from params to show all types
    if (apiParams.content_type === undefined) {
      delete apiParams.content_type
    }

    const response = await api.get('/v1/courses', { params: apiParams })
    return response.data
  },

  // Get single course details
  getCourse: async (courseId: string): Promise<HierarchyNode> => {
    const response = await api.get(`/v1/courses/${courseId}`)
    return response.data.data
  },
}

// Legacy API support (if needed for migration)
export const legacyCourseApi = {
  getCourses: async (params?: unknown) => {
    const response = await api.get('/v1/courses', { params })
    return response.data
  },

  createCourse: async (data: unknown) => {
    const response = await api.post('/v1/courses', data)
    return response.data
  },

  updateCourse: async (id: string, data: unknown) => {
    const response = await api.put(`/v1/courses/${id}`, data)
    return response.data
  },

  deleteCourse: async (id: string) => {
    await api.delete(`/v1/courses/${id}`)
  },
}

// Utility functions for hierarchy operations
export const hierarchyUtils = {
  // Calculate total duration for a hierarchy tree
  calculateTotalDuration: (node: HierarchyNode): number => {
    let total = node.duration_minutes || 0

    if (node.children) {
      total += node.children.reduce((sum, child) => {
        return sum + hierarchyUtils.calculateTotalDuration(child)
      }, 0)
    }

    return total
  },

  // Count total classes in a hierarchy tree
  countClasses: (node: HierarchyNode): number => {
    let count = node.content_type === 'class' ? 1 : 0

    if (node.children) {
      count += node.children.reduce((sum, child) => {
        return sum + hierarchyUtils.countClasses(child)
      }, 0)
    }

    return count
  },

  // Flatten hierarchy tree to get all nodes
  flattenTree: (node: HierarchyNode): HierarchyNode[] => {
    const result = [node]

    if (node.children) {
      node.children.forEach((child) => {
        result.push(...hierarchyUtils.flattenTree(child))
      })
    }

    return result
  },

  // Find node by ID in hierarchy tree
  findNodeById: (tree: HierarchyNode, nodeId: string): HierarchyNode | null => {
    if (tree.id === nodeId) return tree

    if (tree.children) {
      for (const child of tree.children) {
        const found = hierarchyUtils.findNodeById(child, nodeId)
        if (found) return found
      }
    }

    return null
  },

  // Get all nodes of a specific type
  getNodesByType: (tree: HierarchyNode, type: string): HierarchyNode[] => {
    const result: HierarchyNode[] = []

    if (tree.content_type === type) {
      result.push(tree)
    }

    if (tree.children) {
      tree.children.forEach((child) => {
        result.push(...hierarchyUtils.getNodesByType(child, type))
      })
    }

    return result
  },

  // Build hierarchy path for a node
  buildHierarchyPath: (
    tree: HierarchyNode,
    targetId: string,
    path: HierarchyNode[] = []
  ): HierarchyNode[] | null => {
    const currentPath = [...path, tree]

    if (tree.id === targetId) {
      return currentPath
    }

    if (tree.children) {
      for (const child of tree.children) {
        const result = hierarchyUtils.buildHierarchyPath(
          child,
          targetId,
          currentPath
        )
        if (result) return result
      }
    }

    return null
  },
}
