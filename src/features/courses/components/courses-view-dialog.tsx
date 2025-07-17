import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useCoursesContext } from '../context/courses-context'

export function CoursesViewDialog() {
  const { selectedCourse, isViewDialogOpen, setIsViewDialogOpen } = useCoursesContext()

  if (!selectedCourse) return null

  return (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{selectedCourse.title}</DialogTitle>
          <DialogDescription>
            Course details and performance metrics
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Instructor</p>
              <p className="text-sm text-muted-foreground">{selectedCourse.instructor}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge variant={selectedCourse.status === 'active' ? 'default' : 'secondary'}>
                {selectedCourse.status}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Total Enrollments</p>
              <p className="text-2xl font-bold">{selectedCourse.enrollments}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Completions</p>
              <p className="text-2xl font-bold">{selectedCourse.completions}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Completion Rate</p>
            <div className="flex items-center space-x-2">
              <Progress value={selectedCourse.completionRate} className="flex-1" />
              <span className="text-sm font-medium">{selectedCourse.completionRate}%</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Average Progress</p>
            <div className="flex items-center space-x-2">
              <Progress value={selectedCourse.averageProgress} className="flex-1" />
              <span className="text-sm font-medium">{selectedCourse.averageProgress}%</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
