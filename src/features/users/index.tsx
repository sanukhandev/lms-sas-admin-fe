import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useUsers } from '@/hooks/use-users'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import { UserStats } from './components/user-stats'
import UsersProvider from './context/users-context'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function Users() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState<string>()
  const [role, setRole] = useState<string>()
  const [status, setStatus] = useState<string>()

  const { data: usersResponse, isLoading, error } = useUsers({
    page,
    perPage,
    search,
    role,
    status,
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
                  Failed to load users. Please try again.
                </div>
              </CardContent>
            </Card>
          ) : (
            <UsersTable 
              data={userList} 
              columns={columns}
              pagination={{
                page,
                perPage,
                total: usersResponse?.meta.total || 0,
                lastPage: usersResponse?.meta.last_page || 1,
                onPageChange: setPage,
                onPerPageChange: setPerPage,
              }}
              filters={{
                search,
                role,
                status,
                onSearchChange: setSearch,
                onRoleChange: setRole,
                onStatusChange: setStatus,
              }}
            />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
