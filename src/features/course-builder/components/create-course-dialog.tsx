import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Calendar,
  Target,
  CheckCircle,
  Plus,
  X
} from 'lucide-react'
import { useCreateCourse } from '../hooks/use-course-builder'

const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  short_description: z.string().optional(),
  category_id: z.string().min(1, 'Please select a category'),
  instructor_name: z.string().min(2, 'Instructor name is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  language: z.string().min(1, 'Language is required'),
  duration_hours: z.number().min(1, 'Duration must be at least 1 hour'),
  max_students: z.number().optional(),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().min(1, 'Currency is required'),
  tags: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  what_you_will_learn: z.array(z.string()).optional(),
  is_active: z.boolean().default(true),
  allow_discussions: z.boolean().default(true),
  allow_reviews: z.boolean().default(true),
  certificate_enabled: z.boolean().default(true),
})

interface CreateCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const courseCategories = [
  { id: '1', name: 'Programming', description: 'Software development and coding' },
  { id: '2', name: 'Data Science', description: 'Analytics, ML, and data visualization' },
  { id: '3', name: 'Design', description: 'UI/UX, graphic design, and creative arts' },
  { id: '4', name: 'Business', description: 'Management, entrepreneurship, and strategy' },
  { id: '5', name: 'Marketing', description: 'Digital marketing and growth strategies' },
  { id: '6', name: 'Technology', description: 'Emerging tech and innovation' },
]

