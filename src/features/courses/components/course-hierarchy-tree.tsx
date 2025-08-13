import { useState } from 'react'
import {
  BookOpen,
  FolderOpen,
  FileText,
  Video,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Move,
  Clock,
  Users,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useCourseHierarchy,
  useDeleteHierarchyNode,
} from '../hooks/use-course-hierarchy'
import type { HierarchyNode, ContentType } from '../types'
import { HIERARCHY_LEVELS } from '../types'
import { HierarchyNodeForm } from './hierarchy-node-form'

interface CourseHierarchyTreeProps {
  courseId: string
}

export function CourseHierarchyTree({ courseId }: CourseHierarchyTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set([courseId])
  )
  const [selectedNode, setSelectedNode] = useState<HierarchyNode | null>(null)
  const [_showNodeForm, setShowNodeForm] = useState(false)
  const [_editingNode, setEditingNode] = useState<HierarchyNode | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<HierarchyNode | null>(null)

  const { data: hierarchyTree, isLoading, error } = useCourseHierarchy(courseId)
  const deleteNodeMutation = useDeleteHierarchyNode()

  if (isLoading) {
    return (
      <Card className='flex h-[600px] flex-col'>
        <CardHeader className='shrink-0'>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-4 w-64' />
        </CardHeader>
        <CardContent className='flex-1 overflow-hidden'>
          <div className='h-full overflow-y-auto'>
            <div className='space-y-3'>
              {[...Array(8)].map((_, i) => (
                <HierarchyNodeSkeleton key={i} level={i % 3} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !hierarchyTree) {
    return (
      <Card className='flex h-[600px] flex-col'>
        <CardContent className='flex h-full items-center justify-center'>
          <div className='text-center'>
            <BookOpen className='text-muted-foreground/50 mx-auto h-12 w-12' />
            <h3 className='mt-4 text-lg font-medium'>
              Failed to load course hierarchy
            </h3>
            <p className='text-muted-foreground mt-2 text-sm'>
              There was an error loading the course structure
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleNodeToggle = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const handleNodeSelect = (node: HierarchyNode) => {
    setSelectedNode(node)
  }

  const handleAddChild = (
    parentNode: HierarchyNode,
    childType: ContentType
  ) => {
    setSelectedNode(parentNode)
    // Create a new node structure for the form
    const newNode: HierarchyNode = {
      id: '', // Empty ID indicates this is a new node
      title: '',
      description: '',
      content_type: childType,
      parent_id: parentNode.id,
      position: 0,
      duration_minutes: undefined,
      video_url: '',
      learning_objectives: [],
      content: '',
    }
    setEditingNode(newNode)
    setShowNodeForm(true)
  }

  const handleEditNode = (node: HierarchyNode) => {
    setEditingNode(node)
    setShowNodeForm(true)
  }

  const handleDeleteNode = async () => {
    if (deleteConfirm) {
      await deleteNodeMutation.mutateAsync(deleteConfirm.id)
      setDeleteConfirm(null)
    }
  }

  const renderNode = (node: HierarchyNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const isSelected = selectedNode?.id === node.id
    const hasChildren = node.children && node.children.length > 0
    const icon = getNodeIcon(node.content_type)
    const allowedChildTypes = getAllowedChildTypes(node.content_type)

    return (
      <div
        key={node.id}
        className={cn(
          'group hover:bg-accent/50 relative rounded-lg border transition-all',
          isSelected && 'border-primary bg-accent',
          level > 0 && 'ml-6'
        )}
      >
        <div className='flex items-center justify-between p-3'>
          <div className='flex min-w-0 flex-1 items-center gap-2'>
            {/* Expand/Collapse Button */}
            {hasChildren && (
              <Button
                variant='ghost'
                size='sm'
                className='h-6 w-6 p-0'
                onClick={() => handleNodeToggle(node.id)}
              >
                {isExpanded ? (
                  <ChevronDown className='h-4 w-4' />
                ) : (
                  <ChevronRight className='h-4 w-4' />
                )}
              </Button>
            )}

            {/* Node Icon */}
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md',
                getNodeIconColor(node.content_type)
              )}
            >
              {icon}
            </div>

            {/* Node Content */}
            <div
              className='min-w-0 flex-1'
              onClick={() => handleNodeSelect(node)}
            >
              <div className='flex items-center gap-2'>
                <h4 className='truncate font-medium'>{node.title}</h4>
                <Badge variant='outline' className='text-xs'>
                  {HIERARCHY_LEVELS[node.content_type].name}
                </Badge>
              </div>

              {node.description && (
                <p className='text-muted-foreground truncate text-sm'>
                  {node.description}
                </p>
              )}

              <div className='text-muted-foreground mt-1 flex items-center gap-4 text-xs'>
                {node.duration_minutes && (
                  <span className='flex items-center gap-1'>
                    <Clock className='h-3 w-3' />
                    {node.duration_minutes}m
                  </span>
                )}
                {node.class_count !== undefined && (
                  <span className='flex items-center gap-1'>
                    <Users className='h-3 w-3' />
                    {node.class_count} classes
                  </span>
                )}
                {hasChildren && <span>{node.children?.length} children</span>}
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <div className='flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
            {allowedChildTypes.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                    <Plus className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  {allowedChildTypes.map((childType) => (
                    <DropdownMenuItem
                      key={childType}
                      onClick={() => handleAddChild(node, childType)}
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      Add {HIERARCHY_LEVELS[childType].name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => handleEditNode(node)}>
                  <Edit className='mr-2 h-4 w-4' />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <Move className='mr-2 h-4 w-4' />
                  Move
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteConfirm(node)}
                  className='text-destructive'
                  disabled={node.content_type === 'course'}
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div className='bg-muted/25 border-t'>
            {node.children?.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Card className='flex h-[600px] flex-col'>
        <CardHeader className='shrink-0'>
          <CardTitle className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5' />
            Course Hierarchy
          </CardTitle>
          <CardDescription>
            Manage your course structure: modules, chapters, and classes
          </CardDescription>
        </CardHeader>
        <CardContent className='flex-1 overflow-hidden p-0'>
          <div className='h-full overflow-y-auto p-4'>
            <div className='space-y-1'>{renderNode(hierarchyTree)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Node Form Dialog */}
      <HierarchyNodeForm
        open={_showNodeForm}
        onOpenChange={setShowNodeForm}
        node={_editingNode}
        onSuccess={() => {
          setShowNodeForm(false)
          setEditingNode(null)
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleteConfirm?.content_type}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.title}"? This
              action cannot be undone and will also delete all child nodes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteNode()}
              disabled={deleteNodeMutation.isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {deleteNodeMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Helper functions
function getNodeIcon(contentType: ContentType) {
  const icons = {
    course: <BookOpen className='h-4 w-4' />,
    module: <FolderOpen className='h-4 w-4' />,
    chapter: <FileText className='h-4 w-4' />,
    class: <Video className='h-4 w-4' />,
  }
  return icons[contentType]
}

function getNodeIconColor(contentType: ContentType) {
  const colors = {
    course: 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400',
    module:
      'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400',
    chapter:
      'bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400',
    class:
      'bg-orange-100 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400',
  }
  return colors[contentType]
}

function getAllowedChildTypes(contentType: ContentType): ContentType[] {
  const allowed = {
    course: ['module', 'chapter', 'class'] as ContentType[],
    module: ['chapter', 'class'] as ContentType[],
    chapter: ['class'] as ContentType[],
    class: [] as ContentType[],
  }
  return allowed[contentType] || []
}

function HierarchyNodeSkeleton({ level }: { level: number }) {
  const indentClass = level > 0 ? `ml-${level * 6}` : ''

  return (
    <div className={cn('rounded-lg border p-3', indentClass)}>
      <div className='flex items-center gap-3'>
        <Skeleton className='h-4 w-4 rounded-full' />
        <div className='flex-1 space-y-2'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-5 w-12' />
          </div>
          <div className='flex items-center gap-4'>
            <Skeleton className='h-3 w-16' />
            <Skeleton className='h-3 w-12' />
          </div>
        </div>
        <Skeleton className='h-8 w-8' />
      </div>
    </div>
  )
}
