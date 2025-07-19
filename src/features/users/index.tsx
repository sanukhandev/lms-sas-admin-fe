import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useUsers } from '@/hooks/use-users'
import { useOptimizedTableFilters } from '@/hooks/use-optimized-table-filters'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import { UserStats } from './components/user-stats'
import UsersProvider from './context/users-context'
import { Card, CardContent } from '@/components/ui/card'

interface UserFilters {
  role: string | undefined
  status: string | undefined
}

export default function Users() {
  const tableFilters = useOptimizedTableFilters<UserFilters>({
    searchDelay: 300,
    initialSearch: '',
    initialFilters: {
      role: undefined,
      status: undefined,
    },
  })

  const { data: usersResponse, isLoading, error } = useUsers({
    page: tableFilters.page,
    perPage: tableFilters.perPage,
    search: tableFilters.debouncedSearch,
    role: tableFilters.filters.role,
    status: tableFilters.filters.status,
  })

  const userList = usersResponse?.data || []

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        {/* User Statistics */}
        <UserStats />

        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {error ? (
            <Card>
              <CardContent className='pt-6'>
                <div className='text-center text-red-500'>
                  Failed to load users. Please try again.
                </div>
              </CardContent>
            </Card>
          ) : (
            <UsersTable 
              data={userList} 
              columns={columns}
              isLoading={isLoading}
              pagination={{
                page: tableFilters.page,
                perPage: tableFilters.perPage,
                total: usersResponse?.meta.total || 0,
                lastPage: usersResponse?.meta.last_page || 1,
                onPageChange: tableFilters.setPage,
                onPerPageChange: tableFilters.setPerPage,
              }}
              filters={{
                search: tableFilters.search,
                role: tableFilters.filters.role,
                status: tableFilters.filters.status,
                onSearchChange: (search?: string) => tableFilters.handleSearchChange(search || ''),
                onRoleChange: (value) => tableFilters.handleFilterChange('role', value),
                onStatusChange: (value) => tableFilters.handleFilterChange('status', value),
              }}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
