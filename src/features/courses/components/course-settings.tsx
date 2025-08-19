import { useState } from 'react'
import { Globe, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface CourseSettingsProps {
  courseId: string
  settings: {
    isPublished: boolean
    visibility: 'public' | 'private' | 'unlisted'
    enrollmentType: 'open' | 'approval' | 'invitation'
    maxStudents: number | null
    allowDiscussions: boolean
    allowRatings: boolean
    allowCertificates: boolean
    dripContent: boolean
    prerequisites: string
    language: string
    autoPublishLessons: boolean
    emailNotifications: boolean
  }
}

export function CourseSettings({ settings }: CourseSettingsProps) {
  const [formData, setFormData] = useState(settings)

  const handleSwitchChange = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Globe className='h-5 w-5' />
            Visibility & Access
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <Label htmlFor='published'>Course Published</Label>
              <p className='text-muted-foreground text-sm'>
                Make this course visible to students
              </p>
            </div>
            <Switch
              id='published'
              checked={formData.isPublished}
              onCheckedChange={(value) =>
                handleSwitchChange('isPublished', value)
              }
            />
          </div>

          <div className='space-y-2'>
            <Label>Maximum Students</Label>
            <Input
              type='number'
              value={formData.maxStudents || ''}
              onChange={(e) =>
                handleInputChange(
                  'maxStudents',
                  e.target.value ? parseInt(e.target.value) : ''
                )
              }
              placeholder='Leave empty for unlimited'
              min='1'
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Course Features
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <Label>Enable Discussions</Label>
              <p className='text-muted-foreground text-sm'>
                Allow students to discuss course content
              </p>
            </div>
            <Switch
              checked={formData.allowDiscussions}
              onCheckedChange={(value) =>
                handleSwitchChange('allowDiscussions', value)
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-end'>
        <Button size='lg'>Save Settings</Button>
      </div>
    </div>
  )
}
