// Add React import
import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  useCreateHierarchyNode,
  useUpdateHierarchyNode,
} from '../hooks/use-course-hierarchy'
import type { HierarchyNode, ContentType } from '../types'
import { HIERARCHY_LEVELS } from '../types'

// Form validation schema
const hierarchyNodeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().optional(),
  content: z.string().optional(),
  video_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  duration_minutes: z.number().min(0, 'Duration must be positive').optional(),
  learning_objectives: z.array(z.string()).optional(),
})

type NodeFormValues = z.infer<typeof hierarchyNodeSchema>

interface HierarchyNodeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  node?: HierarchyNode | null
  onSuccess: () => void
}

export function HierarchyNodeForm({
  open,
  onOpenChange,
  node,
  onSuccess,
}: HierarchyNodeFormProps) {
  const isEditing = node && node.id && node.id !== ''
  const createNodeMutation = useCreateHierarchyNode()
  const updateNodeMutation = useUpdateHierarchyNode()

  const form = useForm<NodeFormValues>({
    resolver: zodResolver(hierarchyNodeSchema),
    defaultValues: {
      title: node?.title || '',
      description: node?.description || '',
      content: node?.content || '',
      video_url: node?.video_url || '',
      duration_minutes: node?.duration_minutes || undefined,
      learning_objectives: node?.learning_objectives || [],
    },
  })

  // Reset form when node changes
  React.useEffect(() => {
    if (node) {
      form.reset({
        title: node.title || '',
        description: node.description || '',
        content: node.content || '',
        video_url: node.video_url || '',
        duration_minutes: node.duration_minutes || undefined,
        learning_objectives: node.learning_objectives || [],
      })
    }
  }, [node, form])

  const handleSubmit = async (values: NodeFormValues) => {
    if (!node) return

    try {
      const data = {
        ...values,
        content_type: node.content_type,
        parent_id: node.parent_id,
        position: node.position,
        learning_objectives: values.learning_objectives?.filter(Boolean) || [],
      }

      if (isEditing) {
        await updateNodeMutation.mutateAsync({
          nodeId: node.id,
          data,
        })
      } else {
        await createNodeMutation.mutateAsync(data)
      }

      onSuccess()
    } catch (_error) {
      // Error handling is done by the mutation hooks
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    form.reset()
  }

  const getFormFields = (contentType: ContentType) => {
    const baseFields = ['title', 'description']

    switch (contentType) {
      case 'course':
        return [...baseFields, 'content']
      case 'module':
        return [...baseFields, 'duration_minutes', 'learning_objectives']
      case 'chapter':
        return [...baseFields, 'duration_minutes', 'learning_objectives']
      case 'class':
        return [
          ...baseFields,
          'content',
          'video_url',
          'duration_minutes',
          'learning_objectives',
        ]
      default:
        return baseFields
    }
  }

  const availableFields = node ? getFormFields(node.content_type) : []

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {isEditing ? 'Edit' : 'Create'}{' '}
            {node?.content_type && HIERARCHY_LEVELS[node.content_type].name}
            {node?.content_type && (
              <Badge variant='outline'>
                {HIERARCHY_LEVELS[node.content_type].name}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {node?.content_type &&
              HIERARCHY_LEVELS[node.content_type].description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <div className='max-h-[60vh] space-y-4 overflow-y-auto pr-2'>
              {/* Title Field */}
              {availableFields.includes('title') && (
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Enter ${node?.content_type} title...`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Description Field */}
              {availableFields.includes('description') && (
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`Brief description of this ${node?.content_type}...`}
                          className='h-20'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Content Field (for courses and classes) */}
              {availableFields.includes('content') && (
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Detailed content...'
                          className='h-32'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {node?.content_type === 'class'
                          ? 'Class content, notes, or materials'
                          : 'Detailed course content and curriculum'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Video URL Field (for classes) */}
              {availableFields.includes('video_url') && (
                <FormField
                  control={form.control}
                  name='video_url'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
                      <FormControl>
                        <Input
                          type='url'
                          placeholder='https://example.com/video'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to the class video or recording
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Duration Field */}
              {availableFields.includes('duration_minutes') && (
                <FormField
                  control={form.control}
                  name='duration_minutes'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='60'
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Estimated duration in minutes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Learning Objectives Field */}
              {availableFields.includes('learning_objectives') && (
                <div className='space-y-2'>
                  <FormLabel>Learning Objectives</FormLabel>
                  <LearningObjectivesField form={form} />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type='button' variant='outline' onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={
                  createNodeMutation.isPending || updateNodeMutation.isPending
                }
              >
                {createNodeMutation.isPending || updateNodeMutation.isPending
                  ? 'Saving...'
                  : isEditing
                    ? 'Update'
                    : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// Learning Objectives Field Component
function LearningObjectivesField({
  form,
}: {
  form: UseFormReturn<NodeFormValues>
}) {
  const [objectives, setObjectives] = React.useState<string[]>(
    form.getValues('learning_objectives') || ['']
  )

  const addObjective = () => {
    const newObjectives = [...objectives, '']
    setObjectives(newObjectives)
    form.setValue('learning_objectives', newObjectives.filter(Boolean))
  }

  const removeObjective = (index: number) => {
    const newObjectives = objectives.filter((_, i) => i !== index)
    setObjectives(newObjectives)
    form.setValue('learning_objectives', newObjectives.filter(Boolean))
  }

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...objectives]
    newObjectives[index] = value
    setObjectives(newObjectives)
    form.setValue('learning_objectives', newObjectives.filter(Boolean))
  }

  return (
    <div className='space-y-2'>
      {objectives.map((objective, index) => (
        <div key={index} className='flex gap-2'>
          <Input
            placeholder={`Learning objective ${index + 1}...`}
            value={objective}
            onChange={(e) => updateObjective(index, e.target.value)}
          />
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => removeObjective(index)}
            disabled={objectives.length === 1}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        type='button'
        variant='outline'
        size='sm'
        onClick={addObjective}
        className='w-full'
      >
        Add Learning Objective
      </Button>
    </div>
  )
}
