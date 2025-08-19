import React, { useState, useEffect } from 'react'
import {
  Loader2,
  Plus,
  MoreVertical,
  Search,
  Folder,
  FileText,
  Play,
  Download,
  FileQuestion,
  CheckCircle,
  Users,
  Calendar,
  GripVertical,
} from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  CourseContent,
  ContentEditorType,
} from '../../types/content-editor'
import { useContentEditor } from './use-content-editor'

// Main Content Editor component
interface ContentEditorProps {
  courseId: string
}

export function ContentEditor({ courseId }: ContentEditorProps) {
  const { state, actions } = useContentEditor()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<ContentEditorType | 'all'>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    actions.loadContent(parseInt(courseId))
  }, [courseId, actions])

  // Filter contents based on search and type
  const filteredContents = state.contents.filter((content: CourseContent) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || content.type === filterType
    return matchesSearch && matchesType
  })

  // Group contents by parent for tree structure
  const groupedContents = filteredContents.reduce(
    (acc: Record<string, CourseContent[]>, content: CourseContent) => {
      const parentId = content.parent_id?.toString() || 'root'
      if (!acc[parentId]) {
        acc[parentId] = []
      }
      acc[parentId].push(content)
      return acc
    },
    {} as Record<string, CourseContent[]>
  )

  const handleCreateContent = async (data: {
    title: string
    description: string
    type: ContentEditorType
    status: string
  }) => {
    try {
      await actions.createContent(parseInt(courseId), {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status as 'draft' | 'published' | 'archived',
      })
      setIsCreateDialogOpen(false)
    } catch (_error) {
      // Error handled by context
    }
  }

  const handleDeleteContent = async (contentId: string) => {
    try {
      await actions.deleteContent(parseInt(courseId), parseInt(contentId))
      setDeleteConfirmId(null)
    } catch (_error) {
      // Error handled by context
    }
  }

  const getContentIcon = (type: ContentEditorType) => {
    switch (type) {
      case 'module':
      case 'chapter':
        return <Folder className='h-4 w-4' />
      case 'lesson':
      case 'text':
        return <FileText className='h-4 w-4' />
      case 'video':
        return <Play className='h-4 w-4' />
      case 'document':
        return <Download className='h-4 w-4' />
      case 'quiz':
      case 'assignment':
        return <CheckCircle className='h-4 w-4' />
      case 'live_session':
        return <Users className='h-4 w-4' />
      default:
        return <FileQuestion className='h-4 w-4' />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'archived':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (state.isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='h-8 w-8 animate-spin' />
        <span className='ml-2'>Loading content...</span>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header with statistics */}
      {state.statistics && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Items</CardTitle>
              <FileText className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {state.statistics.total_content}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Published</CardTitle>
              <CheckCircle className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {state.statistics.published_content}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Draft Items</CardTitle>
              <FileQuestion className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {state.statistics.draft_content}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Duration
              </CardTitle>
              <Calendar className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {state.statistics.total_duration || 0} min
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Toolbar */}
      <Card>
        <CardContent className='p-4'>
          <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <div className='flex flex-1 flex-col items-start gap-4 sm:flex-row sm:items-center'>
              <div className='relative max-w-sm flex-1'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                <Input
                  placeholder='Search content...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
              <Select
                value={filterType}
                onValueChange={(value: ContentEditorType | 'all') =>
                  setFilterType(value)
                }
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Filter by type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Types</SelectItem>
                  <SelectItem value='module'>Modules</SelectItem>
                  <SelectItem value='chapter'>Chapters</SelectItem>
                  <SelectItem value='lesson'>Lessons</SelectItem>
                  <SelectItem value='video'>Videos</SelectItem>
                  <SelectItem value='document'>Documents</SelectItem>
                  <SelectItem value='quiz'>Quizzes</SelectItem>
                  <SelectItem value='assignment'>Assignments</SelectItem>
                  <SelectItem value='text'>Text Content</SelectItem>
                  <SelectItem value='live_session'>Live Sessions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Add Content
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-md'>
                <DialogHeader>
                  <DialogTitle>Add New Content</DialogTitle>
                  <DialogDescription>
                    Create a new content item for this course.
                  </DialogDescription>
                </DialogHeader>
                <ContentCreateForm onSubmit={handleCreateContent} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Content Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredContents.length === 0 ? (
            <div className='py-8 text-center'>
              <FileText className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
              <h3 className='text-muted-foreground text-lg font-semibold'>
                No content found
              </h3>
              <p className='text-muted-foreground text-sm'>
                {searchTerm || filterType !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start by adding your first content item.'}
              </p>
            </div>
          ) : (
            <div className='space-y-2'>
              <ContentTree
                contents={groupedContents['root'] || []}
                allContents={groupedContents}
                selectedContent={state.selectedContent || null}
                onSelect={actions.selectContent}
                onDelete={(id) => setDeleteConfirmId(id.toString())}
                getContentIcon={getContentIcon}
                getStatusColor={getStatusColor}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              content item and all of its children.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteConfirmId && handleDeleteContent(deleteConfirmId)
              }
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Content Tree Component
interface ContentTreeProps {
  contents: CourseContent[]
  allContents: Record<string, CourseContent[]>
  selectedContent: CourseContent | null
  onSelect: (content?: CourseContent) => void
  onDelete: (id: number) => void
  getContentIcon: (type: ContentEditorType) => React.ReactNode
  getStatusColor: (status: string) => string
  level?: number
}

function ContentTree({
  contents,
  allContents,
  selectedContent,
  onSelect,
  onDelete,
  getContentIcon,
  getStatusColor,
  level = 0,
}: ContentTreeProps) {
  const sortedContents = [...contents].sort((a, b) => a.position - b.position)

  return (
    <div className={level > 0 ? 'ml-6 border-l border-gray-200 pl-4' : ''}>
      {sortedContents.map((content) => {
        const hasChildren = allContents[content.id.toString()]?.length > 0
        const isSelected = selectedContent?.id === content.id

        return (
          <div key={content.id} className='space-y-2'>
            <div
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                isSelected
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onSelect(content)}
            >
              <GripVertical className='h-4 w-4 text-gray-400' />
              {getContentIcon(content.type)}
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                  <h4 className='truncate text-sm font-medium'>
                    {content.title}
                  </h4>
                  <Badge
                    className={`text-xs ${getStatusColor(content.status)}`}
                  >
                    {content.status}
                  </Badge>
                  {content.duration_mins && (
                    <span className='text-muted-foreground text-xs'>
                      {content.duration_mins} min
                    </span>
                  )}
                </div>
                {content.description && (
                  <p className='text-muted-foreground truncate text-xs'>
                    {content.description}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm'>
                    <MoreVertical className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => onSelect(content)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(content.id)}
                    className='text-destructive'
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {hasChildren && (
              <ContentTree
                contents={allContents[content.id.toString()]}
                allContents={allContents}
                selectedContent={selectedContent}
                onSelect={onSelect}
                onDelete={onDelete}
                getContentIcon={getContentIcon}
                getStatusColor={getStatusColor}
                level={level + 1}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Content Create Form Component
interface ContentCreateFormProps {
  onSubmit: (data: {
    title: string
    description: string
    type: ContentEditorType
    status: string
  }) => void
}

function ContentCreateForm({ onSubmit }: ContentCreateFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lesson' as ContentEditorType,
    status: 'draft',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      title: '',
      description: '',
      type: 'lesson',
      status: 'draft',
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label htmlFor='title' className='mb-1 block text-sm font-medium'>
          Title
        </label>
        <Input
          id='title'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder='Enter content title'
          required
        />
      </div>

      <div>
        <label htmlFor='description' className='mb-1 block text-sm font-medium'>
          Description
        </label>
        <Input
          id='description'
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder='Enter content description'
        />
      </div>

      <div>
        <label
          htmlFor='content_type'
          className='mb-1 block text-sm font-medium'
        >
          Content Type
        </label>
        <Select
          value={formData.type}
          onValueChange={(value: ContentEditorType) =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='module'>Module</SelectItem>
            <SelectItem value='chapter'>Chapter</SelectItem>
            <SelectItem value='lesson'>Lesson</SelectItem>
            <SelectItem value='video'>Video</SelectItem>
            <SelectItem value='document'>Document</SelectItem>
            <SelectItem value='quiz'>Quiz</SelectItem>
            <SelectItem value='assignment'>Assignment</SelectItem>
            <SelectItem value='text'>Text Content</SelectItem>
            <SelectItem value='live_session'>Live Session</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='flex justify-end gap-3 pt-4'>
        <Button type='submit'>Create Content</Button>
      </div>
    </form>
  )
}
