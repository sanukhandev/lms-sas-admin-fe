import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCategoriesContext } from '../context/categories-context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesService } from '@/services/categories'
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'

export function CategoriesDeleteDialog() {
  const { selectedCategory, isDeleteDialogOpen, setIsDeleteDialogOpen } = useCategoriesContext()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categoryStats'] })
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] })
      queryClient.invalidateQueries({ queryKey: ['categoryDropdown'] })
      
      toast.success('Category deleted successfully')
      setIsDeleteDialogOpen(false)
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Failed to delete category')
    },
  })

  const handleDelete = () => {
    if (!selectedCategory) return
    deleteMutation.mutate(selectedCategory.id)
  }

  if (!selectedCategory) return null

  const hasSubcategories = (selectedCategory.subcategories_count || 0) > 0
  const hasCourses = (selectedCategory.courses_count || 0) > 0

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Category
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{selectedCategory.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {(hasSubcategories || hasCourses) && (
          <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Warning
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>This category contains:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {hasCourses && (
                      <li>{selectedCategory.courses_count} course(s)</li>
                    )}
                    {hasSubcategories && (
                      <li>{selectedCategory.subcategories_count} subcategory(ies)</li>
                    )}
                  </ul>
                  <p className="mt-2">
                    Deleting this category will also affect its contents. Consider moving them to another category first.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
