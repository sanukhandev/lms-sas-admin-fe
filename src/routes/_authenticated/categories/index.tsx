import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CategoriesDialogs } from '@/features/categories/components/categories-dialogs'
import { CategoriesPrimaryButtons } from '@/features/categories/components/categories-primary-buttons'
import { CategoriesTable } from '@/features/categories/components/categories-table'
import { CategoryStats } from '@/features/categories/components/category-stats'
import CategoriesProvider from '@/features/categories/context/categories-context'

export const Route = createFileRoute('/_authenticated/categories/')({
  component: Categories,
})

export default function Categories() {
  return (
    <CategoriesProvider>
      <Header>
        <Search placeholder='Search categories...' className='w-full sm:w-64' />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Categories</h1>
            <p className='text-muted-foreground mt-2'>
              Manage your course categories and subcategories
            </p>
          </div>
          <CategoriesPrimaryButtons />
        </div>

        <div className='space-y-6'>
          <CategoryStats />
          <CategoriesTable />
        </div>
      </Main>
      <CategoriesDialogs />
    </CategoriesProvider>
  )
}
