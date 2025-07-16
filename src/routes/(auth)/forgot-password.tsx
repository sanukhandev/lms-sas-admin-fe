import { createFileRoute, redirect } from '@tanstack/react-router'
import ForgotPassword from '@/features/auth/forgot-password'

export const Route = createFileRoute('/(auth)/forgot-password')({
  beforeLoad: async () => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('user')

    if (token && user) {
      // User is already authenticated, redirect to dashboard
      throw redirect({
        to: '/home',
      })
    }
  },
  component: ForgotPassword,
})
