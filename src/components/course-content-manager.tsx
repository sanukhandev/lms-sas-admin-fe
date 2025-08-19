import { useState } from 'react'
import {
  BookOpen,
  Plus,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  FileText,
  Edit,
  Trash2,
  GripVertical,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface CourseClass {
  id: string
  title: string
  description: string
  type: 'video' | 'text' | 'quiz' | 'assignment'
  duration: number // in minutes
  order: number
  isPublished: boolean
}

interface CourseChapter {
  id: string
  title: string
  description: string
  order: number
  isPublished: boolean
  classes: CourseClass[]
}

interface CourseModule {
  id: string
  title: string
  description: string
  order: number
  isPublished: boolean
  chapters: CourseChapter[]
}

interface CourseContentManagerProps {
  courseId: string
  onContentUpdate?: () => void
}

export function CourseContentManager({
  courseId: _courseId,
  onContentUpdate,
}: CourseContentManagerProps) {
  const [modules, setModules] = useState<CourseModule[]>([
    {
      id: '1',
      title: 'Introduction to the Course',
      description: "Welcome and overview of what you'll learn",
      order: 1,
      isPublished: true,
      chapters: [
        {
          id: '1',
          title: 'Course Overview',
          description: "What you'll learn in this course",
          order: 1,
          isPublished: true,
          classes: [
            {
              id: '1',
              title: 'Welcome Video',
              description: 'Introduction and welcome to the course',
              type: 'video',
              duration: 5,
              order: 1,
              isPublished: true,
            },
            {
              id: '2',
              title: 'Course Outline',
              description: 'Detailed breakdown of course content',
              type: 'text',
              duration: 10,
              order: 2,
              isPublished: true,
            },
          ],
        },
      ],
    },
  ])

  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(['1'])
  )
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(['1'])
  )

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters)
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId)
    } else {
      newExpanded.add(chapterId)
    }
    setExpandedChapters(newExpanded)
  }

  const getClassIcon = (type: CourseClass['type']) => {
    switch (type) {
      case 'video':
        return <PlayCircle className='h-4 w-4' />
      case 'text':
        return <FileText className='h-4 w-4' />
      case 'quiz':
        return <BookOpen className='h-4 w-4' />
      case 'assignment':
        return <Edit className='h-4 w-4' />
      default:
        return <FileText className='h-4 w-4' />
    }
  }

  const getTypeColor = (type: CourseClass['type']) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'text':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'quiz':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'assignment':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const AddModuleDialog = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [open, setOpen] = useState(false)

    const handleAdd = () => {
      const newModule: CourseModule = {
        id: Date.now().toString(),
        title,
        description,
        order: modules.length + 1,
        isPublished: false,
        chapters: [],
      }
      setModules([...modules, newModule])
      setTitle('')
      setDescription('')
      setOpen(false)
      onContentUpdate?.()
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Add Module
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Module</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='module-title'>Module Title</Label>
              <Input
                id='module-title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter module title'
              />
            </div>
            <div>
              <Label htmlFor='module-description'>Description</Label>
              <Textarea
                id='module-description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter module description'
                rows={3}
              />
            </div>
            <Button onClick={handleAdd} disabled={!title.trim()}>
              Add Module
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const AddChapterDialog = ({ moduleId }: { moduleId: string }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [open, setOpen] = useState(false)

    const handleAdd = () => {
      const module = modules.find((m) => m.id === moduleId)
      if (!module) return

      const newChapter: CourseChapter = {
        id: Date.now().toString(),
        title,
        description,
        order: module.chapters.length + 1,
        isPublished: false,
        classes: [],
      }

      setModules(
        modules.map((m) =>
          m.id === moduleId
            ? { ...m, chapters: [...m.chapters, newChapter] }
            : m
        )
      )
      setTitle('')
      setDescription('')
      setOpen(false)
      onContentUpdate?.()
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' size='sm'>
            <Plus className='mr-1 h-3 w-3' />
            Chapter
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Chapter</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='chapter-title'>Chapter Title</Label>
              <Input
                id='chapter-title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter chapter title'
              />
            </div>
            <div>
              <Label htmlFor='chapter-description'>Description</Label>
              <Textarea
                id='chapter-description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter chapter description'
                rows={3}
              />
            </div>
            <Button onClick={handleAdd} disabled={!title.trim()}>
              Add Chapter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const AddClassDialog = ({
    moduleId,
    chapterId,
  }: {
    moduleId: string
    chapterId: string
  }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState<CourseClass['type']>('video')
    const [duration, setDuration] = useState(5)
    const [open, setOpen] = useState(false)

    const handleAdd = () => {
      const module = modules.find((m) => m.id === moduleId)
      const chapter = module?.chapters.find((c) => c.id === chapterId)
      if (!module || !chapter) return

      const newClass: CourseClass = {
        id: Date.now().toString(),
        title,
        description,
        type,
        duration,
        order: chapter.classes.length + 1,
        isPublished: false,
      }

      setModules(
        modules.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                chapters: m.chapters.map((c) =>
                  c.id === chapterId
                    ? { ...c, classes: [...c.classes, newClass] }
                    : c
                ),
              }
            : m
        )
      )
      setTitle('')
      setDescription('')
      setType('video')
      setDuration(5)
      setOpen(false)
      onContentUpdate?.()
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' size='sm'>
            <Plus className='mr-1 h-3 w-3' />
            Class
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='class-title'>Class Title</Label>
              <Input
                id='class-title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter class title'
              />
            </div>
            <div>
              <Label htmlFor='class-description'>Description</Label>
              <Textarea
                id='class-description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter class description'
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor='class-type'>Type</Label>
              <select
                id='class-type'
                value={type}
                onChange={(e) => setType(e.target.value as CourseClass['type'])}
                className='w-full rounded-md border p-2'
              >
                <option value='video'>Video</option>
                <option value='text'>Text/Reading</option>
                <option value='quiz'>Quiz</option>
                <option value='assignment'>Assignment</option>
              </select>
            </div>
            <div>
              <Label htmlFor='class-duration'>Duration (minutes)</Label>
              <Input
                id='class-duration'
                type='number'
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 5)}
                placeholder='Duration in minutes'
                min='1'
              />
            </div>
            <Button onClick={handleAdd} disabled={!title.trim()}>
              Add Class
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Course Content Structure</h3>
          <p className='text-muted-foreground text-sm'>
            Organize your course into modules, chapters, and classes
          </p>
        </div>
        <AddModuleDialog />
      </div>

      <div className='space-y-4'>
        {modules.map((module) => (
          <Card key={module.id} className='border'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => toggleModule(module.id)}
                    className='h-auto p-0'
                  >
                    {expandedModules.has(module.id) ? (
                      <ChevronDown className='h-4 w-4' />
                    ) : (
                      <ChevronRight className='h-4 w-4' />
                    )}
                  </Button>
                  <GripVertical className='text-muted-foreground h-4 w-4' />
                  <div>
                    <CardTitle className='text-base'>{module.title}</CardTitle>
                    <p className='text-muted-foreground text-sm'>
                      {module.description}
                    </p>
                  </div>
                  <Badge variant={module.isPublished ? 'default' : 'secondary'}>
                    {module.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <div className='flex items-center space-x-2'>
                  <AddChapterDialog moduleId={module.id} />
                  <Button variant='ghost' size='sm'>
                    <Edit className='h-3 w-3' />
                  </Button>
                  <Button variant='ghost' size='sm'>
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {expandedModules.has(module.id) && (
              <CardContent className='pt-0'>
                <div className='ml-6 space-y-3'>
                  {module.chapters.map((chapter) => (
                    <Card
                      key={chapter.id}
                      className='border-l-4 border-l-blue-500'
                    >
                      <CardHeader className='pb-2'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => toggleChapter(chapter.id)}
                              className='h-auto p-0'
                            >
                              {expandedChapters.has(chapter.id) ? (
                                <ChevronDown className='h-3 w-3' />
                              ) : (
                                <ChevronRight className='h-3 w-3' />
                              )}
                            </Button>
                            <GripVertical className='text-muted-foreground h-3 w-3' />
                            <div>
                              <h4 className='text-sm font-medium'>
                                {chapter.title}
                              </h4>
                              <p className='text-muted-foreground text-xs'>
                                {chapter.description}
                              </p>
                            </div>
                            <Badge
                              variant={
                                chapter.isPublished ? 'default' : 'secondary'
                              }
                              className='text-xs'
                            >
                              {chapter.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <div className='flex items-center space-x-1'>
                            <AddClassDialog
                              moduleId={module.id}
                              chapterId={chapter.id}
                            />
                            <Button variant='ghost' size='sm'>
                              <Edit className='h-3 w-3' />
                            </Button>
                            <Button variant='ghost' size='sm'>
                              <Trash2 className='h-3 w-3' />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {expandedChapters.has(chapter.id) && (
                        <CardContent className='pt-0'>
                          <div className='ml-4 space-y-2'>
                            {chapter.classes.map((courseClass) => (
                              <div
                                key={courseClass.id}
                                className='bg-card hover:bg-accent/50 flex items-center justify-between rounded border p-2 transition-colors'
                              >
                                <div className='flex items-center space-x-2'>
                                  <GripVertical className='text-muted-foreground h-3 w-3' />
                                  <div className='flex items-center space-x-2'>
                                    {getClassIcon(courseClass.type)}
                                    <span className='text-sm font-medium'>
                                      {courseClass.title}
                                    </span>
                                  </div>
                                  <Badge
                                    variant='outline'
                                    className={cn(
                                      'text-xs',
                                      getTypeColor(courseClass.type)
                                    )}
                                  >
                                    {courseClass.type}
                                  </Badge>
                                  <div className='text-muted-foreground flex items-center space-x-1 text-xs'>
                                    <Clock className='h-3 w-3' />
                                    <span>{courseClass.duration}m</span>
                                  </div>
                                  <Badge
                                    variant={
                                      courseClass.isPublished
                                        ? 'default'
                                        : 'secondary'
                                    }
                                    className='text-xs'
                                  >
                                    {courseClass.isPublished
                                      ? 'Published'
                                      : 'Draft'}
                                  </Badge>
                                </div>
                                <div className='flex items-center space-x-1'>
                                  <Button variant='ghost' size='sm'>
                                    <Edit className='h-3 w-3' />
                                  </Button>
                                  <Button variant='ghost' size='sm'>
                                    <Trash2 className='h-3 w-3' />
                                  </Button>
                                </div>
                              </div>
                            ))}
                            {chapter.classes.length === 0 && (
                              <div className='text-muted-foreground py-4 text-center text-sm'>
                                No classes yet. Add your first class above.
                              </div>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                  {module.chapters.length === 0 && (
                    <div className='text-muted-foreground py-4 text-center text-sm'>
                      No chapters yet. Add your first chapter above.
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        {modules.length === 0 && (
          <Card>
            <CardContent className='py-8 text-center'>
              <BookOpen className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
              <h3 className='mb-2 text-lg font-semibold'>No Modules Yet</h3>
              <p className='text-muted-foreground mb-4'>
                Start building your course by adding your first module
              </p>
              <AddModuleDialog />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
