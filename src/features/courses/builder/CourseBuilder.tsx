import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable, DraggableProvided, DroppableProvided, DropResult } from '@hello-pangea/dnd'; // If types are missing, install @types/hello-pangea__dnd or add a custom type declaration
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Category {
  id: string;
  name: string;
}

interface Chapter {
  id: string;
  name: string;
}

interface Module {
  id: string;
  name: string;
  chapters: Chapter[];
}

export function CourseBuilder({ courseId: propCourseId }: { courseId?: string }) {
  const [tab, setTab] = useState('details');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [newModuleName, setNewModuleName] = useState('');
  const [newChapterName, setNewChapterName] = useState('');
  const [courseId, setCourseId] = useState<string | null>(propCourseId || null);
  const [pricingModel, setPricingModel] = useState('one-time');
  const [price, setPrice] = useState('');
  const [convertedPrice, setConvertedPrice] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingSaving, setPricingSaving] = useState(false);

  // Scheduling state
  const [schedule, setSchedule] = useState<{ [id: string]: string }>({});
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleSaving, setScheduleSaving] = useState(false);

  useEffect(() => {
    axios.get('/api/v1/categories?page=1&per_page=100')
      .then(res => setCategories(res.data.data || []))
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  // Load course details if editing
  useEffect(() => {
    if (propCourseId) {
      setCourseId(propCourseId);
      axios.get(`/api/v1/courses/${propCourseId}`)
        .then(res => {
          const course = res.data.data;
          setTitle(course.title || '');
          setDescription(course.description || '');
          setCategory(course.category_id || '');
          // Optionally set thumbnail, pricing, etc.
        })
        .catch(() => {});
      axios.get(`/api/v1/courses/${propCourseId}/structure`)
        .then(res => setModules(res.data.data || []))
        .catch(() => {});
      // Optionally load schedule and pricing if endpoints exist
    }
  }, [propCourseId]);

  // Fetch structure if editing existing course
  useEffect(() => {
    if (courseId) {
      axios.get(`/api/v1/courses/${courseId}/structure`)
        .then(res => setModules(res.data.data || []))
        .catch(() => {});
    }
  }, [courseId]);

  // Load schedule if editing
  useEffect(() => {
    if (courseId) {
      setScheduleLoading(true);
      axios.get(`/api/v1/courses/${courseId}/schedule`)
        .then(res => setSchedule(res.data.data.schedule || {}))
        .catch(() => toast.error('Failed to load schedule'))
        .finally(() => setScheduleLoading(false));
    }
  }, [courseId]);

  // Load pricing if editing
  useEffect(() => {
    if (courseId) {
      setPricingLoading(true);
      axios.get(`/api/v1/courses/${courseId}`)
        .then(res => {
          const course = res.data.data;
          setPrice(course.price ? String(course.price) : '');
          setPricingModel(course.pricing_model || 'one-time');
          // Optionally set currency if available
        })
        .catch(() => toast.error('Failed to load pricing'))
        .finally(() => setPricingLoading(false));
    }
  }, [courseId]);

  // Currency conversion (mock)
  useEffect(() => {
    if (price) {
      // Simulate conversion (e.g., USD to EUR)
      setConvertedPrice((parseFloat(price) * 0.92).toFixed(2));
    } else {
      setConvertedPrice('');
    }
  }, [price]);

  // Scheduling validation
  const validateSchedule = () => {
    const dates = Object.values(schedule).filter(Boolean).sort();
    for (let i = 1; i < dates.length; i++) {
      if (dates[i] <= dates[i - 1]) return false;
    }
    return true;
  };

  // Publish validation
  const canPublish = modules.length > 0 && modules.every(m => m.chapters.length > 0) && price && validateSchedule();

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (thumbnail) formData.append('thumbnail', thumbnail);
      formData.append('category_id', category);
      formData.append('status', 'draft');
      const res = await axios.post('/api/v1/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Course saved as draft!');
      setCourseId(res.data.data.id);
    } catch (e) {
      toast.error('Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  // Structure Builder logic
  const addModule = () => {
    if (!newModuleName.trim()) return;
    setModules([...modules, { id: Date.now().toString(), name: newModuleName, chapters: [] }]);
    setNewModuleName('');
  };
  const removeModule = (id: string) => setModules(modules.filter(m => m.id !== id));
  const addChapter = (moduleId: string) => {
    if (!newChapterName.trim()) return;
    setModules(modules.map(m => m.id === moduleId ? {
      ...m,
      chapters: [...m.chapters, { id: Date.now().toString(), name: newChapterName }]
    } : m));
    setNewChapterName('');
  };
  const removeChapter = (moduleId: string, chapterId: string) => setModules(modules.map(m => m.id === moduleId ? {
    ...m,
    chapters: m.chapters.filter(c => c.id !== chapterId)
  } : m));

  // Drag and drop
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.type === 'module') {
      const reordered = Array.from(modules);
      const [removed] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, removed);
      setModules(reordered);
    } else if (result.type === 'chapter') {
      const moduleIdx = modules.findIndex(m => m.id === result.source.droppableId);
      const destModuleIdx = modules.findIndex(m => m.id === result.destination!.droppableId);
      if (moduleIdx === -1 || destModuleIdx === -1) return;
      const sourceChapters = Array.from(modules[moduleIdx].chapters);
      const [removed] = sourceChapters.splice(result.source.index, 1);
      if (moduleIdx === destModuleIdx) {
        sourceChapters.splice(result.destination.index, 0, removed);
        setModules(modules.map((m, i) => i === moduleIdx ? { ...m, chapters: sourceChapters } : m));
      } else {
        const destChapters = Array.from(modules[destModuleIdx].chapters);
        destChapters.splice(result.destination.index, 0, removed);
        setModules(modules.map((m, i) => {
          if (i === moduleIdx) return { ...m, chapters: sourceChapters };
          if (i === destModuleIdx) return { ...m, chapters: destChapters };
          return m;
        }));
      }
    }
  };

  const saveStructure = async () => {
    if (!courseId) return toast.error('Save course as draft first!');
    try {
      await axios.put(`/api/v1/courses/${courseId}/structure`, { modules });
      toast.success('Structure saved!');
    } catch {
      toast.error('Failed to save structure');
    }
  };

  const saveSchedule = async () => {
    if (!courseId) return toast.error('Save course as draft first!');
    setScheduleSaving(true);
    try {
      await axios.put(`/api/v1/courses/${courseId}/schedule`, { schedule });
      toast.success('Schedule saved!');
    } catch {
      toast.error('Failed to save schedule');
    } finally {
      setScheduleSaving(false);
    }
  };

  const savePricing = async () => {
    if (!courseId) return toast.error('Save course as draft first!');
    setPricingSaving(true);
    try {
      await axios.put(`/api/v1/courses/${courseId}`, {
        price: parseFloat(price),
        pricing_model: pricingModel,
        // currency: 'USD', // add if needed
      });
      toast.success('Pricing saved!');
    } catch {
      toast.error('Failed to save pricing');
    } finally {
      setPricingSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!courseId) return toast.error('Save course as draft first!');
    if (!canPublish) return toast.error('Please complete all steps before publishing.');
    setPublishing(true);
    try {
      await axios.post(`/api/v1/courses/${courseId}/publish`);
      toast.success('Course published!');
    } catch {
      toast.error('Failed to publish course');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="details">Basic Details</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="schedule">Scheduling</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="publish">Publish</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSaveDraft(); }}>
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="thumbnail">Thumbnail</Label>
              <Input id="thumbnail" type="file" accept="image/*" onChange={e => setThumbnail(e.target.files?.[0] || null)} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save as Draft'}
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="structure">
          <div className="mb-4">
            <Label>Add Module</Label>
            <div className="flex gap-2 mb-2">
              <Input value={newModuleName} onChange={e => setNewModuleName(e.target.value)} placeholder="Module name" />
              <Button type="button" onClick={addModule}>Add</Button>
            </div>
            <Button type="button" onClick={saveStructure} variant="secondary">Save Structure</Button>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="modules" type="module">
              {(provided: DroppableProvided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {modules.map((module, mIdx) => (
                    <Draggable key={module.id} draggableId={module.id} index={mIdx}>
                      {(provided: DraggableProvided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} className="mb-4 border rounded p-3 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div {...provided.dragHandleProps} className="font-bold cursor-move">{module.name}</div>
                            <Button type="button" size="sm" variant="destructive" onClick={() => removeModule(module.id)}>Remove</Button>
                          </div>
                          <div className="ml-4">
                            <Label>Add Chapter</Label>
                            <div className="flex gap-2 mb-2">
                              <Input value={activeModule === module.id ? newChapterName : ''} onChange={e => { setActiveModule(module.id); setNewChapterName(e.target.value); }} placeholder="Chapter name" />
                              <Button type="button" onClick={() => { setActiveModule(module.id); addChapter(module.id); }}>Add</Button>
                            </div>
                            <Droppable droppableId={module.id} type="chapter">
                              {(provided: DroppableProvided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                  {module.chapters.map((chapter, cIdx) => (
                                    <Draggable key={chapter.id} draggableId={chapter.id} index={cIdx}>
                                      {(provided: DraggableProvided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} className="flex items-center justify-between mb-1 p-2 border rounded bg-gray-50">
                                          <div {...provided.dragHandleProps} className="cursor-move">{chapter.name}</div>
                                          <Button type="button" size="sm" variant="destructive" onClick={() => removeChapter(module.id, chapter.id)}>Remove</Button>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </TabsContent>
        <TabsContent value="schedule">
          <div className="mb-4">
            <Label>Plan Scheduling</Label>
            {scheduleLoading ? (
              <div>Loading schedule...</div>
            ) : (
              modules.map((module) => (
                <div key={module.id} className="mb-2">
                  <div className="font-semibold">{module.name}</div>
                  <DatePicker
                    selected={schedule[module.id] ? new Date(schedule[module.id]) : null}
                    onChange={(date: Date | null) => setSchedule(s => ({ ...s, [module.id]: date ? date.toISOString().split('T')[0] : '' }))}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                  />
                  {module.chapters.map((chapter) => (
                    <div key={chapter.id} className="ml-4 flex items-center gap-2">
                      <span>{chapter.name}</span>
                      <DatePicker
                        selected={schedule[chapter.id] ? new Date(schedule[chapter.id]) : null}
                        onChange={(date: Date | null) => setSchedule(s => ({ ...s, [chapter.id]: date ? date.toISOString().split('T')[0] : '' }))}
                        minDate={schedule[module.id] ? new Date(schedule[module.id]) : new Date()}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select date"
                      />
                    </div>
                  ))}
                </div>
              ))
            )}
            {!validateSchedule() && <div className="text-red-500">Dates must be in order and not overlap.</div>}
            <Button type="button" onClick={saveSchedule} variant="secondary" disabled={scheduleSaving || scheduleLoading}>
              {scheduleSaving ? 'Saving...' : 'Save Schedule'}
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="pricing">
          <div className="mb-4">
            <Label>Pricing Model</Label>
            <Select value={pricingModel} onValueChange={setPricingModel} disabled={pricingLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select pricing model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One-time Purchase</SelectItem>
                <SelectItem value="subscription">Subscription (Monthly)</SelectItem>
                <SelectItem value="full-term">Full-term (Semester)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Label>Price (USD)</Label>
            <Input type="number" value={price} onChange={e => setPrice(e.target.value)} min="0" step="0.01" disabled={pricingLoading} />
            {convertedPrice && <div className="text-sm text-gray-500">Converted Price (EUR): €{convertedPrice}</div>}
          </div>
          <Button type="button" onClick={savePricing} variant="secondary" disabled={pricingSaving || pricingLoading}>
            {pricingSaving ? 'Saving...' : 'Save Pricing'}
          </Button>
        </TabsContent>
        <TabsContent value="publish">
          <div className="mb-4">
            <div className="font-bold">Publish Course</div>
            <ul className="list-disc ml-6 mb-2">
              <li>At least one module and one chapter</li>
              <li>Pricing configured</li>
              <li>Valid scheduling (no overlaps, future dates)</li>
            </ul>
            <div className="mb-2">Summary:</div>
            <div className="mb-2">Title: {title}</div>
            <div className="mb-2">Modules: {modules.length}</div>
            <div className="mb-2">Pricing: {price} USD ({pricingModel})</div>
            <div className="mb-2">Schedule: {Object.keys(schedule).length} items scheduled</div>
            <Button type="button" onClick={handlePublish} disabled={!canPublish || publishing}>
              {publishing ? 'Publishing...' : 'Publish Course'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 