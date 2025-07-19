import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesService } from '@/services/courses'
import { toast } from 'sonner'
import { 
  Upload, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Users,
  BarChart3,
  Calendar
} from 'lucide-react'

interface CoursePublishingTabProps {
  courseId: string
}

export function CoursePublishingTab({ courseId }: CoursePublishingTabProps) {
  const queryClient = useQueryClient()

  // Fetch course data to get current status
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course-builder', 'course', courseId],
    queryFn: () => coursesService.getCourse(Number(courseId)),
    enabled: !!courseId,
  })

  // Fetch course structure for validation
  const { data: courseStructure, isLoading: structureLoading } = useQuery({
    queryKey: ['course-builder', 'structure', courseId],
    queryFn: () => coursesService.getCourseStructure(courseId),
    enabled: !!courseId,
  })

  const [courseStatus, setCourseStatus] = useState({
    status: 'draft',
    isActive: false,
    isPublished: false,
    publishedAt: null as string | null,
    totalModules: 0,
    totalChapters: 0,
    completionRate: 0,
  })

  // Update local state when API data loads
  useEffect(() => {
    if (course?.data && courseStructure?.data) {
      setCourseStatus({
        status: course.data.status,
        isActive: course.data.status === 'published',
        isPublished: course.data.status === 'published',
        publishedAt: course.data.status === 'published' ? course.data.updated_at : null,
        totalModules: courseStructure.data.modules?.length || 0,
        totalChapters: courseStructure.data.modules?.reduce((acc, module) => acc + (module.chapters?.length || 0), 0) || 0,
        completionRate: calculateCompletionRate(courseStructure.data),
      })
    }
  }, [course, courseStructure])

  // Calculate completion rate based on course structure
  const calculateCompletionRate = (structure: any) => {
    if (!structure || !structure.modules) return 0
    
    const totalRequiredFields = structure.modules.length * 3 // title, description, chapters
    let completedFields = 0
    
    structure.modules.forEach((module: any) => {
      if (module.title) completedFields++
      if (module.description) completedFields++
      if (module.chapters && module.chapters.length > 0) completedFields++
    })
    
    return Math.round((completedFields / totalRequiredFields) * 100)
  }

  // Publish course mutation
  const publishMutation = useMutation({
    mutationFn: () => coursesService.publishCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-builder', 'course', courseId] })
      queryClient.invalidateQueries({ queryKey: ['course-builder', 'courses'] })
      toast.success('Course published successfully')
    },
    onError: () => {
      toast.error('Failed to publish course')
    }
  })

  // Unpublish course mutation
  const unpublishMutation = useMutation({
    mutationFn: () => coursesService.unpublishCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-builder', 'course', courseId] })
      queryClient.invalidateQueries({ queryKey: ['course-builder', 'courses'] })
      toast.success('Course unpublished successfully')
    },
    onError: () => {
      toast.error('Failed to unpublish course')
    }
  })

  const handlePublish = async () => {
    publishMutation.mutate()
  }

  const handleUnpublish = async () => {
    unpublishMutation.mutate()
  }

  const isLoading = courseLoading || structureLoading || publishMutation.isPending || unpublishMutation.isPending

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getReadinessChecks = () => {
    return [
      {
        name: 'Course has title and description',
        completed: true,
        required: true,
      },
      {
        name: 'At least one module created',
        completed: courseStatus.totalModules > 0,
        required: true,
      },
      {
        name: 'At least one chapter created',
        completed: courseStatus.totalChapters > 0,
        required: true,
      },
      {
        name: 'Pricing configured',
        completed: true,
        required: false,
      },
      {
        name: 'Course thumbnail uploaded',
        completed: false,
        required: false,
      },
    ]
  }

  const readinessChecks = getReadinessChecks()
  const requiredChecks = readinessChecks.filter(check => check.required)
  const allRequiredComplete = requiredChecks.every(check => check.completed)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Course Status
            <Badge className={getStatusColor(courseStatus.status)}>
              {courseStatus.status.charAt(0).toUpperCase() + courseStatus.status.slice(1)}
            </Badge>
          </CardTitle>
          <CardDescription>
            Current publication status and visibility settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {courseStatus.isPublished ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm font-medium">
                  {courseStatus.isPublished ? 'Published' : 'Not Published'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Visible to students</span>
                <Switch
                  checked={courseStatus.isActive}
                  onCheckedChange={(checked) => setCourseStatus({...courseStatus, isActive: checked})}
                />
              </div>

              {courseStatus.publishedAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Published: {new Date(courseStatus.publishedAt).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span>Content: {courseStatus.totalModules} modules, {courseStatus.totalChapters} chapters</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-orange-600" />
                <span>Completion: {courseStatus.completionRate}% ready</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            {!courseStatus.isPublished ? (
              <Button 
                onClick={handlePublish} 
                disabled={!allRequiredComplete || isLoading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {isLoading ? 'Publishing...' : 'Publish Course'}
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={handleUnpublish} 
                disabled={isLoading}
                className="gap-2"
              >
                <EyeOff className="h-4 w-4" />
                {isLoading ? 'Unpublishing...' : 'Unpublish Course'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publication Readiness</CardTitle>
          <CardDescription>
            Complete these steps before publishing your course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {readinessChecks.map((check, index) => (
              <div key={index} className="flex items-center gap-3">
                {check.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className={`h-5 w-5 ${check.required ? 'text-red-500' : 'text-yellow-500'}`} />
                )}
                <span className={`text-sm ${check.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                  {check.name}
                </span>
                {check.required && (
                  <Badge variant="outline" className="text-xs">Required</Badge>
                )}
              </div>
            ))}
          </div>

          {!allRequiredComplete && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                Complete all required items before publishing your course.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibility Settings</CardTitle>
          <CardDescription>
            Control who can see and access your course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="course-active">Course is active</Label>
                <p className="text-xs text-gray-500">Students can enroll and access content</p>
              </div>
              <Switch
                id="course-active"
                checked={courseStatus.isActive}
                onCheckedChange={(checked) => setCourseStatus({...courseStatus, isActive: checked})}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Access Information</h4>
              <div className="text-xs space-y-1 text-gray-600">
                <p>• Published courses appear in the course catalog</p>
                <p>• Active courses allow new enrollments</p>
                <p>• Inactive courses hide from public but existing students can still access</p>
                <p>• Draft courses are only visible to instructors and admins</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common publishing and management actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview Course
            </Button>
            <Button variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
