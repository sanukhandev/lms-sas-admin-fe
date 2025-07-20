import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { 
  BookOpen, 
  Users, 
  Clock, 
  DollarSign, 
  Star, 
  Calendar,
  BarChart3,
  Target
} from 'lucide-react'
import { type Course } from '@/services/courses'

interface CourseDetailsDialogProps {
  course: Course | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CourseDetailsDialog({ course, open, onOpenChange }: CourseDetailsDialogProps) {
  if (!course) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>{course.title}</span>
          </DialogTitle>
          <DialogDescription>
            Complete course information and statistics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Course Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Instructor:</span>
                  <span className="text-sm">{course.instructorName || 'Unassigned'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Category:</span>
                  <Badge variant="outline">{course.categoryName || 'Uncategorized'}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Level:</span>
                  <Badge variant="secondary">{course.level || 'Beginner'}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Duration:</span>
                  <span className="text-sm">{course.duration_hours || 'TBD'} hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Price:</span>
                  <span className="text-sm">
                    {course.price ? `${course.currency || 'USD'} ${course.price}` : 'Free'}
                  </span>
                </div>
                {course.average_rating && (
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Rating:</span>
                    <span className="text-sm">{course.average_rating.toFixed(1)}/5</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {course.description || course.short_description || 'No description available.'}
            </p>
          </div>

          <Separator />

          {/* Statistics */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Enrolled Students</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {course.enrollmentCount?.toLocaleString() || 0}
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Completion Rate</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {course.completionRate?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Content Items</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {course.content_count || 0}
                </p>
              </div>
            </div>
          </div>

          {course.what_you_will_learn && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">What You'll Learn</h3>
                <div className="text-sm text-muted-foreground">
                  {typeof course.what_you_will_learn === 'string' ? (
                    <p>{course.what_you_will_learn}</p>
                  ) : (
                    <ul className="list-disc list-inside space-y-1">
                      {course.what_you_will_learn 
                        ? (Array.isArray(course.what_you_will_learn) 
                            ? (course.what_you_will_learn as string[]).map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                              ))
                            : <li>{course.what_you_will_learn}</li>)
                        : <li>No learning objectives listed</li>
                      }
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}

          {course.requirements && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Requirements</h3>
                <div className="text-sm text-muted-foreground">
                  {typeof course.requirements === 'string' ? (
                    <p>{course.requirements}</p>
                  ) : (
                    <ul className="list-disc list-inside space-y-1">
                      {course.requirements 
                        ? (Array.isArray(course.requirements) 
                            ? (course.requirements as string[]).map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                              ))
                            : <li>{course.requirements}</li>)
                        : <li>No requirements listed</li>
                      }
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Metadata */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Course Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Status:</span>
                <Badge 
                  variant={course.status === 'published' ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {course.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Active:</span>
                <Badge 
                  variant={course.is_active ? 'default' : 'destructive'}
                  className="ml-2"
                >
                  {course.is_active ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Created:</span>
                <span className="text-muted-foreground">
                  {new Date(course.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Updated:</span>
                <span className="text-muted-foreground">
                  {new Date(course.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {course.tags && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {(typeof course.tags === 'string' ? course.tags.split(',') : course.tags).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
