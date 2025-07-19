import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesService, type Course } from '@/services/courses'
import { toast } from 'sonner'
import { 
  BookOpen, 
  Users, 
  Target, 
  Settings, 
  User,
  Plus,
  X,
  Upload,
  Edit,
  Save
} from 'lucide-react'

interface CourseDetailsTabProps {
  courseId: string | null
}

interface CourseDetails {
  id: string
  title: string
  subtitle: string
  description: string
  shortDescription: string
  category: string
  level: string
  language: string
  duration: number
  estimatedHours: number
  maxStudents: number
  isPublished: boolean
  allowDiscussions: boolean
  allowReviews: boolean
  autoEnroll: boolean
  certificate: boolean
  objectives: string[]
  requirements: string[]
  targetAudience: string[]
  tags: string[]
  thumbnail: string
  trailer: string
  instructors: Array<{
    id: string
    name: string
    email: string
    bio: string
    avatar: string
    role: string
  }>
}

export function CourseDetailsTab({ courseId }: CourseDetailsTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()

  // Fetch course data from API
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course-builder', 'course', courseId],
    queryFn: () => coursesService.getCourse(Number(courseId)),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Local state for editing
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    id: '',
    title: '',
    subtitle: '',
    description: '',
    shortDescription: '',
    category: '',
    level: '',
    language: '',
    duration: 0,
    estimatedHours: 0,
    maxStudents: 0,
    isPublished: false,
    allowDiscussions: true,
    allowReviews: true,
    autoEnroll: false,
    certificate: true,
    objectives: [],
    requirements: [],
    targetAudience: [],
    tags: [],
    thumbnail: '',
    trailer: '',
    instructors: []
  })

  // Update local state when course data is loaded
  useEffect(() => {
    if (course?.data) {
      setCourseDetails({
        id: course.data.id.toString(),
        title: course.data.title,
        subtitle: '', // Map from course data
        description: course.data.description || '',
        shortDescription: '', // Map from course data
        category: course.data.category_name || '', // Map from course data
        level: course.data.level || '', // Map from course data
        language: '', // Map from course data
        duration: 0, // Map from course data
        estimatedHours: (course.data.duration_hours || 0) * 60,
        maxStudents: 0, // Map from course data
        isPublished: course.data.status === 'published',
        allowDiscussions: true, // Map from course data
        allowReviews: true, // Map from course data
        autoEnroll: false, // Map from course data
        certificate: true, // Map from course data
        objectives: [], // Map from course data
        requirements: [], // Map from course data
        targetAudience: [], // Map from course data
        tags: [], // Map from course data
        thumbnail: '',
        trailer: '',
        instructors: [{
          id: 'instructor-1',
          name: course.data.instructor_name || 'Unknown',
          email: '',
          bio: '',
          avatar: '',
          role: 'Lead Instructor'
        }]
      })
    }
  }, [course])

  // Mutation for updating course
  const updateCourseMutation = useMutation({
    mutationFn: (data: Partial<Course>) => 
      coursesService.updateCourse(Number(courseId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-builder', 'course', courseId] })
      queryClient.invalidateQueries({ queryKey: ['course-builder', 'courses'] })
      toast.success('Course updated successfully')
      setIsEditing(false)
    },
    onError: (error) => {
      console.error('Failed to update course:', error)
      toast.error('Failed to update course')
    }
  })

  const [newObjective, setNewObjective] = useState('')
  const [newRequirement, setNewRequirement] = useState('')
  const [newAudience, setNewAudience] = useState('')
  const [newTag, setNewTag] = useState('')

  const handleSave = () => {
    if (!courseId) return

    const updateData = {
      title: courseDetails.title,
      description: courseDetails.description,
      instructor: courseDetails.instructors[0]?.name || '',
      // Add other fields as needed based on your API
    }

    updateCourseMutation.mutate(updateData)
  }

  const handleCancel = () => {
    // Revert changes by reloading from API data
    if (course?.data) {
      setCourseDetails({
        id: course.data.id.toString(),
        title: course.data.title,
        subtitle: '',
        description: course.data.description || '',
        shortDescription: '',
        category: course.data.category_name || '',
        level: course.data.level || '',
        language: '',
        duration: 0,
        estimatedHours: (course.data.duration_hours || 0) * 60,
        maxStudents: 0,
        isPublished: course.data.status === 'published',
        allowDiscussions: true,
        allowReviews: true,
        autoEnroll: false,
        certificate: true,
        objectives: [],
        requirements: [],
        targetAudience: [],
        tags: [],
        thumbnail: '',
        trailer: '',
        instructors: [{
          id: 'instructor-1',
          name: course.data.instructor_name || 'Unknown',
          email: '',
          bio: '',
          avatar: '',
          role: 'Lead Instructor'
        }]
      })
    }
    setIsEditing(false)
  }

  const addObjective = () => {
    if (newObjective.trim()) {
      setCourseDetails(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }))
      setNewObjective('')
    }
  }

  const removeObjective = (index: number) => {
    setCourseDetails(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }))
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setCourseDetails(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }))
      setNewRequirement('')
    }
  }

  const removeRequirement = (index: number) => {
    setCourseDetails(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const addAudience = () => {
    if (newAudience.trim()) {
      setCourseDetails(prev => ({
        ...prev,
        targetAudience: [...prev.targetAudience, newAudience.trim()]
      }))
      setNewAudience('')
    }
  }

  const removeAudience = (index: number) => {
    setCourseDetails(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !courseDetails.tags.includes(newTag.trim().toLowerCase())) {
      setCourseDetails(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    setCourseDetails(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  if (!courseId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Course Selected</h3>
          <p className="text-muted-foreground">Select a course from the table to view and edit its details.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-medium">Loading Course Details</h3>
          <p className="text-muted-foreground">Please wait while we fetch the course information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-medium">Error Loading Course</h3>
          <p className="text-muted-foreground">Failed to load course details. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Course Details</h2>
          <p className="text-muted-foreground">
            Manage course information, settings, and instructor details
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Course
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="objectives">Objectives</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
                <CardDescription>
                  Basic course details and metadata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={courseDetails.title}
                    onChange={(e) => setCourseDetails(prev => ({ ...prev, title: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={courseDetails.subtitle}
                    onChange={(e) => setCourseDetails(prev => ({ ...prev, subtitle: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={courseDetails.category} 
                    onValueChange={(value) => setCourseDetails(prev => ({ ...prev, category: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="data-science">Data Science</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select 
                    value={courseDetails.level} 
                    onValueChange={(value) => setCourseDetails(prev => ({ ...prev, level: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={courseDetails.language} 
                    onValueChange={(value) => setCourseDetails(prev => ({ ...prev, language: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Metrics</CardTitle>
                <CardDescription>
                  Duration and capacity settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (weeks)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={courseDetails.duration}
                    onChange={(e) => setCourseDetails(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    value={courseDetails.estimatedHours}
                    onChange={(e) => setCourseDetails(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Max Students</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={courseDetails.maxStudents}
                    onChange={(e) => setCourseDetails(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 0 }))}
                    disabled={!isEditing}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {courseDetails.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        {isEditing && (
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeTag(index)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button size="sm" onClick={addTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Description */}
        <TabsContent value="description" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
              <CardDescription>
                Detailed course information for students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  placeholder="Brief course summary (1-2 sentences)"
                  value={courseDetails.shortDescription}
                  onChange={(e) => setCourseDetails(prev => ({ ...prev, shortDescription: e.target.value }))}
                  disabled={!isEditing}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed course description"
                  value={courseDetails.description}
                  onChange={(e) => setCourseDetails(prev => ({ ...prev, description: e.target.value }))}
                  disabled={!isEditing}
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Objectives */}
        <TabsContent value="objectives" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Objectives
                </CardTitle>
                <CardDescription>
                  What students will learn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {courseDetails.objectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded border">
                    <div className="flex-1 text-sm">{objective}</div>
                    {isEditing && (
                      <X 
                        className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive" 
                        onClick={() => removeObjective(index)}
                      />
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add learning objective"
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      rows={2}
                    />
                    <Button size="sm" onClick={addObjective} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Objective
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Prerequisites
                </CardTitle>
                <CardDescription>
                  Required knowledge/skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {courseDetails.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded border">
                    <div className="flex-1 text-sm">{requirement}</div>
                    {isEditing && (
                      <X 
                        className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive" 
                        onClick={() => removeRequirement(index)}
                      />
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add requirement"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      rows={2}
                    />
                    <Button size="sm" onClick={addRequirement} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Requirement
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Target Audience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Target Audience
                </CardTitle>
                <CardDescription>
                  Who this course is for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {courseDetails.targetAudience.map((audience, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded border">
                    <div className="flex-1 text-sm">{audience}</div>
                    {isEditing && (
                      <X 
                        className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive" 
                        onClick={() => removeAudience(index)}
                      />
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add target audience"
                      value={newAudience}
                      onChange={(e) => setNewAudience(e.target.value)}
                      rows={2}
                    />
                    <Button size="sm" onClick={addAudience} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Audience
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Course Settings
                </CardTitle>
                <CardDescription>
                  Configure course behavior and features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Discussions</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable student discussions and Q&A
                    </div>
                  </div>
                  <Switch
                    checked={courseDetails.allowDiscussions}
                    onCheckedChange={(checked) => setCourseDetails(prev => ({ ...prev, allowDiscussions: checked }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Reviews</Label>
                    <div className="text-sm text-muted-foreground">
                      Students can review and rate the course
                    </div>
                  </div>
                  <Switch
                    checked={courseDetails.allowReviews}
                    onCheckedChange={(checked) => setCourseDetails(prev => ({ ...prev, allowReviews: checked }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Enrollment</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically enroll eligible students
                    </div>
                  </div>
                  <Switch
                    checked={courseDetails.autoEnroll}
                    onCheckedChange={(checked) => setCourseDetails(prev => ({ ...prev, autoEnroll: checked }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Certificate</Label>
                    <div className="text-sm text-muted-foreground">
                      Award completion certificate
                    </div>
                  </div>
                  <Switch
                    checked={courseDetails.certificate}
                    onCheckedChange={(checked) => setCourseDetails(prev => ({ ...prev, certificate: checked }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Assets</CardTitle>
                <CardDescription>
                  Course thumbnail and promotional materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Course Thumbnail</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <div className="text-sm text-muted-foreground">
                      Drag and drop an image, or click to browse
                    </div>
                    <Button variant="outline" size="sm" className="mt-2" disabled={!isEditing}>
                      Upload Image
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trailer">Course Trailer URL</Label>
                  <Input
                    id="trailer"
                    placeholder="https://youtube.com/watch?v=..."
                    value={courseDetails.trailer}
                    onChange={(e) => setCourseDetails(prev => ({ ...prev, trailer: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Instructors */}
        <TabsContent value="instructors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Course Instructors
              </CardTitle>
              <CardDescription>
                Manage instructors for this course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseDetails.instructors.map((instructor) => (
                <div key={instructor.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={instructor.avatar} />
                    <AvatarFallback>{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{instructor.name}</h4>
                        <p className="text-sm text-muted-foreground">{instructor.role}</p>
                      </div>
                      {isEditing && (
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{instructor.email}</p>
                    <p className="text-sm">{instructor.bio}</p>
                  </div>
                </div>
              ))}
              {isEditing && (
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Instructor
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
