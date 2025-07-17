import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCoursesContext } from '../context/courses-context'

export function CoursesEditDialog() {
  const { selectedCourse, isEditDialogOpen, setIsEditDialogOpen } = useCoursesContext()

  if (!selectedCourse) return null

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>
            Edit course details for {selectedCourse.title}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Edit form will be implemented here.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
