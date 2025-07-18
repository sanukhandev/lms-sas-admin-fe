import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/services/categories'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../hooks/use-categories'
import { useCategoriesContext } from '../hooks/use-categories-context'

const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255, 'Slug must be less than 255 characters'),
  parent_id: z.number().nullable().optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export function CategoriesDialogs() {
  const {
    // Dialog states
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isBulkDeleteDialogOpen,
    setIsBulkDeleteDialogOpen,

    // Selected data
    selectedCategory,
    setSelectedCategory,
    selectedCategories,
    setSelectedCategories,
  } = useCategoriesContext()

  // Mutations
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  // Form for create/edit
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      parent_id: null,
    },
  })

  // Update form when selected category changes
  useEffect(() => {
    if (selectedCategory && isEditDialogOpen) {
      form.reset({
        name: selectedCategory.name,
        slug: selectedCategory.slug,
        parent_id: selectedCategory.parent_id,
      })
    } else if (isCreateDialogOpen) {
      form.reset({
        name: '',
        slug: '',
        parent_id: null,
      })
    }
  }, [selectedCategory, isEditDialogOpen, isCreateDialogOpen, form])

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    form.setValue('slug', slug)
  }

  // Handle create category
  const handleCreateCategory = async (data: CategoryFormValues) => {
    try {
      const createData: CreateCategoryRequest = {
        name: data.name,
        slug: data.slug,
        parent_id: data.parent_id,
      }

      await createMutation.mutateAsync(createData)
      setIsCreateDialogOpen(false)
      form.reset()
      toast.success('Category created successfully')
    } catch (error) {
      toast.error('Failed to create category')
    }
  }

  // Handle update category
  const handleUpdateCategory = async (data: CategoryFormValues) => {
    if (!selectedCategory) return

    try {
      const updateData: UpdateCategoryRequest = {
        name: data.name,
        slug: data.slug,
        parent_id: data.parent_id,
      }

      await updateMutation.mutateAsync({
        id: selectedCategory.id,
        data: updateData,
      })
      setIsEditDialogOpen(false)
      setSelectedCategory(null)
      form.reset()
      toast.success('Category updated successfully')
    } catch (error) {
      toast.error('Failed to update category')
    }
  }

  // Handle delete category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return

    try {
      await deleteMutation.mutateAsync(selectedCategory.id)
      setIsDeleteDialogOpen(false)
      setSelectedCategory(null)
      toast.success('Category deleted successfully')
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedCategories.map((id) => deleteMutation.mutateAsync(id))
      )
      setIsBulkDeleteDialogOpen(false)
      setSelectedCategories([])
      toast.success(
        `${selectedCategories.length} categories deleted successfully`
      )
    } catch (error) {
      toast.error('Failed to delete categories')
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending
  const isDeleting = deleteMutation.isPending

  return (
    <>
      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false)
            setIsEditDialogOpen(false)
            setSelectedCategory(null)
            form.reset()
          }
        }}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
            <DialogDescription>
              {isEditDialogOpen
                ? 'Update the category information below.'
                : 'Add a new category to organize your courses.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                isEditDialogOpen ? handleUpdateCategory : handleCreateCategory
              )}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter category name'
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          if (!isEditDialogOpen) {
                            handleNameChange(e.target.value)
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='category-slug'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Used in URLs. Only lowercase letters, numbers, and
                      hyphens.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    setIsEditDialogOpen(false)
                    setSelectedCategory(null)
                    form.reset()
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  {isEditDialogOpen ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedCategory && (
            <div className='space-y-4'>
              <div className='rounded-lg border p-4'>
                <div className='flex items-center space-x-2'>
                  <div>
                    <h4 className='font-semibold'>{selectedCategory.name}</h4>
                    <p className='text-muted-foreground text-sm'>
                      {selectedCategory.slug}
                    </p>
                  </div>
                </div>
                <div className='mt-2 flex items-center space-x-2'>
                  <Badge variant='outline'>
                    {selectedCategory.courses_count || 0} courses
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDeleteCategory}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Categories</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCategories.length}{' '}
              selected categories? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsBulkDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              <Trash2 className='mr-2 h-4 w-4' />
              Delete {selectedCategories.length} Categories
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
