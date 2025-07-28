import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourseBuilder } from '../context/CourseBuilderContext';
import { toast } from 'sonner';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
}

interface CourseDetailsProps {
  onComplete: () => void;
}

export function CourseDetails({ onComplete }: CourseDetailsProps) {
  const { 
    courseDetails, 
    updateCourseDetails, 
    saveCourseDetails,
    loading 
  } = useCourseBuilder();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Load categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axios.get('/api/v1/categories');
        setCategories(response.data.data || []);
      } catch (error) {
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!courseDetails.title || !courseDetails.description || !courseDetails.category_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    const savedCourseId = await saveCourseDetails();
    
    if (savedCourseId && thumbnail) {
      // Upload thumbnail if selected
      const formData = new FormData();
      formData.append('thumbnail', thumbnail);
      
      try {
        await axios.post(`/api/v1/courses/${savedCourseId}/thumbnail`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Thumbnail uploaded');
      } catch (error) {
        toast.error('Failed to upload thumbnail');
      }
    }
    
    if (savedCourseId) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold">Course Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Course Title <span className="text-red-500">*</span></Label>
          <Input 
            id="title" 
            value={courseDetails.title} 
            onChange={e => updateCourseDetails({ title: e.target.value })}
            placeholder="Enter course title"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
          <Textarea 
            id="description" 
            value={courseDetails.description} 
            onChange={e => updateCourseDetails({ description: e.target.value })}
            placeholder="Enter course description"
            rows={5}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
          <Select 
            value={courseDetails.category_id} 
            onValueChange={value => updateCourseDetails({ category_id: value })}
            disabled={loadingCategories}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingCategories && <p className="text-sm text-gray-500 mt-1">Loading categories...</p>}
        </div>
        
        <div>
          <Label htmlFor="thumbnail">Thumbnail Image</Label>
          <Input 
            id="thumbnail" 
            type="file" 
            accept="image/*"
            onChange={e => setThumbnail(e.target.files?.[0] || null)}
          />
          <p className="text-sm text-gray-500 mt-1">Recommended size: 1280x720 pixels</p>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save and Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
}
