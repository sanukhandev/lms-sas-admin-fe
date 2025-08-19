import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Save, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateCourse } from '@/hooks/use-courses'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/_authenticated/courses/new')({
  component: CreateCoursePage,
})

interface CourseFormData {
  title: string
  description: string
  short_description?: string
  category_id: string
  level: string
  price: number
  duration_hours: string
  thumbnail_url: string
}

function CreateCoursePage() {
  const navigate = useNavigate()
  const createCourseMutation = useCreateCourse()
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    short_description: '',
    category_id: '',
    level: '',
    price: 0,
    duration_hours: '',
    thumbnail_url: '',
  })

  const handleInputChange = (
    field: keyof CourseFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.title ||
      !formData.description ||
      !formData.category_id ||
      !formData.level
    ) {
      toast.error('Please fill in all required fields.')
      return
    }

    try {
      // Convert duration from string to number
      const courseData = {
        ...formData,
        duration_hours: formData.duration_hours
          ? parseFloat(formData.duration_hours)
          : undefined,
        category_id: parseInt(formData.category_id),
        status: 'draft' as const,
        is_active: true,
      }

      const result = await createCourseMutation.mutateAsync(courseData)

      // Navigate to the edit page of the newly created course
      navigate({ to: `/courses/${result.data.id}/edit` })
    } catch (_error) {
      // Error handling is already done in the mutation
    }
  }

  return (
    <div className='container mx-auto space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Link
            to='/courses'
            className='text-muted-foreground hover:text-foreground flex items-center space-x-2'
          >
            <ArrowLeft className='h-4 w-4' />
            <span>Back to Courses</span>
          </Link>
          <div>
            <h1 className='text-3xl font-bold'>Create New Course</h1>
            <p className='text-muted-foreground'>
              Fill in the details to create your new course
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          {/* Future: Add any action buttons here if needed */}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <Plus className='h-5 w-5' />
              <span>Course Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Course Title */}
            <div className='grid gap-2'>
              <Label htmlFor='title' className='text-sm font-medium'>
                Course Title *
              </Label>
              <Input
                id='title'
                placeholder='Enter course title'
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                className='w-full'
              />
            </div>

            {/* Course Description */}
            <div className='grid gap-2'>
              <Label htmlFor='description' className='text-sm font-medium'>
                Course Description *
              </Label>
              <Textarea
                id='description'
                placeholder='Describe what students will learn in this course'
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                rows={4}
                required
                className='w-full resize-none'
              />
              <p className='text-muted-foreground text-xs'>
                Provide a detailed description of your course content and
                learning outcomes
              </p>
            </div>

            {/* Short Description */}
            <div className='grid gap-2'>
              <Label
                htmlFor='short_description'
                className='text-sm font-medium'
              >
                Short Description
              </Label>
              <Input
                id='short_description'
                placeholder='Brief summary of the course'
                value={formData.short_description || ''}
                onChange={(e) =>
                  handleInputChange('short_description', e.target.value)
                }
                className='w-full'
              />
              <p className='text-muted-foreground text-xs'>
                A brief summary for course listings and previews
              </p>
            </div>

            {/* Category and Level */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='grid gap-2'>
                <Label htmlFor='category' className='text-sm font-medium'>
                  Category *
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleInputChange('category_id', value)
                  }
                  required
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>Programming</SelectItem>
                    <SelectItem value='2'>Design</SelectItem>
                    <SelectItem value='3'>Business</SelectItem>
                    <SelectItem value='4'>Marketing</SelectItem>
                    <SelectItem value='5'>Data Science</SelectItem>
                    <SelectItem value='6'>Photography</SelectItem>
                    <SelectItem value='7'>Music</SelectItem>
                    <SelectItem value='8'>Language</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='level' className='text-sm font-medium'>
                  Difficulty Level *
                </Label>
                <Select
                  onValueChange={(value) => handleInputChange('level', value)}
                  required
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select difficulty' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='beginner'>Beginner</SelectItem>
                    <SelectItem value='intermediate'>Intermediate</SelectItem>
                    <SelectItem value='advanced'>Advanced</SelectItem>
                    <SelectItem value='expert'>Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price and Duration */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='grid gap-2'>
                <Label htmlFor='price' className='text-sm font-medium'>
                  Course Price ($)
                </Label>
                <Input
                  id='price'
                  type='number'
                  placeholder='0.00'
                  min='0'
                  step='0.01'
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange('price', parseFloat(e.target.value) || 0)
                  }
                  className='w-full'
                />
                <p className='text-muted-foreground text-xs'>
                  Set to 0 for free course
                </p>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='duration_hours' className='text-sm font-medium'>
                  Duration (Hours)
                </Label>
                <Input
                  id='duration_hours'
                  type='number'
                  placeholder='e.g., 40'
                  min='0'
                  step='0.5'
                  value={formData.duration_hours}
                  onChange={(e) =>
                    handleInputChange('duration_hours', e.target.value)
                  }
                  className='w-full'
                />
                <p className='text-muted-foreground text-xs'>
                  Estimated completion time in hours
                </p>
              </div>
            </div>

            {/* Thumbnail URL */}
            <div className='grid gap-2'>
              <Label htmlFor='thumbnail_url' className='text-sm font-medium'>
                Thumbnail Image URL
              </Label>
              <Input
                id='thumbnail_url'
                placeholder='https://example.com/image.jpg'
                value={formData.thumbnail_url}
                onChange={(e) =>
                  handleInputChange('thumbnail_url', e.target.value)
                }
                className='w-full'
              />
              <p className='text-muted-foreground text-xs'>
                Optional: Provide a URL for the course thumbnail
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex justify-end space-x-4 border-t pt-6'>
              <Button type='button' variant='outline' asChild>
                <Link to='/courses'>Cancel</Link>
              </Button>
              <Button type='submit' disabled={createCourseMutation.isPending}>
                <Save className='mr-2 h-4 w-4' />
                {createCourseMutation.isPending
                  ? 'Creating...'
                  : 'Create Course'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
