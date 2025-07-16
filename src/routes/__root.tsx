import { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AuthProvider } from '@/context/auth-context'
import { TenantProvider } from '@/context/tenant-context'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { TenantLoader } from '@/components/tenant-loader'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  beforeLoad: async () => {
    // Redirect to appropriate page based on auth state
    if (window.location.pathname === '/') {
      const searchParams = new URLSearchParams(window.location.search)
      const tenantParam = searchParams.get('tenant')

      // Check if user is authenticated
      const token = localStorage.getItem('auth_token')
      const user = localStorage.getItem('user')

      if (token && user) {
        // User is authenticated, redirect to dashboard
        throw redirect({
          to: '/home',
          search: tenantParam ? { tenant: tenantParam } : undefined,
        })
      } else {
        // User is not authenticated, redirect to sign-in
        throw redirect({
          to: '/sign-in',
          search: tenantParam ? { tenant: tenantParam } : undefined,
        })
      }
    }
  },
  component: () => {
    return (
      <TenantProvider>
        <TenantLoader>
          <AuthProvider>
            <NavigationProgress />
            <Outlet />
            <Toaster duration={50000} />
            {import.meta.env.MODE === 'development' && (
              <>
                <ReactQueryDevtools buttonPosition='bottom-left' />
                <TanStackRouterDevtools position='bottom-right' />
              </>
            )}
          </AuthProvider>
        </TenantLoader>
      </TenantProvider>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
