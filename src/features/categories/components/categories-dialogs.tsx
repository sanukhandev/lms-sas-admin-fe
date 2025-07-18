import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/services/categories'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../hooks/use-categories'
import { useCategories } from '../hooks/use-categories'
import { useCategoriesContext } from '../hooks/use-categories-context'

const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  slug: z.string().optional(),
  parent_id: z.number().nullable().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

export const CategoriesDialogs = () => {
  const {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isBulkDeleteDialogOpen,
    setIsBulkDeleteDialogOpen,
    selectedCategory,
    selectedCategories,
    setSelectedCategories,
  } = useCategoriesContext()

  const { data: categoriesData } = useCategories()
  const categories = categoriesData?.data || []
  const parentCategories = categories.filter((cat: Category) => !cat.parent_id)

  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      parent_id: null,
    },
  })

  // Generate slug from name
  const watchedName = watch('name')
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  // Auto-generate slug when name changes
  useEffect(() => {
    if (watchedName && isCreateDialogOpen) {
      setValue('slug', generateSlug(watchedName))
    }
  }, [watchedName, setValue, isCreateDialogOpen])

  // Reset form when dialog opens
  useEffect(() => {
    if (isEditDialogOpen && selectedCategory) {
      reset({
        name: selectedCategory.name,
        slug: selectedCategory.slug,
        parent_id: selectedCategory.parent_id,
      })
    } else if (isCreateDialogOpen) {
      reset({
        name: '',
        slug: '',
        parent_id: null,
      })
    }
  }, [isEditDialogOpen, isCreateDialogOpen, selectedCategory, reset])

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true)

      if (isCreateDialogOpen) {
        const createData: CreateCategoryRequest = {
          name: data.name,
          slug: data.slug || generateSlug(data.name),
          parent_id: data.parent_id,
        }

        await createMutation.mutateAsync(createData)
        setIsCreateDialogOpen(false)
      } else if (isEditDialogOpen && selectedCategory) {
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
      }

      reset()
    } catch (_error) {
      toast.error('Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCategory) return

    try {
      await deleteMutation.mutateAsync(selectedCategory.id)
      setIsDeleteDialogOpen(false)
    } catch (_error) {
      toast.error('Failed to delete category')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) return

    try {
      await Promise.all(
        selectedCategories.map((id: number) => deleteMutation.mutateAsync(id))
      )
      toast.success(
        `${selectedCategories.length} categories deleted successfully`
      )
      setSelectedCategories([])
      setIsBulkDeleteDialogOpen(false)
    } catch (_error) {
      toast.error('Failed to delete categories')
    }
  }

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false)
    reset()
  }

  const closeEditDialog = () => {
    setIsEditDialogOpen(false)
    reset()
  }

  // Create/Edit Dialog
  const isFormDialog = isCreateDialogOpen || isEditDialogOpen

  return (
    <>
      {/* Create/Edit Dialog */}
      <Dialog
        open={isFormDialog}
        onOpenChange={isCreateDialogOpen ? closeCreateDialog : closeEditDialog}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {isCreateDialogOpen ? 'Create Category' : 'Edit Category'}
            </DialogTitle>
            <DialogDescription>
              {isCreateDialogOpen
                ? 'Create a new category to organize your courses.'
                : 'Edit the category details below.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                placeholder='Enter category name'
                {...register('name')}
              />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='slug'>Slug</Label>
              <Input
                id='slug'
                placeholder='category-slug'
                {...register('slug')}
              />
              {errors.slug && (
                <p className='text-sm text-red-500'>{errors.slug.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='parent_id'>Parent Category</Label>
              <Select
                value={watch('parent_id')?.toString() || ''}
                onValueChange={(value) => {
                  setValue('parent_id', value === '' ? null : Number(value))
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select parent category (optional)' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>No parent (root category)</SelectItem>
                  {parentCategories.map((category: Category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={
                  isCreateDialogOpen ? closeCreateDialog : closeEditDialog
                }
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : isCreateDialogOpen
                    ? 'Create'
                    : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category
              {selectedCategory && (
                <span className='font-semibold'>
                  {' '}
                  "{selectedCategory.name}"
                </span>
              )}
              {selectedCategory?.courses_count &&
                selectedCategory.courses_count > 0 && (
                  <span className='text-red-600'>
                    {' '}
                    and all {selectedCategory.courses_count} associated courses
                  </span>
                )}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700'
              disabled={deleteMutation.isPending}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Categories</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCategories.length}{' '}
              categories? This action cannot be undone and will permanently
              delete all selected categories and their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className='bg-red-600 hover:bg-red-700'
              disabled={deleteMutation.isPending}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              {deleteMutation.isPending
                ? 'Deleting...'
                : `Delete ${selectedCategories.length} Categories`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
