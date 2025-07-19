import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useCategories } from '@/hooks/use-categories'
import { useOptimizedTableFilters } from '@/hooks/use-optimized-table-filters'
import { columns } from './components/categories-columns'
import { CategoriesDialogs } from './components/categories-dialogs'
import { CategoriesPrimaryButtons } from './components/categories-primary-buttons'
import { CategoriesTable } from './components/categories-table'
import { CategoryStats } from './components/category-stats'
import CategoriesProvider from './context/categories-context'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

interface CategoryFilters {
  parentId: number | null
  rootOnly: boolean
}

export default function Categories() {
  const tableFilters = useOptimizedTableFilters<CategoryFilters>({
    searchDelay: 300,
    initialSearch: '',
    initialFilters: {
      parentId: null,
      rootOnly: false,
    },
  })

  const { data: categoriesResponse, isLoading, error } = useCategories({
    page: tableFilters.page,
    perPage: tableFilters.perPage,
    search: tableFilters.debouncedSearch,
    parentId: tableFilters.filters.parentId,
    rootOnly: tableFilters.filters.rootOnly,
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

        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 mt-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Category Management</h2>
            <p className='text-muted-foreground'>
              Organize your courses with categories and subcategories.
            </p>
          </div>
          <CategoriesPrimaryButtons />
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {error ? (
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
              isLoading={isLoading}
              pagination={{
                page: tableFilters.page,
                perPage: tableFilters.perPage,
                total: categoriesResponse?.meta.total || 0,
                lastPage: categoriesResponse?.meta.last_page || 1,
                onPageChange: tableFilters.setPage,
                onPerPageChange: tableFilters.setPerPage,
              }}
              filters={{
                search: tableFilters.search,
                parentId: tableFilters.filters.parentId,
                rootOnly: tableFilters.filters.rootOnly,
                onSearchChange: tableFilters.handleSearchChange,
                onParentIdChange: (value) => tableFilters.handleFilterChange('parentId', value),
                onRootOnlyChange: (value) => tableFilters.handleFilterChange('rootOnly', value),
              }}
            />
          )}
        </div>
      </Main>

      <CategoriesDialogs />
    </CategoriesProvider>
  )
}
