import { useState, useEffect } from 'react'
import { coursesService, type TeachingPlan } from '@/services/courses'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen,
  Target,
  FileText,
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface TeachingPlanManagerProps {
  courseId: string
}

export function TeachingPlanManager({ courseId }: TeachingPlanManagerProps) {
  const [plans, setPlans] = useState<TeachingPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeachingPlans()
  }, [courseId])

  const loadTeachingPlans = async () => {
    try {
      setLoading(true)
      const response = await coursesService.getClassPlanner(courseId)
      setPlans(response.data)
    } catch (error) {
      console.error('Error loading teaching plans:', error)
      toast.error('Failed to load teaching plans')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlan = () => {
    toast.info('Create teaching plan dialog will be implemented')
  }

  const handleEditPlan = (plan: TeachingPlan) => {
    toast.info(`Edit teaching plan: ${plan.id}`)
  }

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this teaching plan?')) {
      return
    }

    try {
      await coursesService.deleteTeachingPlan(courseId, planId)
      toast.success('Teaching plan deleted successfully')
      loadTeachingPlans()
    } catch (error) {
      console.error('Error deleting teaching plan:', error)
      toast.error('Failed to delete teaching plan')
    }
  }

  const getPriorityBadge = (priority: number) => {
    if (priority <= 2) return <Badge variant="destructive">High</Badge>
    if (priority <= 4) return <Badge variant="default">Medium</Badge>
    return <Badge variant="secondary">Low</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading teaching plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Teaching Plans</CardTitle>
              <CardDescription>
                Plan and prepare your lessons for systematic course delivery
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {plans.length} plans
              </Badge>
              <Button onClick={handleCreatePlan}>
                <Plus className="mr-2 h-4 w-4" />
                Create Plan
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Plans List */}
      {plans.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No Teaching Plans</h3>
              <p className="text-muted-foreground mb-4">
                Create teaching plans to organize your lesson preparation and delivery.
              </p>
              <Button onClick={handleCreatePlan}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {plan.contentTitle || `${plan.classType} Class`}
                      </h3>
                      {getPriorityBadge(plan.priority)}
                      <Badge variant="outline">{plan.status}</Badge>
                      {plan.isFlexible && (
                        <Badge variant="secondary">Flexible</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(plan.plannedDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{plan.durationMins} minutes</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{plan.instructorName || 'Unassigned'}</span>
                      </div>
                    </div>

                    {(plan.learningObjectives || plan.prerequisites || plan.materialsNeeded) && (
                      <div className="space-y-2">
                        {plan.learningObjectives && (
                          <div className="flex items-start space-x-2">
                            <Target className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Learning Objectives:</p>
                              <p className="text-sm text-muted-foreground">{plan.learningObjectives}</p>
                            </div>
                          </div>
                        )}

                        {plan.prerequisites && (
                          <div className="flex items-start space-x-2">
                            <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Prerequisites:</p>
                              <p className="text-sm text-muted-foreground">{plan.prerequisites}</p>
                            </div>
                          </div>
                        )}

                        {plan.materialsNeeded && (
                          <div className="flex items-start space-x-2">
                            <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Materials Needed:</p>
                              <p className="text-sm text-muted-foreground">{plan.materialsNeeded}</p>
                            </div>
                          </div>
                        )}

                        {plan.notes && (
                          <div className="flex items-start space-x-2">
                            <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Notes:</p>
                              <p className="text-sm text-muted-foreground">{plan.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditPlan(plan)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Class
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Plan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
