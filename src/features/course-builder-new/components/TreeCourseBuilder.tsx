import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CourseBuilderProvider } from '../context/CourseBuilderContext';
import { CourseDetails } from './CourseDetails';
import { CourseStructure } from './CourseStructure';
import { CoursePricing } from './CoursePricing';
import { CoursePublish } from './CoursePublish';

interface CourseBuilderProps {
  courseId?: string;
}

export function TreeCourseBuilder({ courseId }: CourseBuilderProps) {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <CourseBuilderProvider initialCourseId={courseId || undefined}>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          {courseId ? 'Edit Course' : 'Create New Course'}
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid grid-cols-4 w-full">
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <CourseDetails onComplete={() => setActiveTab('structure')} />
          </TabsContent>
          
          <TabsContent value="structure">
            <CourseStructure onComplete={() => setActiveTab('pricing')} />
          </TabsContent>
          
          <TabsContent value="pricing">
            <CoursePricing onComplete={() => setActiveTab('publish')} />
          </TabsContent>
          
          <TabsContent value="publish">
            <CoursePublish />
          </TabsContent>
        </Tabs>
      </div>
    </CourseBuilderProvider>
  );
}
