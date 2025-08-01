import { ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useAuth } from '@/context/auth-context'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/sign-in' />
  }

  return <>{children}</>
}
