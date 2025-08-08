import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  BookOpen,
  Settings,
  Palette,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateHierarchyNode } from '../hooks/use-course-hierarchy'
import type { HierarchyNode } from '../types'

// Form validation schema
const courseFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Course title is required')
    .max(255, 'Title is too long'),
  description: z.string().optional(),
  short_description: z
    .string()
    .max(500, 'Short description is too long')
    .optional(),
  category_id: z.string().min(1, 'Category is required'),
  instructor_id: z.string().optional(),
  schedule_level: z.enum(['course', 'module', 'chapter']),
  status: z.enum(['draft', 'published', 'archived']),
  access_model: z.enum(['free', 'paid', 'subscription']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number().min(0, 'Price must be positive').optional(),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  requirements: z.array(z.string()).optional(),
  what_you_will_learn: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

type CourseFormValues = z.infer<typeof courseFormSchema>

interface CourseCreationWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (course: HierarchyNode) => void
}

const WIZARD_STEPS = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Set up the fundamental course details',
    icon: BookOpen,
  },
  {
    id: 'settings',
    title: 'Course Settings',
    description: 'Configure access, pricing, and scheduling',
    icon: Settings,
  },
  {
    id: 'content',
    title: 'Content Setup',
    description: 'Define learning objectives and requirements',
    icon: Palette,
  },
]

export function CourseCreationWizard({
  open,
  onOpenChange,
  onSuccess,
}: CourseCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const createNodeMutation = useCreateHierarchyNode()

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      short_description: '',
      category_id: '',
      instructor_id: '',
      schedule_level: 'chapter',
      status: 'draft',
      access_model: 'free',
      level: 'beginner',
      currency: 'USD',
      requirements: [],
      what_you_will_learn: [],
      tags: [],
    },
  })

  const handleNext = async () => {
    // Validate current step fields
    const isValid = await form.trigger(getStepFields(currentStep))
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length - 1))
    }
  }

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (values: CourseFormValues) => {
    try {
      const courseData = {
        ...values,
        content_type: 'course' as const,
        // Convert arrays to proper format
        requirements: values.requirements?.filter(Boolean) || [],
        what_you_will_learn: values.what_you_will_learn?.filter(Boolean) || [],
        tags: values.tags?.filter(Boolean) || [],
      }

      const newCourse = await createNodeMutation.mutateAsync(courseData)
      onSuccess(newCourse)
    } catch (_error) {
      // Error handling is done by the mutation hook
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setCurrentStep(0)
    form.reset()
  }

  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <BookOpen className='h-5 w-5' />
            Create New Course
          </DialogTitle>
          <DialogDescription>
            Follow the steps to create a comprehensive course with proper
            structure
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span>
              Step {currentStep + 1} of {WIZARD_STEPS.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className='h-2' />
        </div>

        {/* Step Navigation */}
        <div className='flex items-center justify-between border-b pb-4'>
          {WIZARD_STEPS.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep

            return (
              <div key={step.id} className='flex items-center'>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isActive
                        ? 'border-primary bg-background text-primary'
                        : 'border-muted-foreground/25 bg-background text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <Check className='h-5 w-5' />
                  ) : (
                    <Icon className='h-5 w-5' />
                  )}
                </div>
                <div className='ml-3 hidden md:block'>
                  <p
                    className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {step.title}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    {step.description}
                  </p>
                </div>
                {index < WIZARD_STEPS.length - 1 && (
                  <div className='bg-muted-foreground/25 mx-4 hidden h-px w-8 md:block' />
                )}
              </div>
            )
          })}
        </div>

        {/* Form Content */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <div className='max-h-[50vh] overflow-y-auto pr-2'>
              {currentStep === 0 && <BasicInformationStep form={form} />}
              {currentStep === 1 && <CourseSettingsStep form={form} />}
              {currentStep === 2 && <ContentSetupStep form={form} />}
            </div>

            {/* Navigation Buttons */}
            <div className='flex items-center justify-between border-t pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={handlePrev}
                disabled={currentStep === 0}
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                Previous
              </Button>

              <div className='flex gap-2'>
                <Button type='button' variant='outline' onClick={handleClose}>
                  Cancel
                </Button>

                {currentStep < WIZARD_STEPS.length - 1 ? (
                  <Button type='button' onClick={handleNext}>
                    Next
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                ) : (
                  <Button type='submit' disabled={createNodeMutation.isPending}>
                    {createNodeMutation.isPending
                      ? 'Creating...'
                      : 'Create Course'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// Step Components
function BasicInformationStep({
  form,
}: {
  form: UseFormReturn<CourseFormValues>
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Course Information</CardTitle>
        <CardDescription>
          Provide the essential details about your course
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title *</FormLabel>
              <FormControl>
                <Input placeholder='Enter course title...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='short_description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Input placeholder='Brief course summary...' {...field} />
              </FormControl>
              <FormDescription>
                A brief summary that appears in course listings
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Detailed course description...'
                  className='h-24'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Comprehensive description of what the course covers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='category_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='1'>Web Development</SelectItem>
                    <SelectItem value='2'>Data Science</SelectItem>
                    <SelectItem value='3'>Mobile Development</SelectItem>
                    <SelectItem value='4'>Design</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='level'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='beginner'>Beginner</SelectItem>
                    <SelectItem value='intermediate'>Intermediate</SelectItem>
                    <SelectItem value='advanced'>Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function CourseSettingsStep({
  form,
}: {
  form: UseFormReturn<CourseFormValues>
}) {
  const accessModel = form.watch('access_model')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
        <CardDescription>
          Configure access, pricing, and scheduling options
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='draft'>Draft</SelectItem>
                    <SelectItem value='published'>Published</SelectItem>
                    <SelectItem value='archived'>Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='access_model'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Model</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='free'>Free</SelectItem>
                    <SelectItem value='paid'>One-time Payment</SelectItem>
                    <SelectItem value='subscription'>Subscription</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {accessModel !== 'free' && (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='0.00'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='currency'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='USD'>USD</SelectItem>
                      <SelectItem value='EUR'>EUR</SelectItem>
                      <SelectItem value='GBP'>GBP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name='schedule_level'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scheduling Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='course'>Course Level</SelectItem>
                  <SelectItem value='module'>Module Level</SelectItem>
                  <SelectItem value='chapter'>Chapter Level</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Determines at which level classes can be scheduled
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

function ContentSetupStep({ form }: { form: UseFormReturn<CourseFormValues> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Setup</CardTitle>
        <CardDescription>
          Define what students will learn and course requirements
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='bg-muted/50 rounded-lg border p-4'>
          <h4 className='mb-2 font-medium'>Course Structure Preview</h4>
          <div className='space-y-2 text-sm'>
            <div className='flex items-center gap-2'>
              <Badge variant='outline'>Course</Badge>
              <span>{form.watch('title') || 'Your Course Title'}</span>
            </div>
            <div className='text-muted-foreground ml-4 space-y-1'>
              <div>↳ Modules (to be added later)</div>
              <div className='ml-4'>↳ Chapters (to be added later)</div>
              <div className='ml-8'>↳ Classes (to be added later)</div>
            </div>
          </div>
        </div>

        <div className='text-muted-foreground text-center text-sm'>
          <p>
            After creating your course, you'll be able to add modules, chapters,
            and classes using the hierarchy tree interface.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to get fields to validate for each step
function getStepFields(step: number): (keyof CourseFormValues)[] {
  switch (step) {
    case 0:
      return ['title', 'category_id']
    case 1:
      return ['status', 'access_model']
    case 2:
      return []
    default:
      return []
  }
}
