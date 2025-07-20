import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  GripVertical,
  FileText,
  Video,
  Download,
  MoreHorizontal,
  Move3D,
  EyeOff,
  Eye,
  HelpCircle,
} from 'lucide-react'

// Types
interface CourseClass {
  id: string
  title: string
  description: string
  content_type: 'video' | 'text' | 'quiz' | 'assignment' | 'resource'
  duration_minutes: number
  is_preview: boolean
  is_required: boolean
  order_index: number
  content_url?: string
  is_published: boolean
}

interface CourseChapter {
  id: string
  title: string
  description: string
  order_index: number
  is_published: boolean
  classes: CourseClass[]
  estimated_duration: number
}

interface CourseModule {
  id: string
  title: string
  description: string
  order_index: number
  is_published: boolean
  chapters: CourseChapter[]
  estimated_duration: number
}

interface CourseStructure {
  modules: CourseModule[]
  total_duration: number
  total_classes: number
  completion_rate: number
}

// Schemas
const moduleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

const chapterSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

const classSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content_type: z.enum(['video', 'text', 'quiz', 'assignment', 'resource']),
  duration_minutes: z.number().min(1, 'Duration must be at least 1 minute'),
  is_preview: z.boolean().default(false),
  is_required: z.boolean().default(true),
  content_url: z.string().url().optional(),
})

interface CourseStructureManagerProps {
  structure: CourseStructure
  onUpdate: (structure: CourseStructure) => void
}

const contentTypeIcons = {
  video: Video,
  text: FileText,
  quiz: HelpCircle,
  assignment: FileText,
  resource: Download,
}

const contentTypeLabels = {
  video: 'Video Lecture',
  text: 'Text Content',
  quiz: 'Quiz/Assessment',
  assignment: 'Assignment',
  resource: 'Resource/Download',
}

