import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategoriesContext } from '../context/categories-context'
import { useCategories } from '@/hooks/use-categories'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesService } from '@/services/categories'
import { toast } from 'sonner'

export function CategoriesEditDialog() {
  const { selectedCategory, isEditDialogOpen, setIsEditDialogOpen } = useCategoriesContext()
  const { data: categories } = useCategories({ 
    page: 1, 
    perPage: 100, 
    rootOnly: true 
  }, { 
    enabled: isEditDialogOpen,
    staleTime: 1000 * 60 * 15, // 15 minutes for parent selection
  })
  const queryClient = useQueryClient()
  
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [parentId, setParentId] = useState<string>('')
  const [description, setDescription] = useState('')

  // Filter out the current category and its descendants from parent options
  const availableParents = categories?.data?.filter((category) => 
    category.id !== selectedCategory?.id
  ) || []

  // Populate form when category is selected
  useEffect(() => {
    if (selectedCategory) {
      setName(selectedCategory.name)
      setSlug(selectedCategory.slug)
      setParentId(selectedCategory.parent_id?.toString() || '')
      setDescription('') // Description not available in current interface
    }
  }, [selectedCategory])

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => 
      categoriesService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categoryStats'] })
      queryClient.invalidateQueries({ queryKey: ['categoryTree'] })
      queryClient.invalidateQueries({ queryKey: ['categoryDropdown'] })
      
      toast.success('Category updated successfully')
      handleClose()
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Failed to update category')
    },
  })

  const handleSubmit = () => {
    if (!selectedCategory) return
    
    if (!name.trim()) {
      toast.error('Category name is required')
      return
    }

    updateMutation.mutate({
      id: selectedCategory.id,
      data: {
        name: name.trim(),
        slug: slug.trim() || undefined,
        parent_id: parentId ? Number(parentId) : null,
        description: description.trim() || undefined,
      }
    })
  }

  const handleClose = () => {
    setIsEditDialogOpen(false)
    setName('')
    setSlug('')
    setParentId('')
    setDescription('')
  }

  if (!selectedCategory) return null

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category details for "{selectedCategory.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Category name"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slug" className="text-right">
              Slug
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="col-span-3"
              placeholder="category-slug"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parent" className="text-right">
              Parent
            </Label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select parent category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No parent (root category)</SelectItem>
                {availableParents.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Category description (optional)"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={updateMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Updating...' : 'Update Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
