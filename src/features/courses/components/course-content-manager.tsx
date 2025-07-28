import { useState, useEffect } from 'react'
import { coursesService, type CourseStructure, type Module, type Chapter } from '@/services/courses'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Plus, 
  BookOpen, 
  FileText, 
  Calendar,
  Clock, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  GripVertical,
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { toast } from 'sonner'
import { CreateModuleDialog } from './create-module-dialog'
import { CreateChapterDialog } from './create-chapter-dialog'
import { EditModuleDialog } from './edit-module-dialog'
import { EditChapterDialog } from './edit-chapter-dialog'

interface CourseContentManagerProps {
  courseId: string
}

export function CourseContentManager({ courseId }: CourseContentManagerProps) {
  const [structure, setStructure] = useState<CourseStructure | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  
  // Dialog states
  const [showCreateModule, setShowCreateModule] = useState(false)
  const [showCreateChapter, setShowCreateChapter] = useState(false)
  const [selectedModuleForChapter, setSelectedModuleForChapter] = useState<string | null>(null)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)

  useEffect(() => {
    loadCourseStructure()
  }, [courseId])

  const loadCourseStructure = async () => {
    try {
      setLoading(true)
      const response = await coursesService.getCourseStructure(courseId)
      setStructure(response.data)
      
      // Expand all modules by default
      const moduleIds = new Set(response.data.modules.map(m => m.id))
      setExpandedModules(moduleIds)
    } catch (error) {
      console.error('Error loading course structure:', error)
      toast.error('Failed to load course content')
    } finally {
      setLoading(false)
    }
  }

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const handleCreateModule = () => {
    setShowCreateModule(true)
  }

  const handleCreateChapter = (moduleId: string) => {
    setSelectedModuleForChapter(moduleId)
    setShowCreateChapter(true)
  }

  const handleEditModule = (module: Module) => {
    setEditingModule(module)
  }

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter)
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module and all its chapters?')) {
      return
    }

    try {
      await coursesService.deleteModule(courseId, moduleId)
      toast.success('Module deleted successfully')
      loadCourseStructure()
    } catch (error) {
      console.error('Error deleting module:', error)
      toast.error('Failed to delete module')
    }
  }

  const handleDeleteChapter = async (moduleId: string, chapterId: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) {
      return
    }

    try {
      await coursesService.deleteChapter(courseId, moduleId, chapterId)
      toast.success('Chapter deleted successfully')
      loadCourseStructure()
    } catch (error) {
      console.error('Error deleting chapter:', error)
      toast.error('Failed to delete chapter')
    }
  }

  const handleScheduleClass = (contentId: string, contentType: 'module' | 'chapter') => {
    // This will be implemented when we create the class scheduler
    toast.info(`Schedule class for ${contentType}: ${contentId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading course content...</p>
        </div>
      </div>
    )
  }

  if (!structure) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">No Content Found</h3>
        <p className="text-muted-foreground">Failed to load course content structure.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                Manage modules and chapters for your course
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {structure.modules.length} modules
              </Badge>
              <Badge variant="outline">
                {structure.total_chapters} chapters
              </Badge>
              <Badge variant="outline">
                {structure.total_duration}h total
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Organize your course content into modules and chapters
            </p>
            <Button onClick={handleCreateModule}>
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Structure */}
      <div className="space-y-4">
        {structure.modules.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No Modules Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by creating your first module to organize your course content.
                </p>
                <Button onClick={handleCreateModule}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Module
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          structure.modules.map((module) => (
            <Card key={module.id}>
              <Collapsible
                open={expandedModules.has(module.id)}
                onOpenChange={() => toggleModule(module.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {expandedModules.has(module.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          {module.description && (
                            <CardDescription className="mt-1">
                              {module.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {module.chapters_count} chapters
                        </Badge>
                        {module.duration_hours && (
                          <Badge variant="outline">
                            <Clock className="mr-1 h-3 w-3" />
                            {module.duration_hours}h
                          </Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleCreateChapter(module.id)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Chapter
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleScheduleClass(module.id, 'module')}>
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule Class
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditModule(module)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Module
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteModule(module.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Module
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {module.chapters.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                        <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-3">
                          No chapters in this module yet
                        </p>
                        <Button size="sm" onClick={() => handleCreateChapter(module.id)}>
                          <Plus className="mr-2 h-3 w-3" />
                          Add First Chapter
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {module.chapters.map((chapter) => (
                          <div
                            key={chapter.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <h4 className="font-medium">{chapter.title}</h4>
                                {chapter.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {chapter.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {chapter.duration_minutes && (
                                <Badge variant="outline" className="text-xs">
                                  {chapter.duration_minutes}min
                                </Badge>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleScheduleClass(chapter.id, 'chapter')}>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Schedule Class
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleEditChapter(chapter)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Chapter
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteChapter(module.id, chapter.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Chapter
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </div>

      {/* Dialogs */}
      <CreateModuleDialog
        open={showCreateModule}
        onOpenChange={setShowCreateModule}
        courseId={courseId}
        onSuccess={loadCourseStructure}
      />

      <CreateChapterDialog
        open={showCreateChapter}
        onOpenChange={setShowCreateChapter}
        courseId={courseId}
        moduleId={selectedModuleForChapter}
        onSuccess={loadCourseStructure}
      />

      {editingModule && (
        <EditModuleDialog
          open={!!editingModule}
          onOpenChange={(open) => !open && setEditingModule(null)}
          courseId={courseId}
          module={editingModule}
          onSuccess={loadCourseStructure}
        />
      )}

      {editingChapter && (
        <EditChapterDialog
          open={!!editingChapter}
          onOpenChange={(open) => !open && setEditingChapter(null)}
          courseId={courseId}
          chapter={editingChapter}
          onSuccess={loadCourseStructure}
        />
      )}
    </div>
  )
}
