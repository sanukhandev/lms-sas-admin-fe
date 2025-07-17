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

export function CoursesDeleteDialog() {
  const { selectedCourse, isDeleteDialogOpen, setIsDeleteDialogOpen } = useCoursesContext()

  if (!selectedCourse) return null

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Course</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{selectedCourse.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive">Delete Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
