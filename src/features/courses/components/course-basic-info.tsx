import { useState } from 'react'
import { Upload, X } from 'lucide-react'
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

interface CourseBasicInfoProps {
  courseId: string
  course: {
    title: string
    description: string
    category: string
    difficulty: string
    price: number
    estimatedDuration: string
    thumbnail?: string | null
  }
}

export function CourseBasicInfo({ course }: CourseBasicInfoProps) {
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    category: course.category,
    difficulty: course.difficulty,
    price: course.price,
    estimatedDuration: course.estimatedDuration,
    thumbnail: course.thumbnail,
  })

  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const file = files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          thumbnail: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: null,
    }))
  }

  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
      {/* Course Details */}
      <div className='space-y-6 lg:col-span-2'>
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <Label htmlFor='title'>Course Title</Label>
              <Input
                id='title'
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder='Enter course title'
              />
            </div>

            <div>
              <Label htmlFor='description'>Course Description</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder='Describe what students will learn'
                rows={4}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <Label htmlFor='category'>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange('category', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Programming'>Programming</SelectItem>
                    <SelectItem value='Design'>Design</SelectItem>
                    <SelectItem value='Business'>Business</SelectItem>
                    <SelectItem value='Marketing'>Marketing</SelectItem>
                    <SelectItem value='Data Science'>Data Science</SelectItem>
                    <SelectItem value='Photography'>Photography</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='difficulty'>Difficulty Level</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) =>
                    handleInputChange('difficulty', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select difficulty' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Beginner'>Beginner</SelectItem>
                    <SelectItem value='Intermediate'>Intermediate</SelectItem>
                    <SelectItem value='Advanced'>Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <Label htmlFor='price'>Course Price ($)</Label>
                <Input
                  id='price'
                  type='number'
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange('price', parseFloat(e.target.value))
                  }
                  placeholder='0.00'
                  min='0'
                  step='0.01'
                />
              </div>

              <div>
                <Label htmlFor='duration'>Estimated Duration</Label>
                <Input
                  id='duration'
                  value={formData.estimatedDuration}
                  onChange={(e) =>
                    handleInputChange('estimatedDuration', e.target.value)
                  }
                  placeholder='e.g., 40 hours'
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Thumbnail */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Course Thumbnail</CardTitle>
          </CardHeader>
          <CardContent>
            {formData.thumbnail ? (
              <div className='relative'>
                <img
                  src={formData.thumbnail}
                  alt='Course thumbnail'
                  className='h-48 w-full rounded-lg object-cover'
                />
                <Button
                  variant='destructive'
                  size='sm'
                  className='absolute top-2 right-2'
                  onClick={removeThumbnail}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            ) : (
              <div
                className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                  dragActive
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() =>
                  document.getElementById('thumbnail-upload')?.click()
                }
              >
                <Upload className='mx-auto mb-2 h-8 w-8 text-gray-400' />
                <p className='mb-1 text-sm text-gray-600'>
                  Drop an image here, or click to select
                </p>
                <p className='text-xs text-gray-400'>PNG, JPG up to 5MB</p>
                <input
                  id='thumbnail-upload'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={(e) =>
                    e.target.files && handleFiles(e.target.files)
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className='mt-6'>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <Button variant='outline' className='w-full'>
              Preview Course
            </Button>
            <Button variant='outline' className='w-full'>
              Duplicate Course
            </Button>
            <Button variant='destructive' className='w-full'>
              Delete Course
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
