import { CoursesCreateDialog } from './courses-create-dialog'
import { CoursesEditDialog } from './courses-edit-dialog'
import { CoursesDeleteDialog } from './courses-delete-dialog'
import { CoursesViewDialog } from './courses-view-dialog'

export function CoursesDialogs() {
  return (
    <>
      <CoursesCreateDialog />
      <CoursesEditDialog />
      <CoursesDeleteDialog />
      <CoursesViewDialog />
    </>
  )
}