export function CourseStructureManager({ structure, onUpdate }: CourseStructureManagerProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [createModuleOpen, setCreateModuleOpen] = useState(false)
  const [createChapterOpen, setCreateChapterOpen] = useState(false)
  const [createClassOpen, setCreateClassOpen] = useState(false)
  const [selectedModuleId, setSelectedModuleId] = useState<string>('')
  const [selectedChapterId, setSelectedChapterId] = useState<string>('')

  const moduleForm = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: { title: '', description: '' }
  })

  const chapterForm = useForm({
    resolver: zodResolver(chapterSchema),
    defaultValues: { title: '', description: '' }
  })

  const classForm = useForm({
    resolver: zodResolver(classSchema),
    defaultValues: {
      title: '',
      description: '',
      content_type: 'video' as const,
      duration_minutes: 10,
      is_preview: false,
      is_required: true,
      content_url: '',
    }
  })

  const toggleModuleExpansion = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const toggleChapterExpansion = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, type } = result

    if (type === 'modules') {
      const newModules = Array.from(structure.modules)
      const [reorderedModule] = newModules.splice(source.index, 1)
      newModules.splice(destination.index, 0, reorderedModule)
      
      const updatedModules = newModules.map((module, index) => ({
        ...module,
        order_index: index + 1
      }))

      onUpdate({
        ...structure,
        modules: updatedModules
      })
    } else if (type === 'chapters') {
      const moduleId = source.droppableId.replace('chapters-', '')
      const moduleIndex = structure.modules.findIndex(m => m.id === moduleId)
      
      if (moduleIndex === -1) return

      const newChapters = Array.from(structure.modules[moduleIndex].chapters)
      const [reorderedChapter] = newChapters.splice(source.index, 1)
      newChapters.splice(destination.index, 0, reorderedChapter)

      const updatedChapters = newChapters.map((chapter, index) => ({
        ...chapter,
        order_index: index + 1
      }))

      const newModules = [...structure.modules]
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        chapters: updatedChapters
      }

      onUpdate({
        ...structure,
        modules: newModules
      })
    } else if (type === 'classes') {
      const chapterId = source.droppableId.replace('classes-', '')
      const moduleIndex = structure.modules.findIndex(m => 
        m.chapters.some(c => c.id === chapterId)
      )
      const chapterIndex = structure.modules[moduleIndex]?.chapters.findIndex(c => c.id === chapterId)
      
      if (moduleIndex === -1 || chapterIndex === -1) return

      const newClasses = Array.from(structure.modules[moduleIndex].chapters[chapterIndex].classes)
      const [reorderedClass] = newClasses.splice(source.index, 1)
      newClasses.splice(destination.index, 0, reorderedClass)

      const updatedClasses = newClasses.map((classItem, index) => ({
        ...classItem,
        order_index: index + 1
      }))

      const newModules = [...structure.modules]
      newModules[moduleIndex].chapters[chapterIndex] = {
        ...newModules[moduleIndex].chapters[chapterIndex],
        classes: updatedClasses
      }

      onUpdate({
        ...structure,
        modules: newModules
      })
    }
  }

  const createModule = (data: z.infer<typeof moduleSchema>) => {
    const newModule: CourseModule = {
      id: `module-${Date.now()}`,
      title: data.title,
      description: data.description,
      order_index: structure.modules.length + 1,
      is_published: false,
      chapters: [],
      estimated_duration: 0,
    }

    onUpdate({
      ...structure,
      modules: [...structure.modules, newModule]
    })

    moduleForm.reset()
    setCreateModuleOpen(false)
    toast.success('Module created successfully')
  }

  const createChapter = (data: z.infer<typeof chapterSchema>) => {
    const moduleIndex = structure.modules.findIndex(m => m.id === selectedModuleId)
    if (moduleIndex === -1) return

    const newChapter: CourseChapter = {
      id: `chapter-${Date.now()}`,
      title: data.title,
      description: data.description,
      order_index: structure.modules[moduleIndex].chapters.length + 1,
      is_published: false,
      classes: [],
      estimated_duration: 0,
    }

    const newModules = [...structure.modules]
    newModules[moduleIndex] = {
      ...newModules[moduleIndex],
      chapters: [...newModules[moduleIndex].chapters, newChapter]
    }

    onUpdate({
      ...structure,
      modules: newModules
    })

    chapterForm.reset()
    setCreateChapterOpen(false)
    setSelectedModuleId('')
    toast.success('Chapter created successfully')
  }

  const createClass = (data: z.infer<typeof classSchema>) => {
    const moduleIndex = structure.modules.findIndex(m => 
      m.chapters.some(c => c.id === selectedChapterId)
    )
    const chapterIndex = structure.modules[moduleIndex]?.chapters.findIndex(c => c.id === selectedChapterId)
    
    if (moduleIndex === -1 || chapterIndex === -1) return

    const newClass: CourseClass = {
      id: `class-${Date.now()}`,
      title: data.title,
      description: data.description,
      content_type: data.content_type,
      duration_minutes: data.duration_minutes,
      is_preview: data.is_preview,
      is_required: data.is_required,
      order_index: structure.modules[moduleIndex].chapters[chapterIndex].classes.length + 1,
      content_url: data.content_url,
      is_published: false,
    }

    const newModules = [...structure.modules]
    newModules[moduleIndex].chapters[chapterIndex] = {
      ...newModules[moduleIndex].chapters[chapterIndex],
      classes: [...newModules[moduleIndex].chapters[chapterIndex].classes, newClass]
    }

    onUpdate({
      ...structure,
      modules: newModules
    })

    classForm.reset()
    setCreateClassOpen(false)
    setSelectedChapterId('')
    toast.success('Class created successfully')
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="space-y-6">
      {/* Course Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Move3D className="h-5 w-5" />
            Course Structure Overview
          </CardTitle>
          <CardDescription>
            Organize your course content into modules, chapters, and classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{structure.modules.length}</div>
              <div className="text-sm text-muted-foreground">Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {structure.modules.reduce((acc, m) => acc + m.chapters.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Chapters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{structure.total_classes}</div>
              <div className="text-sm text-muted-foreground">Classes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatDuration(structure.total_duration)}</div>
              <div className="text-sm text-muted-foreground">Total Duration</div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-sm font-medium">Course Completion Status</div>
              <Progress value={structure.completion_rate} className="w-48" />
              <div className="text-xs text-muted-foreground">{structure.completion_rate}% Complete</div>
            </div>
            
            <Button onClick={() => setCreateModuleOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Course Structure */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="modules" type="modules">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
              {structure.modules.map((module, moduleIndex) => (
                <Draggable key={module.id} draggableId={module.id} index={moduleIndex}>
                  {(provided, snapshot) => (
                    <Card 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div {...provided.dragHandleProps} className="cursor-grab">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          
                          <Collapsible
                            open={expandedModules.has(module.id)}
                            onOpenChange={() => toggleModuleExpansion(module.id)}
                            className="flex-1"
                          >
                            <CollapsibleTrigger className="flex items-center gap-2 w-full text-left">
                              {expandedModules.has(module.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{module.title}</h3>
                                  <Badge variant={module.is_published ? 'default' : 'secondary'}>
                                    {module.is_published ? 'Published' : 'Draft'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{module.description}</p>
                              </div>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                              <div className="mt-4">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="text-sm text-muted-foreground">
                                    {module.chapters.length} chapters • {formatDuration(module.estimated_duration)}
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedModuleId(module.id)
                                      setCreateChapterOpen(true)
                                    }}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Chapter
                                  </Button>
                                </div>

                                <Droppable droppableId={`chapters-${module.id}`} type="chapters">
                                  {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                                      {module.chapters.map((chapter, chapterIndex) => (
                                        <Draggable key={chapter.id} draggableId={chapter.id} index={chapterIndex}>
                                          {(provided, snapshot) => (
                                            <Card 
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              className={`ml-6 ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                                            >
                                              <CardContent className="p-4">
                                                <div className="flex items-center gap-3">
                                                  <div {...provided.dragHandleProps} className="cursor-grab">
                                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                  </div>
                                                  
                                                  <Collapsible
                                                    open={expandedChapters.has(chapter.id)}
                                                    onOpenChange={() => toggleChapterExpansion(chapter.id)}
                                                    className="flex-1"
                                                  >
                                                    <CollapsibleTrigger className="flex items-center gap-2 w-full text-left">
                                                      {expandedChapters.has(chapter.id) ? (
                                                        <ChevronDown className="h-3 w-3" />
                                                      ) : (
                                                        <ChevronRight className="h-3 w-3" />
                                                      )}
                                                      <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                          <h4 className="font-medium">{chapter.title}</h4>
                                                          <Badge variant={chapter.is_published ? 'default' : 'secondary'} className="text-xs">
                                                            {chapter.is_published ? 'Published' : 'Draft'}
                                                          </Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{chapter.description}</p>
                                                      </div>
                                                    </CollapsibleTrigger>

                                                    <CollapsibleContent>
                                                      <div className="mt-3">
                                                        <div className="flex items-center justify-between mb-3">
                                                          <div className="text-xs text-muted-foreground">
                                                            {chapter.classes.length} classes • {formatDuration(chapter.estimated_duration)}
                                                          </div>
                                                          <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                              setSelectedChapterId(chapter.id)
                                                              setCreateClassOpen(true)
                                                            }}
                                                          >
                                                            <Plus className="h-3 w-3 mr-1" />
                                                            Add Class
                                                          </Button>
                                                        </div>

                                                        <Droppable droppableId={`classes-${chapter.id}`} type="classes">
                                                          {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                                                              {chapter.classes.map((classItem, classIndex) => {
                                                                const ContentIcon = contentTypeIcons[classItem.content_type]
                                                                
                                                                return (
                                                                  <Draggable key={classItem.id} draggableId={classItem.id} index={classIndex}>
                                                                    {(provided, snapshot) => (
                                                                      <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        className={`flex items-center gap-2 p-2 border rounded ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                                                                      >
                                                                        <div {...provided.dragHandleProps} className="cursor-grab">
                                                                          <GripVertical className="h-3 w-3 text-muted-foreground" />
                                                                        </div>
                                                                        
                                                                        <ContentIcon className="h-4 w-4 text-muted-foreground" />
                                                                        
                                                                        <div className="flex-1">
                                                                          <div className="flex items-center gap-2">
                                                                            <span className="text-sm font-medium">{classItem.title}</span>
                                                                            {classItem.is_preview && (
                                                                              <Badge variant="outline" className="text-xs">Preview</Badge>
                                                                            )}
                                                                            {!classItem.is_required && (
                                                                              <Badge variant="secondary" className="text-xs">Optional</Badge>
                                                                            )}
                                                                            {classItem.is_published ? (
                                                                              <Eye className="h-3 w-3 text-green-600" />
                                                                            ) : (
                                                                              <EyeOff className="h-3 w-3 text-muted-foreground" />
                                                                            )}
                                                                          </div>
                                                                          <p className="text-xs text-muted-foreground">
                                                                            {contentTypeLabels[classItem.content_type]} • {formatDuration(classItem.duration_minutes)}
                                                                          </p>
                                                                        </div>
                                                                        
                                                                        <Button variant="ghost" size="sm">
                                                                          <MoreHorizontal className="h-3 w-3" />
                                                                        </Button>
                                                                      </div>
                                                                    )}
                                                                  </Draggable>
                                                                )
                                                              })}
                                                              {provided.placeholder}
                                                            </div>
                                                          )}
                                                        </Droppable>
                                                      </div>
                                                    </CollapsibleContent>
                                                  </Collapsible>
                                                </div>
                                              </CardContent>
                                            </Card>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>

                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Create Module Dialog */}
      <Dialog open={createModuleOpen} onOpenChange={setCreateModuleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Module</DialogTitle>
            <DialogDescription>
              Modules are the main sections of your course. Each module can contain multiple chapters.
            </DialogDescription>
          </DialogHeader>
          <Form {...moduleForm}>
            <form onSubmit={moduleForm.handleSubmit(createModule)} className="space-y-4">
              <FormField
                control={moduleForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Introduction to Python" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={moduleForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what students will learn in this module..."
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateModuleOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Module</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Create Chapter Dialog */}
      <Dialog open={createChapterOpen} onOpenChange={setCreateChapterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Chapter</DialogTitle>
            <DialogDescription>
              Chapters break down modules into smaller, focused sections of learning.
            </DialogDescription>
          </DialogHeader>
          <Form {...chapterForm}>
            <form onSubmit={chapterForm.handleSubmit(createChapter)} className="space-y-4">
              <FormField
                control={chapterForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Variables and Data Types" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={chapterForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the topics covered in this chapter..."
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateChapterOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Chapter</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Create Class Dialog */}
      <Dialog open={createClassOpen} onOpenChange={setCreateClassOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
            <DialogDescription>
              Classes are individual lessons or activities within a chapter.
            </DialogDescription>
          </DialogHeader>
          <Form {...classForm}>
            <form onSubmit={classForm.handleSubmit(createClass)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={classForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Class Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Creating Your First Variable" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={classForm.control}
                  name="content_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(contentTypeLabels).map(([value, label]) => {
                            const Icon = contentTypeIcons[value as keyof typeof contentTypeIcons]
                            return (
                              <SelectItem key={value} value={value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {label}
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={classForm.control}
                  name="duration_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          placeholder="10"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={classForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what students will learn in this class..."
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={classForm.control}
                  name="content_url"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Content URL (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/video.mp4"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Link to the main content (video, document, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={classForm.control}
                  name="is_preview"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Preview Class</FormLabel>
                        <FormDescription>
                          Allow non-enrolled students to view this class
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={classForm.control}
                  name="is_required"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Required Class</FormLabel>
                        <FormDescription>
                          Students must complete this class to progress
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateClassOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Class</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
