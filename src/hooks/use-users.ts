import { useQuery } from '@tanstack/react-query'
import { usersService, type UserStats, type UsersResponse } from '@/services/users'

interface UseUsersParams {
  page?: number
  perPage?: number
  search?: string
  role?: string
  status?: string
}

export function useUsers(params: UseUsersParams = {}) {
  const { page = 1, perPage = 15, search, role, status } = params

  return useQuery<UsersResponse>({
    queryKey: ['users', page, perPage, search, role, status],
    queryFn: () => usersService.getUsers(page, perPage, search, role, status),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUserStats() {
  return useQuery<UserStats>({
    queryKey: ['userStats'],
    queryFn: () => usersService.getUserStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUserActivity(params: { page?: number; perPage?: number; userId?: number } = {}) {
  const { page = 1, perPage = 10, userId } = params

  return useQuery({
    queryKey: ['userActivity', page, perPage, userId],
    queryFn: () => usersService.getUserActivity(page, perPage, userId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
