import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAuthStore, initializeAuth } from '@/stores/auth-store'
import { useTenantContext } from '@/context/tenant-context'
import { User, LoginRequest } from '@/services/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const authStore = useAuthStore()
  const { tenant } = useTenantContext()

  useEffect(() => {
    // Only initialize auth after tenant is loaded
    if (tenant) {
      initializeAuth()
    }
  }, [tenant])

  return (
    <AuthContext.Provider value={authStore}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
