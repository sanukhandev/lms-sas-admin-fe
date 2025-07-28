import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, User, MapPin, Save, Trash2 } from 'lucide-react'

interface EditScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  scheduleId: string
  courseId: string
  sessionData?: any
  onSuccess: () => void
}

export function EditScheduleDialog({ 
  open, 
  onOpenChange, 
  scheduleId,
  courseId,
  sessionData,
  onSuccess 
}: EditScheduleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Scheduled Class</DialogTitle>
          <DialogDescription>
            Modify the details of your scheduled class session
          </DialogDescription>
        </DialogHeader>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-6">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Edit Class Schedule</h3>
              <p className="text-muted-foreground mb-4">
                Edit class scheduling form will be implemented here with:
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Update Date & Time</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Adjust Duration</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Change Tutor Assignment</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Update Meeting URL</span>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mt-6">
                <Button variant="default" className="flex items-center" onClick={() => onOpenChange(false)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="destructive" className="flex items-center" onClick={() => onOpenChange(false)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
