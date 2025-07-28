import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

// Define types for course structure
export interface CourseContent {
  id: string;
  title: string;
  description?: string;
  position: number;
  content_type: 'course' | 'module' | 'chapter' | 'lesson';
  parent_id?: string;
  content?: string;
  video_url?: string;
  learning_objectives?: string[];
  duration_minutes?: number;
  duration_hours?: number;
  children?: CourseContent[];
}

export interface CourseStructure {
  course_id: string;
  title: string;
  description: string;
  status: string;
  is_active: boolean;
  modules: CourseContent[];
  total_duration: number;
  total_chapters: number;
  created_at: string;
  updated_at: string;
}

export interface PricingInfo {
  course_id: string;
  access_model: string;
  base_price: number;
  base_currency: string;
  discount_percentage: number;
  discounted_price: number | null;
  subscription_price: number | null;
  trial_period_days: number | null;
  is_active: boolean;
  enabled_access_models: string[];
}

interface CourseBuilderContextType {
  courseId: string | null;
  setCourseId: (id: string | null) => void;
  courseDetails: {
    title: string;
    description: string;
    category_id: string;
    status: string;
  };
  updateCourseDetails: (details: Partial<typeof courseDetails>) => void;
  structure: CourseStructure | null;
  loadStructure: () => Promise<void>;
  pricing: PricingInfo | null;
  loadPricing: () => Promise<void>;
  saveCourseDetails: () => Promise<string | null>;
  savePricing: (data: Partial<PricingInfo>) => Promise<boolean>;
  addContent: (content: Partial<CourseContent>, parentId?: string) => Promise<boolean>;
  updateContent: (id: string, data: Partial<CourseContent>) => Promise<boolean>;
  deleteContent: (id: string) => Promise<boolean>;
  reorderContent: (items: { id: string; position: number; parent_id: string }[]) => Promise<boolean>;
  publishCourse: () => Promise<boolean>;
  loading: boolean;
}

const CourseBuilderContext = createContext<CourseBuilderContextType | undefined>(undefined);