const courseLevels = [
  { value: 'beginner', label: 'Beginner', description: 'No prior experience required' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some background knowledge helpful' },
  { value: 'advanced', label: 'Advanced', description: 'Significant experience required' },
]

export function CreateCourseDialog({ open, onOpenChange }: CreateCourseDialogProps) {
  const [step, setStep] = useState(1)
  const [tags, setTags] = useState<string[]>([])
  const [requirements, setRequirements] = useState<string[]>([])
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [newRequirement, setNewRequirement] = useState('')
  const [newOutcome, setNewOutcome] = useState('')

  const { mutateAsync: createCourse, isPending } = useCreateCourse()

  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      level: 'beginner' as const,
      language: 'en',
      currency: 'USD',
      duration_hours: 1,
      price: 0,
      is_active: true,
      allow_discussions: true,
      allow_reviews: true,
      certificate_enabled: true,
    }
  })

  const onSubmit = async (data: any) => {
    try {
      const courseData = {
        ...data,
        tags,
        requirements,
        what_you_will_learn: learningOutcomes,
      }
      
      await createCourse(courseData)
      toast.success('Course created successfully!')
      onOpenChange(false)
      form.reset()
      setStep(1)
      setTags([])
      setRequirements([])
      setLearningOutcomes([])
    } catch (error) {
      toast.error('Failed to create course. Please try again.')
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()])
      setNewRequirement('')
    }
  }

  const removeRequirement = (reqToRemove: string) => {
    setRequirements(requirements.filter(req => req !== reqToRemove))
  }

  const addLearningOutcome = () => {
    if (newOutcome.trim() && !learningOutcomes.includes(newOutcome.trim())) {
      setLearningOutcomes([...learningOutcomes, newOutcome.trim()])
      setNewOutcome('')
    }
  }

  const removeLearningOutcome = (outcomeToRemove: string) => {
    setLearningOutcomes(learningOutcomes.filter(outcome => outcome !== outcomeToRemove))
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const getStepValidation = () => {
    switch (step) {
      case 1:
        return form.formState.errors.title || form.formState.errors.description || form.formState.errors.category_id
      case 2:
        return form.formState.errors.instructor_name || form.formState.errors.level || form.formState.errors.duration_hours
      case 3:
        return form.formState.errors.price
      default:
        return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Create New Course
          </DialogTitle>
          <DialogDescription>
            Build a comprehensive course with structured modules and chapters
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <Progress value={(step / 4) * 100} className="h-2" />
          <div className="flex justify-between text-xs">
            <span className={step === 1 ? 'text-primary font-medium' : 'text-muted-foreground'}>Basic Info</span>
            <span className={step === 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>Content</span>
            <span className={step === 3 ? 'text-primary font-medium' : 'text-muted-foreground'}>Pricing</span>
            <span className={step === 4 ? 'text-primary font-medium' : 'text-muted-foreground'}>Settings</span>
          </div>
        </div>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</div>
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Course Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Complete Python for Data Science" {...field} />
                        </FormControl>
                        <FormDescription>
                          Create a compelling title that clearly describes your course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide a comprehensive description of what students will learn..."
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed description that helps students understand the course value
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="short_description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief one-line summary for course cards" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div>
                                  <div className="font-medium">{category.name}</div>
                                  <div className="text-sm text-muted-foreground">{category.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="pt">Portuguese</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Content Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</div>
                  <h3 className="text-lg font-semibold">Content & Structure</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="instructor_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Instructor *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courseLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                <div>
                                  <div className="font-medium">{level.label}</div>
                                  <div className="text-sm text-muted-foreground">{level.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration_hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Duration (hours) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            placeholder="40"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Total estimated time to complete the course
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="max_students"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Students</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            placeholder="100 (leave empty for unlimited)"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Course Tags</CardTitle>
                    <CardDescription>Add relevant tags to help students discover your course</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag (e.g., Python, Beginner, Data Analysis)"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" variant="outline" onClick={addTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="pr-1">
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => removeTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Prerequisites & Requirements</CardTitle>
                    <CardDescription>What should students know or have before taking this course?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Basic understanding of programming concepts"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                      />
                      <Button type="button" variant="outline" onClick={addRequirement}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {requirements.length > 0 && (
                      <div className="space-y-2">
                        {requirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="flex-1">{req}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRequirement(req)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Learning Outcomes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">What Students Will Learn</CardTitle>
                    <CardDescription>Define clear learning outcomes and objectives</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Build machine learning models using Python"
                        value={newOutcome}
                        onChange={(e) => setNewOutcome(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLearningOutcome())}
                      />
                      <Button type="button" variant="outline" onClick={addLearningOutcome}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {learningOutcomes.length > 0 && (
                      <div className="space-y-2">
                        {learningOutcomes.map((outcome, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span className="flex-1">{outcome}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLearningOutcome(outcome)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Pricing */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</div>
                  <h3 className="text-lg font-semibold">Pricing & Monetization</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Price *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="number" 
                              min="0"
                              step="0.01"
                              placeholder="99.99"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Set to 0 for free courses
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="CAD">CAD (C$)</SelectItem>
                            <SelectItem value="AUD">AUD (A$)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Pricing Strategy</CardTitle>
                    <CardDescription>Choose how students will access your course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-2 border-primary">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
                              <h4 className="font-semibold">One-time Purchase</h4>
                              <p className="text-sm text-muted-foreground">Students buy once, own forever</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="opacity-50">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <h4 className="font-semibold">Subscription</h4>
                              <p className="text-sm text-muted-foreground">Coming soon</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="opacity-50">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <h4 className="font-semibold">Cohort-based</h4>
                              <p className="text-sm text-muted-foreground">Coming soon</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Settings */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">4</div>
                  <h3 className="text-lg font-semibold">Course Settings</h3>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Access & Permissions</CardTitle>
                    <CardDescription>Configure how students interact with your course</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Active Course</FormLabel>
                              <FormDescription>
                                Make this course discoverable to students
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="allow_discussions"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Discussions</FormLabel>
                              <FormDescription>
                                Allow students to discuss course content
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="allow_reviews"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Reviews & Ratings</FormLabel>
                              <FormDescription>
                                Let students rate and review the course
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="certificate_enabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Certificates</FormLabel>
                              <FormDescription>
                                Issue completion certificates to students
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Course Summary</CardTitle>
                    <CardDescription>Review your course before creating</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Title:</span>
                        <span className="font-medium">{form.watch('title') || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">
                          {courseCategories.find(c => c.id === form.watch('category_id'))?.name || 'Not selected'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Level:</span>
                        <span className="font-medium capitalize">{form.watch('level')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{form.watch('duration_hours')} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">
                          {form.watch('price') === 0 ? 'Free' : `${form.watch('currency')} ${form.watch('price')}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tags:</span>
                        <span className="font-medium">{tags.length} tags</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Learning outcomes:</span>
                        <span className="font-medium">{learningOutcomes.length} objectives</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {step < 4 ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!!getStepValidation()}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Creating...' : 'Create Course'}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
