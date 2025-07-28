import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, User, MapPin } from 'lucide-react'

interface ScheduleClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: string
  courseStructure: any
  onSuccess: () => void
}

export function ScheduleClassDialog({ 
  open, 
  onOpenChange, 
  courseId, 
  courseStructure, 
  onSuccess 
}: ScheduleClassDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule Class</DialogTitle>
          <DialogDescription>
            Schedule a new class session for your course
          </DialogDescription>
        </DialogHeader>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Schedule Class Form</h3>
              <p className="text-muted-foreground mb-4">
                Complete class scheduling form will be implemented here with:
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date & Time Selection</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Duration Configuration</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Tutor Assignment</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Meeting URL Setup</span>
                </div>
              </div>
              <Button className="mt-4" onClick={() => onOpenChange(false)}>
                Close Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