export const CourseBuilderProvider: React.FC<{ children: ReactNode; initialCourseId?: string }> = ({ 
  children,
  initialCourseId = null 
}) => {
  const [courseId, setCourseId] = useState<string | null>(initialCourseId);
  const [courseDetails, setCourseDetails] = useState({
    title: '',
    description: '',
    category_id: '',
    status: 'draft'
  });
  const [structure, setStructure] = useState<CourseStructure | null>(null);
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadCourseDetails();
      loadStructure();
      loadPricing();
    }
  }, [courseId]);

  const loadCourseDetails = async () => {
    if (!courseId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/courses/${courseId}`);
      const { title, description, category_id, status } = response.data.data;
      setCourseDetails({ title, description, category_id, status });
    } catch (error) {
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const loadStructure = async () => {
    if (!courseId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/courses/${courseId}/structure`);
      setStructure(response.data.data);
    } catch (error) {
      toast.error('Failed to load course structure');
    } finally {
      setLoading(false);
    }
  };

  const loadPricing = async () => {
    if (!courseId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/courses/${courseId}/pricing`);
      setPricing(response.data.data);
    } catch (error) {
      toast.error('Failed to load course pricing');
    } finally {
      setLoading(false);
    }
  };

  const updateCourseDetails = (details: Partial<typeof courseDetails>) => {
    setCourseDetails(prev => ({ ...prev, ...details }));
  };

  const saveCourseDetails = async (): Promise<string | null> => {
    setLoading(true);
    try {
      if (courseId) {
        // Update existing course
        await axios.put(`/api/v1/courses/${courseId}`, courseDetails);
        toast.success('Course details updated');
        return courseId;
      } else {
        // Create new course
        const response = await axios.post('/api/v1/courses', courseDetails);
        const newCourseId = response.data.data.id;
        setCourseId(newCourseId);
        toast.success('Course created');
        return newCourseId;
      }
    } catch (error) {
      toast.error('Failed to save course details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const savePricing = async (data: Partial<PricingInfo>): Promise<boolean> => {
    if (!courseId) {
      toast.error('Save course details first');
      return false;
    }
    
    setLoading(true);
    try {
      await axios.put(`/api/v1/courses/${courseId}/pricing`, data);
      toast.success('Pricing updated');
      await loadPricing();
      return true;
    } catch (error) {
      toast.error('Failed to save pricing');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addContent = async (content: Partial<CourseContent>, parentId?: string): Promise<boolean> => {
    if (!courseId) {
      toast.error('Save course details first');
      return false;
    }
    
    setLoading(true);
    try {
      const contentType = content.content_type;
      let endpoint = '';
      
      if (contentType === 'module') {
        endpoint = `/api/v1/courses/${courseId}/modules`;
      } else if (contentType === 'chapter' && parentId) {
        endpoint = `/api/v1/courses/${courseId}/modules/${parentId}/chapters`;
      } else {
        toast.error('Invalid content type or missing parent ID');
        return false;
      }
      
      await axios.post(endpoint, content);
      toast.success(`${contentType} added`);
      await loadStructure();
      return true;
    } catch (error) {
      toast.error(`Failed to add ${content.content_type}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (id: string, data: Partial<CourseContent>): Promise<boolean> => {
    if (!courseId) {
      toast.error('Save course details first');
      return false;
    }
    
    setLoading(true);
    try {
      const contentType = data.content_type;
      let endpoint = '';
      
      if (contentType === 'module') {
        endpoint = `/api/v1/modules/${id}`;
      } else if (contentType === 'chapter') {
        endpoint = `/api/v1/chapters/${id}`;
      } else {
        toast.error('Invalid content type');
        return false;
      }
      
      await axios.put(endpoint, data);
      toast.success(`${contentType} updated`);
      await loadStructure();
      return true;
    } catch (error) {
      toast.error(`Failed to update ${data.content_type}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (id: string): Promise<boolean> => {
    if (!courseId || !structure) {
      return false;
    }
    
    // Find the content in the structure to determine its type
    const findContent = (items: CourseContent[]): { item: CourseContent | null, type: string } => {
      for (const item of items) {
        if (item.id === id) {
          return { item, type: item.content_type };
        }
        if (item.children && item.children.length > 0) {
          const result = findContent(item.children);
          if (result.item) return result;
        }
      }
      return { item: null, type: '' };
    };
    
    // Get content type (module or chapter)
    const modules = structure.modules || [];
    const { type } = findContent(modules);
    
    if (!type) {
      toast.error('Content not found');
      return false;
    }
    
    setLoading(true);
    try {
      let endpoint = '';
      
      if (type === 'module') {
        endpoint = `/api/v1/modules/${id}`;
      } else if (type === 'chapter') {
        endpoint = `/api/v1/chapters/${id}`;
      } else {
        toast.error('Invalid content type');
        return false;
      }
      
      await axios.delete(endpoint);
      toast.success(`${type} deleted`);
      await loadStructure();
      return true;
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reorderContent = async (items: { id: string; position: number; parent_id: string }[]): Promise<boolean> => {
    if (!courseId) {
      toast.error('Save course details first');
      return false;
    }
    
    setLoading(true);
    try {
      await axios.post(`/api/v1/courses/${courseId}/reorder`, { items });
      toast.success('Content reordered');
      await loadStructure();
      return true;
    } catch (error) {
      toast.error('Failed to reorder content');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const publishCourse = async (): Promise<boolean> => {
    if (!courseId) {
      toast.error('Save course details first');
      return false;
    }
    
    setLoading(true);
    try {
      await axios.post(`/api/v1/courses/${courseId}/publish`);
      toast.success('Course published');
      await loadCourseDetails();
      return true;
    } catch (error) {
      toast.error('Failed to publish course');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CourseBuilderContext.Provider
      value={{
        courseId,
        setCourseId,
        courseDetails,
        updateCourseDetails,
        structure,
        loadStructure,
        pricing,
        loadPricing,
        saveCourseDetails,
        savePricing,
        addContent,
        updateContent,
        deleteContent,
        reorderContent,
        publishCourse,
        loading
      }}
    >
      {children}
    </CourseBuilderContext.Provider>
  );
};

export const useCourseBuilder = (): CourseBuilderContextType => {
  const context = useContext(CourseBuilderContext);
  if (context === undefined) {
    throw new Error('useCourseBuilder must be used within a CourseBuilderProvider');
  }
  return context;
};
