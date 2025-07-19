import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useCategories } from '@/hooks/use-categories'
import { columns } from './components/categories-columns'
import { CategoriesDialogs } from './components/categories-dialogs'
import { CategoriesPrimaryButtons } from './components/categories-primary-buttons'
import { CategoriesTable } from './components/categories-table'
import { CategoryStats } from './components/category-stats'
import CategoriesProvider from './context/categories-context'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function Categories() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState<string>()
  const [parentId, setParentId] = useState<number | null>(null)
  const [rootOnly, setRootOnly] = useState(false)

  const { data: categoriesResponse, isLoading, error } = useCategories({
    page,
    perPage,
    search,
    parentId,
    rootOnly,
  })

  const categoryList = categoriesResponse?.data || []

  return (
    <CategoriesProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        {/* Category Statistics */}
        <CategoryStats />

        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Category Management</h2>
            <p className='text-muted-foreground'>
              Organize your courses with categories and subcategories.
            </p>
          </div>
          <CategoriesPrimaryButtons />
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <Card>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className='flex items-center space-x-4'>
                      <Skeleton className='h-4 w-4' />
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='h-4 w-48' />
                      <Skeleton className='h-4 w-24' />
                      <Skeleton className='h-4 w-16' />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className='pt-6'>
                <div className='text-center text-red-500'>
                  Failed to load categories. Please try again.
                </div>
              </CardContent>
            </Card>
          ) : (
            <CategoriesTable 
              data={categoryList} 
              columns={columns}
              pagination={{
                page,
                perPage,
                total: categoriesResponse?.meta.total || 0,
                lastPage: categoriesResponse?.meta.last_page || 1,
                onPageChange: setPage,
                onPerPageChange: setPerPage,
              }}
              filters={{
                search,
                parentId,
                rootOnly,
                onSearchChange: setSearch,
                onParentIdChange: setParentId,
                onRootOnlyChange: setRootOnly,
              }}
            />
          )}
        </div>
      </Main>

      <CategoriesDialogs />
    </CategoriesProvider>
  )
}
