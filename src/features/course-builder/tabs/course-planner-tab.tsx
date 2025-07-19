import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Calendar as CalendarIcon,
  Target,
  Clock,
  BookOpen,
  CheckCircle,
  Circle,
  BarChart3,
  Lightbulb,
  Zap,
  FileText,
  Video,
  Download
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface LearningObjective {
  id: string
  text: string
  completed: boolean
}

interface Milestone {
  id: string
  title: string
  description: string
  deadline: Date | undefined
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

interface ContentPlan {
  id: string
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'resource'
  title: string
  duration: number
  status: 'planned' | 'in-progress' | 'completed'
}

export function CoursePlannerTab() {
  const [learningObjectives, setLearningObjectives] = useState<LearningObjective[]>([
    { id: '1', text: 'Master the fundamentals of React hooks', completed: true },
    { id: '2', text: 'Build responsive user interfaces', completed: false },
    { id: '3', text: 'Implement state management patterns', completed: false },
    { id: '4', text: 'Create reusable component libraries', completed: false },
  ])

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'Course Outline Complete',
      description: 'Finalize all module and chapter structures',
      deadline: new Date('2025-08-15'),
      completed: true,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Content Creation 50%',
      description: 'Complete half of all video content',
      deadline: new Date('2025-09-01'),
      completed: false,
      priority: 'high'
    },
    {
      id: '3',
      title: 'Assessment Design',
      description: 'Create quizzes and assignments',
      deadline: new Date('2025-09-15'),
      completed: false,
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Beta Testing',
      description: 'Run course with test group',
      deadline: new Date('2025-10-01'),
      completed: false,
      priority: 'medium'
    },
  ])

  const [contentPlan, setContentPlan] = useState<ContentPlan[]>([
    { id: '1', type: 'video', title: 'Introduction to React', duration: 15, status: 'completed' },
    { id: '2', type: 'text', title: 'Setting up Development Environment', duration: 10, status: 'completed' },
    { id: '3', type: 'video', title: 'Understanding Components', duration: 25, status: 'in-progress' },
    { id: '4', type: 'quiz', title: 'React Basics Quiz', duration: 5, status: 'planned' },
    { id: '5', type: 'video', title: 'State and Props', duration: 30, status: 'planned' },
    { id: '6', type: 'assignment', title: 'Build Your First Component', duration: 60, status: 'planned' },
  ])

  const addLearningObjective = () => {
    const newObjective: LearningObjective = {
      id: Date.now().toString(),
      text: '',
      completed: false
    }
    setLearningObjectives([...learningObjectives, newObjective])
  }

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: '',
      description: '',
      deadline: undefined,
      completed: false,
      priority: 'medium'
    }
    setMilestones([...milestones, newMilestone])
  }

  const addContentItem = () => {
    const newContent: ContentPlan = {
      id: Date.now().toString(),
      type: 'video',
      title: '',
      duration: 0,
      status: 'planned'
    }
    setContentPlan([...contentPlan, newContent])
  }

  const getContentIcon = (type: ContentPlan['type']) => {
    switch (type) {
      case 'video': return <Video className='h-4 w-4' />
      case 'text': return <FileText className='h-4 w-4' />
      case 'quiz': return <CheckCircle className='h-4 w-4' />
      case 'assignment': return <BookOpen className='h-4 w-4' />
      case 'resource': return <Download className='h-4 w-4' />
      default: return <Circle className='h-4 w-4' />
    }
  }

  const getStatusColor = (status: ContentPlan['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-yellow-500'
      case 'planned': return 'bg-gray-300'
      default: return 'bg-gray-300'
    }
  }

  const getPriorityColor = (priority: Milestone['priority']) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  const completedObjectives = learningObjectives.filter(obj => obj.completed).length
  const completedMilestones = milestones.filter(milestone => milestone.completed).length
  const completedContent = contentPlan.filter(content => content.status === 'completed').length
  const totalDuration = contentPlan.reduce((sum, content) => sum + content.duration, 0)

  return (
    <div className='space-y-6'>
      {/* Overview Cards */}
      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Learning Objectives</CardTitle>
            <Target className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{completedObjectives}/{learningObjectives.length}</div>
            <Progress value={(completedObjectives / learningObjectives.length) * 100} className='mt-2' />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Milestones</CardTitle>
            <CalendarIcon className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{completedMilestones}/{milestones.length}</div>
            <Progress value={(completedMilestones / milestones.length) * 100} className='mt-2' />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Content Items</CardTitle>
            <BookOpen className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{completedContent}/{contentPlan.length}</div>
            <Progress value={(completedContent / contentPlan.length) * 100} className='mt-2' />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Duration</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</div>
            <p className='text-xs text-muted-foreground mt-1'>Estimated course length</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='objectives' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='objectives'>Learning Objectives</TabsTrigger>
          <TabsTrigger value='milestones'>Milestones</TabsTrigger>
          <TabsTrigger value='content'>Content Plan</TabsTrigger>
          <TabsTrigger value='templates'>Templates</TabsTrigger>
        </TabsList>

        <TabsContent value='objectives' className='space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Learning Objectives</CardTitle>
                  <CardDescription>
                    Define what students will achieve by completing this course
                  </CardDescription>
                </div>
                <Button onClick={addLearningObjective} size='sm'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Objective
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {learningObjectives.map((objective, index) => (
                <div key={objective.id} className='flex items-center space-x-3'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      const updated = [...learningObjectives]
                      updated[index].completed = !updated[index].completed
                      setLearningObjectives(updated)
                    }}
                  >
                    {objective.completed ? 
                      <CheckCircle className='h-4 w-4 text-green-500' /> : 
                      <Circle className='h-4 w-4' />
                    }
                  </Button>
                  <Input
                    value={objective.text}
                    onChange={(e) => {
                      const updated = [...learningObjectives]
                      updated[index].text = e.target.value
                      setLearningObjectives(updated)
                    }}
                    placeholder='Enter learning objective...'
                    className={objective.completed ? 'line-through text-muted-foreground' : ''}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='milestones' className='space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Project Milestones</CardTitle>
                  <CardDescription>
                    Track important deadlines and deliverables
                  </CardDescription>
                </div>
                <Button onClick={addMilestone} size='sm'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Milestone
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {milestones.map((milestone, index) => (
                <Card key={milestone.id} className={milestone.completed ? 'opacity-75' : ''}>
                  <CardContent className='pt-4'>
                    <div className='flex items-start space-x-4'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                          const updated = [...milestones]
                          updated[index].completed = !updated[index].completed
                          setMilestones(updated)
                        }}
                      >
                        {milestone.completed ? 
                          <CheckCircle className='h-4 w-4 text-green-500' /> : 
                          <Circle className='h-4 w-4' />
                        }
                      </Button>
                      <div className='flex-1 space-y-3'>
                        <div className='flex items-center justify-between'>
                          <Input
                            value={milestone.title}
                            onChange={(e) => {
                              const updated = [...milestones]
                              updated[index].title = e.target.value
                              setMilestones(updated)
                            }}
                            placeholder='Milestone title...'
                            className='font-medium'
                          />
                          <Badge variant={getPriorityColor(milestone.priority)}>
                            {milestone.priority}
                          </Badge>
                        </div>
                        <Textarea
                          value={milestone.description}
                          onChange={(e) => {
                            const updated = [...milestones]
                            updated[index].description = e.target.value
                            setMilestones(updated)
                          }}
                          placeholder='Milestone description...'
                          rows={2}
                        />
                        <div className='flex items-center space-x-2'>
                          <CalendarIcon className='h-4 w-4 text-muted-foreground' />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant='outline'
                                className={cn(
                                  'justify-start text-left font-normal',
                                  !milestone.deadline && 'text-muted-foreground'
                                )}
                              >
                                {milestone.deadline ? format(milestone.deadline, 'PPP') : 'Set deadline'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0'>
                              <Calendar
                                mode='single'
                                selected={milestone.deadline}
                                onSelect={(date) => {
                                  const updated = [...milestones]
                                  updated[index].deadline = date
                                  setMilestones(updated)
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='content' className='space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Content Planning</CardTitle>
                  <CardDescription>
                    Organize and track your course content creation
                  </CardDescription>
                </div>
                <Button onClick={addContentItem} size='sm'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Content
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {contentPlan.map((content, index) => (
                <div key={content.id} className='flex items-center space-x-4 p-3 border rounded-lg'>
                  <div className={cn('w-3 h-3 rounded-full', getStatusColor(content.status))} />
                  <div className='flex items-center space-x-2'>
                    {getContentIcon(content.type)}
                    <Select
                      value={content.type}
                      onValueChange={(value: ContentPlan['type']) => {
                        const updated = [...contentPlan]
                        updated[index].type = value
                        setContentPlan(updated)
                      }}
                    >
                      <SelectTrigger className='w-32'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='video'>Video</SelectItem>
                        <SelectItem value='text'>Text</SelectItem>
                        <SelectItem value='quiz'>Quiz</SelectItem>
                        <SelectItem value='assignment'>Assignment</SelectItem>
                        <SelectItem value='resource'>Resource</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    value={content.title}
                    onChange={(e) => {
                      const updated = [...contentPlan]
                      updated[index].title = e.target.value
                      setContentPlan(updated)
                    }}
                    placeholder='Content title...'
                    className='flex-1'
                  />
                  <div className='flex items-center space-x-2'>
                    <Clock className='h-4 w-4 text-muted-foreground' />
                    <Input
                      type='number'
                      value={content.duration}
                      onChange={(e) => {
                        const updated = [...contentPlan]
                        updated[index].duration = parseInt(e.target.value) || 0
                        setContentPlan(updated)
                      }}
                      placeholder='0'
                      className='w-20'
                    />
                    <span className='text-sm text-muted-foreground'>min</span>
                  </div>
                  <Select
                    value={content.status}
                    onValueChange={(value: ContentPlan['status']) => {
                      const updated = [...contentPlan]
                      updated[index].status = value
                      setContentPlan(updated)
                    }}
                  >
                    <SelectTrigger className='w-32'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='planned'>Planned</SelectItem>
                      <SelectItem value='in-progress'>In Progress</SelectItem>
                      <SelectItem value='completed'>Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='templates' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <Card className='cursor-pointer hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='flex items-center space-x-2'>
                  <Lightbulb className='h-5 w-5 text-yellow-500' />
                  <CardTitle className='text-lg'>Beginner Course</CardTitle>
                </div>
                <CardDescription>
                  Perfect for introductory courses with step-by-step progression
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-2 text-sm'>
                  <div>• 6-8 modules</div>
                  <div>• Interactive quizzes</div>
                  <div>• Hands-on projects</div>
                  <div>• Progress tracking</div>
                </div>
              </CardContent>
            </Card>

            <Card className='cursor-pointer hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='flex items-center space-x-2'>
                  <Zap className='h-5 w-5 text-blue-500' />
                  <CardTitle className='text-lg'>Advanced Course</CardTitle>
                </div>
                <CardDescription>
                  For complex topics requiring deep understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-2 text-sm'>
                  <div>• 10-15 modules</div>
                  <div>• Case studies</div>
                  <div>• Advanced projects</div>
                  <div>• Peer reviews</div>
                </div>
              </CardContent>
            </Card>

            <Card className='cursor-pointer hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='flex items-center space-x-2'>
                  <BarChart3 className='h-5 w-5 text-green-500' />
                  <CardTitle className='text-lg'>Microlearning</CardTitle>
                </div>
                <CardDescription>
                  Short, focused lessons for busy learners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-2 text-sm'>
                  <div>• 3-5 modules</div>
                  <div>• 5-minute videos</div>
                  <div>• Quick assessments</div>
                  <div>• Mobile-friendly</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
