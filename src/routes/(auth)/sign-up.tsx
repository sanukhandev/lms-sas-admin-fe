import { createFileRoute, redirect } from '@tanstack/react-router'
import SignUp from '@/features/auth/sign-up'

export const Route = createFileRoute('/(auth)/sign-up')({
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
  component: SignUp,
})
