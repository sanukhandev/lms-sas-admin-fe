import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { coursesService } from '@/services/courses'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CourseStructureManager } from '../components/course-structure-manager'

interface CourseStructureTabProps {
  courseId: string
}

// Mock course structure data
const mockCourseStructure = {
  modules: [
    {
      id: 'module-1',
      title: 'Introduction to Programming',
      description: 'Fundamental concepts and getting started with programming',
      order_index: 1,
      is_published: true,
      estimated_duration: 240,
      chapters: [
        {
          id: 'chapter-1',
          title: 'Setting Up Your Environment',
          description: 'Install tools and configure your development workspace',
          order_index: 1,
          is_published: true,
          estimated_duration: 60,
          classes: [
            {
              id: 'class-1',
              title: 'Installing VS Code',
              description: 'Download and install Visual Studio Code editor',
              content_type: 'video' as const,
              duration_minutes: 15,
              is_preview: true,
              is_required: true,
              order_index: 1,
              is_published: true,
            },
            {
              id: 'class-2',
              title: 'First Programming Concepts',
              description: 'Understanding variables, data types, and basic syntax',
              content_type: 'text' as const,
              duration_minutes: 30,
              is_preview: false,
              is_required: true,
              order_index: 2,
              is_published: true,
            },
            {
              id: 'class-3',
              title: 'Environment Setup Quiz',
              description: 'Test your understanding of the development environment',
              content_type: 'quiz' as const,
              duration_minutes: 15,
              is_preview: false,
              is_required: true,
              order_index: 3,
              is_published: true,
            },
          ]
        },
        {
          id: 'chapter-2',
          title: 'Basic Programming Constructs',
          description: 'Learn about loops, conditions, and functions',
          order_index: 2,
          is_published: false,
          estimated_duration: 180,
          classes: [
            {
              id: 'class-4',
              title: 'Understanding Variables',
              description: 'Deep dive into variable declaration and usage',
              content_type: 'video' as const,
              duration_minutes: 45,
              is_preview: false,
              is_required: true,
              order_index: 1,
              is_published: false,
            },
            {
              id: 'class-5',
              title: 'Control Flow Statements',
              description: 'If statements, loops, and decision making',
              content_type: 'video' as const,
              duration_minutes: 60,
              is_preview: false,
              is_required: true,
              order_index: 2,
              is_published: false,
            },
            {
              id: 'class-6',
              title: 'Functions and Methods',
              description: 'Creating reusable code with functions',
              content_type: 'text' as const,
              duration_minutes: 45,
              is_preview: false,
              is_required: true,
              order_index: 3,
              is_published: false,
            },
            {
              id: 'class-7',
              title: 'Programming Assignment 1',
              description: 'Build your first complete program',
              content_type: 'assignment' as const,
              duration_minutes: 30,
              is_preview: false,
              is_required: true,
              order_index: 4,
              is_published: false,
            },
          ]
        }
      ]
    },
    {
      id: 'module-2',
      title: 'Intermediate Concepts',
      description: 'Data structures, algorithms, and object-oriented programming',
      order_index: 2,
      is_published: false,
      estimated_duration: 480,
      chapters: [
        {
          id: 'chapter-3',
          title: 'Data Structures',
          description: 'Arrays, lists, dictionaries, and more',
          order_index: 1,
          is_published: false,
          estimated_duration: 240,
          classes: [
            {
              id: 'class-8',
              title: 'Arrays and Lists',
              description: 'Working with collections of data',
              content_type: 'video' as const,
              duration_minutes: 60,
              is_preview: false,
              is_required: true,
              order_index: 1,
              is_published: false,
            },
            {
              id: 'class-9',
              title: 'Dictionaries and Maps',
              description: 'Key-value data structures',
              content_type: 'video' as const,
              duration_minutes: 45,
              is_preview: false,
              is_required: true,
              order_index: 2,
              is_published: false,
            },
            {
              id: 'class-10',
              title: 'Data Structure Exercises',
              description: 'Practice working with different data structures',
              content_type: 'assignment' as const,
              duration_minutes: 135,
              is_preview: false,
              is_required: true,
              order_index: 3,
              is_published: false,
            },
          ]
        }
      ]
    }
  ],
  total_duration: 720, // in minutes
  total_classes: 10,
  completion_rate: 35 // percentage of structure that's complete/published
}

export function CourseStructureTab({ courseId }: CourseStructureTabProps) {
  const [courseStructure, setCourseStructure] = useState(mockCourseStructure)

  // Fetch course structure from API
  const { data: apiCourseStructure } = useQuery({
    queryKey: ['course-builder', 'structure', courseId],
    queryFn: () => coursesService.getCourseStructure(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const handleStructureUpdate = (newStructure: any) => {
    setCourseStructure(newStructure)
    // TODO: Implement API call to save structure
    console.log('Updating course structure:', newStructure)
  }

  // Use API data if available, otherwise use mock data
  const structureData = apiCourseStructure?.data || courseStructure

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Structure & Content Organization</CardTitle>
          <CardDescription>
            Design your course hierarchy with modules, chapters, and classes. 
            Drag and drop to reorder content and manage the learning progression.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseStructureManager
            structure={structureData as any}
            onUpdate={handleStructureUpdate}
          />
        </CardContent>
      </Card>
    </div>
  )
}
