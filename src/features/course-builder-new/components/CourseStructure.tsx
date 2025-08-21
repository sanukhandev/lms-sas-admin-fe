import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { toast } from 'sonner';
import { useCourseBuilder, CourseContent } from '../context/CourseBuilderContext';
import {
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit,
  Plus,
  GripVertical,
  Video,
  FileText,
  BookOpen,
  Layers
} from 'lucide-react';

interface CourseStructureProps {
  onComplete: () => void;
}

export function CourseStructure({ onComplete }: CourseStructureProps) {
  const {
    courseId,
    structure,
    loadStructure,
    addContent,
    updateContent,
    deleteContent,
    reorderContent,
    loading
  } = useCourseBuilder();

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [activeContentId, setActiveContentId] = useState<string | null>(null);
  const [contentBeingEdited, setContentBeingEdited] = useState<CourseContent | null>(null);
  
  // Form state for new or edited content
  const [contentForm, setContentForm] = useState({
    title: '',
    description: '',
    content: '',
    video_url: '',
    content_type: 'module',
    duration_minutes: 0,
    learning_objectives: ['']
  });
  
  // Load initial structure
  useEffect(() => {
    if (courseId) {
      loadStructure();
    }
  }, [courseId]);

  // When selecting content to edit, populate the form
  useEffect(() => {
    if (contentBeingEdited) {
      setContentForm({
        title: contentBeingEdited.title || '',
        description: contentBeingEdited.description || '',
        content: contentBeingEdited.content || '',
        video_url: contentBeingEdited.video_url || '',
        content_type: contentBeingEdited.content_type,
        duration_minutes: contentBeingEdited.duration_minutes || 0,
        learning_objectives: contentBeingEdited.learning_objectives || ['']
      });
    } else {
      // Reset form when not editing
      setContentForm({
        title: '',
        description: '',
        content: '',
        video_url: '',
        content_type: 'module',
        duration_minutes: 0,
        learning_objectives: ['']
      });
    }
  }, [contentBeingEdited]);

  // Toggle module expansion
  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Handler for adding new module
  const handleAddModule = async () => {
    if (!contentForm.title) {
      toast.error('Module title is required');
      return;
    }

    const newModule = {
      title: contentForm.title,
      description: contentForm.description,
      content_type: 'module' as const,
      position: structure?.modules.length || 0
    };

    const success = await addContent(newModule);
    if (success) {
      setContentForm({
        title: '',
        description: '',
        content: '',
        video_url: '',
        content_type: 'module',
        duration_minutes: 0,
        learning_objectives: ['']
      });
    }
  };

  // Handler for adding new chapter
  const handleAddChapter = async (moduleId: string) => {
    if (!contentForm.title) {
      toast.error('Chapter title is required');
      return;
    }

    const newChapter = {
      title: contentForm.title,
      description: contentForm.description,
      content: contentForm.content,
      video_url: contentForm.video_url,
      content_type: 'chapter',
      duration_minutes: contentForm.duration_minutes,
      learning_objectives: contentForm.learning_objectives.filter(obj => obj.trim() !== ''),
      position: structure?.modules.find(m => m.id === moduleId)?.children?.length || 0
    };

    const success = await addContent(newChapter, moduleId);
    if (success) {
      setContentForm({
        title: '',
        description: '',
        content: '',
        video_url: '',
        content_type: 'module',
        duration_minutes: 0,
        learning_objectives: ['']
      });
      setActiveContentId(null);
    }
  };

  // Handler for updating content
  const handleUpdateContent = async () => {
    if (!contentBeingEdited || !contentForm.title) {
      toast.error('Title is required');
      return;
    }

    const updatedContent = {
      title: contentForm.title,
      description: contentForm.description,
      content: contentForm.content,
      video_url: contentForm.video_url,
      content_type: contentBeingEdited.content_type,
      duration_minutes: contentForm.duration_minutes,
      learning_objectives: contentForm.learning_objectives.filter(obj => obj.trim() !== '')
    };

    const success = await updateContent(contentBeingEdited.id, updatedContent);
    if (success) {
      setContentBeingEdited(null);
    }
  };

  // Handler for deleting content
  const handleDeleteContent = async (id: string, contentType: string) => {
    if (confirm(`Are you sure you want to delete this ${contentType}? This action cannot be undone.`)) {
      const success = await deleteContent(id);
      if (success && id === activeContentId) {
        setActiveContentId(null);
      }
    }
  };

  // Handle drag and drop reordering
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    
    // If dropped outside a droppable area or no change in position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    if (type === 'module') {
      // Reordering modules
      const reorderedItems = Array.from(structure?.modules || []);
      const [removed] = reorderedItems.splice(source.index, 1);
      reorderedItems.splice(destination.index, 0, removed);
      
      const updatedItems = reorderedItems.map((item, index) => ({
        id: item.id,
        position: index,
        parent_id: courseId as string
      }));
      
      await reorderContent(updatedItems);
      
    } else if (type === 'chapter') {
      // Reordering chapters within a module or moving between modules
      const sourceModuleId = source.droppableId;
      const destModuleId = destination.droppableId;
      
      // Find source and destination modules
      const sourceModule = structure?.modules.find(m => m.id === sourceModuleId);
      const destModule = structure?.modules.find(m => m.id === destModuleId);
      
      if (!sourceModule || !destModule) return;
      
      // Get chapters from source and destination modules
      const sourceChapters = Array.from(sourceModule.children || []);
      const destChapters = sourceModuleId === destModuleId 
        ? sourceChapters 
        : Array.from(destModule.children || []);
      
      // Remove chapter from source
      const [removed] = sourceChapters.splice(source.index, 1);
      
      // Add chapter to destination
      if (sourceModuleId === destModuleId) {
        // Moving within the same module
        sourceChapters.splice(destination.index, 0, removed);
        
        // Create reorder items
        const updatedItems = sourceChapters.map((item, index) => ({
          id: item.id,
          position: index,
          parent_id: sourceModuleId
        }));
        
        await reorderContent(updatedItems);
      } else {
        // Moving between modules
        destChapters.splice(destination.index, 0, removed);
        
        // Create reorder items for both modules
        const updatedSourceItems = sourceChapters.map((item, index) => ({
          id: item.id,
          position: index,
          parent_id: sourceModuleId
        }));
        
        const updatedDestItems = destChapters.map((item, index) => ({
          id: item.id,
          position: index,
          parent_id: destModuleId
        }));
        
        await reorderContent([...updatedSourceItems, ...updatedDestItems]);
      }
    }
  };

  // Update learning objectives array
  const updateLearningObjective = (index: number, value: string) => {
    const newObjectives = [...contentForm.learning_objectives];
    newObjectives[index] = value;
    setContentForm({
      ...contentForm,
      learning_objectives: newObjectives
    });
  };

  // Add a new learning objective
  const addLearningObjective = () => {
    setContentForm({
      ...contentForm,
      learning_objectives: [...contentForm.learning_objectives, '']
    });
  };

  // Remove a learning objective
  const removeLearningObjective = (index: number) => {
    const newObjectives = [...contentForm.learning_objectives];
    newObjectives.splice(index, 1);
    setContentForm({
      ...contentForm,
      learning_objectives: newObjectives.length ? newObjectives : ['']
    });
  };

  // Validate if ready to proceed to next step
  const isReadyToProceed = () => {
    if (!structure) return false;
    if (structure.modules.length === 0) return false;
    return structure.modules.every(module => module.children && module.children.length > 0);
  };

  // Continue to next step
  const handleContinue = () => {
    if (isReadyToProceed()) {
      onComplete();
    } else {
      toast.error('Each module must have at least one chapter before continuing');
    }
  };

  // If still loading initial data
  if (!courseId || !structure) {
    return (
      <div className="space-y-4 p-6 bg-white rounded-md shadow-sm">
        <h2 className="text-xl font-semibold">Course Structure</h2>
        {!courseId ? (
          <Alert>
            <AlertDescription>
              Please save the course details before building the structure.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex items-center justify-center h-40">
            <p>Loading course structure...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold">Course Structure</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left panel: Tree structure */}
        <div className="md:col-span-2 border rounded-md p-4">
          <h3 className="font-medium mb-4">Content Structure</h3>
          
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="modules" type="module">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {structure.modules.map((module, moduleIndex) => (
                    <Draggable 
                      key={module.id} 
                      draggableId={module.id} 
                      index={moduleIndex}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Card className="mb-2">
                            <CardHeader className="py-2 px-3 flex flex-row items-center">
                              <div 
                                {...provided.dragHandleProps}
                                className="mr-2 cursor-move"
                              >
                                <GripVertical size={16} />
                              </div>
                              <div 
                                className="flex items-center flex-1 cursor-pointer"
                                onClick={() => toggleModuleExpand(module.id)}
                              >
                                {expandedModules[module.id] ? 
                                  <ChevronDown size={18} /> : 
                                  <ChevronRight size={18} />
                                }
                                <Layers className="mx-2" size={16} />
                                <CardTitle className="text-sm font-medium">
                                  {module.title}
                                </CardTitle>
                              </div>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => setContentBeingEdited(module)}
                                >
                                  <Edit size={14} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteContent(module.id, 'module')}
                                >
                                  <Trash2 size={14} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setActiveContentId(module.id);
                                    setContentForm({
                                      ...contentForm,
                                      content_type: 'chapter',
                                      title: '',
                                      description: ''
                                    });
                                  }}
                                >
                                  <Plus size={14} />
                                </Button>
                              </div>
                            </CardHeader>
                            
                            {expandedModules[module.id] && (
                              <CardContent className="py-2 px-4">
                                <Droppable 
                                  droppableId={module.id} 
                                  type="chapter"
                                >
                                  {(provided) => (
                                    <div 
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className="pl-6 space-y-1"
                                    >
                                      {module.children && module.children.length > 0 ? (
                                        module.children.map((chapter, chapterIndex) => (
                                          <Draggable
                                            key={chapter.id}
                                            draggableId={chapter.id}
                                            index={chapterIndex}
                                          >
                                            {(provided) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-50"
                                              >
                                                <div className="flex items-center">
                                                  <div 
                                                    {...provided.dragHandleProps}
                                                    className="mr-2 cursor-move"
                                                  >
                                                    <GripVertical size={14} />
                                                  </div>
                                                  {chapter.video_url ? (
                                                    <Video size={14} className="mr-2" />
                                                  ) : (
                                                    <FileText size={14} className="mr-2" />
                                                  )}
                                                  <span className="text-sm truncate max-w-[150px]">
                                                    {chapter.title}
                                                  </span>
                                                </div>
                                                <div className="flex space-x-1">
                                                  <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => setContentBeingEdited(chapter)}
                                                  >
                                                    <Edit size={12} />
                                                  </Button>
                                                  <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => handleDeleteContent(chapter.id, 'chapter')}
                                                  >
                                                    <Trash2 size={12} />
                                                  </Button>
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))
                                      ) : (
                                        <div className="text-sm text-gray-500 py-1">
                                          No chapters yet. Add one to get started.
                                        </div>
                                      )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </CardContent>
                            )}
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          {/* Add new module form */}
          {!contentBeingEdited && !activeContentId && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Add New Module</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Module title"
                  value={contentForm.title}
                  onChange={e => setContentForm({...contentForm, title: e.target.value})}
                  className="flex-1"
                />
                <Button onClick={handleAddModule} disabled={loading}>
                  Add Module
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Right panel: Content editing */}
        <div className="border rounded-md p-4">
          {contentBeingEdited ? (
            // Edit existing content
            <div className="space-y-4">
              <h3 className="font-medium">
                Edit {contentBeingEdited.content_type === 'module' ? 'Module' : 'Chapter'}
              </h3>
              
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={contentForm.title}
                  onChange={e => setContentForm({...contentForm, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={contentForm.description || ''}
                  onChange={e => setContentForm({...contentForm, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              {contentBeingEdited.content_type === 'chapter' && (
                <>
                  <div>
                    <Label htmlFor="edit-video">Video URL (optional)</Label>
                    <Input
                      id="edit-video"
                      value={contentForm.video_url || ''}
                      onChange={e => setContentForm({...contentForm, video_url: e.target.value})}
                      placeholder="https://example.com/video"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-duration">Duration (minutes)</Label>
                    <Input
                      id="edit-duration"
                      type="number"
                      value={contentForm.duration_minutes || 0}
                      onChange={e => setContentForm({
                        ...contentForm, 
                        duration_minutes: parseFloat(e.target.value) || 0
                      })}
                      min="0"
                      step="0.5"
                    />
                  </div>
                  
                  <div>
                    <Label>Learning Objectives</Label>
                    {contentForm.learning_objectives.map((objective, index) => (
                      <div key={index} className="flex items-center space-x-2 mt-1">
                        <Input
                          value={objective}
                          onChange={e => updateLearningObjective(index, e.target.value)}
                          placeholder="Students will be able to..."
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLearningObjective(index)}
                          disabled={contentForm.learning_objectives.length <= 1}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addLearningObjective}
                      className="mt-2"
                    >
                      Add Objective
                    </Button>
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-content">Content</Label>
                    <Textarea
                      id="edit-content"
                      value={contentForm.content || ''}
                      onChange={e => setContentForm({...contentForm, content: e.target.value})}
                      rows={5}
                      placeholder="Chapter content or notes"
                    />
                  </div>
                </>
              )}
              
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" onClick={() => setContentBeingEdited(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateContent} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          ) : activeContentId ? (
            // Add new chapter to selected module
            <div className="space-y-4">
              <h3 className="font-medium">Add New Chapter</h3>
              
              <div>
                <Label htmlFor="new-chapter-title">Title</Label>
                <Input
                  id="new-chapter-title"
                  value={contentForm.title}
                  onChange={e => setContentForm({...contentForm, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="new-chapter-description">Description</Label>
                <Textarea
                  id="new-chapter-description"
                  value={contentForm.description || ''}
                  onChange={e => setContentForm({...contentForm, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="new-chapter-video">Video URL (optional)</Label>
                <Input
                  id="new-chapter-video"
                  value={contentForm.video_url || ''}
                  onChange={e => setContentForm({...contentForm, video_url: e.target.value})}
                  placeholder="https://example.com/video"
                />
              </div>
              
              <div>
                <Label htmlFor="new-chapter-duration">Duration (minutes)</Label>
                <Input
                  id="new-chapter-duration"
                  type="number"
                  value={contentForm.duration_minutes || 0}
                  onChange={e => setContentForm({
                    ...contentForm, 
                    duration_minutes: parseFloat(e.target.value) || 0
                  })}
                  min="0"
                  step="0.5"
                />
              </div>
              
              <div>
                <Label>Learning Objectives</Label>
                {contentForm.learning_objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-1">
                    <Input
                      value={objective}
                      onChange={e => updateLearningObjective(index, e.target.value)}
                      placeholder="Students will be able to..."
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLearningObjective(index)}
                      disabled={contentForm.learning_objectives.length <= 1}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addLearningObjective}
                  className="mt-2"
                >
                  Add Objective
                </Button>
              </div>
              
              <div>
                <Label htmlFor="new-chapter-content">Content</Label>
                <Textarea
                  id="new-chapter-content"
                  value={contentForm.content || ''}
                  onChange={e => setContentForm({...contentForm, content: e.target.value})}
                  rows={5}
                  placeholder="Chapter content or notes"
                />
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" onClick={() => setActiveContentId(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleAddChapter(activeContentId)} 
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Chapter'}
                </Button>
              </div>
            </div>
          ) : (
            // Information panel when nothing is selected
            <div className="space-y-4">
              <h3 className="font-medium">Course Structure Builder</h3>
              
              <div className="text-sm text-gray-600 space-y-2">
                <p>Create your course structure:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Add modules to organize your content</li>
                  <li>Add chapters within each module</li>
                  <li>Drag and drop to reorder content</li>
                </ol>
                <p className="mt-4">
                  <BookOpen className="inline mr-1" size={16} />
                  Total modules: {structure.modules.length}
                </p>
                <p>
                  <FileText className="inline mr-1" size={16} />
                  Total chapters: {structure.total_chapters || 0}
                </p>
                <p>
                  <Video className="inline mr-1" size={16} />
                  Total duration: {structure.total_duration || 0} hours
                </p>
              </div>
              
              <Separator />
              
              <div>
                <Button 
                  onClick={handleContinue} 
                  disabled={!isReadyToProceed()}
                  className="w-full"
                >
                  Continue to Pricing
                </Button>
                {!isReadyToProceed() && (
                  <p className="text-xs text-amber-600 mt-2">
                    Each module must have at least one chapter before continuing.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
