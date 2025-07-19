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
import { useCategoriesContext } from '../context/categories-context'
import { FolderOpen, Folder, BookOpen, Users } from 'lucide-react'

export function CategoriesViewDialog() {
  const { selectedCategory, isViewDialogOpen, setIsViewDialogOpen } = useCategoriesContext()

  if (!selectedCategory) return null

  const hasSubcategories = (selectedCategory.subcategories_count || 0) > 0
  const Icon = hasSubcategories ? FolderOpen : Folder

  return (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {selectedCategory.name}
          </DialogTitle>
          <DialogDescription>
            Category details and statistics
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Category Type</p>
              <Badge variant={selectedCategory.parent_id ? 'secondary' : 'default'}>
                {selectedCategory.parent_id ? 'Subcategory' : 'Root Category'}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Slug</p>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {selectedCategory.slug}
              </code>
            </div>
          </div>

          {selectedCategory.parent && (
            <div>
              <p className="text-sm font-medium">Parent Category</p>
              <p className="text-sm text-muted-foreground">{selectedCategory.parent.name}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{selectedCategory.courses_count || 0}</p>
              <p className="text-sm text-muted-foreground">Total Courses</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Folder className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{selectedCategory.subcategories_count || 0}</p>
              <p className="text-sm text-muted-foreground">Subcategories</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold">{selectedCategory.total_students || 0}</p>
              <p className="text-sm text-muted-foreground">Students</p>
            </div>
          </div>

          {selectedCategory.active_courses_count !== undefined && (
            <div>
              <p className="text-sm font-medium mb-2">Course Status</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">
                    {selectedCategory.active_courses_count} Active
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">
                    {(selectedCategory.courses_count || 0) - (selectedCategory.active_courses_count || 0)} Inactive
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p>Created: {new Date(selectedCategory.created_at).toLocaleDateString()}</p>
            <p>Updated: {new Date(selectedCategory.updated_at).toLocaleDateString()}</p>
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
