import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { courseHierarchyApi, hierarchyUtils } from '../services/api'
import type {
  CreateHierarchyNodeRequest,
  MoveNodeRequest,
  HierarchyNode,
  CourseHierarchyTree,
} from '../types'

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

// Query keys
export const courseQueryKeys = {
  all: ['courses'] as const,
  lists: () => [...courseQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...courseQueryKeys.lists(), filters] as const,
  details: () => [...courseQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseQueryKeys.details(), id] as const,
  hierarchy: (id: string) => [...courseQueryKeys.all, 'hierarchy', id] as const,
  classes: (id: string) => [...courseQueryKeys.all, 'classes', id] as const,
}

// Get courses list
export const useCourses = (params?: {
  page?: number
  per_page?: number
  search?: string
  status?: string
  category_id?: string
  content_type?: string
}) => {
  return useQuery({
    queryKey: courseQueryKeys.list(params || {}),
    queryFn: () => courseHierarchyApi.getCourses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single course
export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: courseQueryKeys.detail(courseId),
    queryFn: () => courseHierarchyApi.getCourse(courseId),
    enabled: !!courseId,
  })
}

// Get course hierarchy tree
export const useCourseHierarchy = (courseId: string) => {
  return useQuery({
    queryKey: courseQueryKeys.hierarchy(courseId),
    queryFn: () => courseHierarchyApi.getHierarchyTree(courseId),
    enabled: !!courseId,
    select: (data: CourseHierarchyTree) => {
      // Add computed fields
      return {
        ...data,
        class_count: hierarchyUtils.countClasses(data),
        total_duration: hierarchyUtils.calculateTotalDuration(data),
      }
    },
  })
}

// Get course classes (flattened)
export const useCourseClasses = (courseId: string) => {
  return useQuery({
    queryKey: courseQueryKeys.classes(courseId),
    queryFn: () => courseHierarchyApi.getCourseClasses(courseId),
    enabled: !!courseId,
  })
}

// Create hierarchy node mutation
export const useCreateHierarchyNode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateHierarchyNodeRequest) =>
      courseHierarchyApi.createNode(data),
    onSuccess: (_data, variables) => {
      toast.success(`${variables.content_type} created successfully!`)

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: courseQueryKeys.lists() })

      // If creating under a parent, invalidate hierarchy
      if (variables.parent_id) {
        const courseId = getCourseIdFromNode(variables.parent_id, queryClient)
        if (courseId) {
          queryClient.invalidateQueries({
            queryKey: courseQueryKeys.hierarchy(courseId),
          })
          queryClient.invalidateQueries({
            queryKey: courseQueryKeys.classes(courseId),
          })
        }
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Failed to create node')
    },
  })
}

// Update hierarchy node mutation
export const useUpdateHierarchyNode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      nodeId,
      data,
    }: {
      nodeId: string
      data: Partial<CreateHierarchyNodeRequest>
    }) => courseHierarchyApi.updateNode(nodeId, data),
    onSuccess: (data) => {
      toast.success('Updated successfully!')

      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: courseQueryKeys.detail(data.id),
      })
      queryClient.invalidateQueries({ queryKey: courseQueryKeys.lists() })

      // Invalidate hierarchy if it's part of a course tree
      const courseId = getCourseIdFromNode(data.id, queryClient)
      if (courseId) {
        queryClient.invalidateQueries({
          queryKey: courseQueryKeys.hierarchy(courseId),
        })
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Failed to update node')
    },
  })
}

// Move hierarchy node mutation
export const useMoveHierarchyNode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ nodeId, data }: { nodeId: string; data: MoveNodeRequest }) =>
      courseHierarchyApi.moveNode(nodeId, data),
    onSuccess: (_data) => {
      toast.success('Node moved successfully!')

      // Invalidate hierarchy queries for affected courses
      queryClient.invalidateQueries({ queryKey: courseQueryKeys.all })
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Failed to move node')
    },
  })
}

// Delete hierarchy node mutation
export const useDeleteHierarchyNode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (nodeId: string) => courseHierarchyApi.deleteNode(nodeId),
    onSuccess: () => {
      toast.success('Deleted successfully!')

      // Invalidate all course queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: courseQueryKeys.all })
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Failed to delete node')
    },
  })
}

// Utility function to find course ID from cache
const getCourseIdFromNode = (
  nodeId: string,
  queryClient: ReturnType<typeof useQueryClient>
): string | null => {
  // Try to find the course ID from cached hierarchy data
  const allQueries = queryClient.getQueriesData({
    queryKey: courseQueryKeys.all,
  })

  for (const [key, data] of allQueries) {
    if (key.includes('hierarchy') && data) {
      const tree = data as CourseHierarchyTree
      const node = hierarchyUtils.findNodeById(tree, nodeId)
      if (node) {
        return tree.id // Return the root course ID
      }
    }
  }

  return null
}

// Optimistic updates for better UX
export const useOptimisticMoveNode = () => {
  const queryClient = useQueryClient()

  const optimisticMove = (
    courseId: string,
    nodeId: string,
    newParentId: string | null,
    newPosition: number
  ) => {
    queryClient.setQueryData(
      courseQueryKeys.hierarchy(courseId),
      (oldData: CourseHierarchyTree | undefined) => {
        if (!oldData) return oldData

        // Clone the tree and perform the move optimistically
        const updatedTree = JSON.parse(JSON.stringify(oldData))

        // Find and remove the node from its current position
        const nodeToMove = hierarchyUtils.findNodeById(updatedTree, nodeId)
        if (!nodeToMove) return oldData

        // Remove from old parent
        removeNodeFromParent(updatedTree, nodeId)

        // Add to new parent
        addNodeToParent(updatedTree, nodeToMove, newParentId, newPosition)

        return updatedTree
      }
    )
  }

  return { optimisticMove }
}

// Helper functions for optimistic updates
const removeNodeFromParent = (tree: HierarchyNode, nodeId: string): boolean => {
  if (tree.children) {
    const index = tree.children.findIndex((child) => child.id === nodeId)
    if (index >= 0) {
      tree.children.splice(index, 1)
      return true
    }

    for (const child of tree.children) {
      if (removeNodeFromParent(child, nodeId)) {
        return true
      }
    }
  }
  return false
}

const addNodeToParent = (
  tree: HierarchyNode,
  nodeToAdd: HierarchyNode,
  parentId: string | null,
  position: number
) => {
  if (parentId === null || tree.id === parentId) {
    // Add to root or specific parent
    if (!tree.children) tree.children = []
    nodeToAdd.parent_id = parentId || undefined
    nodeToAdd.position = position
    tree.children.splice(position, 0, nodeToAdd)
    return
  }

  if (tree.children) {
    for (const child of tree.children) {
      addNodeToParent(child, nodeToAdd, parentId, position)
    }
  }
}
