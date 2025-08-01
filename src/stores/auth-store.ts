import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  AuthService,
  User,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
} from '../services/auth'

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  getUser: () => Promise<void>
  changePassword: (passwords: ChangePasswordRequest) => Promise<void>
  refreshToken: () => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null })
        try {
          const response = await AuthService.login(credentials)
          const { user, token } = response.data

          // Store token and user in localStorage
          localStorage.setItem('auth_token', token)
          localStorage.setItem('user', JSON.stringify(user))

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: unknown) {
          const errorMessage =
            (error as ApiError).response?.data?.message || 'Login failed'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          })
          throw error
        }
      },

      register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null })
        try {
          // Get current tenant ID if available
          const tenantData = JSON.parse(localStorage.getItem('tenant') || '{}')
          const registerData = {
            ...userData,
            tenant_id: tenantData.id || userData.tenant_id,
          }

          const response = await AuthService.register(registerData)
          const { user, token } = response.data

          // Store token and user in localStorage
          localStorage.setItem('auth_token', token)
          localStorage.setItem('user', JSON.stringify(user))

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: unknown) {
          const errorMessage =
            (error as ApiError).response?.data?.message || 'Registration failed'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await AuthService.logout()
        } catch (_error) {
          // Even if logout fails on server, clear local state
          // Log error for debugging but don't throw
        } finally {
          // Clear localStorage including tenant-specific data
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          // Keep tenant data as user might want to login again for same tenant

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      },

      getUser: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await AuthService.getUser()
          set({
            user: response.data.user,
            isLoading: false,
            error: null,
          })
        } catch (error: unknown) {
          const errorMessage =
            (error as ApiError).response?.data?.message ||
            'Failed to fetch user'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw error
        }
      },

      changePassword: async (passwords: ChangePasswordRequest) => {
        set({ isLoading: true, error: null })
        try {
          await AuthService.changePassword(passwords)
          set({
            isLoading: false,
            error: null,
          })
        } catch (error: unknown) {
          const errorMessage =
            (error as ApiError).response?.data?.message ||
            'Failed to change password'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw error
        }
      },

      refreshToken: async () => {
        try {
          const response = await AuthService.refreshToken()
          const { user, token } = response.data

          // Store new token
          localStorage.setItem('auth_token', token)

          set({
            user,
            token,
            isAuthenticated: true,
            error: null,
          })
        } catch (error: unknown) {
          // If refresh fails, logout user
          get().logout()
          throw error
        }
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Initialize auth state on app load
export const initializeAuth = () => {
  const token = localStorage.getItem('auth_token')
  const store = useAuthStore.getState()

  if (token && !store.isAuthenticated) {
    // Try to get user data if token exists
    store.getUser().catch(() => {
      // If fetching user fails, clear auth state
      store.logout()
    })
  }
}
