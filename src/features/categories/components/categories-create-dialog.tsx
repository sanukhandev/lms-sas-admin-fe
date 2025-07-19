import { useState } from 'react'
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

export function CategoriesCreateDialog() {
  const { isCreateDialogOpen, setIsCreateDialogOpen } = useCategoriesContext()
  
  // Get categories for parent selection (only root categories for simplicity)
  const { data: categoriesResponse } = useCategories({
    page: 1,
    perPage: 100,
    rootOnly: true,
  }, { 
    enabled: isCreateDialogOpen,
    staleTime: 1000 * 60 * 15, // 15 minutes for parent selection
  })
  
  const queryClient = useQueryClient()
  
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [parentId, setParentId] = useState<string>('')
  const [description, setDescription] = useState('')

  const createMutation = useMutation({
    mutationFn: categoriesService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categoryStats'] })
      
      toast.success('Category created successfully')
      handleClose()
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Failed to create category')
    },
  })

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Category name is required')
      return
    }

    createMutation.mutate({
      name: name.trim(),
      slug: slug.trim() || undefined,
      parent_id: parentId ? Number(parentId) : null,
    })
  }

  const handleClose = () => {
    setIsCreateDialogOpen(false)
    setName('')
    setSlug('')
    setParentId('')
    setDescription('')
  }

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value)
    if (!slug) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    }
  }

  const availableParents = categoriesResponse?.data || []

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Add a new category to organize your courses. You can create subcategories by selecting a parent category.
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
              onChange={(e) => handleNameChange(e.target.value)}
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
          <Button variant="outline" onClick={handleClose} disabled={createMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
