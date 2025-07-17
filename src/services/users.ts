import { api } from '@/lib/api'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'instructor' | 'student'
  status: 'active' | 'inactive' | 'suspended'
  enrolledCourses: number
  completedCourses: number
  progressPercentage: number
  lastLogin: string
  joinedAt: string
  totalSpent: number
}

export interface UserActivity {
  id: number
  userId: number
  activity: string
  timestamp: string
  courseId?: number
  courseName?: string
}

export interface UsersResponse {
  data: User[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  totalRevenue: number
  averageProgress: number
  topPerformers: User[]
}

export interface UserActivityResponse {
  data: UserActivity[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export const usersService = {
  async getUsers(
    page: number = 1,
    perPage: number = 15,
    search?: string,
    role?: string,
    status?: string
  ): Promise<UsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })

    if (search) params.append('search', search)
    if (role) params.append('role', role)
    if (status) params.append('status', status)

    const response = await api.get<UsersResponse>(
      `/v1/dashboard/users?${params.toString()}`
    )
    return response.data
  },

  async getUserStats(): Promise<UserStats> {
    const response = await api.get<UserStats>('/v1/dashboard/users/stats')
    return response.data
  },

  async getUserActivity(
    page: number = 1,
    perPage: number = 10,
    userId?: number
  ): Promise<UserActivityResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })

    if (userId) params.append('user_id', userId.toString())

    const response = await api.get<UserActivityResponse>(
      `/v1/dashboard/users/activity?${params.toString()}`
    )
    return response.data
  },

  async updateUserStatus(
    userId: number,
    status: 'active' | 'inactive' | 'suspended'
  ): Promise<void> {
    await api.patch(`/v1/dashboard/users/${userId}/status`, { status })
  },

  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/v1/dashboard/users/${userId}`)
  },
}
