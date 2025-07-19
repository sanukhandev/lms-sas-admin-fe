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
    staleTime: 1000 * 60 * 2, // 2 minutes - shorter for more responsive updates
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  })
}

export function useUserStats() {
  return useQuery<UserStats>({
    queryKey: ['userStats'],
    queryFn: () => usersService.getUserStats(),
    staleTime: 1000 * 60 * 10, // 10 minutes for stats
    gcTime: 1000 * 60 * 15, // 15 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
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
