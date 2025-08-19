import { useState, useEffect } from 'react'
import {
  Save,
  Upload,
  Eye,
  Trash2,
  Copy,
  Calendar,
  Clock,
  FileText,
  Play,
  Download,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type {
  ContentEditorType,
  UpdateContentRequest,
} from '../../types/content-editor'
import { useContentEditor } from './use-content-editor'

interface ContentDetailPanelProps {
  courseId: string
}

export function ContentDetailPanel({ courseId }: ContentDetailPanelProps) {
  const { state, actions } = useContentEditor()
  const selectedContent = state.selectedContent

  const [formData, setFormData] = useState<Partial<UpdateContentRequest>>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Update form data when selected content changes
  useEffect(() => {
    if (selectedContent) {
      setFormData({
        id: selectedContent.id,
        title: selectedContent.title,
        description: selectedContent.description || '',
        type: selectedContent.type,
        content: selectedContent.content || '',
        video_url: selectedContent.video_url || '',
        learning_objectives: selectedContent.learning_objectives || [],
        estimated_duration: selectedContent.estimated_duration || 0,
        is_required: selectedContent.is_required,
        is_free: selectedContent.is_free,
        status: selectedContent.status,
      })
      setHasChanges(false)
    }
  }, [selectedContent])

  const handleInputChange = (
    field: keyof UpdateContentRequest,
    value: string | number | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!selectedContent || !formData.id) return

    try {
      setIsUpdating(true)
      const updateData: UpdateContentRequest = {
        id: formData.id,
        ...formData,
      }
      await actions.updateContent(parseInt(courseId), formData.id, updateData)
      setHasChanges(false)
    } catch (_error) {
      // Error handled by context
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDuplicate = async () => {
    if (!selectedContent) return

    try {
      await actions.duplicateContent(parseInt(courseId), selectedContent.id)
    } catch (_error) {
      // Error handled by context
    }
  }

  const handleDelete = async () => {
    if (!selectedContent) return

    if (
      window.confirm(
        'Are you sure you want to delete this content? This action cannot be undone.'
      )
    ) {
      try {
        await actions.deleteContent(parseInt(courseId), selectedContent.id)
        actions.selectContent(undefined)
      } catch (_error) {
        // Error handled by context
      }
    }
  }

  const getContentIcon = (type: ContentEditorType) => {
    switch (type) {
      case 'module':
      case 'chapter':
        return <FileText className='h-4 w-4' />
      case 'lesson':
      case 'text':
        return <FileText className='h-4 w-4' />
      case 'video':
        return <Play className='h-4 w-4' />
      case 'document':
        return <Download className='h-4 w-4' />
      case 'quiz':
      case 'assignment':
        return <FileText className='h-4 w-4' />
      case 'live_session':
        return <Users className='h-4 w-4' />
      default:
        return <FileText className='h-4 w-4' />
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

  if (!selectedContent) {
    return (
      <Card className='h-full'>
        <CardContent className='flex h-96 items-center justify-center'>
          <div className='text-center'>
            <FileText className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <h3 className='text-muted-foreground text-lg font-semibold'>
              No content selected
            </h3>
            <p className='text-muted-foreground text-sm'>
              Select a content item from the tree to view and edit its details.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='h-full'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            {getContentIcon(selectedContent.type)}
            <div>
              <CardTitle className='text-lg'>{selectedContent.title}</CardTitle>
              <div className='mt-1 flex items-center gap-2'>
                <Badge
                  className={`text-xs ${getStatusColor(selectedContent.status)}`}
                >
                  {selectedContent.status}
                </Badge>
                <Badge variant='outline' className='text-xs'>
                  {selectedContent.type}
                </Badge>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isUpdating}
              size='sm'
            >
              <Save className='mr-2 h-4 w-4' />
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={handleDuplicate} variant='outline' size='sm'>
              <Copy className='mr-2 h-4 w-4' />
              Duplicate
            </Button>
            <Button
              onClick={handleDelete}
              variant='outline'
              size='sm'
              className='text-destructive hover:text-destructive'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Basic Information */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Basic Information</h4>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor='type'>Content Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ContentEditorType) =>
                  handleInputChange('type', value)
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
          </div>

          <div>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <Separator />

        {/* Content */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Content</h4>

          {formData.type === 'video' && (
            <div>
              <Label htmlFor='video_url'>Video URL</Label>
              <Input
                id='video_url'
                value={formData.video_url || ''}
                onChange={(e) => handleInputChange('video_url', e.target.value)}
                placeholder='Enter video URL'
              />
            </div>
          )}

          <div>
            <Label htmlFor='content'>Content</Label>
            <Textarea
              id='content'
              value={formData.content || ''}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={6}
              placeholder='Enter your content here...'
            />
          </div>

          {selectedContent.file_path && (
            <div className='flex items-center gap-2 rounded-lg bg-gray-50 p-3'>
              <Upload className='text-muted-foreground h-4 w-4' />
              <span className='text-sm'>
                File attached: {selectedContent.file_path}
              </span>
              {selectedContent.file_url && (
                <Button variant='link' size='sm' asChild>
                  <a
                    href={selectedContent.file_url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Eye className='mr-1 h-4 w-4' />
                    View
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Settings */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Settings</h4>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='status'>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='draft'>Draft</SelectItem>
                  <SelectItem value='published'>Published</SelectItem>
                  <SelectItem value='archived'>Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='duration'>Duration (minutes)</Label>
              <Input
                id='duration'
                type='number'
                value={formData.estimated_duration || ''}
                onChange={(e) =>
                  handleInputChange(
                    'estimated_duration',
                    parseInt(e.target.value) || 0
                  )
                }
                min='0'
              />
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='is_required' className='text-sm font-medium'>
                Required Content
              </Label>
              <Switch
                id='is_required'
                checked={formData.is_required || false}
                onCheckedChange={(checked) =>
                  handleInputChange('is_required', checked)
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <Label htmlFor='is_free' className='text-sm font-medium'>
                Free Content
              </Label>
              <Switch
                id='is_free'
                checked={formData.is_free || false}
                onCheckedChange={(checked) =>
                  handleInputChange('is_free', checked)
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Metadata */}
        <div className='space-y-3'>
          <h4 className='font-medium'>Metadata</h4>

          <div className='text-muted-foreground grid grid-cols-2 gap-4 text-sm'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4' />
              <span>
                Created:{' '}
                {new Date(selectedContent.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4' />
              <span>
                Updated:{' '}
                {new Date(selectedContent.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {selectedContent.published_at && (
            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <Eye className='h-4 w-4' />
              <span>
                Published:{' '}
                {new Date(selectedContent.published_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
