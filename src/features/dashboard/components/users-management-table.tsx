import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/services/users'
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Clock,
  BookOpen,
  GraduationCap,
  DollarSign,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function UsersManagementTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users', page, search, roleFilter, statusFilter],
    queryFn: () =>
      usersService.getUsers(
        page,
        10,
        search,
        roleFilter === 'all' ? undefined : roleFilter,
        statusFilter === 'all' ? undefined : statusFilter
      ),
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant='default' className='bg-green-100 text-green-800'>
            Active
          </Badge>
        )
      case 'inactive':
        return <Badge variant='secondary'>Inactive</Badge>
      case 'suspended':
        return <Badge variant='destructive'>Suspended</Badge>
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant='default' className='bg-purple-100 text-purple-800'>
            Admin
          </Badge>
        )
      case 'instructor':
        return (
          <Badge variant='default' className='bg-blue-100 text-blue-800'>
            Instructor
          </Badge>
        )
      case 'student':
        return <Badge variant='outline'>Student</Badge>
      default:
        return <Badge variant='outline'>{role}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex gap-4'>
              <Skeleton className='h-10 w-64' />
              <Skeleton className='h-10 w-32' />
              <Skeleton className='h-10 w-32' />
            </div>
            <div className='space-y-3'>
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className='h-16 w-full' />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <div className='text-center text-red-500'>
            Failed to load users data
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Filters */}
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='relative flex-1'>
              <Search className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
              <Input
                placeholder='Search users...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-10'
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className='w-full sm:w-32'>
                <SelectValue placeholder='Role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Roles</SelectItem>
                <SelectItem value='admin'>Admin</SelectItem>
                <SelectItem value='instructor'>Instructor</SelectItem>
                <SelectItem value='student'>Student</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-full sm:w-32'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
                <SelectItem value='suspended'>Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className='w-10'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData?.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className='flex items-center space-x-3'>
                        <Avatar className='h-8 w-8'>
                          <AvatarFallback>
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{user.name}</p>
                          <p className='text-muted-foreground text-sm'>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <div className='flex items-center space-x-4'>
                        <div className='flex items-center space-x-1'>
                          <BookOpen className='text-muted-foreground h-4 w-4' />
                          <span className='text-sm'>
                            {user.enrolledCourses}
                          </span>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <GraduationCap className='h-4 w-4 text-green-600' />
                          <span className='text-sm'>
                            {user.completedCourses}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='space-y-1'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium'>
                            {user.progressPercentage}%
                          </span>
                        </div>
                        <Progress
                          value={user.progressPercentage}
                          className='h-2'
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center space-x-1'>
                        <DollarSign className='h-4 w-4 text-green-600' />
                        <span className='font-medium'>
                          {formatCurrency(user.totalSpent)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center space-x-1'>
                        <Clock className='text-muted-foreground h-4 w-4' />
                        <span className='text-sm'>
                          {formatDate(user.lastLogin)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem>
                            <Edit className='mr-2 h-4 w-4' />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCheck className='mr-2 h-4 w-4' />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserX className='mr-2 h-4 w-4' />
                            Suspend User
                          </DropdownMenuItem>
                          <DropdownMenuItem className='text-red-600'>
                            <Trash2 className='mr-2 h-4 w-4' />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {usersData?.meta && (
            <div className='flex items-center justify-between'>
              <div className='text-muted-foreground text-sm'>
                Showing{' '}
                {(usersData.meta.current_page - 1) * usersData.meta.per_page +
                  1}{' '}
                to{' '}
                {Math.min(
                  usersData.meta.current_page * usersData.meta.per_page,
                  usersData.meta.total
                )}{' '}
                of {usersData.meta.total} users
              </div>
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage(page + 1)}
                  disabled={page >= usersData.meta.last_page}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
