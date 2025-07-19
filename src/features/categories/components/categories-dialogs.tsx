import { CategoriesCreateDialog } from './categories-create-dialog'
import { CategoriesEditDialog } from './categories-edit-dialog'
import { CategoriesDeleteDialog } from './categories-delete-dialog'
import { CategoriesViewDialog } from './categories-view-dialog'

export function CategoriesDialogs() {
  return (
    <>
      <CategoriesCreateDialog />
      <CategoriesEditDialog />
      <CategoriesDeleteDialog />
      <CategoriesViewDialog />
    </>
  )
}
